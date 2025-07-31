import { apiClient } from '@/lib/api';
import { prescriptionSchema, prescriptionUpdateSchema, PrescriptionFormData, PrescriptionUpdateData } from '@/lib/schemas';
import { Prescription, PrescriptionFilters } from '@/lib/types';

/**
 * Service para gerenciar prescrições
 */
export class PrescriptionsService {
    /**
     * Obtém lista de prescrições
     * @param filters - Filtros de busca
     * @returns Promise com lista de prescrições
     */
    static async getPrescriptions(filters?: PrescriptionFilters): Promise<Prescription[]> {
        const params = new URLSearchParams();

        if (filters?.search) params.append('search', filters.search);
        if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
        if (filters?.patientId) params.append('patientId', filters.patientId.toString());
        if (filters?.doctorId) params.append('doctorId', filters.doctorId.toString());
        if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters?.dateTo) params.append('dateTo', filters.dateTo);
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);
        if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

        const response = await apiClient.get<Prescription[]>(`/prescriptions?${params.toString()}`);
        return response.data;
    }

    /**
     * Obtém prescrição por ID
     * @param id - ID da prescrição
     * @returns Promise com dados da prescrição
     */
    static async getPrescription(id: number): Promise<Prescription> {
        const response = await apiClient.get<Prescription>(`/prescriptions/${id}`);
        return response.data;
    }

    /**
     * Cria nova prescrição
     * @param prescriptionData - Dados da prescrição
     * @returns Promise com prescrição criada
     */
    static async createPrescription(prescriptionData: PrescriptionFormData): Promise<Prescription> {
        // Validação com Zod
        const validatedData = prescriptionSchema.parse(prescriptionData);

        const response = await apiClient.post<Prescription>('/prescriptions', validatedData);
        return response.data;
    }

    /**
     * Atualiza prescrição existente
     * @param id - ID da prescrição
     * @param prescriptionData - Dados para atualização
     * @returns Promise com prescrição atualizada
     */
    static async updatePrescription(id: number, prescriptionData: PrescriptionUpdateData): Promise<Prescription> {
        // Validação com Zod
        const validatedData = prescriptionUpdateSchema.parse(prescriptionData);

        const response = await apiClient.put<Prescription>(`/prescriptions/${id}`, validatedData);
        return response.data;
    }

    /**
     * Remove prescrição
     * @param id - ID da prescrição
     * @returns Promise vazia
     */
    static async deletePrescription(id: number): Promise<void> {
        await apiClient.delete(`/prescriptions/${id}`);
    }

    /**
     * Ativa/desativa prescrição
     * @param id - ID da prescrição
     * @param isActive - Status de ativação
     * @returns Promise com prescrição atualizada
     */
    static async togglePrescriptionStatus(id: number, isActive: boolean): Promise<Prescription> {
        const response = await apiClient.patch<Prescription>(`/prescriptions/${id}/status`, { isActive });
        return response.data;
    }

    /**
     * Obtém prescrições por paciente
     * @param patientId - ID do paciente
     * @returns Promise com lista de prescrições
     */
    static async getPrescriptionsByPatient(patientId: number): Promise<Prescription[]> {
        const response = await apiClient.get<Prescription[]>(`/prescriptions/patient/${patientId}`);
        return response.data;
    }

    /**
     * Busca prescrições por termo
     * @param searchTerm - Termo de busca
     * @returns Promise com lista de prescrições
     */
    static async searchPrescriptions(searchTerm: string): Promise<Prescription[]> {
        const response = await apiClient.get<Prescription[]>(`/prescriptions/search?q=${encodeURIComponent(searchTerm)}`);
        return response.data;
    }

    /**
     * Obtém estatísticas de prescrições
     * @returns Promise com estatísticas
     */
    static async getPrescriptionStats(): Promise<{
        total: number;
        active: number;
        expired: number;
        thisMonth: number;
    }> {
        const response = await apiClient.get<{
            total: number;
            active: number;
            expired: number;
            thisMonth: number;
        }>('/prescriptions/stats');
        return response.data;
    }

    static async suggestObservations(diagnosis: string, medicines: string[]): Promise<{ suggestions: string[] }> {
        const response = await apiClient.post<{ suggestions: string[] }>('/prescriptions/suggest-observations', {
            diagnosis,
            medicines
        });
        return response.data;
    }
} 