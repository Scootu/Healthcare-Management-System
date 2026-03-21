namespace HealthCare.Api.Auth;

public sealed record LoginRequest(string NIN, string password);
