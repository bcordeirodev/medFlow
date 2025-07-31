'use client';

import { useMemo } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Chip,
    IconButton,
    Paper,
    Divider,
    Alert,
    Avatar,
    Tooltip,
    Fade
} from '@mui/material';
import {
    Medication,
    Info,
    Warning,
    Visibility,
    Edit,
    Star,
    Favorite,
    FavoriteBorder
} from '@mui/icons-material';
import {
    ModuleHeader,
    FilterControls,
    StatsGrid,
    EmptyState
} from '@/components/common';
import {
    useListState,
    useDataFetching,
    useFormModal,
    useDetailsModal
} from '@/hooks';
import { filterItems, sortItems, calculateStats } from '@/utils/filterUtils';
import { STATS_COLORS } from '@/utils/constants';
import MedicineDetails from './MedicineDetails';
import MedicineForm from './MedicineForm';

/**
 * Interface para medicamento
 */
interface Medicine {
    id: number;
    name: string;
    genericName: string;
    manufacturer: string;
    description: string;
    dosage: string;
    contraindications: string;
    sideEffects: string;
    interactions: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Tipos para controle de visualização e filtros
 */
type SortOption = 'name' | 'manufacturer' | 'createdAt' | 'isActive';
type FilterOption = 'all' | 'active' | 'inactive';

/**
 * MedicinesList - Componente principal para listagem de medicamentos
 * 
 * Funcionalidades:
 * - Listagem com filtros avançados
 * - Sistema de favoritos
 * - Estatísticas em tempo real
 * - Modo grid/lista
 * - Busca por nome, genérico e fabricante
 * - Ordenação por diferentes critérios
 */
export default function MedicinesList() {
    // Hooks customizados
    const {
        searchTerm,
        viewMode,
        sortBy,
        filterBy,
        favorites,
        anchorEl,
        setSearchTerm,
        setViewMode,
        setSortBy,
        setFilterBy,
        toggleFavorite,
        handleMenuOpen,
        handleMenuClose
    } = useListState<'grid' | 'list', SortOption, FilterOption>('grid' as const, 'name' as SortOption, 'all' as FilterOption);

    const { data: medicines, loading, refetch } = useDataFetching<Medicine>('/api/medicines');
    const { isOpen: showForm, editingItem, openCreate, openEdit, closeModal } = useFormModal<Medicine>();
    const { selectedId, isOpen: showDetails, openDetails, closeDetails } = useDetailsModal();

    // Configurações de filtro e ordenação
    const searchFields: (keyof Medicine)[] = ['name', 'genericName', 'manufacturer'];

    const filterConditions = {
        all: () => true,
        active: (medicine: Medicine) => medicine.isActive,
        inactive: (medicine: Medicine) => !medicine.isActive
    };

    const sortConditions = {
        name: (a: Medicine, b: Medicine) => a.name.localeCompare(b.name),
        manufacturer: (a: Medicine, b: Medicine) => a.manufacturer.localeCompare(b.manufacturer),
        createdAt: (a: Medicine, b: Medicine) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        isActive: (a: Medicine, b: Medicine) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0)
    };

    // Dados filtrados e ordenados
    const filteredAndSortedMedicines = useMemo(() => {
        const filtered = filterItems(medicines, searchTerm, searchFields, filterBy, filterConditions);
        return sortItems(filtered, sortBy, sortConditions);
    }, [medicines, searchTerm, filterBy, sortBy]);

    // Estatísticas
    const stats = useMemo(() => {
        const baseStats = calculateStats(medicines, favorites);
        return {
            ...baseStats,
            active: medicines.filter(m => m.isActive).length,
            inactive: medicines.filter(m => !m.isActive).length
        };
    }, [medicines, favorites]);

    // Configurações para os componentes
    const statsData = useMemo(() => [
        {
            value: stats.total,
            label: 'Total',
            ...STATS_COLORS.primary
        },
        {
            value: stats.active,
            label: 'Ativos',
            ...STATS_COLORS.success
        },
        {
            value: stats.inactive,
            label: 'Inativos',
            ...STATS_COLORS.error
        },
        {
            value: stats.favorites,
            label: 'Favoritos',
            ...STATS_COLORS.warning
        }
    ], [stats]);

