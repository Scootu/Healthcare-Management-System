import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
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
  Tab,
  Tabs,
} from "@mui/material";
import { getLowStockItems, getExpiredMedicines } from "../../api/pharmacyClient";
import type { StockItem } from "../../api/pharmacyClient";

interface AlertsAndReportsProps {
  pharmacyId: number;
}

export default function AlertsAndReports({ pharmacyId }: AlertsAndReportsProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [lowStockItems, setLowStockItems] = useState<StockItem[]>([]);
  const [expiredItems, setExpiredItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    setError("");

    try {
      const low = await getLowStockItems(pharmacyId);
      const expired = await getExpiredMedicines(pharmacyId);

      setLowStockItems(low);
      setExpiredItems(expired);
    } catch (err) {
      setError("Error loading alerts. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5">Inventory Alerts & Reports</Typography>
        <Button variant="contained" onClick={loadAlerts} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Refresh"}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Tabs value={tabIndex} onChange={(_, value) => setTabIndex(value)}>
            <Tab
              label={`Low Stock Items (${lowStockItems.length})`}
              icon={<Chip label={lowStockItems.length} size="small" color="warning" />}
              iconPosition="end"
            />
            <Tab
              label={`Expired Medicines (${expiredItems.length})`}
              icon={<Chip label={expiredItems.length} size="small" color="error" />}
              iconPosition="end"
            />
          </Tabs>
        </CardContent>
      </Card>

      {/* Low Stock Items Tab */}
      {tabIndex === 0 && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            {lowStockItems.length === 0 ? (
              <Alert severity="success">
                No low stock items. All medicines are well stocked!
              </Alert>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#fff3e0" }}>
                      <TableCell>Medicine</TableCell>
                      <TableCell>Concentration</TableCell>
                      <TableCell>Form</TableCell>
                      <TableCell align="right">Current Stock</TableCell>
                      <TableCell>Expiry Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lowStockItems.map((item) => (
                      <TableRow key={item.stockId} sx={{ backgroundColor: "#fffde7" }}>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {item.medicineName}
                        </TableCell>
                        <TableCell>{item.concentration}</TableCell>
                        <TableCell>{item.form}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${item.quantity} units`}
                            color="warning"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(item.expiryDate).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* Expired Medicines Tab */}
      {tabIndex === 1 && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            {expiredItems.length === 0 ? (
              <Alert severity="success">
                No expired medicines. Inventory is healthy!
              </Alert>
            ) : (
              <>
                <Alert severity="error" sx={{ mb: 2 }}>
                  {expiredItems.length} expired item(s) found. Please dispose of these items
                  according to regulations.
                </Alert>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#ffebee" }}>
                        <TableCell>Medicine</TableCell>
                        <TableCell>Concentration</TableCell>
                        <TableCell>Form</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell>Expiry Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {expiredItems.map((item) => (
                        <TableRow key={item.stockId} sx={{ backgroundColor: "#ffcdd2" }}>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            {item.medicineName}
                          </TableCell>
                          <TableCell>{item.concentration}</TableCell>
                          <TableCell>{item.form}</TableCell>
                          <TableCell align="right">{item.quantity} units</TableCell>
                          <TableCell sx={{ color: "error.main" }}>
                            {new Date(item.expiryDate).toLocaleDateString()}
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
      )}
    </Box>
  );
}
