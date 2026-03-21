using Healthcare.Domain.Common;
using Healthcare.Domain.Common.Results;
using Healthcare.Domain.Drugs;

namespace Healthcare.Domain.Stocks;

public sealed class DrugInStock : AuditableEntity
{
    public Guid DrugInStockId { get; }
    public Guid DrugId { get; }
    public int Quantity { get; private set; }
    
    public Drug? Drug { get; }

    private DrugInStock() { }

    private DrugInStock(Guid id, Guid drugInStockId, Guid drugId, int quantity, Drug drug) : base(id)
    {
        DrugInStockId = drugInStockId;
        DrugId = drugId;
        Quantity = quantity;
        Drug = drug;
    }

    public static Result<DrugInStock> Create(Guid id, Guid drugInStockId, Guid drugId, int quantity, Drug drug)
    {
        if (id == Guid.Empty)
        {
            return DrugInStockErrors.IdRequired;
        }

        if (drugInStockId == Guid.Empty)
        {
            return DrugInStockErrors.DrugInStockIdRequired;
        }

        if (drugId == Guid.Empty)
        {
            return DrugInStockErrors.DrugIdRequired;
        }

        if (quantity <= 0)
        {
            return DrugInStockErrors.QuantityInvalid;
        }

        if (drug is null)
        {
            return DrugInStockErrors.DrugRequired;
        }

        return new DrugInStock(id, drugInStockId, drugId, quantity, drug);
    }

    internal Result<Success> UpdateQuantity(int quantity)
    {
        if (quantity <= 0)
        {
            return DrugInStockErrors.QuantityInvalid;
        }

        Quantity = quantity;
        return Result.Success;
    }
}

