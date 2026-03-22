import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { dayraInWilaya } from "../../data/dayra";

interface Dayra {
  id: number;
  EnName: string;
  ArName: string;
}

export default function Dayra() {
  const { wilayaId } = useParams();
  const dayras: Dayra[] = dayraInWilaya(wilayaId || "");
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
      <Box
        sx={{
          height: "60px",
          width: "100%",
          display: "flex",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
          backgroundColor: "var(--blue-color)",
        }}
      >
        <KeyboardBackspaceIcon
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            fontSize: "1.75rem",
            left: "10px",
            cursor: "pointer",
          }}
        />
        <Typography variant="h5">{wilayaId || "Unknown Wilaya"} ({dayras?.length || "0"}) </Typography>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ width: "100%", height: "calc(100% - 80px)", overflow: "auto", bgcolor: "var(--bg-color) !important" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Name (EN)</b></TableCell>
              <TableCell align="right" sx={{ direction: "rtl" }}>
                <b>Name (AR)</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dayras.map((dayra: Dayra) => (
              <TableRow
                key={dayra.id}
                hover
                onClick={() => {
                  if (wilayaId && dayra.EnName) {
                    navigate(`${dayra.EnName}`);
                  }
                }}
              >
                <TableCell>{dayra.id}</TableCell>
                <TableCell>{dayra.EnName}</TableCell>
                <TableCell align="right" sx={{ direction: "rtl" }}>
                  {dayra.ArName}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
