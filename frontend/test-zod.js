// Teste simples para validar os schemas Zod
const { loginSchema, patientSchema } = require('./lib/schemas.ts');

// Teste de validação de login
const testLoginData = {
  email: 'test@example.com',
  password: '123456'
};

try {
  const validated = loginSchema.parse(testLoginData);
  console.log('✅ Login validation passed:', validated);
} catch (error) {
  console.log('❌ Login validation failed:', error.errors);
}

// Teste de validação de paciente
const testPatientData = {
  name: 'João Silva',
  email: 'joao@example.com',
  phone: '11999999999',
  cpf: '12345678901',
  birthDate: '1990-01-01',
  gender: 'M',
  address: 'Rua das Flores, 123 - São Paulo, SP'
};

try {
  const validated = patientSchema.parse(testPatientData);
  console.log('✅ Patient validation passed:', validated);
} catch (error) {
  console.log('❌ Patient validation failed:', error.errors);
} 