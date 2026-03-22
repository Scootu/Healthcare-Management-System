import { Box, Typography, Grid, Avatar, Divider } from "@mui/material";
import { type userType } from "../../types/userType";
import { useParams } from "react-router-dom";
import { useOneUser } from "../../api/getOneUser";
import { Spin } from "antd";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import MoreVertIcon from "@mui/icons-material/MoreVert";
const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <Grid container spacing={1} mb={1}>
    <Grid size={4}>
      <Typography fontWeight="bold">{label}:</Typography>
    </Grid>
    <Grid size={8}>
      <Typography>{value || "N/A"}</Typography>
    </Grid>
  </Grid>
);

const UserCard = () => {
  const { userId } = useParams();
  const { data: userInfo, isLoading, isError } = useOneUser(userId || "");

  if (isLoading) 
    return (
         <Box
                    sx={{
                        display: "flex",    
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        width: "100%",
                        backgroundColor: "var(--bg-color)",
                    }}
                    >
                    <Spin style={{
                        color: "var(--blue-color) !important"
                    }}/>
                    </Box>
    )
  if (isError) return <div>Error loading user data.</div>;
  if (!userInfo) return <div>No user data found.</div>;

  const user = (Array.isArray(userInfo) ? userInfo[0] : userInfo) as userType | undefined;
  if (!user) return <div>No user data found.</div>;

  return (
    <Box
      sx={{
        width: "100%",
        mb: 3,
        borderRadius: 2,
        backgroundColor: "var(--bg-color)",
      }}
    >
        {/* Top Bar */}
        <Box
        sx={{
            height: "60px",
            width: "calc(100% - 20px)",
            display: "flex",
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            backgroundColor: "var(--blue-color)",
            mb: 3,
            px: "10px",
        }}
        >
        <KeyboardBackspaceIcon
            onClick={() => window.history.back()}
            sx={{ position: "absolute", fontSize: "1.75rem", left: "10px", cursor: "pointer", color: "var(--text-color)" }}
        />
        <Typography variant="h5" sx={{ color: "var(--text-color)" }}>
            User Details
        </Typography>
        <MoreVertIcon
            sx={{ position: "absolute", fontSize: "1.75rem", right: "10px", cursor: "pointer", color: "var(--text-color)" }}
        />
        </Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Avatar
          src="/default-user.png"
          alt={user.firstNameEn}
          sx={{ width: 80, height: 80, bgcolor: "var(--blue-color)", color: "var(--text-color)", fontSize: "2rem" }}
        />
        <Box>
          <Typography variant="h6">{`${user.firstNameEn} ${user.lastNameEn}`}</Typography>
          <Typography color="gray">ID: {user.nationalId}</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2, color: "var(--border-color)" }} />

      {/* Personal Info */}
      <Box px={2}>
      <Typography variant="h6" gutterBottom>
        Personal Info
      </Typography>
      <InfoRow label="Ar Name" value={user.firstNameAr} />
      <InfoRow label="En Name" value={user.firstNameEn} />
      <InfoRow label="Ar Last Name" value={user.lastNameAr} />
      <InfoRow label="En Last Name" value={user.lastNameEn} />
      <InfoRow label="Email" value={user.email} />
      <InfoRow label="Birth Date" value={user.birthDate} />
      <InfoRow label="Birth Place" value={user.birthPlace} />

      <Divider sx={{ my: 2, color: "var(--border-color)" }} />

      {/* Contact Info */}
      <Typography variant="h6" gutterBottom>
        Contact Info
      </Typography>
      <InfoRow label="Address" value={user.address} />
      <InfoRow label="Wilaya" value={user.wilaya} />
      <InfoRow label="Dayra" value={user.dayra} />
      <InfoRow label="Commune" value={user.commune} />
      <InfoRow label="Phone 1" value={user.phonePrimary} />
      <InfoRow label="Phone 2" value={user.phoneSecondary} />
      </Box>
    </Box>
  );
};

export default UserCard;