import { Injectable } from "@nestjs/common";
import { Appointment } from "../appointment.entity";
import { MeetingLinkStrategy } from "../interfaces/meeting-link-strategy.interface";

@Injectable()
export class GoogleMeetStrategy implements MeetingLinkStrategy {
  getMeetingLinkType(): string {
    return "google_meet";
  }

  async generateMeetingLink(appointment: Appointment): Promise<string> {
    // Gerar um identificador único baseado no agendamento
    const appointmentId = appointment.id;
    const doctorId = appointment.doctorId;
    const patientId = appointment.patientId;
    const timestamp = new Date(appointment.appointmentDate).getTime();

    // Criar um código único para a reunião
    const meetingCode =
      `medflow-${appointmentId}-${doctorId}-${patientId}-${timestamp}`.substring(
        0,
        50
      );

    // Retornar um link do Google Meet com o código único
    return `https://meet.google.com/${this.generateMeetCode(meetingCode)}`;
  }

  validateMeetingLink(link: string): boolean {
    const googleMeetRegex = /^https:\/\/meet\.google\.com\/[a-z0-9-]+$/i;
    return googleMeetRegex.test(link);
  }

  private generateMeetCode(input: string): string {
    // Gerar um código de 10 caracteres para o Google Meet
    // Formato: xxx-xxxx-xxx
    const hash = this.simpleHash(input);
    const code = hash.substring(0, 10);
    return `${code.substring(0, 3)}-${code.substring(3, 7)}-${code.substring(7, 10)}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36).padStart(10, "0");
  }
}
