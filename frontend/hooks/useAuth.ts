import { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import { AuthService } from '@/services/auth.service';
import { User } from '@/lib/types';

interface UseAuthReturn {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (userData: any) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

/**
 * Hook personalizado para gerenciar autenticação
 */
export const useAuth = (): UseAuthReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // SWR para buscar dados do usuário atual
    const { data: user, mutate: mutateUser, error: swrError } = useSWR<User | null>(
        'auth/me',
        async () => {
            const token = localStorage.getItem('token');
            if (!token) return null;
            return AuthService.getCurrentUser();
        },
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        }
    );

    // Verificar token na inicialização
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const isValid = await AuthService.validateToken();
                    if (!isValid) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }
                } catch (error) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
        };

        checkAuth();
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await AuthService.login({ email, password });

            localStorage.setItem('token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));

            await mutateUser(response.user);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao fazer login');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [mutateUser]);

    const logout = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            await AuthService.logout();
            await mutateUser(null, false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao fazer logout');
        } finally {
            setIsLoading(false);
        }
    }, [mutateUser]);

    const register = useCallback(async (userData: any) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await AuthService.register(userData);

            localStorage.setItem('token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));

            await mutateUser(response.user);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao registrar usuário');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [mutateUser]);

    return {
        user: user || null,
        login,
        logout,
        register,
        isLoading,
        error: error || swrError?.message || null,
        isAuthenticated: !!user,
    };
}; 