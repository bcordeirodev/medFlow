import useSWR, { mutate } from 'swr';
import { MedicinesService } from '@/services/medicines.service';
import { Medicine, MedicineFilters } from '@/lib/types';

/**
 * Hook personalizado para gerenciar medicamentos
 */
export const useMedicines = (filters?: MedicineFilters) => {
    const { data: medicines, error, isLoading, mutate: mutateMedicines } = useSWR<Medicine[]>(
        ['medicines', filters],
        () => MedicinesService.getMedicines(filters),
        {
            revalidateOnFocus: false,
            dedupingInterval: 30000, // 30 segundos
        }
    );

    const createMedicine = async (medicineData: any) => {
        try {
            const newMedicine = await MedicinesService.createMedicine(medicineData);
            await mutateMedicines();
            return newMedicine;
        } catch (error) {
            throw error;
        }
    };

    const updateMedicine = async (id: number, medicineData: any) => {
        try {
            const updatedMedicine = await MedicinesService.updateMedicine(id, medicineData);
            await mutateMedicines();
            return updatedMedicine;
        } catch (error) {
            throw error;
        }
    };

    const deleteMedicine = async (id: number) => {
        try {
            await MedicinesService.deleteMedicine(id);
            await mutateMedicines();
        } catch (error) {
            throw error;
        }
    };

    const toggleMedicineStatus = async (id: number, isActive: boolean) => {
        try {
            const updatedMedicine = await MedicinesService.toggleMedicineStatus(id, isActive);
            await mutateMedicines();
            return updatedMedicine;
        } catch (error) {
            throw error;
        }
    };

    const searchMedicines = async (searchTerm: string) => {
        try {
            return await MedicinesService.searchMedicines(searchTerm);
        } catch (error) {
            throw error;
        }
    };

    const getMedicinesByManufacturer = async (manufacturer: string) => {
        try {
            return await MedicinesService.getMedicinesByManufacturer(manufacturer);
        } catch (error) {
            throw error;
        }
    };

    const getMedicineStats = async () => {
        try {
            return await MedicinesService.getMedicineStats();
        } catch (error) {
            throw error;
        }
    };

    return {
        medicines: medicines || [],
        isLoading,
        error,
        createMedicine,
        updateMedicine,
        deleteMedicine,
        toggleMedicineStatus,
        searchMedicines,
        getMedicinesByManufacturer,
        getMedicineStats,
        mutate: mutateMedicines,
    };
};

/**
 * Hook personalizado para obter um medicamento específico
 */
export const useMedicine = (id: number | null) => {
    const { data: medicine, error, isLoading, mutate } = useSWR<Medicine>(
        id ? `medicines/${id}` : null,
        () => MedicinesService.getMedicine(id!),
        {
            revalidateOnFocus: false,
        }
    );

    return {
        medicine,
        isLoading,
        error,
        mutate,
    };
}; 