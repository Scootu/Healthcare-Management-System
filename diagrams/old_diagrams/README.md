# Healthcare System Class Diagrams

This directory contains UML class diagrams for the Healthcare Management System.

## Files

### 1. class-diagram.puml
The complete class diagram including all entities, relationships, and services.

**Components:**
- **Enums**: Role, AppointmentStatus, PrescriptionStatus, PrescriptionItemType, NotificationType
- **User Hierarchy**: User (base), Doctor, Patient, Pharmacy
- **Core Entities**: Address, Medicine, PharmacyInventory, Appointment, Prescription, PrescriptionItem, Notification
- **Services**: AuthService, NHCNService, PrescriptionService, RLMAService, InventoryService, NotificationService
- **DTOs**: PharmacyRecommendation

**Key Relationships:**
- User inheritance pattern for role-based actors
- Address entity linked to all user types (Google Maps compatible)
- Prescription lifecycle managed through status enum
- Many-to-many relationship between Pharmacy and Medicine via PharmacyInventory
- Prescription contains multiple PrescriptionItems (composition)

### How to View the Diagrams

#### Option 1: VS Code with PlantUML Extension
1. Install "PlantUML" extension in VS Code
2. Open the `.puml` file
3. Press `Alt+D` to preview

#### Option 2: Online PlantUML Viewer
1. Go to http://www.plantuml.com/plantuml/uml/
2. Copy the contents of the `.puml` file
3. Paste and view

#### Option 3: Export to Image
Using PlantUML command line:
```bash
plantuml class-diagram.puml
```
This generates a PNG image.

## Diagram Highlights

### User Model
- **Base User**: Common authentication fields (Email, PasswordHash, Phone)
- **Doctor**: Can access patients via NHCN, issue prescriptions
- **Patient**: Has unique NHCN (16-char), can select pharmacy
- **Pharmacy**: Manages inventory, fulfills prescriptions

### Address System (Google Maps Compatible)
- Stores both local administrative data (Wilaya, Province, Commune) and Google Maps data (PlaceId, Lat/Lng)
- Supports distance calculation using Haversine formula
- Each user can have multiple addresses

### Prescription Flow
```
Draft → Issued → Reserved → Purchased
           ↓         ↓
      Cancelled  Expired
```

### RLMA (Recommendation System)
The `RLMAService` ranks pharmacies based on:
1. Availability score (0.0 - 1.0)
2. Distance from patient/clinic (Haversine)
3. Returns `PharmacyRecommendation` objects with missing items list

### Security Features
- NIN stored hashed only (never exposed)
- NHCN deterministically generated from NIN + secret
- Role-based access control via JWT
- Password hashing via AuthService

## Database Schema Implications

### Primary Keys (PK)
All entities have integer primary keys ending in "Id"

### Foreign Keys (FK)
- Doctor, Patient, Pharmacy → User (UserId)
- Address → User (UserId)
- Appointment → Doctor, Patient
- Prescription → Doctor, Patient, Pharmacy (nullable)
- PrescriptionItem → Prescription, Medicine (nullable)
- PharmacyInventory → Pharmacy, Medicine
- Notification → Patient, Prescription

### Unique Constraints
- User.Email
- Patient.NHCN
- PharmacyInventory(PharmacyId, MedicineId) - composite

## Implementation Notes

### State Transitions (Prescription)
- Only specific roles can trigger transitions
- Validated in `PrescriptionService.ValidateTransition()`
- System can auto-expire based on policy

### Distance Calculation
- Uses Haversine formula in `Address.CalculateDistance()`
- Earth radius: 6371.0088 km
- Input: WGS84 lat/lng coordinates

### NHCN Generation
```
NHCN = SHA256(NIN + SECRET).substring(0, 16).toUpperCase()
```
- Deterministic and non-reversible
- 16 alphanumeric characters
- Generated once at patient registration

## API Endpoints Mapping

The services in this diagram map to REST API endpoints:

| Service | Endpoints |
|---------|-----------|
| AuthService | `/api/auth/register/*`, `/api/auth/login` |
| PrescriptionService | `/api/prescriptions/*` |
| RLMAService | `/api/recommendations/prescriptions/{id}` |
| InventoryService | `/api/pharmacies/{id}/inventory/*` |
| NotificationService | `/api/notifications` |

## Related Documentation
- [HealthcareSystemSpec.md](../HealthcareSystemSpec.md) - Complete system specification
- [AddressSpec.md](../AddressSpec.md) - Address entity and distance calculation details
