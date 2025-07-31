import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('prescriptions')
@UseGuards(JwtAuthGuard)
export class PrescriptionsController {
    constructor(private readonly prescriptionsService: PrescriptionsService) { }

    @Post('suggest-observations')
    async suggestObservations(@Body() data: { diagnosis: string; medicines: string[] }) {
        return this.prescriptionsService.suggestObservations(data.diagnosis, data.medicines);
    }

    @Post()
    create(@Body() createPrescriptionDto: any, @Request() req: any) {
        // Extrai o doctorId do usuário autenticado
        const doctorId = req.user?.userId;

        console.log('Request user:', req.user);
        console.log('DoctorId:', doctorId);
        console.log('CreatePrescriptionDto:', createPrescriptionDto);

        if (!doctorId) {
            throw new Error('Usuário não autenticado');
        }

        // Adiciona o doctorId aos dados da prescrição
        const prescriptionData = {
            ...createPrescriptionDto,
            doctorId: doctorId
        };

        console.log('Prescription data to save:', prescriptionData);

        return this.prescriptionsService.create(prescriptionData);
    }

    @Get()
    findAll(@Query("search") search?: string) {
        if (search) {
            return this.prescriptionsService.search(search);
        }
        return this.prescriptionsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.prescriptionsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePrescriptionDto: any) {
        return this.prescriptionsService.update(+id, updatePrescriptionDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.prescriptionsService.remove(+id);
    }
}
