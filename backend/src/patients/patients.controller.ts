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
} from "@nestjs/common";
import { PatientsService } from "./patients.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("patients")
@UseGuards(JwtAuthGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) { }

  @Post()
  create(@Body() createPatientDto: any, @Request() req) {
    if (!req.user || !req.user.userId) {
      throw new Error(
        "Usuário não autenticado ou ID do usuário não encontrado",
      );
    }

    return this.patientsService.create({
      ...createPatientDto,
      doctorId: req.user.userId,
    });
  }

  @Get()
  findAll(@Request() req) {
    return this.patientsService.findByDoctor(req.user.userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.patientsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updatePatientDto: any) {
    return this.patientsService.update(+id, updatePatientDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.patientsService.remove(+id);
  }
}
