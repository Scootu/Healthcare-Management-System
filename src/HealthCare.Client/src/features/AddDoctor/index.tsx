import { Box, Typography, TextField, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { type userType } from "../../types/userType";
import { addDoctor } from "../../api/addDoctor";
import { handleLogin } from "../../api/handleLogin";

// Validation regex
const algerianPhoneRegex = /^(\+213|0)(5|6|7)\d{8}$/; // accepts +2135.. or 05/06/07
const safeTextRegex = /^[^<>]*$/; // block < and >

export default function AddDoctor() {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<userType>({
    mode: "onChange",
    defaultValues: {
      firstNameAr: "",
      firstNameEn: "",
      lastNameAr: "",
      lastNameEn: "",
      phonePrimary: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Doctor",
      clinic: "",
      department: "",
      specialization: "",
    },
  });

  const onSubmit = async (data: userType) => {
    try {
      const result = await addDoctor(data);
      if (result) {
        const toast = document.createElement("div");
        Object.assign(toast.style, {
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "var(--bg-color)",
          background: "var(--success-color)",
          padding: "12px 16px",
          borderRadius: "8px",
          zIndex: "999999",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        });
        toast.textContent = "Doctor account created successfully! Logging you in...";
        document.body.appendChild(toast);
        
        // Auto-login after successful registration
        try {
          await handleLogin({ nin: result.nin, password: data.password! });
          navigate("/doctors");
        } catch (loginErr) {
          console.error("Auto-login failed:", loginErr);
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
        
        setTimeout(() => toast.remove(), 3500);
      } else {
        throw new Error("Failed to create doctor account");
      }
    } catch (err) {
      const message = (err as Error)?.message || "An unexpected error occurred";
      const toast = document.createElement("div");
      Object.assign(toast.style, {
        position: "fixed",
        top: "20%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: "var(--bg-color)",
        background: "var(--error-color)",
        padding: "12px 16px",
        borderRadius: "8px",
        zIndex: "999999",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      });
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3500);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        p: 3,
        boxSizing: "border-box",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
      }}
    >
      <Box
        sx={{
          maxWidth: 480,
          mx: "auto",
          "& .MuiOutlinedInput-root": {
            mb: "15px",
            color: "var(--text-color)",
            borderColor: "var(--border-color)",
            backgroundColor: "var(--input-bg-color)",
            borderRadius: "6px",
            "&:hover": {
              borderColor: "var(--active-menu-item-color)",
              backgroundColor: "var(--input-bg-color)",
              "& .MuiOutlinedInput-input": {
                color: "var(--text-color)",
              },
            },
          },
          "& .MuiOutlinedInput-input::placeholder": {
            color: "var(--muted-color)",
            opacity: 1,
          },
          "& .MuiInputLabel-root": {
            color: "var(--muted-color)",
          },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--active-menu-item-color)",
          },
        }}
      >
        <Typography variant="h4" mb={2} textAlign="center">
          Doctor Registration
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="subtitle1" mb={1}>
            Basic Information
          </Typography>

          <Controller
            name="firstNameEn"
            control={control}
            rules={{
              required: "First name (Latin) is required",
              pattern: { value: safeTextRegex, message: "Invalid character" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="First name (Latin)"
                fullWidth
                error={!!errors.firstNameEn}
                helperText={errors.firstNameEn?.message}
              />
            )}
          />

          <Controller
            name="lastNameEn"
            control={control}
            rules={{
              required: "Last name (Latin) is required",
              pattern: { value: safeTextRegex, message: "Invalid character" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Last name (Latin)"
                fullWidth
                error={!!errors.lastNameEn}
                helperText={errors.lastNameEn?.message}
              />
            )}
          />

          <Controller
            name="firstNameAr"
            control={control}
            rules={{
              required: "First name (Arabic) is required",
              pattern: { value: safeTextRegex, message: "Invalid character" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="First name (Arabic)"
                fullWidth
                error={!!errors.firstNameAr}
                helperText={errors.firstNameAr?.message}
              />
            )}
          />

          <Controller
            name="lastNameAr"
            control={control}
            rules={{
              required: "Last name (Arabic) is required",
              pattern: { value: safeTextRegex, message: "Invalid character" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Last name (Arabic)"
                fullWidth
                error={!!errors.lastNameAr}
                helperText={errors.lastNameAr?.message}
              />
            )}
          />

          <Typography variant="subtitle1" mt={2} mb={1}>
            Professional Information
          </Typography>

          <Controller
            name="phonePrimary"
            control={control}
            rules={{
              required: "Phone number is required",
              pattern: {
                value: algerianPhoneRegex,
                message: "Use +2135.. or 05/06/07 followed by 8 digits",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Phone number"
                fullWidth
                error={!!errors.phonePrimary}
                helperText={errors.phonePrimary?.message}
              />
            )}
          />

          <Controller
            name="clinic"
            control={control}
            rules={{
              required: "Clinic/Hospital is required",
              pattern: { value: safeTextRegex, message: "Invalid character" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Clinic/Hospital"
                fullWidth
                error={!!errors.clinic}
                helperText={errors.clinic?.message}
              />
            )}
          />

          <Controller
            name="department"
            control={control}
            rules={{
              required: "Department is required",
              pattern: { value: safeTextRegex, message: "Invalid character" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Department"
                fullWidth
                error={!!errors.department}
                helperText={errors.department?.message}
              />
            )}
          />

          <Controller
            name="specialization"
            control={control}
            rules={{
              required: "Specialization is required",
              pattern: { value: safeTextRegex, message: "Invalid character" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Specialization"
                fullWidth
                error={!!errors.specialization}
                helperText={errors.specialization?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Typography variant="subtitle1" mt={2} mb={1}>
            Security
          </Typography>

          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
              maxLength: { value: 50, message: "Maximum 50 characters" },
              pattern: {
                value: safeTextRegex,
                message: "Password contains invalid characters",
              },
              validate: (v) =>
                /[A-Z]/.test(v!) && /[a-z]/.test(v!) && /\d/.test(v!)
                  ? true
                  : "Password must contain an uppercase letter, a lowercase letter, and a number",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: "Password confirmation is required",
              validate: (v, { password }) =>
                v === password || "Passwords do not match",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Confirm password"
                type="password"
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            )}
          />

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                backgroundColor: "var(--primary-color)",
                "&:hover": { backgroundColor: "var(--primary-color-hover)" },
              }}
            >
              Register
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                reset();
              }}
            >
              Reset
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
