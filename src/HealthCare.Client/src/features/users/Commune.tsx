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
import { communesInDayra } from "../../data/commune";

export default function Commune() {
  const { wilayaId, dayraId } = useParams();
  const communes = communesInDayra(dayraId || "");
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
        <Typography variant="h5">{dayraId || "Unknown Dayra"} ({communes.length || "0"}) </Typography>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ width: "100%", height: "calc(100% - 80px)", overflow: "auto",  bgcolor: "var(--bg-color) !important" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>English Name</TableCell>
              <TableCell>Arabic Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {communes.map((commune) => (
              <TableRow
                key={commune.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  if (wilayaId && dayraId && commune.EnName) {
                    navigate(`${commune.EnName}`);
                                    }
                }}
              >
                <TableCell>{commune.id}</TableCell>
                <TableCell>{commune.EnName}</TableCell>
                <TableCell>{commune.ArName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
