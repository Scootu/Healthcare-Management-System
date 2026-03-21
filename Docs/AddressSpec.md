# Address Entity and Location Handling (Google Maps Compatible)

This document replaces the former `ClinicLocation (lat, lng)` field with a normalized `Address` entity that is compatible with Google Maps APIs and defines how to compute distance between a clinic (doctor) address and a pharmacy address.

## 1) Purpose
- Standardize addresses across Doctor, Patient, and Pharmacy using a single `Address` entity.
- Ensure compatibility with Google Maps (Places/Geocoding) by storing `placeId`, `formattedAddress`, and `lat/lng`.
- Provide a deterministic way to compute distance ("length") between clinic and pharmacy locations used by the recommendation system.

## 2) Address Entity (Minimal)
Fields (minimum viable set):

- AddressId: int (PK) — Primary key
- Wilaya: string — Province/state (administrative region)
- Province: string — Province within wilaya
- Commune: string — Commune/municipality
- Rue: string — Street name
- NumMaison: int — House number
- UserId: int (FK) — Foreign key to User (Doctor/Patient/Pharmacy)
- PlaceId: string — Google Maps Place ID (stable identifier)
- FormattedAddress: string — Canonical address as returned by Google API
- Lat: number — Latitude (WGS84)
- Lng: number — Longitude (WGS84)

Notes:
- `Wilaya/Province/Commune/Rue/NumMaison` capture local administrative structure.
- `PlaceId` and `FormattedAddress` ensure consistency with Google Places.
- `Lat/Lng` enable distance computation without additional API calls.

### JSON Example (Doctor Address)
```json
{
  "addressId": 101,
  "wilaya": "Algiers",
  "province": "Sidi M'Hamed",
  "commune": "Sidi M'Hamed",
  "rue": "Rue Didouche Mourad",
  "numMaison": 12,
  "userId": 2001,
  "placeId": "ChIJh2xZkQ5KjRIRdFAPwHcPvGg",
  "formattedAddress": "12 Rue Didouche Mourad, Sidi M'Hamed, Algiers, Algeria",
  "lat": 36.7525,
  "lng": 3.04197
}
```

### JSON Example (Pharmacy Address)
```json
{
  "addressId": 305,
  "wilaya": "Algiers",
  "province": "Hydra",
  "commune": "Hydra",
  "rue": "Rue des Fusillés",
  "numMaison": 44,
  "userId": 3010,
  "placeId": "ChIJb7qVfB9KjRIRHq2Jgk3y1w8",
  "formattedAddress": "44 Rue des Fusillés, Hydra, Algiers, Algeria",
  "lat": 36.7458,
  "lng": 3.0493
}
```

## 3) Google Maps Compatibility

### Acceptable Sources
- Place Autocomplete → Place Details (front-end): captures `place_id`, `formatted_address`, `geometry.location.lat/lng`.
- Geocoding API: converts free-form address to `lat/lng` and `place_id`.

### Storage Rules
- Persist `placeId`, `formattedAddress`, `lat`, `lng`.
- Persist local fields (`Wilaya`, `Province`, `Commune`, `Rue`, `NumMaison`) to support local queries and administrative reporting.
- If `placeId` is missing, store `lat/lng` from Geocoding results and set `formattedAddress`.

### Mapping Hints (from Google address_components)
- Wilaya: `administrative_area_level_1`
- Province: `administrative_area_level_2` (or level_3 depending on country mapping)
- Commune: `locality` or `sublocality` (choose the one matching local admin structure)
- Rue: `route`
- NumMaison: `street_number`

Front-end should parse `address_components` and populate local fields where available; back-end can validate and fill blanks with `formatted_address`.

## 4) Distance ("Length") Calculation Between Clinic and Pharmacy

Use the Haversine formula with WGS84 lat/lng stored in the Address entity.

### Inputs
- Clinic: `LatC`, `LngC` from Doctor’s Address
- Pharmacy: `LatP`, `LngP` from Pharmacy’s Address
- Units: kilometers (km) or meters (m)

### Formula (Haversine)
- R = 6371.0088 km (mean Earth radius)
- Convert degrees to radians: `rad = deg * π / 180`
- `dLat = rad(LatP - LatC)`
- `dLng = rad(LngP - LngC)`
- `a = sin²(dLat/2) + cos(rad(LatC)) * cos(rad(LatP)) * sin²(dLng/2)`
- `c = 2 * atan2(√a, √(1−a))`
- `distanceKm = R * c`
- `distanceMeters = distanceKm * 1000`

