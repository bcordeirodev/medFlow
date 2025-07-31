#!/bin/bash

echo "🚀 Configurando o MedFlow..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js 18+ primeiro."
    exit 1
fi

# Verificar se o PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL não está instalado. Por favor, instale o PostgreSQL primeiro."
    exit 1
fi

echo "✅ Node.js e PostgreSQL encontrados"

# Criar arquivo .env para o backend
echo "📝 Criando arquivo .env para o backend..."
cat > backend/.env << EOF
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=medflow

# JWT
JWT_SECRET=medflow-super-secret-key-change-in-production

# Environment
NODE_ENV=development
EOF

echo "✅ Arquivo .env criado"

# Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
cd backend
npm install

# Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
cd ../frontend
npm install

echo "✅ Dependências instaladas"

# Criar banco de dados
echo "🗄️ Criando banco de dados..."
createdb medflow 2>/dev/null || echo "Banco de dados já existe"

echo "✅ Banco de dados criado"

echo ""
echo "🎉 Setup concluído!"
echo ""
echo "📋 Tecnologias utilizadas:"
echo "   • Backend: NestJS + TypeORM + PostgreSQL"
echo "   • Frontend: Next.js 19 + Material-UI + TypeScript"
echo "   • Autenticação: JWT"
echo ""
echo "🚀 Para executar o projeto:"
echo ""
echo "1. Backend:"
echo "   cd backend"
echo "   npm run start:dev"
echo ""
echo "2. Frontend (em outro terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Acesse: http://localhost:3000"
echo ""
echo "🎨 Interface:"
echo "   • Material-UI (MUI) para componentes modernos"
echo "   • Design responsivo e acessível"
echo "   • Tema customizável"
echo ""
echo "⚠️  IMPORTANTE: Altere a senha do PostgreSQL no arquivo backend/.env"
echo "⚠️  IMPORTANTE: Altere o JWT_SECRET no arquivo backend/.env" 