import useSWR from "swr";
import { AppointmentsService } from "@/services/appointments.service";
import { Appointment, AppointmentStatus } from "@/types/entities.types";
import { AppointmentFormData, AppointmentUpdateData } from "@/lib/schemas";

/**
 * Hook personalizado para gerenciar agendamentos
 */
export const useAppointments = (filters?: {
  patientId?: number;
  startDate?: string;
  endDate?: string;
  status?: AppointmentStatus;
  search?: string;
}) => {
  const {
    data: appointments,
    error,
    isLoading,
    mutate: mutateAppointments,
  } = useSWR<Appointment[]>(
    ["appointments", filters],
    () => AppointmentsService.getAppointments(filters),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30 segundos
    }
  );

  const createAppointment = async (appointmentData: AppointmentFormData) => {
    try {
      const newAppointment =
        await AppointmentsService.createAppointment(appointmentData);
      await mutateAppointments();
      return newAppointment;
    } catch (error) {
      throw error;
    }
  };

  const updateAppointment = async (
    id: number,
    appointmentData: AppointmentUpdateData
  ) => {
    try {
      const updatedAppointment = await AppointmentsService.updateAppointment(
        id,
        appointmentData
      );
      await mutateAppointments();
      return updatedAppointment;
    } catch (error) {
      throw error;
    }
  };

  const updateAppointmentStatus = async (
    id: number,
    status: AppointmentStatus
  ) => {
    try {
      const updatedAppointment =
        await AppointmentsService.updateAppointmentStatus(id, status);
      await mutateAppointments();
      return updatedAppointment;
    } catch (error) {
      throw error;
    }
  };

  const generateMeetLink = async (id: number) => {
    try {
      const result = await AppointmentsService.generateMeetLink(id);
      await mutateAppointments();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteAppointment = async (id: number) => {
    try {
      await AppointmentsService.deleteAppointment(id);
      await mutateAppointments();
    } catch (error) {
      throw error;
    }
  };

  const searchAppointments = async (searchTerm: string) => {
    try {
      return await AppointmentsService.searchAppointments(searchTerm);
    } catch (error) {
      throw error;
    }
  };

  const checkAvailability = async (date: string, duration?: number) => {
    try {
      return await AppointmentsService.checkAvailability(date, duration);
    } catch (error) {
      throw error;
    }
  };

  return {
    appointments: appointments || [],
    isLoading,
    error,
    createAppointment,
    updateAppointment,
    updateAppointmentStatus,
    generateMeetLink,
    deleteAppointment,
    searchAppointments,
    checkAvailability,
    mutate: mutateAppointments,
  };
};

/**
 * Hook personalizado para obter agendamentos de hoje
 */
export const useTodayAppointments = () => {
  const {
    data: appointments,
    error,
    isLoading,
    mutate,
  } = useSWR<Appointment[]>(
    "appointments/today",
    () => AppointmentsService.getTodayAppointments(),
    {
      revalidateOnFocus: true,
      refreshInterval: 60000, // Atualiza a cada minuto
    }
  );

  return {
    appointments: appointments || [],
    isLoading,
    error,
    mutate,
  };
};

/**
 * Hook personalizado para obter agendamentos da semana
 */
export const useWeekAppointments = () => {
  const {
    data: appointments,
    error,
    isLoading,
    mutate,
  } = useSWR<Appointment[]>(
    "appointments/week",
    () => AppointmentsService.getWeekAppointments(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutos
    }
  );

  return {
    appointments: appointments || [],
    isLoading,
    error,
    mutate,
  };
};

/**
 * Hook personalizado para obter um agendamento específico
 */
export const useAppointment = (id: number | null) => {
  const {
    data: appointment,
    error,
    isLoading,
    mutate,
  } = useSWR<Appointment>(
    id ? `appointments/${id}` : null,
    () => AppointmentsService.getAppointment(id!),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    appointment,
    isLoading,
    error,
    mutate,
  };
};
