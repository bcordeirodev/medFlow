'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Box,
    TextField,
    Autocomplete,
    Chip,
    Typography,
    Paper,
    CircularProgress,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Search,
    Add,
    MedicalServices,
    Info,
} from '@mui/icons-material';
import { Medicine } from '@/lib/types';
import { MedicinesService } from '@/services/medicines.service';

interface MedicineAutocompleteProps {
    onMedicineSelect: (medicine: Medicine) => void;
    placeholder?: string;
}

export default function MedicineAutocomplete({
    onMedicineSelect,
    placeholder = "Buscar medicamento..."
}: MedicineAutocompleteProps) {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout>();

    // Buscar medicamentos com debounce
    useEffect(() => {
        if (searchTerm.length < 2) {
            setMedicines([]);
            return;
        }

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const results = await MedicinesService.searchMedicines(searchTerm);
                setMedicines(results);
            } catch (error) {
                console.error('Erro ao buscar medicamentos:', error);
                setMedicines([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm]);

    const handleMedicineSelect = (medicine: Medicine | null) => {
        if (medicine) {
            setSelectedMedicine(medicine);
            onMedicineSelect(medicine);
            setSearchTerm('');
            setMedicines([]);
        }
    };

    const formatMedicineInfo = (medicine: Medicine) => {
        return `${medicine.name} - ${medicine.dosage}`;
    };

    const getMedicineDetails = (medicine: Medicine) => {
        return {
            name: medicine.name,
            dosage: medicine.dosage,
            manufacturer: medicine.manufacturer,
            activeIngredient: medicine.activeIngredient,
            description: medicine.description,
        };
    };

    return (
        <Box>
            <Autocomplete
                options={medicines}
                getOptionLabel={(option) => formatMedicineInfo(option)}
                loading={loading}
                value={selectedMedicine}
                onChange={(_, newValue) => handleMedicineSelect(newValue)}
                onInputChange={(_, newInputValue) => setSearchTerm(newInputValue)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder={placeholder}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <>
                                    <Search sx={{ color: 'text.secondary', mr: 1 }} />
                                    {params.InputProps.startAdornment}
                                </>
                            ),
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 1)',
                                },
                                '&.Mui-focused': {
                                    backgroundColor: 'rgba(255, 255, 255, 1)',
                                    boxShadow: '0 0 0 2px rgba(74, 144, 226, 0.2)',
                                },
                            },
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
                noOptionsText={
                    searchTerm.length < 2
                        ? "Digite pelo menos 2 caracteres para buscar"
                        : "Nenhum medicamento encontrado"
                }
                loadingText="Buscando medicamentos..."
                sx={{
                    '& .MuiAutocomplete-paper': {
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                    },
                }}
            />
        </Box>
    );
} 