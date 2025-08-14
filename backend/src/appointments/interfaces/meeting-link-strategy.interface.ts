import { Appointment } from "../appointment.entity";

export interface MeetingLinkStrategy {
  generateMeetingLink(appointment: Appointment): Promise<string>;
  validateMeetingLink(link: string): boolean;
  getMeetingLinkType(): string;
}

export interface MeetingLinkConfig {
  type: string;
  baseUrl?: string;
  apiKey?: string;
  webhookUrl?: string;
  customDomain?: string;
}
