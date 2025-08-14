import { AxiosError } from 'axios';
import { ApiError } from '@/types/api.types';

/**
 * Utility class for handling errors throughout the application
 * Follows Single Responsibility Principle
 */
export class ErrorHandler {
  /**
   * Extracts error message from various error types
   */
  static extractErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error instanceof Error) {
      return error.message;
    }

    if (this.isAxiosError(error)) {
      return this.handleAxiosError(error);
    }

    if (this.isApiError(error)) {
      return error.message;
    }

    return 'Ocorreu um erro inesperado';
  }

  /**
   * Handles Axios-specific errors
   */
  private static handleAxiosError(error: AxiosError): string {
    if (error.response) {
      // Server responded with error status
      const data = error.response.data as any;

      if (data?.message) {
        return data.message;
      }

      if (data?.error) {
        return data.error;
      }

      switch (error.response.status) {
        case 400:
          return 'Dados inválidos fornecidos';
        case 401:
          return 'Credenciais inválidas ou sessão expirada';
        case 403:
          return 'Acesso negado';
        case 404:
          return 'Recurso não encontrado';
        case 409:
          return 'Conflito de dados';
        case 422:
          return 'Dados de validação inválidos';
        case 429:
          return 'Muitas tentativas. Tente novamente mais tarde';
        case 500:
          return 'Erro interno do servidor';
        case 502:
          return 'Serviço temporariamente indisponível';
        case 503:
          return 'Serviço em manutenção';
        default:
          return `Erro do servidor (${error.response.status})`;
      }
    }

    if (error.request) {
      // Network error
      return 'Erro de conexão. Verifique sua internet';
    }

    return error.message || 'Erro de requisição';
  }

  /**
   * Type guard for Axios errors
   */
  private static isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError)?.isAxiosError === true;
  }

  /**
   * Type guard for API errors
   */
  private static isApiError(error: unknown): error is ApiError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as ApiError).message === 'string'
    );
  }

  /**
   * Formats validation errors from server
   */
  static formatValidationErrors(errors: Record<string, string[]>): string {
    const messages = Object.entries(errors).map(([field, fieldErrors]) => {
      const fieldName = this.formatFieldName(field);
      return `${fieldName}: ${fieldErrors.join(', ')}`;
    });

    return messages.join('\n');
  }

  /**
   * Converts field names to user-friendly format
   */
  private static formatFieldName(field: string): string {
    const fieldMap: Record<string, string> = {
      email: 'Email',
      password: 'Senha',
      name: 'Nome',
      cpf: 'CPF',
      phone: 'Telefone',
      birthDate: 'Data de nascimento',
      address: 'Endereço',
      crm: 'CRM',
      // Add more field mappings as needed
    };

    return fieldMap[field] || field;
  }

  /**
   * Creates a standardized error object
   */
  static createError(message: string, code?: string, details?: any): ApiError {
    return {
      message,
      code,
      details,
    };
  }

  /**
   * Logs error to console in development mode
   */
  static logError(error: unknown, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error${context ? ` in ${context}` : ''}`);
      console.error(error);

      if (this.isAxiosError(error)) {
        console.log('Request config:', error.config);
        console.log('Response data:', error.response?.data);
      }

      console.groupEnd();
    }
  }

  /**
   * Determines if error should be retried
   */
  static shouldRetry(error: unknown): boolean {
    if (this.isAxiosError(error)) {
      const status = error.response?.status;

      // Retry on network errors or 5xx server errors
      return !error.response || (status !== undefined && status >= 500);
    }

    return false;
  }

  /**
   * Gets retry delay based on attempt number
   */
  static getRetryDelay(attempt: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, etc.
    return Math.min(1000 * Math.pow(2, attempt), 30000);
  }
}
