using Healthcare.Domain.Common.Results;
using Healthcare.Domain.Entreprises;
using Healthcare.Domain.Entreprises.Enums;
using Healthcare.Domain.Identity;
using Healthcare.Domain.MedicalHistories;
using Healthcare.Domain.Users;
using Healthcare.Domain.Prescriptions;

namespace Healthcare.Domain.Patients;

public sealed class Patient : User
{
    public sealed record PharmacyRecommendation(Entreprise Pharmacy, decimal DistanceKm);

    private readonly List<Prescription> _prescriptions = [];
    private readonly List<MedicalHistory> _medicalHistories = [];

    public IReadOnlyCollection<Prescription> Prescriptions => _prescriptions.AsReadOnly();
    public IReadOnlyCollection<MedicalHistory> MedicalHistories => _medicalHistories.AsReadOnly();

    private Patient() { }

    private Patient(
        Guid id,
        string firstName,
        string lastName,
        DateOnly birthDate,
        string birthPlace,
        string nin)
        : base(id, firstName, lastName, birthDate, birthPlace, nin, Role.Patient)
    {

    }

    public static Result<Patient> Create(
        Guid id,
        string firstName,
        string lastName,
        DateOnly birthDate,
        string birthPlace,
        string nin)
    {
        if (id == Guid.Empty)
        {
            return PatientErrors.IdRequired;
        }

        if (string.IsNullOrWhiteSpace(firstName) || string.IsNullOrWhiteSpace(lastName))
        {
            return PatientErrors.NameRequired;
        }

        if (string.IsNullOrWhiteSpace(birthPlace))
        {
            return PatientErrors.BirthPlaceRequired;
        }

        if (birthDate > DateOnly.FromDateTime(DateTime.UtcNow))
        {
            return PatientErrors.BirthDateInvalid;
        }

        if (string.IsNullOrWhiteSpace(nin))
        {
            return UserErrors.NINRequired;
        }

        var normalizedNin = nin.Trim();

        if (normalizedNin.Length != 18 || !normalizedNin.All(char.IsDigit))
        {
            return UserErrors.NINInvalid;
        }
        return new Patient(
            id,
            firstName.Trim(),
            lastName.Trim(),
            birthDate,
            birthPlace.Trim(),
            normalizedNin);
    }

    public IReadOnlyCollection<Prescription> ViewPrescriptions() => Prescriptions;

    public IReadOnlyCollection<MedicalHistory> ViewMedicalHistories() => MedicalHistories;

    public Result<IReadOnlyCollection<PharmacyRecommendation>> ListNearestPharmacies(
        IEnumerable<Entreprise> entreprises,
        int maxResults = 5,
        Func<Entreprise, bool>? classificationFilter = null)
    {
        if (entreprises is null)
        {
            return PatientErrors.PharmaciesRequired;
        }

        if (maxResults <= 0)
        {
            return PatientErrors.MaxResultsInvalid;
        }

        var patientAddress = Addresses.FirstOrDefault();
        if (patientAddress is null)
        {
            return UserErrors.AddressRequired;
        }

        var recommendations = entreprises
            .Where(x => x is not null)
            .Where(x => x.type == EntrepriseType.Pharmacy)
            .Where(x => x.LocatedAddress is not null)
            .Where(x => classificationFilter is null || classificationFilter(x))
            .Select(x => new PharmacyRecommendation(x, patientAddress.CalculateDistance(x.LocatedAddress!)))
            .OrderBy(x => x.DistanceKm)
            .Take(maxResults)
            .ToList()
            .AsReadOnly();

        return recommendations;
    }

    internal Result<Success> AddPrescription(Prescription prescription)
    {
        if (prescription is null)
        {
            return PatientErrors.PrescriptionRequired;
        }

        if (_prescriptions.Exists(x => x.Id == prescription.Id))
        {
            return PatientErrors.PrescriptionAlreadyExists;
        }

        _prescriptions.Add(prescription);
        return Result.Success;
    }

    internal Result<Success> AddMedicalHistory(MedicalHistory medicalHistory)
    {
        if (medicalHistory is null)
        {
            return PatientErrors.MedicalHistoryRequired;
        }

        if (_medicalHistories.Exists(x => x.Id == medicalHistory.Id))
        {
            return PatientErrors.MedicalHistoryAlreadyExists;
        }

        _medicalHistories.Add(medicalHistory);
        return Result.Success;
    }

}
