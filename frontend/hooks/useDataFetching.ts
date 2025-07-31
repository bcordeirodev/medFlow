import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * Hook customizado para gerenciar fetching de dados
 * 
 * @param endpoint - Endpoint da API
 * @param dependencies - Dependências para refetch automático
 */
export function useDataFetching<T>(
    endpoint: string,
    dependencies: any[] = []
) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Buscar dados da API
     */
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(endpoint);
            setData(response.data);
        } catch (err: any) {
            console.error(`Erro ao buscar dados de ${endpoint}:`, err);
            setError(err.response?.data?.message || 'Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    }, [endpoint]);

    /**
     * Refetch manual dos dados
     */
    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    // Fetch inicial e quando as dependências mudarem
    useEffect(() => {
        fetchData();
    }, [fetchData, ...dependencies]);

    return {
        data,
        loading,
        error,
        refetch,
        setData
    };
} 