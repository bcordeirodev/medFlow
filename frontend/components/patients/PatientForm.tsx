"use client";

import { FormTextField, FormSelectField } from "@/components/common/FormField";
import { useForm } from "@/hooks/useForm";
import { usePatients } from "@/hooks/usePatients";
import { PatientFormData, patientSchema } from "@/lib/schemas";
import { ErrorHandler } from "@/utils/errorHandler";
import { Cancel, Person, Save } from "@mui/icons-material";
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
import { useEffect } from "react";
import { useNotification } from "../../contexts";

interface PatientFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  patient?: any; // Para edição
}

export default function PatientForm({
  open,
  onClose,
  onSuccess,
  patient,
}: PatientFormProps) {
  const { createPatient, updatePatient } = usePatients();
  const { showSuccess } = useNotification();

  const form = useForm<PatientFormData>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      cpf: "",
      birthDate: "",
      gender: "M" as const,
      address: "",
      allergies: "",
      medicalHistory: "",
      observations: "",
    },
    validationSchema: patientSchema,
    onSubmit: async (values) => {
      try {
        if (patient) {
          await updatePatient(patient.id, values);
          showSuccess(`Paciente ${values.name} atualizado com sucesso`);
        } else {
          await createPatient(values);
          showSuccess(`Paciente ${values.name} criado com sucesso`);
        }
        onSuccess?.();
        onClose();
      } catch (error: any) {
        const errorMessage = ErrorHandler.extractErrorMessage(error);
        ErrorHandler.logError(
          error,
          patient ? "Atualização de paciente" : "Criação de paciente"
        );
        throw new Error(errorMessage);
      }
    },
  });

  // Atualizar valores do formulário quando patient prop mudar
  useEffect(() => {
    if (patient) {
      form.setValues({
        name: patient.name || "",
        email: patient.email || "",
        phone: patient.phone || "",
        cpf: patient.cpf || "",
        birthDate: patient.birthDate ? patient.birthDate.split("T")[0] : "",
        gender: patient.gender || "M",
        address: patient.address || "",
        allergies: patient.allergies || "",
        medicalHistory: patient.medicalHistory || "",
        observations: patient.observations || "",
      });
    } else {
      form.resetForm();
    }
  }, [patient]); // Removido 'form' das dependências para evitar loop infinito

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "12px 12px 0 0",
          p: 3,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Person sx={{ color: "white", fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "white" }}>
            {patient ? "Editar Paciente" : "Novo Paciente"}
          </Typography>
        </Box>
      </DialogTitle>
      <form onSubmit={form.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormTextField
                name="name"
                label="Nome Completo"
                value={form.values.name}
                onChange={(value) => form.setFieldValue("name", value)}
                onBlur={() => form.setFieldTouched("name")}
                error={form.errors.name}
                touched={form.touched.name}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormTextField
                name="email"
                label="Email"
                type="email"
                value={form.values.email}
                onChange={(value) => form.setFieldValue("email", value)}
                onBlur={() => form.setFieldTouched("email")}
                error={form.errors.email}
                touched={form.touched.email}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormTextField
                name="phone"
                label="Telefone"
                value={form.values.phone}
                onChange={(value) => form.setFieldValue("phone", value)}
                onBlur={() => form.setFieldTouched("phone")}
                error={form.errors.phone}
                touched={form.touched.phone}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormTextField
                name="cpf"
                label="CPF"
                value={form.values.cpf}
                onChange={(value) => form.setFieldValue("cpf", value)}
                onBlur={() => form.setFieldTouched("cpf")}
                error={form.errors.cpf}
                touched={form.touched.cpf}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormTextField
                name="birthDate"
                label="Data de Nascimento"
                type="date"
                value={form.values.birthDate}
                onChange={(value) => form.setFieldValue("birthDate", value)}
                onBlur={() => form.setFieldTouched("birthDate")}
                error={form.errors.birthDate}
                touched={form.touched.birthDate}
                required
                textFieldProps={{ InputLabelProps: { shrink: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormSelectField
                name="gender"
                label="Gênero"
                value={form.values.gender}
                onChange={(value) => form.setFieldValue("gender", value)}
                onBlur={() => form.setFieldTouched("gender")}
                error={form.errors.gender}
                touched={form.touched.gender}
                options={[
                  { value: "M", label: "Masculino" },
                  { value: "F", label: "Feminino" },
                ]}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormTextField
                name="address"
                label="Endereço"
                value={form.values.address}
                onChange={(value) => form.setFieldValue("address", value)}
                onBlur={() => form.setFieldTouched("address")}
                error={form.errors.address}
                touched={form.touched.address}
                required
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <FormTextField
                name="allergies"
                label="Alergias"
                value={form.values.allergies || ""}
                onChange={(value) => form.setFieldValue("allergies", value)}
                onBlur={() => form.setFieldTouched("allergies")}
                error={form.errors.allergies}
                touched={form.touched.allergies}
                helperText="Informe as alergias conhecidas do paciente"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <FormTextField
                name="medicalHistory"
                label="Histórico Médico"
                value={form.values.medicalHistory || ""}
                onChange={(value) =>
                  form.setFieldValue("medicalHistory", value)
                }
                onBlur={() => form.setFieldTouched("medicalHistory")}
                error={form.errors.medicalHistory}
                touched={form.touched.medicalHistory}
                helperText="Informações relevantes do histórico médico"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <FormTextField
                name="observations"
                label="Observações"
                value={form.values.observations || ""}
                onChange={(value) => form.setFieldValue("observations", value)}
                onBlur={() => form.setFieldTouched("observations")}
                error={form.errors.observations}
                touched={form.touched.observations}
                helperText="Observações adicionais sobre o paciente"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={onClose}
            startIcon={<Cancel />}
            disabled={form.isSubmitting}
            sx={{
              border: "2px solid rgba(239, 68, 68, 0.6)",
              color: "#EF4444",
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              backgroundColor: "rgba(239, 68, 68, 0.3)",
              "&:hover": {
                backgroundColor: "rgba(239, 68, 68, 0.5)",
                border: "2px solid rgba(239, 68, 68, 0.8)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={
              form.isSubmitting ? <CircularProgress size={20} /> : <Save />
            }
            disabled={form.isSubmitting}
            sx={{
              background: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
              color: "white",
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              boxShadow: "0 4px 15px rgba(5, 150, 105, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                boxShadow: "0 6px 20px rgba(5, 150, 105, 0.6)",
                transform: "translateY(-2px)",
              },
              "&:disabled": {
                background: "linear-gradient(135deg, #475569 0%, #64748B 100%)",
                transform: "none",
                boxShadow: "none",
              },
              transition: "all 0.3s ease",
            }}
          >
            {form.isSubmitting ? "Salvando..." : "Salvar Paciente"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
