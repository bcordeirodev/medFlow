#!/bin/bash

echo "🚀 Iniciando deploy do MedFlow..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js 18+ primeiro."
    exit 1
fi

# Verificar se o PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo "📦 Instalando PM2..."
    npm install -g pm2
fi

# Verificar se o PostgreSQL está rodando
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "❌ PostgreSQL não está rodando. Por favor, inicie o PostgreSQL primeiro."
    exit 1
fi

echo "✅ Verificações concluídas"

# Backup do banco de dados
echo "💾 Fazendo backup do banco de dados..."
pg_dump -h localhost -U postgres medflow > backup_$(date +%Y%m%d_%H%M%S).sql

# Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
cd backend
npm ci --only=production

# Build do backend
echo "🔨 Build do backend..."
npm run build

# Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
cd ../frontend
npm ci --only=production

# Build do frontend
echo "🔨 Build do frontend..."
npm run build

# Voltar para o diretório raiz
cd ..

# Criar diretório de logs
mkdir -p logs

# Parar aplicações existentes
echo "🛑 Parando aplicações existentes..."
pm2 stop medflow-backend medflow-frontend 2>/dev/null || true
pm2 delete medflow-backend medflow-frontend 2>/dev/null || true

# Iniciar aplicações com PM2
echo "🚀 Iniciando aplicações..."
pm2 start ecosystem.config.js --env production

# Salvar configuração do PM2
pm2 save

# Configurar PM2 para iniciar com o sistema
pm2 startup

echo ""
echo "🎉 Deploy concluído com sucesso!"
echo ""
echo "📊 Status das aplicações:"
pm2 status
echo ""
echo "🌐 URLs:"
echo "   • Frontend: http://localhost:3000"
echo "   • Backend: http://localhost:3001"
echo ""
echo "📝 Comandos úteis:"
echo "   • pm2 logs - Visualizar logs"
echo "   • pm2 restart all - Reiniciar aplicações"
echo "   • pm2 stop all - Parar aplicações"
echo "   • pm2 monit - Monitoramento em tempo real" 