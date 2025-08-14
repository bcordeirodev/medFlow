"use client";

// IMPORTS OBRIGATÓRIOS
import { useAppointment, useAppointments } from "@/hooks/useAppointments";
import { useForm } from "@/hooks/useForm";
import { FormTextField, FormSelectField } from "@/components/common/FormField";
import { appointmentSchema, AppointmentFormData } from "@/lib/schemas";
import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
} from "@/types/entities.types";
import { ErrorHandler } from "@/utils/errorHandler";
import { useNotification } from "@/contexts/NotificationContext";
import {
  CalendarToday,
  Person,
  Schedule,
  Notes,
  VideoCall,
  Edit,
  Close,
  Save,
  Cancel,
  EventAvailable,
  EventBusy,
  CheckCircle,
} from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Button,
  Grid,
  CircularProgress,
  Link,
  Paper,
  Alert,
} from "@mui/material";
import { useState, useMemo, useEffect } from "react";

interface AppointmentDetailsProps {
  appointmentId: number;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function AppointmentDetails({
  appointmentId,
  onClose,
  onUpdate,
}: AppointmentDetailsProps) {
  // HOOK ESPECÍFICO OBRIGATÓRIO
  const { appointment, isLoading, mutate } = useAppointment(appointmentId);
  const { updateAppointment, generateMeetLink } = useAppointments();
  const [editing, setEditing] = useState(false);
  const [generatingMeetLink, setGeneratingMeetLink] = useState(false);
  const { showSuccess, showError } = useNotification();

  // USEFORM PARA EDIÇÃO
  const form = useForm<AppointmentFormData>({
    initialValues: {
      title: appointment?.title || "",
      description: appointment?.description || "",
      appointmentDate: appointment?.appointmentDate || "",
      duration: appointment?.duration || 30,
      status: appointment?.status || AppointmentStatus.SCHEDULED,
      type: appointment?.type || AppointmentType.CONSULTATION,
      notes: appointment?.notes || "",
      patientId: appointment?.patientId || 0,
    },
    validationSchema: appointmentSchema,
    onSubmit: async (values) => {
      try {
        await mutate(async () => {
          const updatedAppointment = await updateAppointment(
            appointmentId,
            values
          );
          return updatedAppointment;
        }, false);
        await mutate();
        showSuccess(`Agendamento ${values.title} atualizado com sucesso`);
        setEditing(false);
        onUpdate?.();
      } catch (error) {
        const errorMessage = ErrorHandler.extractErrorMessage(error);
        ErrorHandler.logError(error, "Appointment Details Update");
        showError(errorMessage);
      }
    },
  });

  // Opções de status
  const statusOptions = [
    { value: AppointmentStatus.SCHEDULED, label: "Agendado" },
    { value: AppointmentStatus.CONFIRMED, label: "Confirmado" },
    { value: AppointmentStatus.COMPLETED, label: "Concluído" },
    { value: AppointmentStatus.CANCELLED, label: "Cancelado" },
    { value: AppointmentStatus.NO_SHOW, label: "Não Compareceu" },
  ];

  // Opções de tipo
  const typeOptions = [
    { value: AppointmentType.CONSULTATION, label: "Consulta" },
    { value: AppointmentType.FOLLOW_UP, label: "Retorno" },
    { value: AppointmentType.EMERGENCY, label: "Emergência" },
    { value: AppointmentType.ROUTINE, label: "Rotina" },
  ];

  // Função para formatar data
  const formatAppointmentDate = (date: string) => {
    const appointmentDate = new Date(date);
    return appointmentDate.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  // Função para gerar link do Google Meet
  const handleGenerateMeetLink = async () => {
    if (!appointment) return;

    setGeneratingMeetLink(true);
    try {
      const result = await generateMeetLink(appointment.id);
      await mutate();
      showSuccess("Link do Google Meet gerado com sucesso!");
    } catch (error) {
      const errorMessage = ErrorHandler.extractErrorMessage(error);
      showError(errorMessage);
    } finally {
      setGeneratingMeetLink(false);
    }
  };

  // Preparar data para edição
  const prepareEditingValues = useMemo(() => {
    if (!appointment) {
      return {
        title: "",
        description: "",
        appointmentDate: "",
        duration: 30,
        status: AppointmentStatus.SCHEDULED,
        type: AppointmentType.CONSULTATION,
        notes: "",
        patientId: 0,
      };
    }

    const appointmentDate = new Date(appointment.appointmentDate);
    const localISOTime = new Date(
      appointmentDate.getTime() - appointmentDate.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);

    return {
      title: appointment.title,
      description: appointment.description || "",
      appointmentDate: localISOTime,
      duration: appointment.duration,
      status: appointment.status,
      type: appointment.type,
      notes: appointment.notes || "",
      patientId: appointment.patientId,
    };
  }, [appointment]);

  // Atualizar form quando entrar em modo de edição
  useEffect(() => {
    if (editing && appointment) {
      form.setValues(prepareEditingValues);
    }
  }, [editing, appointment, prepareEditingValues]);

  // Loading state
  if (isLoading) {
    return (
      <Dialog open onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={200}
          >
            <CircularProgress size={60} />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (!appointment) {
    return (
      <Dialog open onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Alert severity="error">Agendamento não encontrado</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Fechar</Button>
        </DialogActions>
      </Dialog>
    );
  }

  // SEMPRE USAR FormTextField COM OPTIONAL CHAINING
  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarToday sx={{ color: "#3B82F6" }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {editing ? "Editar Agendamento" : "Detalhes do Agendamento"}
            </Typography>
          </Box>
          <Box>
            {!editing && (
              <IconButton
                onClick={() => {
                  setEditing(true);
                  form.setValues(prepareEditingValues);
                }}
                sx={{ mr: 1 }}
              >
                <Edit />
              </IconButton>
            )}
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <form onSubmit={form.handleSubmit}>
        <DialogContent>
          {!editing ? (
            // Modo visualização
            <Box>
              <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      {appointment.title}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Person color="primary" />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Paciente
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {appointment.patient?.name || "Não informado"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Schedule color="primary" />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Data e Hora
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {formatAppointmentDate(appointment.appointmentDate)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box mb={2}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Status
                      </Typography>
                      <Chip
                        icon={getStatusIcon(appointment.status)}
                        label={appointment.status
                          .replace("_", " ")
                          .toUpperCase()}
                        color={getStatusColor(appointment.status) as any}
                        variant="outlined"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box mb={2}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Tipo
                      </Typography>
                      <Typography variant="body1">
                        {typeOptions.find((t) => t.value === appointment.type)
                          ?.label || appointment.type}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box mb={2}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Duração
                      </Typography>
                      <Typography variant="body1">
                        {appointment.duration} minutos
                      </Typography>
                    </Box>
                  </Grid>

                  {appointment.description && (
                    <Grid item xs={12}>
                      <Box mb={2}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Descrição
                        </Typography>
                        <Typography variant="body1">
                          {appointment.description}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {appointment.notes && (
                    <Grid item xs={12}>
                      <Box mb={2}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Observações
                        </Typography>
                        <Typography variant="body1">
                          {appointment.notes}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Paper>

              {/* Google Meet Section */}
              <Paper elevation={1} sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <VideoCall color="success" />
                  <Typography variant="h6" fontWeight={600}>
                    Google Meet
                  </Typography>
                </Box>

                {appointment.googleMeetLink ? (
                  <Box>
                    <Alert severity="success" sx={{ mb: 2 }}>
                      Link do Google Meet disponível
                    </Alert>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<VideoCall />}
                      href={appointment.googleMeetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      fullWidth
                    >
                      Entrar na Reunião
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Nenhum link do Google Meet foi gerado para este
                      agendamento
                    </Alert>
                    <Button
                      variant="outlined"
                      startIcon={
                        generatingMeetLink ? (
                          <CircularProgress size={20} />
                        ) : (
                          <VideoCall />
                        )
                      }
                      onClick={handleGenerateMeetLink}
                      disabled={generatingMeetLink}
                      fullWidth
                    >
                      {generatingMeetLink
                        ? "Gerando..."
                        : "Gerar Link do Google Meet"}
                    </Button>
                  </Box>
                )}
              </Paper>
            </Box>
          ) : (
            // Modo edição
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormTextField
                  name="title"
                  label="Título"
                  value={form.values.title || ""}
                  onChange={(value) => form.setFieldValue("title", value)}
                  onBlur={() => form.setFieldTouched("title")}
                  error={form.errors.title}
                  touched={form.touched.title}
                  required
                  disabled={form.isSubmitting}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormTextField
                  name="appointmentDate"
                  label="Data e Hora"
                  type="datetime-local"
                  value={form.values.appointmentDate || ""}
                  onChange={(value) =>
                    form.setFieldValue("appointmentDate", value)
                  }
                  onBlur={() => form.setFieldTouched("appointmentDate")}
                  error={form.errors.appointmentDate}
                  touched={form.touched.appointmentDate}
                  required
                  disabled={form.isSubmitting}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormTextField
                  name="duration"
                  label="Duração (minutos)"
                  type="number"
                  value={form.values.duration?.toString() || "30"}
                  onChange={(value) =>
                    form.setFieldValue("duration", Number(value))
                  }
                  onBlur={() => form.setFieldTouched("duration")}
                  error={form.errors.duration}
                  touched={form.touched.duration}
                  disabled={form.isSubmitting}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormSelectField
                  name="status"
                  label="Status"
                  value={form.values.status || ""}
                  onChange={(value) => form.setFieldValue("status", value)}
                  onBlur={() => form.setFieldTouched("status")}
                  error={form.errors.status}
                  touched={form.touched.status}
                  options={statusOptions}
                  disabled={form.isSubmitting}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormSelectField
                  name="type"
                  label="Tipo"
                  value={form.values.type || ""}
                  onChange={(value) => form.setFieldValue("type", value)}
                  onBlur={() => form.setFieldTouched("type")}
                  error={form.errors.type}
                  touched={form.touched.type}
                  options={typeOptions}
                  disabled={form.isSubmitting}
                />
              </Grid>

              <Grid item xs={12}>
                <FormTextField
                  name="description"
                  label="Descrição"
                  value={form.values.description || ""}
                  onChange={(value) => form.setFieldValue("description", value)}
                  onBlur={() => form.setFieldTouched("description")}
                  error={form.errors.description}
                  touched={form.touched.description}
                  multiline
                  rows={3}
                  disabled={form.isSubmitting}
                />
              </Grid>

              <Grid item xs={12}>
                <FormTextField
                  name="notes"
                  label="Observações"
                  value={form.values.notes || ""}
                  onChange={(value) => form.setFieldValue("notes", value)}
                  onBlur={() => form.setFieldTouched("notes")}
                  error={form.errors.notes}
                  touched={form.touched.notes}
                  multiline
                  rows={2}
                  disabled={form.isSubmitting}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          {editing ? (
            <>
              <Button
                onClick={() => setEditing(false)}
                disabled={form.isSubmitting}
                startIcon={<Cancel />}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={form.isSubmitting}
                startIcon={
                  form.isSubmitting ? <CircularProgress size={20} /> : <Save />
                }
              >
                {form.isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </>
          ) : (
            <Button onClick={onClose} variant="outlined">
              Fechar
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}
