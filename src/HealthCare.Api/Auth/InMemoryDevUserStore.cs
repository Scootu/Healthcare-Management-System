using Healthcare.Domain.Doctors;
using Healthcare.Domain.Patients;
using Healthcare.Domain.Users;


namespace HealthCare.Api.Auth;

public sealed class InMemoryDevUserStore : IDevUserStore
{
    private sealed record DevUser(User User, string PasswordHash);

    private readonly IPasswordHasher _passwordHasher;
    private readonly Dictionary<string, DevUser> _usersByNin;

    public InMemoryDevUserStore(IPasswordHasher passwordHasher)
    {
        _passwordHasher = passwordHasher;

        // Seed users for fast development until persistence is introduced.
        var doctorResult = Doctor.Create(
            Guid.Parse("11111111-1111-1111-1111-111111111111"),
            "Ahmed",
            "Dahmani",
            new DateOnly(1988, 5, 14),
            "Blida",
            "100040284063460000",
            "General Medicine");

        var patientResult = Patient.Create(
            Guid.Parse("22222222-2222-2222-2222-222222222222"),
            "sabri",
            "bokadoom",
            new DateOnly(1996, 10, 3),
            "Oran",
            "100040284063460001");

        if (doctorResult.IsError || patientResult.IsError)
        {
            throw new InvalidOperationException("Failed to seed development users.");
        }

        _usersByNin = new Dictionary<string, DevUser>(StringComparer.Ordinal)
        {
            [doctorResult.Value.NIN] = new DevUser(doctorResult.Value, passwordHasher.Hash("Doctor@123")),
            [patientResult.Value.NIN] = new DevUser(patientResult.Value, passwordHasher.Hash("Patient@123"))
        };
    }

    public User? FindByNin(string nin)
    {
        _usersByNin.TryGetValue(nin.Trim(), out var user);
        return user?.User;
    }

    public User? FindById(Guid id)
    {
        return _usersByNin.Values.Select(x => x.User).FirstOrDefault(user => user.Id == id);
    }

    public bool VerifyPassword(string nin, string password)
    {
        if (!_usersByNin.TryGetValue(nin.Trim(), out var user))
        {
            return false;
        }

        return _passwordHasher.Verify(password, user.PasswordHash);
    }
}
