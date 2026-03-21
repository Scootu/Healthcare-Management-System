using Healthcare.Domain.Users;



namespace HealthCare.Api.Auth;

public interface IDevUserStore
{
    User? FindByNin(string nin);
    User? FindById(Guid id);
    bool VerifyPassword(string nin, string password);
}
