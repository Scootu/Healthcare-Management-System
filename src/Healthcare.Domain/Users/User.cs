using Healthcare.Domain.Common;
using Healthcare.Domain.Addresses;
using Healthcare.Domain.Common.Results;
using Healthcare.Domain.Identity;

namespace Healthcare.Domain.Users;

public class User : AuditableEntity
{
  public string FirstName { get;  } = string.Empty;
  public string LastName { get;  } = string.Empty;
  public DateOnly BirthDate { get;  }
  public string BirthPlace { get;  } = string.Empty;
  public string NIN { get;  } = string.Empty;
  public Role Role { get;  }

  private readonly List<Address> _addresses = [];
  public IReadOnlyCollection<Address> Addresses => _addresses.AsReadOnly();

  protected User() { }

  protected User(Guid id, string firstName, string lastName, DateOnly birthDate, string birthPlace, string nin, Role role)
    : base(id)
    {
    FirstName = firstName;
    LastName = lastName;
    BirthDate = birthDate;
    BirthPlace = birthPlace;
    NIN = nin;
    Role = role;
    }

  public static Result<User> Create(
    Guid id,
    string firstName,
    string lastName,
    DateOnly birthDate,
    string birthPlace,
    string nin,
    Role role)
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

    if (!Enum.IsDefined(role))
    {
      return UserErrors.RoleInvalid;
    }

    return new User(
      id,
      firstName.Trim(),
      lastName.Trim(),
      birthDate,
      birthPlace.Trim(),
      normalizedNin,
      role);
  }
}