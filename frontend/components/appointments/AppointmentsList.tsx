"use client";

// IMPORTS OBRIGATÓRIOS - NUNCA CRIAR NOVOS
import {
  EmptyState,
  FilterControls,
  ModuleHeader,
  StatsGrid,
} from "@/components/common";
import { useListState, useAppointments } from "@/hooks";
import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
} from "@/types/entities.types";
import { STATS_COLORS } from "@/utils/constants";
import { calculateStats, filterItems, sortItems } from "@/utils/filterUtils";
import {
  CalendarToday,
  Schedule,
  Person,
  Visibility,
  Edit,
  VideoCall,
  EventAvailable,
  EventBusy,
  CheckCircle,
  Cancel,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Fade,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { AppointmentDetails, AppointmentForm } from "./";

// TIPOS DE CONTROLE - ADAPTAR CONFORME NECESSÁRIO
type SortOption = "title" | "appointmentDate" | "patient.name" | "status";
type FilterOption =
  | "all"
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled";

export default function AppointmentsList() {
  // HOOK OBRIGATÓRIO - SWR PARA DADOS
  const { appointments, isLoading: loading, mutate } = useAppointments();

  // HOOK OBRIGATÓRIO - ESTADO DE LISTA
  const {
    searchTerm,
    viewMode,
    sortBy,
    filterBy,
    favorites,
    anchorEl,
    setSearchTerm,
    setViewMode,
    setSortBy,
    setFilterBy,
    toggleFavorite,
    handleMenuOpen,
    handleMenuClose,
  } = useListState<"grid" | "list", SortOption, FilterOption>(
    "grid" as const,
    "appointmentDate" as SortOption,
    "all" as FilterOption
  );

  // ESTADOS ESPECÍFICOS DO MÓDULO
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(
    null
  );
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  // FUNÇÃO DE REFRESH OBRIGATÓRIA
  const refreshAppointments = () => mutate();

  // FILTROS E ORDENAÇÃO COM USEMEMO OBRIGATÓRIO
  const filteredAndSortedAppointments = useMemo(() => {
    const searchFields: (keyof Appointment)[] = ["title", "notes"];

    const filterConditions = {
      all: () => true,
      scheduled: (appointment: Appointment) =>
        appointment.status === AppointmentStatus.SCHEDULED,
      confirmed: (appointment: Appointment) =>
        appointment.status === AppointmentStatus.CONFIRMED,
      completed: (appointment: Appointment) =>
        appointment.status === AppointmentStatus.COMPLETED,
      cancelled: (appointment: Appointment) =>
        appointment.status === AppointmentStatus.CANCELLED,
    };

    const sortConditions = {
      title: (a: Appointment, b: Appointment) => a.title.localeCompare(b.title),
      appointmentDate: (a: Appointment, b: Appointment) =>
        new Date(a.appointmentDate).getTime() -
        new Date(b.appointmentDate).getTime(),
      "patient.name": (a: Appointment, b: Appointment) =>
        (a.patient?.name || "").localeCompare(b.patient?.name || ""),
      status: (a: Appointment, b: Appointment) =>
        a.status.localeCompare(b.status),
    };

    const filtered = filterItems(
      appointments || [],
      searchTerm,
      searchFields,
      filterBy,
      filterConditions
    );
    return sortItems(filtered, sortBy, sortConditions);
  }, [appointments, searchTerm, filterBy, sortBy]);

  // ESTATÍSTICAS COM USEMEMO E STATS_COLORS OBRIGATÓRIO
  const stats = useMemo(() => {
    const baseStats = calculateStats(appointments || [], favorites);
    return {
      ...baseStats,
      scheduled: (appointments || []).filter(
        (a) => a.status === AppointmentStatus.SCHEDULED
      ).length,
      confirmed: (appointments || []).filter(
        (a) => a.status === AppointmentStatus.CONFIRMED
      ).length,
      completed: (appointments || []).filter(
        (a) => a.status === AppointmentStatus.COMPLETED
      ).length,
      today: (appointments || []).filter((a) => {
        const today = new Date();
        const appointmentDate = new Date(a.appointmentDate);
        return appointmentDate.toDateString() === today.toDateString();
      }).length,
    };
  }, [appointments, favorites]);

  const statsData = useMemo(
    () => [
      { value: stats.total, label: "Total", ...STATS_COLORS.primary },
      { value: stats.today, label: "Hoje", ...STATS_COLORS.warning },
      { value: stats.scheduled, label: "Agendados", ...STATS_COLORS.primary },
      { value: stats.completed, label: "Concluídos", ...STATS_COLORS.success },
    ],
    [stats]
  );

  // HANDLERS PADRÃO
  const handleViewAppointment = (appointmentId: number) =>
    setSelectedAppointment(appointmentId);
  const handleCloseDetails = () => setSelectedAppointment(null);
  const handleNewAppointment = () => {
    setEditingAppointment(null);
    setShowForm(true);
  };
  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };
  const handleFormSuccess = () => {
    refreshAppointments();
    setShowForm(false);
    setEditingAppointment(null);
  };
  const handleFormClose = () => {
    setShowForm(false);
    setEditingAppointment(null);
  };

  // Função para formatar data
  const formatAppointmentDate = (date: string) => {
    const appointmentDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (appointmentDate.toDateString() === today.toDateString()) {
      return `Hoje às ${appointmentDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
    } else if (appointmentDate.toDateString() === tomorrow.toDateString()) {
      return `Amanhã às ${appointmentDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
    } else {
      return appointmentDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  // Função para obter cor do status
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return "info";
      case AppointmentStatus.CONFIRMED:
        return "warning";
      case AppointmentStatus.COMPLETED:
        return "success";
      case AppointmentStatus.CANCELLED:
        return "error";
      case AppointmentStatus.NO_SHOW:
        return "default";
      default:
        return "default";
    }
  };

  // Função para obter ícone do status
  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return <Schedule fontSize="small" />;
      case AppointmentStatus.CONFIRMED:
        return <EventAvailable fontSize="small" />;
      case AppointmentStatus.COMPLETED:
        return <CheckCircle fontSize="small" />;
      case AppointmentStatus.CANCELLED:
        return <Cancel fontSize="small" />;
      case AppointmentStatus.NO_SHOW:
        return <EventBusy fontSize="small" />;
      default:
        return <Schedule fontSize="small" />;
    }
  };

  // LOADING STATE OBRIGATÓRIO
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="400px"
      >
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" sx={{ color: "#94A3B8" }}>
          Carregando agendamentos...
        </Typography>
      </Box>
    );
  }

  // RENDER PADRÃO OBRIGATÓRIO
  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          borderRadius: 3,
          p: 3,
          mb: 3,
          border: "1px solid rgba(59, 130, 246, 0.1)",
        }}
      >
        <ModuleHeader
          title="Agendamentos"
          subtitle="Gerencie os agendamentos de consultas"
          icon={<CalendarToday sx={{ fontSize: 28 }} />}
          onRefresh={refreshAppointments}
          onAdd={handleNewAppointment}
          addButtonText="Novo Agendamento"
        />

        {/* Grid de estatísticas */}
        <StatsGrid stats={statsData} />
      </Paper>

      <FilterControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar agendamentos..."
        filterBy={filterBy}
        onFilterChange={(value) => setFilterBy(value as FilterOption)}
        filterOptions={[
          { value: "all", label: "Todos" },
          { value: "scheduled", label: "Agendados" },
          { value: "confirmed", label: "Confirmados" },
          { value: "completed", label: "Concluídos" },
          { value: "cancelled", label: "Cancelados" },
        ]}
        sortBy={sortBy}
        onSortChange={(value) => setSortBy(value as SortOption)}
        sortOptions={[
          { value: "appointmentDate", label: "Data" },
          { value: "title", label: "Título" },
          { value: "patient.name", label: "Paciente" },
          { value: "status", label: "Status" },
        ]}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onMenuOpen={handleMenuOpen}
        anchorEl={anchorEl}
        onMenuClose={handleMenuClose}
      />

      {filteredAndSortedAppointments.length === 0 ? (
        <EmptyState
          icon={<CalendarToday sx={{ fontSize: 48, color: "#94A3B8" }} />}
          title="Nenhum agendamento encontrado"
          description="Não há agendamentos que correspondam aos critérios de busca."
          actionText="Criar Primeiro Agendamento"
          onAction={handleNewAppointment}
        />
      ) : (
        <Grid container spacing={3}>
          {filteredAndSortedAppointments.map((appointment, index) => (
            <Grid
              item
              xs={12}
              md={viewMode === "grid" ? 6 : 12}
              lg={viewMode === "grid" ? 4 : 12}
              key={appointment.id}
            >
              <Fade in timeout={300 + index * 100}>
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.8) 100%)",
                    borderRadius: 3,
                    border: "1px solid rgba(59, 130, 246, 0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)",
                      borderColor: "rgba(59, 130, 246, 0.3)",
                    },
                    position: "relative",
                    overflow: "visible",
                    cursor: "pointer",
                  }}
                  onClick={() => handleViewAppointment(appointment.id)}
                >
                  {favorites.has(appointment.id) && (
                    <Chip
                      icon={<Favorite />}
                      label="Favorito"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: -10,
                        right: 16,
                        backgroundColor: "#F59E0B",
                        color: "white",
                        fontWeight: 600,
                        zIndex: 1,
                      }}
                    />
                  )}

                  <CardContent sx={{ p: 3 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={2}
                    >
                      <Box display="flex" alignItems="center" flex={1}>
                        <Avatar
                          sx={{
                            bgcolor: "rgba(59, 130, 246, 0.2)",
                            color: "#3B82F6",
                            mr: 2,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <CalendarToday />
                        </Avatar>
                        <Box flex={1}>
                          <Typography
                            variant="h6"
                            component="div"
                            sx={{
                              color: "#F1F5F9",
                              fontWeight: 600,
                              mb: 0.5,
                            }}
                          >
                            {appointment.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                            {appointment.patient?.name ||
                              "Paciente não informado"}
                          </Typography>
                        </Box>
                      </Box>
                      <Box display="flex" gap={1}>
                        <Tooltip
                          title={
                            favorites.has(appointment.id)
                              ? "Remover dos favoritos"
                              : "Adicionar aos favoritos"
                          }
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(appointment.id);
                            }}
                            sx={{
                              color: favorites.has(appointment.id)
                                ? "#F59E0B"
                                : "#64748B",
                              "&:hover": {
                                color: favorites.has(appointment.id)
                                  ? "#D97706"
                                  : "#3B82F6",
                              },
                            }}
                          >
                            {favorites.has(appointment.id) ? (
                              <Favorite />
                            ) : (
                              <FavoriteBorder />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Chip
                          label={appointment.status
                            .replace("_", " ")
                            .toUpperCase()}
                          color={getStatusColor(appointment.status) as any}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                    </Box>

                    <Box mb={2}>
                      <Typography
                        variant="body2"
                        display="flex"
                        alignItems="center"
                        mb={1}
                        sx={{ color: "#E2E8F0" }}
                      >
                        <Schedule
                          sx={{ mr: 1, fontSize: "1rem", color: "#06B6D4" }}
                        />
                        <strong>Data:</strong>{" "}
                        {formatAppointmentDate(appointment.appointmentDate)}
                      </Typography>
                      <Typography
                        variant="body2"
                        display="flex"
                        alignItems="center"
                        mb={1}
                        sx={{ color: "#E2E8F0" }}
                      >
                        <Person
                          sx={{ mr: 1, fontSize: "1rem", color: "#10B981" }}
                        />
                        <strong>Duração:</strong> {appointment.duration} minutos
                      </Typography>
                      {appointment.googleMeetLink && (
                        <Typography
                          variant="body2"
                          display="flex"
                          alignItems="center"
                          mb={1}
                          sx={{ color: "#E2E8F0" }}
                        >
                          <VideoCall
                            sx={{ mr: 1, fontSize: "1rem", color: "#8B5CF6" }}
                          />
                          <strong>Google Meet:</strong> Disponível
                        </Typography>
                      )}
                    </Box>

                    <Divider
                      sx={{ my: 2, borderColor: "rgba(59, 130, 246, 0.1)" }}
                    />

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="caption" sx={{ color: "#64748B" }}>
                        Agendado em{" "}
                        {new Date(
                          appointment.createdAt || appointment.appointmentDate
                        ).toLocaleDateString("pt-BR")}
                      </Typography>
                      <Box display="flex" gap={1}>
                        <Tooltip title="Ver detalhes">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewAppointment(appointment.id);
                            }}
                            sx={{
                              color: "#3B82F6",
                              "&:hover": {
                                backgroundColor: "rgba(59, 130, 246, 0.1)",
                              },
                            }}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAppointment(appointment);
                            }}
                            sx={{
                              color: "#10B981",
                              "&:hover": {
                                backgroundColor: "rgba(16, 185, 129, 0.1)",
                              },
                            }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal de detalhes */}
      {selectedAppointment && (
        <AppointmentDetails
          appointmentId={selectedAppointment}
          onClose={handleCloseDetails}
          onUpdate={refreshAppointments}
        />
      )}

      {/* Modal de formulário */}
      {showForm && (
        <AppointmentForm
          open={showForm}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          appointment={editingAppointment || undefined}
        />
      )}
    </Box>
  );
}
