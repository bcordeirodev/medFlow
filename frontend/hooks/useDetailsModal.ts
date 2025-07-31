import { useState, useCallback } from 'react';

/**
 * Hook customizado para gerenciar modais de detalhes
 */
export function useDetailsModal() {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    /**
     * Abrir modal de detalhes
     */
    const openDetails = useCallback((id: number) => {
        setSelectedId(id);
    }, []);

    /**
     * Fechar modal de detalhes
     */
    const closeDetails = useCallback(() => {
        setSelectedId(null);
    }, []);

    /**
     * Verificar se o modal está aberto
     */
    const isOpen = selectedId !== null;

    return {
        selectedId,
        isOpen,
        openDetails,
        closeDetails
    };
} 