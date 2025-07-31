import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from "typeorm";
import { User } from "../users/user.entity";
import { Patient } from "../patients/patient.entity";

@Entity("prescriptions")
export class Prescription {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "text" })
    diagnosis: string;

    @Column({ type: "text" })
    prescription: string;

    @Column({ type: "text", nullable: true })
    observations: string;

    @Column({ type: "date" })
    prescriptionDate: Date;

    @Column({ type: "date", nullable: true })
    validUntil: Date;

    @ManyToOne(() => User, (user) => user.id)
    doctor: User;

    @Column({ nullable: false })
    doctorId: number;

    @ManyToOne(() => Patient, (patient) => patient.id)
    patient: Patient;

    @Column()
    patientId: number;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
