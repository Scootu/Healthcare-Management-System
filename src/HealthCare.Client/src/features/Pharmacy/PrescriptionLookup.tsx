import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { getPrescriptionsByNHCN } from "../../api/pharmacyClient";
import type { PrescriptionValidation } from "../../api/pharmacyClient";

export default function PrescriptionLookup() {
  const [nhcn, setNhcn] = useState("");
  const [prescriptions, setPrescriptions] = useState<PrescriptionValidation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!nhcn.trim()) {
      setError("Please enter a valid NHCN");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const results = await getPrescriptionsByNHCN(nhcn);
      setPrescriptions(results);
      if (results.length === 0) {
        setError("No prescriptions found for this NHCN");
      }
    } catch (err) {
      setError("Error fetching prescriptions. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Valid":
        return "success";
      case "PartiallyAvailable":
        return "warning";
      case "Unavailable":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Search Prescriptions by NHCN
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              label="Patient NHCN"
              placeholder="e.g., A9F3C21B8E74D512"
              value={nhcn}
              onChange={(e) => setNhcn(e.target.value.toUpperCase())}
              sx={{ flex: 1 }}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
              sx={{ px: 4 }}
            >
              {loading ? <CircularProgress size={24} /> : "Search"}
            </Button>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        </CardContent>
      </Card>

      {searched && prescriptions.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Found {prescriptions.length} prescription(s)
          </Typography>

          {prescriptions.map((prescription) => (
            <Card key={prescription.prescriptionId} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6">
                    Prescription #{prescription.prescriptionId}
                  </Typography>
                  <Chip
                    label={prescription.validationStatus}
                    color={getStatusColor(prescription.validationStatus)}
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Patient
                    </Typography>
                    <Typography variant="body1">
                      {prescription.patientName} ({prescription.patientNHCN})
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Doctor
                    </Typography>
                    <Typography variant="body1">
                      {prescription.doctorName}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Date Issued
                    </Typography>
                    <Typography variant="body1">
                      {new Date(prescription.dateIssued).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      All Items In Stock
                    </Typography>
                    <Chip
                      label={prescription.allItemsInStock ? "Yes" : "No"}
                      color={prescription.allItemsInStock ? "success" : "error"}
                      size="small"
                    />
                  </Box>
                </Box>

                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                  Prescription Items:
                </Typography>

                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell>Medicine</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Dose</TableCell>
                        <TableCell>Frequency</TableCell>
                        <TableCell>Duration</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {prescription.items.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            <Chip label={item.type} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>{item.dose}</TableCell>
                          <TableCell>{item.frequency}</TableCell>
                          <TableCell>{item.duration}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {prescription.outOfStockItems.length > 0 && (
                  <>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      {prescription.outOfStockItems.length} item(s) have insufficient stock
                    </Alert>

                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: "#fff3cd" }}>
                            <TableCell>Medicine</TableCell>
                            <TableCell align="right">Required</TableCell>
                            <TableCell align="right">Available</TableCell>
                            <TableCell align="right">Shortage</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {prescription.outOfStockItems.map((item, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{item.medicineName}</TableCell>
                              <TableCell align="right">{item.requiredQuantity}</TableCell>
                              <TableCell align="right">{item.availableQuantity}</TableCell>
                              <TableCell align="right" sx={{ color: "error.main", fontWeight: "bold" }}>
                                {item.shortage}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
