import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h3" textAlign="center" mb={2}>
          Welcome to Healthcare System
        </Typography>
        <Typography variant="h6" textAlign="center" mb={5} color="var(--muted-color)">
          Choose your registration type
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {/* Patient Registration */}
          <Box
            sx={{
              flex: "1 1 300px",
              maxWidth: 350,
              p: 4,
              borderRadius: 2,
              backgroundColor: "var(--input-bg-color)",
              border: "1px solid var(--border-color)",
              textAlign: "center",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              },
            }}
          >
            <PersonAddIcon sx={{ fontSize: 60, color: "var(--active-menu-item-color)", mb: 2 }} />
            <Typography variant="h5" mb={2}>
              Register as Patient
            </Typography>
            <Typography variant="body2" color="var(--muted-color)" mb={3}>
              Create a personal account to access healthcare services, book appointments, and manage your medical records.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate("/register-patient")}
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
              Register Patient
            </Button>
          </Box>

          {/* Doctor Registration */}
          <Box
            sx={{
              flex: "1 1 300px",
              maxWidth: 350,
              p: 4,
              borderRadius: 2,
              backgroundColor: "var(--input-bg-color)",
              border: "1px solid var(--border-color)",
              textAlign: "center",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              },
            }}
          >
            <MedicalServicesIcon sx={{ fontSize: 60, color: "var(--warning-color)", mb: 2 }} />
            <Typography variant="h5" mb={2}>
              Register as Doctor
            </Typography>
            <Typography variant="body2" color="var(--muted-color)" mb={3}>
              Create a professional account to manage patient consultations, appointments, and medical records.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate("/register-doctor")}
              sx={{
                py: 1.5,
                backgroundColor: "var(--warning-color)",
                color: "var(--bg-color)",
                "&:hover": {
                  backgroundColor: "var(--warning-color)",
                  opacity: 0.9,
                },
              }}
            >
              Register Doctor
            </Button>
          </Box>

          {/* Pharmacy Registration */}
          <Box
            sx={{
              flex: "1 1 300px",
              maxWidth: 350,
              p: 4,
              borderRadius: 2,
              backgroundColor: "var(--input-bg-color)",
              border: "1px solid var(--border-color)",
              textAlign: "center",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              },
            }}
          >
            <LocalPharmacyIcon sx={{ fontSize: 60, color: "var(--success-color)", mb: 2 }} />
            <Typography variant="h5" mb={2}>
              Register Pharmacy
            </Typography>
            <Typography variant="body2" color="var(--muted-color)" mb={3}>
              Register your pharmacy to manage prescriptions, track inventory, and serve patients efficiently.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate("/register-pharmacy")}
              sx={{
                py: 1.5,
                backgroundColor: "var(--success-color)",
                color: "var(--bg-color)",
                "&:hover": {
                  backgroundColor: "var(--success-color)",
                  opacity: 0.9,
                },
              }}
            >
              Register Pharmacy
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Typography variant="body2" color="var(--muted-color)">
            Already have an account?{" "}
            <Typography
              component="span"
              sx={{
                color: "var(--active-menu-item-color)",
                cursor: "pointer",
                fontWeight: "bold",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => navigate("/login")}
            >
              Sign in here
            </Typography>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
