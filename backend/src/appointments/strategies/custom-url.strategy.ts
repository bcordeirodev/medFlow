import { Injectable } from "@nestjs/common";
import { Appointment } from "../appointment.entity";
import { MeetingLinkStrategy } from "../interfaces/meeting-link-strategy.interface";

@Injectable()
export class CustomUrlStrategy implements MeetingLinkStrategy {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.CUSTOM_MEETING_BASE_URL || "https://meet.medflow.com";
  }

  getMeetingLinkType(): string {
    return "custom_url";
  }

  async generateMeetingLink(appointment: Appointment): Promise<string> {
    // Gerar um identificador único para a sala de reunião
    const roomId = this.generateRoomId(appointment);

    // Retornar URL customizada
    return `${this.baseUrl}/room/${roomId}`;
  }

  validateMeetingLink(link: string): boolean {
    const customUrlRegex = new RegExp(
      `^${this.baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/room/[a-z0-9-]+$`,
      "i"
    );
    return customUrlRegex.test(link);
  }

  private generateRoomId(appointment: Appointment): string {
    // Gerar um ID único para a sala baseado no agendamento
    const appointmentId = appointment.id;
    const doctorId = appointment.doctorId;
    const patientId = appointment.patientId;
    const date = new Date(appointment.appointmentDate);

    // Criar um hash único
    const dataString = `${appointmentId}-${doctorId}-${patientId}-${date.toISOString().split("T")[0]}`;
    const hash = this.generateHash(dataString);

    return `medflow-${hash}`;
  }

  private generateHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
}
