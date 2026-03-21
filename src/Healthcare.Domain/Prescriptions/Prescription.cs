using Healthcare.Domain.Common;
using Healthcare.Domain.Common.Results;
using Healthcare.Domain.Prescriptions.Enums;

namespace Healthcare.Domain.Prescriptions;

public sealed class Prescription : AuditableEntity
{
    public int PrescriptionId { get; }
    public Guid DoctorId { get; }
    public Guid PatientId { get; }
    public int PharmacyId { get; }
    public PrescriptionStatus Status { get; private set; }
    public DateTime DateCreated { get; }
    public DateTime? DatePurchased { get; private set; }

    private readonly List<PrescriptionItem> _prescriptionItems = [];
    public IReadOnlyCollection<PrescriptionItem> PrescriptionItems => _prescriptionItems.AsReadOnly();

    private Prescription() { }

    private Prescription(Guid id, int prescriptionId, Guid doctorId, Guid patientId, int pharmacyId) : base(id)
    {
        PrescriptionId = prescriptionId;
        DoctorId = doctorId;
        PatientId = patientId;
        PharmacyId = pharmacyId;
        Status = PrescriptionStatus.Created;
        DateCreated = DateTime.UtcNow;
    }

    public static Result<Prescription> Create(Guid id, int prescriptionId, Guid doctorId, Guid patientId, int pharmacyId)
    {
        if (id == Guid.Empty)
        {
            return PrescriptionErrors.IdRequired;
        }

        if (prescriptionId <= 0)
        {
            return PrescriptionErrors.PrescriptionIdRequired;
        }

        if (doctorId == Guid.Empty)
        {
            return PrescriptionErrors.DoctorIdRequired;
        }

        if (patientId == Guid.Empty)
        {
            return PrescriptionErrors.PatientIdRequired;
        }

        if (pharmacyId <= 0)
        {
            return PrescriptionErrors.PharmacyIdRequired;
        }

        return new Prescription(id, prescriptionId, doctorId, patientId, pharmacyId);
    }

    public Result<Success> AddItem(PrescriptionItem item)
    {
        if (item is null)
        {
            return PrescriptionErrors.ItemRequired;
        }

        if (Status == PrescriptionStatus.Purchased)
        {
            return PrescriptionErrors.CannotChangePurchasedPrescription;
        }

        if (_prescriptionItems.Exists(x => x.Id == item.Id))
        {
            return PrescriptionErrors.ItemAlreadyExists;
        }

        _prescriptionItems.Add(item);
        return Result.Success;
    }

    public Result<Success> RemoveItem(Guid itemId)
    {
        if (itemId == Guid.Empty)
        {
            return PrescriptionErrors.ItemIdRequired;
        }

        if (Status == PrescriptionStatus.Purchased)
        {
            return PrescriptionErrors.CannotChangePurchasedPrescription;
        }

        PrescriptionItem? item = _prescriptionItems.Find(x => x.Id == itemId);
        if (item is null)
        {
            return PrescriptionErrors.ItemNotFound;
        }

        _prescriptionItems.Remove(item);
        return Result.Success;
    }

    public Result<Success> MarkAsPurchased(DateTime purchasedOnUtc)
    {
        if (_prescriptionItems.Count == 0)
        {
            return PrescriptionErrors.ItemsRequired;
        }

        if (Status == PrescriptionStatus.Purchased)
        {
            return PrescriptionErrors.AlreadyPurchased;
        }

        if (purchasedOnUtc < DateCreated)
        {
            return PrescriptionErrors.PurchaseDateInvalid;
        }

        Status = PrescriptionStatus.Purchased;
        DatePurchased = purchasedOnUtc;
        return Result.Success;
    }
}