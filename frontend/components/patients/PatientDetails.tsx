'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Divider,
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Edit,
    Save,
    Cancel,
    Person,
    Email,
    Phone,
    CalendarToday,
    LocationOn,
    MedicalServices,
    Notes
} from '@mui/icons-material';

interface Patient {
    id: number;
    name: string;
    email: string;
    phone: string;
    cpf: string;
    birthDate: string;
    gender: string;
    address: string;
    allergies: string;
    medicalHistory: string;
    observations: string;
    doctorId: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface PatientDetailsProps {
    patientId: number;
    onClose: () => void;
    onUpdate: () => void;
}

export default function PatientDetails({ patientId, onClose, onUpdate }: PatientDetailsProps) {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<Partial<Patient>>({});

    useEffect(() => {
        fetchPatient();
    }, [patientId]);

    const fetchPatient = async () => {
        try {
            const response = await axios.get(`/api/patients/${patientId}`);
            setPatient(response.data);
            setFormData(response.data);
        } catch (error) {
            setError('Erro ao carregar dados do paciente');
            console.error('Erro ao buscar paciente:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setEditing(true);
        setFormData(patient || {});
    };

    const handleCancel = () => {
        setEditing(false);
        setFormData(patient || {});
        setError('');
    };

    const handleSave = async () => {
        try {
            await axios.patch(`/api/patients/${patientId}`, formData);
            await fetchPatient();
            setEditing(false);
            onUpdate();
        } catch (error) {
            setError('Erro ao atualizar paciente');
            console.error('Erro ao atualizar paciente:', error);
        }
    };

    const handleInputChange = (field: keyof Patient, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (!patient) {
        return (
            <Alert severity="error">
                Paciente não encontrado
            </Alert>
        );
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
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    {/* Informações Básicas */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Informações Básicas
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Nome"
                            value={editing ? formData.name || '' : patient.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            disabled={!editing}
                            InputProps={{
                                startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            value={editing ? formData.email || '' : patient.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            disabled={!editing}
                            InputProps={{
                                startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Telefone"
                            value={editing ? formData.phone || '' : patient.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            disabled={!editing}
                            InputProps={{
                                startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="CPF"
                            value={editing ? formData.cpf || '' : patient.cpf}
                            onChange={(e) => handleInputChange('cpf', e.target.value)}
                            disabled={!editing}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Data de Nascimento"
                            type="date"
                            value={editing ? formData.birthDate || '' : patient.birthDate}
                            onChange={(e) => handleInputChange('birthDate', e.target.value)}
                            disabled={!editing}
                            InputProps={{
                                startAdornment: <CalendarToday sx={{ mr: 1, color: 'action.active' }} />
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth disabled={!editing}>
                            <InputLabel>Gênero</InputLabel>
                            <Select
                                value={editing ? formData.gender || '' : patient.gender}
                                onChange={(e) => handleInputChange('gender', e.target.value)}
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
                            value={editing ? formData.address || '' : patient.address || ''}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            disabled={!editing}
                            multiline
                            rows={2}
                            InputProps={{
                                startAdornment: <LocationOn sx={{ mr: 1, color: 'action.active' }} />
                            }}
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
                        <TextField
                            fullWidth
                            label="Alergias"
                            value={editing ? formData.allergies || '' : patient.allergies || ''}
                            onChange={(e) => handleInputChange('allergies', e.target.value)}
                            disabled={!editing}
                            multiline
                            rows={2}
                            InputProps={{
                                startAdornment: <MedicalServices sx={{ mr: 1, color: 'action.active' }} />
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Histórico Médico"
                            value={editing ? formData.medicalHistory || '' : patient.medicalHistory || ''}
                            onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                            disabled={!editing}
                            multiline
                            rows={3}
                            InputProps={{
                                startAdornment: <Notes sx={{ mr: 1, color: 'action.active' }} />
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Observações"
                            value={editing ? formData.observations || '' : patient.observations || ''}
                            onChange={(e) => handleInputChange('observations', e.target.value)}
                            disabled={!editing}
                            multiline
                            rows={3}
                            InputProps={{
                                startAdornment: <Notes sx={{ mr: 1, color: 'action.active' }} />
                            }}
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
                        <Button onClick={handleSave} variant="contained" startIcon={<Save />}>
                            Salvar
                        </Button>
                    </>
                ) : (
                    <Button onClick={onClose}>
                        Fechar
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
} 