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
    Medication,
    Description,
    Warning,
    Info
} from '@mui/icons-material';

interface Medicine {
    id: number;
    name: string;
    genericName: string;
    manufacturer: string;
    description: string;
    dosage: string;
    contraindications: string;
    sideEffects: string;
    interactions: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface MedicineDetailsProps {
    medicineId: number;
    onClose: () => void;
    onUpdate: () => void;
}

export default function MedicineDetails({ medicineId, onClose, onUpdate }: MedicineDetailsProps) {
    const [medicine, setMedicine] = useState<Medicine | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<Partial<Medicine>>({});

    useEffect(() => {
        fetchMedicine();
    }, [medicineId]);

    const fetchMedicine = async () => {
        try {
            const response = await axios.get(`/api/medicines/${medicineId}`);
            setMedicine(response.data);
            setFormData(response.data);
        } catch (error) {
            setError('Erro ao carregar dados do medicamento');
            console.error('Erro ao buscar medicamento:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setEditing(true);
        setFormData(medicine || {});
    };

    const handleCancel = () => {
        setEditing(false);
        setFormData(medicine || {});
        setError('');
    };

    const handleSave = async () => {
        try {
            await axios.patch(`/api/medicines/${medicineId}`, formData);
            await fetchMedicine();
            setEditing(false);
            onUpdate();
        } catch (error) {
            setError('Erro ao atualizar medicamento');
            console.error('Erro ao atualizar medicamento:', error);
        }
    };

    const handleInputChange = (field: keyof Medicine, value: string) => {
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

    if (!medicine) {
        return (
            <Alert severity="error">
                Medicamento não encontrado
            </Alert>
        );
    }

    return (
        <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ color: '#F1F5F9', fontWeight: 600 }}>
                        {editing ? 'Editar Medicamento' : 'Detalhes do Medicamento'}
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
                        <Typography variant="h6" gutterBottom sx={{ color: '#F1F5F9', fontWeight: 600 }}>
                            Informações Básicas
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Nome"
                            value={editing ? formData.name || '' : medicine.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            disabled={!editing}
                            InputProps={{
                                startAdornment: <Medication sx={{ mr: 1, color: 'action.active' }} />
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Nome Genérico"
                            value={editing ? formData.genericName || '' : medicine.genericName || ''}
                            onChange={(e) => handleInputChange('genericName', e.target.value)}
                            disabled={!editing}
                            InputProps={{
                                startAdornment: <Info sx={{ mr: 1, color: 'action.active' }} />
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Fabricante"
                            value={editing ? formData.manufacturer || '' : medicine.manufacturer}
                            onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                            disabled={!editing}
                            InputProps={{
                                startAdornment: <Info sx={{ mr: 1, color: 'action.active' }} />
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Dosagem"
                            value={editing ? formData.dosage || '' : medicine.dosage}
                            onChange={(e) => handleInputChange('dosage', e.target.value)}
                            disabled={!editing}
                            InputProps={{
                                startAdornment: <Medication sx={{ mr: 1, color: 'action.active' }} />
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Descrição"
                            value={editing ? formData.description || '' : medicine.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            disabled={!editing}
                            multiline
                            rows={3}
                            InputProps={{
                                startAdornment: <Description sx={{ mr: 1, color: 'action.active' }} />
                            }}
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
                        <TextField
                            fullWidth
                            label="Contraindicações"
                            value={editing ? formData.contraindications || '' : medicine.contraindications}
                            onChange={(e) => handleInputChange('contraindications', e.target.value)}
                            disabled={!editing}
                            multiline
                            rows={3}
                            InputProps={{
                                startAdornment: <Warning sx={{ mr: 1, color: 'action.active' }} />
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Efeitos Colaterais"
                            value={editing ? formData.sideEffects || '' : medicine.sideEffects || ''}
                            onChange={(e) => handleInputChange('sideEffects', e.target.value)}
                            disabled={!editing}
                            multiline
                            rows={3}
                            InputProps={{
                                startAdornment: <Warning sx={{ mr: 1, color: 'action.active' }} />
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Interações"
                            value={editing ? formData.interactions || '' : medicine.interactions || ''}
                            onChange={(e) => handleInputChange('interactions', e.target.value)}
                            disabled={!editing}
                            multiline
                            rows={3}
                            InputProps={{
                                startAdornment: <Warning sx={{ mr: 1, color: 'action.active' }} />
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
                                label={medicine.isActive ? 'Ativo' : 'Inativo'}
                                color={medicine.isActive ? 'success' : 'error'}
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