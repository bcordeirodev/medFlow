import { Medicine } from '../medicines/medicine.entity';
import { Cid } from '../cids/cid.entity';
import { Patient } from '../patients/patient.entity';
import { Prescription } from '../prescriptions/prescription.entity';
import { User, UserRole } from '../users/user.entity';

// Medicamentos ortopédicos principais
export const orthopedicMedicines: Partial<Medicine>[] = [
    // Anti-inflamatórios
    {
        name: 'Diclofenaco Sódico',
        description: 'Anti-inflamatório não esteroidal (AINE) para dor e inflamação',
        dosage: '50mg',
        manufacturer: 'EMS',
        genericName: 'Diclofenaco Sódico',
        contraindications: 'Úlcera péptica, insuficiência renal, gravidez',
        sideEffects: 'Náuseas, dor abdominal, cefaleia, tontura',
    },
    {
        name: 'Ibuprofeno',
        description: 'Anti-inflamatório não esteroidal para dor e febre',
        dosage: '600mg',
        manufacturer: 'Neo Química',
        genericName: 'Ibuprofeno',
        contraindications: 'Úlcera péptica, insuficiência hepática',
        sideEffects: 'Náuseas, azia, dor abdominal',
    },
    {
        name: 'Cetoprofeno',
        description: 'Anti-inflamatório não esteroidal para dor aguda',
        dosage: '100mg',
        manufacturer: 'Aché',
        genericName: 'Cetoprofeno',
        contraindications: 'Úlcera péptica, insuficiência renal',
        sideEffects: 'Náuseas, vômitos, dor abdominal',
    },
    {
        name: 'Naproxeno',
        description: 'Anti-inflamatório não esteroidal de longa duração',
        dosage: '500mg',
        manufacturer: 'Bayer',
        genericName: 'Naproxeno Sódico',
        contraindications: 'Úlcera péptica, insuficiência renal',
        sideEffects: 'Náuseas, azia, sonolência',
    },

    // Analgésicos
    {
        name: 'Dipirona',
        description: 'Analgésico e antitérmico para dor moderada',
        dosage: '500mg',
        manufacturer: 'Sanofi',
        genericName: 'Dipirona Monoidratada',
        contraindications: 'Alergia a dipirona, porfiria',
        sideEffects: 'Náuseas, vômitos, reações alérgicas',
    },
    {
        name: 'Paracetamol',
        description: 'Analgésico e antitérmico para dor leve a moderada',
        dosage: '750mg',
        manufacturer: 'Neo Química',
        genericName: 'Paracetamol',
        contraindications: 'Insuficiência hepática, alcoolismo',
        sideEffects: 'Náuseas, vômitos, reações alérgicas',
    },
    {
        name: 'Tramadol',
        description: 'Analgésico opioide para dor moderada a intensa',
        dosage: '50mg',
        manufacturer: 'Cristália',
        genericName: 'Tramadol Cloridrato',
        contraindications: 'Insuficiência respiratória, epilepsia',
        sideEffects: 'Náuseas, vômitos, sonolência, tontura',
    },

    // Relaxantes musculares
    {
        name: 'Ciclobenzaprina',
        description: 'Relaxante muscular para espasmos musculares',
        dosage: '10mg',
        manufacturer: 'EMS',
        genericName: 'Ciclobenzaprina Cloridrato',
        contraindications: 'Glaucoma, hipertrofia prostática',
        sideEffects: 'Sonolência, boca seca, tontura',
    },
    {
        name: 'Carisoprodol',
        description: 'Relaxante muscular para dor muscular aguda',
        dosage: '350mg',
        manufacturer: 'Aché',
        genericName: 'Carisoprodol',
        contraindications: 'Porfiria, insuficiência renal',
        sideEffects: 'Sonolência, tontura, náuseas',
    },
    {
        name: 'Metocarbamol',
        description: 'Relaxante muscular para espasmos musculares',
        dosage: '500mg',
        manufacturer: 'Neo Química',
        genericName: 'Metocarbamol',
        contraindications: 'Insuficiência renal, epilepsia',
        sideEffects: 'Sonolência, náuseas, tontura',
    },

    // Corticoides
    {
        name: 'Prednisona',
        description: 'Corticosteroide para inflamação e dor',
        dosage: '20mg',
        manufacturer: 'Aché',
        genericName: 'Prednisona',
        contraindications: 'Infecções fúngicas, tuberculose',
        sideEffects: 'Aumento de peso, hipertensão, diabetes',
    },
    {
        name: 'Dexametasona',
        description: 'Corticosteroide anti-inflamatório',
        dosage: '4mg',
        manufacturer: 'EMS',
        genericName: 'Dexametasona',
        contraindications: 'Infecções sistêmicas, úlcera péptica',
        sideEffects: 'Aumento de peso, hipertensão, insônia',
    },

    // Suplementos
    {
        name: 'Vitamina D3',
        description: 'Suplemento para saúde óssea',
        dosage: '1000UI',
        manufacturer: 'Aché',
        genericName: 'Colecalciferol',
        contraindications: 'Hipercalcemia, hipervitaminose D',
        sideEffects: 'Náuseas, vômitos, constipação',
    },
    {
        name: 'Cálcio + Vitamina D',
        description: 'Suplemento para fortalecimento ósseo',
        dosage: '500mg + 400UI',
        manufacturer: 'Neo Química',
        genericName: 'Carbonato de Cálcio + Colecalciferol',
        contraindications: 'Hipercalcemia, hipercalciúria',
        sideEffects: 'Constipação, náuseas, flatulência',
    },
    {
        name: 'Glucosamina + Condroitina',
        description: 'Suplemento para saúde articular',
        dosage: '1500mg + 1200mg',
        manufacturer: 'Sanofi',
        genericName: 'Sulfato de Glucosamina + Sulfato de Condroitina',
        contraindications: 'Alergia a crustáceos, diabetes',
        sideEffects: 'Náuseas, azia, diarreia',
    },

    // Medicamentos específicos para fraturas
    {
        name: 'Alendronato',
        description: 'Bisfosfonato para tratamento da osteoporose',
        dosage: '70mg',
        manufacturer: 'Merck',
        genericName: 'Alendronato Sódico',
        contraindications: 'Hipocalcemia, estenose esofágica',
        sideEffects: 'Náuseas, azia, dor abdominal',
    },
    {
        name: 'Risedronato',
        description: 'Bisfosfonato para prevenção de fraturas',
        dosage: '35mg',
        manufacturer: 'Sanofi',
        genericName: 'Risedronato Sódico',
        contraindications: 'Hipocalcemia, insuficiência renal',
        sideEffects: 'Náuseas, azia, dor abdominal',
    },

    // Medicamentos para dor neuropática
    {
        name: 'Amitriptilina',
        description: 'Antidepressivo tricíclico para dor crônica',
        dosage: '25mg',
        manufacturer: 'EMS',
        genericName: 'Amitriptilina Cloridrato',
        contraindications: 'Glaucoma, hipertrofia prostática',
        sideEffects: 'Sonolência, boca seca, tontura',
    },
    {
        name: 'Gabapentina',
        description: 'Anticonvulsivante para dor neuropática',
        dosage: '300mg',
        manufacturer: 'Neo Química',
        genericName: 'Gabapentina',
        contraindications: 'Insuficiência renal, epilepsia',
        sideEffects: 'Sonolência, tontura, edema',
    },
    {
        name: 'Pregabalina',
        description: 'Anticonvulsivante para dor neuropática',
        dosage: '75mg',
        manufacturer: 'Pfizer',
        genericName: 'Pregabalina',
        contraindications: 'Insuficiência renal, edema',
        sideEffects: 'Sonolência, tontura, ganho de peso',
    },

    // Medicamentos para artrite
    {
        name: 'Metotrexato',
        description: 'Imunossupressor para artrite reumatoide',
        dosage: '10mg',
        manufacturer: 'Aché',
        genericName: 'Metotrexato',
        contraindications: 'Gravidez, insuficiência renal',
        sideEffects: 'Náuseas, vômitos, supressão medular',
    },
    {
        name: 'Sulfassalazina',
        description: 'Anti-inflamatório para artrite reumatoide',
        dosage: '500mg',
        manufacturer: 'EMS',
        genericName: 'Sulfassalazina',
        contraindications: 'Alergia a sulfas, porfiria',
        sideEffects: 'Náuseas, vômitos, fotossensibilidade',
    },
];

