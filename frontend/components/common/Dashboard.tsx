"use client";

import { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Person,
  Description,
  LocalHospital,
  Logout,
  AccountCircle,
  Add,
  Category,
  CalendarToday,
} from "@mui/icons-material";
import { PatientsList } from "../patients";
import { PrescriptionsList, EfficientPrescriptionForm } from "../prescriptions";
import { MedicinesList } from "../medicines";
import { CidsList } from "../cids";
import { AppointmentsList } from "../appointments";
import { useAuth } from "@/contexts/AuthContext";

type TabType =
  | "patients"
  | "prescriptions"
  | "medicines"
  | "cids"
  | "appointments"
  | "new-prescription";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("patients");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "new-prescription":
        setActiveTab("new-prescription");
        break;
      case "new-patient":
        setActiveTab("patients");
        break;
      case "new-medicine":
        setActiveTab("medicines");
        break;
      case "new-cid":
        setActiveTab("cids");
        break;
      case "new-appointment":
        setActiveTab("appointments");
        break;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "patients":
        return <PatientsList />;
      case "prescriptions":
        return <PrescriptionsList />;
      case "medicines":
        return <MedicinesList />;
      case "cids":
        return <CidsList />;
      case "appointments":
        return <AppointmentsList />;
      default:
        return <PatientsList />;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)",
          borderBottom: "1px solid rgba(59, 130, 246, 0.3)",
        }}
      >
        <Toolbar sx={{ px: 3 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}
          >
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <LocalHospital sx={{ fontSize: 28, color: "#FFFFFF" }} />
              MedFlow
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              label={user?.name ? `Dr. ${user.name}` : "Carregando..."}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                },
              }}
              icon={<AccountCircle sx={{ color: "#FFFFFF" }} />}
            />

            <IconButton
              onClick={handleMenuOpen}
              sx={{
                color: "#FFFFFF",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <AccountCircle />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: "#1E293B",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  mt: 1,
                },
              }}
            >
              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: "#E2E8F0",
                  "&:hover": {
                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                  },
                }}
              >
                <Logout sx={{ mr: 1, color: "#EF4444" }} />
                Sair
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 0,
          backgroundColor: "rgba(30, 41, 59, 0.9)",
          borderBottom: "1px solid rgba(59, 130, 246, 0.2)",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: "rgba(255, 255, 255, 0.1)",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              color: "#94A3B8",
              fontSize: "0.95rem",
              minHeight: 64,
              "&.Mui-selected": {
                color: "#F1F5F9",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
              },
              "&:hover": {
                backgroundColor: "rgba(59, 130, 246, 0.05)",
                color: "#E2E8F0",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#3B82F6",
              height: 3,
            },
          }}
        >
          <Tab
            label="Pacientes"
            value="patients"
            icon={<Person />}
            iconPosition="start"
          />
          <Tab
            label="Prescrições"
            value="prescriptions"
            icon={<Description />}
            iconPosition="start"
          />
          <Tab
            label="Medicamentos"
            value="medicines"
            icon={<LocalHospital />}
            iconPosition="start"
          />
          <Tab
            label="CIDs"
            value="cids"
            icon={<Category />}
            iconPosition="start"
          />
          <Tab
            label="Agendamentos"
            value="appointments"
            icon={<CalendarToday />}
            iconPosition="start"
          />
          <Tab
            label="Nova Receita"
            value="new-prescription"
            icon={<Add />}
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      <Container
        maxWidth="xl"
        sx={{ flexGrow: 1, py: 3, backgroundColor: "#0F172A" }}
      >
        {renderContent()}
      </Container>
    </Box>
  );
}
