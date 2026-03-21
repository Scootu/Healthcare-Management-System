namespace HealthCare.Api.Auth;

public sealed record LoginResponse(string AccessToken, string Role, int ExpiresInSeconds);
