// Export all types from different modules
export * from './api.types';
export * from './entities.types';
export * from './forms.types';
export * from './ui.types';

// Re-export commonly used types for backwards compatibility
export type {
  User,
  Patient,
  Prescription,
  Medicine,
  Cid,
  BaseEntity,
} from './entities.types';

export type {
  LoginFormData,
  RegisterFormData,
  PatientFormData,
  PrescriptionFormData,
  MedicineFormData,
  FormState,
} from './forms.types';

export type { ApiResponse, PaginatedResponse, ApiError } from './api.types';

export type {
  LoadingState,
  AsyncState,
  Notification,
  TableColumn,
  TableAction,
  SearchFilters,
} from './ui.types';
