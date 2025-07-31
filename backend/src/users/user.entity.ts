import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Patient } from "../patients/patient.entity";

export enum UserRole {
  ADMIN = "admin",
  DOCTOR = "doctor",
  ASSISTANT = "assistant",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.DOCTOR,
  })
  role: UserRole;

  @Column({ nullable: true })
  crm: string;

  @Column({ nullable: true })
  specialty: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Patient, (patient) => patient.doctor)
  patients: Patient[];
}
