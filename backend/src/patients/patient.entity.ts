import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from "typeorm";
import { User } from "../users/user.entity";

@Entity("patients")
export class Patient {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    cpf: string;

    @Column({ type: "date" })
    birthDate: Date;

    @Column()
    gender: string;

    @Column({ type: "text", nullable: true })
    address: string;

    @Column({ type: "text", nullable: true })
    allergies: string;

    @Column({ type: "text", nullable: true })
    medicalHistory: string;

    @Column({ type: "text", nullable: true })
    observations: string;

    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
    doctor: User;

    @Column()
    doctorId: number;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
