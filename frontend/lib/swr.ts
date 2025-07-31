import { SWRConfiguration } from 'swr';
import { apiClient } from './api';

/**
 * Fetcher personalizado para SWR
 */
export const fetcher = async (url: string) => {
    const response = await apiClient.get(url);
    return response.data;
};

/**
 * Configuração global do SWR
 */
export const swrConfig: SWRConfiguration = {
    fetcher,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 30000, // 30 segundos
    errorRetryCount: 3,
    errorRetryInterval: 5000, // 5 segundos
    onError: (error) => {
        console.error('SWR Error:', error);
    },
}; 