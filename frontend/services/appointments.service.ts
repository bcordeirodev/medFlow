import { apiClient } from "@/lib/api";
import {
  appointmentSchema,
  appointmentUpdateSchema,
  AppointmentFormData,
  AppointmentUpdateData,
} from "@/lib/schemas";
import { Appointment, AppointmentStatus } from "@/types/entities.types";

/**
 * Service para gerenciar agendamentos
 */
export class AppointmentsService {
  /**
   * Obtém lista de agendamentos
   * @param filters - Filtros de busca
   * @returns Promise com lista de agendamentos
   */
  static async getAppointments(filters?: {
    patientId?: number;
    startDate?: string;
    endDate?: string;
    status?: AppointmentStatus;
    search?: string;
  }): Promise<Appointment[]> {
    const params = new URLSearchParams();

    if (filters?.patientId)
      params.append("patientId", filters.patientId.toString());
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.search) params.append("search", filters.search);

    const response = await apiClient.get<Appointment[]>(
      `/appointments?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Obtém agendamentos de hoje
   * @returns Promise com lista de agendamentos
   */
  static async getTodayAppointments(): Promise<Appointment[]> {
    const response = await apiClient.get<Appointment[]>("/appointments/today");
    return response.data;
  }

  /**
   * Obtém agendamentos da semana
   * @returns Promise com lista de agendamentos
   */
  static async getWeekAppointments(): Promise<Appointment[]> {
    const response = await apiClient.get<Appointment[]>("/appointments/week");
    return response.data;
  }

  /**
   * Obtém agendamento por ID
   * @param id - ID do agendamento
   * @returns Promise com dados do agendamento
   */
  static async getAppointment(id: number): Promise<Appointment> {
    const response = await apiClient.get<Appointment>(`/appointments/${id}`);
    return response.data;
  }

  /**
   * Cria novo agendamento
   * @param appointmentData - Dados do agendamento
   * @returns Promise com agendamento criado
   */
  static async createAppointment(
    appointmentData: AppointmentFormData
  ): Promise<Appointment> {
    // Validação com Zod
    const validatedData = appointmentSchema.parse(appointmentData);

    const response = await apiClient.post<Appointment>(
      "/appointments",
      validatedData
    );
    return response.data;
  }

  /**
   * Atualiza agendamento existente
   * @param id - ID do agendamento
   * @param appointmentData - Dados para atualização
   * @returns Promise com agendamento atualizado
   */
  static async updateAppointment(
    id: number,
    appointmentData: AppointmentUpdateData
  ): Promise<Appointment> {
    // Validação com Zod
    const validatedData = appointmentUpdateSchema.parse(appointmentData);

    const response = await apiClient.patch<Appointment>(
      `/appointments/${id}`,
      validatedData
    );
    return response.data;
  }

  /**
   * Atualiza status do agendamento
   * @param id - ID do agendamento
   * @param status - Novo status
   * @returns Promise com agendamento atualizado
   */
  static async updateAppointmentStatus(
    id: number,
    status: AppointmentStatus
  ): Promise<Appointment> {
    const response = await apiClient.patch<Appointment>(
      `/appointments/${id}/status`,
      { status }
    );
    return response.data;
  }

  /**
   * Gera link do Google Meet para o agendamento
   * @param id - ID do agendamento
   * @returns Promise com link do Meet
   */
  static async generateMeetLink(
    id: number
  ): Promise<{ googleMeetLink: string }> {
    const response = await apiClient.post<{ googleMeetLink: string }>(
      `/appointments/${id}/meet-link`
    );
    return response.data;
  }

  /**
   * Remove agendamento
   * @param id - ID do agendamento
   * @returns Promise vazia
   */
  static async deleteAppointment(id: number): Promise<void> {
    await apiClient.delete(`/appointments/${id}`);
  }

  /**
   * Busca agendamentos por termo
   * @param searchTerm - Termo de busca
   * @returns Promise com lista de agendamentos
   */
  static async searchAppointments(searchTerm: string): Promise<Appointment[]> {
    const response = await apiClient.get<Appointment[]>(
      `/appointments/search?q=${encodeURIComponent(searchTerm)}`
    );
    return response.data;
  }

  /**
   * Verifica disponibilidade de horário
   * @param date - Data e hora do agendamento
   * @param duration - Duração em minutos
   * @returns Promise com informação de disponibilidade
   */
  static async checkAvailability(
    date: string,
    duration: number = 30
  ): Promise<{ available: boolean; conflicts?: Appointment[] }> {
    const response = await apiClient.get<{
      available: boolean;
      conflicts?: Appointment[];
    }>(
      `/appointments/availability?date=${encodeURIComponent(date)}&duration=${duration}`
    );
    return response.data;
  }
}
