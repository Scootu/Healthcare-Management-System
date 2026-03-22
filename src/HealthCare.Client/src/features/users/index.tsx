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
import { useNavigate, Link } from "react-router-dom";
import { wilayat } from "../../data/wilayat";
import { type wilayaType } from "../../types/wilayaType";

export default function Wilayat() {
  const navigate = useNavigate();
  return (
    <Box
      height="calc(100% - 20px)"
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      {/* Header */}
      <Box
        sx={{
          height: "60px",
          width: "calc(100% - 20px)",
          px: "10px",
          display: "flex",
          position: "relative",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "4px",
          backgroundColor: "var(--blue-color)",
        }}
      >
        <Typography variant="h5">Wilayat ({wilayat.length})</Typography>
        <Link
         to="/users/all"
          style={{ 
             color: "var(--text-color)",
              textDecoration: "none",
              fontWeight: "bold",
              border: "1px solid var(--text-color)",
              padding: "5px 10px",
              borderRadius: "4px",
              backgroundColor: "var(--bg-color)",
             }}>
           All Users
        </Link>
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{ width: "100%", height: "calc(100% - 80px)", overflow: "auto", bgcolor: "var(--bg-color) !important" }}
      >
        <Table stickyHeader aria-label="wilaya table">
          <TableHead>
            <TableRow>
              <TableCell><b>Num</b></TableCell>
              <TableCell><b>Name (EN)</b></TableCell>
              <TableCell align="right" sx={{ direction: "rtl" }}>
                <b>Name (AR)</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wilayat.map((wilaya: wilayaType) => (
              <TableRow
                key={wilaya.num}
                hover
                onClick={() => {
                  if (wilaya.EnName) {
                    navigate(`wilayat/${wilaya.EnName}`);
                  }
                }}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{wilaya.num}</TableCell>
                <TableCell>{wilaya.EnName}</TableCell>
                <TableCell align="right" sx={{ direction: "rtl" }}>
                  {wilaya.ArName}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
