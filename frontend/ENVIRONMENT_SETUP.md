# 🔐 Configuração de Variáveis de Ambiente - MedFlow

## ⚠️ IMPORTANTE: Credenciais de Segurança

Este guia foi criado para configurar variáveis de ambiente de forma segura no MedFlow.

### 🚨 Credenciais Comprometidas

As credenciais Google OAuth que estavam hardcoded no código foram expostas e **DEVEM SER REGENERADAS**.

**IMPORTANTE**: Nunca inclua credenciais reais na documentação ou código-fonte.

## 📋 Como Configurar as Variáveis de Ambiente

### 1. Criar arquivo `.env.local`

```bash
# Na pasta frontend/, crie o arquivo .env.local
cd frontend
touch .env.local
```

### 2. Configurar variáveis no `.env.local`

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3001

# Google OAuth (APENAS Client ID no frontend)
GOOGLE_CLIENT_ID=your_new_google_client_id_here

# NUNCA coloque Client Secret no frontend!
# O Client Secret deve estar apenas no backend
```

### 3. Regenerar Credenciais Google OAuth

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Vá para "APIs & Services" > "Credentials"
3. **DELETE** as credenciais comprometidas
4. Crie novas credenciais OAuth 2.0
5. Configure os domínios autorizados
6. Use o novo Client ID no frontend
7. Configure o novo Client Secret **APENAS no backend**

### 4. Verificações de Segurança

✅ **O que está CORRETO agora:**

- `.env.local` está no `.gitignore`
- Credenciais removidas do código-fonte
- Documentação criada para setup seguro

❌ **O que precisa ser feito:**

- Regenerar credenciais Google OAuth
- Configurar `.env.local` com novas credenciais
- Atualizar backend com novo Client Secret

## 🔒 Boas Práticas de Segurança

### No Frontend (Next.js):

- ✅ Use `NEXT_PUBLIC_` para variáveis públicas
- ✅ Client ID pode ser público (mas deve ser novo)
- ❌ NUNCA coloque secrets/senhas no frontend

### No Backend:

- ✅ Client Secret deve estar apenas no backend
- ✅ Use variáveis de ambiente (.env)
- ✅ Nunca commite arquivos .env

### Em Produção:

- ✅ Configure variáveis no painel do provedor (Vercel, Netlify, etc.)
- ✅ Use serviços de gerenciamento de secrets (AWS Secrets Manager, etc.)
- ✅ Monitore logs para vazamentos de credenciais

## 🚀 Próximos Passos

1. **Imediato**: Regenerar credenciais OAuth
2. **Setup**: Criar `.env.local` com novas credenciais
3. **Backend**: Configurar Client Secret no backend
4. **Deploy**: Configurar variáveis em produção
5. **Monitoramento**: Implementar alertas de segurança
