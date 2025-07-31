import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Medicine } from "./medicine.entity";

@Injectable()
export class MedicinesService {
  constructor(
    @InjectRepository(Medicine)
    private medicinesRepository: Repository<Medicine>,
  ) {}

  async create(createMedicineDto: Partial<Medicine>): Promise<Medicine> {
    const medicine = this.medicinesRepository.create(createMedicineDto);
    return this.medicinesRepository.save(medicine);
  }

  async findAll(): Promise<Medicine[]> {
    return this.medicinesRepository.find({
      where: { isActive: true },
    });
  }

  async findOne(id: number): Promise<Medicine> {
    return this.medicinesRepository.findOne({ where: { id } });
  }

  async search(query: string): Promise<Medicine[]> {
    return this.medicinesRepository
      .createQueryBuilder("medicine")
      .where(
        "medicine.name ILIKE :query OR medicine.genericName ILIKE :query",
        {
          query: `%${query}%`,
        },
      )
      .andWhere("medicine.isActive = :isActive", { isActive: true })
      .getMany();
  }

  async update(
    id: number,
    updateMedicineDto: Partial<Medicine>,
  ): Promise<Medicine> {
    await this.medicinesRepository.update(id, updateMedicineDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.medicinesRepository.update(id, { isActive: false });
  }
}
