import { ReactNode } from 'react';
import { AlertColor } from '@mui/material';

// Component Props Types
export interface ChildrenProps {
  children: ReactNode;
}

export interface ClassNameProps {
  className?: string;
}

export interface StyleProps {
  sx?: any;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface AsyncState<T> extends LoadingState {
  data?: T;
  isSuccess: boolean;
  isError: boolean;
}

// Notification Types
export interface NotificationOptions {
  type?: AlertColor;
  duration?: number;
  persist?: boolean;
  action?: ReactNode;
}

export interface Notification {
  id: string;
  message: string;
  type: AlertColor;
  duration?: number;
  persist?: boolean;
  action?: ReactNode;
}

// Modal Types
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
  disableBackdropClick?: boolean;
}

// Table Types
export interface TableColumn<T> {
  id: keyof T;
  label: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  renderCell?: (value: any, row: T) => ReactNode;
  renderHeader?: () => ReactNode;
}

export interface TableAction<T> {
  label: string;
  icon: ReactNode;
  onClick: (row: T) => void;
  show?: (row: T) => boolean;
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'info'
    | 'success';
  disabled?: (row: T) => boolean;
}

export interface TableSort {
  column: string;
  direction: 'asc' | 'desc';
}

export interface TablePagination {
  page: number;
  rowsPerPage: number;
  totalCount: number;
}

// Filter Types
export interface FilterOption<T = any> {
  label: string;
  value: T;
  count?: number;
}

export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

export interface SearchFilters {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Theme Types
export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  borderRadius: number;
  spacing: number;
}

// Navigation Types
export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: ReactNode;
  children?: NavItem[];
  roles?: string[];
  disabled?: boolean;
}

// Form UI Types
export interface FormLayout {
  columns: 1 | 2 | 3 | 4;
  spacing: number;
  variant: 'standard' | 'outlined' | 'filled';
}

// Status Types
export type EntityStatus = 'active' | 'inactive' | 'pending' | 'archived';

export interface StatusConfig {
  label: string;
  color: AlertColor;
  icon?: ReactNode;
}
