'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
} from '@mui/material';
import { Person, Save, Cancel } from '@mui/icons-material';
import { usePatients } from '@/hooks/usePatients';

interface PatientFormProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    patient?: any; // Para edição
}

export default function PatientForm({ open, onClose, onSuccess, patient }: PatientFormProps) {
    const { createPatient, updatePatient } = usePatients();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: patient?.name || '',
        email: patient?.email || '',
        phone: patient?.phone || '',
        cpf: patient?.cpf || '',
        birthDate: patient?.birthDate ? patient.birthDate.split('T')[0] : '',
        gender: patient?.gender || 'M',
        address: patient?.address || '',
        allergies: patient?.allergies || '',
        medicalHistory: patient?.medicalHistory || '',
        observations: patient?.observations || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (patient) {
                await updatePatient(patient.id, formData);
            } else {
                await createPatient(formData);
            }
            onSuccess?.();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao salvar paciente');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <Person sx={{ color: '#3B82F6' }} />
                    <Typography variant="h6" sx={{ color: '#F1F5F9', fontWeight: 600 }}>
                        {patient ? 'Editar Paciente' : 'Novo Paciente'}
                    </Typography>
                </Box>
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nome Completo"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                required
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                required
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Telefone"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                required
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="CPF"
                                value={formData.cpf}
                                onChange={(e) => handleChange('cpf', e.target.value)}
                                required
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Data de Nascimento"
                                type="date"
                                value={formData.birthDate}
                                onChange={(e) => handleChange('birthDate', e.target.value)}
                                required
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal" required>
                                <InputLabel>Gênero</InputLabel>
                                <Select
                                    value={formData.gender}
                                    onChange={(e) => handleChange('gender', e.target.value)}
                                    label="Gênero"
                                >
                                    <MenuItem value="M">Masculino</MenuItem>
                                    <MenuItem value="F">Feminino</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Endereço"
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                required
                                margin="normal"
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Alergias"
                                value={formData.allergies}
                                onChange={(e) => handleChange('allergies', e.target.value)}
                                margin="normal"
                                multiline
                                rows={2}
                                helperText="Informe as alergias conhecidas do paciente"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Histórico Médico"
                                value={formData.medicalHistory}
                                onChange={(e) => handleChange('medicalHistory', e.target.value)}
                                margin="normal"
                                multiline
                                rows={3}
                                helperText="Informações relevantes do histórico médico"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Observações"
                                value={formData.observations}
                                onChange={(e) => handleChange('observations', e.target.value)}
                                margin="normal"
                                multiline
                                rows={2}
                                helperText="Observações adicionais sobre o paciente"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={onClose}
                        startIcon={<Cancel />}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : 'Salvar'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
} 