// CIDs ortopédicos principais
export const orthopedicCids: Partial<Cid>[] = [
    // Fraturas
    {
        code: 'S72.0',
        name: 'Fratura do colo do fêmur',
        description: 'Fratura da extremidade proximal do fêmur, incluindo fratura do colo femoral',
        category: 'Fraturas do Fêmur',
    },
    {
        code: 'S72.1',
        name: 'Fratura pertrocantérica',
        description: 'Fratura da região trocantérica do fêmur',
        category: 'Fraturas do Fêmur',
    },
    {
        code: 'S82.0',
        name: 'Fratura da patela',
        description: 'Fratura da rótula',
        category: 'Fraturas da Perna',
    },
    {
        code: 'S82.1',
        name: 'Fratura da extremidade proximal da tíbia',
        description: 'Fratura do platô tibial',
        category: 'Fraturas da Perna',
    },
    {
        code: 'S52.0',
        name: 'Fratura da extremidade proximal do úmero',
        description: 'Fratura da cabeça e colo do úmero',
        category: 'Fraturas do Antebraço',
    },
    {
        code: 'S42.0',
        name: 'Fratura da clavícula',
        description: 'Fratura da clavícula',
        category: 'Fraturas do Ombro e Braço',
    },

    // Luxações
    {
        code: 'S73.0',
        name: 'Luxação do quadril',
        description: 'Deslocamento da cabeça femoral da cavidade acetabular',
        category: 'Luxações',
    },
    {
        code: 'S83.0',
        name: 'Luxação da patela',
        description: 'Deslocamento da rótula',
        category: 'Luxações',
    },
    {
        code: 'S43.0',
        name: 'Luxação do ombro',
        description: 'Deslocamento da cabeça umeral da cavidade glenoidal',
        category: 'Luxações',
    },

    // Lesões ligamentares
    {
        code: 'S83.5',
        name: 'Ruptura do ligamento cruzado anterior',
        description: 'Lesão do LCA do joelho',
        category: 'Lesões Ligamentares',
    },
    {
        code: 'S83.6',
        name: 'Ruptura do ligamento cruzado posterior',
        description: 'Lesão do LCP do joelho',
        category: 'Lesões Ligamentares',
    },
    {
        code: 'S93.4',
        name: 'Ruptura do ligamento lateral do tornozelo',
        description: 'Lesão dos ligamentos laterais do tornozelo',
        category: 'Lesões Ligamentares',
    },

    // Artrites e artroses
    {
        code: 'M15.0',
        name: 'Osteoartrose primária generalizada',
        description: 'Artrose generalizada das articulações',
        category: 'Artrites e Artroses',
    },
    {
        code: 'M16.0',
        name: 'Osteoartrose primária do quadril',
        description: 'Artrose da articulação coxofemoral',
        category: 'Artrites e Artroses',
    },
    {
        code: 'M17.0',
        name: 'Osteoartrose primária do joelho',
        description: 'Artrose da articulação do joelho',
        category: 'Artrites e Artroses',
    },
    {
        code: 'M06.0',
        name: 'Artrite reumatoide soronegativa',
        description: 'Artrite reumatoide sem fator reumatoide',
        category: 'Artrites e Artroses',
    },

    // Osteoporose
    {
        code: 'M80.0',
        name: 'Osteoporose pós-menopausa com fratura patológica',
        description: 'Osteoporose com fratura devido à fragilidade óssea',
        category: 'Osteoporose',
    },
    {
        code: 'M81.0',
        name: 'Osteoporose senil',
        description: 'Osteoporose relacionada à idade',
        category: 'Osteoporose',
    },

    // Hérnias de disco
    {
        code: 'M51.1',
        name: 'Hérnia de disco lombar',
        description: 'Protrusão do disco intervertebral lombar',
        category: 'Patologias da Coluna',
    },
    {
        code: 'M50.1',
        name: 'Hérnia de disco cervical',
        description: 'Protrusão do disco intervertebral cervical',
        category: 'Patologias da Coluna',
    },

    // Tendinites
    {
        code: 'M75.1',
        name: 'Tendinite do manguito rotador',
        description: 'Inflamação dos tendões do ombro',
        category: 'Tendinites',
    },
    {
        code: 'M76.6',
        name: 'Tendinite do calcâneo (Aquiles)',
        description: 'Inflamação do tendão de Aquiles',
        category: 'Tendinites',
    },
    {
        code: 'M77.3',
        name: 'Tendinite lateral do cotovelo',
        description: 'Epicondilite lateral (cotovelo de tenista)',
        category: 'Tendinites',
    },

    // Síndromes compressivas
    {
        code: 'G56.0',
        name: 'Síndrome do túnel do carpo',
        description: 'Compressão do nervo mediano no punho',
        category: 'Síndromes Compressivas',
    },
    {
        code: 'G57.1',
        name: 'Síndrome do túnel do tarso',
        description: 'Compressão do nervo tibial posterior',
        category: 'Síndromes Compressivas',
    },

    // Deformidades
    {
        code: 'M21.0',
        name: 'Valgo do joelho',
        description: 'Deformidade em valgo do joelho',
        category: 'Deformidades',
    },
    {
        code: 'M21.1',
        name: 'Varo do joelho',
        description: 'Deformidade em varo do joelho',
        category: 'Deformidades',
    },
    {
        code: 'M21.5',
        name: 'Pé cavo',
        description: 'Deformidade do arco plantar',
        category: 'Deformidades',
    },
];

