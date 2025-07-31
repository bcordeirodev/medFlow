// Interfaces base para todas as entidades
export interface BaseEntity {
    id: number;
    createdAt: string;
    updatedAt: string;
}

// Interface para usuário/médico
export interface User extends BaseEntity {
    name: string;
    email: string;
    crm: string;
    isActive: boolean;
}

// Interface para paciente
export interface Patient extends BaseEntity {
    name: string;
    email: string;
    phone: string;
    cpf: string;
    birthDate: string;
    gender: 'M' | 'F';
    address: string;
    allergies?: string;
    medicalHistory?: string;
    observations?: string;
    doctorId: number;
    isActive: boolean;
    doctor?: User;
}

// Interface para prescrição
export interface Prescription extends BaseEntity {
    diagnosis: string;
    prescription: string;
    observations?: string;
    prescriptionDate: string;
    validUntil?: string;
    doctorId: number;
    patientId: number;
    isActive: boolean;
    doctor?: User;
    patient?: Patient;
}

// Interface para medicamento
export interface Medicine extends BaseEntity {
    name: string;
    description: string;
    dosage: string;
    manufacturer: string;
    activeIngredient: string;
    contraindications?: string;
    sideEffects?: string;
    isActive: boolean;
}

// Interface para CID (Classificação Internacional de Doenças)
export interface Cid extends BaseEntity {
    code: string;
    name: string;
    description?: string;
    category?: string;
    medicines?: Medicine[];
}

// Interfaces para respostas da API
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Interfaces para formulários
export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterForm {
    name: string;
    email: string;
    password: string;
    crm: string;
}

// Interfaces para filtros e busca
export interface SearchFilters {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PatientFilters extends SearchFilters {
    gender?: 'M' | 'F';
    isActive?: boolean;
}

export interface PrescriptionFilters extends SearchFilters {
    isActive?: boolean;
    patientId?: number;
    doctorId?: number;
    dateFrom?: string;
    dateTo?: string;
}

export interface MedicineFilters extends SearchFilters {
    manufacturer?: string;
    isActive?: boolean;
}

export interface CidFilters extends SearchFilters {
    category?: string;
    isActive?: boolean;
}

// Interfaces para estados de loading e erro
export interface LoadingState {
    isLoading: boolean;
    error?: string;
}

export interface MutationState extends LoadingState {
    isSuccess: boolean;
    isError: boolean;
}

// Interfaces para hooks personalizados
export interface UseQueryResult<T> {
    data: T | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
}

export interface UseMutationResult<T, V> {
    mutate: (variables: V) => void;
    data: T | undefined;
    isLoading: boolean;
    error: Error | null;
    isSuccess: boolean;
    isError: boolean;
    reset: () => void;
} 