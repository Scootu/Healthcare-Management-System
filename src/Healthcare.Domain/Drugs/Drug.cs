using Healthcare.Domain.Common;

namespace Healthcare.Domain.Drugs;

public sealed class Drug : AuditableEntity
{
    public Guid DrugId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Form { get; set; } = string.Empty;
    public string family { get; set; } = string.Empty;
    public string Dose { get; set; } = string.Empty;
}

