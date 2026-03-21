# Healthcare Management System — Minimal Requirements Documentation
React (TypeScript) frontend + .NET (ASP.NET Core) backend

This document specifies the minimum set of features, data models, endpoints, roles, and flows required to implement the described healthcare system. It is intended as a blueprint, not a full implementation.

## 1) Scope and Actors
Actors:
- Doctor: Login, view personal info, view appointments, access patient by NHCN, issue prescription, view medical history.
- Patient: Login, view personal info, view prescription history, select pharmacy for a prescription, see pharmacy list, track prescription state.
- Pharmacy: Login, manage stock (CRUD medications), view unassigned prescriptions via NHCN, reserve/fulfill prescriptions, recalculate stock, send notification to patient on updates.

Out of scope (optional): Lab results.

Core constraint:
- NIN is never used or exposed beyond registration. Doctors access patients via NHCN only.

## 2) Roles and Access Control
Authentication: JWT-based, role-based authorization. Claims include `role`, `userId`, and (for patients) `patientId`.

Roles:
- Doctor
- Patient
- Pharmacy

Authorization policy highlights:
- Doctor can read/write prescriptions for patients they access via NHCN.
- Patient can read own prescriptions, select pharmacy for own prescriptions, cannot issue prescriptions.
- Pharmacy can manage own stock, view prescriptions assigned to them, fulfill them, and send notifications to the owning patient.

## 3) Domain Model (Minimum)

### User (base)
- UserId (PK, int)
- Email (unique)
- PasswordHash
- Role (enum: Doctor, Patient, Pharmacy)
- Phone
- CreatedAt

### Doctor
- DoctorId (PK, int, FK to User)
- fNameLat
- lNameLat
- fNameAr
- lNameAr
- Nationalite
- NIN (stored hashed; never exposed)
- Profile fields (optional)
- ClinicLocation (lat, lng) — used to calculate distances to pharmacies for recommendations

### Patient
- PatientId (PK, int, FK to User)
- fNameLat
- lNameLat
- fNameAr
- lNameAr
- Nationalite
- NIN (stored hashed; never exposed)
- NHCN (16-char, deterministic from NIN+secret; stored)
- Address (string)
- Location (lat, lng)
- DateOfBirth (optional)

### Pharmacy
- PharmacyId (PK, int, FK to User)
- Name
- Address
- Location (lat, lng)
- ContactInfo

### Medicine
- MedicineId (PK, int)
- Name
- Form (tablet, capsule, solution, etc.)
- Strength (e.g., 500mg)
- Notes (optional)
- IsActive

### PharmacyInventory
- PharmacyInventoryId (PK, int)
- PharmacyId (FK)
- MedicineId (FK)
- QuantityAvailable (int)
- LastUpdated

### Appointment (Minimum for Doctor view)
- AppointmentId (PK, int)
- DoctorId (FK)
- PatientId (FK)
- ScheduledAt (DateTime)
- Status (enum: Scheduled, Completed, Cancelled)
- Notes (optional)

### Prescription (Parent)
- PrescriptionId (PK, int)
- DateIssued (DateTime)
- DoctorId (FK)
- PatientId (FK)
- PharmacyId (FK, nullable — set only when patient selects a pharmacy)
- Status (enum: Draft, Issued, Reserved, Purchased, Cancelled, Expired)
- Notes (optional)

### PrescriptionItem (Child)
- PrescriptionItemId (PK, int)
- PrescriptionId (FK)
- MedicineId (FK, nullable)
- Name (string)
- Dose (string)
- Frequency (string)
- Duration (string)
- Notes (string, optional)
- Type (enum: Medication, OxygenTherapy, SoinLocaux, Inhalation, Injection)

### Notification
- NotificationId (PK, int)
- RecipientPatientId (FK)
- PrescriptionId (FK)
- Type (enum: PrescriptionAssigned, PrescriptionReserved, PrescriptionPurchased, StockUnavailable, General)
- Message
- IsRead (bool)
- CreatedAt (DateTime)

## 4) Authentication and Registration

### Registration
- Doctor registration via POST /api/auth/register/doctor
- Patient registration via POST /api/auth/register/patient (generates NHCN)
- Pharmacy registration via POST /api/auth/register/pharmacy