// Associações CID-Medicamentos
export const cidMedicineAssociations: { cidCode: string; medicineNames: string[] }[] = [
    // Fraturas - Anti-inflamatórios + Analgésicos
    {
        cidCode: 'S72.0',
        medicineNames: ['Diclofenaco Sódico', 'Dipirona', 'Paracetamol', 'Tramadol', 'Vitamina D3', 'Cálcio + Vitamina D'],
    },
    {
        cidCode: 'S72.1',
        medicineNames: ['Diclofenaco Sódico', 'Dipirona', 'Paracetamol', 'Tramadol', 'Vitamina D3', 'Cálcio + Vitamina D'],
    },
    {
        cidCode: 'S82.0',
        medicineNames: ['Diclofenaco Sódico', 'Ibuprofeno', 'Dipirona', 'Paracetamol'],
    },
    {
        cidCode: 'S82.1',
        medicineNames: ['Diclofenaco Sódico', 'Ibuprofeno', 'Dipirona', 'Paracetamol'],
    },
    {
        cidCode: 'S52.0',
        medicineNames: ['Diclofenaco Sódico', 'Ibuprofeno', 'Dipirona', 'Paracetamol'],
    },
    {
        cidCode: 'S42.0',
        medicineNames: ['Diclofenaco Sódico', 'Ibuprofeno', 'Dipirona', 'Paracetamol'],
    },

    // Luxações - Anti-inflamatórios + Relaxantes
    {
        cidCode: 'S73.0',
        medicineNames: ['Diclofenaco Sódico', 'Ibuprofeno', 'Ciclobenzaprina', 'Dipirona'],
    },
    {
        cidCode: 'S83.0',
        medicineNames: ['Diclofenaco Sódico', 'Ibuprofeno', 'Ciclobenzaprina', 'Dipirona'],
    },
    {
        cidCode: 'S43.0',
        medicineNames: ['Diclofenaco Sódico', 'Ibuprofeno', 'Ciclobenzaprina', 'Dipirona'],
    },

    // Lesões ligamentares - Anti-inflamatórios + Relaxantes
    {
        cidCode: 'S83.5',
        medicineNames: ['Diclofenaco Sódico', 'Ibuprofeno', 'Ciclobenzaprina', 'Dipirona'],
    },
    {
        cidCode: 'S83.6',
        medicineNames: ['Diclofenaco Sódico', 'Ibuprofeno', 'Ciclobenzaprina', 'Dipirona'],
    },
    {
        cidCode: 'S93.4',
        medicineNames: ['Diclofenaco Sódico', 'Ibuprofeno', 'Ciclobenzaprina', 'Dipirona'],
    },

    // Artrites e artroses - Anti-inflamatórios + Suplementos
    {
        cidCode: 'M15.0',
        medicineNames: ['Diclofenaco Sódico', 'Ibuprofeno', 'Naproxeno', 'Glucosamina + Condroitina', 'Vitamina D3'],
    },
    {
        cidCode: 'M16.0',
        medicineNames: ['Diclofenaco Sódico', 'Ibuprofeno', 'Naproxeno', 'Glucosamina + Condroitina', 'Vitamina D3'],
    },
    {
        cidCode: 'M17.0',
        medicineNames: ['Diclofenaco Sódico', 'Ibuprofeno', 'Naproxeno', 'Glucosamina + Condroitina', 'Vitamina D3'],
    },
    {
        cidCode: 'M06.0',
        medicineNames: ['Metotrexato', 'Sulfassalazina', 'Prednisona', 'Dexametasona'],
    },

    // Osteoporose - Bisfosfonatos + Suplementos
    {
        cidCode: 'M80.0',
        medicineNames: ['Alendronato', 'Risedronato', 'Vitamina D3', 'Cálcio + Vitamina D'],
    },
    {
        cidCode: 'M81.0',
        medicineNames: ['Alendronato', 'Risedronato', 'Vitamina D3', 'Cálcio + Vitamina D'],
    },

    // Hérnias de disco - Anti-inflamatórios + Relaxantes + Analgésicos
    {
        cidCode: 'M51.1',
        medicineNames: ['Diclofenaco Sódico', 'Ibuprofeno', 'Ciclobenzaprina', 'Tramadol', 'Gabapentina'],
    },
    {
        cidCode: 'M50.1',
        medicineNames: ['Diclofenaco Sódico', 'Ibuprofeno', 'Ciclobenzaprina', 'Tramadol', 'Gabapentina'],
    },

    // Tendinites - Anti-inflamatórios + Relaxantes
    {
        cidCode: 'M75.1',
        medicineNames: ['Diclofenaco Sódico', 'Ibuprofeno', 'Cetoprofeno', 'Ciclobenzaprina'],
    },
    {
        cidCode: 'M76.6',
        medicineNames: ['Diclofenaco Sódico', 'Ibuprofeno', 'Cetoprofeno', 'Ciclobenzaprina'],
    },
    {
        cidCode: 'M77.3',
        medicineNames: ['Diclofenaco Sódico', 'Ibuprofeno', 'Cetoprofeno', 'Ciclobenzaprina'],
    },

    // Síndromes compressivas - Anti-inflamatórios + Analgésicos neuropáticos
    {
        cidCode: 'G56.0',
        medicineNames: ['Diclofenaco Sódico', 'Ibuprofeno', 'Gabapentina', 'Pregabalina'],
    },
    {
        cidCode: 'G57.1',
        medicineNames: ['Diclofenaco Sódico', 'Ibuprofeno', 'Gabapentina', 'Pregabalina'],
    },

    // Deformidades - Anti-inflamatórios + Suplementos
    {
        cidCode: 'M21.0',
        medicineNames: ['Diclofenaco Sódico', 'Ibuprofeno', 'Glucosamina + Condroitina', 'Vitamina D3'],
    },
    {
        cidCode: 'M21.1',
        medicineNames: ['Diclofenaco Sódico', 'Ibuprofeno', 'Glucosamina + Condroitina', 'Vitamina D3'],
    },
    {
        cidCode: 'M21.5',
        medicineNames: ['Diclofenaco Sódico', 'Ibuprofeno', 'Glucosamina + Condroitina', 'Vitamina D3'],
    },
];

