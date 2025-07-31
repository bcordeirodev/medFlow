import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Patient } from "./patient.entity";

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
  ) { }

  async create(createPatientDto: Partial<Patient>): Promise<Patient> {
    // Verificar se o doctorId é válido
    if (!createPatientDto.doctorId) {
      throw new Error("doctorId é obrigatório");
    }

    const patient = this.patientsRepository.create(createPatientDto);
    return this.patientsRepository.save(patient);
  }

  async findAll(): Promise<Patient[]> {
    return this.patientsRepository.find({
      where: { isActive: true },
      relations: ["doctor"],
    });
  }

  async findByDoctor(doctorId: number): Promise<Patient[]> {
    return this.patientsRepository.find({
      where: { doctorId, isActive: true },
      relations: ["doctor"],
    });
  }

  async findOne(id: number): Promise<Patient> {
    return this.patientsRepository.findOne({
      where: { id },
      relations: ["doctor"],
    });
  }

  async update(
    id: number,
    updatePatientDto: Partial<Patient>,
  ): Promise<Patient> {
    await this.patientsRepository.update(id, updatePatientDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.patientsRepository.update(id, { isActive: false });
  }
}
