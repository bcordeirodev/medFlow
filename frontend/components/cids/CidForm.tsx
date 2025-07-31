import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    CircularProgress,
    Alert,
} from '@mui/material';
import { Add, Save, Cancel } from '@mui/icons-material';
import { useCids, useMedicines } from '@/hooks';
import { Cid, Medicine } from '@/lib/types';

interface CidFormProps {
    open: boolean;
    onClose: () => void;
    cid?: Cid;
}

export default function CidForm({ open, onClose, cid }: CidFormProps) {
    const { createCid, updateCid } = useCids();
    const { medicines } = useMedicines();

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        category: '',
        medicineIds: [] as number[],
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (cid) {
            setFormData({
                code: cid.code,
                name: cid.name,
                description: cid.description || '',
                category: cid.category || '',
                medicineIds: cid.medicines?.map(m => m.id) || [],
            });
        } else {
            setFormData({
                code: '',
                name: '',
                description: '',
                category: '',
                medicineIds: [],
            });
        }
    }, [cid]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (cid) {
                await updateCid(cid.id, formData);
            } else {
                await createCid(formData);
            }
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao salvar CID');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <Add sx={{ color: '#3B82F6' }} />
                    <Typography variant="h6" sx={{ color: '#F1F5F9', fontWeight: 600 }}>
                        {cid ? 'Editar CID' : 'Novo CID'}
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

                    <Box display="flex" gap={2} mb={2}>
                        <TextField
                            label="Código CID"
                            value={formData.code}
                            onChange={(e) => handleChange('code', e.target.value)}
                            fullWidth
                            required
                            placeholder="Ex: F41.1"
                        />
                        <TextField
                            label="Categoria"
                            value={formData.category}
                            onChange={(e) => handleChange('category', e.target.value)}
                            fullWidth
                            placeholder="Ex: Transtornos mentais"
                        />
                    </Box>

                    <TextField
                        label="Nome da Doença/Condição"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                        placeholder="Ex: Ansiedade generalizada"
                    />

                    <TextField
                        label="Descrição"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                        sx={{ mb: 2 }}
                        placeholder="Descrição detalhada da doença/condição"
                    />

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Medicamentos Associados</InputLabel>
                        <Select
                            multiple
                            value={formData.medicineIds}
                            onChange={(e) => handleChange('medicineIds', e.target.value)}
                            input={<OutlinedInput label="Medicamentos Associados" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => {
                                        const medicine = medicines?.find(m => m.id === value);
                                        return (
                                            <Chip
                                                key={value}
                                                label={medicine?.name || value}
                                                size="small"
                                                sx={{
                                                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                                                    color: '#FFFFFF',
                                                    border: '1px solid rgba(59, 130, 246, 0.9)',
                                                    fontWeight: 600,
                                                }}
                                            />
                                        );
                                    })}
                                </Box>
                            )}
                        >
                            {medicines?.map((medicine) => (
                                <MenuItem key={medicine.id} value={medicine.id}>
                                    {medicine.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={onClose}
                        startIcon={<Cancel />}
                        sx={{
                            border: '2px solid rgba(239, 68, 68, 0.6)',
                            color: '#EF4444',
                            fontWeight: 600,
                            px: 3,
                            py: 1.5,
                            borderRadius: 2,
                            backgroundColor: 'rgba(239, 68, 68, 0.3)',
                            '&:hover': {
                                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                                border: '2px solid rgba(239, 68, 68, 0.8)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                        disabled={loading}
                        sx={{
                            background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                            color: 'white',
                            fontWeight: 600,
                            px: 3,
                            py: 1.5,
                            borderRadius: 2,
                            boxShadow: '0 4px 15px rgba(5, 150, 105, 0.4)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                boxShadow: '0 6px 20px rgba(5, 150, 105, 0.6)',
                                transform: 'translateY(-2px)'
                            },
                            '&:disabled': {
                                background: 'linear-gradient(135deg, #475569 0%, #64748B 100%)',
                                transform: 'none',
                                boxShadow: 'none'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {loading ? 'Salvando...' : 'Salvar CID'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
} 