using Healthcare.Domain.Common;
using Healthcare.Domain.Common.Results;

namespace Healthcare.Domain.Stocks;

public sealed class Stock : AuditableEntity
{
    public Guid StockId { get; }

    private readonly List<DrugInStock> _drugsInStock = [];

    public IReadOnlyCollection<DrugInStock> DrugsInStock => _drugsInStock.AsReadOnly();

    private Stock() { }

    private Stock(Guid id, Guid stockId) : base(id)
    {
        StockId = stockId;
    }

    public static Result<Stock> Create(Guid id, Guid stockId)
    {
        if (id == Guid.Empty)
        {
            return StockErrors.IdRequired;
        }

        if (stockId == Guid.Empty)
        {
            return StockErrors.StockIdRequired;
        }

        return new Stock(id, stockId);
    }

    public Result<Success> AddDrug(DrugInStock drugInStock)
    {
        if (drugInStock is null)
        {
            return StockErrors.DrugInStockRequired;
        }

        if (_drugsInStock.Exists(x => x.DrugId == drugInStock.DrugId))
        {
            return StockErrors.DrugAlreadyExists;
        }

        _drugsInStock.Add(drugInStock);
        return Result.Success;
    }

    public Result<Success> UpdateQuantity(Guid drugId, int quantity)
    {
        if (drugId == Guid.Empty)
        {
            return StockErrors.DrugIdRequired;
        }

        if (quantity <= 0)
        {
            return StockErrors.QuantityInvalid;
        }

        DrugInStock? entry = _drugsInStock.Find(x => x.DrugId == drugId);
        if (entry is null)
        {
            return StockErrors.DrugNotFound;
        }

        return entry.UpdateQuantity(quantity);
    }

    public Result<Success> RemoveDrug(Guid drugId)
    {
        if (drugId == Guid.Empty)
        {
            return StockErrors.DrugIdRequired;
        }

        DrugInStock? entry = _drugsInStock.Find(x => x.DrugId == drugId);
        if (entry is null)
        {
            return StockErrors.DrugNotFound;
        }

        _drugsInStock.Remove(entry);
        return Result.Success;
    }
}

