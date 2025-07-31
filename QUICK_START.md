# 🚀 Início Rápido - MedFlow

## Setup em 3 Passos

### 1. Clone e Setup
```bash
git clone <url-do-repositorio>
cd medFlow
chmod +x setup.sh
./setup.sh
```

### 2. Execute o Seed
```bash
cd backend
npm run seed
```

### 3. Inicie as Aplicações
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🌐 Acesse
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

## 🔑 Credenciais de Teste
- **Email**: carlos.silva@medflow.com
- **Senha**: password123

## 📋 O que está incluído
- ✅ 2 médicos de exemplo
- ✅ 22 medicamentos ortopédicos
- ✅ 28 CIDs (Classificação de Doenças)
- ✅ 15 pacientes de exemplo
- ✅ 25 prescrições de exemplo

## 🐛 Problemas Comuns

### Erro de Conexão com PostgreSQL
```bash
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password';"
```

### Porta já em uso
```bash
lsof -i :3000
lsof -i :3001
kill -9 <PID>
```

### Erro de autenticação
```bash
cd backend
npm run seed
```

## 📚 Próximos Passos
1. Explore a interface
2. Teste as funcionalidades
3. Adicione seus próprios dados
4. Contribua com o projeto!

---

**Divirta-se usando o MedFlow! 🎉** 