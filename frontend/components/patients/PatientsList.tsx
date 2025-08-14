'use client';

import {
  EmptyState,
  FilterControls,
  ModuleHeader,
  StatsGrid,
} from '@/components/common';
import { useListState } from '@/hooks';
import { Patient } from '@/types/entities.types';
import { STATS_COLORS } from '@/utils/constants';
import { calculateStats, filterItems, sortItems } from '@/utils/filterUtils';
import {
  Edit,
  Email,
  Favorite,
  FavoriteBorder,
  LocationOn,
  Person,
  Visibility,
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
import { usePatients } from '../../hooks';
import PatientDetails from './PatientDetails';
import PatientForm from './PatientForm';

// Interface Patient agora importada de @/types/entities.types

/**
 * Tipos para controle de visualização e filtros
 */
type SortOption = 'name' | 'email' | 'createdAt' | 'isActive';
type FilterOption = 'all' | 'active' | 'inactive';

/**
 * PatientsList - Componente principal para listagem de pacientes
 *
 * Funcionalidades:
 * - Listagem com filtros avançados
 * - Sistema de favoritos
 * - Estatísticas em tempo real
 * - Modo grid/lista
 * - Busca por nome, email e telefone
 * - Ordenação por diferentes critérios
 * - Cálculo automático de idade
 */
export default function PatientsList() {
  // Hook otimizado para pacientes
  const { patients, isLoading: loading, mutate } = usePatients();

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
    'name' as SortOption,
    'all' as FilterOption
  );

  // Estados específicos do módulo
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  /**
   * Recarrega dados dos pacientes
   */
  const refreshPatients = () => {
    mutate();
  };

  /**
   * Calcula idade baseada na data de nascimento
   */
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Dados filtrados e ordenados
  const filteredAndSortedPatients = useMemo(() => {
    // Configurações de filtro e ordenação
    const searchFields: (keyof Patient)[] = ['name', 'email', 'phone'];

    const filterConditions = {
      all: () => true,
      active: (patient: Patient) => patient.isActive,
      inactive: (patient: Patient) => !patient.isActive,
    };

    const sortConditions = {
      name: (a: Patient, b: Patient) => a.name.localeCompare(b.name),
      email: (a: Patient, b: Patient) => a.email.localeCompare(b.email),
      createdAt: (a: Patient, b: Patient) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      isActive: (a: Patient, b: Patient) =>
        (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0),
    };

    const filtered = filterItems(
      patients,
      searchTerm,
      searchFields,
      filterBy,
      filterConditions
    );
    return sortItems(filtered, sortBy, sortConditions);
  }, [patients, searchTerm, filterBy, sortBy]);

  // Estatísticas
  const stats = useMemo(() => {
    const baseStats = calculateStats(patients, favorites);
    return {
      ...baseStats,
      active: patients.filter(p => p.isActive).length,
      inactive: patients.filter(p => !p.isActive).length,
      withAllergies: patients.filter(
        p => p.allergies && p.allergies.trim() !== ''
      ).length,
    };
  }, [patients, favorites]);

  /**
   * Handlers para ações dos pacientes
   */
  const handleViewPatient = (patientId: number) => {
    setSelectedPatient(patientId);
  };

  const handleCloseDetails = () => {
    setSelectedPatient(null);
  };

  const handlePatientUpdate = () => {
    refreshPatients();
  };

  const handleNewPatient = () => {
    setEditingPatient(null);
    setShowForm(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    refreshPatients();
    setShowForm(false);
    setEditingPatient(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPatient(null);
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
        label: 'Ativos',
        ...STATS_COLORS.success,
      },
      {
        value: stats.inactive,
        label: 'Inativos',
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
          Carregando pacientes...
        </Typography>
      </Box>
    );
  }

  const filterOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Ativos' },
    { value: 'inactive', label: 'Inativos' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Nome' },
    { value: 'email', label: 'Email' },
    { value: 'createdAt', label: 'Data de Criação' },
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
          title="Pacientes"
          subtitle="Gerencie o cadastro de pacientes"
          icon={<Person sx={{ fontSize: 28 }} />}
          onRefresh={refreshPatients}
          onAdd={handleNewPatient}
          addButtonText="Novo Paciente"
        />

        {/* Grid de estatísticas */}
        <StatsGrid stats={statsData} />
      </Paper>

      {/* Controles de filtro */}
      <FilterControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar pacientes..."
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

      {/* Lista de pacientes */}
      {filteredAndSortedPatients.length > 0 && (
        <Grid container spacing={3}>
          {filteredAndSortedPatients.map((patient: Patient, index: number) => (
            <Grid
              item
              xs={12}
              md={viewMode === 'grid' ? 6 : 12}
              lg={viewMode === 'grid' ? 4 : 12}
              key={patient.id}
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
                  {favorites.has(patient.id) && (
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
                            bgcolor: patient.isActive
                              ? 'rgba(16, 185, 129, 0.2)'
                              : 'rgba(239, 68, 68, 0.2)',
                            color: patient.isActive ? '#10B981' : '#EF4444',
                            mr: 2,
                            width: 48,
                            height: 48,
                          }}
                        >
                          <Person />
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
                            {patient.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                            {calculateAge(patient.birthDate)} anos
                          </Typography>
                        </Box>
                      </Box>
                      <Box display="flex" gap={1}>
                        <Tooltip
                          title={
                            favorites.has(patient.id)
                              ? 'Remover dos favoritos'
                              : 'Adicionar aos favoritos'
                          }
                        >
                          <IconButton
                            size="small"
                            onClick={() => toggleFavorite(patient.id)}
                            sx={{
                              color: favorites.has(patient.id)
                                ? '#F59E0B'
                                : '#64748B',
                              '&:hover': {
                                color: favorites.has(patient.id)
                                  ? '#D97706'
                                  : '#3B82F6',
                              },
                            }}
                          >
                            {favorites.has(patient.id) ? (
                              <Favorite />
                            ) : (
                              <FavoriteBorder />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Chip
                          label={patient.isActive ? 'Ativo' : 'Inativo'}
                          color={patient.isActive ? 'success' : 'error'}
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
                        <Email
                          sx={{ mr: 1, fontSize: '1rem', color: '#06B6D4' }}
                        />
                        <strong>Email:</strong> {patient.email}
                      </Typography>
                      {patient.phone && (
                        <Typography
                          variant="body2"
                          display="flex"
                          alignItems="center"
                          mb={1}
                          sx={{ color: '#E2E8F0' }}
                        >
                          <LocationOn
                            sx={{ mr: 1, fontSize: '1rem', color: '#10B981' }}
                          />
                          <strong>Telefone:</strong> {patient.phone}
                        </Typography>
                      )}
                      {patient.address && (
                        <Typography
                          variant="body2"
                          display="flex"
                          alignItems="center"
                          mb={1}
                          sx={{ color: '#E2E8F0' }}
                        >
                          <LocationOn
                            sx={{ mr: 1, fontSize: '1rem', color: '#8B5CF6' }}
                          />
                          <strong>Endereço:</strong> {patient.address}
                        </Typography>
                      )}
                    </Box>

                    {(patient.allergies || patient.observations) && (
                      <Box mb={2}>
                        {patient.allergies && (
                          <Alert
                            severity="warning"
                            sx={{
                              mb: 1,
                              backgroundColor: 'rgba(245, 158, 11, 0.1)',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                              '& .MuiAlert-icon': {
                                color: '#F59E0B',
                              },
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontSize: '0.8rem' }}
                            >
                              <strong>Alergias:</strong> {patient.allergies}
                            </Typography>
                          </Alert>
                        )}
                        {patient.observations && (
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
                              {patient.observations}
                            </Typography>
                          </Alert>
                        )}
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
                        Cadastrado em{' '}
                        {new Date(patient.createdAt).toLocaleDateString(
                          'pt-BR'
                        )}
                      </Typography>
                      <Box display="flex" gap={1}>
                        <Tooltip title="Ver detalhes">
                          <IconButton
                            size="small"
                            onClick={() => handleViewPatient(patient.id)}
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
                            onClick={() => handleEditPatient(patient)}
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
      {filteredAndSortedPatients.length === 0 && (
        <EmptyState
          icon={<Person />}
          title="Nenhum paciente encontrado"
          description={
            searchTerm || filterBy !== 'all'
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece adicionando um novo paciente ao cadastro.'
          }
          actionText="Adicionar Primeiro Paciente"
          onAction={handleNewPatient}
          showAction={!searchTerm && filterBy === 'all'}
        />
      )}

      {/* Modais */}
      {selectedPatient && (
        <PatientDetails
          patientId={selectedPatient}
          onClose={handleCloseDetails}
          onUpdate={handlePatientUpdate}
        />
      )}

      <PatientForm
        open={showForm}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        patient={editingPatient}
      />
    </Box>
  );
}
