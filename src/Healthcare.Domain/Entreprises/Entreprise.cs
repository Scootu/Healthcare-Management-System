using Healthcare.Domain.Common;
using Healthcare.Domain.Addresses;
using Healthcare.Domain.Entreprises.Enums;
using Healthcare.Domain.Stocks;

namespace Healthcare.Domain.Entreprises;

public sealed class Entreprise : AuditableEntity
{
    public string entrepriseId { get; set; } = string.Empty;
    public string entrepriseName { get; set; } = string.Empty;
    public EntrepriseType type { get; set; }

    public Address? LocatedAddress { get; set; }
    public Stock? Stock { get; set; }
}

