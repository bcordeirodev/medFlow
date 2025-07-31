import useSWR, { mutate } from 'swr';
import { PatientsService } from '@/services/patients.service';
import { Patient, PatientFilters } from '@/lib/types';

/**
 * Hook personalizado para gerenciar pacientes
 */
export const usePatients = (filters?: PatientFilters) => {
    const { data: patients, error, isLoading, mutate: mutatePatients } = useSWR<Patient[]>(
        ['patients', filters],
        () => PatientsService.getPatients(filters),
        {
            revalidateOnFocus: false,
            dedupingInterval: 30000, // 30 segundos
        }
    );

    const createPatient = async (patientData: any) => {
        try {
            const newPatient = await PatientsService.createPatient(patientData);
            await mutatePatients();
            return newPatient;
        } catch (error) {
            throw error;
        }
    };

    const updatePatient = async (id: number, patientData: any) => {
        try {
            const updatedPatient = await PatientsService.updatePatient(id, patientData);
            await mutatePatients();
            return updatedPatient;
        } catch (error) {
            throw error;
        }
    };

    const deletePatient = async (id: number) => {
        try {
            await PatientsService.deletePatient(id);
            await mutatePatients();
        } catch (error) {
            throw error;
        }
    };

    const togglePatientStatus = async (id: number, isActive: boolean) => {
        try {
            const updatedPatient = await PatientsService.togglePatientStatus(id, isActive);
            await mutatePatients();
            return updatedPatient;
        } catch (error) {
            throw error;
        }
    };

    const searchPatients = async (searchTerm: string) => {
        try {
            return await PatientsService.searchPatients(searchTerm);
        } catch (error) {
            throw error;
        }
    };

    return {
        patients: patients || [],
        isLoading,
        error,
        createPatient,
        updatePatient,
        deletePatient,
        togglePatientStatus,
        searchPatients,
        mutate: mutatePatients,
    };
};

/**
 * Hook personalizado para obter um paciente específico
 */
export const usePatient = (id: number | null) => {
    const { data: patient, error, isLoading, mutate } = useSWR<Patient>(
        id ? `patients/${id}` : null,
        () => PatientsService.getPatient(id!),
        {
            revalidateOnFocus: false,
        }
    );

    return {
        patient,
        isLoading,
        error,
        mutate,
    };
}; 