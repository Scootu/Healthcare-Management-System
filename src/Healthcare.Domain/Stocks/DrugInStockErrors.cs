using Healthcare.Domain.Common.Results;

namespace Healthcare.Domain.Stocks;

public static class DrugInStockErrors
{
    public static Error IdRequired => Error.Validation(
        code: "DrugInStockErrors.IdRequired",
        description: "Entity Id is required"
    );

    public static Error DrugInStockIdRequired => Error.Validation(
        code: "DrugInStockErrors.DrugInStockIdRequired",
        description: "DrugInStock Id is required"
    );

    public static Error DrugIdRequired => Error.Validation(
        code: "DrugInStockErrors.DrugIdRequired",
        description: "Drug Id is required"
    );

    public static Error QuantityInvalid => Error.Validation(
        code: "DrugInStockErrors.QuantityInvalid",
        description: "Quantity must be greater than zero"
    );

    public static Error DrugRequired => Error.Validation(
        code: "DrugInStockErrors.DrugRequired",
        description: "Drug is required"
    );
}