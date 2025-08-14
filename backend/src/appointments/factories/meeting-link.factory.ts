import { Injectable } from "@nestjs/common";
import { MeetingLinkStrategy } from "../interfaces/meeting-link-strategy.interface";
import { GoogleMeetStrategy } from "../strategies/google-meet.strategy";
import { CustomUrlStrategy } from "../strategies/custom-url.strategy";
import { MeetingLinkType } from "../appointment.entity";

@Injectable()
export class MeetingLinkFactory {
  private strategies: Map<string, MeetingLinkStrategy> = new Map();

  constructor(
    private googleMeetStrategy: GoogleMeetStrategy,
    private customUrlStrategy: CustomUrlStrategy
  ) {
    // Registrar estratégias disponíveis
    this.strategies.set(MeetingLinkType.GOOGLE_MEET, this.googleMeetStrategy);
    this.strategies.set(MeetingLinkType.CUSTOM_URL, this.customUrlStrategy);
  }

  getStrategy(type: MeetingLinkType): MeetingLinkStrategy {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      throw new Error(
        `Estratégia de link de reunião não encontrada para o tipo: ${type}`
      );
    }
    return strategy;
  }

  getDefaultStrategy(): MeetingLinkStrategy {
    const defaultType =
      process.env.MEETING_LINK_TYPE || MeetingLinkType.GOOGLE_MEET;
    return this.getStrategy(defaultType as MeetingLinkType);
  }

  getAvailableStrategies(): string[] {
    return Array.from(this.strategies.keys());
  }
}
