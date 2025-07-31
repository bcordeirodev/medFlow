// Script de teste para verificar o módulo de prescrições
const axios = require('axios');

const API_BASE = 'http://localhost:3001';
let token = '';

async function testModule() {
  console.log('🧪 Testando Módulo de Prescrições...\n');

  try {
    // 1. Testar login
    console.log('1. Testando login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'dr.silva@medflow.com',
      password: '123456'
    });
    token = loginResponse.data.access_token;
    console.log('✅ Login realizado com sucesso');
    console.log(`   Usuário: ${loginResponse.data.user.name}`);

    // 2. Testar busca de pacientes
    console.log('\n2. Testando busca de pacientes...');
    const patientsResponse = await axios.get(`${API_BASE}/patients`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ ${patientsResponse.data.length} pacientes encontrados`);
    patientsResponse.data.forEach(patient => {
      console.log(`   - ${patient.name} (${patient.email})`);
    });

    // 3. Testar busca de medicamentos
    console.log('\n3. Testando busca de medicamentos...');
    const medicinesResponse = await axios.get(`${API_BASE}/medicines`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ ${medicinesResponse.data.length} medicamentos encontrados`);
    medicinesResponse.data.forEach(medicine => {
      console.log(`   - ${medicine.name} ${medicine.dosage} (${medicine.manufacturer})`);
    });

    // 4. Testar busca de medicamentos por termo
    console.log('\n4. Testando busca de medicamentos por termo...');
    const searchResponse = await axios.get(`${API_BASE}/medicines/search?q=dipirona`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ ${searchResponse.data.length} medicamentos encontrados na busca`);
    searchResponse.data.forEach(medicine => {
      console.log(`   - ${medicine.name} ${medicine.dosage}`);
    });

    // 5. Testar criação de prescrição
    console.log('\n5. Testando criação de prescrição...');
    const prescriptionData = {
      patientId: patientsResponse.data[0].id,
      diagnosis: 'Dor de cabeça leve',
      prescription: 'Dipirona 500mg - 1 comprimido a cada 6 horas por via oral',
      observations: 'Tomar com alimentação',
      prescriptionDate: new Date().toISOString().split('T')[0]
    };

    const prescriptionResponse = await axios.post(`${API_BASE}/prescriptions`, prescriptionData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Prescrição criada com sucesso');
    console.log(`   ID: ${prescriptionResponse.data.id}`);
    console.log(`   Paciente: ${prescriptionResponse.data.patient?.name}`);

    // 6. Testar busca de prescrições
    console.log('\n6. Testando busca de prescrições...');
    const prescriptionsResponse = await axios.get(`${API_BASE}/prescriptions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ ${prescriptionsResponse.data.length} prescrições encontradas`);

    console.log('\n🎉 Todos os testes passaram! O módulo está funcionando corretamente.');
    console.log('\n📋 Resumo:');
    console.log(`   - Pacientes: ${patientsResponse.data.length}`);
    console.log(`   - Medicamentos: ${medicinesResponse.data.length}`);
    console.log(`   - Prescrições: ${prescriptionsResponse.data.length}`);

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

testModule(); 