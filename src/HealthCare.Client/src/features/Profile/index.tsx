import { Alert, Box, Card, CardContent, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getCurrentUser, type CurrentUser } from "../../api/getCurrentUser";

type LoadState = "idle" | "loading" | "success" | "error";

function toDisplayDate(dateValue: string): string {
  if (!dateValue) return "-";
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return dateValue;
  return parsed.toLocaleDateString();
}

function profileItem(label: string, value: string) {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: "var(--muted-color)" }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ color: "var(--text-color)", fontWeight: 600 }}>
        {value || "-"}
      </Typography>
    </Box>
  );
}

export default function Profile() {
  const [state, setState] = useState<LoadState>("idle");
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setState("loading");
      setError("");

      try {
        const current = await getCurrentUser();
        if (!isMounted) return;
        setUser(current);
        setState("success");
      } catch (err) {
        if (!isMounted) return;
        setState("error");
        setError((err as Error)?.message || "Unable to load profile.");
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  if (state === "loading" || state === "idle") {
    return (
      <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (state === "error") {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  const fullName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ color: "var(--text-color)", mb: 1 }}>
        My Profile
      </Typography>
      <Typography variant="body2" sx={{ color: "var(--muted-color)", mb: 3 }}>
        Information loaded from /api/auth/me
      </Typography>

      <Card sx={{ backgroundColor: "var(--input-bg-color)", border: "1px solid var(--border-color)" }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              {profileItem("Full Name", fullName)}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {profileItem("Role", user.role)}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {profileItem("NIN", user.nin)}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {profileItem("Birth Date", toDisplayDate(user.birthDate))}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {profileItem("Birth Place", user.birthPlace)}
            </Grid>
            {user.role.toLowerCase() === "doctor" && (
              <Grid size={{ xs: 12, md: 6 }}>
                {profileItem("Speciality", user.speciality || "-" )}
              </Grid>
            )}
          </Grid>

          <Divider sx={{ my: 2, borderColor: "var(--border-color)" }} />

          <Typography variant="caption" sx={{ color: "var(--muted-color)" }}>
            User Id: {user.id}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