### Example Result
Given clinic (36.7525, 3.04197) and pharmacy (36.7458, 3.0493):
- distanceKm ≈ 0.98 km
- distanceMeters ≈ 980 m

### Contract-level Function Signatures (Documentation Only)
C# (service-level):
```csharp
double ComputeDistanceKm(double latA, double lngA, double latB, double lngB);
```

TypeScript (frontend utility):
```ts
export function computeDistanceKm(latA: number, lngA: number, latB: number, lngB: number): number;
```

## 5) API Contracts (Minimal)

### Address CRUD
- GET /api/addresses/{addressId}
- POST /api/addresses
  - Body: Address JSON (above)
- PUT /api/addresses/{addressId}
- DELETE /api/addresses/{addressId}

### Linking Addresses
- Doctor: `Doctors.AddressId` (nullable initially, required for clinic-based recommendations)
- Pharmacy: `Pharmacies.AddressId` (required)
- Patient: `Patients.AddressId` (optional but recommended for patient-centric recommendations)

### Recommendation Input Change
Replace previous `ClinicLocation (lat, lng)` reference:

- GET /api/recommendations/prescriptions/{prescriptionId}?radiusKm={r}&topK={k}
  - Source location resolution order:
    1) Patient Address (if visit occurred at patient’s location)
    2) Doctor Address (clinic) if available
    3) Fallback: explicit lat/lng query params
  - Each candidate pharmacy must have an `Address` with `lat/lng` for distance computation.

## 6) Validation Rules
- `placeId`, `lat`, `lng`, and `formattedAddress` must be consistent when provided by Google.
- `lat` ∈ [-90, 90], `lng` ∈ [-180, 180].
- `NumMaison` ≥ 0.
- Ensure unique Address per `(UserId, Rue, NumMaison)` when appropriate (optional business rule).
- On update, if `placeId` changes, refresh `formattedAddress` and `lat/lng`.

## 7) Registration Payload Updates

### Doctor Registration (with Address)
```json
{
  "fNameLat": "Sara",
  "lNameLat": "Admin",
  "fNameAr": "سارة",
  "lNameAr": "أدمن",
  "nationalite": "Algerian",
  "phone": "+213777777777",
  "nin": "987654321012345",
  "email": "sara.admin1@example.com",
  "password": "AdminPass123!",
  "role": "Doctor",
  "address": {
    "wilaya": "Algiers",
    "province": "Sidi M'Hamed",
    "commune": "Sidi M'Hamed",
    "rue": "Rue Didouche Mourad",
    "numMaison": 12,
    "placeId": "ChIJh2xZkQ5KjRIRdFAPwHcPvGg",
    "formattedAddress": "12 Rue Didouche Mourad, Sidi M'Hamed, Algiers, Algeria",
    "lat": 36.7525,
    "lng": 3.04197
  }
}
```

### Pharmacy Registration (with Address)
```json
{
  "name": "City Pharmacy",
  "phone": "+213770000000",
  "email": "city.pharmacy@example.com",
  "password": "PharmaSecure123!",
  "role": "Pharmacy",
  "address": {
    "wilaya": "Algiers",
    "province": "Hydra",
    "commune": "Hydra",
    "rue": "Rue des Fusillés",
    "numMaison": 44,
    "placeId": "ChIJb7qVfB9KjRIRHq2Jgk3y1w8",
    "formattedAddress": "44 Rue des Fusillés, Hydra, Algiers, Algeria",
    "lat": 36.7458,
    "lng": 3.0493
  }
}
```

## 8) Integration with RLMA
- Availability scoring remains unchanged.
- Distance is computed using the stored `Address.lat/lng`.
- Ranking: `availabilityScore` desc, then `distanceKm` asc.
- Return `placeId` and `formattedAddress` for display and map linking.

## 9) Notes and Constraints
- Google API keys must be secured; front-end should use Places Autocomplete/Details to prevent manual lat/lng entry errors.
- Avoid reverse geocoding for every request; store `placeId`, `lat/lng` at registration/update time.
- If the clinic operates multiple branches, model multiple `Address` records linked to the doctor; the active clinic address can be selected contextually per appointment.

---

This specification replaces the previous `ClinicLocation (lat, lng)` field with a robust `Address` entity and details how to compute the distance between clinic and pharmacy using Google-compatible data.