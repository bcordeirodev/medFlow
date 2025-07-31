# Estrutura de Componentes - MedFlow

Esta pasta contém todos os componentes React organizados por funcionalidade para facilitar a manutenção e escalabilidade do projeto.

## 📁 Estrutura de Pastas

```
components/
├── auth/                    # Componentes de autenticação
│   ├── LoginForm.tsx
│   └── index.ts
├── common/                  # Componentes comuns/reutilizáveis
│   ├── Dashboard.tsx
│   └── index.ts
├── patients/               # Componentes relacionados a pacientes
│   ├── PatientsList.tsx
│   ├── PatientDetails.tsx
│   └── index.ts
├── prescriptions/          # Componentes relacionados a prescrições
│   ├── PrescriptionsList.tsx
│   ├── PrescriptionDetails.tsx
│   ├── NewPrescription.tsx
│   └── index.ts
├── medicines/             # Componentes relacionados a medicamentos
│   ├── MedicinesList.tsx
│   ├── MedicineDetails.tsx
│   └── index.ts
├── ui/                    # Componentes de interface reutilizáveis
│   ├── RichTextEditor.tsx
│   └── index.ts
├── index.ts               # Exportações principais
└── README.md             # Esta documentação
```

## 🎯 Organização por Funcionalidade

### **Auth** (`/auth`)
Componentes relacionados à autenticação e login.
- `LoginForm`: Formulário de login com validação

### **Common** (`/common`)
Componentes comuns e reutilizáveis em toda a aplicação.
- `Dashboard`: Layout principal da aplicação com navegação

### **Patients** (`/patients`)
Componentes específicos para gestão de pacientes.
- `PatientsList`: Lista de pacientes com busca e filtros
- `PatientDetails`: Modal de detalhes/edição de paciente

### **Prescriptions** (`/prescriptions`)
Componentes específicos para gestão de prescrições.
- `PrescriptionsList`: Lista de prescrições com busca
- `PrescriptionDetails`: Modal de detalhes/edição de prescrição
- `NewPrescription`: Formulário para criar nova prescrição

### **Medicines** (`/medicines`)
Componentes específicos para gestão de medicamentos.
- `MedicinesList`: Lista de medicamentos com busca
- `MedicineDetails`: Modal de detalhes/edição de medicamento

### **UI** (`/ui`)
Componentes de interface reutilizáveis.
- `RichTextEditor`: Editor de texto rico para prescrições

## 📦 Importações

### Importação Individual
```typescript
import { LoginForm } from '@/components/auth';
import { Dashboard } from '@/components/common';
import { PatientsList } from '@/components/patients';
```

### Importação Múltipla
```typescript
import { 
  PatientsList, 
  PatientDetails 
} from '@/components/patients';
```

### Importação Geral
```typescript
import { 
  LoginForm, 
  Dashboard, 
  PatientsList 
} from '@/components';
```

## 🔧 Convenções

1. **Nomenclatura**: PascalCase para componentes, camelCase para arquivos
2. **Estrutura**: Cada pasta tem seu próprio `index.ts` para exportações
3. **Organização**: Componentes relacionados ficam na mesma pasta
4. **Reutilização**: Componentes genéricos ficam em `/ui`
5. **Especificidade**: Componentes específicos ficam em suas respectivas pastas

## 🚀 Benefícios da Nova Estrutura

- **Escalabilidade**: Fácil adição de novos componentes
- **Manutenibilidade**: Organização clara por funcionalidade
- **Reutilização**: Componentes UI podem ser usados em qualquer lugar
- **Importações Limpas**: Estrutura de importação simplificada
- **Documentação**: Cada pasta tem propósito específico 