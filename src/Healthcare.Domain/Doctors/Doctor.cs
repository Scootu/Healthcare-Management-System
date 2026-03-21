using Healthcare.Domain.Common.Results;
using Healthcare.Domain.Entreprises;
using Healthcare.Domain.Identity;
using Healthcare.Domain.MedicalHistories;
using Healthcare.Domain.Patients;
using Healthcare.Domain.Prescriptions;
using Healthcare.Domain.Users;

namespace Healthcare.Domain.Doctors;

public sealed class Doctor : User
{
    public string Speciality { get; private set; } = string.Empty;

    private readonly List<Prescription> _prescriptions = [];
    private readonly List<MedicalHistory> _medicalHistories = [];
    private readonly List<Entreprise> _entreprises = [];

    public IReadOnlyCollection<Prescription> Prescriptions => _prescriptions.AsReadOnly();
    public IReadOnlyCollection<MedicalHistory> MedicalHistories => _medicalHistories.AsReadOnly();
    public IReadOnlyCollection<Entreprise> Entreprises => _entreprises.AsReadOnly();

    private Doctor() { }

    private Doctor(
        Guid id,
        string firstName,
        string lastName,
        DateOnly birthDate,
        string birthPlace,
        string nin,
        string speciality)
        : base(id, firstName, lastName, birthDate, birthPlace, nin, Role.Doctor)
    {
        Speciality = speciality;
    }

    public static Result<Doctor> Create(
        Guid id,
        string firstName,
        string lastName,
        DateOnly birthDate,
        string birthPlace,
        string nin,
        string speciality)
    {
        if (id == Guid.Empty)
        {
            return UserErrors.IdRequired;
        }

        if (string.IsNullOrWhiteSpace(firstName) || string.IsNullOrWhiteSpace(lastName))
        {
            return UserErrors.NameRequired;
        }

        if (string.IsNullOrWhiteSpace(birthPlace))
        {
            return UserErrors.BirthPlaceRequired;
        }

        if (birthDate > DateOnly.FromDateTime(DateTime.UtcNow))
        {
            return UserErrors.BirthDateInvalid;
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



        if (string.IsNullOrWhiteSpace(speciality))
        {
            return DoctorErrors.SpecialiteRequired;
        }

        return new Doctor(
            id,
            firstName.Trim(),
            lastName.Trim(),
            birthDate,
            birthPlace.Trim(),
            nin,
            speciality.Trim());
    }

    public Result<Success> UpdateSpecialite(string specialite)
    {
        if (string.IsNullOrWhiteSpace(specialite))
        {
            return DoctorErrors.SpecialiteRequired;
        }

        Speciality = specialite.Trim();
        return Result.Success;
    }

    public Result<Success> AddPrescription(Prescription prescription)
    {
        if (prescription is null)
        {
            return DoctorErrors.PrescriptionRequired;
        }

        if (_prescriptions.Exists(x => x.Id == prescription.Id))
        {
            return DoctorErrors.PrescriptionAlreadyExists;
        }

        _prescriptions.Add(prescription);
        return Result.Success;
    }

    public Result<Success> RemovePrescription(Guid prescriptionId)
    {
        if (prescriptionId == Guid.Empty)
        {
            return DoctorErrors.PrescriptionIdRequired;
        }

        Prescription? prescription = _prescriptions.Find(x => x.Id == prescriptionId);
        if (prescription is null)
        {
            return DoctorErrors.PrescriptionNotFound;
        }

        _prescriptions.Remove(prescription);
        return Result.Success;
    }

    public Result<Success> AddMedicalHistory(MedicalHistory medicalHistory)
    {
        if (medicalHistory is null)
        {
            return DoctorErrors.MedicalHistoryRequired;
        }

        if (_medicalHistories.Exists(x => x.Id == medicalHistory.Id))
        {
            return DoctorErrors.MedicalHistoryAlreadyExists;
        }

        _medicalHistories.Add(medicalHistory);
        return Result.Success;
    }

    public Result<Success> RemoveMedicalHistory(Guid medicalHistoryId)
    {
        if (medicalHistoryId == Guid.Empty)
        {
            return DoctorErrors.MedicalHistoryIdRequired;
        }

        MedicalHistory? medicalHistory = _medicalHistories.Find(x => x.Id == medicalHistoryId);
        if (medicalHistory is null)
        {
            return DoctorErrors.MedicalHistoryNotFound;
        }

        _medicalHistories.Remove(medicalHistory);
        return Result.Success;
    }


}
