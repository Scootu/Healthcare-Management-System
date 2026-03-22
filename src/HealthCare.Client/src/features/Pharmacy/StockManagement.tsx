import { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import { getPharmacyStock, updateStock } from "../../api/pharmacyClient";
import type { StockItem } from "../../api/pharmacyClient";

interface StockManagementProps {
  pharmacyId: number;
}

export default function StockManagement({ pharmacyId }: StockManagementProps) {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadStock();
  }, []);

  const loadStock = async () => {
    setLoading(true);
    setError("");
    try {
      const items = await getPharmacyStock(pharmacyId);
      setStock(items);
    } catch (err) {
      setError("Error loading stock. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item: StockItem) => {
    setSelectedItem(item);
    setQuantity(item.quantity.toString());
    setReason("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setQuantity("");
    setReason("");
  };

  const handleSaveStock = async () => {
    if (!selectedItem || !quantity) {
      setError("Please enter a quantity");
      return;
    }

    setUpdating(true);
    setError("");

    try {
      const result = await updateStock(
        selectedItem.medicineId,
        pharmacyId,
        parseInt(quantity),
        reason
      );

      if (result) {
        // Update local stock
        setStock(
          stock.map((item) =>
            item.medicineId === selectedItem.medicineId
              ? { ...item, quantity: parseInt(quantity) }
              : item
          )
        );
        handleCloseDialog();
        alert("Stock updated successfully");
      } else {
        setError("Failed to update stock");
      }
    } catch (err) {
      setError("Error updating stock. Please try again.");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const getStockStatusChip = (item: StockItem) => {
    if (item.isExpired) {
      return <Chip label="Expired" color="error" size="small" />;
    }
    if (item.isLowStock) {
      return <Chip label="Low Stock" color="warning" size="small" />;
    }
    return <Chip label="In Stock" color="success" size="small" />;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5">Pharmacy Inventory</Typography>
        <Button variant="contained" onClick={loadStock}>
          Refresh
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Total Items: {stock.length}
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>Medicine</TableCell>
                  <TableCell>Concentration</TableCell>
                  <TableCell>Form</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Expiry Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stock.map((item) => (
                  <TableRow
                    key={item.stockId}
                    sx={{
                      backgroundColor: item.isExpired
                        ? "#ffebee"
                        : item.isLowStock
                        ? "#fff3e0"
                        : "inherit",
                    }}
                  >
                    <TableCell sx={{ fontWeight: "500" }}>
                      {item.medicineName}
                    </TableCell>
                    <TableCell>{item.concentration}</TableCell>
                    <TableCell>{item.form}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      {item.quantity} units
                    </TableCell>
                    <TableCell>{getStockStatusChip(item)}</TableCell>
                    <TableCell>
                      {new Date(item.expiryDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleEditClick(item)}
                        disabled={item.isExpired}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {stock.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No stock items found
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Update Stock Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Update Stock - {selectedItem?.medicineName}</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            type="number"
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Reason"
            placeholder="e.g., received shipment, damage, dispensed"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            rows={3}
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveStock}
            variant="contained"
            disabled={updating || !quantity}
          >
            {updating ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
