import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsOptional,
    IsDateString,
} from "class-validator";

export class CreatePrescriptionDto {
    @IsNumber()
    @IsNotEmpty()
    patientId: number;

    @IsNumber()
    @IsOptional()
    doctorId?: number;

    @IsString()
    @IsNotEmpty()
    diagnosis: string;

    @IsString()
    @IsNotEmpty()
    prescription: string;

    @IsString()
    @IsOptional()
    observations?: string;

    @IsDateString()
    @IsOptional()
    prescriptionDate?: string;
} 