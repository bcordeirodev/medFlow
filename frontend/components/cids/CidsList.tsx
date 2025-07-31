'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
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
    Avatar,
    Tooltip,
    Fade
} from '@mui/material';
import {
    Assignment,
    Info,
    Visibility,
    Edit,
    Favorite,
    FavoriteBorder
} from '@mui/icons-material';
import {
    ModuleHeader,
    FilterControls,
    StatsGrid,
    EmptyState
} from '@/components/common';
import CidDetails from './CidDetails';
import CidForm from './CidForm';

/**
 * Interface para CID
 */
interface Cid {
    id: number;
    code: string;
    name: string;
    category: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Tipos para controle de visualização e filtros
 */
type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'code' | 'category' | 'createdAt';
type FilterOption = 'all' | 'withMedicines' | 'withoutMedicines';

/**
 * CidsList - Componente principal para listagem de CIDs
 * 
 * Funcionalidades:
 * - Listagem com filtros avançados
 * - Sistema de favoritos
 * - Estatísticas em tempo real
 * - Modo grid/lista
 * - Busca por código, nome e categoria
 * - Ordenação por diferentes critérios
 * - Filtros por associação com medicamentos
 */
export default function CidsList() {
    // Estados principais
    const [cids, setCids] = useState<Cid[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCid, setSelectedCid] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingCid, setEditingCid] = useState<Cid | null>(null);

    // Estados de controle
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [sortBy, setSortBy] = useState<SortOption>('name');
    const [filterBy, setFilterBy] = useState<FilterOption>('all');
    const [favorites, setFavorites] = useState<Set<number>>(new Set());
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    // Buscar CIDs na inicialização
    useEffect(() => {
        fetchCids();
    }, []);

