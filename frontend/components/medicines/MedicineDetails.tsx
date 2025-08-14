'use client';

import { FormTextField } from '@/components/common/FormField';
import { useMedicine } from '@/hooks/useMedicines';
import { useForm } from '@/hooks/useForm';
import { MedicineFormData, medicineSchema } from '@/lib/schemas';
import { MedicinesService } from '@/services/medicines.service';
import { ErrorHandler } from '@/utils/errorHandler';
import { Cancel, Edit, Save } from '@mui/icons-material';
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
} from '@mui/material';
import { useState } from 'react';
import { useNotification } from '../../contexts';

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
      name: medicine?.name || '',
      genericName: medicine?.genericName || '',
      manufacturer: medicine?.manufacturer || '',
      description: medicine?.description || '',
      dosage: medicine?.dosage || '',
      activeIngredient: medicine?.activeIngredient || '',
      contraindications: medicine?.contraindications || '',
      sideEffects: medicine?.sideEffects || '',
      interactions: medicine?.interactions || '',
    },
    validationSchema: medicineSchema,
    onSubmit: async values => {
      try {
        if (isCreating) {
          await MedicinesService.createMedicine(values);
          showSuccess('Medicamento criado com sucesso');
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
          isCreating ? 'Criação de medicamento' : 'Atualização de medicamento'
        );
        throw new Error(errorMessage);
      }
    },
  });

  // Atualizar valores do formulário quando medicine muda
  if (medicine && !isCreating && form.values.name === '') {
    form.setValues({
      name: medicine.name || '',
      genericName: medicine.genericName || '',
      manufacturer: medicine.manufacturer || '',
      description: medicine.description || '',
      dosage: medicine.dosage || '',
      activeIngredient: medicine.activeIngredient || '',
      contraindications: medicine.contraindications || '',
      sideEffects: medicine.sideEffects || '',
      interactions: medicine.interactions || '',
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
    form.handleSubmit(new Event('submit') as any);
  };

  if (isLoading && !isCreating) {
    return (
      <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
          >
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Carregando medicamento...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (!medicine && !isCreating) {
    return (
      <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Alert severity="error">Medicamento não encontrado</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Fechar</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ color: '#F1F5F9', fontWeight: 600 }}>
            {isCreating
              ? 'Novo Medicamento'
              : editing
                ? 'Editar Medicamento'
                : 'Detalhes do Medicamento'}
          </Typography>
          {!editing && !isCreating && (
            <IconButton onClick={handleEdit} sx={{ color: '#3B82F6' }}>
              <Edit />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Informações Básicas */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: '#F1F5F9', fontWeight: 600 }}
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
                  ? form.values.name || ''
                  : medicine?.name || ''
              }
              onChange={value => form.setFieldValue('name', value)}
              onBlur={() => form.setFieldTouched('name')}
              error={form.errors.name}
              touched={form.touched.name}
              disabled={!editing && !isCreating}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="genericName"
              label="Nome Genérico"
              value={
                editing || isCreating
                  ? form.values.genericName || ''
                  : medicine?.genericName || ''
              }
              onChange={value => form.setFieldValue('genericName', value)}
              onBlur={() => form.setFieldTouched('genericName')}
              error={form.errors.genericName}
              touched={form.touched.genericName}
              disabled={!editing && !isCreating}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="manufacturer"
              label="Fabricante"
              value={
                editing || isCreating
                  ? form.values.manufacturer || ''
                  : medicine?.manufacturer || ''
              }
              onChange={value => form.setFieldValue('manufacturer', value)}
              onBlur={() => form.setFieldTouched('manufacturer')}
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
                  ? form.values.dosage || ''
                  : medicine?.dosage || ''
              }
              onChange={value => form.setFieldValue('dosage', value)}
              onBlur={() => form.setFieldTouched('dosage')}
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
                  ? form.values.activeIngredient || ''
                  : medicine?.activeIngredient || ''
              }
              onChange={value => form.setFieldValue('activeIngredient', value)}
              onBlur={() => form.setFieldTouched('activeIngredient')}
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
                  ? form.values.description || ''
                  : medicine?.description || ''
              }
              onChange={value => form.setFieldValue('description', value)}
              onBlur={() => form.setFieldTouched('description')}
              error={form.errors.description}
              touched={form.touched.description}
              disabled={!editing && !isCreating}
              multiline
              rows={3}
            />
          </Grid>

          <Divider sx={{ width: '100%', my: 2 }} />

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
                  ? form.values.contraindications || ''
                  : medicine?.contraindications || ''
              }
              onChange={value => form.setFieldValue('contraindications', value)}
              onBlur={() => form.setFieldTouched('contraindications')}
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
                  ? form.values.sideEffects || ''
                  : medicine?.sideEffects || ''
              }
              onChange={value => form.setFieldValue('sideEffects', value)}
              onBlur={() => form.setFieldTouched('sideEffects')}
              error={form.errors.sideEffects}
              touched={form.touched.sideEffects}
              disabled={!editing && !isCreating}
              multiline
              rows={3}
            />
          </Grid>

          <Grid item xs={12}>
            <FormTextField
              name="interactions"
              label="Interações"
              value={
                editing || isCreating
                  ? form.values.interactions || ''
                  : medicine?.interactions || ''
              }
              onChange={value => form.setFieldValue('interactions', value)}
              onBlur={() => form.setFieldTouched('interactions')}
              error={form.errors.interactions}
              touched={form.touched.interactions}
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
                label={medicine?.isActive ? 'Ativo' : 'Inativo'}
                color={medicine?.isActive ? 'success' : 'error'}
                size="small"
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        {editing ? (
          <>
            <Button onClick={handleCancel} startIcon={<Cancel />}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              startIcon={<Save />}
            >
              Salvar
            </Button>
          </>
        ) : (
          <Button onClick={onClose}>Fechar</Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
