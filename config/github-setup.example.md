# 🔐 Configuração GitHub - Exemplo

**⚠️ IMPORTANTE**: Este arquivo contém informações sensíveis. 
- NÃO commite este arquivo
- Use apenas como referência
- Substitua os valores pelos seus próprios

## Suas Configurações

```bash
# Seu username do GitHub
GITHUB_USERNAME=seu-username

# Seu Personal Access Token
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Seu email
GITHUB_EMAIL=seu-email@exemplo.com
```

## Comandos para Configurar

```bash
# Configurar Git
git config --global user.name "SEU_USERNAME"
git config --global user.email "SEU_EMAIL"

# Adicionar remote com token
git remote add origin https://SEU_USERNAME:SEU_TOKEN@github.com/SEU_USERNAME/medFlow.git

# Ou usar HTTPS normal (pedirá credenciais)
git remote add origin https://github.com/SEU_USERNAME/medFlow.git
```

## Como Usar

1. Copie este arquivo: `cp config/github-setup.example.md config/github-setup.md`
2. Edite `config/github-setup.md` com suas informações
3. Use os comandos do arquivo para configurar
4. **NUNCA** commite o arquivo `config/github-setup.md`

## Criar Personal Access Token

1. Vá para: https://github.com/settings/tokens
2. Clique em "Generate new token (classic)"
3. **Note**: `MedFlow Access Token`
4. **Expiration**: 90 days
5. **Scopes**: 
   - ✅ `repo` (acesso completo aos repositórios)
   - ✅ `workflow` (para GitHub Actions)
6. Clique em "Generate token"
7. **COPIE o token** (você não verá novamente!) 