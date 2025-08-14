/**
 * Application constants organized by domain
 * Follows the Open/Closed Principle - easy to extend without modification
 */

// Date and time formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm',
  TIME: 'HH:mm',
  ISO: 'YYYY-MM-DDTHH:mm:ss.sssZ',
  MONTH_YEAR: 'MM/YYYY',
  YEAR: 'YYYY',
} as const;

// Entity status constants
export const ENTITY_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
  ARCHIVED: 'ARCHIVED',
  DELETED: 'DELETED',
} as const;

// User roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  RECEPTIONIST: 'RECEPTIONIST',
} as const;

// Gender options
export const GENDER_OPTIONS = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Feminino' },
] as const;

// Pagination configuration
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
  MAX_PAGES_DISPLAYED: 5,
} as const;

/**
 * Cores padrão para estatísticas
 */
export const STATS_COLORS = {
  primary: {
    color: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  success: {
    color: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  error: {
    color: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  warning: {
    color: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
} as const;

/**
 * Opções de filtro padrão
 */
export const DEFAULT_FILTER_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativos' },
  { value: 'inactive', label: 'Inativos' },
] as const;

/**
 * Opções de ordenação padrão
 */
export const DEFAULT_SORT_OPTIONS = [
  { value: 'name', label: 'Nome' },
  { value: 'createdAt', label: 'Data de Criação' },
  { value: 'isActive', label: 'Status' },
] as const;

/**
 * Configurações de animação
 */
export const ANIMATION_CONFIG = {
  fadeIn: {
    timeout: 300,
    delay: 100,
  },
  zoomIn: {
    timeout: 500,
  },
} as const;

/**
 * Configurações de grid responsivo
 */
export const GRID_CONFIG = {
  xs: 12,
  md: 6,
  lg: 4,
} as const;
