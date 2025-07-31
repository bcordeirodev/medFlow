'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
} from '@mui/material';
import { LocalHospital, Save, Cancel } from '@mui/icons-material';
import { useMedicines } from '@/hooks/useMedicines';

interface MedicineFormProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    medicine?: any; // Para edição
}

export default function MedicineForm({ open, onClose, onSuccess, medicine }: MedicineFormProps) {
    const { createMedicine, updateMedicine } = useMedicines();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: medicine?.name || '',
        genericName: medicine?.genericName || '',
        manufacturer: medicine?.manufacturer || '',
        description: medicine?.description || '',
        dosage: medicine?.dosage || '',
        contraindications: medicine?.contraindications || '',
        sideEffects: medicine?.sideEffects || '',
        interactions: medicine?.interactions || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (medicine) {
                await updateMedicine(medicine.id, formData);
            } else {
                await createMedicine(formData);
            }
            onSuccess?.();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao salvar medicamento');
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
                    <LocalHospital sx={{ color: '#3B82F6' }} />
                    <Typography variant="h6" sx={{ color: '#F1F5F9', fontWeight: 600 }}>
                        {medicine ? 'Editar Medicamento' : 'Novo Medicamento'}
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
                                label="Nome do Medicamento"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                required
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nome Genérico"
                                value={formData.genericName}
                                onChange={(e) => handleChange('genericName', e.target.value)}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Fabricante"
                                value={formData.manufacturer}
                                onChange={(e) => handleChange('manufacturer', e.target.value)}
                                required
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Descrição"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                required
                                margin="normal"
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Dosagem"
                                value={formData.dosage}
                                onChange={(e) => handleChange('dosage', e.target.value)}
                                required
                                margin="normal"
                                multiline
                                rows={2}
                                helperText="Ex: 1 comprimido 2x ao dia"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Contraindicações"
                                value={formData.contraindications}
                                onChange={(e) => handleChange('contraindications', e.target.value)}
                                margin="normal"
                                multiline
                                rows={3}
                                helperText="Informações sobre contraindicações"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Efeitos Colaterais"
                                value={formData.sideEffects}
                                onChange={(e) => handleChange('sideEffects', e.target.value)}
                                margin="normal"
                                multiline
                                rows={3}
                                helperText="Possíveis efeitos colaterais"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Interações Medicamentosas"
                                value={formData.interactions}
                                onChange={(e) => handleChange('interactions', e.target.value)}
                                margin="normal"
                                multiline
                                rows={3}
                                helperText="Interações com outros medicamentos"
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