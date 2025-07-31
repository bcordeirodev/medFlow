import { apiClient } from '@/lib/api';
import { loginSchema, registerSchema, LoginFormData, RegisterFormData } from '@/lib/schemas';
import { User } from '@/lib/types';

export interface AuthResponse {
    user: User;
    access_token: string;
}

export interface LoginResponse {
    user: User;
    access_token: string;
}

/**
 * Service para gerenciar autenticação
 */
export class AuthService {
    /**
     * Realiza login do usuário
     * @param credentials - Credenciais de login
     * @returns Promise com dados do usuário e token
     */
    static async login(credentials: LoginFormData): Promise<LoginResponse> {
        // Validação com Zod
        const validatedData = loginSchema.parse(credentials);

        const response = await apiClient.post<LoginResponse>('/auth/login', validatedData);
        return response.data;
    }

    /**
     * Registra novo usuário
     * @param userData - Dados do usuário
     * @returns Promise com dados do usuário criado
     */
    static async register(userData: RegisterFormData): Promise<AuthResponse> {
        // Validação com Zod
        const validatedData = registerSchema.parse(userData);

        const response = await apiClient.post<AuthResponse>('/auth/register', validatedData);
        return response.data;
    }

    /**
     * Obtém dados do usuário atual
     * @returns Promise com dados do usuário
     */
    static async getCurrentUser(): Promise<User> {
        const response = await apiClient.get<User>('/auth/me');
        return response.data;
    }

    /**
     * Realiza logout do usuário
     * @returns Promise vazia
     */
    static async logout(): Promise<void> {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            // Ignora erros no logout
            console.warn('Logout error:', error);
        } finally {
            // Remove dados locais mesmo se a requisição falhar
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }

    /**
     * Verifica se o token é válido
     * @returns Promise com boolean indicando se o token é válido
     */
    static async validateToken(): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            if (!token) return false;

            await this.getCurrentUser();
            return true;
        } catch (error) {
            return false;
        }
    }
} 