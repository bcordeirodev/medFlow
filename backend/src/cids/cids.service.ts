import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cid } from './cid.entity';
import { CreateCidDto } from './dto/create-cid.dto';
import { UpdateCidDto } from './dto/update-cid.dto';
import { Medicine } from '../medicines/medicine.entity';

@Injectable()
export class CidsService {
    constructor(
        @InjectRepository(Cid)
        private cidRepository: Repository<Cid>,
        @InjectRepository(Medicine)
        private medicineRepository: Repository<Medicine>,
    ) { }

    async create(createCidDto: CreateCidDto): Promise<Cid> {
        const cid = this.cidRepository.create(createCidDto);

        if (createCidDto.medicineIds && createCidDto.medicineIds.length > 0) {
            const medicines = await this.medicineRepository.findByIds(createCidDto.medicineIds);
            cid.medicines = medicines;
        }

        return this.cidRepository.save(cid);
    }

    async findAll(): Promise<Cid[]> {
        return this.cidRepository.find({
            relations: ['medicines'],
        });
    }

    async findOne(id: number): Promise<Cid> {
        const cid = await this.cidRepository.findOne({
            where: { id },
            relations: ['medicines'],
        });

        if (!cid) {
            throw new NotFoundException(`CID with ID ${id} not found`);
        }

        return cid;
    }

    async findByCode(code: string): Promise<Cid[]> {
        return this.cidRepository.find({
            where: { code },
            relations: ['medicines'],
        });
    }

    async update(id: number, updateCidDto: UpdateCidDto): Promise<Cid> {
        const cid = await this.findOne(id);

        if (updateCidDto.medicineIds) {
            const medicines = await this.medicineRepository.findByIds(updateCidDto.medicineIds);
            cid.medicines = medicines;
        }

        Object.assign(cid, updateCidDto);
        return this.cidRepository.save(cid);
    }

    async remove(id: number): Promise<void> {
        const cid = await this.findOne(id);
        await this.cidRepository.remove(cid);
    }

    async addMedicineToCid(cidId: number, medicineId: number): Promise<Cid> {
        const cid = await this.findOne(cidId);
        const medicine = await this.medicineRepository.findOne({ where: { id: medicineId } });

        if (!medicine) {
            throw new NotFoundException(`Medicine with ID ${medicineId} not found`);
        }

        if (!cid.medicines.some(m => m.id === medicineId)) {
            cid.medicines.push(medicine);
            return this.cidRepository.save(cid);
        }

        return cid;
    }

    async removeMedicineFromCid(cidId: number, medicineId: number): Promise<Cid> {
        const cid = await this.findOne(cidId);
        cid.medicines = cid.medicines.filter(m => m.id !== medicineId);
        return this.cidRepository.save(cid);
    }
} 