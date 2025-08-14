import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../users/user.entity";
import { Patient } from "../patients/patient.entity";

export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
}

export enum AppointmentType {
  CONSULTATION = "consultation",
  FOLLOW_UP = "follow_up",
  EMERGENCY = "emergency",
  ROUTINE = "routine",
}

export enum MeetingLinkType {
  GOOGLE_MEET = "google_meet",
  CUSTOM_URL = "custom_url",
  EXTERNAL_PLATFORM = "external_platform",
}

@Entity("appointments")
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "timestamp" })
  appointmentDate: Date;

  @Column({ type: "int", default: 30 })
  duration: number; // em minutos

  @Column({
    type: "enum",
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @Column({
    type: "enum",
    enum: AppointmentType,
    default: AppointmentType.CONSULTATION,
  })
  type: AppointmentType;

  @Column({ type: "text", nullable: true })
  notes: string;

  // Meeting/Reunion fields
  @Column({ nullable: true })
  googleEventId: string;

  @Column({ nullable: true })
  googleMeetLink: string;

  @Column({
    type: "enum",
    enum: MeetingLinkType,
    default: MeetingLinkType.GOOGLE_MEET,
  })
  meetingLinkType: MeetingLinkType;

  @Column({ nullable: true })
  customMeetingUrl: string;

  // Relacionamento com Patient
  @ManyToOne(() => Patient, { onDelete: "CASCADE" })
  @JoinColumn({ name: "patientId" })
  patient: Patient;

  @Column()
  patientId: number;

  // Relacionamento com Doctor (User)
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "doctorId" })
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
