import useSWR from 'swr';
import { CidsService } from '@/services/cids.service';
import { Cid } from '@/lib/types';

export const useCids = () => {
    const { data: cids, error, mutate } = useSWR<Cid[]>('/cids', () => CidsService.getAllCids());

    const createCid = async (cidData: {
        code: string;
        name: string;
        description?: string;
        category?: string;
        medicineIds?: number[];
    }) => {
        try {
            const newCid = await CidsService.createCid(cidData);
            mutate([...(cids || []), newCid]);
            return newCid;
        } catch (error) {
            throw error;
        }
    };

    const updateCid = async (id: number, cidData: Partial<Cid>) => {
        try {
            const updatedCid = await CidsService.updateCid(id, cidData);
            mutate(cids?.map(cid => cid.id === id ? updatedCid : cid));
            return updatedCid;
        } catch (error) {
            throw error;
        }
    };

    const deleteCid = async (id: number) => {
        try {
            await CidsService.deleteCid(id);
            mutate(cids?.filter(cid => cid.id !== id));
        } catch (error) {
            throw error;
        }
    };

    const addMedicineToCid = async (cidId: number, medicineId: number) => {
        try {
            const updatedCid = await CidsService.addMedicineToCid(cidId, medicineId);
            mutate(cids?.map(cid => cid.id === cidId ? updatedCid : cid));
            return updatedCid;
        } catch (error) {
            throw error;
        }
    };

    const removeMedicineFromCid = async (cidId: number, medicineId: number) => {
        try {
            const updatedCid = await CidsService.removeMedicineFromCid(cidId, medicineId);
            mutate(cids?.map(cid => cid.id === cidId ? updatedCid : cid));
            return updatedCid;
        } catch (error) {
            throw error;
        }
    };

    return {
        cids,
        isLoading: !error && !cids,
        error,
        createCid,
        updateCid,
        deleteCid,
        addMedicineToCid,
        removeMedicineFromCid,
        mutate,
    };
}; 