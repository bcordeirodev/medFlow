'use client';

import {
  EmptyState,
  FilterControls,
  ModuleHeader,
  StatsGrid,
} from '@/components/common';
import { useListState, usePrescriptions } from '@/hooks';
import { Prescription } from '@/types/entities.types';
import { STATS_COLORS } from '@/utils/constants';
import { calculateStats, filterItems, sortItems } from '@/utils/filterUtils';
import {
  Assignment,
  CheckCircle,
  Edit,
  Favorite,
  FavoriteBorder,
  Info,
  Visibility,
  Warning,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Fade,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import PrescriptionDetails from './PrescriptionDetails';
import PrescriptionForm from './PrescriptionForm';

/**
 * Tipos para controle de visualização e filtros
 */
type SortOption = 'diagnosis' | 'prescriptionDate' | 'isActive';
type FilterOption = 'all' | 'active' | 'inactive' | 'expired' | 'valid';

/**
 * PrescriptionsList - Componente principal para listagem de prescrições
 *
 * Funcionalidades:
 * - Listagem com filtros avançados
 * - Sistema de favoritos
 * - Estatísticas em tempo real
 * - Modo grid/lista
 * - Busca por diagnóstico, paciente e médico
 * - Ordenação por diferentes critérios
 * - Verificação de validade das prescrições
 */
export default function PrescriptionsList() {
  // Hook otimizado para prescrições
  const { prescriptions, isLoading: loading, mutate } = usePrescriptions();

  // Hook de estado da lista
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
    handleMenuClose,
  } = useListState<'grid' | 'list', SortOption, FilterOption>(
    'grid' as const,
    'diagnosis' as SortOption,
    'all' as FilterOption
  );

  // Estados específicos do módulo
  const [selectedPrescription, setSelectedPrescription] = useState<
    number | null
  >(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPrescription, setEditingPrescription] =
    useState<Prescription | null>(null);

  /**
   * Recarrega dados das prescrições
   */
  const refreshPrescriptions = () => {
    mutate();
  };

  /**
   * Formata data para exibição
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  /**
   * Verifica se a prescrição está expirada
   */
  const isExpired = (validUntil: string): boolean => {
    return new Date(validUntil) < new Date();
  };

  // Dados filtrados e ordenados
  const filteredAndSortedPrescriptions = useMemo(() => {
    // Configurações de filtro e ordenação
    const searchFields: (keyof Prescription)[] = ['diagnosis'];

    const filterConditions = {
      all: () => true,
      active: (prescription: Prescription) => prescription.isActive,
      inactive: (prescription: Prescription) => !prescription.isActive,
      expired: (prescription: Prescription) =>
        prescription.validUntil ? isExpired(prescription.validUntil) : false,
      valid: (prescription: Prescription) =>
        prescription.validUntil ? !isExpired(prescription.validUntil) : false,
    };

    const sortConditions = {
      diagnosis: (a: Prescription, b: Prescription) =>
        a.diagnosis.localeCompare(b.diagnosis),
      prescriptionDate: (a: Prescription, b: Prescription) =>
        new Date(b.prescriptionDate).getTime() -
        new Date(a.prescriptionDate).getTime(),
      isActive: (a: Prescription, b: Prescription) =>
        (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0),
    };

    const filtered = filterItems(
      prescriptions,
      searchTerm,
      searchFields,
      filterBy,
      filterConditions
    );
    return sortItems(filtered, sortBy, sortConditions);
  }, [prescriptions, searchTerm, filterBy, sortBy]);

  // Estatísticas
  const stats = useMemo(() => {
    const baseStats = calculateStats(prescriptions, favorites);
    return {
      ...baseStats,
      active: prescriptions.filter(p => p.isActive).length,
      inactive: prescriptions.filter(p => !p.isActive).length,
      expired: prescriptions.filter(
        p => p.validUntil && isExpired(p.validUntil)
      ).length,
      valid: prescriptions.filter(p => p.validUntil && !isExpired(p.validUntil))
        .length,
    };
  }, [prescriptions, favorites]);

  /**
   * Handlers para ações das prescrições
   */
  const handleViewPrescription = (prescriptionId: number) => {
    setSelectedPrescription(prescriptionId);
  };

  const handleCloseDetails = () => {
    setSelectedPrescription(null);
  };

  const handlePrescriptionUpdate = () => {
    refreshPrescriptions();
  };

  const handleNewPrescription = () => {
    setEditingPrescription(null);
    setShowForm(true);
  };

  const handleEditPrescription = (prescription: Prescription) => {
    setEditingPrescription(prescription);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    refreshPrescriptions();
    setShowForm(false);
    setEditingPrescription(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPrescription(null);
  };

  // Configurações para os componentes
  const statsData = useMemo(
    () => [
      {
        value: stats.total,
        label: 'Total',
        ...STATS_COLORS.primary,
      },
      {
        value: stats.active,
        label: 'Ativas',
        ...STATS_COLORS.success,
      },
      {
        value: stats.expired,
        label: 'Expiradas',
        ...STATS_COLORS.error,
      },
      {
        value: stats.favorites,
        label: 'Favoritos',
        ...STATS_COLORS.warning,
      },
    ],
    [stats]
  );

  // Estados de loading
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="400px"
      >
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#94A3B8' }}>
          Carregando prescrições...
        </Typography>
      </Box>
    );
  }

  const filterOptions = [
    { value: 'all', label: 'Todas' },
    { value: 'active', label: 'Ativas' },
    { value: 'inactive', label: 'Inativas' },
    { value: 'expired', label: 'Expiradas' },
    { value: 'valid', label: 'Válidas' },
  ];

  const sortOptions = [
    { value: 'diagnosis', label: 'Diagnóstico' },
    { value: 'prescriptionDate', label: 'Data da Prescrição' },
    { value: 'isActive', label: 'Status' },
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
          border: '1px solid rgba(59, 130, 246, 0.1)',
        }}
      >
        <ModuleHeader
          title="Prescrições"
          subtitle="Gerencie as prescrições médicas"
          icon={<Assignment sx={{ fontSize: 28 }} />}
          onRefresh={refreshPrescriptions}
          onAdd={handleNewPrescription}
          addButtonText="Nova Prescrição"
        />

        {/* Grid de estatísticas */}
        <StatsGrid stats={statsData} />
      </Paper>

      {/* Controles de filtro */}
      <FilterControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar prescrições..."
        filterBy={filterBy}
        onFilterChange={value => setFilterBy(value as FilterOption)}
        filterOptions={filterOptions}
        sortBy={sortBy}
        onSortChange={value => setSortBy(value as SortOption)}
        sortOptions={sortOptions}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onMenuOpen={handleMenuOpen}
        anchorEl={anchorEl}
        onMenuClose={handleMenuClose}
      />

      {/* Lista de prescrições */}
      {filteredAndSortedPrescriptions.length > 0 && (
        <Grid container spacing={3}>
          {filteredAndSortedPrescriptions.map((prescription, index) => (
            <Grid
              item
              xs={12}
              md={viewMode === 'grid' ? 6 : 12}
              lg={viewMode === 'grid' ? 4 : 12}
              key={prescription.id}
            >
              <Fade in timeout={300 + index * 100}>
                <Card
                  sx={{
                    background:
                      'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.8) 100%)',
                    borderRadius: 3,
                    border: '1px solid rgba(59, 130, 246, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.15)',
                      borderColor: 'rgba(59, 130, 246, 0.3)',
                    },
                    position: 'relative',
                    overflow: 'visible',
                  }}
                >
                  {favorites.has(prescription.id) && (
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
                        zIndex: 1,
                      }}
                    />
                  )}

                  <CardContent sx={{ p: 3 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={2}
                    >
                      <Box display="flex" alignItems="center" flex={1}>
                        <Avatar
                          sx={{
                            bgcolor: prescription.isActive
                              ? 'rgba(16, 185, 129, 0.2)'
                              : 'rgba(239, 68, 68, 0.2)',
                            color: prescription.isActive
                              ? '#10B981'
                              : '#EF4444',
                            mr: 2,
                            width: 48,
                            height: 48,
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
                              mb: 0.5,
                            }}
                          >
                            {prescription.diagnosis ||
                              'Diagnóstico não informado'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                            {prescription.patient?.name ||
                              'Paciente não informado'}
                          </Typography>
                        </Box>
                      </Box>
                      <Box display="flex" gap={1}>
                        <Tooltip
                          title={
                            favorites.has(prescription.id)
                              ? 'Remover dos favoritos'
                              : 'Adicionar aos favoritos'
                          }
                        >
                          <IconButton
                            size="small"
                            onClick={() => toggleFavorite(prescription.id)}
                            sx={{
                              color: favorites.has(prescription.id)
                                ? '#F59E0B'
                                : '#64748B',
                              '&:hover': {
                                color: favorites.has(prescription.id)
                                  ? '#D97706'
                                  : '#3B82F6',
                              },
                            }}
                          >
                            {favorites.has(prescription.id) ? (
                              <Favorite />
                            ) : (
                              <FavoriteBorder />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Chip
                          label={prescription.isActive ? 'Ativa' : 'Inativa'}
                          color={prescription.isActive ? 'success' : 'error'}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                    </Box>

                    <Box mb={2}>
                      <Box
                        display="flex"
                        alignItems="center"
                        mb={1}
                        sx={{ color: '#E2E8F0', fontSize: '0.875rem' }}
                      >
                        <Info
                          sx={{ mr: 1, fontSize: '1rem', color: '#06B6D4' }}
                        />
                        <strong>Médico:</strong>{' '}
                        {prescription.doctor?.name || 'Não informado'}
                      </Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        mb={1}
                        sx={{ color: '#E2E8F0', fontSize: '0.875rem' }}
                      >
                        <CheckCircle
                          sx={{ mr: 1, fontSize: '1rem', color: '#10B981' }}
                        />
                        <strong>Data da Prescrição:</strong>{' '}
                        {formatDate(prescription.prescriptionDate)}
                      </Box>
                      {prescription.validUntil && (
                        <Box
                          display="flex"
                          alignItems="center"
                          mb={1}
                          sx={{ color: '#E2E8F0', fontSize: '0.875rem' }}
                        >
                          <Warning
                            sx={{
                              mr: 1,
                              fontSize: '1rem',
                              color: isExpired(prescription.validUntil)
                                ? '#EF4444'
                                : '#10B981',
                            }}
                          />
                          <strong>Válida até:</strong>{' '}
                          {formatDate(prescription.validUntil)}
                          <Chip
                            label={
                              isExpired(prescription.validUntil)
                                ? 'Expirada'
                                : 'Válida'
                            }
                            color={
                              isExpired(prescription.validUntil)
                                ? 'error'
                                : 'success'
                            }
                            size="small"
                            sx={{ ml: 1, fontWeight: 600 }}
                          />
                        </Box>
                      )}
                    </Box>

                    {prescription.observations && (
                      <Box mb={2}>
                        <Alert
                          severity="info"
                          sx={{
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            '& .MuiAlert-icon': {
                              color: '#3B82F6',
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontSize: '0.8rem' }}
                          >
                            <strong>Observações:</strong>{' '}
                            {prescription.observations}
                          </Typography>
                        </Alert>
                      </Box>
                    )}

                    <Divider
                      sx={{ my: 2, borderColor: 'rgba(59, 130, 246, 0.1)' }}
                    />

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        Criada em {formatDate(prescription.createdAt)}
                      </Typography>
                      <Box display="flex" gap={1}>
                        <Tooltip title="Ver detalhes">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleViewPrescription(prescription.id)
                            }
                            sx={{
                              color: '#3B82F6',
                              '&:hover': {
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                              },
                            }}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => handleEditPrescription(prescription)}
                            sx={{
                              color: '#10B981',
                              '&:hover': {
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                              },
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
      {filteredAndSortedPrescriptions.length === 0 && (
        <EmptyState
          icon={<Assignment />}
          title="Nenhuma prescrição encontrada"
          description={
            searchTerm || filterBy !== 'all'
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece adicionando uma nova prescrição ao sistema.'
          }
          actionText="Adicionar Primeira Prescrição"
          onAction={handleNewPrescription}
          showAction={!searchTerm && filterBy === 'all'}
        />
      )}

      {/* Modais */}
      {selectedPrescription && (
        <PrescriptionDetails
          prescriptionId={selectedPrescription}
          onClose={handleCloseDetails}
          onUpdate={handlePrescriptionUpdate}
        />
      )}

      <PrescriptionForm
        open={showForm}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        prescription={editingPrescription}
      />
    </Box>
  );
}