    const filterOptions = [
        { value: 'all', label: 'Todos' },
        { value: 'active', label: 'Ativos' },
        { value: 'inactive', label: 'Inativos' }
    ];

    const sortOptions = [
        { value: 'name', label: 'Nome' },
        { value: 'manufacturer', label: 'Fabricante' },
        { value: 'createdAt', label: 'Data de Criação' },
        { value: 'isActive', label: 'Status' }
    ];

    // Handlers
    const handleFormSuccess = () => {
        refetch();
        closeModal();
    };

    const handleDetailsUpdate = () => {
        refetch();
    };

    // Estados de loading
    if (loading) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px">
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#94A3B8' }}>
                    Carregando medicamentos...
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header do módulo */}
            <Paper
                elevation={0}
                sx={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    borderRadius: 3,
                    p: 3,
                    mb: 3,
                    border: '1px solid rgba(59, 130, 246, 0.1)'
                }}
            >
                <ModuleHeader
                    title="Medicamentos"
                    subtitle="Gerencie o catálogo de medicamentos"
                    icon={<Medication sx={{ fontSize: 28 }} />}
                    onRefresh={refetch}
                    onAdd={openCreate}
                    addButtonText="Novo Medicamento"
                />

                {/* Grid de estatísticas */}
                <StatsGrid stats={statsData} />
            </Paper>

            {/* Controles de filtro */}
            <FilterControls
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Buscar medicamentos..."
                filterBy={filterBy}
                onFilterChange={(value) => setFilterBy(value as FilterOption)}
                filterOptions={filterOptions}
                sortBy={sortBy}
                onSortChange={(value) => setSortBy(value as SortOption)}
                sortOptions={sortOptions}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onMenuOpen={handleMenuOpen}
                anchorEl={anchorEl}
                onMenuClose={handleMenuClose}
            />

            {/* Lista de medicamentos */}
            {filteredAndSortedMedicines.length > 0 && (
                <Grid container spacing={3}>
                    {filteredAndSortedMedicines.map((medicine, index) => (
                        <Grid item xs={12} md={viewMode === 'grid' ? 6 : 12} lg={viewMode === 'grid' ? 4 : 12} key={medicine.id}>
                            <Fade in timeout={300 + index * 100}>
                                <Card
                                    sx={{
                                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.8) 100%)',
                                        borderRadius: 3,
                                        border: '1px solid rgba(59, 130, 246, 0.1)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 25px rgba(59, 130, 246, 0.15)',
                                            borderColor: 'rgba(59, 130, 246, 0.3)',
                                        },
                                        position: 'relative',
                                        overflow: 'visible'
                                    }}
                                >
                                    {favorites.has(medicine.id) && (
                                        <Chip
                                            icon={<Star />}
                                            label="Favorito"
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: -10,
                                                right: 16,
                                                backgroundColor: '#F59E0B',
                                                color: 'white',
                                                fontWeight: 600,
                                                zIndex: 1
                                            }}
                                        />
                                    )}

                                    <CardContent sx={{ p: 3 }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                            <Box display="flex" alignItems="center" flex={1}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: medicine.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                        color: medicine.isActive ? '#10B981' : '#EF4444',
                                                        mr: 2,
                                                        width: 48,
                                                        height: 48
                                                    }}
                                                >
                                                    <Medication />
                                                </Avatar>
                                                <Box flex={1}>
                                                    <Typography
                                                        variant="h6"
                                                        component="div"
                                                        sx={{
                                                            color: '#F1F5F9',
                                                            fontWeight: 600,
                                                            mb: 0.5
                                                        }}
                                                    >
                                                        {medicine.name}
                                                    </Typography>
                                                    {medicine.genericName && (
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ color: '#94A3B8', fontStyle: 'italic' }}
                                                        >
                                                            {medicine.genericName}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                            <Box display="flex" gap={1}>
                                                <Tooltip title={favorites.has(medicine.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => toggleFavorite(medicine.id)}
                                                        sx={{
                                                            color: favorites.has(medicine.id) ? '#F59E0B' : '#64748B',
                                                            '&:hover': {
                                                                color: favorites.has(medicine.id) ? '#D97706' : '#3B82F6'
                                                            }
                                                        }}
                                                    >
                                                        {favorites.has(medicine.id) ? <Favorite /> : <FavoriteBorder />}
                                                    </IconButton>
                                                </Tooltip>
                                                <Chip
                                                    label={medicine.isActive ? 'Ativo' : 'Inativo'}
                                                    color={medicine.isActive ? 'success' : 'error'}
                                                    size="small"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            </Box>
                                        </Box>

                                        <Box mb={2}>
                                            <Typography
                                                variant="body2"
                                                display="flex"
                                                alignItems="center"
                                                mb={1}
                                                sx={{ color: '#E2E8F0' }}
                                            >
                                                <Info sx={{ mr: 1, fontSize: '1rem', color: '#06B6D4' }} />
                                                <strong>Fabricante:</strong> {medicine.manufacturer}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                display="flex"
                                                alignItems="center"
                                                mb={1}
                                                sx={{ color: '#E2E8F0' }}
                                            >
                                                <Medication sx={{ mr: 1, fontSize: '1rem', color: '#10B981' }} />
                                                <strong>Dosagem:</strong> {medicine.dosage}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: '#94A3B8',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    fontSize: '0.9rem',
                                                    lineHeight: 1.6
                                                }}
                                            >
                                                {medicine.description}
                                            </Typography>
                                        </Box>

                                        {(medicine.contraindications || medicine.sideEffects) && (
                                            <Box mb={2}>
                                                {medicine.contraindications && (
                                                    <Alert
                                                        severity="warning"
                                                        sx={{
                                                            mb: 1,
                                                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                                            border: '1px solid rgba(245, 158, 11, 0.3)',
                                                            '& .MuiAlert-icon': {
                                                                color: '#F59E0B'
                                                            }
                                                        }}
                                                    >
                                                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                                            {medicine.contraindications.substring(0, 120)}...
                                                        </Typography>
                                                    </Alert>
                                                )}
                                                {medicine.sideEffects && (
                                                    <Alert
                                                        severity="error"
                                                        sx={{
                                                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                                            border: '1px solid rgba(239, 68, 68, 0.3)',
                                                            '& .MuiAlert-icon': {
                                                                color: '#EF4444'
                                                            }
                                                        }}
                                                    >
                                                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                                            Efeitos colaterais: {medicine.sideEffects.substring(0, 120)}...
                                                        </Typography>
                                                    </Alert>
                                                )}
                                            </Box>
                                        )}

                                        <Divider sx={{ my: 2, borderColor: 'rgba(59, 130, 246, 0.1)' }} />

                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                                                Criado em {new Date(medicine.createdAt).toLocaleDateString('pt-BR')}
                                            </Typography>
                                            <Box display="flex" gap={1}>
                                                <Tooltip title="Ver detalhes">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => openDetails(medicine.id)}
                                                        sx={{
                                                            color: '#3B82F6',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(59, 130, 246, 0.1)'
                                                            }
                                                        }}
                                                    >
                                                        <Visibility />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Editar">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => openEdit(medicine)}
                                                        sx={{
                                                            color: '#10B981',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(16, 185, 129, 0.1)'
                                                            }
                                                        }}
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Fade>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Estado vazio */}
            {filteredAndSortedMedicines.length === 0 && (
                <EmptyState
                    icon={<Medication />}
                    title="Nenhum medicamento encontrado"
                    description={
                        searchTerm || filterBy !== 'all'
                            ? 'Tente ajustar os filtros de busca.'
                            : 'Comece adicionando um novo medicamento ao catálogo.'
                    }
                    actionText="Adicionar Primeiro Medicamento"
                    onAction={openCreate}
                    showAction={!searchTerm && filterBy === 'all'}
                />
            )}

            {/* Modais */}
            {showDetails && selectedId && (
                <MedicineDetails
                    medicineId={selectedId}
                    onClose={closeDetails}
                    onUpdate={handleDetailsUpdate}
                />
            )}

            <MedicineForm
                open={showForm}
                onClose={closeModal}
                onSuccess={handleFormSuccess}
                medicine={editingItem}
            />
        </Box>
    );
} 