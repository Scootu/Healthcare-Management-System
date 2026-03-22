# PRD_HealthCare

Version: 1.0
Status: Draft (Editable)
Owner: Product + Engineering
Last Updated: 2026-03-22

## 1. Product Summary
Healthcare Management System is a role-based platform connecting Doctors, Patients, and Pharmacies.

This PRD defines the target product behavior and implementation requirements for:
- Secure multi-role authentication and profile management.
- Prescription lifecycle management.
- Pharmacy inventory management.
- Address normalization with geolocation.
- RLMA (Recommended Location Medical Availability): recommend pharmacies based on medicine availability and distance.

## 2. Problem Statement
Current and planned workflows require a unified process where:
- Doctors prescribe medicines quickly and safely.
- Patients can find pharmacies that can fulfill prescriptions.
- Pharmacies can manage stock and update prescription state.

Without a complete recommendation and stock-aware workflow, patients may select pharmacies that cannot fulfill prescriptions, increasing delay and operational friction.

## 3. Goals and Objectives
### Business Goals
- Improve patient fulfillment success rate for prescriptions.
- Reduce time from prescription issuance to purchase.
- Increase pharmacy operational efficiency through inventory visibility.

### Product Goals
- Deliver a complete role-based workflow from registration to prescription purchase.
- Provide reliable pharmacy recommendations ranked by availability and distance.
- Ensure secure handling of sensitive identity data (NIN never exposed).

### Success Metrics (KPIs)
- Recommendation adoption rate: >= 70 percent of eligible prescriptions.
- Full-fill recommendation success (all items available at selected pharmacy): >= 60 percent.
- Median time from Issued to Purchased reduced by >= 30 percent from baseline.
- Pharmacy stock update latency: <= 2 seconds for CRUD operations.
- API success rate for core endpoints: >= 99 percent (excluding client/network errors).

## 4. Scope
### In Scope (MVP + Priority Enhancements)
- Role-based login and registration for Doctor, Patient, Pharmacy.
- NIN-based patient lookup by Doctor.
- Doctor prescription creation, edit (Draft), and issue.
- Patient prescription history and pharmacy selection.
- Pharmacy inventory CRUD and prescription fulfillment actions.
- Address entity with latitued and Lng
- RLMA endpoint and UI listing pharmacies by:
  1. Availability score (descending)
  2. Distance (ascending)
- Notifications for prescription state changes.

### Out of Scope (for this PRD release)
- Lab results and laboratory workflows.
- Payment gateway integration.
- Multi-branch optimization for enterprise pharmacy chains beyond single default address.
- Advanced analytics dashboards beyond basic operational KPIs.

## 5. Users and Personas
### Doctor
Needs to find a patient by NIN, review history, create and issue prescriptions.

### Patient
Needs to track prescriptions and choose a pharmacy likely to fulfill the full order quickly.

### Pharmacy
Needs to register, maintain stock, view assigned prescriptions, reserve/purchase, and notify patients.

## 6. User Stories and Acceptance Criteria
### US-01: Pharmacy Registration
As a Pharmacy user, I want to register with full address and location so I can appear in recommendation results.

Acceptance Criteria:
- Registration form accepts pharmacy name, email, password, phone, and address fields.
- Address supports wilaya, province, commune, rue, numMaison, formattedAddress, lat, lng
- Successful registration creates a pharmacy account and associated address.
- Validation errors are shown for missing/invalid required fields.

### US-02: Doctor Creates and Issues Prescription
As a Doctor, I want to create draft prescriptions and issue them to patients.

Acceptance Criteria:
- Doctor can create draft prescription with one or more items.
- Doctor can edit draft before issuing.
- Only Draft can transition to Issued.
- Issued prescription is visible to the target patient.

### US-03: Patient Selects Pharmacy
As a Patient, I want to choose a pharmacy from ranked recommendations.

Acceptance Criteria:
- Patient can open recommendation list from a prescription.
- List displays distance, availability score, and missing items (if partial).
- Selecting pharmacy updates prescription status to Reserved and stores PharmacyId.

### US-04: Pharmacy Manages Inventory
As a Pharmacy user, I want to add/update/remove medicines in stock.

Acceptance Criteria:
- Pharmacy can create, update, and delete inventory entries.
- Quantity updates are reflected in availability checks immediately.
- Inventory operations are restricted to owner pharmacy.

### US-05: RLMA Recommendation Ranking
As a Patient, I want recommendations that prioritize pharmacies that can fulfill all medicines.

Acceptance Criteria:
- Recommendations are generated for a prescription with configurable radius and topK.
- Ranking is by availabilityScore desc, then distance asc.
- Full-availability pharmacies appear before partial/empty results.
- Response includes missing medicines for partial results.

### US-06: Notifications
As a Patient, I want status notifications when my prescription state changes.

Acceptance Criteria:
- Notifications are generated for Reserved, Purchased, Cancelled, and unavailable cases.
- Patient can fetch notifications list.

## 7. Functional Requirements
### 7.1 Authentication and Authorization
- JWT authentication with role claims.
- Roles: Doctor, Patient, Entriprise (pharmcy, hospital).
- Resource access must enforce owner/role constraints.

### 7.2 Identity and Patient Lookup
- NIN used to login / pharmacy 

### 7.3 Address Model
- Introduce normalized Address entity.
- Required geospatial fields for recommendation: lat, lng.

### 7.4 Prescription Lifecycle
States:
- Purchased
- Reserved
- Created


Allowed transitions:
- Doctor: Created
- Patient: Reserved (select pharmacy)
- Pharmacy/hospital: Reserved -> Purchased or Cancelled

