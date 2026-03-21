using Healthcare.Domain.Common.Results;

namespace Healthcare.Domain.Users;

public static class UserErrors
{
    public static Error IdRequired => 
        Error.Validation("User_Id_Required","User id is required");

    public static Error UserIdRequired =>
        Error.Validation("User_UserId_Required", "User numeric id is required");
    
    public static Error NameRequired => 
       Error.Validation("User_Name_Required","User name is required");
    
    public static Error NINRequired => 
        Error.Validation("User_NIN_Required","NIN is required");

    public static Error NINInvalid => 
       Error.Validation("USER_NIN_Invalid","NIN is invalid must be 18 integer number.");

     public static Error BirthPlaceRequired =>
         Error.Validation("User_BirthPlace_Required", "Birth place is required");

     public static Error BirthDateInvalid =>
         Error.Validation("User_BirthDate_Invalid", "Birth date is invalid");

     public static Error RoleInvalid =>
         Error.Validation("User_Role_Invalid", "Role is invalid");

     public static Error PasswordHashRequired =>
         Error.Validation("User_PasswordHash_Required", "Password hash is required");

     public static Error AddressRequired =>
         Error.Validation("User_Address_Required", "Address is required");

     public static Error AddressIdRequired =>
         Error.Validation("User_AddressId_Required", "Address id is required");

     public static Error AddressAlreadyExists =>
         Error.Conflict("User_Address_AlreadyExists", "Address already exists for this user");

     public static Error AddressNotFound =>
         Error.NotFound("User_Address_NotFound", "Address not found for this user");
    
    public static Error UserExist => 
       Error.Validation("User_NIN_Exists","A user with this nin already exists.");
}