// Base Entity Interface
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// User/Doctor Entity
export interface User extends BaseEntity {
  name: string;
  email: string;
  crm: string;
  isActive: boolean;
  role?: "DOCTOR" | "ADMIN";
}

// Patient Entity
export interface Patient extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  gender: "Masculino" | "Feminino" | "Outro";
  address: string;
  allergies?: string;
  medicalHistory?: string;
  observations?: string;
  doctorId: number;
  isActive: boolean;
  doctor?: User;
}

// Prescription Entity
export interface Prescription extends BaseEntity {
  diagnosis: string;
  prescription: string;
  observations?: string;
  prescriptionDate: string;
  validUntil?: string;
  doctorId: number;
  patientId: number;
  isActive: boolean;
  doctor?: User;
  patient?: Patient;
}

// Medicine Entity
export interface Medicine extends BaseEntity {
  name: string;
  description: string;
  dosage: string;
  manufacturer: string;
  genericName?: string;
  activeIngredient?: string;
  contraindications?: string;
  sideEffects?: string;
  interactions?: string;
  isActive: boolean;
}

// CID Entity
export interface Cid extends BaseEntity {
  code: string;
  name: string;
  description?: string;
  category?: string;
  isActive: boolean;
  medicines?: Medicine[];
}

// Appointment Enums
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

// Appointment Entity
export interface Appointment extends BaseEntity {
  title: string;
  description?: string;
  appointmentDate: string;
  duration: number;
  status: AppointmentStatus;
  type: AppointmentType;
  notes?: string;
  googleEventId?: string;
  googleMeetLink?: string;
  patientId: number;
  doctorId: number;
  isActive: boolean;
  patient?: Patient;
  doctor?: User;
}

// Audit Log Entity
export interface AuditLog extends BaseEntity {
  action: "CREATE" | "UPDATE" | "DELETE" | "VIEW";
  entityType: "USER" | "PATIENT" | "PRESCRIPTION" | "MEDICINE" | "CID";
  entityId: number;
  userId: number;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}
