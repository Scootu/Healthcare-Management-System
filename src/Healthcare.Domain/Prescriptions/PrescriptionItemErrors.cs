using Healthcare.Domain.Common.Results;

namespace Healthcare.Domain.Prescriptions;

public static class PrescriptionItemErrors
{
    public static Error IdRequired => Error.Validation(
        code: "PrescriptionItemErrors.IdRequired",
        description: "Entity Id is required"
    );

    public static Error FrequencyRequired => Error.Validation(
        code: "PrescriptionItemErrors.FrequencyRequired",
        description: "Frequency is required"
    );

    public static Error DurationRequired => Error.Validation(
        code: "PrescriptionItemErrors.DurationRequired",
        description: "Duration is required"
    );
}
