import { z } from "zod";

// Schemas de validação para autenticação
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  crm: z.string().min(4, "CRM deve ter pelo menos 4 caracteres"),
});

// Schemas de validação para pacientes
export const patientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  gender: z.enum(["M", "F"]),
  address: z.string().min(10, "Endereço deve ter pelo menos 10 caracteres"),
  allergies: z.string().optional(),
  medicalHistory: z.string().optional(),
  observations: z.string().optional(),
});

export const patientUpdateSchema = patientSchema.partial();

// Schemas de validação para prescrições
export const prescriptionSchema = z.object({
  diagnosis: z.string().min(3, "Diagnóstico deve ter pelo menos 3 caracteres"),
  prescription: z
    .string()
    .min(10, "Prescrição deve ter pelo menos 10 caracteres"),
  observations: z.string().optional(),
  prescriptionDate: z.string().min(1, "Data da prescrição é obrigatória"),
  validUntil: z.string().optional(),
  patientId: z.number().positive("ID do paciente é obrigatório"),
});

export const prescriptionUpdateSchema = prescriptionSchema.partial();

// Schemas de validação para medicamentos
export const medicineSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  dosage: z.string().min(3, "Dosagem deve ter pelo menos 3 caracteres"),
  manufacturer: z
    .string()
    .min(2, "Fabricante deve ter pelo menos 2 caracteres"),
  activeIngredient: z
    .string()
    .min(3, "Princípio ativo deve ter pelo menos 3 caracteres"),
  contraindications: z.string().optional(),
  sideEffects: z.string().optional(),
});

export const medicineUpdateSchema = medicineSchema.partial();

// Schemas de validação para CIDs
export const cidSchema = z.object({
  code: z.string().min(3, "Código deve ter pelo menos 3 caracteres"),
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  category: z.string().optional(),
});

export const cidUpdateSchema = cidSchema.partial();

// Schemas de validação para agendamentos
export const appointmentSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  appointmentDate: z.string().min(1, "Data do agendamento é obrigatória"),
  duration: z
    .number()
    .min(15, "Duração mínima é 15 minutos")
    .max(480, "Duração máxima é 480 minutos")
    .optional(),
  status: z
    .enum(["scheduled", "confirmed", "completed", "cancelled", "no_show"])
    .optional(),
  type: z
    .enum(["consultation", "follow_up", "emergency", "routine"])
    .optional(),
  notes: z.string().optional(),
  patientId: z.number().positive("Paciente é obrigatório"),
});

export const appointmentUpdateSchema = appointmentSchema.partial();

// Tipos TypeScript derivados dos schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type PatientFormData = z.infer<typeof patientSchema>;
export type PatientUpdateData = z.infer<typeof patientUpdateSchema>;
export type PrescriptionFormData = z.infer<typeof prescriptionSchema>;
export type PrescriptionUpdateData = z.infer<typeof prescriptionUpdateSchema>;
export type MedicineFormData = z.infer<typeof medicineSchema>;
export type MedicineUpdateData = z.infer<typeof medicineUpdateSchema>;
export type CidFormData = z.infer<typeof cidSchema>;
export type CidUpdateData = z.infer<typeof cidUpdateSchema>;
export type AppointmentFormData = z.infer<typeof appointmentSchema>;
export type AppointmentUpdateData = z.infer<typeof appointmentUpdateSchema>;
