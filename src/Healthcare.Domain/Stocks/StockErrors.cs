using Healthcare.Domain.Common.Results;

namespace Healthcare.Domain.Stocks;

public static class StockErrors
{
	public static Error IdRequired => Error.Validation(
		code: "StockErrors.IdRequired",
		description: "Entity Id is required"
	);

	public static Error StockIdRequired => Error.Validation(
		code: "StockErrors.StockIdRequired",
		description: "Stock Id is required"
	);

	public static Error DrugIdRequired => Error.Validation(
		code: "StockErrors.DrugIdRequired",
		description: "Drug Id is required"
	);

	public static Error DrugInStockRequired => Error.Validation(
		code: "StockErrors.DrugInStockRequired",
		description: "Drug item is required"
	);

	public static Error QuantityInvalid => Error.Validation(
		code: "StockErrors.QuantityInvalid",
		description: "Quantity must be greater than zero"
	);

	public static Error DrugAlreadyExists => Error.Conflict(
		code: "StockErrors.DrugAlreadyExists",
		description: "Drug already exists in stock"
	);

	public static Error DrugNotFound => Error.NotFound(
		code: "StockErrors.DrugNotFound",
		description: "Drug not found in stock"
	);
}