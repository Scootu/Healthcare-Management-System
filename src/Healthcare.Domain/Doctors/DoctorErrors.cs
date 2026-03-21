using Healthcare.Domain.Common.Results;

namespace Healthcare.Domain.Doctors;

public static class DoctorErrors
{
    public static Error SpecialiteRequired => Error.Validation("Doctor.Specialite.Required", "Specialite is required.");

    public static Error PrescriptionIdRequired => Error.Validation("Doctor.PrescriptionId.Required", "Prescription id is required.");
    public static Error PrescriptionRequired => Error.Validation("Doctor.Prescription.Required", "Prescription is required.");
    public static Error PrescriptionAlreadyExists => Error.Conflict("Doctor.Prescription.AlreadyExists", "Prescription already exists for this doctor.");
    public static Error PrescriptionNotFound => Error.NotFound("Doctor.Prescription.NotFound", "Prescription not found for this doctor.");

    public static Error MedicalHistoryIdRequired => Error.Validation("Doctor.MedicalHistoryId.Required", "Medical history id is required.");
    public static Error MedicalHistoryRequired => Error.Validation("Doctor.MedicalHistory.Required", "Medical history is required.");
    public static Error MedicalHistoryAlreadyExists => Error.Conflict("Doctor.MedicalHistory.AlreadyExists", "Medical history already exists for this doctor.");
    public static Error MedicalHistoryNotFound => Error.NotFound("Doctor.MedicalHistory.NotFound", "Medical history not found for this doctor.");

    public static Error EntrepriseIdRequired => Error.Validation("Doctor.EntrepriseId.Required", "Entreprise id is required.");
    public static Error EntrepriseRequired => Error.Validation("Doctor.Entreprise.Required", "Entreprise is required.");
    public static Error EntrepriseAlreadyExists => Error.Conflict("Doctor.Entreprise.AlreadyExists", "Entreprise already exists for this doctor.");
    public static Error EntrepriseNotFound => Error.NotFound("Doctor.Entreprise.NotFound", "Entreprise not found for this doctor.");
}
