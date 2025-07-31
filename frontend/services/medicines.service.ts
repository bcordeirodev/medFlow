import { apiClient } from '@/lib/api';
import { medicineSchema, medicineUpdateSchema, MedicineFormData, MedicineUpdateData } from '@/lib/schemas';
import { Medicine, MedicineFilters } from '@/lib/types';

/**
 * Service para gerenciar medicamentos
 */
export class MedicinesService {
    /**
     * Obtém lista de medicamentos
     * @param filters - Filtros de busca
     * @returns Promise com lista de medicamentos
     */
    static async getMedicines(filters?: MedicineFilters): Promise<Medicine[]> {
        const params = new URLSearchParams();

        if (filters?.search) params.append('search', filters.search);
        if (filters?.manufacturer) params.append('manufacturer', filters.manufacturer);
        if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);
        if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

        const response = await apiClient.get<Medicine[]>(`/medicines?${params.toString()}`);
        return response.data;
    }

    /**
     * Obtém medicamento por ID
     * @param id - ID do medicamento
     * @returns Promise com dados do medicamento
     */
    static async getMedicine(id: number): Promise<Medicine> {
        const response = await apiClient.get<Medicine>(`/medicines/${id}`);
        return response.data;
    }

    /**
     * Cria novo medicamento
     * @param medicineData - Dados do medicamento
     * @returns Promise com medicamento criado
     */
    static async createMedicine(medicineData: MedicineFormData): Promise<Medicine> {
        // Validação com Zod
        const validatedData = medicineSchema.parse(medicineData);

        const response = await apiClient.post<Medicine>('/medicines', validatedData);
        return response.data;
    }

    /**
     * Atualiza medicamento existente
     * @param id - ID do medicamento
     * @param medicineData - Dados para atualização
     * @returns Promise com medicamento atualizado
     */
    static async updateMedicine(id: number, medicineData: MedicineUpdateData): Promise<Medicine> {
        // Validação com Zod
        const validatedData = medicineUpdateSchema.parse(medicineData);

        const response = await apiClient.put<Medicine>(`/medicines/${id}`, medicineData);
        return response.data;
    }

    /**
     * Remove medicamento
     * @param id - ID do medicamento
     * @returns Promise vazia
     */
    static async deleteMedicine(id: number): Promise<void> {
        await apiClient.delete(`/medicines/${id}`);
    }

    /**
     * Ativa/desativa medicamento
     * @param id - ID do medicamento
     * @param isActive - Status de ativação
     * @returns Promise com medicamento atualizado
     */
    static async toggleMedicineStatus(id: number, isActive: boolean): Promise<Medicine> {
        const response = await apiClient.patch<Medicine>(`/medicines/${id}/status`, { isActive });
        return response.data;
    }

    /**
     * Busca medicamentos por termo
     * @param searchTerm - Termo de busca
     * @returns Promise com lista de medicamentos
     */
    static async searchMedicines(searchTerm: string): Promise<Medicine[]> {
        const response = await apiClient.get<Medicine[]>(`/medicines/search?q=${encodeURIComponent(searchTerm)}`);
        return response.data;
    }

    /**
     * Obtém medicamentos por fabricante
     * @param manufacturer - Nome do fabricante
     * @returns Promise com lista de medicamentos
     */
    static async getMedicinesByManufacturer(manufacturer: string): Promise<Medicine[]> {
        const response = await apiClient.get<Medicine[]>(`/medicines/manufacturer/${encodeURIComponent(manufacturer)}`);
        return response.data;
    }

    /**
     * Obtém estatísticas de medicamentos
     * @returns Promise com estatísticas
     */
    static async getMedicineStats(): Promise<{
        total: number;
        active: number;
        manufacturers: number;
    }> {
        const response = await apiClient.get<{
            total: number;
            active: number;
            manufacturers: number;
        }>('/medicines/stats');
        return response.data;
    }
} 