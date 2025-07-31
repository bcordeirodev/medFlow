# Guia de Contribuição - MedFlow

Obrigado por considerar contribuir com o MedFlow! Este documento fornece diretrizes para contribuições.

## 🚀 Como Contribuir

### 1. Fork e Clone
```bash
# Faça um fork do repositório
# Clone seu fork
git clone https://github.com/seu-usuario/medflow.git
cd medflow
```

### 2. Configure o Ambiente
```bash
# Execute o script de setup
chmod +x setup.sh
./setup.sh

# Execute o seed de dados
cd backend
npm run seed
```

### 3. Crie uma Branch
```bash
git checkout -b feature/nova-funcionalidade
# ou
git checkout -b fix/correcao-bug
```

### 4. Desenvolva
- Siga os padrões de código existentes
- Use TypeScript
- Adicione testes quando possível
- Documente novas funcionalidades

### 5. Commit e Push
```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push origin feature/nova-funcionalidade
```

### 6. Pull Request
- Crie um Pull Request no GitHub
- Descreva as mudanças claramente
- Inclua screenshots se aplicável

## 📋 Padrões de Código

### TypeScript
- Use tipagem explícita
- Evite `any` quando possível
- Use interfaces para objetos

### NestJS (Backend)
- Siga a estrutura de módulos
- Use DTOs para validação
- Implemente guards quando necessário

### Next.js (Frontend)
- Use componentes funcionais
- Implemente hooks customizados
- Siga as convenções do App Router

### Commits
Use o padrão Conventional Commits:
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação
- `refactor:` refatoração
- `test:` testes
- `chore:` tarefas de manutenção

## 🧪 Testes

### Backend
```bash
cd backend
npm run test
npm run test:e2e
```

### Frontend
```bash
cd frontend
npm run test
```

## 📝 Documentação

- Atualize o README.md quando necessário
- Documente novas APIs
- Adicione comentários em código complexo

## 🐛 Reportando Bugs

Use o template de issue do GitHub e inclua:
- Descrição clara do bug
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots se aplicável
- Informações do ambiente

## 💡 Sugerindo Funcionalidades

- Descreva a funcionalidade desejada
- Explique o caso de uso
- Considere a implementação
- Discuta com a comunidade

## 🤝 Código de Conduta

- Seja respeitoso
- Ajude outros contribuidores
- Mantenha discussões construtivas
- Siga as diretrizes da comunidade

## 📞 Suporte

- Issues: [GitHub Issues](https://github.com/seu-usuario/medflow/issues)
- Discussões: [GitHub Discussions](https://github.com/seu-usuario/medflow/discussions)

Obrigado por contribuir com o MedFlow! 🎉 