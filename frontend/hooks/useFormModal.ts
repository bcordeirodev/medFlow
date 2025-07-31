import { useState, useCallback } from 'react';

/**
 * Hook customizado para gerenciar modais de formulário
 * 
 * @param initialData - Dados iniciais para edição
 */
export function useFormModal<T>(initialData: T | null = null) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<T | null>(initialData);

    /**
     * Abrir modal para criar novo item
     */
    const openCreate = useCallback(() => {
        setEditingItem(null);
        setIsOpen(true);
    }, []);

    /**
     * Abrir modal para editar item existente
     */
    const openEdit = useCallback((item: T) => {
        setEditingItem(item);
        setIsOpen(true);
    }, []);

    /**
     * Fechar modal
     */
    const closeModal = useCallback(() => {
        setIsOpen(false);
        setEditingItem(null);
    }, []);

    /**
     * Fechar modal após sucesso
     */
    const closeOnSuccess = useCallback(() => {
        setIsOpen(false);
        setEditingItem(null);
    }, []);

    return {
        isOpen,
        editingItem,
        openCreate,
        openEdit,
        closeModal,
        closeOnSuccess
    };
} 