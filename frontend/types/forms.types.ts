// Form Data Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  crm: string;
}

export interface PatientFormData {
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
}

export interface PrescriptionFormData {
  diagnosis: string;
  prescription: string;
  observations?: string;
  prescriptionDate: string;
  validUntil?: string;
  patientId: number;
}

export interface MedicineFormData {
  name: string;
  description?: string;
  dosage?: string;
  manufacturer?: string;
  genericName?: string;
  activeIngredient?: string;
  contraindications?: string;
  sideEffects?: string;
  interactions?: string;
}

export interface CidFormData {
  code: string;
  name: string;
  description?: string;
  category?: string;
}

export interface AppointmentFormData {
  title: string;
  description?: string;
  appointmentDate: string;
  duration?: number;
  status?: string;
  type?: string;
  notes?: string;
  patientId: number;
}

// Form State Types
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// Form Field Types
export interface FormFieldProps<T = any> {
  name: string;
  label: string;
  value: T;
  onChange: (value: T) => void;
  onBlur?: () => void;
  error?: string;
  touched?: boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

// Form Validation Types
export interface ValidationRule<T> {
  validate: (value: T) => boolean | string;
  message?: string;
}

export interface FieldValidation<T> {
  required?: boolean | string;
  rules?: ValidationRule<T>[];
}
