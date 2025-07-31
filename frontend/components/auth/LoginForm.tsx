'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Container,
    Grid
} from '@mui/material';
import {
    Login,
    Person,
    Lock,
    MedicalServices
} from '@mui/icons-material';

export default function LoginForm() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(email, password);
        } catch (error) {
            setError('Email ou senha inválidos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                p: 2
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={8}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        background: 'rgba(30, 41, 59, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
                    }}
                >
                    <Box textAlign="center" mb={4}>
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 2,
                                boxShadow: '0 8px 32px rgba(30, 58, 138, 0.4)'
                            }}
                        >
                            <MedicalServices sx={{ color: 'white', fontSize: 40 }} />
                        </Box>
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                color: '#F1F5F9',
                                mb: 1
                            }}
                        >
                            MedFlow
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ fontWeight: 500, color: '#94A3B8' }}
                        >
                            Sistema de Gestão Médica
                        </Typography>
                    </Box>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 3, borderRadius: 2 }}
                        >
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    InputProps={{
                                        startAdornment: <Person sx={{ mr: 1, color: '#3B82F6' }} />
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'rgba(30, 41, 59, 0.9)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(30, 41, 59, 1)'
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: 'rgba(30, 41, 59, 1)',
                                                boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
                                            }
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Senha"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    InputProps={{
                                        startAdornment: <Lock sx={{ mr: 1, color: '#3B82F6' }} />
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: 'rgba(30, 41, 59, 0.9)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(30, 41, 59, 1)'
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: 'rgba(30, 41, 59, 1)',
                                                boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
                                            }
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} /> : <Login />}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '1.1rem',
                                        boxShadow: '0 4px 15px rgba(30, 58, 138, 0.4)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)',
                                            boxShadow: '0 6px 20px rgba(30, 58, 138, 0.6)',
                                            transform: 'translateY(-2px)'
                                        },
                                        '&:disabled': {
                                            background: 'linear-gradient(135deg, #475569 0%, #64748B 100%)',
                                            transform: 'none'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {loading ? 'Entrando...' : 'Entrar'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>

                    <Box textAlign="center" mt={3}>
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, color: '#94A3B8' }}
                        >
                            Acesse com suas credenciais médicas
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
} 