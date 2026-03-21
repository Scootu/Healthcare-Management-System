using Healthcare.Domain.Common.Results;

namespace Healthcare.Domain.Patients;

public static class PatientErrors
{
    public static Error IdRequired => Error.Validation("Patient.Id.Required", "Patient entity id is required.");
    public static Error UserIdRequired => Error.Validation("Patient.UserId.Required", "User id is required.");
    public static Error PatientIdRequired => Error.Validation("Patient.PatientId.Required", "Patient id is required.");
    public static Error NameRequired => Error.Validation("Patient.Name.Required", "First name and last name are required.");
    public static Error BirthPlaceRequired => Error.Validation("Patient.BirthPlace.Required", "Birth place is required.");
    public static Error BirthDateInvalid => Error.Validation("Patient.BirthDate.Invalid", "Birth date is invalid.");
    public static Error NinRequired => Error.Validation("Patient.NIN.Required", "NIN is required.");

    public static Error PrescriptionIdRequired => Error.Validation("Patient.PrescriptionId.Required", "Prescription id is required.");
    public static Error PrescriptionRequired => Error.Validation("Patient.Prescription.Required", "Prescription is required.");
    public static Error PrescriptionAlreadyExists => Error.Conflict("Patient.Prescription.AlreadyExists", "Prescription already exists for this patient.");
    public static Error PrescriptionNotFound => Error.NotFound("Patient.Prescription.NotFound", "Prescription not found for this patient.");

    public static Error MedicalHistoryIdRequired => Error.Validation("Patient.MedicalHistoryId.Required", "Medical history id is required.");
    public static Error MedicalHistoryRequired => Error.Validation("Patient.MedicalHistory.Required", "Medical history is required.");
    public static Error MedicalHistoryAlreadyExists => Error.Conflict("Patient.MedicalHistory.AlreadyExists", "Medical history already exists for this patient.");
    public static Error MedicalHistoryNotFound => Error.NotFound("Patient.MedicalHistory.NotFound", "Medical history not found for this patient.");

    public static Error PharmaciesRequired => Error.Validation("Patient.Pharmacies.Required", "Pharmacy list is required.");
    public static Error MaxResultsInvalid => Error.Validation("Patient.MaxResults.Invalid", "Max results must be greater than zero.");
}