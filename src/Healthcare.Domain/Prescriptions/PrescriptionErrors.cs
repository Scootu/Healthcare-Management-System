using Healthcare.Domain.Common.Results;

namespace Healthcare.Domain.Prescriptions;

public static class PrescriptionErrors
{
    public static Error IdRequired => Error.Validation(
        code: "PrescriptionErrors.IdRequired",
        description: "Entity Id is required"
    );

    public static Error PrescriptionIdRequired => Error.Validation(
        code: "PrescriptionErrors.PrescriptionIdRequired",
        description: "Prescription Id is required"
    );

    public static Error DoctorIdRequired => Error.Validation(
        code: "PrescriptionErrors.DoctorIdRequired",
        description: "Doctor Id is required"
    );

    public static Error PatientIdRequired => Error.Validation(
        code: "PrescriptionErrors.PatientIdRequired",
        description: "Patient Id is required"
    );

    public static Error PharmacyIdRequired => Error.Validation(
        code: "PrescriptionErrors.PharmacyIdRequired",
        description: "Pharmacy Id is required"
    );

    public static Error ItemIdRequired => Error.Validation(
        code: "PrescriptionErrors.ItemIdRequired",
        description: "Prescription item Id is required"
    );

    public static Error ItemRequired => Error.Validation(
        code: "PrescriptionErrors.ItemRequired",
        description: "Prescription item is required"
    );

    public static Error ItemsRequired => Error.Validation(
        code: "PrescriptionErrors.ItemsRequired",
        description: "At least one prescription item is required"
    );

    public static Error ItemAlreadyExists => Error.Conflict(
        code: "PrescriptionErrors.ItemAlreadyExists",
        description: "Prescription item already exists"
    );

    public static Error ItemNotFound => Error.NotFound(
        code: "PrescriptionErrors.ItemNotFound",
        description: "Prescription item not found"
    );

    public static Error AlreadyPurchased => Error.Conflict(
        code: "PrescriptionErrors.AlreadyPurchased",
        description: "Prescription is already purchased"
    );

    public static Error CannotChangePurchasedPrescription => Error.Conflict(
        code: "PrescriptionErrors.CannotChangePurchasedPrescription",
        description: "Purchased prescription cannot be changed"
    );

    public static Error PurchaseDateInvalid => Error.Validation(
        code: "PrescriptionErrors.PurchaseDateInvalid",
        description: "Purchase date cannot be before creation date"
    );
}