Example: Create new Doctor (payload provided)
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
  "role": "Doctor"
}
```

Constraints:
- NIN accepted at registration only and stored hashed.
- NHCN generated at patient registration and persisted.

### Login
- POST /api/auth/login with `email` and `password`. Response includes JWT and role info.

### JWT Claims (minimum)
- sub: userId
- role: Doctor | Patient | Pharmacy
- doctorId/patientId/pharmacyId (one present depending on role)

## 5) NHCN Specification
- 16-character alphanumeric derived from SHA-256(NIN + SYSTEM_SECRET).substring(0, 16).
- Deterministic, non-reversible. Never display NIN; never accept NIN for login.

Configuration:
```json
{
  "NHCN": {
    "Secret": "healthcare-system-secret-key-2026-national-health-care"
  }
}
```

Usage:
- Doctor enters NHCN to access a patient record.
- Pharmacy may use NHCN to look up a patient’s prescription during in-person purchase.

## 6) RecommandedLocationMedicalAvailability (RLMA)
Purpose: Recommend nearest pharmacy that can fulfill a prescription considering availability of all items.

Inputs:
- Patient Location (lat, lng) or ClinicLocation if visit occurred there.
- Prescription items (medicines with quantities or qualitative items).
- Search radius (meters/kilometers).
- Availability policy: “full availability preferred; otherwise rank partial availability.”

Algorithm (minimum):
1. Resolve patient location (fallback to clinic location).
2. Fetch pharmacies within radius.
3. For each pharmacy:
   - For each PrescriptionItem with MedicineId:
     - Check inventory QuantityAvailable >= required quantity (if quantity tracked; otherwise availability boolean).
   - Compute:
     - `availabilityScore = itemsAvailable / totalMedicineItems`
     - Distance via Haversine formula between patient and pharmacy.
4. Rank pharmacies:
   - First by `availabilityScore` desc
   - Then by `distance` asc
5. Return:
   - Best full availability pharmacy if exists.
   - Otherwise top-k partial availability options with missing items list.

Endpoint:
- GET /api/recommendations/prescriptions/{prescriptionId}?lat={lat}&lng={lng}&radiusKm={r}&topK={k}
Response includes ranked pharmacies, availability details, and distance.

## 7) Prescription Life Cycle (State Machine)
- Draft: Created by doctor, editable.
- Issued: Finalized by doctor; visible to patient.
- Reserved: Patient selects a pharmacy (PharmacyId set). Pharmacy acknowledges reservation.
- Purchased: Pharmacy sells; stock decremented; patient notified.
- Cancelled: Patient cancels before purchase or stock permanently unavailable.
- Expired: System marks after policy (e.g., 7 days).

Transitions:
- Doctor: Draft -> Issued
- Patient: Issued -> Reserved (select pharmacy)
- Pharmacy: Reserved -> Purchased (on sale), or Reserved -> Cancelled (cannot fulfill)
- System: Issued -> Expired (policy), Reserved -> Expired (policy)

## 8) API Design (Minimum)
Base URL: `/api`

### Auth
- POST /auth/register/doctor
- POST /auth/register/patient
- POST /auth/register/pharmacy
- POST /auth/login
- POST /auth/refresh (optional)

### Users
- GET /me (role-aware; returns profile for current user)

### Patients (Doctor-facing)
- GET /patients/by-nhcn/{nhcn}  // doctor lookup
- GET /patients/{patientId}/history  // prescriptions history

### Appointments (Doctor)
- GET /appointments?doctorId=me&status=Scheduled|Completed
- POST /appointments  // optional minimal create

### Prescriptions
- POST /prescriptions  // doctor creates Draft
  - Body:
  ```json
  {
    "doctorId": 123,
    "patientId": 456,
    "notes": "Optional notes",
    "items": [
      {
        "medicineId": 10,
        "name": "Amoxicillin",
        "dose": "500mg",
        "frequency": "3 times daily",
        "duration": "7 days",
        "notes": "",
        "type": "Medication"
      }
    ]
  }
  ```
- PUT /prescriptions/{id}/issue  // Draft -> Issued
- GET /prescriptions/{id}
- GET /patients/{patientId}/prescriptions  // patient history
- PUT /prescriptions/{id}/select-pharmacy  // patient-only: set PharmacyId
  - Body: `{ "pharmacyId": 789 }`
- PUT /prescriptions/{id}/reserve  // pharmacy acknowledges reservation
- PUT /prescriptions/{id}/purchase  // pharmacy completes sale
- PUT /prescriptions/{id}/cancel
- GET /pharmacies/{pharmacyId}/prescriptions?status=Reserved|Purchased  // pharmacy view

### RLMA Recommendation
- GET /recommendations/prescriptions/{prescriptionId}?lat={lat}&lng={lng}&radiusKm={r}&topK={k}

### Pharmacy Inventory
- GET /pharmacies/{pharmacyId}/inventory
- POST /pharmacies/{pharmacyId}/inventory
  - Body:
  ```json
  {
    "medicineId": 10,
    "quantityAvailable": 50
  }
  ```
- PUT /pharmacies/{pharmacyId}/inventory/{inventoryId}  // update quantity
- DELETE /pharmacies/{pharmacyId}/inventory/{inventoryId}

### Notifications
- GET /notifications?patientId=me
- POST /notifications  // system/pharmacy triggers patient alerts (e.g., purchase completed)

### Error Model
Consistent error response:
```json
{
  "error": "ValidationError",
  "message": "Field X is required",
  "details": { "field": "X" }
}
```

## 9) Frontend (React + TypeScript) — Minimum Pages and Routes

Routing (role-gated):
- `/login` — Email/password login
- Doctor:
  - `/doctor/profile` — View personal info
  - `/doctor/appointments` — List
  - `/doctor/patients/search` — Enter NHCN to find patient
  - `/doctor/prescriptions/new` — Create Draft and Items
  - `/doctor/prescriptions/:id` — Review and Issue
  - `/doctor/patients/:patientId/history` — Medical history
- Patient:
  - `/patient/profile` — Personal info
  - `/patient/prescriptions` — History and state
  - `/patient/prescriptions/:id/select-pharmacy` — Choose pharmacy (map/list, distance)
  - `/pharmacies` — List of pharmacies and details
- Pharmacy:
  - `/pharmacy/profile`
  - `/pharmacy/inventory` — CRUD meds
  - `/pharmacy/prescriptions` — Reserved and Purchased
  - `/pharmacy/lookup` — Lookup unassigned by NHCN (if supporting in-person flow)

Minimal frontend concerns:
- Auth guard per route using role from JWT.
- Forms: React Hook Form for validation.
- Data fetching: React Query or Axios + simple state.
- Map/distance display: basic list with distance values; map optional.
- i18n: Arabic/Latin names; support RTL UI (minimal).

## 10) Backend (ASP.NET Core) — Minimal Architecture

Layers:
- API (Controllers)
- Application (Services, DTOs, validation)
- Domain (Entities, Enums)
- Infrastructure (EF Core, Identity, JWT, Repositories)
- Configuration (appsettings for NHCN secret, JWT)

Key services:
- AuthService: register/login, password hashing, JWT issuance.
- NHCNService: deterministic 16-char generation and validation.
- PrescriptionService: create/issue/select pharmacy/reserve/purchase/cancel; state transitions validated.
- RLMAService: recommendation algorithm using Haversine distance.
- InventoryService: CRUD and stock decrement on purchase.
- NotificationService: patient notifications.

Security:
- Role-based policies: `[Authorize(Roles = "Doctor")]`, etc.
- Input validation and model binding; Prevent over-posting.
- Never return NIN; store hashed NIN only.

## 11) Database Schema (Minimum Tables)
- Users
- Doctors (FK: Users)
- Patients (FK: Users)
- Pharmacies (FK: Users)
- Medicines
- PharmacyInventories
- Appointments
- Prescriptions
- PrescriptionItems
- Notifications

Indexes:
- Users.Email (unique)
- Patients.NHCN (unique)
- PharmacyInventory (PharmacyId, MedicineId) unique composite
- Prescriptions (PatientId, DateIssued)

## 12) Core Flows

### Doctor Issues Prescription
1. Doctor logs in.
2. Searches patient by NHCN.
3. Creates Draft prescription with items.
4. Issues prescription (Draft -> Issued).
5. Patient notified.

### Patient Selects Pharmacy
1. Patient logs in, views Issued prescription.
2. Calls RLMA endpoint to see nearest pharmacies with availability.
3. Chooses pharmacy (sets PharmacyId). Status -> Reserved.
4. Pharmacy notified (optional).

### Pharmacy Fulfills Prescription
1. Pharmacy sees Reserved prescriptions assigned to them.
2. Confirms sale: decrement inventory; Status -> Purchased.
3. System sends notification to patient.

Edge Cases:
- Partial availability: allow patient to choose pharmacy with partial availability; pharmacy may cancel or propose alternative.
- Expiry: system sets Expired after policy.

## 13) Validation Rules (Minimum)
- Registration: Email unique, strong password, NIN non-empty. NIN stored hashed.
- NHCN: 16-char upper-case alphanumeric; unique per patient.
- Prescription: Must have at least one item; doctorId and patientId required.
- Item Type values limited to: Medication, OxygenTherapy, SoinLocaux, Inhalation, Injection.
- Inventory: QuantityAvailable >= 0.
- Transitions: Only allowed per role and current state.

## 14) RLMA Details
Distance calculation: Haversine on lat/lng (meters or km).
Availability definition:
- Full availability: all medicine items with MedicineId present and sufficient quantity.
- Partial availability: missing or insufficient items listed per pharmacy.
Response payload example:
```json
{
  "prescriptionId": 123,
  "locationUsed": { "lat": 36.75, "lng": 3.06 },
  "radiusKm": 10,
  "recommendations": [
    {
      "pharmacyId": 789,
      "name": "City Pharmacy",
      "distanceKm": 1.2,
      "availabilityScore": 1.0,
      "missingItems": []
    },
    {
      "pharmacyId": 790,
      "name": "Boulevard Pharmacy",
      "distanceKm": 0.8,
      "availabilityScore": 0.67,
      "missingItems": ["Amoxicillin 500mg"]
    }
  ]
}
```

## 15) Notifications (Minimum)
Events:
- Prescription Issued (to Patient)
- Pharmacy Reserved (to Patient)
- Purchased (to Patient)
Transport (minimum):
- Store in DB for in-app display (`GET /notifications?patientId=me`).
- Optional email/SMS later.

## 16) Error and Security Considerations
- Protect endpoints with role policies.
- Rate limit sensitive lookups (e.g., NHCN).
- Never return NIN; only NHCN and patient profile data allowed.
- Audit log: who issued, who purchased, timestamps.

## 17) Acceptance Checklist (Minimum)
- Auth works for 3 roles; JWT includes correct claims.
- Doctor can issue prescription for patient via NHCN.
- Patient can see prescriptions and select pharmacy.
- RLMA returns ranked pharmacies with availability and distance.
- Pharmacy can CRUD inventory and fulfill prescriptions; stock decremented.
- Prescription state transitions enforced and visible in UI.
- Notifications appear for patient on key events.
- NHCN generated deterministically and stored; NIN never exposed.

## 18) Environment and Configuration
- Backend:
  - JWT secret
  - NHCN secret
  - Database connection string
- Frontend:
  - API base URL
  - Map provider optional (if needed)

## 19) Minimal UI Data Contracts (Frontend Expectations)
- Doctor Profile:
```json
{ "doctorId": 1, "fNameLat": "Sara", "lNameLat": "Admin", "email": "sara.admin1@example.com" }
```
- Patient Summary:
```json
{ "patientId": 456, "nhcn": "A9F3C21B8E74D512", "nameLat": "Ali Ahmed" }
```
- Prescription Summary:
```json
{
  "prescriptionId": 123,
  "status": "Issued",
  "dateIssued": "2026-01-09T10:15:00Z",
  "doctorName": "Sara Admin",
  "pharmacy": null,
  "items": [
    { "name": "Amoxicillin", "dose": "500mg", "frequency": "3 times daily", "duration": "7 days", "type": "Medication" }
  ]
}
```

---

This document defines a minimal, secure, role-based system with the required flows and endpoints for doctor, patient, and pharmacy, including the NHCN mechanism and the recommendation engine for nearby pharmacy availability.