import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Container,
} from "@mui/material";

import StockManagement from "../features/Pharmacy/StockManagement";
import AlertsAndReports from "../features/Pharmacy/AlertsAndReports";
import InventoryIcon from "@mui/icons-material/Inventory2";
import SearchIcon from "@mui/icons-material/Search";
import WarningIcon from "@mui/icons-material/Warning";
import PrescriptionLookup from "../features/Pharmacy/PrescriptionLookup";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`pharmacy-tabpanel-${index}`}
      aria-labelledby={`pharmacy-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function PharmacyDashboard() {
  const [tabIndex, setTabIndex] = useState(0);
  // In a real app, this would come from user profile/context
  const pharmacyId = 1;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 2, pb: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            💊 Pharmacy Management System
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage prescriptions, inventory, and stock alerts
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
            gap: 2,
            mb: 4,
          }}
        >
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <SearchIcon sx={{ fontSize: 40, color: "primary.main" }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Prescription Lookup
                  </Typography>
                  <Typography variant="h6">By NHCN</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <InventoryIcon sx={{ fontSize: 40, color: "success.main" }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Stock Management
                  </Typography>
                  <Typography variant="h6">Update Inventory</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <WarningIcon sx={{ fontSize: 40, color: "warning.main" }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Alerts & Reports
                  </Typography>
                  <Typography variant="h6">Low Stock & Expired</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Main Content Tabs */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              aria-label="pharmacy dashboard tabs"
              sx={{ px: 2 }}
            >
              <Tab
                label="🔍 Prescription Lookup"
                id="pharmacy-tab-0"
                aria-controls="pharmacy-tabpanel-0"
              />
              <Tab
                label="📦 Stock Management"
                id="pharmacy-tab-1"
                aria-controls="pharmacy-tabpanel-1"
              />
              <Tab
                label="⚠️ Alerts & Reports"
                id="pharmacy-tab-2"
                aria-controls="pharmacy-tabpanel-2"
              />
            </Tabs>
          </Box>

          <TabPanel value={tabIndex} index={0}>
            <PrescriptionLookup />
          </TabPanel>

          <TabPanel value={tabIndex} index={1}>
            <StockManagement pharmacyId={pharmacyId} />
          </TabPanel>

          <TabPanel value={tabIndex} index={2}>
            <AlertsAndReports pharmacyId={pharmacyId} />
          </TabPanel>
        </Card>
      </Box>
    </Container>
  );
}