// Usuários médicos
export const orthopedicDoctors: Partial<User>[] = [
    {
        name: 'Dr. Carlos Eduardo Silva',
        email: 'carlos.silva@medflow.com',
        password: 'password123',
        role: UserRole.DOCTOR,
        specialty: 'Ortopedia e Traumatologia',
        crm: '12345-SP',
    },
    {
        name: 'Dra. Ana Paula Santos',
        email: 'ana.santos@medflow.com',
        password: 'password123',
        role: UserRole.DOCTOR,
        specialty: 'Ortopedia e Traumatologia',
        crm: '67890-SP',
    },
];

// Pacientes ortopédicos
export const orthopedicPatients: Partial<Patient>[] = [
    // Pacientes com fraturas
    {
        name: 'Maria Silva Santos',
        email: 'maria.silva@email.com',
        phone: '(11) 99999-1111',
        cpf: '123.456.789-00',
        birthDate: new Date('1985-03-15'),
        gender: 'Feminino',
        address: 'Rua das Flores, 123 - São Paulo, SP',
        medicalHistory: 'Hipertensão controlada, diabetes tipo 2',
        allergies: 'Penicilina',
        observations: 'Contato de emergência: João Silva - (11) 99999-2222',
        doctorId: 1, // Será ajustado dinamicamente
    },
    {
        name: 'João Carlos Oliveira',
        email: 'joao.oliveira@email.com',
        phone: '(11) 99999-3333',
        cpf: '234.567.890-11',
        birthDate: new Date('1978-07-22'),
        gender: 'Masculino',
        address: 'Av. Paulista, 456 - São Paulo, SP',
        medicalHistory: 'Hipotireoidismo, osteoporose',
        allergies: 'Nenhuma',
        observations: 'Contato de emergência: Ana Oliveira - (11) 99999-4444',
        doctorId: 1,
    },
    {
        name: 'Ana Paula Ferreira',
        email: 'ana.ferreira@email.com',
        phone: '(11) 99999-5555',
        cpf: '345.678.901-22',
        birthDate: new Date('1992-11-08'),
        gender: 'Feminino',
        address: 'Rua Augusta, 789 - São Paulo, SP',
        medicalHistory: 'Asma leve',
        allergies: 'Dipirona',
        observations: 'Contato de emergência: Carlos Ferreira - (11) 99999-6666',
        doctorId: 1,
    },
    {
        name: 'Pedro Henrique Costa',
        email: 'pedro.costa@email.com',
        phone: '(11) 99999-7777',
        cpf: '456.789.012-33',
        birthDate: new Date('1965-12-03'),
        gender: 'Masculino',
        address: 'Rua Consolação, 321 - São Paulo, SP',
        medicalHistory: 'Diabetes tipo 1, hipertensão',
        allergies: 'Sulfas',
        observations: 'Contato de emergência: Lucia Costa - (11) 99999-8888',
        doctorId: 1,
    },
    {
        name: 'Lucia Maria Rodrigues',
        email: 'lucia.rodrigues@email.com',
        phone: '(11) 99999-9999',
        cpf: '567.890.123-44',
        birthDate: new Date('1955-05-18'),
        gender: 'Feminino',
        address: 'Rua Bela Cintra, 654 - São Paulo, SP',
        medicalHistory: 'Osteoporose, artrite reumatoide',
        allergies: 'Nenhuma',
        observations: 'Contato de emergência: Roberto Rodrigues - (11) 99999-0000',
        doctorId: 1,
    },
    {
        name: 'Carlos Eduardo Lima',
        email: 'carlos.lima@email.com',
        phone: '(11) 88888-1111',
        cpf: '678.901.234-55',
        birthDate: new Date('1988-09-25'),
        gender: 'Masculino',
        address: 'Av. Brigadeiro Faria Lima, 1234 - São Paulo, SP',
        medicalHistory: 'Nenhuma',
        allergies: 'Nenhuma',
        observations: 'Contato de emergência: Fernanda Lima - (11) 88888-2222',
        doctorId: 1,
    },
    {
        name: 'Fernanda Alves Souza',
        email: 'fernanda.souza@email.com',
        phone: '(11) 88888-3333',
        cpf: '789.012.345-66',
        birthDate: new Date('1995-01-30'),
        gender: 'Feminino',
        address: 'Rua Oscar Freire, 567 - São Paulo, SP',
        medicalHistory: 'Ansiedade',
        allergies: 'Nenhuma',
        observations: 'Contato de emergência: Ricardo Souza - (11) 88888-4444',
        doctorId: 1,
    },
    {
        name: 'Roberto Santos Martins',
        email: 'roberto.martins@email.com',
        phone: '(11) 88888-5555',
        cpf: '890.123.456-77',
        birthDate: new Date('1972-04-12'),
        gender: 'Masculino',
        address: 'Rua Haddock Lobo, 890 - São Paulo, SP',
        medicalHistory: 'Hipertensão, colesterol alto',
        allergies: 'Nenhuma',
        observations: 'Contato de emergência: Patricia Martins - (11) 88888-6666',
        doctorId: 1,
    },
    {
        name: 'Patricia Costa Nunes',
        email: 'patricia.nunes@email.com',
        phone: '(11) 88888-7777',
        cpf: '901.234.567-88',
        birthDate: new Date('1980-08-07'),
        gender: 'Feminino',
        address: 'Rua Pamplona, 432 - São Paulo, SP',
        medicalHistory: 'Hipotireoidismo',
        allergies: 'Nenhuma',
        observations: 'Contato de emergência: Marcelo Nunes - (11) 88888-8888',
        doctorId: 1,
    },
    {
        name: 'Marcelo Silva Pereira',
        email: 'marcelo.pereira@email.com',
        phone: '(11) 88888-9999',
        cpf: '012.345.678-99',
        birthDate: new Date('1968-06-14'),
        gender: 'Masculino',
        address: 'Av. Jabaquara, 765 - São Paulo, SP',
        medicalHistory: 'Diabetes tipo 2, hipertensão',
        allergies: 'Penicilina',
        observations: 'Contato de emergência: Cristina Pereira - (11) 88888-0000',
        doctorId: 1,
    },
    {
        name: 'Cristina Oliveira Barbosa',
        email: 'cristina.barbosa@email.com',
        phone: '(11) 77777-1111',
        cpf: '111.222.333-44',
        birthDate: new Date('1990-02-28'),
        gender: 'Feminino',
        address: 'Rua Teodoro Sampaio, 234 - São Paulo, SP',
        medicalHistory: 'Nenhuma',
        allergies: 'Dipirona',
        observations: 'Contato de emergência: Andre Barbosa - (11) 77777-2222',
        doctorId: 1,
    },
    {
        name: 'Andre Luis Ferreira',
        email: 'andre.ferreira@email.com',
        phone: '(11) 77777-3333',
        cpf: '222.333.444-55',
        birthDate: new Date('1983-10-15'),
        gender: 'Masculino',
        address: 'Rua Cardeal Arcoverde, 567 - São Paulo, SP',
        medicalHistory: 'Asma',
        allergies: 'Nenhuma',
        observations: 'Contato de emergência: Juliana Ferreira - (11) 77777-4444',
        doctorId: 1,
    },
    {
        name: 'Juliana Santos Costa',
        email: 'juliana.costa@email.com',
        phone: '(11) 77777-5555',
        cpf: '333.444.555-66',
        birthDate: new Date('1987-12-05'),
        gender: 'Feminino',
        address: 'Rua Harmonia, 890 - São Paulo, SP',
        medicalHistory: 'Ansiedade, depressão',
        allergies: 'Nenhuma',
        observations: 'Contato de emergência: Thiago Costa - (11) 77777-6666',
        doctorId: 1,
    },
    {
        name: 'Thiago Martins Silva',
        email: 'thiago.silva@email.com',
        phone: '(11) 77777-7777',
        cpf: '444.555.666-77',
        birthDate: new Date('1975-03-20'),
        gender: 'Masculino',
        address: 'Rua Fradique Coutinho, 123 - São Paulo, SP',
        medicalHistory: 'Hipertensão',
        allergies: 'Sulfas',
        observations: 'Contato de emergência: Camila Silva - (11) 77777-8888',
        doctorId: 1,
    },
    {
        name: 'Camila Oliveira Lima',
        email: 'camila.lima@email.com',
        phone: '(11) 77777-9999',
        cpf: '555.666.777-88',
        birthDate: new Date('1993-07-11'),
        gender: 'Feminino',
        address: 'Rua Aspicuelta, 456 - São Paulo, SP',
        medicalHistory: 'Nenhuma',
        allergies: 'Nenhuma',
        observations: 'Contato de emergência: Diego Lima - (11) 77777-0000',
        doctorId: 1,
    },
];

