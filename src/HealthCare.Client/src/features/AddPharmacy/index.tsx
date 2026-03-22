import { Box, Typography, TextField, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerPharmacy } from "../../api/registerPharmacy";

// Validation regex
const algerianPhoneRegex = /^(\+213|0)(5|6|7)\d{8}$/;
const safeTextRegex = /^[^<>]*$/;

interface PharmacyFormData {
  pharmacyName: string;
  contactInfo: string;
  address: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function AddPharmacy() {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PharmacyFormData>({
    mode: "onChange",
    defaultValues: {
      pharmacyName: "",
      contactInfo: "",
      address: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PharmacyFormData) => {
    try {
      const result = await registerPharmacy(data);
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
        toast.textContent = "Pharmacy registered successfully! Redirecting...";
        document.body.appendChild(toast);

        setTimeout(() => {
          toast.remove();
          navigate("/login");
        }, 2000);
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        boxSizing: "border-box",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
      }}
    >
      <Box
        sx={{
          maxWidth: 480,
          width: "100%",
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
        <Typography variant="h4" mb={3} textAlign="center">
          Register Pharmacy
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="subtitle1" mb={1}>
            Pharmacy Information
          </Typography>

          <Controller
            name="pharmacyName"
            control={control}
            rules={{
              required: "Pharmacy name is required",
              pattern: { value: safeTextRegex, message: "Invalid character" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Pharmacy Name"
                fullWidth
                error={!!errors.pharmacyName}
                helperText={errors.pharmacyName?.message}
              />
            )}
          />

          <Controller
            name="contactInfo"
            control={control}
            rules={{
              required: "Contact number is required",
              pattern: {
                value: algerianPhoneRegex,
                message: "Use +2135.. or 05/06/07 followed by 8 digits",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Contact Phone"
                fullWidth
                error={!!errors.contactInfo}
                helperText={errors.contactInfo?.message}
              />
            )}
          />

          <Controller
            name="address"
            control={control}
            rules={{
              required: "Address is required",
              pattern: { value: safeTextRegex, message: "Invalid character" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Address"
                fullWidth
                multiline
                rows={2}
                error={!!errors.address}
                helperText={errors.address?.message}
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
                  ? watch("confirmPassword")
                    ? v === watch("confirmPassword") || "Passwords do not match"
                    : true
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
              validate: (v) =>
                watch("password")
                  ? v === watch("password") || "Passwords do not match"
                  : true,
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

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              sx={{
                py: 1.5,
                backgroundColor: "var(--active-menu-item-color)",
                color: "var(--bg-color)",
                "&:hover": {
                  backgroundColor: "var(--active-menu-item-color)",
                  opacity: 0.9,
                },
              }}
            >
              {isSubmitting ? "Registering..." : "Register Pharmacy"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
