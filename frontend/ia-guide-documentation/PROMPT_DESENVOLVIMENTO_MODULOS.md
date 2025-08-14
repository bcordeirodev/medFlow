# 🤖 Prompt para Desenvolvimento de Novos Módulos - MedFlow

## 📋 PROMPT PARA IA

````
Crie um novo módulo [NOME_DO_MODULO] para o projeto MedFlow seguindo RIGOROSAMENTE os padrões estabelecidos.

**CONTEXTO DO PROJETO:**
O MedFlow já possui uma arquitetura otimizada com hooks, components e utils padronizados. É OBRIGATÓRIO reutilizar TODOS os recursos existentes.

**RECURSOS EXISTENTES QUE DEVEM SER REUTILIZADOS:**

✅ **HOOKS OBRIGATÓRIOS:**
- `useForm` - Para formulários (NUNCA criar useState manual)
- `useListState` - Para filtros/ordenação/favoritos (NUNCA criar estados manuais)
- `use[Entity]s` - Para data fetching com SWR (NUNCA usar fetch manual)
- `useNotification` - Para feedback (NUNCA criar alert manual)

✅ **COMPONENTS OBRIGATÓRIOS:**
- `FormTextField`, `FormSelectField` - Para campos de formulário
- `ModuleHeader` - Para header dos módulos
- `StatsGrid` - Para estatísticas
- `FilterControls` - Para filtros e ordenação
- `EmptyState` - Para estados vazios

✅ **UTILS OBRIGATÓRIOS:**
- `filterUtils.ts` - `filterItems`, `sortItems`, `calculateStats`
- `ErrorHandler` - `extractErrorMessage`, `logError`
- `constants.ts` - `STATS_COLORS`

✅ **CONTEXTS OBRIGATÓRIOS:**
- `useNotification` - Para sucesso/erro
- `useAuth` - Para autenticação

✅ **TYPES OBRIGATÓRIOS:**
- `@/types/entities.types` - Para entidades
- `@/types/forms.types` - Para formulários

**ESTRUTURA OBRIGATÓRIA:**

1. **[Modulo]List.tsx** - Lista principal
2. **[Modulo]Form.tsx** - Formulário de criação/edição
3. **[Modulo]Details.tsx** - Visualização de detalhes
4. **index.ts** - Exports do módulo

**PADRÕES OBRIGATÓRIOS:**

🔧 **Data Fetching:**
```typescript
const { [entidades], isLoading, mutate } = use[Modulo]s(); // SWR hook
````

🔧 **Estado de Lista:**

```typescript
const { searchTerm, sortBy, filterBy, favorites, toggleFavorite } =
  useListState();
```

🔧 **Formulários:**

```typescript
const form = useForm({ initialValues, validationSchema, onSubmit });
<FormTextField
  value={form.values.field}
  onChange={(v) => form.setFieldValue("field", v)}
/>;
```

🔧 **Filtros e Ordenação:**

```typescript
const filtered = filterItems(
  items,
  searchTerm,
  searchFields,
  filterBy,
  filterConditions
);
const sorted = sortItems(filtered, sortBy, sortConditions);
```

🔧 **Estatísticas:**

```typescript
const stats = calculateStats(items, favorites);
const statsData = [
  { value: stats.total, label: "Total", ...STATS_COLORS.primary },
  { value: stats.active, label: "Ativos", ...STATS_COLORS.success },
];
```

🔧 **Tratamento de Erro:**

```typescript
const errorMessage = ErrorHandler.extractErrorMessage(error);
ErrorHandler.logError(error, "Context");
showError(errorMessage);
```

**REGRAS CRÍTICAS:**

❌ **NUNCA CRIAR:**

- Estados manuais para dados (useState + useEffect)
- Componentes de campo (TextField, Select)
- Sistema de filtros manual
- Tratamento de erro manual (console.error)
- Contextos novos
- Hooks de formulário
- Utilitários de lista

✅ **SEMPRE USAR:**

- Hooks existentes para TUDO
- Components padronizados
- Utils centralizados
- Optional chaining (?.))
- useMemo para performance
- Tipos centralizados

**VALIDAÇÃO:**

- ✅ Zero erros de linting críticos
- ✅ Reutilização máxima de código
- ✅ Padrão idêntico aos módulos: medicines, patients, prescriptions, cids
- ✅ Performance otimizada
- ✅ Funcionalidade completa

**EXEMPLO DE ENTIDADE:**
Se for módulo "reports", criar: useReports, ReportsList, ReportForm, ReportDetails usando EXATAMENTE os padrões dos módulos existentes.

**IMPORTANTE:** Analise os módulos medicines, patients, prescriptions como referência OBRIGATÓRIA. Use o GUIA_DESENVOLVIMENTO_MODULOS.md para estrutura detalhada.

O módulo deve funcionar perfeitamente seguindo os padrões estabelecidos SEM criar NADA novo que já existe.

```

## 🎯 Como Usar Este Prompt

### **1. Para IA/Cursor:**
- Copie o prompt acima
- Substitua `[NOME_DO_MODULO]` pelo módulo desejado
- Execute a criação do módulo

### **2. Para Desenvolvedor:**
- Use como checklist durante desenvolvimento
- Consulte GUIA_DESENVOLVIMENTO_MODULOS.md para detalhes
- Valide contra padrões dos módulos existentes

### **3. Para Code Review:**
- Verifique se todos os pontos foram seguidos
- Confirme reutilização de recursos
- Validar performance e padrões

## 📋 Exemplos de Uso

### **Módulo de Relatórios:**
```

Crie um novo módulo reports para o projeto MedFlow seguindo RIGOROSAMENTE os padrões estabelecidos...

```

### **Módulo de Configurações:**
```

Crie um novo módulo settings para o projeto MedFlow seguindo RIGOROSAMENTE os padrões estabelecidos...

```

### **Módulo de Usuários:**
```

Crie um novo módulo users para o projeto MedFlow seguindo RIGOROSAMENTE os padrões estabelecidos...

```

---

**💡 Este prompt garante que QUALQUER novo módulo siga EXATAMENTE os padrões otimizados estabelecidos no MedFlow, evitando duplicação e mantendo a qualidade do código!**
```
