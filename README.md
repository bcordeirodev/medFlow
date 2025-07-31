# MedFlow - Sistema de Gestão Médica

Uma plataforma completa para otimizar o tempo do médico durante atendimentos, automatizar documentos clínicos e permitir gerenciamento digital das informações do paciente de forma ágil e segura.

## 🎯 Visão Geral

O MedFlow é um sistema web moderno desenvolvido para médicos e clínicas, oferecendo uma solução completa para gestão de pacientes, prescrições médicas e documentação clínica. O sistema foi projetado com foco em usabilidade, segurança e eficiência.

## 🚀 Tecnologias

### Backend
- **NestJS** - Framework Node.js para APIs robustas e escaláveis
- **TypeORM** - ORM para banco de dados com suporte a migrations
- **PostgreSQL** - Banco de dados relacional robusto
- **JWT** - Autenticação segura com tokens
- **Passport** - Estratégias de autenticação flexíveis
- **bcryptjs** - Criptografia de senhas
- **TypeScript** - Tipagem estática para maior confiabilidade

### Frontend
- **Next.js 19** - Framework React com App Router
- **TypeScript** - Tipagem estática para desenvolvimento seguro
- **Material-UI (MUI)** - Componentes React modernos
- **React Query (SWR)** - Gerenciamento de estado e cache
- **Axios** - Cliente HTTP para APIs
- **Day.js** - Manipulação de datas eficiente
- **React Hook Form** - Formulários performáticos

## 📋 Funcionalidades

### ✅ Implementadas
- [x] **Autenticação JWT** - Sistema seguro de login/logout
- [x] **CRUD de Usuários** - Gestão de médicos e permissões
- [x] **CRUD de Pacientes** - Cadastro completo de pacientes
- [x] **CRUD de Medicamentos** - Base de dados de medicamentos
- [x] **CRUD de Prescrições** - Receitas médicas digitais
- [x] **CRUD de CIDs** - Classificação Internacional de Doenças
- [x] **Interface Moderna** - Material-UI com design responsivo
- [x] **Busca e Filtros** - Sistema avançado de busca
- [x] **Dashboard Interativo** - Visão geral dos dados
- [x] **Design Responsivo** - Funciona em desktop e mobile
- [x] **Validação de Dados** - Formulários com validação
- [x] **Relacionamentos** - Associações entre entidades
- [x] **Seed de Dados** - Dados de exemplo para teste

### 🚧 Em Desenvolvimento
- [ ] Modelos de receitas customizáveis
- [ ] Assinatura digital (ICP-Brasil)
- [ ] Encaminhamentos e exames
- [ ] Atestados médicos
- [ ] Histórico completo do paciente
- [ ] Exportação para PDF
- [ ] Notificações por email/WhatsApp
- [ ] Backup automático
- [ ] Relatórios e analytics

## 🛠️ Instalação

