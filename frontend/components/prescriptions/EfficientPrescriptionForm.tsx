'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    CircularProgress,
    Alert,
    Grid,
    Chip,
    Autocomplete,
    IconButton,
    Tooltip,
    Collapse,
} from '@mui/material';
import {
    Description,
    Save,
    Clear,
    Add,
    Person,
    CalendarToday,
    LocalHospital,
    ContentCopy,
    Search,
    MedicalServices,
    Lightbulb,
    ExpandMore,
    ExpandLess,
} from '@mui/icons-material';
import { PrescriptionsService } from '@/services/prescriptions.service';
import { MedicinesService } from '@/services/medicines.service';
import { PatientsService } from '@/services/patients.service';
import { Patient, Medicine, Cid } from '@/lib/types';
import { useCids } from '@/hooks';
import { CidSelect } from '../cids';
import ObservationSuggestions from './ObservationSuggestions';

interface EfficientPrescriptionFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function EfficientPrescriptionForm({ onSuccess, onCancel }: EfficientPrescriptionFormProps) {
    const { cids } = useCids();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [selectedCid, setSelectedCid] = useState<number | null>(null);
    const [selectedCidData, setSelectedCidData] = useState<Cid | null>(null);
    const [prescription, setPrescription] = useState('');
    const [observations, setObservations] = useState('');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);

    // Carregar dados iniciais
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [patientsData, medicinesData] = await Promise.all([
                    PatientsService.getPatients(),
                    MedicinesService.getMedicines()
                ]);

                setPatients(patientsData);
                setMedicines(medicinesData);
            } catch (err) {
                setError('Erro ao carregar dados');
                console.error('Erro ao carregar dados:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleCidSelect = (cidId: number | null) => {
        setSelectedCid(cidId);

        if (cidId) {
            const cid = cids?.find(c => c.id === cidId);
            setSelectedCidData(cid || null);

            if (cid && cid.medicines && cid.medicines.length > 0) {
                // Preencher automaticamente a prescrição com os medicamentos do CID
                const medicineTexts = cid.medicines.map(medicine =>
                    `${medicine.name} ${medicine.dosage} - 1 comprimido a cada 8 horas por via oral`
                ).join('\n\n');

                setPrescription(medicineTexts);

                // Adicionar à lista de medicamentos selecionados
                const medicineInfos = cid.medicines.map(m => `${m.name} ${m.dosage}`);
                setSelectedMedicines(medicineInfos);
            } else {
                // Se o CID não tem medicamentos associados, manter a prescrição atual se existir
                if (!prescription.trim()) {
                    setPrescription('');
                    setSelectedMedicines([]);
                }
            }
        } else {
            setSelectedCidData(null);
            // Não limpar a prescrição se o usuário já digitou algo
            if (!prescription.trim()) {
                setPrescription('');
                setSelectedMedicines([]);
            }
        }
    };

    const handleMedicineSelect = (medicine: Medicine | null) => {
        if (medicine) {
            const medicineText = `${medicine.name} ${medicine.dosage} - 1 comprimido a cada 8 horas por via oral`;

            // Verificar se o medicamento já está na prescrição
            const medicineInfo = `${medicine.name} ${medicine.dosage}`;
            const isAlreadyInPrescription = selectedMedicines.includes(medicineInfo);

            if (!isAlreadyInPrescription) {
                // Adicionar à prescrição com quebra de linha se já houver conteúdo
                setPrescription(prev => {
                    if (prev.trim()) {
                        return prev + '\n\n' + medicineText;
                    }
                    return medicineText;
                });

                // Adicionar à lista de medicamentos selecionados
                setSelectedMedicines(prev => [...prev, medicineInfo]);
            } else {
                alert('Este medicamento já foi adicionado à prescrição.');
            }
        }
    };

    const handleSuggestionSelect = (suggestion: string) => {
        setObservations(prev => {
            if (prev.trim()) {
                return prev + '\n\n' + suggestion;
            }
            return suggestion;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatient) {
            setError('Selecione um paciente');
            return;
        }

        if (!selectedCidData) {
            setError('Selecione um CID');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            await PrescriptionsService.createPrescription({
                patientId: selectedPatient.id,
                diagnosis: selectedCidData ? `${selectedCidData.code} - ${selectedCidData.name}` : '',
                prescription,
                observations,
                prescriptionDate: new Date().toISOString().split('T')[0],
            });

            // Limpar formulário
            setSelectedPatient(null);
            setSelectedCid(null);
            setSelectedCidData(null);
            setPrescription('');
            setObservations('');
            setSelectedMedicines([]);

            onSuccess?.();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao criar prescrição');
        } finally {
            setSaving(false);
        }
    };

    const handleClear = () => {
        setSelectedPatient(null);
        setSelectedCid(null);
        setSelectedCidData(null);
        setPrescription('');
        setObservations('');
        setSelectedMedicines([]);
        setError(null);
    };

    const handleCopyPrescription = async () => {
        const prescriptionText = `
PRESCRIÇÃO MÉDICA

Paciente: ${selectedPatient?.name || ''}
Data: ${new Date().toLocaleDateString('pt-BR')}

CID:
${selectedCidData ? `${selectedCidData.code} - ${selectedCidData.name}` : 'Não informado'}

PRESCRIÇÃO:
${prescription}

OBSERVAÇÕES:
${observations}
    `.trim();

        try {
            await navigator.clipboard.writeText(prescriptionText);
            alert('Prescrição copiada para a área de transferência!');
        } catch (error) {
            console.error('Erro ao copiar:', error);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Description color="primary" />
                <Typography variant="h4" component="h1">
                    Nova Receita - Modo Eficiente
                </Typography>
                <Chip
                    label="IA Integrada"
                    color="primary"
                    variant="outlined"
                    icon={<Lightbulb />}
                />
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper elevation={2} sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Seleção de Paciente */}
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={patients}
                                getOptionLabel={(option) => `${option.name} - ${option.email}`}
                                value={selectedPatient}
                                onChange={(_, newValue) => setSelectedPatient(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Paciente"
                                        required
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                                        }}
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        <Box>
                                            <Typography variant="body1" fontWeight={600}>
                                                {option.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {option.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            />
                        </Grid>

                        {/* Data da Prescrição */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Data da Prescrição"
                                type="date"
                                value={new Date().toISOString().split('T')[0]}
                                InputProps={{
                                    startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />,
                                }}
                                disabled
                            />
                        </Grid>

                        {/* Seleção de CID */}
                        <Grid item xs={12}>
                            <CidSelect
                                value={selectedCid}
                                onChange={handleCidSelect}
                                label="CID (Classificação Internacional de Doenças)"
                                required
                            />
                        </Grid>

                        {/* Busca Rápida de Medicamentos */}
                        <Grid item xs={12}>
                            <Typography variant="body2" sx={{ mb: 2, color: '#94A3B8', fontStyle: 'italic' }}>
                                💡 Os medicamentos do CID selecionado foram preenchidos automaticamente. Use o campo abaixo para adicionar medicamentos extras se necessário.
                            </Typography>
                            <Autocomplete
                                options={medicines}
                                getOptionLabel={(option) => `${option.name} ${option.dosage} - ${option.manufacturer}`}
                                onChange={(_, newValue) => handleMedicineSelect(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Adicionar Medicamento Adicional"
                                        placeholder="Digite para buscar e adicionar medicamentos extras..."
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                                        }}
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <MedicalServices sx={{ mr: 1, color: 'primary.main' }} />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body1" fontWeight={600}>
                                                    {option.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {option.dosage} • {option.manufacturer}
                                                </Typography>
                                            </Box>
                                            <Tooltip title="Adicionar à prescrição">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMedicineSelect(option);
                                                    }}
                                                >
                                                    <Add />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                )}
                                noOptionsText="Nenhum medicamento encontrado"
                            />
                        </Grid>

                        {/* Medicamentos Selecionados */}
                        {selectedMedicines.length > 0 && (
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#F1F5F9' }}>
                                    Medicamentos Selecionados:
                                </Typography>
                                <Box display="flex" gap={1} flexWrap="wrap">
                                    {selectedMedicines.map((medicine, index) => (
                                        <Chip
                                            key={index}
                                            label={medicine}
                                            size="small"
                                            icon={<MedicalServices sx={{ color: '#FFFFFF' }} />}
                                            sx={{
                                                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                                                color: '#FFFFFF',
                                                border: '1px solid rgba(59, 130, 246, 0.9)',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    backgroundColor: 'rgba(59, 130, 246, 0.9)',
                                                    transform: 'scale(1.05)'
                                                },
                                                transition: 'all 0.2s ease'
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Grid>
                        )}

                        {/* Editor de Prescrição */}
                        <Grid item xs={12}>
                            <Typography variant="body2" sx={{ mb: 1, color: '#94A3B8' }}>
                                📝 Prescrição Médica (pode ser editada manualmente)
                            </Typography>
                            <TextField
                                fullWidth
                                label="Prescrição Médica"
                                multiline
                                rows={8}
                                value={prescription}
                                onChange={(e) => setPrescription(e.target.value)}
                                placeholder="A prescrição será preenchida automaticamente com os medicamentos do CID selecionado. Você pode editar manualmente ou adicionar medicamentos extras usando o campo acima."
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        fontFamily: 'monospace',
                                        fontSize: '0.9rem',
                                    },
                                }}
                            />
                        </Grid>

                        {/* Botão para Sugestões de Observações */}
                        {selectedCidData && selectedMedicines.length > 0 && (
                            <Grid item xs={12}>
                                <Button
                                    variant="outlined"
                                    startIcon={showSuggestions ? <ExpandLess /> : <ExpandMore />}
                                    onClick={() => setShowSuggestions(!showSuggestions)}
                                    sx={{
                                        mb: 2,
                                        border: '2px solid rgba(59, 130, 246, 0.6)',
                                        color: '#3B82F6',
                                        fontWeight: 600,
                                        px: 3,
                                        py: 1.5,
                                        borderRadius: 2,
                                        backgroundColor: 'rgba(59, 130, 246, 0.3)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(59, 130, 246, 0.5)',
                                            border: '2px solid rgba(59, 130, 246, 0.8)',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {showSuggestions ? 'Ocultar' : 'Mostrar'} Sugestões de Observações (IA) - CID: {selectedCidData?.code}
                                </Button>
                            </Grid>
                        )}

                        {/* Componente de Sugestões */}
                        <Grid item xs={12}>
                            <Collapse in={showSuggestions}>
                                <ObservationSuggestions
                                    diagnosis={selectedCidData ? `${selectedCidData.code} - ${selectedCidData.name}` : ''}
                                    medicines={selectedMedicines}
                                    onSuggestionSelect={handleSuggestionSelect}
                                />
                            </Collapse>
                        </Grid>

                        {/* Observações */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Observações"
                                multiline
                                rows={3}
                                value={observations}
                                onChange={(e) => setObservations(e.target.value)}
                                placeholder="Observações adicionais, contraindicações, etc..."
                            />
                        </Grid>

                        {/* Botões de Ação */}
                        <Grid item xs={12}>
                            <Box display="flex" gap={2} justifyContent="flex-end">
                                <Button
                                    variant="outlined"
                                    startIcon={<ContentCopy />}
                                    onClick={handleCopyPrescription}
                                    sx={{
                                        border: '2px solid rgba(59, 130, 246, 0.6)',
                                        color: '#3B82F6',
                                        fontWeight: 600,
                                        px: 3,
                                        py: 1.5,
                                        borderRadius: 2,
                                        backgroundColor: 'rgba(59, 130, 246, 0.3)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(59, 130, 246, 0.5)',
                                            border: '2px solid rgba(59, 130, 246, 0.8)',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Copiar
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<Clear />}
                                    onClick={handleClear}
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
                                    Limpar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                                    disabled={saving}
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
                                    {saving ? 'Salvando...' : 'Salvar Receita'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
} 