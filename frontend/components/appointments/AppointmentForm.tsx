"use client";

// IMPORTS OBRIGATÓRIOS - NUNCA CRIAR NOVOS
import { FormTextField, FormSelectField } from "@/components/common/FormField";
import { useNotification } from "@/contexts/NotificationContext";
import { useForm } from "@/hooks/useForm";
import { useAppointments, usePatients } from "@/hooks";
import { appointmentSchema, AppointmentFormData } from "@/lib/schemas";
import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
} from "@/types/entities.types";
import { ErrorHandler } from "@/utils/errorHandler";
import { CalendarToday, Save, Cancel } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useMemo } from "react";

interface AppointmentFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  appointment?: Appointment;
}

export default function AppointmentForm({
  open,
  onClose,
  onSuccess,
  appointment,
}: AppointmentFormProps) {
  const { createAppointment, updateAppointment } = useAppointments();
  const { patients } = usePatients();
  const { showSuccess, showError } = useNotification();

  // USEFORM OBRIGATÓRIO
  const form = useForm<AppointmentFormData>({
    initialValues: {
      title: "",
      description: "",
      appointmentDate: "",
      duration: 30,
      status: AppointmentStatus.SCHEDULED,
      type: AppointmentType.CONSULTATION,
      notes: "",
      patientId: 0,
    },
    validationSchema: appointmentSchema,
    onSubmit: async (values) => {
      try {
        if (appointment) {
          await updateAppointment(appointment.id, values);
          showSuccess(`Agendamento "${values.title}" atualizado com sucesso!`);
        } else {
          await createAppointment(values);
          showSuccess(`Agendamento "${values.title}" criado com sucesso!`);
        }
        onSuccess?.();
        onClose();
      } catch (error) {
        const errorMessage = ErrorHandler.extractErrorMessage(error);
        ErrorHandler.logError(error, "Appointment Form");
        showError(errorMessage);
      }
    },
  });

  // Opções de pacientes
  const patientOptions = useMemo(() => {
    return (patients || []).map((patient) => ({
      value: patient.id,
      label: patient.name,
    }));
  }, [patients]);

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

  // Opções de duração
  const durationOptions = [
    { value: 15, label: "15 minutos" },
    { value: 30, label: "30 minutos" },
    { value: 45, label: "45 minutos" },
    { value: 60, label: "1 hora" },
    { value: 90, label: "1h 30min" },
    { value: 120, label: "2 horas" },
  ];

  // RESET FORM OBRIGATÓRIO
  useEffect(() => {
    if (open) {
      if (appointment) {
        // Preparar data/hora no formato correto para datetime-local
        const appointmentDate = new Date(appointment.appointmentDate);
        const localISOTime = new Date(
          appointmentDate.getTime() -
            appointmentDate.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 16);

        form.setValues({
          title: appointment.title,
          description: appointment.description || "",
          appointmentDate: localISOTime,
          duration: appointment.duration,
          status: appointment.status,
          type: appointment.type,
          notes: appointment.notes || "",
          patientId: appointment.patientId,
        });
      } else {
        // Para novo agendamento, definir data/hora padrão para próxima hora
        const now = new Date();
        const nextHour = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours() + 1,
          0
        );
        const localISOTime = new Date(
          nextHour.getTime() - nextHour.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 16);

        form.resetForm();
        form.setFieldValue("appointmentDate", localISOTime);
      }
    }
  }, [open, appointment]);

  // SEMPRE USAR FormTextField/FormSelectField
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <CalendarToday sx={{ color: "#3B82F6" }} />
          <Typography variant="h6" sx={{ color: "#1E293B", fontWeight: 600 }}>
            {appointment ? "Editar Agendamento" : "Novo Agendamento"}
          </Typography>
        </Box>
      </DialogTitle>

      <form onSubmit={form.handleSubmit}>
        <DialogContent>
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
              <FormSelectField
                name="patientId"
                label="Paciente"
                value={form.values.patientId || ""}
                onChange={(value) =>
                  form.setFieldValue("patientId", Number(value))
                }
                onBlur={() => form.setFieldTouched("patientId")}
                error={form.errors.patientId}
                touched={form.touched.patientId}
                options={patientOptions}
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

            <Grid item xs={12} md={4}>
              <FormSelectField
                name="duration"
                label="Duração"
                value={form.values.duration || ""}
                onChange={(value) =>
                  form.setFieldValue("duration", Number(value))
                }
                onBlur={() => form.setFieldTouched("duration")}
                error={form.errors.duration}
                touched={form.touched.duration}
                options={durationOptions}
                disabled={form.isSubmitting}
              />
            </Grid>

            <Grid item xs={12} md={4}>
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

            <Grid item xs={12} md={4}>
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
                helperText="Observações internas sobre o agendamento"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={onClose}
            disabled={form.isSubmitting}
            startIcon={<Cancel />}
            sx={{ mr: 1 }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={form.isSubmitting || !form.isValid}
            startIcon={
              form.isSubmitting ? <CircularProgress size={20} /> : <Save />
            }
            sx={{
              background: "linear-gradient(45deg, #3B82F6 30%, #1D4ED8 90%)",
              px: 3,
            }}
          >
            {form.isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
