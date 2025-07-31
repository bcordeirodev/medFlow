import { apiClient } from '@/lib/api';
import { Cid } from '@/lib/types';

export const CidsService = {
    // Buscar todos os CIDs
    async getAllCids(): Promise<Cid[]> {
        const response = await apiClient.get('/cids');
        return response.data;
    },

    // Buscar CID por ID
    async getCidById(id: number): Promise<Cid> {
        const response = await apiClient.get(`/cids/${id}`);
        return response.data;
    },

    // Buscar CIDs por código
    async getCidsByCode(code: string): Promise<Cid[]> {
        const response = await apiClient.get(`/cids?code=${code}`);
        return response.data;
    },

    // Criar novo CID
    async createCid(cidData: {
        code: string;
        name: string;
        description?: string;
        category?: string;
        medicineIds?: number[];
    }): Promise<Cid> {
        const response = await apiClient.post('/cids', cidData);
        return response.data;
    },

    // Atualizar CID
    async updateCid(id: number, cidData: Partial<Cid>): Promise<Cid> {
        const response = await apiClient.patch(`/cids/${id}`, cidData);
        return response.data;
    },

    // Deletar CID
    async deleteCid(id: number): Promise<void> {
        await apiClient.delete(`/cids/${id}`);
    },

    // Adicionar medicamento ao CID
    async addMedicineToCid(cidId: number, medicineId: number): Promise<Cid> {
        const response = await apiClient.post(`/cids/${cidId}/medicines/${medicineId}`);
        return response.data;
    },

    // Remover medicamento do CID
    async removeMedicineFromCid(cidId: number, medicineId: number): Promise<Cid> {
        const response = await apiClient.delete(`/cids/${cidId}/medicines/${medicineId}`);
        return response.data;
    },
}; 