    /**
     * Busca CIDs da API
     */
    const fetchCids = async () => {
        try {
            const response = await axios.get('/api/cids');
            setCids(response.data);
        } catch (error) {
            console.error('Erro ao buscar CIDs:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Filtra e ordena CIDs baseado nos critérios selecionados
     */
    const filteredAndSortedCids = cids
        .filter(cid => {
            const matchesSearch = cid.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cid.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cid.category.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter = filterBy === 'all' ||
                (filterBy === 'withMedicines' && cid.description && cid.description.includes('medicamento')) ||
                (filterBy === 'withoutMedicines' && (!cid.description || !cid.description.includes('medicamento')));

            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'code':
                    return a.code.localeCompare(b.code);
                case 'category':
                    return a.category.localeCompare(b.category);
                case 'createdAt':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                default:
                    return 0;
            }
        });

    /**
     * Calcula estatísticas dos CIDs
     */
    const stats = {
        total: cids.length,
        withMedicines: cids.filter(c => c.description && c.description.includes('medicamento')).length,
        withoutMedicines: cids.filter(c => !c.description || !c.description.includes('medicamento')).length,
        favorites: favorites.size
    };

    /**
     * Handlers para ações dos CIDs
     */
    const handleViewCid = (cidId: number) => {
        setSelectedCid(cidId);
    };

    const handleCloseDetails = () => {
        setSelectedCid(null);
    };

    const handleCidUpdate = () => {
        fetchCids();
    };

    const handleNewCid = () => {
        setEditingCid(null);
        setShowForm(true);
    };

    const handleEditCid = (cid: Cid) => {
        setEditingCid(cid);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        fetchCids();
        setShowForm(false);
        setEditingCid(null);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingCid(null);
    };

    /**
     * Handlers para sistema de favoritos
     */
    const handleToggleFavorite = (cidId: number) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(cidId)) {
                newFavorites.delete(cidId);
            } else {
                newFavorites.add(cidId);
            }
            return newFavorites;
        });
    };

    /**
     * Handlers para menu de filtros adicionais
     */
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Estados de loading
    if (loading) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px">
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#94A3B8' }}>
                    Carregando CIDs...
                </Typography>
            </Box>
        );
    }

    // Configurações para os componentes
    const statsData = [
        {
            value: stats.total,
            label: 'Total',
            color: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 0.2)'
        },
        {
            value: stats.withMedicines,
            label: 'Com Medicamentos',
            color: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'rgba(16, 185, 129, 0.2)'
        },
        {
            value: stats.withoutMedicines,
            label: 'Sem Medicamentos',
            color: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.2)'
        },
        {
            value: stats.favorites,
            label: 'Favoritos',
            color: '#F59E0B',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderColor: 'rgba(245, 158, 11, 0.2)'
        }
    ];

    const filterOptions = [
        { value: 'all', label: 'Todos' },
        { value: 'withMedicines', label: 'Com Medicamentos' },
        { value: 'withoutMedicines', label: 'Sem Medicamentos' }
    ];

    const sortOptions = [
        { value: 'name', label: 'Nome' },
        { value: 'code', label: 'Código' },
        { value: 'category', label: 'Categoria' },
        { value: 'createdAt', label: 'Data de Criação' }
    ];

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
                    title="CIDs"
                    subtitle="Gerencie os códigos de classificação internacional"
                    icon={<Assignment sx={{ fontSize: 28 }} />}
                    onRefresh={fetchCids}
                    onAdd={handleNewCid}
                    addButtonText="Novo CID"
                />

                {/* Grid de estatísticas */}
                <StatsGrid stats={statsData} />
            </Paper>

            {/* Controles de filtro */}
            <FilterControls
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Buscar CIDs..."
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

            {/* Lista de CIDs */}
            {filteredAndSortedCids.length > 0 && (
                <Grid container spacing={3}>
                    {filteredAndSortedCids.map((cid, index) => (
                        <Grid item xs={12} md={viewMode === 'grid' ? 6 : 12} lg={viewMode === 'grid' ? 4 : 12} key={cid.id}>
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
                                    {favorites.has(cid.id) && (
                                        <Chip
                                            icon={<Favorite />}
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
                                                        bgcolor: cid.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                        color: cid.isActive ? '#10B981' : '#EF4444',
                                                        mr: 2,
                                                        width: 48,
                                                        height: 48
                                                    }}
                                                >
                                                    <Assignment />
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
                                                        {cid.name}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ color: '#94A3B8', fontFamily: 'monospace' }}
                                                    >
                                                        {cid.code}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box display="flex" gap={1}>
                                                <Tooltip title={favorites.has(cid.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleToggleFavorite(cid.id)}
                                                        sx={{
                                                            color: favorites.has(cid.id) ? '#F59E0B' : '#64748B',
                                                            '&:hover': {
                                                                color: favorites.has(cid.id) ? '#D97706' : '#3B82F6'
                                                            }
                                                        }}
                                                    >
                                                        {favorites.has(cid.id) ? <Favorite /> : <FavoriteBorder />}
                                                    </IconButton>
                                                </Tooltip>
                                                <Chip
                                                    label={cid.isActive ? 'Ativo' : 'Inativo'}
                                                    color={cid.isActive ? 'success' : 'error'}
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
                                                <strong>Categoria:</strong> {cid.category}
                                            </Typography>
                                            {cid.description && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: '#94A3B8',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        fontSize: '0.9rem',
                                                        lineHeight: 1.6
                                                    }}
                                                >
                                                    {cid.description}
                                                </Typography>
                                            )}
                                        </Box>

                                        <Divider sx={{ my: 2, borderColor: 'rgba(59, 130, 246, 0.1)' }} />

                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                                                Criado em {new Date(cid.createdAt).toLocaleDateString('pt-BR')}
                                            </Typography>
                                            <Box display="flex" gap={1}>
                                                <Tooltip title="Ver detalhes">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleViewCid(cid.id)}
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
                                                        onClick={() => handleEditCid(cid)}
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
            {filteredAndSortedCids.length === 0 && (
                <EmptyState
                    icon={<Assignment />}
                    title="Nenhum CID encontrado"
                    description={
                        searchTerm || filterBy !== 'all'
                            ? 'Tente ajustar os filtros de busca.'
                            : 'Comece adicionando um novo CID ao sistema.'
                    }
                    actionText="Adicionar Primeiro CID"
                    onAction={handleNewCid}
                    showAction={!searchTerm && filterBy === 'all'}
                />
            )}

            {/* Modais */}
            {selectedCid && (
                <CidDetails
                    open={true}
                    onClose={handleCloseDetails}
                    cid={cids.find(c => c.id === selectedCid)!}
                />
            )}

            <CidForm
                open={showForm}
                onClose={handleFormClose}
                cid={editingCid || undefined}
            />
        </Box>
    );
} 