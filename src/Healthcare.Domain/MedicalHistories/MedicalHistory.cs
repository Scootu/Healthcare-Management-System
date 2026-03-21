using Healthcare.Domain.Common;

namespace Healthcare.Domain.MedicalHistories;

public sealed class MedicalHistory : AuditableEntity
{
    public DateOnly createdAt { get; set; }
    public string description { get; set; } = string.Empty;
}

