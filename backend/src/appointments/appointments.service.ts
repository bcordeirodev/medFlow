import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import {
  Appointment,
  AppointmentStatus,
  MeetingLinkType,
} from "./appointment.entity";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { google } from "googleapis";
import { MeetingLinkFactory } from "./factories/meeting-link.factory";

@Injectable()
export class AppointmentsService {
  private calendar;
  private isGoogleCalendarEnabled: boolean = false;

  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    private meetingLinkFactory: MeetingLinkFactory
  ) {
    this.initializeGoogleCalendar();
  }

  private initializeGoogleCalendar() {
    try {
      // Verificar se as credenciais estão configuradas
      if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        // Usar OAuth2 Client para autenticação
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          "urn:ietf:wg:oauth:2.0:oob" // Para aplicações de servidor
        );

        // Para desenvolvimento, vamos usar uma abordagem simplificada
        // Em produção, seria necessário implementar o fluxo OAuth completo
        this.calendar = google.calendar({ version: "v3", auth: oauth2Client });
        this.isGoogleCalendarEnabled = true;
        console.log(
          "✅ Google Calendar API inicializada com credenciais OAuth2"
        );
      } else if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE) {
        // Fallback para Service Account
        const auth = new google.auth.GoogleAuth({
          keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
          scopes: ["https://www.googleapis.com/auth/calendar"],
        });
        this.calendar = google.calendar({ version: "v3", auth });
        this.isGoogleCalendarEnabled = true;
        console.log("✅ Google Calendar API inicializada com Service Account");
      } else {
        console.log(
          "⚠️ Google Calendar desabilitado - credenciais não configuradas"
        );
        console.log(
          "Configure GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET ou GOOGLE_SERVICE_ACCOUNT_KEY_FILE"
        );
        this.isGoogleCalendarEnabled = false;
      }
    } catch (error) {
      console.error("❌ Erro ao inicializar Google Calendar:", error.message);
      this.isGoogleCalendarEnabled = false;
    }
  }

  async create(
    createAppointmentDto: CreateAppointmentDto,
    doctorId: number
  ): Promise<Appointment> {
    // Verificar se não há conflito de horário
    const conflictingAppointment = await this.checkTimeConflict(
      createAppointmentDto.appointmentDate,
      createAppointmentDto.duration || 30,
      doctorId
    );

    if (conflictingAppointment) {
      throw new BadRequestException("Já existe um agendamento neste horário");
    }

    const appointment = this.appointmentsRepository.create({
      ...createAppointmentDto,
      doctorId,
      appointmentDate: new Date(createAppointmentDto.appointmentDate),
    });

    const savedAppointment =
      await this.appointmentsRepository.save(appointment);

    // Gerar link da reunião automaticamente usando a estratégia configurada
    const strategy = this.meetingLinkFactory.getDefaultStrategy();
    const meetLink = await strategy.generateMeetingLink(savedAppointment);
    savedAppointment.googleMeetLink = meetLink;
    savedAppointment.meetingLinkType =
      strategy.getMeetingLinkType() as MeetingLinkType;

    // Criar evento no Google Calendar (se habilitado)
    if (this.isGoogleCalendarEnabled) {
      try {
        const googleEvent =
          await this.createGoogleCalendarEvent(savedAppointment);
        savedAppointment.googleEventId = googleEvent.id;
        // Manter o link gerado, não usar o do Google Calendar
        console.log("✅ Evento criado no Google Calendar");
      } catch (error) {
        console.error(
          "❌ Erro ao criar evento no Google Calendar:",
          error.message
        );
        // Não falha a criação do appointment se o Google Calendar falhar
      }
    } else {
      console.log(
        "⚠️ Google Calendar desabilitado - usando link direto do Meet"
      );
    }

    // Salvar com o link da reunião
    await this.appointmentsRepository.save(savedAppointment);
    console.log("✅ Link da reunião gerado:", meetLink);

    return this.findOne(savedAppointment.id);
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      where: { isActive: true },
      relations: ["patient", "doctor"],
      order: { appointmentDate: "ASC" },
    });
  }

  async findByDoctor(doctorId: number): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      where: { doctorId, isActive: true },
      relations: ["patient", "doctor"],
      order: { appointmentDate: "ASC" },
    });
  }

  async findByPatient(patientId: number): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      where: { patientId, isActive: true },
      relations: ["patient", "doctor"],
      order: { appointmentDate: "ASC" },
    });
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
    doctorId?: number
  ): Promise<Appointment[]> {
    const whereCondition: any = {
      appointmentDate: Between(startDate, endDate),
      isActive: true,
    };

    if (doctorId) {
      whereCondition.doctorId = doctorId;
    }

    return this.appointmentsRepository.find({
      where: whereCondition,
      relations: ["patient", "doctor"],
      order: { appointmentDate: "ASC" },
    });
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ["patient", "doctor"],
    });

    if (!appointment) {
      throw new NotFoundException(`Agendamento com ID ${id} não encontrado`);
    }

    return appointment;
  }

  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto
  ): Promise<Appointment> {
    const appointment = await this.findOne(id);

    // Se mudou a data/hora, verificar conflitos
    if (updateAppointmentDto.appointmentDate) {
      const conflictingAppointment = await this.checkTimeConflict(
        updateAppointmentDto.appointmentDate,
        updateAppointmentDto.duration || appointment.duration,
        appointment.doctorId,
        id // Excluir o próprio appointment da verificação
      );

      if (conflictingAppointment) {
        throw new BadRequestException("Já existe um agendamento neste horário");
      }
    }

    await this.appointmentsRepository.update(id, {
      ...updateAppointmentDto,
      appointmentDate: updateAppointmentDto.appointmentDate
        ? new Date(updateAppointmentDto.appointmentDate)
        : undefined,
    });

    const updatedAppointment = await this.findOne(id);

    // Atualizar evento no Google Calendar (se habilitado e existir)
    if (this.isGoogleCalendarEnabled && appointment.googleEventId) {
      try {
        await this.updateGoogleCalendarEvent(updatedAppointment);
        console.log("✅ Evento atualizado no Google Calendar");
      } catch (error) {
        console.error(
          "❌ Erro ao atualizar evento no Google Calendar:",
          error.message
        );
      }
    }

    return updatedAppointment;
  }

  async updateStatus(
    id: number,
    status: AppointmentStatus
  ): Promise<Appointment> {
    await this.appointmentsRepository.update(id, { status });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const appointment = await this.findOne(id);

    // Cancelar evento no Google Calendar (se habilitado e existir)
    if (this.isGoogleCalendarEnabled && appointment.googleEventId) {
      try {
        await this.deleteGoogleCalendarEvent(appointment.googleEventId);
        console.log("✅ Evento cancelado no Google Calendar");
      } catch (error) {
        console.error(
          "❌ Erro ao cancelar evento no Google Calendar:",
          error.message
        );
      }
    }

    await this.appointmentsRepository.update(id, { isActive: false });
  }

  async generateMeetLink(id: number): Promise<string> {
    const appointment = await this.findOne(id);

    // Se já tem um link, retorna o existente
    if (appointment.googleMeetLink) {
      return appointment.googleMeetLink;
    }

    // Usar a estratégia configurada para gerar o link
    const strategy = this.meetingLinkFactory.getStrategy(
      appointment.meetingLinkType || MeetingLinkType.GOOGLE_MEET
    );
    const meetLink = await strategy.generateMeetingLink(appointment);

    // Salvar o link no agendamento
    appointment.googleMeetLink = meetLink;
    await this.appointmentsRepository.save(appointment);

    console.log(
      `✅ Link da reunião gerado com sucesso (${strategy.getMeetingLinkType()}):`,
      meetLink
    );
    return meetLink;
  }

  private generateUniqueMeetLink(appointment: any): string {
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

  async getGoogleCalendarStatus(): Promise<{
    enabled: boolean;
    message: string;
  }> {
    return {
      enabled: this.isGoogleCalendarEnabled,
      message: this.isGoogleCalendarEnabled
        ? "Google Calendar configurado e funcionando"
        : "Google Calendar não configurado. Configure as credenciais em GOOGLE_SERVICE_ACCOUNT_KEY_FILE",
    };
  }

  async getMeetingStrategies(): Promise<{
    current: string;
    available: string[];
    configuration: any;
  }> {
    const defaultStrategy = this.meetingLinkFactory.getDefaultStrategy();
    return {
      current: defaultStrategy.getMeetingLinkType(),
      available: this.meetingLinkFactory.getAvailableStrategies(),
      configuration: {
        meetingLinkType:
          process.env.MEETING_LINK_TYPE || MeetingLinkType.GOOGLE_MEET,
        customMeetingBaseUrl:
          process.env.CUSTOM_MEETING_BASE_URL || "https://meet.medflow.com",
        enableCustomMeetingPlatform:
          process.env.ENABLE_CUSTOM_MEETING_PLATFORM === "true",
      },
    };
  }

  private async checkTimeConflict(
    appointmentDate: string,
    duration: number,
    doctorId: number,
    excludeId?: number
  ): Promise<Appointment | null> {
    const startTime = new Date(appointmentDate);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const query = this.appointmentsRepository
      .createQueryBuilder("appointment")
      .where("appointment.doctorId = :doctorId", { doctorId })
      .andWhere("appointment.isActive = true")
      .andWhere("appointment.status != :cancelled", {
        cancelled: AppointmentStatus.CANCELLED,
      })
      .andWhere(
        "(appointment.appointmentDate < :endTime AND (appointment.appointmentDate + INTERVAL '1 minute' * appointment.duration) > :startTime)",
        { startTime, endTime }
      );

    if (excludeId) {
      query.andWhere("appointment.id != :excludeId", { excludeId });
    }

    return query.getOne();
  }

  private async createGoogleCalendarEvent(
    appointment: Appointment,
    forceMeet = false
  ): Promise<any> {
    const event = {
      summary: appointment.title,
      description: appointment.description || "",
      start: {
        dateTime: appointment.appointmentDate.toISOString(),
        timeZone: "America/Sao_Paulo",
      },
      end: {
        dateTime: new Date(
          appointment.appointmentDate.getTime() + appointment.duration * 60000
        ).toISOString(),
        timeZone: "America/Sao_Paulo",
      },
      attendees: [],
      conferenceData: forceMeet
        ? {
            createRequest: {
              requestId: `meet-${appointment.id}-${Date.now()}`,
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          }
        : undefined,
    };

    const response = await this.calendar.events.insert({
      calendarId: "primary", // Service Account's primary calendar
      resource: event,
      conferenceDataVersion: forceMeet ? 1 : 0,
    });

    return response.data;
  }

  private async updateGoogleCalendarEvent(
    appointment: Appointment
  ): Promise<any> {
    const event = {
      summary: appointment.title,
      description: appointment.description || "",
      start: {
        dateTime: appointment.appointmentDate.toISOString(),
        timeZone: "America/Sao_Paulo",
      },
      end: {
        dateTime: new Date(
          appointment.appointmentDate.getTime() + appointment.duration * 60000
        ).toISOString(),
        timeZone: "America/Sao_Paulo",
      },
    };

    const response = await this.calendar.events.update({
      calendarId: "primary",
      eventId: appointment.googleEventId,
      resource: event,
    });

    return response.data;
  }

  private async deleteGoogleCalendarEvent(eventId: string): Promise<void> {
    await this.calendar.events.delete({
      calendarId: "primary",
      eventId: eventId,
    });
  }
}
