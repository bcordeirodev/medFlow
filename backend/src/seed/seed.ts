import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Medicine } from "../medicines/medicine.entity";
import { Cid } from "../cids/cid.entity";
import { Patient } from "../patients/patient.entity";
import { Prescription } from "../prescriptions/prescription.entity";
import { User } from "../users/user.entity";
import * as bcrypt from "bcryptjs";
import {
    orthopedicMedicines,
    orthopedicCids,
    cidMedicineAssociations,
    orthopedicDoctors,
    orthopedicPatients,
    orthopedicPrescriptions
} from "./seed-data";

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const medicineRepository = app.get(getRepositoryToken(Medicine));
    const cidRepository = app.get(getRepositoryToken(Cid));
    const patientRepository = app.get(getRepositoryToken(Patient));
    const prescriptionRepository = app.get(getRepositoryToken(Prescription));
    const userRepository = app.get(getRepositoryToken(User));

    console.log("🌱 Iniciando seed dos dados...");

    try {
        // Limpar dados existentes
        console.log("🧹 Limpando dados existentes...");
        await prescriptionRepository.query("DELETE FROM prescriptions");
        await patientRepository.query("DELETE FROM patients");
        await cidRepository.query("DELETE FROM cid_medicines");
        await cidRepository.query("DELETE FROM cids");
        await medicineRepository.query("DELETE FROM medicines");
        await userRepository.query("DELETE FROM users");

        // Inserir usuários médicos
        console.log("👨‍⚕️ Inserindo usuários médicos...");
        // Hashear as senhas antes de inserir
        const doctorsWithHashedPasswords = await Promise.all(
            orthopedicDoctors.map(async (doctor) => ({
                ...doctor,
                password: await bcrypt.hash(doctor.password, 10),
            }))
        );
        const doctors = await userRepository.save(doctorsWithHashedPasswords);
        console.log(`✅ ${doctors.length} médicos inseridos`);

        // Inserir medicamentos
        console.log("💊 Inserindo medicamentos ortopédicos...");
        const medicines = await medicineRepository.save(orthopedicMedicines);
        console.log(`✅ ${medicines.length} medicamentos inseridos`);

        // Inserir CIDs
        console.log("🏥 Inserindo CIDs ortopédicos...");
        const cids = await cidRepository.save(orthopedicCids);
        console.log(`✅ ${cids.length} CIDs inseridos`);

        // Inserir pacientes
        console.log("👥 Inserindo pacientes ortopédicos...");
        // Ajustar doctorId para usar o ID do primeiro médico inserido
        const patientsWithDoctorId = orthopedicPatients.map(patient => ({
            ...patient,
            doctorId: doctors[0].id
        }));

        // Verificar se o médico existe antes de inserir pacientes
        const doctorExists = await userRepository.findOne({ where: { id: doctors[0].id } });
        if (!doctorExists) {
            throw new Error(`Médico com ID ${doctors[0].id} não encontrado`);
        }

        const patients = await patientRepository.save(patientsWithDoctorId);
        console.log(`✅ ${patients.length} pacientes inseridos`);

        // Associar medicamentos aos CIDs
        console.log("🔗 Associando medicamentos aos CIDs...");
        for (const association of cidMedicineAssociations) {
            const cid = cids.find(c => c.code === association.cidCode);
            if (cid) {
                const medicinesToAssociate = medicines.filter(m =>
                    association.medicineNames.includes(m.name)
                );

                if (medicinesToAssociate.length > 0) {
                    cid.medicines = medicinesToAssociate;
                    await cidRepository.save(cid);
                    console.log(`✅ CID ${cid.code} (${cid.name}) - ${medicinesToAssociate.length} medicamentos associados`);
                }
            }
        }

        // Inserir prescrições
        console.log("📋 Inserindo prescrições ortopédicas...");
        // Ajustar doctorId e patientId para usar os IDs corretos
        const prescriptionsWithIds = orthopedicPrescriptions.map((prescription, index) => ({
            ...prescription,
            doctorId: doctors[0].id,
            patientId: patients[index % patients.length].id // Distribuir pacientes entre as prescrições
        }));
        const prescriptions = await prescriptionRepository.save(prescriptionsWithIds);
        console.log(`✅ ${prescriptions.length} prescrições inseridas`);

        console.log("🎉 Seed concluído com sucesso!");
        console.log("\n📊 Resumo:");
        console.log(`- ${doctors.length} médicos inseridos`);
        console.log(`- ${medicines.length} medicamentos inseridos`);
        console.log(`- ${cids.length} CIDs inseridos`);
        console.log(`- ${patients.length} pacientes inseridos`);
        console.log(`- ${prescriptions.length} prescrições inseridas`);
        console.log(`- ${cidMedicineAssociations.length} associações criadas`);

    } catch (error) {
        console.error("❌ Erro durante o seed:", error);
    } finally {
        await app.close();
    }
}

bootstrap(); 