### 7.5 RLMA Algorithm
Input:
- PrescriptionId
- Source location (patient address preferred, fallback doctor address, optional query lat/lng)
- radiusKm, topK

Processing:
- Fetch pharmacies in radius.
- For each pharmacy, evaluate availability for each prescription medicine item.
- Compute availabilityScore = availableItems / totalItems.
- Compute distance using Haversine formula.
- Sort by availabilityScore desc then distance asc.

Output:
- Ranked pharmacies list.
- distanceKm, availabilityScore, available/missing items breakdown.
- Recommendation category: FULL, PARTIAL, EMPTY.

### 7.6 Inventory and Fulfillment
- Pharmacy inventory supports CRUD with quantity tracking.
- Purchase operation decrements stock and updates prescription state.
- Out-of-stock actions can trigger cancellation or unavailable notification.

## 8. API Requirements (Minimum)
### Auth
- POST /api/auth/login

### Patients and Profiles
- GET /api/me
- GET /api/patients/by-nin/{nin}
- GET /api/patients/{patientId}/history

### Prescriptions
- POST /api/prescriptions
- PUT /api/prescriptions/{id}/issue
- GET /api/prescriptions/{id}
- GET /api/patients/{patientId}/prescriptions
- PUT /api/prescriptions/{id}/select-pharmacy
- PUT /api/prescriptions/{id}/reserve
- PUT /api/prescriptions/{id}/purchase

### RLMA
- GET /api/recommendations/prescriptions/{prescriptionId}?radiusKm={r}&topK={k}

### Pharmacy Inventory
- GET /api/pharmacies/{pharmacyId}/inventory
- POST /api/pharmacies/{pharmacyId}/inventory
- PUT /api/pharmacies/{pharmacyId}/inventory/{inventoryId}
- DELETE /api/pharmacies/{pharmacyId}/inventory/{inventoryId}

### Notifications
- GET /api/notifications?patientId=me
- POST /api/notifications

## 9. Frontend Requirements (React + TypeScript)
### Core Routes
- /login
- /doctor/profile
- /doctor/patients/search
- /doctor/prescriptions/new
- /doctor/prescriptions/:id
- /doctor/patients/:patientId/history
- /patient/profile
- /patient/prescriptions
- /patient/prescriptions/:id/select-pharmacy
- /pharmacy/profile
- /pharmacy/inventory
- /pharmacy/prescriptions

### UI Requirements for RLMA
- Show ranked pharmacy cards/table with:
  - Pharmacy name
  - Distance
  - Availability class and score
  - Missing medicines list (if partial)
  - Select action
- Support loading, empty state, and error state.

### UI Requirements for Pharmacy Registration
- Structured address form with validation.
- Optional Google Places integration for placeId and coordinates.

## 10. Non-Functional Requirements
### Security
- JWT auth and role-based authorization.
- Sensitive identifiers (NIN) not returned in API responses.
- Input validation and sanitized error responses.

### Performance
- Recommendation response target: p95 <= 1.5 seconds for radius <= 10km and topK <= 20.
- Inventory update response target: p95 <= 500ms.

### Reliability
- API availability >= 99 percent for core flows.
- Idempotent handling for non-unsafe retries where possible.

### Observability
- Track recommendation latency, success/failure counts, and state transition events.
- Structured logs for prescription and inventory workflows.

## 11. Data and Migration Requirements
- Add/confirm Address table with geospatial fields.
- Link Address to Doctor, Patient, Pharmacy records.
- Ensure Prescription and PrescriptionItem support recommendation inputs.
- Confirm PharmacyInventory indexing for fast lookups by pharmacyId + medicineId.

## 12. Dependencies
- Backend: ASP.NET Core API + application/domain/infrastructure layers.
- Frontend: React + TypeScript + MUI.
- Mapping (optional but recommended): Google Places/Geocoding API.

## 13. Risks and Mitigations
- Risk: Incomplete or inaccurate location data.
  - Mitigation: Validate lat/lng ranges, allow placeId ingestion, require formattedAddress.
- Risk: Stock mismatch due to stale updates.
  - Mitigation: Enforce transactional purchase + stock decrement; add optimistic concurrency checks.
- Risk: Recommendation quality low in sparse areas.
  - Mitigation: Support configurable radius and fallback partial recommendations.

## 14. Delivery Plan
### Phase 1 (Foundation)
- Role-based auth and registration.
- Address model integration.
- Prescription draft/issue flow.

### Phase 2 (Operational)
- Pharmacy inventory CRUD.
- Patient pharmacy selection.
- Prescription reserve/purchase/cancel transitions.

### Phase 3 (Recommendation + UX)
- RLMA backend endpoint.
- RLMA frontend recommendation screen.
- Notification integration and UX polish.

## 15. Release Readiness Checklist
- [ ] All in-scope endpoints implemented and tested.
- [ ] Role-based access validated for all core APIs.
- [ ] Prescription state transitions enforce rules.
- [ ] RLMA ranking validated with test scenarios.
- [ ] Inventory updates reflected in recommendation outcomes.
- [ ] Frontend route guards and key workflows verified.
- [ ] Documentation updated (API + architecture + runbook).

## 16. Open Questions
- Should recommendation source location prioritize patient address or doctor clinic by default for every case?
- Should partial recommendations be limited by a minimum availability threshold (for example >= 50 percent)?
- What expiration policy should be enforced (for example 7 days for Issued, 3 days for Reserved)?
- Is Google Maps API key available for production and development environments?

## 17. Change Log
- v1.0 (2026-03-22): Initial consolidated PRD created from existing project specs and requested features.
