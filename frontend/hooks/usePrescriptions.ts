import useSWR, { mutate } from 'swr';
import { PrescriptionsService } from '@/services/prescriptions.service';
import { Prescription, PrescriptionFilters } from '@/lib/types';

/**
 * Hook personalizado para gerenciar prescrições
 */
export const usePrescriptions = (filters?: PrescriptionFilters) => {
    const { data: prescriptions, error, isLoading, mutate: mutatePrescriptions } = useSWR<Prescription[]>(
        ['prescriptions', filters],
        () => PrescriptionsService.getPrescriptions(filters),
        {
            revalidateOnFocus: false,
            dedupingInterval: 30000, // 30 segundos
        }
    );

    const createPrescription = async (prescriptionData: any) => {
        try {
            const newPrescription = await PrescriptionsService.createPrescription(prescriptionData);
            await mutatePrescriptions();
            return newPrescription;
        } catch (error) {
            throw error;
        }
    };

    const updatePrescription = async (id: number, prescriptionData: any) => {
        try {
            const updatedPrescription = await PrescriptionsService.updatePrescription(id, prescriptionData);
            await mutatePrescriptions();
            return updatedPrescription;
        } catch (error) {
            throw error;
        }
    };

    const deletePrescription = async (id: number) => {
        try {
            await PrescriptionsService.deletePrescription(id);
            await mutatePrescriptions();
        } catch (error) {
            throw error;
        }
    };

    const togglePrescriptionStatus = async (id: number, isActive: boolean) => {
        try {
            const updatedPrescription = await PrescriptionsService.togglePrescriptionStatus(id, isActive);
            await mutatePrescriptions();
            return updatedPrescription;
        } catch (error) {
            throw error;
        }
    };

    const searchPrescriptions = async (searchTerm: string) => {
        try {
            return await PrescriptionsService.searchPrescriptions(searchTerm);
        } catch (error) {
            throw error;
        }
    };

    const getPrescriptionStats = async () => {
        try {
            return await PrescriptionsService.getPrescriptionStats();
        } catch (error) {
            throw error;
        }
    };

    return {
        prescriptions: prescriptions || [],
        isLoading,
        error,
        createPrescription,
        updatePrescription,
        deletePrescription,
        togglePrescriptionStatus,
        searchPrescriptions,
        getPrescriptionStats,
        mutate: mutatePrescriptions,
    };
};

/**
 * Hook personalizado para obter uma prescrição específica
 */
export const usePrescription = (id: number | null) => {
    const { data: prescription, error, isLoading, mutate } = useSWR<Prescription>(
        id ? `prescriptions/${id}` : null,
        () => PrescriptionsService.getPrescription(id!),
        {
            revalidateOnFocus: false,
        }
    );

    return {
        prescription,
        isLoading,
        error,
        mutate,
    };
}; 