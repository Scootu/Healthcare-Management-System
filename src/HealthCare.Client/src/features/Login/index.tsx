import { Box, Typography, Grid, TextField, Button, useMediaQuery } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { handleLogin } from "../../api/handleLogin";

type LoginForm = {
  nin: string;
  password: string;
};

const ninRegex = /^\d{6,20}$/;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const isPad = useMediaQuery("(max-width: 900px)");

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<LoginForm>({ mode: "onChange" });

  const onSubmit = async (data: LoginForm) => {
    try {
      await handleLogin(data);
    } catch (error) {
      const message = (error as Error)?.message || "An unexpected error occurred";
      const showPopup = (msg: string) => {
        const toast = document.createElement("div");
        Object.assign(toast.style, {
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "var(--bg-color)",
          color: "var(--error-color)",
          padding: "12px 16px",
          borderRadius: "8px",
          zIndex: "999999",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          transition: "opacity 300ms ease, transform 300ms ease",
          opacity: "1",
          pointerEvents: "auto",
          maxWidth: "90%",
          textAlign: "center",
        });
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => {
          toast.style.opacity = "0";
          setTimeout(() => toast.remove(), 300);
        }, 4000);
      };

      showPopup(message);
    } finally {
      reset({ nin: data.nin, password: "" });
    }
  };

  return (
    <Box sx={{ height: "100vh", width: "100vw", overflow: "hidden", backgroundColor: isPad ? "var(--blue-color)" : "transparent" }}>
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: isPad ? "column-reverse" : "row-reverse",
        }}
      >
        <Grid size={isPad ? 12 : 7} height={isPad ? "70vh" : "100vh"}>
          <Box
            sx={{
              height: "100%",
              backgroundColor: isPad ? "var(--blue-color)" : "var(--bg-color)",
              color: "var(--text-color)",
              padding: 4,
              transition: "all 0.3s ease",
              display: "flex",
              justifyContent: isPad ? "start" : "center",
              alignItems: "center",
              flexDirection: "column",
              gap: isPad ? "10px" : "20px",
            }}
          >
            <Typography variant="h4" gutterBottom align="center">
              Sign In
            </Typography>
            <Typography variant="body2" sx={{ color: "var(--muted-color)", textAlign: "center" }}>
              Use your NIN and password to access the healthcare dashboard.
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="nin"
                control={control}
                defaultValue=""
                rules={{
                  required: "NIN is required",
                  pattern: { value: ninRegex, message: "NIN must be 6 to 20 digits" },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="NIN (National Identity Number)"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                      style: { color: "var(--text-color)" },
                    }}
                    InputProps={{
                      style: { color: "var(--text-color)", borderColor: "var(--text-color)" },
                    }}
                  />
                )}
              />
              {errors?.nin?.message && <Typography color="error">{errors?.nin?.message}</Typography>}

              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                  maxLength: { value: 100, message: "Password is too long" },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{
                      borderColor: "var(--text-color)",
                    }}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                      style: { color: "var(--text-color)" },
                    }}
                    InputProps={{
                      style: { color: "var(--text-color)", borderColor: "var(--text-color)" },
                      endAdornment: (
                        <button
                          type="button"
                          onClick={() => setShowPassword((show) => !show)}
                          style={{
                            background: "none",
                            color: "inherit",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            margin: 0,
                            display: "flex",
                            alignItems: "center",
                          }}
                          tabIndex={-1}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </button>
                      ),
                    }}
                  />
                )}
              />
              {errors?.password?.message && <Typography color="error">{errors?.password?.message}</Typography>}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  marginTop: 2,
                  backgroundColor: "var(--primary-color)",
                  color: "var(--text-color)",
                  "&:hover": {
                    backgroundColor: "var(--primary-color-hover)",
                  },
                }}
              >
                Login
              </Button>
            </form>
          </Box>
        </Grid>
        <Grid size={isPad ? 12 : 5} height={isPad ? "30vh" : "100vh"}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              color: "var(--text-color)",
              padding: 4,
              boxSizing: "border-box",
              textAlign: "center",
              backgroundColor: "var(--blue-color)",
              transition: "all 0.3s ease",
              gap: isPad ? "10px" : "20px",
            }}
          >
            <Typography variant="h4" gutterBottom>
              Healthcare Staff Portal
            </Typography>
            <Typography variant="h6" gutterBottom>
              Doctors and patients authenticate with NIN credentials.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
