// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Query and Mutation Types
export interface QueryOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  refetchOnReconnect?: boolean;
  retry?: boolean | number;
  staleTime?: number;
  cacheTime?: number;
}

export interface MutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: ApiError, variables: TVariables) => void;
  onMutate?: (variables: TVariables) => void;
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// API Endpoints
export interface ApiEndpoint {
  method: HttpMethod;
  url: string;
  requiresAuth?: boolean;
}

// Request Config
export interface RequestConfig {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}
