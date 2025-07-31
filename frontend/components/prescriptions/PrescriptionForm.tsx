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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    Grid,
    Paper,
    Divider,
    Chip,
    Avatar,
    IconButton,
    Tooltip,
    Stepper,
    Step,
    StepLabel,
    StepContent
} from '@mui/material';
import {
    Description,
    Save,
    Cancel,
    Person,
    CalendarToday,
    LocalHospital,
    Medication,
    Notes,
    Assignment,
    CheckCircle,
    Warning,
    Info
} from '@mui/icons-material';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import { apiClient } from '@/lib/api';

interface Patient {
    id: number;
    name: string;
    email: string;
}

interface PrescriptionFormProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    prescription?: any; // Para edição
}

export default function PrescriptionForm({ open, onClose, onSuccess, prescription }: PrescriptionFormProps) {
    const { createPrescription, updatePrescription } = usePrescriptions();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [error, setError] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        patientId: prescription?.patientId || '',
        diagnosis: prescription?.diagnosis || '',
        prescription: prescription?.prescription || '',
        observations: prescription?.observations || '',
        prescriptionDate: prescription?.prescriptionDate ? prescription.prescriptionDate.split('T')[0] : new Date().toISOString().split('T')[0],
        validUntil: prescription?.validUntil ? prescription.validUntil.split('T')[0] : '',
    });

    const steps = [
        { label: 'Informações Básicas', icon: <Person /> },
        { label: 'Diagnóstico', icon: <LocalHospital /> },
        { label: 'Prescrição', icon: <Medication /> },
        { label: 'Observações', icon: <Notes /> }
    ];

    useEffect(() => {
        if (open) {
            fetchPatients();
        }
    }, [open]);

    const fetchPatients = async () => {
        setLoadingPatients(true);
        try {
            const response = await apiClient.get('/patients');
            const data = response.data;
            if (Array.isArray(data)) {
                setPatients(data);
            } else {
                console.error('Resposta inválida:', data);
                setPatients([]);
            }
        } catch (error) {
            console.error('Erro ao buscar pacientes:', error);
            setError('Erro ao carregar lista de pacientes');
            setPatients([]);
        } finally {
            setLoadingPatients(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.patientId) {
            setError('Selecione um paciente');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (prescription) {
                await updatePrescription(prescription.id, formData);
            } else {
                await createPrescription(formData);
            }
            onSuccess?.();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao salvar prescrição');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const getSelectedPatient = () => {
        return patients.find(p => p.id === formData.patientId);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
                    borderRadius: 3,
                    border: '1px solid rgba(59, 130, 246, 0.1)'
                }
            }}
        >
            <DialogTitle
                sx={{
                    background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: '12px 12px 0 0',
                    p: 3
                }}
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            width: 48,
                            height: 48
                        }}
                    >
                        <Description />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                            {prescription ? 'Editar Prescrição' : 'Nova Prescrição'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            {prescription ? 'Atualize os dados da prescrição' : 'Crie uma nova prescrição médica'}
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    onClick={onClose}
                    sx={{
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.5)'
                        }
                    }}
                >
                    <Cancel sx={{ color: 'white' }} />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ p: 3 }}>
                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3,
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                '& .MuiAlert-icon': {
                                    color: '#EF4444'
                                }
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    {/* Stepper para navegação */}
                    <Paper
                        elevation={0}
                        sx={{
                            background: 'rgba(30, 41, 59, 0.5)',
                            borderRadius: 2,
                            p: 2,
                            mb: 3,
                            border: '1px solid rgba(59, 130, 246, 0.1)'
                        }}
                    >
                        <Stepper activeStep={activeStep} orientation="horizontal">
                            {steps.map((step, index) => (
                                <Step key={step.label}>
                                    <StepLabel
                                        StepIconComponent={() => (
                                            <Avatar
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    bgcolor: activeStep >= index ? '#3B82F6' : 'rgba(148, 163, 184, 0.3)',
                                                    color: activeStep >= index ? 'white' : '#94A3B8'
                                                }}
                                            >
                                                {step.icon}
                                            </Avatar>
                                        )}
                                        sx={{
                                            '& .MuiStepLabel-label': {
                                                color: activeStep >= index ? '#F1F5F9' : '#94A3B8',
                                                fontWeight: activeStep >= index ? 600 : 400
                                            }
                                        }}
                                    >
                                        {step.label}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Paper>

                    {/* Conteúdo do formulário baseado no step */}
                    {activeStep === 0 && (
                        <Box>
                            <Typography variant="h6" sx={{ color: '#F1F5F9', mb: 2, fontWeight: 600 }}>
                                <Person sx={{ mr: 1, color: '#3B82F6' }} />
                                Informações Básicas
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <FormControl fullWidth required>
                                        <InputLabel sx={{ color: '#94A3B8' }}>Paciente</InputLabel>
                                        <Select
                                            value={formData.patientId}
                                            onChange={(e) => handleChange('patientId', e.target.value)}
                                            label="Paciente"
                                            sx={{
                                                backgroundColor: 'rgba(15, 23, 42, 0.3)',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'rgba(59, 130, 246, 0.2)',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'rgba(59, 130, 246, 0.4)',
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#3B82F6',
                                                },
                                                '& .MuiSelect-icon': {
                                                    color: '#64748B',
                                                },
                                                '& .MuiSelect-select': {
                                                    color: '#F1F5F9',
                                                },
                                            }}
                                        >
                                            {loadingPatients ? (
                                                <MenuItem disabled>
                                                    <CircularProgress size={16} sx={{ mr: 1 }} />
                                                    Carregando pacientes...
                                                </MenuItem>
                                            ) : patients && patients.length > 0 ? (
                                                patients.map((patient) => (
                                                    <MenuItem key={patient.id} value={patient.id}>
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>
                                                                {patient.name.charAt(0)}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body2" sx={{ color: '#F1F5F9' }}>
                                                                    {patient.name}
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                                                    {patient.email}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem disabled>Nenhum paciente encontrado</MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>

                                    {getSelectedPatient() && (
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                background: 'rgba(16, 185, 129, 0.1)',
                                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                                borderRadius: 2,
                                                p: 2,
                                                mt: 2
                                            }}
                                        >
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <CheckCircle sx={{ color: '#10B981' }} />
                                                <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 500 }}>
                                                    Paciente selecionado: {getSelectedPatient()?.name}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    )}
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Data da Prescrição"
                                        type="date"
                                        value={formData.prescriptionDate}
                                        onChange={(e) => handleChange('prescriptionDate', e.target.value)}
                                        required
                                        InputLabelProps={{ shrink: true }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: 'rgba(15, 23, 42, 0.3)',
                                                '& fieldset': {
                                                    borderColor: 'rgba(59, 130, 246, 0.2)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'rgba(59, 130, 246, 0.4)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#3B82F6',
                                                },
                                            },
                                            '& .MuiInputBase-input': {
                                                color: '#F1F5F9',
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: '#94A3B8',
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Válida Até"
                                        type="date"
                                        value={formData.validUntil}
                                        onChange={(e) => handleChange('validUntil', e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        helperText="Data de validade da prescrição"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: 'rgba(15, 23, 42, 0.3)',
                                                '& fieldset': {
                                                    borderColor: 'rgba(59, 130, 246, 0.2)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'rgba(59, 130, 246, 0.4)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#3B82F6',
                                                },
                                            },
                                            '& .MuiInputBase-input': {
                                                color: '#F1F5F9',
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: '#94A3B8',
                                            },
                                            '& .MuiFormHelperText-root': {
                                                color: '#64748B',
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {activeStep === 1 && (
                        <Box>
                            <Typography variant="h6" sx={{ color: '#F1F5F9', mb: 2, fontWeight: 600 }}>
                                <LocalHospital sx={{ mr: 1, color: '#EF4444' }} />
                                Diagnóstico
                            </Typography>

                            <TextField
                                fullWidth
                                label="Diagnóstico"
                                value={formData.diagnosis}
                                onChange={(e) => handleChange('diagnosis', e.target.value)}
                                required
                                multiline
                                rows={4}
                                helperText="Descreva detalhadamente o diagnóstico do paciente"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'rgba(15, 23, 42, 0.3)',
                                        '& fieldset': {
                                            borderColor: 'rgba(59, 130, 246, 0.2)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'rgba(59, 130, 246, 0.4)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#3B82F6',
                                        },
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#F1F5F9',
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#94A3B8',
                                    },
                                    '& .MuiFormHelperText-root': {
                                        color: '#64748B',
                                    },
                                }}
                            />
                        </Box>
                    )}

                    {activeStep === 2 && (
                        <Box>
                            <Typography variant="h6" sx={{ color: '#F1F5F9', mb: 2, fontWeight: 600 }}>
                                <Medication sx={{ mr: 1, color: '#10B981' }} />
                                Prescrição
                            </Typography>

                            <TextField
                                fullWidth
                                label="Prescrição"
                                value={formData.prescription}
                                onChange={(e) => handleChange('prescription', e.target.value)}
                                required
                                multiline
                                rows={8}
                                helperText="Descreva os medicamentos, dosagens e posologia prescritos"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'rgba(15, 23, 42, 0.3)',
                                        '& fieldset': {
                                            borderColor: 'rgba(59, 130, 246, 0.2)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'rgba(59, 130, 246, 0.4)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#3B82F6',
                                        },
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#F1F5F9',
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#94A3B8',
                                    },
                                    '& .MuiFormHelperText-root': {
                                        color: '#64748B',
                                    },
                                }}
                            />
                        </Box>
                    )}

                    {activeStep === 3 && (
                        <Box>
                            <Typography variant="h6" sx={{ color: '#F1F5F9', mb: 2, fontWeight: 600 }}>
                                <Notes sx={{ mr: 1, color: '#F59E0B' }} />
                                Observações
                            </Typography>

                            <TextField
                                fullWidth
                                label="Observações"
                                value={formData.observations}
                                onChange={(e) => handleChange('observations', e.target.value)}
                                multiline
                                rows={4}
                                helperText="Observações adicionais sobre a prescrição (opcional)"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'rgba(15, 23, 42, 0.3)',
                                        '& fieldset': {
                                            borderColor: 'rgba(59, 130, 246, 0.2)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'rgba(59, 130, 246, 0.4)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#3B82F6',
                                        },
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#F1F5F9',
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#94A3B8',
                                    },
                                    '& .MuiFormHelperText-root': {
                                        color: '#64748B',
                                    },
                                }}
                            />
                        </Box>
                    )}

                    {/* Navegação entre steps */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.5)'
                                },
                                '&:disabled': {
                                    color: 'rgba(255, 255, 255, 0.3)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            Anterior
                        </Button>

                        <Box>
                            {activeStep === steps.length - 1 ? (
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <Save sx={{ color: 'white' }} />}
                                    disabled={loading}
                                    sx={{
                                        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                                        fontWeight: 600,
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                                            border: '1px solid rgba(255, 255, 255, 0.5)'
                                        }
                                    }}
                                >
                                    {loading ? 'Salvando...' : 'Salvar Prescrição'}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{
                                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                        fontWeight: 600,
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                            border: '1px solid rgba(255, 255, 255, 0.5)'
                                        }
                                    }}
                                >
                                    Próximo
                                </Button>
                            )}
                        </Box>
                    </Box>
                </DialogContent>
            </form>
        </Dialog>
    );
} 