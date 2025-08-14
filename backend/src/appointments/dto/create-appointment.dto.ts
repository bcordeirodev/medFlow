import { IsNotEmpty, IsString, IsOptional, IsEnum, IsDateString, IsNumber, Min, Max } from 'class-validator';
import { AppointmentStatus, AppointmentType } from '../appointment.entity';

export class CreateAppointmentDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsDateString()
    appointmentDate: string;

    @IsOptional()
    @IsNumber()
    @Min(15)
    @Max(480) // Max 8 hours
    duration?: number;

    @IsOptional()
    @IsEnum(AppointmentStatus)
    status?: AppointmentStatus;

    @IsOptional()
    @IsEnum(AppointmentType)
    type?: AppointmentType;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsNotEmpty()
    @IsNumber()
    patientId: number;

    // doctorId será preenchido automaticamente no controller
}
