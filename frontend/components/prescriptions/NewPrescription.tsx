'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
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
    Grid
} from '@mui/material';
import {
    Description,
    Save,
    Clear
} from '@mui/icons-material';

interface Patient {
    id: number;
    name: string;
    email: string;
}

export default function NewPrescription() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [prescription, setPrescription] = useState('');
    const [observations, setObservations] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('/api/patients');
            setPatients(response.data);
        } catch (error) {
            console.error('Erro ao buscar pacientes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatient) {
            alert('Selecione um paciente');
            return;
        }

        setSaving(true);
        try {
            await axios.post('/api/prescriptions', {
                patientId: parseInt(selectedPatient),
                diagnosis,
                prescription,
                observations,
            });

            // Limpar formulário
            setSelectedPatient('');
            setDiagnosis('');
            setPrescription('');
            setObservations('');

            alert('Receita criada com sucesso!');
        } catch (error) {
            console.error('Erro ao criar receita:', error);
            alert('Erro ao criar receita');
        } finally {
            setSaving(false);
        }
    };

    const handleClear = () => {
        setSelectedPatient('');
        setDiagnosis('');
        setPrescription('');
        setObservations('');
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
                <Description sx={{ color: '#3B82F6' }} />
                <Typography variant="h4" component="h1" sx={{ color: '#F1F5F9', fontWeight: 600 }}>
                    Nova Receita
                </Typography>
            </Box>

            <Paper elevation={2} sx={{ p: 3, backgroundColor: '#1E293B', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Paciente</InputLabel>
                                <Select
                                    value={selectedPatient}
                                    label="Paciente"
                                    onChange={(e) => setSelectedPatient(e.target.value)}
                                >
                                    {patients.map((patient) => (
                                        <MenuItem key={patient.id} value={patient.id}>
                                            {patient.name} - {patient.email}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Diagnóstico"
                                multiline
                                rows={3}
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                placeholder="Descreva o diagnóstico..."
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Prescrição"
                                multiline
                                rows={6}
                                value={prescription}
                                onChange={(e) => setPrescription(e.target.value)}
                                placeholder="Descreva a prescrição médica..."
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Observações"
                                multiline
                                rows={3}
                                value={observations}
                                onChange={(e) => setObservations(e.target.value)}
                                placeholder="Observações adicionais..."
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box display="flex" gap={2} justifyContent="flex-end">
                                <Button
                                    variant="outlined"
                                    startIcon={<Clear />}
                                    onClick={handleClear}
                                >
                                    Limpar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                                    disabled={saving}
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