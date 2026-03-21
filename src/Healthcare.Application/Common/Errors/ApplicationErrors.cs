using Healthcare.Domain.Common.Results;

namespace Healthcare.Application.Common.Errors;

public static class ApplicationErrors
{
    public static Error DoctorNotFound =>
        Error.NotFound("Application.Doctor.NotFound", "Doctor does not exist.");

    public static Error PatientNotFound =>
        Error.NotFound("Application.Patient.NotFound", "Patient does not exist.");

    public static Error UserNotFound =>
        Error.NotFound("Application.User.NotFound", "User does not exist.");

    public static Error PrescriptionNotFound =>
        Error.NotFound("Application.Prescription.NotFound", "Prescription does not exist.");

    public static Error MedicalHistoryNotFound =>
        Error.NotFound("Application.MedicalHistory.NotFound", "Medical history does not exist.");

    public static Error PharmacyNotFound =>
        Error.NotFound("Application.Pharmacy.NotFound", "Pharmacy does not exist.");

    public static Error InvalidRefreshToken =>
        Error.Validation("Auth.RefreshToken.Invalid", "Refresh token is invalid.");

    public static Error ExpiredAccessTokenInvalid =>
        Error.Conflict("Auth.ExpiredAccessToken.Invalid", "Expired access token is not valid.");

    public static Error UserIdClaimInvalid =>
        Error.Validation("Auth.UserIdClaim.Invalid", "Invalid user id claim.");

    public static Error RefreshTokenExpired =>
        Error.Conflict("Auth.RefreshToken.Expired", "Refresh token is invalid or has expired.");

    public static Error TokenGenerationFailed =>
        Error.Failure("Auth.TokenGeneration.Failed", "Failed to generate JWT token.");
}