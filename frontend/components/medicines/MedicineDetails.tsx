"use client";

import { FormTextField } from "@/components/common/FormField";
import { useMedicine } from "@/hooks/useMedicines";
import { useForm } from "@/hooks/useForm";
import { MedicineFormData, medicineSchema } from "@/lib/schemas";
import { MedicinesService } from "@/services/medicines.service";
import { ErrorHandler } from "@/utils/errorHandler";
import { Cancel, Edit, Save, MedicalServices } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNotification } from "../../contexts";

interface MedicineDetailsProps {
  medicineId: number;
  onClose: () => void;
  onUpdate: () => void;
  initialEditMode?: boolean; // Iniciar em modo de edição
}

export default function MedicineDetails({
  medicineId,
  onClose,
  onUpdate,
  initialEditMode = false,
}: MedicineDetailsProps) {
  const isCreating = medicineId === 0;
  const { medicine, isLoading } = useMedicine(isCreating ? null : medicineId);
  const [editing, setEditing] = useState(initialEditMode || isCreating);
  const { showSuccess } = useNotification();

  const form = useForm<MedicineFormData>({
    initialValues: {
      name: medicine?.name || "",
      manufacturer: medicine?.manufacturer || "",
      description: medicine?.description || "",
      dosage: medicine?.dosage || "",
      activeIngredient: medicine?.activeIngredient || "",
      contraindications: medicine?.contraindications || "",
      sideEffects: medicine?.sideEffects || "",
    },
    validationSchema: medicineSchema,
    onSubmit: async (values) => {
      try {
        if (isCreating) {
          await MedicinesService.createMedicine(values);
          showSuccess("Medicamento criado com sucesso");
          onUpdate();
          onClose();
        } else {
          await MedicinesService.updateMedicine(medicineId, values);
          showSuccess(`Medicamento ${values.name} atualizado com sucesso`);
          setEditing(false);
          onClose();
          onUpdate();
        }
      } catch (error: any) {
        const errorMessage = ErrorHandler.extractErrorMessage(error);
        ErrorHandler.logError(
          error,
          isCreating ? "Criação de medicamento" : "Atualização de medicamento"
        );
        throw new Error(errorMessage);
      }
    },
  });

  // Atualizar valores do formulário quando medicine muda
  if (medicine && !isCreating && form.values.name === "") {
    form.setValues({
      name: medicine.name || "",
      manufacturer: medicine.manufacturer || "",
      description: medicine.description || "",
      dosage: medicine.dosage || "",
      activeIngredient: medicine.activeIngredient || "",
      contraindications: medicine.contraindications || "",
      sideEffects: medicine.sideEffects || "",
    });
  }

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    form.resetForm();
  };

  const handleSave = () => {
    form.handleSubmit(new Event("submit") as any);
  };

  if (isLoading && !isCreating) {
    return (
      <Dialog
        open={true}
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
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="400px"
          >
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#94A3B8" }}>
              Carregando medicamento...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (!medicine && !isCreating) {
    return (
      <Dialog
        open={true}
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
        <DialogContent>
          <Alert severity="error">Medicamento não encontrado</Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              border: "2px solid rgba(59, 130, 246, 0.6)",
              color: "#3B82F6",
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              backgroundColor: "rgba(59, 130, 246, 0.3)",
              "&:hover": {
                backgroundColor: "rgba(59, 130, 246, 0.5)",
                border: "2px solid rgba(59, 130, 246, 0.8)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={true}
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
          <MedicalServices sx={{ color: "white", fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "white" }}>
            {isCreating
              ? "Novo Medicamento"
              : editing
                ? "Editar Medicamento"
                : "Detalhes do Medicamento"}
          </Typography>
        </Box>
        {!editing && !isCreating && (
          <IconButton
            onClick={handleEdit}
            sx={{
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
              },
            }}
          >
            <Edit />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Informações Básicas */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#F1F5F9", fontWeight: 600 }}
            >
              Informações Básicas
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="name"
              label="Nome"
              value={
                editing || isCreating
                  ? form.values.name || ""
                  : medicine?.name || ""
              }
              onChange={(value) => form.setFieldValue("name", value)}
              onBlur={() => form.setFieldTouched("name")}
              error={form.errors.name}
              touched={form.touched.name}
              disabled={!editing && !isCreating}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="manufacturer"
              label="Fabricante"
              value={
                editing || isCreating
                  ? form.values.manufacturer || ""
                  : medicine?.manufacturer || ""
              }
              onChange={(value) => form.setFieldValue("manufacturer", value)}
              onBlur={() => form.setFieldTouched("manufacturer")}
              error={form.errors.manufacturer}
              touched={form.touched.manufacturer}
              disabled={!editing && !isCreating}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="dosage"
              label="Dosagem"
              value={
                editing || isCreating
                  ? form.values.dosage || ""
                  : medicine?.dosage || ""
              }
              onChange={(value) => form.setFieldValue("dosage", value)}
              onBlur={() => form.setFieldTouched("dosage")}
              error={form.errors.dosage}
              touched={form.touched.dosage}
              disabled={!editing && !isCreating}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="activeIngredient"
              label="Princípio Ativo"
              value={
                editing || isCreating
                  ? form.values.activeIngredient || ""
                  : medicine?.activeIngredient || ""
              }
              onChange={(value) =>
                form.setFieldValue("activeIngredient", value)
              }
              onBlur={() => form.setFieldTouched("activeIngredient")}
              error={form.errors.activeIngredient}
              touched={form.touched.activeIngredient}
              disabled={!editing && !isCreating}
            />
          </Grid>

          <Grid item xs={12}>
            <FormTextField
              name="description"
              label="Descrição"
              value={
                editing || isCreating
                  ? form.values.description || ""
                  : medicine?.description || ""
              }
              onChange={(value) => form.setFieldValue("description", value)}
              onBlur={() => form.setFieldTouched("description")}
              error={form.errors.description}
              touched={form.touched.description}
              disabled={!editing && !isCreating}
              multiline
              rows={3}
            />
          </Grid>

          <Divider sx={{ width: "100%", my: 2 }} />

          {/* Informações de Segurança */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Informações de Segurança
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <FormTextField
              name="contraindications"
              label="Contraindicações"
              value={
                editing || isCreating
                  ? form.values.contraindications || ""
                  : medicine?.contraindications || ""
              }
              onChange={(value) =>
                form.setFieldValue("contraindications", value)
              }
              onBlur={() => form.setFieldTouched("contraindications")}
              error={form.errors.contraindications}
              touched={form.touched.contraindications}
              disabled={!editing && !isCreating}
              multiline
              rows={3}
            />
          </Grid>

          <Grid item xs={12}>
            <FormTextField
              name="sideEffects"
              label="Efeitos Colaterais"
              value={
                editing || isCreating
                  ? form.values.sideEffects || ""
                  : medicine?.sideEffects || ""
              }
              onChange={(value) => form.setFieldValue("sideEffects", value)}
              onBlur={() => form.setFieldTouched("sideEffects")}
              error={form.errors.sideEffects}
              touched={form.touched.sideEffects}
              disabled={!editing && !isCreating}
              multiline
              rows={3}
            />
          </Grid>

          {/* Status */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" color="text.secondary">
                Status:
              </Typography>
              <Chip
                label={medicine?.isActive ? "Ativo" : "Inativo"}
                color={medicine?.isActive ? "success" : "error"}
                size="small"
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        {editing ? (
          <>
            <Button
              onClick={handleCancel}
              startIcon={<Cancel />}
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
              onClick={handleSave}
              variant="contained"
              startIcon={<Save />}
              sx={{
                background: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
                color: "white",
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: 2,
                boxShadow: "0 4px 15px rgba(5, 150, 105, 0.4)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                  boxShadow: "0 6px 20px rgba(5, 150, 105, 0.6)",
                  transform: "translateY(-2px)",
                },
                "&:disabled": {
                  background:
                    "linear-gradient(135deg, #475569 0%, #64748B 100%)",
                  transform: "none",
                  boxShadow: "none",
                },
                transition: "all 0.3s ease",
              }}
            >
              Salvar Medicamento
            </Button>
          </>
        ) : (
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              border: "2px solid rgba(59, 130, 246, 0.6)",
              color: "#3B82F6",
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              backgroundColor: "rgba(59, 130, 246, 0.3)",
              "&:hover": {
                backgroundColor: "rgba(59, 130, 246, 0.5)",
                border: "2px solid rgba(59, 130, 246, 0.8)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Fechar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
