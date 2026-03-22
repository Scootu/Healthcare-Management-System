import { useUsersByCommune } from "../../api/getUsersByCommune";
import { useParams, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { type CommuneDataType } from "../../types/communeDataType";

export default function UsersInCommune() {
  const { wilayaId, dayraId, communeId } = useParams();
  const { data: users, isLoading, error } = useUsersByCommune({
    wilaya: wilayaId,
    dayra: dayraId,
    commune: communeId
  } as CommuneDataType);

  const navigate = useNavigate();

  const Header = () => (
    <Box
      sx={{
        height: "60px",
        width: "100%",
        display: "flex",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "4px",
        backgroundColor: "var(--blue-color)"
      }}
    >
      <KeyboardBackspaceIcon
        onClick={() => navigate(-1)}
        sx={{ position: "absolute", fontSize: "1.75rem", left: "10px", cursor: "pointer" }}
      />
      <Typography variant="h5">{dayraId || "Unknown Dayra"} ({users?.length || "0"}) </Typography>
    </Box>
  );

  if (isLoading) {
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
    );
  }

  if (error)
    return (
      <Box height="100%" width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="start">
        <Header />
        <Typography variant="h6">Error loading users: {(error as Error).message}</Typography>
      </Box>
    );

  if (!users?.length)
    return (
      <Box height="100%" width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="start">
        <Header />
        <Typography variant="h6">No users found.</Typography>
      </Box>
    );

  return (
    <Box height="calc(100% - 20px)" width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Header />
      <TableContainer component={Paper} sx={{ width: "100%", height: "calc(100% - 80px)", overflow: "auto", bgcolor: "var(--bg-color) !important" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><b>Name (EN)</b></TableCell>
              <TableCell align="right" sx={{ direction: "rtl" }}><b>Name (AR)</b></TableCell>
              <TableCell align="center"><b>Email</b></TableCell>
              <TableCell align="center"><b>Created At</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.id} 
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => {
                if (user.nationalId) {
                  navigate(`/users/${user.nationalId}`, { replace: true });
                }
              }
              }
              >
                <TableCell>
                  {user.firstNameEn} {user.lastNameEn}
                </TableCell>
                <TableCell align="right" sx={{ direction: "rtl" }}>
                  {user.firstNameAr} {user.lastNameAr}
                </TableCell>
                <TableCell align="center">{user.email}</TableCell>
                <TableCell align="center">{user.created_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