// Prescrições ortopédicas
export const orthopedicPrescriptions: Partial<Prescription>[] = [
    // Prescrições para fraturas
    {
        diagnosis: 'Fratura do colo do fêmur (S72.0) - Paciente idoso com osteoporose',
        prescription: 'Diclofenaco Sódico 50mg - 1 comprimido 3x ao dia por 7 dias\nDipirona 500mg - 1 comprimido 4x ao dia por 5 dias\nVitamina D3 1000UI - 1 cápsula ao dia por 30 dias\nCálcio + Vitamina D - 1 comprimido 2x ao dia por 30 dias',
        observations: 'Repouso absoluto por 30 dias. Retorno em 15 dias para controle radiográfico. Fisioterapia após consolidação.',
        prescriptionDate: new Date('2024-01-15'),
        validUntil: new Date('2024-02-15'),
        doctorId: 1,
        patientId: 1,
    },
    {
        diagnosis: 'Fratura pertrocantérica (S72.1) - Trauma de alta energia',
        prescription: 'Ibuprofeno 600mg - 1 comprimido 3x ao dia por 10 dias\nTramadol 50mg - 1 comprimido 2x ao dia por 5 dias\nCiclobenzaprina 10mg - 1 comprimido 2x ao dia por 7 dias',
        observations: 'Cirurgia programada para próxima semana. Manter imobilização. Controle da dor rigoroso.',
        prescriptionDate: new Date('2024-01-20'),
        validUntil: new Date('2024-02-20'),
        doctorId: 1,
        patientId: 2,
    },
    {
        diagnosis: 'Fratura da patela (S82.0) - Trauma direto',
        prescription: 'Diclofenaco Sódico 50mg - 1 comprimido 2x ao dia por 7 dias\nParacetamol 750mg - 1 comprimido 4x ao dia por 5 dias',
        observations: 'Imobilização com gesso por 6 semanas. Fisioterapia após remoção do gesso.',
        prescriptionDate: new Date('2024-01-25'),
        validUntil: new Date('2024-02-25'),
        doctorId: 1,
        patientId: 3,
    },
    {
        diagnosis: 'Fratura do platô tibial (S82.1) - Acidente automobilístico',
        prescription: 'Diclofenaco Sódico 50mg - 1 comprimido 3x ao dia por 10 dias\nDipirona 500mg - 1 comprimido 4x ao dia por 7 dias\nCiclobenzaprina 10mg - 1 comprimido 2x ao dia por 10 dias',
        observations: 'Cirurgia de fixação interna realizada. Controle radiográfico em 30 dias.',
        prescriptionDate: new Date('2024-02-01'),
        validUntil: new Date('2024-03-01'),
        doctorId: 1,
        patientId: 4,
    },
    {
        diagnosis: 'Fratura do úmero proximal (S52.0) - Queda de altura',
        prescription: 'Ibuprofeno 600mg - 1 comprimido 3x ao dia por 7 dias\nParacetamol 750mg - 1 comprimido 4x ao dia por 5 dias',
        observations: 'Imobilização com tipoia por 4 semanas. Fisioterapia após remoção.',
        prescriptionDate: new Date('2024-02-05'),
        validUntil: new Date('2024-03-05'),
        doctorId: 1,
        patientId: 5,
    },
    {
        diagnosis: 'Fratura da clavícula (S42.0) - Trauma esportivo',
        prescription: 'Diclofenaco Sódico 50mg - 1 comprimido 2x ao dia por 7 dias\nDipirona 500mg - 1 comprimido 3x ao dia por 5 dias',
        observations: 'Imobilização com tipoia por 6 semanas. Retorno em 30 dias.',
        prescriptionDate: new Date('2024-02-10'),
        validUntil: new Date('2024-03-10'),
        doctorId: 1,
        patientId: 6,
    },
    {
        diagnosis: 'Luxação do quadril (S73.0) - Trauma de alta energia',
        prescription: 'Diclofenaco Sódico 50mg - 1 comprimido 3x ao dia por 10 dias\nCiclobenzaprina 10mg - 1 comprimido 2x ao dia por 10 dias\nDipirona 500mg - 1 comprimido 4x ao dia por 7 dias',
        observations: 'Redução realizada em emergência. Repouso por 30 dias. Fisioterapia após 30 dias.',
        prescriptionDate: new Date('2024-02-15'),
        validUntil: new Date('2024-03-15'),
        doctorId: 1,
        patientId: 7,
    },
    {
        diagnosis: 'Luxação da patela (S83.0) - Trauma esportivo',
        prescription: 'Ibuprofeno 600mg - 1 comprimido 3x ao dia por 7 dias\nCiclobenzaprina 10mg - 1 comprimido 2x ao dia por 7 dias',
        observations: 'Redução realizada. Imobilização por 3 semanas. Fisioterapia após remoção.',
        prescriptionDate: new Date('2024-02-20'),
        validUntil: new Date('2024-03-20'),
        doctorId: 1,
        patientId: 8,
    },
    {
        diagnosis: 'Luxação do ombro (S43.0) - Trauma esportivo',
        prescription: 'Diclofenaco Sódico 50mg - 1 comprimido 3x ao dia por 10 dias\nCiclobenzaprina 10mg - 1 comprimido 2x ao dia por 10 dias\nDipirona 500mg - 1 comprimido 4x ao dia por 7 dias',
        observations: 'Redução realizada. Imobilização por 4 semanas. Fisioterapia após remoção.',
        prescriptionDate: new Date('2024-02-25'),
        validUntil: new Date('2024-03-25'),
        doctorId: 1,
        patientId: 9,
    },
    {
        diagnosis: 'Ruptura do LCA (S83.5) - Trauma esportivo',
        prescription: 'Diclofenaco Sódico 50mg - 1 comprimido 3x ao dia por 10 dias\nCiclobenzaprina 10mg - 1 comprimido 2x ao dia por 10 dias\nDipirona 500mg - 1 comprimido 4x ao dia por 7 dias',
        observations: 'Cirurgia programada para próxima semana. Imobilização até cirurgia.',
        prescriptionDate: new Date('2024-03-01'),
        validUntil: new Date('2024-04-01'),
        doctorId: 1,
        patientId: 10,
    },
    {
        diagnosis: 'Ruptura do LCP (S83.6) - Trauma de alta energia',
        prescription: 'Ibuprofeno 600mg - 1 comprimido 3x ao dia por 10 dias\nCiclobenzaprina 10mg - 1 comprimido 2x ao dia por 10 dias',
        observations: 'Cirurgia programada para próxima semana. Imobilização até cirurgia.',
        prescriptionDate: new Date('2024-03-05'),
        validUntil: new Date('2024-04-05'),
        doctorId: 1,
        patientId: 11,
    },
    {
        diagnosis: 'Ruptura ligamentar do tornozelo (S93.4) - Trauma esportivo',
        prescription: 'Diclofenaco Sódico 50mg - 1 comprimido 3x ao dia por 7 dias\nCiclobenzaprina 10mg - 1 comprimido 2x ao dia por 7 dias',
        observations: 'Imobilização por 6 semanas. Fisioterapia após remoção.',
        prescriptionDate: new Date('2024-03-10'),
        validUntil: new Date('2024-04-10'),
        doctorId: 1,
        patientId: 12,
    },
    {
        diagnosis: 'Osteoartrose do joelho (M17.0) - Paciente idoso',
        prescription: 'Diclofenaco Sódico 50mg - 1 comprimido 2x ao dia por 15 dias\nGlucosamina + Condroitina - 1 comprimido 2x ao dia por 90 dias\nVitamina D3 1000UI - 1 cápsula ao dia por 90 dias',
        observations: 'Fisioterapia 3x por semana. Controle de peso. Retorno em 30 dias.',
        prescriptionDate: new Date('2024-03-15'),
        validUntil: new Date('2024-04-15'),
        doctorId: 1,
        patientId: 13,
    },
    {
        diagnosis: 'Artrite reumatoide (M06.0) - Paciente com diagnóstico recente',
        prescription: 'Metotrexato 10mg - 1 comprimido 1x por semana\nSulfassalazina 500mg - 1 comprimido 2x ao dia por 90 dias\nPrednisona 20mg - 1 comprimido ao dia por 7 dias',
        observations: 'Controle laboratorial mensal. Retorno em 30 dias. Fisioterapia 2x por semana.',
        prescriptionDate: new Date('2024-03-20'),
        validUntil: new Date('2024-04-20'),
        doctorId: 1,
        patientId: 14,
    },
    {
        diagnosis: 'Osteoporose com fratura (M80.0) - Paciente pós-menopausa',
        prescription: 'Alendronato 70mg - 1 comprimido 1x por semana\nVitamina D3 1000UI - 1 cápsula ao dia por 90 dias\nCálcio + Vitamina D - 1 comprimido 2x ao dia por 90 dias',
        observations: 'Suplementação de cálcio e vitamina D. Controle densitométrico em 6 meses.',
        prescriptionDate: new Date('2024-03-25'),
        validUntil: new Date('2024-04-25'),
        doctorId: 1,
        patientId: 15,
    },
    {
        diagnosis: 'Hérnia de disco lombar (M51.1) - Paciente com dor radicular',
        prescription: 'Diclofenaco Sódico 50mg - 1 comprimido 3x ao dia por 10 dias\nCiclobenzaprina 10mg - 1 comprimido 2x ao dia por 10 dias\nTramadol 50mg - 1 comprimido 2x ao dia por 7 dias\nGabapentina 300mg - 1 cápsula 3x ao dia por 30 dias',
        observations: 'Repouso relativo por 7 dias. Fisioterapia após melhora da dor. Retorno em 15 dias.',
        prescriptionDate: new Date('2024-04-01'),
        validUntil: new Date('2024-05-01'),
        doctorId: 1,
        patientId: 1,
    },
    {
        diagnosis: 'Hérnia de disco cervical (M50.1) - Paciente com cervicobraquialgia',
        prescription: 'Ibuprofeno 600mg - 1 comprimido 3x ao dia por 10 dias\nCiclobenzaprina 10mg - 1 comprimido 2x ao dia por 10 dias\nTramadol 50mg - 1 comprimido 2x ao dia por 7 dias\nGabapentina 300mg - 1 cápsula 3x ao dia por 30 dias',
        observations: 'Imobilização cervical por 2 semanas. Fisioterapia após remoção.',
        prescriptionDate: new Date('2024-04-05'),
        validUntil: new Date('2024-05-05'),
        doctorId: 1,
        patientId: 2,
    },
    {
        diagnosis: 'Tendinite do manguito rotador (M75.1) - Paciente com dor crônica',
        prescription: 'Diclofenaco Sódico 50mg - 1 comprimido 3x ao dia por 10 dias\nIbuprofeno 600mg - 1 comprimido 3x ao dia por 10 dias\nCiclobenzaprina 10mg - 1 comprimido 2x ao dia por 10 dias',
        observations: 'Fisioterapia 3x por semana. Infiltração programada para próxima semana.',
        prescriptionDate: new Date('2024-04-10'),
        validUntil: new Date('2024-05-10'),
        doctorId: 1,
        patientId: 3,
    },
    {
        diagnosis: 'Tendinite de Aquiles (M76.6) - Paciente corredor',
        prescription: 'Diclofenaco Sódico 50mg - 1 comprimido 3x ao dia por 10 dias\nIbuprofeno 600mg - 1 comprimido 3x ao dia por 10 dias\nCiclobenzaprina 10mg - 1 comprimido 2x ao dia por 10 dias',
        observations: 'Repouso esportivo por 4 semanas. Fisioterapia 2x por semana.',
        prescriptionDate: new Date('2024-04-15'),
        validUntil: new Date('2024-05-15'),
        doctorId: 1,
        patientId: 4,
    },
    {
        diagnosis: 'Epicondilite lateral (M77.3) - Paciente tenista',
        prescription: 'Diclofenaco Sódico 50mg - 1 comprimido 3x ao dia por 10 dias\nIbuprofeno 600mg - 1 comprimido 3x ao dia por 10 dias\nCiclobenzaprina 10mg - 1 comprimido 2x ao dia por 10 dias',
        observations: 'Repouso esportivo por 6 semanas. Fisioterapia 2x por semana.',
        prescriptionDate: new Date('2024-04-20'),
        validUntil: new Date('2024-05-20'),
        doctorId: 1,
        patientId: 5,
    },
    {
        diagnosis: 'Síndrome do túnel do carpo (G56.0) - Paciente com trabalho manual',
        prescription: 'Diclofenaco Sódico 50mg - 1 comprimido 3x ao dia por 10 dias\nIbuprofeno 600mg - 1 comprimido 3x ao dia por 10 dias\nGabapentina 300mg - 1 cápsula 3x ao dia por 30 dias',
        observations: 'Uso de órtese noturna. Fisioterapia 2x por semana. Avaliação para cirurgia.',
        prescriptionDate: new Date('2024-04-25'),
        validUntil: new Date('2024-05-25'),
        doctorId: 1,
        patientId: 6,
    },
    {
        diagnosis: 'Síndrome do túnel do tarso (G57.1) - Paciente com diabetes',
        prescription: 'Diclofenaco Sódico 50mg - 1 comprimido 3x ao dia por 10 dias\nIbuprofeno 600mg - 1 comprimido 3x ao dia por 10 dias\nGabapentina 300mg - 1 cápsula 3x ao dia por 30 dias',
        observations: 'Controle rigoroso do diabetes. Fisioterapia 2x por semana.',
        prescriptionDate: new Date('2024-05-01'),
        validUntil: new Date('2024-06-01'),
        doctorId: 1,
        patientId: 7,
    },
    {
        diagnosis: 'Valgo do joelho (M21.0) - Paciente adolescente',
        prescription: 'Diclofenaco Sódico 50mg - 1 comprimido 2x ao dia por 7 dias\nIbuprofeno 600mg - 1 comprimido 2x ao dia por 7 dias\nGlucosamina + Condroitina - 1 comprimido 2x ao dia por 90 dias',
        observations: 'Fisioterapia 3x por semana. Avaliação para cirurgia corretiva.',
        prescriptionDate: new Date('2024-05-05'),
        validUntil: new Date('2024-05-05'),
        doctorId: 1,
        patientId: 8,
    },
    {
        diagnosis: 'Varo do joelho (M21.1) - Paciente adulto',
        prescription: 'Diclofenaco Sódico 50mg - 1 comprimido 2x ao dia por 7 dias\nIbuprofeno 600mg - 1 comprimido 2x ao dia por 7 dias\nGlucosamina + Condroitina - 1 comprimido 2x ao dia por 90 dias',
        observations: 'Fisioterapia 3x por semana. Avaliação para cirurgia corretiva.',
        prescriptionDate: new Date('2024-05-10'),
        validUntil: new Date('2024-06-10'),
        doctorId: 1,
        patientId: 9,
    },
    {
        diagnosis: 'Pé cavo (M21.5) - Paciente com dor crônica',
        prescription: 'Diclofenaco Sódico 50mg - 1 comprimido 2x ao dia por 7 dias\nIbuprofeno 600mg - 1 comprimido 2x ao dia por 7 dias\nGlucosamina + Condroitina - 1 comprimido 2x ao dia por 90 dias',
        observations: 'Uso de palmilhas ortopédicas. Fisioterapia 2x por semana.',
        prescriptionDate: new Date('2024-05-15'),
        validUntil: new Date('2024-06-15'),
        doctorId: 1,
        patientId: 10,
    },
];