### Pré-requisitos
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 12+ ([Download](https://www.postgresql.org/download/))
- **npm** ou **yarn**

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd medFlow
```

### 2. Execute o script de setup
```bash
chmod +x setup.sh
./setup.sh
```

O script irá:
- Criar arquivo `.env` com configurações padrão
- Instalar dependências do backend e frontend
- Criar banco de dados PostgreSQL
- Configurar variáveis de ambiente

### 3. Configure o banco de dados (Manual)

Se preferir configurar manualmente:

```bash
# Crie um banco PostgreSQL
createdb medflow

# Configure a senha do usuário postgres (se necessário)
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password';"
```

### 4. Configure as variáveis de ambiente

O arquivo `.env` será criado automaticamente, mas você pode personalizar:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=medflow

# JWT
JWT_SECRET=sua_chave_secreta_muito_segura

# Environment
NODE_ENV=development
```

### 5. Execute o seed de dados
```bash
cd backend
npm run seed
```

Isso irá inserir dados de exemplo:
- 2 médicos (carlos.silva@medflow.com / password123)
- 22 medicamentos ortopédicos
- 28 CIDs (Classificação Internacional de Doenças)
- 15 pacientes de exemplo
- 25 prescrições de exemplo

## 🚀 Executando o projeto

### Backend
```bash
cd backend
npm run start:dev
```

O backend estará disponível em: **http://localhost:3001**

### Frontend
```bash
cd frontend
npm run dev
```

O frontend estará disponível em: **http://localhost:3000**

### Credenciais de Teste
- **Email**: carlos.silva@medflow.com
- **Senha**: password123

## 📁 Estrutura do Projeto

```
medFlow/
├── backend/                    # API NestJS
│   ├── src/
│   │   ├── auth/              # Autenticação JWT
│   │   │   ├── guards/        # Guards de autenticação
│   │   │   ├── dto/           # Data Transfer Objects
│   │   │   └── auth.service.ts
│   │   ├── users/             # Gestão de usuários
│   │   ├── patients/          # Gestão de pacientes
│   │   ├── medicines/         # Gestão de medicamentos
│   │   ├── prescriptions/     # Gestão de prescrições
│   │   ├── cids/              # Classificação de doenças
│   │   ├── seed/              # Dados de exemplo
│   │   └── main.ts            # Ponto de entrada
│   ├── package.json
│   └── .env                   # Variáveis de ambiente
├── frontend/                   # Aplicação Next.js 19
│   ├── app/                   # Páginas (App Router)
│   ├── components/            # Componentes React
│   │   ├── auth/              # Componentes de autenticação
│   │   ├── patients/          # Componentes de pacientes
│   │   ├── medicines/         # Componentes de medicamentos
│   │   ├── prescriptions/     # Componentes de prescrições
│   │   └── common/            # Componentes comuns
│   ├── contexts/              # Contextos React
│   ├── hooks/                 # Custom hooks
│   ├── services/              # Serviços de API
│   ├── lib/                   # Utilitários
│   └── package.json
├── setup.sh                   # Script de configuração
└── README.md
```

## 🗄️ Modelo de Dados

### Entidades Principais

#### User (Usuário/Médico)
- `id`: Identificador único
- `name`: Nome completo
- `email`: Email único
- `password`: Senha hasheada
- `role`: Papel (admin, doctor, assistant)
- `crm`: Registro profissional
- `specialty`: Especialidade médica

#### Patient (Paciente)
- `id`: Identificador único
- `name`: Nome completo
- `email`: Email de contato
- `phone`: Telefone
- `cpf`: CPF único
- `birthDate`: Data de nascimento
- `gender`: Gênero
- `address`: Endereço
- `allergies`: Alergias
- `medicalHistory`: Histórico médico
- `doctorId`: Relação com médico

#### Medicine (Medicamento)
- `id`: Identificador único
- `name`: Nome do medicamento
- `description`: Descrição
- `dosage`: Dosagem
- `manufacturer`: Fabricante
- `genericName`: Nome genérico
- `contraindications`: Contraindicações
- `sideEffects`: Efeitos colaterais

#### Prescription (Prescrição)
- `id`: Identificador único
- `diagnosis`: Diagnóstico
- `prescription`: Prescrição médica
- `observations`: Observações
- `prescriptionDate`: Data da prescrição
- `validUntil`: Validade
- `doctorId`: Médico responsável
- `patientId`: Paciente

#### CID (Classificação Internacional de Doenças)
- `id`: Identificador único
- `code`: Código CID
- `name`: Nome da doença
- `description`: Descrição
- `category`: Categoria

## 🔐 Autenticação e Segurança

### JWT (JSON Web Tokens)
- **Login**: `POST /auth/login`
- **Registro**: `POST /auth/register`
- **Proteção**: Todas as rotas (exceto auth) requerem token JWT

### Validações Implementadas
- ✅ Verificação de usuário autenticado
- ✅ Validação de `doctorId` obrigatório
- ✅ Relacionamentos com integridade referencial
- ✅ Senhas hasheadas com bcrypt
- ✅ Tokens JWT com expiração

## 📊 Endpoints da API

### Autenticação
```
POST /auth/login          # Login de usuário
POST /auth/register       # Registro de usuário
```

### Usuários
```
GET    /users             # Listar usuários
GET    /users/:id         # Buscar usuário
PATCH  /users/:id         # Atualizar usuário
DELETE /users/:id         # Deletar usuário
```

### Pacientes
```
GET    /patients          # Listar pacientes do médico
POST   /patients          # Criar paciente
GET    /patients/:id      # Buscar paciente
PATCH  /patients/:id      # Atualizar paciente
DELETE /patients/:id      # Deletar paciente
```

### Medicamentos
```
GET    /medicines         # Listar medicamentos
POST   /medicines         # Criar medicamento
GET    /medicines/:id     # Buscar medicamento
PATCH  /medicines/:id     # Atualizar medicamento
DELETE /medicines/:id     # Deletar medicamento
```

### Prescrições
```
GET    /prescriptions     # Listar prescrições do médico
POST   /prescriptions     # Criar prescrição
GET    /prescriptions/:id # Buscar prescrição
PATCH  /prescriptions/:id # Atualizar prescrição
DELETE /prescriptions/:id # Deletar prescrição
```

### CIDs
```
GET    /cids              # Listar CIDs
POST   /cids              # Criar CID
GET    /cids/:id          # Buscar CID
PATCH  /cids/:id          # Atualizar CID
DELETE /cids/:id          # Deletar CID
```

## 🎨 Interface e UX

### Material-UI (MUI)
- **Design System** completo com temas customizáveis
- **Componentes** otimizados para acessibilidade
- **Responsividade** nativa para todos os dispositivos
- **Ícones** do Material Design
- **Tipografia** consistente e legível
- **Cores** e espaçamentos padronizados

### Funcionalidades da Interface
- ✅ Dashboard interativo com estatísticas
- ✅ Formulários com validação em tempo real
- ✅ Modais para criação/edição
- ✅ Busca e filtros avançados
- ✅ Paginação de resultados
- ✅ Notificações de sucesso/erro
- ✅ Loading states
- ✅ Design responsivo

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro de Conexão com PostgreSQL
```bash
# Verificar se o PostgreSQL está rodando
sudo systemctl status postgresql

# Configurar senha do usuário postgres
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password';"
```

#### 2. Erro de Violação de Chave Estrangeira
- Verificar se o usuário está autenticado
- Verificar se o `doctorId` está sendo passado corretamente
- Executar o seed de dados: `npm run seed`

#### 3. Erro de Autenticação
- Verificar se as senhas estão hasheadas
- Executar o seed novamente: `npm run seed`
- Verificar as credenciais de teste

#### 4. Porta já em uso
```bash
# Verificar processos nas portas
lsof -i :3000
lsof -i :3001

# Matar processo se necessário
kill -9 <PID>
```

### Logs Úteis
```bash
# Backend logs
cd backend && npm run start:dev

# Frontend logs
cd frontend && npm run dev

# Verificar banco de dados
psql -h localhost -U postgres -d medflow
```

## 🧪 Testes

### Executar Seed de Dados
```bash
cd backend
npm run seed
```

### Testar API
```bash
# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"carlos.silva@medflow.com","password":"password123"}'

# Criar paciente (com token JWT)
curl -X POST http://localhost:3001/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu_token>" \
  -d '{"name":"Teste","email":"teste@email.com","phone":"(11) 99999-9999","cpf":"123.456.789-00","birthDate":"1990-01-01","gender":"Masculino"}'
```

## 🚀 Deploy

### Produção
1. Configure variáveis de ambiente para produção
2. Use um banco PostgreSQL em produção
3. Configure HTTPS
4. Use PM2 ou similar para gerenciar processos
5. Configure backup automático do banco

### Docker (Futuro)
```dockerfile
# Dockerfile será adicionado em versões futuras
```

## 🤝 Contribuição

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### Padrões de Código
- Use TypeScript
- Siga as convenções do ESLint
- Adicione testes quando possível
- Documente novas funcionalidades

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/medflow/issues)
- **Documentação**: Este README
- **Email**: [seu-email@exemplo.com]

## 🙏 Agradecimentos

- **NestJS** pela excelente documentação
- **Material-UI** pelos componentes incríveis
- **Next.js** pela performance e DX
- **TypeScript** pela segurança de tipos

---

**Desenvolvido com ❤️ para otimizar o trabalho dos médicos** 