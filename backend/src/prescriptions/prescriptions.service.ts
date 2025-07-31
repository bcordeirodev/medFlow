import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { Prescription } from "./prescription.entity";
import axios from 'axios';

@Injectable()
export class PrescriptionsService {
    constructor(
        @InjectRepository(Prescription)
        private prescriptionsRepository: Repository<Prescription>,
    ) { }

    async create(
        createPrescriptionDto: Partial<Prescription>,
    ): Promise<Prescription> {
        const prescription = this.prescriptionsRepository.create({
            ...createPrescriptionDto,
            prescriptionDate: new Date(),
        });
        return this.prescriptionsRepository.save(prescription);
    }

    async findAll(): Promise<Prescription[]> {
        return this.prescriptionsRepository.find({
            where: { isActive: true },
            relations: ["doctor", "patient"],
            order: { createdAt: "DESC" },
        });
    }

    async search(searchTerm: string): Promise<Prescription[]> {
        return this.prescriptionsRepository.find({
            where: [
                { diagnosis: Like(`%${searchTerm}%`), isActive: true },
                { prescription: Like(`%${searchTerm}%`), isActive: true },
                { observations: Like(`%${searchTerm}%`), isActive: true },
            ],
            relations: ["doctor", "patient"],
            order: { createdAt: "DESC" },
        });
    }

    async findByDoctor(doctorId: number): Promise<Prescription[]> {
        return this.prescriptionsRepository.find({
            where: { doctorId, isActive: true },
            relations: ["doctor", "patient"],
            order: { createdAt: "DESC" },
        });
    }

    async findByPatient(patientId: number): Promise<Prescription[]> {
        return this.prescriptionsRepository.find({
            where: { patientId, isActive: true },
            relations: ["doctor", "patient"],
            order: { createdAt: "DESC" },
        });
    }

    async findOne(id: number): Promise<Prescription> {
        return this.prescriptionsRepository.findOne({
            where: { id },
            relations: ["doctor", "patient"],
        });
    }

    async update(
        id: number,
        updatePrescriptionDto: Partial<Prescription>,
    ): Promise<Prescription> {
        await this.prescriptionsRepository.update(id, updatePrescriptionDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.prescriptionsRepository.update(id, { isActive: false });
    }

    async suggestObservations(diagnosis: string, medicines: string[]): Promise<{ suggestions: string[] }> {
        try {
            const prompt = `
Como médico especialista, analise o seguinte diagnóstico e medicamentos prescritos e sugira observações importantes para o paciente:

DIAGNÓSTICO: ${diagnosis}

MEDICAMENTOS PRESCRITOS:
${medicines.map(med => `- ${med}`).join('\n')}

Por favor, sugira observações médicas importantes incluindo:
1. Cuidados específicos com os medicamentos
2. Possíveis efeitos colaterais a observar
3. Contraindicações importantes
4. Orientações gerais para o paciente
5. Sinais de alerta que requerem retorno médico

Responda de forma clara e objetiva, em português brasileiro, com no máximo 3-4 observações principais.
      `.trim();

            // Usando uma API gratuita de IA (Hugging Face ou similar)
            // Para este exemplo, vou simular uma resposta
            const suggestions = [
                `Observar possíveis efeitos colaterais dos medicamentos prescritos.`,
                `Manter hidratação adequada durante o tratamento.`,
                `Evitar automedicação e seguir rigorosamente a prescrição médica.`,
                `Retornar ao médico se houver piora dos sintomas ou efeitos adversos.`
            ];

            return { suggestions };
        } catch (error) {
            console.error('Erro ao gerar sugestões:', error);
            return {
                suggestions: [
                    'Siga rigorosamente a prescrição médica.',
                    'Mantenha acompanhamento médico regular.',
                    'Observe possíveis efeitos colaterais.'
                ]
            };
        }
    }
}
