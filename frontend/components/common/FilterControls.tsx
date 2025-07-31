import React from 'react';
import {
    Grid,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ToggleButtonGroup,
    ToggleButton,
    Button,
    Menu,
    Paper
} from '@mui/material';
import {
    Search,
    ViewList,
    ViewModule,
    FilterList,
    Download,
    TrendingUp
} from '@mui/icons-material';

/**
 * FilterControls - Componente para controles de filtro e busca
 * 
 * @param searchTerm - Termo de busca atual
 * @param onSearchChange - Função chamada quando o termo de busca muda
 * @param searchPlaceholder - Placeholder do campo de busca
 * @param filterBy - Valor atual do filtro
 * @param onFilterChange - Função chamada quando o filtro muda
 * @param filterOptions - Opções disponíveis para filtro
 * @param sortBy - Valor atual da ordenação
 * @param onSortChange - Função chamada quando a ordenação muda
 * @param sortOptions - Opções disponíveis para ordenação
 * @param viewMode - Modo de visualização atual ('grid' | 'list')
 * @param onViewModeChange - Função chamada quando o modo de visualização muda
 * @param onMenuOpen - Função chamada para abrir o menu de filtros adicionais
 * @param anchorEl - Elemento âncora do menu
 * @param onMenuClose - Função chamada para fechar o menu
 */
interface FilterOption {
    value: string;
    label: string;
}

interface FilterControlsProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder: string;
    filterBy: string;
    onFilterChange: (value: string) => void;
    filterOptions: FilterOption[];
    sortBy: string;
    onSortChange: (value: string) => void;
    sortOptions: FilterOption[];
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
    anchorEl: HTMLElement | null;
    onMenuClose: () => void;
}

export default function FilterControls({
    searchTerm,
    onSearchChange,
    searchPlaceholder,
    filterBy,
    onFilterChange,
    filterOptions,
    sortBy,
    onSortChange,
    sortOptions,
    viewMode,
    onViewModeChange,
    onMenuOpen,
    anchorEl,
    onMenuClose
}: FilterControlsProps) {
    return (
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
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: '#64748B' }} />
                                </InputAdornment>
                            ),
                        }}
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
                            '& .MuiInputBase-input::placeholder': {
                                color: '#64748B',
                            },
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                        <InputLabel sx={{ color: '#94A3B8' }}>Filtrar</InputLabel>
                        <Select
                            value={filterBy}
                            onChange={(e) => onFilterChange(e.target.value)}
                            label="Filtrar"
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
                            {filterOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                        <InputLabel sx={{ color: '#94A3B8' }}>Ordenar</InputLabel>
                        <Select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                            label="Ordenar"
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
                            {sortOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={(e, newMode) => newMode && onViewModeChange(newMode)}
                        sx={{
                            '& .MuiToggleButton-root': {
                                backgroundColor: 'rgba(15, 23, 42, 0.3)',
                                borderColor: 'rgba(59, 130, 246, 0.2)',
                                color: '#94A3B8',
                                '&.Mui-selected': {
                                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                    color: '#3B82F6',
                                    '&:hover': {
                                        backgroundColor: 'rgba(59, 130, 246, 0.3)',
                                    },
                                },
                                '&:hover': {
                                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                },
                            },
                        }}
                    >
                        <ToggleButton value="grid">
                            <ViewModule />
                        </ToggleButton>
                        <ToggleButton value="list">
                            <ViewList />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={12} md={2}>
                    <Button
                        variant="outlined"
                        startIcon={<FilterList />}
                        onClick={onMenuOpen}
                        fullWidth
                        sx={{
                            borderColor: 'rgba(59, 130, 246, 0.3)',
                            color: '#3B82F6',
                            '&:hover': {
                                borderColor: '#3B82F6',
                                backgroundColor: 'rgba(59, 130, 246, 0.05)'
                            }
                        }}
                    >
                        Mais Filtros
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={onMenuClose}
                        PaperProps={{
                            sx: {
                                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                border: '1px solid rgba(59, 130, 246, 0.2)',
                                mt: 1
                            }
                        }}
                    >
                        <MenuItem onClick={onMenuClose}>
                            <Download sx={{ mr: 1 }} />
                            Exportar Lista
                        </MenuItem>
                        <MenuItem onClick={onMenuClose}>
                            <TrendingUp sx={{ mr: 1 }} />
                            Relatórios
                        </MenuItem>
                    </Menu>
                </Grid>
            </Grid>
        </Paper>
    );
} 