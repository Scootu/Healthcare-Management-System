using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using HealthCare.Api.Auth;
using Healthcare.Domain.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthorization();
builder.Services.AddSingleton<IPasswordHasher, Pbkdf2PasswordHasher>();
builder.Services.AddSingleton<IDevUserStore, InMemoryDevUserStore>();

var jwtSettings = builder.Configuration.GetSection(JwtSettings.SectionName).Get<JwtSettings>()
	?? throw new InvalidOperationException("JWT configuration is missing.");

var jwtKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key));

const string CorsPolicyName = "ClientCors";

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
	?? ["http://localhost:5173", "http://localhost:8000"];

builder.Services.AddCors(options =>
{
	options.AddPolicy(CorsPolicyName, policy =>
	{
		policy
			.WithOrigins(allowedOrigins)
			.AllowAnyHeader()
			.AllowAnyMethod();
	});
});


builder.Services
	.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
	.AddJwtBearer(options =>
	{
		options.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateIssuer = true,
			ValidIssuer = jwtSettings.Issuer,
			ValidateAudience = true,
			ValidAudience = jwtSettings.Audience,
			ValidateIssuerSigningKey = true,
			IssuerSigningKey = jwtKey,
			ValidateLifetime = true,
			ClockSkew = TimeSpan.FromSeconds(30)
		};
	});

var app = builder.Build();
app.UseCors(CorsPolicyName);
app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/api/auth/login", (
	LoginRequest request,
	IDevUserStore userStore,
	IPasswordHasher _) =>
{
	var user = userStore.FindByNin(request.NIN);
	if (user is null || !userStore.VerifyPassword(request.NIN, request.password))
	{
		return Results.Unauthorized();
	}

	var now = DateTime.UtcNow;
	var claims = new List<Claim>
	{
		new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
		new(JwtRegisteredClaimNames.UniqueName, user.NIN),
		new(ClaimTypes.NameIdentifier, user.Id.ToString()),
		new(ClaimTypes.Name, $"{user.FirstName} {user.LastName}".Trim()),
		new(ClaimTypes.Role, user.Role.ToString())
	};

	var token = new JwtSecurityToken(
		issuer: jwtSettings.Issuer,
		audience: jwtSettings.Audience,
		claims: claims,
		notBefore: now,
		expires: now.AddMinutes(jwtSettings.ExpiryMinutes),
		signingCredentials: new SigningCredentials(jwtKey, SecurityAlgorithms.HmacSha256));

	var jwt = new JwtSecurityTokenHandler().WriteToken(token);
	return Results.Ok(new LoginResponse(jwt, user.Role.ToString(), jwtSettings.ExpiryMinutes * 60));
});

app.MapGet("/api/auth/me", [Authorize] (ClaimsPrincipal principal, IDevUserStore userStore) =>
{
	var userIdClaim = principal.FindFirstValue(ClaimTypes.NameIdentifier);
	if (!Guid.TryParse(userIdClaim, out var userId))
	{
		return Results.Unauthorized();
	}

	var user = userStore.FindById(userId);
	if (user is null)
	{
		// Fallback in case token format changes and includes only NIN.
		var nin = principal.FindFirstValue("nin")
			?? principal.FindFirstValue(JwtRegisteredClaimNames.UniqueName)
			?? principal.FindFirstValue(ClaimTypes.Name);

		if (!string.IsNullOrWhiteSpace(nin))
		{
			user = userStore.FindByNin(nin);
		}
	}

	if (user is null)
	{
		return Results.NotFound(new { Message = "User profile not found." });
	}

	var speciality = user.Role == Role.Doctor ? "General Medicine (demo)" : null;

	return Results.Ok(new
	{
		user.Id,
		user.NIN,
		user.FirstName,
		user.LastName,
		user.BirthDate,
		user.BirthPlace,
		Role = user.Role.ToString(),
		Speciality = speciality
	});
});

app.MapGet("/api/auth/doctor-only", [Authorize(Roles = nameof(Role.Doctor))] () =>
	Results.Ok(new { Message = "Doctor role authorized." }));

app.MapGet("/", () => "HealthCare API is running.");

app.Run();
