import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  BadRequestException,
} from "@nestjs/common";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AppointmentStatus } from "./appointment.entity";

@Controller("appointments")
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto, @Request() req) {
    if (!req.user || !req.user.userId) {
      throw new BadRequestException(
        "Usuário não autenticado ou ID do usuário não encontrado"
      );
    }

    return this.appointmentsService.create(
      createAppointmentDto,
      req.user.userId
    );
  }

  @Get()
  findAll(@Request() req, @Query() query: any) {
    const { patientId, startDate, endDate } = query;

    // Se especificou um paciente, buscar por paciente
    if (patientId) {
      return this.appointmentsService.findByPatient(+patientId);
    }

    // Se especificou um range de datas, buscar por data
    if (startDate && endDate) {
      return this.appointmentsService.findByDateRange(
        new Date(startDate),
        new Date(endDate),
        req.user.userId
      );
    }

    // Senão, buscar todos do médico
    return this.appointmentsService.findByDoctor(req.user.userId);
  }

  @Get("today")
  findToday(@Request() req) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    return this.appointmentsService.findByDateRange(
      startOfDay,
      endOfDay,
      req.user.userId
    );
  }

  @Get("week")
  findWeek(@Request() req) {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const endOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + 6)
    );

    startOfWeek.setHours(0, 0, 0, 0);
    endOfWeek.setHours(23, 59, 59, 999);

    return this.appointmentsService.findByDateRange(
      startOfWeek,
      endOfWeek,
      req.user.userId
    );
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.appointmentsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto
  ) {
    return this.appointmentsService.update(+id, updateAppointmentDto);
  }

  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body() body: { status: AppointmentStatus }
  ) {
    return this.appointmentsService.updateStatus(+id, body.status);
  }

  @Post(":id/meet-link")
  generateMeetLink(@Param("id") id: string) {
    return this.appointmentsService.generateMeetLink(+id);
  }

  @Get("google-calendar/status")
  getGoogleCalendarStatus() {
    return this.appointmentsService.getGoogleCalendarStatus();
  }

  @Get("meeting-strategies")
  getMeetingStrategies() {
    return this.appointmentsService.getMeetingStrategies();
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.appointmentsService.remove(+id);
  }
}
