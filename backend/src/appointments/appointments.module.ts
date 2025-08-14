import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentsService } from "./appointments.service";
import { AppointmentsController } from "./appointments.controller";
import { Appointment } from "./appointment.entity";
import { MeetingLinkFactory } from "./factories/meeting-link.factory";
import { GoogleMeetStrategy } from "./strategies/google-meet.strategy";
import { CustomUrlStrategy } from "./strategies/custom-url.strategy";

@Module({
  imports: [TypeOrmModule.forFeature([Appointment])],
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    MeetingLinkFactory,
    GoogleMeetStrategy,
    CustomUrlStrategy,
  ],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
