'use client';

import { FormTextField, FormSelectField } from '@/components/common/FormField';
import { useForm } from '@/hooks/useForm';
import { usePatient } from '@/hooks/usePatients';
import { PatientFormData, patientSchema } from '@/lib/schemas';
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

// Patient interface now imported from @/types/entities.types

interface PatientDetailsProps {
  patientId: number;
  onClose: () => void;
  onUpdate: () => void;
}

export default function PatientDetails({
  patientId,
  onClose,
  onUpdate,
}: PatientDetailsProps) {
  const { patient, isLoading, mutate } = usePatient(patientId);
  const [editing, setEditing] = useState(false);
  const { showSuccess } = useNotification();

  const form = useForm<PatientFormData>({
    initialValues: {
      name: patient?.name || '',
      email: patient?.email || '',
      phone: patient?.phone || '',
      cpf: patient?.cpf || '',
      birthDate: patient?.birthDate ? patient.birthDate.split('T')[0] : '',
      gender: patient?.gender || 'Masculino',
      address: patient?.address || '',
      allergies: patient?.allergies || '',
      medicalHistory: patient?.medicalHistory || '',
      observations: patient?.observations || '',
    },
    validationSchema: patientSchema,
    onSubmit: async values => {
      try {
        await mutate(async () => {
          const response = await fetch(`/api/patients/${patientId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          });
          if (!response.ok) throw new Error('Erro ao atualizar');
          return response.json();
        }, false);
        await mutate(); // Revalidate
        showSuccess(`Paciente ${values.name} atualizado com sucesso`);
        setEditing(false);
        onUpdate();
      } catch (error: any) {
        const errorMessage = ErrorHandler.extractErrorMessage(error);
        ErrorHandler.logError(error, 'Atualização de paciente');
        throw new Error(errorMessage);
      }
    },
  });

  // Atualizar valores do formulário quando patient muda
  if (patient && form.values.name === '') {
    form.setValues({
      name: patient.name || '',
      email: patient.email || '',
      phone: patient.phone || '',
      cpf: patient.cpf || '',
      birthDate: patient.birthDate ? patient.birthDate.split('T')[0] : '',
      gender: patient.gender || 'Masculino',
      address: patient.address || '',
      allergies: patient.allergies || '',
      medicalHistory: patient.medicalHistory || '',
      observations: patient.observations || '',
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

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!patient) {
    return <Alert severity="error">Paciente não encontrado</Alert>;
  }

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ color: '#F1F5F9', fontWeight: 600 }}>
            {editing ? 'Editar Paciente' : 'Detalhes do Paciente'}
          </Typography>
          {!editing && (
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
            <Typography variant="h6" gutterBottom>
              Informações Básicas
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="name"
              label="Nome"
              value={editing ? form.values.name || '' : patient.name || ''}
              onChange={value => form.setFieldValue('name', value)}
              onBlur={() => form.setFieldTouched('name')}
              error={form.errors.name}
              touched={form.touched.name}
              disabled={!editing}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="email"
              label="Email"
              type="email"
              value={editing ? form.values.email || '' : patient.email || ''}
              onChange={value => form.setFieldValue('email', value)}
              onBlur={() => form.setFieldTouched('email')}
              error={form.errors.email}
              touched={form.touched.email}
              disabled={!editing}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="phone"
              label="Telefone"
              value={editing ? form.values.phone || '' : patient.phone || ''}
              onChange={value => form.setFieldValue('phone', value)}
              onBlur={() => form.setFieldTouched('phone')}
              error={form.errors.phone}
              touched={form.touched.phone}
              disabled={!editing}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="cpf"
              label="CPF"
              value={editing ? form.values.cpf || '' : patient.cpf || ''}
              onChange={value => form.setFieldValue('cpf', value)}
              onBlur={() => form.setFieldTouched('cpf')}
              error={form.errors.cpf}
              touched={form.touched.cpf}
              disabled={!editing}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormTextField
              name="birthDate"
              label="Data de Nascimento"
              type="date"
              value={
                editing ? form.values.birthDate || '' : patient.birthDate || ''
              }
              onChange={value => form.setFieldValue('birthDate', value)}
              onBlur={() => form.setFieldTouched('birthDate')}
              error={form.errors.birthDate}
              touched={form.touched.birthDate}
              disabled={!editing}
              required
              textFieldProps={{ InputLabelProps: { shrink: true } }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormSelectField
              name="gender"
              label="Gênero"
              value={editing ? form.values.gender || '' : patient.gender || ''}
              onChange={value => form.setFieldValue('gender', value)}
              onBlur={() => form.setFieldTouched('gender')}
              error={form.errors.gender}
              touched={form.touched.gender}
              disabled={!editing}
              options={[
                { value: 'Masculino', label: 'Masculino' },
                { value: 'Feminino', label: 'Feminino' },
                { value: 'Outro', label: 'Outro' },
              ]}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <FormTextField
              name="address"
              label="Endereço"
              value={
                editing ? form.values.address || '' : patient.address || ''
              }
              onChange={value => form.setFieldValue('address', value)}
              onBlur={() => form.setFieldTouched('address')}
              error={form.errors.address}
              touched={form.touched.address}
              disabled={!editing}
              required
              multiline
              rows={2}
            />
          </Grid>

          <Divider sx={{ width: '100%', my: 2 }} />

          {/* Informações Médicas */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Informações Médicas
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <FormTextField
              name="allergies"
              label="Alergias"
              value={
                editing ? form.values.allergies || '' : patient.allergies || ''
              }
              onChange={value => form.setFieldValue('allergies', value)}
              onBlur={() => form.setFieldTouched('allergies')}
              error={form.errors.allergies}
              touched={form.touched.allergies}
              disabled={!editing}
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12}>
            <FormTextField
              name="medicalHistory"
              label="Histórico Médico"
              value={
                editing
                  ? form.values.medicalHistory || ''
                  : patient.medicalHistory || ''
              }
              onChange={value => form.setFieldValue('medicalHistory', value)}
              onBlur={() => form.setFieldTouched('medicalHistory')}
              error={form.errors.medicalHistory}
              touched={form.touched.medicalHistory}
              disabled={!editing}
              multiline
              rows={3}
            />
          </Grid>

          <Grid item xs={12}>
            <FormTextField
              name="observations"
              label="Observações"
              value={
                editing
                  ? form.values.observations || ''
                  : patient.observations || ''
              }
              onChange={value => form.setFieldValue('observations', value)}
              onBlur={() => form.setFieldTouched('observations')}
              error={form.errors.observations}
              touched={form.touched.observations}
              disabled={!editing}
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
                label={patient.isActive ? 'Ativo' : 'Inativo'}
                color={patient.isActive ? 'success' : 'error'}
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
