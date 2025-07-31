# 📤 Configurando o Repositório no GitHub

## 🔐 Configuração de Autenticação (IMPORTANTE)

GitHub não aceita mais senhas para operações Git. Você precisa usar um **Personal Access Token (PAT)**.

### 1. Configuração Segura
Para manter suas credenciais seguras, use o arquivo de exemplo:

```bash
# Copiar arquivo de exemplo
cp config/github-setup.example.md config/github-setup.md

# Editar com suas informações
nano config/github-setup.md
```

### 2. Criar Personal Access Token
1. Acesse [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Clique em "Generate new token (classic)"
3. **Note**: `MedFlow Access Token`
4. **Expiration**: 90 days (ou sua preferência)
5. **Scopes**: Selecione:
   - ✅ `repo` (acesso completo aos repositórios)
   - ✅ `workflow` (para GitHub Actions)
6. Clique em "Generate token"
7. **COPIE o token** (você não verá novamente!)

### 3. Configurar Git
```bash
# Configurar o helper de credenciais
git config --global credential.helper store

# Configurar seu usuário (substitua pelos seus dados)
git config --global user.name "SEU_USERNAME"
git config --global user.email "seu-email@exemplo.com"
```

### 4. Usar o Token
Quando fizer push, use:
- **Username**: `seu-username`
- **Password**: `SEU_PERSONAL_ACCESS_TOKEN` (não sua senha do GitHub)

**⚠️ IMPORTANTE**: O arquivo `config/github-setup.md` está no `.gitignore` e NÃO será commitado.

## Passos para Subir o Projeto

### 1. Criar Repositório no GitHub
1. Acesse [GitHub](https://github.com)
2. Clique em "New repository"
3. Nome: `medFlow`
4. Descrição: `Sistema de Gestão Médica - Backend NestJS + Frontend Next.js`
5. **NÃO** inicialize com README (já temos um)
6. Clique em "Create repository"

### 2. Conectar Repositório Local ao GitHub
```bash
# Adicione o remote (substitua SEU_USUARIO pelo seu username)
git remote add origin https://github.com/SEU_USUARIO/medFlow.git

# Verifique se foi adicionado
git remote -v
```

### 3. Fazer Push para o GitHub
```bash
# Primeiro push (estabelece a branch main)
git push -u origin main

# Quando pedir credenciais:
# Username: bcordeirodev
# Password: SEU_PERSONAL_ACCESS_TOKEN (não sua senha!)
```

## 🔧 Solução de Problemas

### Erro de Autenticação
Se ainda receber erro de autenticação:

```bash
# Remover credenciais salvas
git config --global --unset credential.helper
git config --global credential.helper store

# Ou usar HTTPS com token na URL (substitua SEU_USUARIO e SEU_TOKEN)
git remote set-url origin https://SEU_USUARIO:SEU_TOKEN@github.com/SEU_USUARIO/medFlow.git
```

### Verificar Configuração
```bash
# Verificar configurações
git config --list | grep user
git config --list | grep credential

# Verificar remote
git remote -v
```

## 📁 Estrutura Final do Projeto

```
medFlow/
├── 📄 README.md                    # Documentação completa
├── 📄 QUICK_START.md              # Guia de início rápido
├── 📄 CONTRIBUTING.md             # Guia de contribuição
├── 📄 LICENSE                     # Licença MIT
├── 📄 setup.sh                    # Script de setup automático
├── 📄 deploy.sh                   # Script de deploy
├── 📄 docker-compose.yml          # Configuração Docker
├── 📄 ecosystem.config.js         # Configuração PM2
├── 📄 nginx.conf                  # Configuração Nginx
├── 📁 .github/workflows/          # CI/CD GitHub Actions
├── 📁 backend/                    # API NestJS
│   ├── 📁 src/
│   ├── 📄 Dockerfile
│   └── 📄 package.json
└── 📁 frontend/                   # App Next.js
    ├── 📁 app/
    ├── 📁 components/
    ├── 📄 Dockerfile
    └── 📄 package.json
```

## 🎯 O que está Incluído

### ✅ Documentação Completa
- README.md detalhado com todas as informações
- QUICK_START.md para setup rápido
- CONTRIBUTING.md para contribuições
- Troubleshooting e soluções de problemas

### ✅ Configuração de Desenvolvimento
- Script de setup automatizado
- Seed de dados com informações médicas
- Configuração de banco de dados
- Variáveis de ambiente

### ✅ Infraestrutura
- Docker support
- PM2 para produção
- Nginx configuration
- GitHub Actions CI/CD

### ✅ Funcionalidades
- Autenticação JWT completa
- CRUD de usuários, pacientes, medicamentos
- Interface moderna com Material-UI
- Design responsivo
- Validações e segurança

## 🚀 Para Quem Quiser Usar

### Setup Local (3 comandos)
```bash
git clone https://github.com/SEU_USUARIO/medflow.git
cd medFlow
./setup.sh
```

### Executar
```bash
# Backend
cd backend && npm run start:dev

# Frontend (outro terminal)
cd frontend && npm run dev
```

### Acessar
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 📊 Status do Projeto

- ✅ **Backend**: NestJS + TypeORM + PostgreSQL
- ✅ **Frontend**: Next.js 19 + Material-UI
- ✅ **Autenticação**: JWT completo
- ✅ **Banco de Dados**: Seed com dados médicos
- ✅ **Documentação**: Completa e detalhada
- ✅ **Deploy**: Scripts e configurações prontas
- ✅ **CI/CD**: GitHub Actions configurado

## 🎉 Próximos Passos

1. **Subir para GitHub** (instruções acima)
2. **Compartilhar o link** do repositório
3. **Receber feedback** da comunidade
4. **Implementar melhorias** baseadas no feedback
5. **Adicionar novas funcionalidades**

---

**O projeto está pronto para ser compartilhado! 🚀** 