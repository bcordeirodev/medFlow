'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Chip,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Lightbulb,
    ContentCopy,
    Refresh,
    Check,
    AutoAwesome,
    MedicalServices,
} from '@mui/icons-material';
import { PrescriptionsService } from '@/services/prescriptions.service';

interface ObservationSuggestionsProps {
    diagnosis: string;
    medicines: string[];
    onSuggestionSelect: (suggestion: string) => void;
}

export default function ObservationSuggestions({
    diagnosis,
    medicines,
    onSuggestionSelect
}: ObservationSuggestionsProps) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);

    const generateSuggestions = async () => {
        if (!diagnosis.trim() || medicines.length === 0) {
            setError('Diagnóstico e medicamentos são necessários para gerar sugestões');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await PrescriptionsService.suggestObservations(diagnosis, medicines);
            setSuggestions(response.suggestions);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao gerar sugestões');
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionSelect = (suggestion: string) => {
        if (selectedSuggestions.includes(suggestion)) {
            setSelectedSuggestions(prev => prev.filter(s => s !== suggestion));
        } else {
            setSelectedSuggestions(prev => [...prev, suggestion]);
        }
    };

    const handleApplySelected = () => {
        const combinedSuggestions = selectedSuggestions.join('\n\n');
        onSuggestionSelect(combinedSuggestions);
    };

    const handleCopySuggestions = async () => {
        const allSuggestions = suggestions.join('\n\n');
        try {
            await navigator.clipboard.writeText(allSuggestions);
            alert('Sugestões copiadas para a área de transferência!');
        } catch (error) {
            console.error('Erro ao copiar:', error);
        }
    };

    return (
        <Paper elevation={2} sx={{
            p: 2.5,
            mt: 2,
            backgroundColor: '#1E293B',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: 2
        }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
                <AutoAwesome sx={{ color: '#3B82F6' }} />
                <Typography variant="h6" component="h3" sx={{ color: '#F1F5F9', fontWeight: 600 }}>
                    Sugestões de Observações
                </Typography>
                <Chip
                    label="IA"
                    size="small"
                    icon={<Lightbulb />}
                    sx={{
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        color: '#FFFFFF',
                        border: '1px solid rgba(59, 130, 246, 0.9)',
                        fontWeight: 600,
                        '&:hover': {
                            backgroundColor: 'rgba(59, 130, 246, 0.9)',
                        }
                    }}
                />
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box mb={2}>
                <Box display="flex" alignItems="center" gap={2} mb={1.5}>
                    <Typography variant="body2" sx={{ color: '#E2E8F0', fontWeight: 600 }}>
                        <strong style={{ color: '#F1F5F9' }}>Diagnóstico:</strong> {diagnosis}
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={2} mb={1.5}>
                    <Typography variant="body2" sx={{ color: '#E2E8F0', fontWeight: 600 }}>
                        <strong style={{ color: '#F1F5F9' }}>Medicamentos:</strong>
                    </Typography>
                </Box>
                <Box display="flex" gap={1} flexWrap="wrap">
                    {medicines.map((medicine, index) => (
                        <Chip
                            key={index}
                            label={medicine}
                            size="small"
                            icon={<MedicalServices sx={{ color: '#FFFFFF' }} />}
                            sx={{
                                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                                color: '#FFFFFF',
                                border: '1px solid rgba(16, 185, 129, 0.9)',
                                fontWeight: 600,
                                '&:hover': {
                                    backgroundColor: 'rgba(16, 185, 129, 0.9)',
                                    transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease'
                            }}
                        />
                    ))}
                </Box>
            </Box>

            <Box display="flex" gap={2} mb={2}>
                <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesome />}
                    onClick={generateSuggestions}
                    disabled={loading || !diagnosis.trim() || medicines.length === 0}
                >
                    {loading ? 'Gerando...' : 'Gerar Sugestões'}
                </Button>

                {suggestions.length > 0 && (
                    <>
                        <Button
                            variant="outlined"
                            startIcon={<ContentCopy />}
                            onClick={handleCopySuggestions}
                        >
                            Copiar Todas
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Refresh />}
                            onClick={generateSuggestions}
                            disabled={loading}
                        >
                            Regenerar
                        </Button>
                    </>
                )}
            </Box>

            {suggestions.length > 0 && (
                <>
                    <Divider sx={{ my: 1.5 }} />

                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: '#F1F5F9' }}>
                        Sugestões Geradas ({suggestions.length})
                    </Typography>

                    <List>
                        {suggestions.map((suggestion, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    border: '2px solid',
                                    borderColor: selectedSuggestions.includes(suggestion)
                                        ? 'rgba(59, 130, 246, 0.8)'
                                        : 'rgba(59, 130, 246, 0.4)',
                                    borderRadius: 2,
                                    mb: 1,
                                    backgroundColor: selectedSuggestions.includes(suggestion)
                                        ? 'rgba(59, 130, 246, 0.25)'
                                        : 'rgba(30, 41, 59, 0.6)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: selectedSuggestions.includes(suggestion)
                                            ? 'rgba(59, 130, 246, 0.35)'
                                            : 'rgba(59, 130, 246, 0.15)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                                    },
                                }}
                                onClick={() => handleSuggestionSelect(suggestion)}
                            >
                                <ListItemIcon>
                                    {selectedSuggestions.includes(suggestion) ? (
                                        <Check sx={{ color: '#3B82F6', fontSize: '1.2rem' }} />
                                    ) : (
                                        <Lightbulb sx={{ color: '#F59E0B', fontSize: '1.2rem' }} />
                                    )}
                                </ListItemIcon>
                                <ListItemText
                                    primary={suggestion}
                                    primaryTypographyProps={{
                                        variant: 'body2',
                                        sx: {
                                            color: selectedSuggestions.includes(suggestion)
                                                ? '#3B82F6'
                                                : '#E2E8F0',
                                            fontWeight: selectedSuggestions.includes(suggestion) ? 600 : 400
                                        }
                                    }}
                                />
                                <Tooltip title="Selecionar sugestão">
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSuggestionSelect(suggestion);
                                        }}
                                        sx={{
                                            color: selectedSuggestions.includes(suggestion) ? '#3B82F6' : '#94A3B8',
                                            backgroundColor: selectedSuggestions.includes(suggestion)
                                                ? 'rgba(59, 130, 246, 0.4)'
                                                : 'rgba(148, 163, 184, 0.2)',
                                            '&:hover': {
                                                backgroundColor: selectedSuggestions.includes(suggestion)
                                                    ? 'rgba(59, 130, 246, 0.6)'
                                                    : 'rgba(148, 163, 184, 0.4)',
                                                transform: 'scale(1.1)'
                                            },
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <Check />
                                    </IconButton>
                                </Tooltip>
                            </ListItem>
                        ))}
                    </List>

                    {selectedSuggestions.length > 0 && (
                        <Box mt={2}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#F1F5F9' }}>
                                Sugestões Selecionadas ({selectedSuggestions.length})
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<Check />}
                                onClick={handleApplySelected}
                                fullWidth
                                sx={{
                                    background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                                    color: 'white',
                                    fontWeight: 600,
                                    py: 2,
                                    borderRadius: 2,
                                    boxShadow: '0 4px 15px rgba(5, 150, 105, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                        boxShadow: '0 6px 20px rgba(5, 150, 105, 0.6)',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Aplicar Sugestões Selecionadas
                            </Button>
                        </Box>
                    )}
                </>
            )}
        </Paper>
    );
} 