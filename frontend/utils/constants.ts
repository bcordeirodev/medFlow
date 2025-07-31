/**
 * Constantes reutilizáveis para os módulos
 */

/**
 * Cores padrão para estatísticas
 */
export const STATS_COLORS = {
    primary: {
        color: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 0.2)'
    },
    success: {
        color: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: 'rgba(16, 185, 129, 0.2)'
    },
    error: {
        color: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.2)'
    },
    warning: {
        color: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderColor: 'rgba(245, 158, 11, 0.2)'
    }
} as const;

/**
 * Opções de filtro padrão
 */
export const DEFAULT_FILTER_OPTIONS = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Ativos' },
    { value: 'inactive', label: 'Inativos' }
] as const;

/**
 * Opções de ordenação padrão
 */
export const DEFAULT_SORT_OPTIONS = [
    { value: 'name', label: 'Nome' },
    { value: 'createdAt', label: 'Data de Criação' },
    { value: 'isActive', label: 'Status' }
] as const;

/**
 * Configurações de animação
 */
export const ANIMATION_CONFIG = {
    fadeIn: {
        timeout: 300,
        delay: 100
    },
    zoomIn: {
        timeout: 500
    }
} as const;

/**
 * Configurações de grid responsivo
 */
export const GRID_CONFIG = {
    xs: 12,
    md: 6,
    lg: 4
} as const; 