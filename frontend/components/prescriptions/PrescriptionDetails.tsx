'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    IconButton,
    Paper,
    Divider,
    Alert,
    Avatar,
    Card,
    CardContent,
    Grid,
    Chip
} from '@mui/material';
import {
    Close,
    ContentCopy,
    CheckCircle,
    Person,
    LocalHospital,
    CalendarToday,
    Schedule,
    MedicalServices,
    Description,
    Assignment
} from '@mui/icons-material';

interface Patient {
    id: number;
    name: string;
    email: string;
}

interface Doctor {
    id: number;
    name: string;
    email: string;
}

interface Prescription {
    id: number;
    diagnosis: string;
    prescription: string;
    observations: string;
    prescriptionDate: string;
    validUntil: string;
    doctorId: number;
    patientId: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    doctor: Doctor;
    patient: Patient;
}

interface PrescriptionDetailsProps {
    prescriptionId: number;
    onClose: () => void;
}

export default function PrescriptionDetails({ prescriptionId, onClose }: PrescriptionDetailsProps) {
    const [prescription, setPrescription] = useState<Prescription | null>(null);
    const [loading, setLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        fetchPrescription();
    }, [prescriptionId]);

    const fetchPrescription = async () => {
        try {
            const response = await axios.get(`/api/prescriptions/${prescriptionId}`);
            setPrescription(response.data);
        } catch (error) {
            console.error('Erro ao buscar prescrição:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyContent = async () => {
        if (!prescription) return;

        const content = `
PRESCRIÇÃO MÉDICA

PACIENTE: ${prescription.patient.name}
MÉDICO: Dr. ${prescription.doctor.name}
DATA: ${new Date(prescription.prescriptionDate).toLocaleDateString('pt-BR')}
VÁLIDA ATÉ: ${prescription.validUntil ? new Date(prescription.validUntil).toLocaleDateString('pt-BR') : 'Não especificado'}

DIAGNÓSTICO:
${prescription.diagnosis}

PRESCRIÇÃO:
${prescription.prescription}

OBSERVAÇÕES:
${prescription.observations || 'Nenhuma observação adicional.'}

Status: ${prescription.isActive ? 'ATIVA' : 'INATIVA'}
ID: ${prescription.id}
        `.trim();

        try {
            await navigator.clipboard.writeText(content);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (error) {
            console.error('Erro ao copiar:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const isExpired = (validUntil: string) => {
        return new Date(validUntil) < new Date();
    };

    if (loading) {
        return (
            <Dialog open={true} maxWidth="md" fullWidth>
                <DialogContent>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <Typography>Carregando...</Typography>
                    </Box>
                </DialogContent>
            </Dialog>
        );
    }

    if (!prescription) {
        return (
            <Dialog open={true} maxWidth="md" fullWidth>
                <DialogContent>
                    <Alert severity="error">Prescrição não encontrada</Alert>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog
            open={true}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    maxHeight: '90vh'
                }
            }}
        >
            <DialogTitle
                sx={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mr: 2 }}>
                        <LocalHospital />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Prescrição Médica
                    </Typography>
                </Box>
                <Box display="flex" gap={1}>
                    <IconButton
                        onClick={handleCopyContent}
                        sx={{
                            color: copySuccess ? '#4caf50' : 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }
                        }}
                        title={copySuccess ? "Conteúdo copiado!" : "Copiar conteúdo"}
                    >
                        {copySuccess ? <CheckCircle /> : <ContentCopy />}
                    </IconButton>
                    <IconButton
                        onClick={onClose}
                        sx={{
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }
                        }}
                    >
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 3, mt: 2 }}>
                {/* Informações do Paciente e Médico */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                                        <Person />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" color="textSecondary">
                                            PACIENTE
                                        </Typography>
                                        <Typography variant="h6">
                                            {prescription.patient.name}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Avatar sx={{ bgcolor: '#2e7d32', mr: 2 }}>
                                        <LocalHospital />
                                    </Avatar>

                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box display="flex" alignItems="center">
                                    <Avatar sx={{ bgcolor: '#ed6c02', mr: 2 }}>
                                        <CalendarToday />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" color="textSecondary">
                                            DATA DA PRESCRIÇÃO
                                        </Typography>
                                        <Typography variant="h6">
                                            {formatDate(prescription.prescriptionDate)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box display="flex" alignItems="center">
                                    <Avatar sx={{ bgcolor: '#9c27b0', mr: 2 }}>
                                        <Schedule />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" color="textSecondary">
                                            VÁLIDA ATÉ
                                        </Typography>
                                        <Typography variant="h6">
                                            {prescription.validUntil ? formatDate(prescription.validUntil) : 'Não especificado'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Status */}
                        <Box display="flex" gap={1} mt={2}>
                            <Chip
                                label={prescription.isActive ? 'ATIVA' : 'INATIVA'}
                                color={prescription.isActive ? 'success' : 'error'}
                                size="small"
                            />
                            {prescription.validUntil && (
                                <Chip
                                    label={isExpired(prescription.validUntil) ? 'EXPIRADA' : 'VÁLIDA'}
                                    color={isExpired(prescription.validUntil) ? 'error' : 'success'}
                                    size="small"
                                />
                            )}
                        </Box>
                    </CardContent>
                </Card>

                {/* Diagnóstico */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                            <Assignment sx={{ mr: 2, color: '#1976d2' }} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Diagnóstico
                            </Typography>
                        </Box>
                        <Typography
                            variant="body1"
                            sx={{
                                p: 2,
                                backgroundColor: 'rgba(25, 118, 210, 0.05)',
                                borderRadius: 1,
                                border: '1px solid rgba(25, 118, 210, 0.1)'
                            }}
                        >
                            {prescription.diagnosis}
                        </Typography>
                    </CardContent>
                </Card>

                {/* Prescrição */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                            <MedicalServices sx={{ mr: 2, color: '#2e7d32' }} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Prescrição Médica
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                p: 2,
                                backgroundColor: 'rgba(46, 125, 50, 0.05)',
                                borderRadius: 1,
                                border: '1px solid rgba(46, 125, 50, 0.1)',
                                whiteSpace: 'pre-wrap',
                                fontFamily: 'monospace',
                                fontSize: '0.9rem',
                                lineHeight: 1.6
                            }}
                        >
                            {prescription.prescription}
                        </Box>
                    </CardContent>
                </Card>

                {/* Observações */}
                <Card>
                    <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                            <Description sx={{ mr: 2, color: '#ed6c02' }} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Observações
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                p: 2,
                                backgroundColor: 'rgba(237, 108, 2, 0.05)',
                                borderRadius: 1,
                                border: '1px solid rgba(237, 108, 2, 0.1)',
                                whiteSpace: 'pre-wrap',
                                minHeight: '60px'
                            }}
                        >
                            {prescription.observations || (
                                <Typography color="textSecondary" fontStyle="italic">
                                    Nenhuma observação adicional.
                                </Typography>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{ fontWeight: 600 }}
                >
                    Fechar
                </Button>
            </DialogActions>
        </Dialog>
    );
} 