using Healthcare.Domain.Common;
using Healthcare.Domain.Common.Results;
using Healthcare.Domain.Prescriptions.Enums;

namespace Healthcare.Domain.Prescriptions;

public sealed class PrescriptionItem : AuditableEntity
{
    public string Frequency { get; private set; } = string.Empty;
    public string Duration { get; private set; } = string.Empty;
    public PrescriptionItemType Type { get; private set; }

    private PrescriptionItem() { }

    private PrescriptionItem(Guid id, string frequency, string duration, PrescriptionItemType type) : base(id)
    {
        Frequency = frequency;
        Duration = duration;
        Type = type;
    }

    public static Result<PrescriptionItem> Create(Guid id, string frequency, string duration, PrescriptionItemType type)
    {
        if (id == Guid.Empty)
        {
            return PrescriptionItemErrors.IdRequired;
        }

        if (string.IsNullOrWhiteSpace(frequency))
        {
            return PrescriptionItemErrors.FrequencyRequired;
        }

        if (string.IsNullOrWhiteSpace(duration))
        {
            return PrescriptionItemErrors.DurationRequired;
        }

        return new PrescriptionItem(id, frequency.Trim(), duration.Trim(), type);
    }

    internal Result<Success> Update(string frequency, string duration, PrescriptionItemType type)
    {
        if (string.IsNullOrWhiteSpace(frequency))
        {
            return PrescriptionItemErrors.FrequencyRequired;
        }

        if (string.IsNullOrWhiteSpace(duration))
        {
            return PrescriptionItemErrors.DurationRequired;
        }

        Frequency = frequency.Trim();
        Duration = duration.Trim();
        Type = type;

        return Result.Success;
    }
}