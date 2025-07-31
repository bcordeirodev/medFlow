import { apiClient } from '@/lib/api';
import { patientSchema, patientUpdateSchema, PatientFormData, PatientUpdateData } from '@/lib/schemas';
import { Patient, PatientFilters } from '@/lib/types';

/**
 * Service para gerenciar pacientes
 */
export class PatientsService {
    /**
     * Obtém lista de pacientes
     * @param filters - Filtros de busca
     * @returns Promise com lista de pacientes
     */
    static async getPatients(filters?: PatientFilters): Promise<Patient[]> {
        const params = new URLSearchParams();

        if (filters?.search) params.append('search', filters.search);
        if (filters?.gender) params.append('gender', filters.gender);
        if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);
        if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

        const response = await apiClient.get<Patient[]>(`/patients?${params.toString()}`);
        return response.data;
    }

    /**
     * Obtém paciente por ID
     * @param id - ID do paciente
     * @returns Promise com dados do paciente
     */
    static async getPatient(id: number): Promise<Patient> {
        const response = await apiClient.get<Patient>(`/patients/${id}`);
        return response.data;
    }

    /**
     * Cria novo paciente
     * @param patientData - Dados do paciente
     * @returns Promise com paciente criado
     */
    static async createPatient(patientData: PatientFormData): Promise<Patient> {
        // Validação com Zod
        const validatedData = patientSchema.parse(patientData);

        const response = await apiClient.post<Patient>('/patients', validatedData);
        return response.data;
    }

    /**
     * Atualiza paciente existente
     * @param id - ID do paciente
     * @param patientData - Dados para atualização
     * @returns Promise com paciente atualizado
     */
    static async updatePatient(id: number, patientData: PatientUpdateData): Promise<Patient> {
        // Validação com Zod
        const validatedData = patientUpdateSchema.parse(patientData);

        const response = await apiClient.put<Patient>(`/patients/${id}`, validatedData);
        return response.data;
    }

    /**
     * Remove paciente
     * @param id - ID do paciente
     * @returns Promise vazia
     */
    static async deletePatient(id: number): Promise<void> {
        await apiClient.delete(`/patients/${id}`);
    }

    /**
     * Ativa/desativa paciente
     * @param id - ID do paciente
     * @param isActive - Status de ativação
     * @returns Promise com paciente atualizado
     */
    static async togglePatientStatus(id: number, isActive: boolean): Promise<Patient> {
        const response = await apiClient.patch<Patient>(`/patients/${id}/status`, { isActive });
        return response.data;
    }

    /**
     * Busca pacientes por termo
     * @param searchTerm - Termo de busca
     * @returns Promise com lista de pacientes
     */
    static async searchPatients(searchTerm: string): Promise<Patient[]> {
        const response = await apiClient.get<Patient[]>(`/patients/search?q=${encodeURIComponent(searchTerm)}`);
        return response.data;
    }
} 