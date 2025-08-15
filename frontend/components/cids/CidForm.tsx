import { useNotification } from "@/contexts/NotificationContext";
import { useForm } from "@/hooks/useForm";
import { useCids } from "@/hooks";
import { FormTextField } from "@/components/common/FormField";
import { Cid } from "@/types/entities.types";
// import { cidSchema } from '@/lib/schemas';
// import { CidFormData } from '@/types/forms.types';
import { ErrorHandler } from "@/utils/errorHandler";
import { Assignment, Cancel, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";

interface CidFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  cid?: Cid;
}

export default function CidForm({
  open,
  onClose,
  onSuccess,
  cid,
}: CidFormProps) {
  const { createCid, updateCid } = useCids();
  const { showSuccess, showError } = useNotification();

  // Usar useForm hook (simplificado)
  const form = useForm({
    initialValues: {
      code: cid?.code || "",
      name: cid?.name || "",
      description: cid?.description || "",
      category: cid?.category || "",
    },
    onSubmit: async (values) => {
      try {
        // Validação simples
        if (!values.code?.trim()) {
          showError("Código CID é obrigatório");
          return;
        }

        if (!values.name?.trim()) {
          showError("Nome da doença/condição é obrigatório");
          return;
        }

        const cidData = {
          code: values.code.trim(),
          name: values.name.trim(),
          description: values.description?.trim() || "",
          category: values.category?.trim() || "",
          medicineIds: [], // Array vazio por enquanto
        };

        if (cid) {
          await updateCid(cid.id, cidData);
          showSuccess(`CID ${values.code} atualizado com sucesso!`);
        } else {
          await createCid(cidData);
          showSuccess(`CID ${values.code} criado com sucesso!`);
        }
        onSuccess?.();
        onClose();
      } catch (error) {
        const errorMessage = ErrorHandler.extractErrorMessage(error);
        ErrorHandler.logError(error, "CID Form");
        showError(errorMessage);
      }
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      if (cid) {
        form.setValues({
          code: cid.code,
          name: cid.name,
          description: cid.description || "",
          category: cid.category || "",
        });
      } else {
        form.resetForm();
      }
    }
  }, [open, cid]); // Removida dependência 'form' para evitar loop

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
          <Assignment sx={{ color: "white", fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "white" }}>
            {cid ? "Editar CID" : "Novo CID"}
          </Typography>
        </Box>
      </DialogTitle>

      <form onSubmit={form.handleSubmit}>
        <DialogContent>
          <Box display="flex" gap={2} mb={2}>
            <FormTextField
              name="code"
              label="Código CID"
              value={form.values.code || ""}
              onChange={(value) => form.setFieldValue("code", value)}
              onBlur={() => form.setFieldTouched("code")}
              error={form.errors.code}
              touched={form.touched.code}
              required
              placeholder="Ex: F41.1"
              disabled={form.isSubmitting}
            />
            <FormTextField
              name="category"
              label="Categoria"
              value={form.values.category || ""}
              onChange={(value) => form.setFieldValue("category", value)}
              onBlur={() => form.setFieldTouched("category")}
              error={form.errors.category}
              touched={form.touched.category}
              placeholder="Ex: Transtornos mentais"
              disabled={form.isSubmitting}
            />
          </Box>

          <FormTextField
            name="name"
            label="Nome da Doença/Condição"
            value={form.values.name || ""}
            onChange={(value) => form.setFieldValue("name", value)}
            onBlur={() => form.setFieldTouched("name")}
            error={form.errors.name}
            touched={form.touched.name}
            required
            placeholder="Ex: Ansiedade generalizada"
            disabled={form.isSubmitting}
          />

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
            placeholder="Descrição detalhada da doença/condição"
            disabled={form.isSubmitting}
          />

          {/* Medicamentos: Funcionalidade simplificada - pode ser expandida futuramente */}
          <Typography variant="body2" sx={{ color: "#94A3B8", mb: 2 }}>
            💡 Associação de medicamentos: Funcionalidade disponível na versão
            completa
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={onClose}
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
            {form.isSubmitting ? "Salvando..." : "Salvar CID"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
