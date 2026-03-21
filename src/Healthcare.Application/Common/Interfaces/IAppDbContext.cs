using Healthcare.Domain.Addresses;
using Healthcare.Domain.Doctors;
using Healthcare.Domain.Drugs;
using Healthcare.Domain.Entreprises;
using Healthcare.Domain.Identity;
using Healthcare.Domain.MedicalHistories;
using Healthcare.Domain.Patients;
using Healthcare.Domain.Prescriptions;
using Healthcare.Domain.Stocks;
using Healthcare.Domain.Users;

using Microsoft.EntityFrameworkCore;

namespace Healthcare.Application.Common.Interfaces;

public interface IAppDbContext
{
    public DbSet<User> Users { get; }
    public DbSet<Doctor> Doctors { get; }
    public DbSet<Patient> Patients { get; }
    public DbSet<Address> Addresses { get; }
    public DbSet<Entreprise> Entreprises { get; }
    public DbSet<Stock> Stocks { get; }
    public DbSet<Drug> Drugs { get; }
    public DbSet<DrugInStock> DrugsInStock { get; }
    public DbSet<MedicalHistory> MedicalHistories { get; }
    public DbSet<Prescription> Prescriptions { get; }
    public DbSet<PrescriptionItem> PrescriptionItems { get; }
    public DbSet<RefreshToken> RefreshTokens { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}