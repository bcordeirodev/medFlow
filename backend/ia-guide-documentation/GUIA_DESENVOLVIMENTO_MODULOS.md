# 📋 Guia de Desenvolvimento de Novos Módulos - MedFlow

## 🎯 Objetivo

Este guia estabelece o padrão obrigatório para criação de novos módulos no projeto MedFlow, garantindo consistência, reutilização máxima de recursos existentes e zero duplicação de código.

## ⚠️ REGRAS FUNDAMENTAIS

### 🚫 **NUNCA CRIAR:**

- ❌ **Novos Contexts** - Use os existentes: `AuthContext`, `NotificationContext`, `UserContext`, `AppConfigContext`, `ThemeContext`
- ❌ **Novos Hooks de formulário** - Use `useForm` existente
- ❌ **Novos Hooks de lista** - Use `useListState` existente
- ❌ **Novos Componentes de campo** - Use `FormTextField`, `FormSelectField` existentes
- ❌ **Novos Utilitários** - Use `filterUtils`, `ErrorHandler`, `constants` existentes
- ❌ **Fetch manual** - Use padrão SWR com hooks específicos
- ❌ **Estados manuais** - Use hooks otimizados existentes

### ✅ **SEMPRE REUTILIZAR:**

- ✅ **Hooks existentes**: `useForm`, `useListState`, `use[Entity]s`
- ✅ **Componentes**: `FormTextField`, `FormSelectField`, `ModuleHeader`, `StatsGrid`, `FilterControls`, `EmptyState`
- ✅ **Utilitários**: `filterUtils`, `sortUtils`, `ErrorHandler`, `STATS_COLORS`
- ✅ **Contexts**: `useNotification`, `useAuth`, etc.
- ✅ **Tipos**: De `@/types/entities.types`, `@/types/forms.types`

## 🏗️ ESTRUTURA OBRIGATÓRIA PARA NOVOS MÓDULOS

### **1. Arquivo de Listagem: `[Módulo]List.tsx`**

```typescript
'use client';

// IMPORTS OBRIGATÓRIOS - NUNCA CRIAR NOVOS
import {
  EmptyState,
  FilterControls,
  ModuleHeader,
  StatsGrid,
} from '@/components/common';
import { useListState, use[Módulo]s } from '@/hooks';
import { [Entity] } from '@/types/entities.types';
import { STATS_COLORS } from '@/utils/constants';
import { calculateStats, filterItems, sortItems } from '@/utils/filterUtils';
import { useMemo, useState } from 'react';

// TIPOS DE CONTROLE - ADAPTAR CONFORME NECESSÁRIO
type SortOption = 'name' | 'createdAt' | 'isActive';
type FilterOption = 'all' | 'active' | 'inactive';

export default function [Módulo]List() {
  // HOOK OBRIGATÓRIO - SWR PARA DADOS
  const { [entidades], isLoading: loading, mutate } = use[Módulo]s();

  // HOOK OBRIGATÓRIO - ESTADO DE LISTA
  const {
    searchTerm,
    viewMode,
    sortBy,
    filterBy,
    favorites,
    anchorEl,
    setSearchTerm,
    setViewMode,
    setSortBy,
    setFilterBy,
    toggleFavorite,
    handleMenuOpen,
    handleMenuClose,
  } = useListState<'grid' | 'list', SortOption, FilterOption>(
    'grid' as const,
    'name' as SortOption,
    'all' as FilterOption
  );

  // ESTADOS ESPECÍFICOS DO MÓDULO
  const [selected[Entity], setSelected[Entity]] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing[Entity], setEditing[Entity]] = useState<[Entity] | null>(null);

  // FUNÇÃO DE REFRESH OBRIGATÓRIA
  const refresh[Entidades] = () => mutate();

  // FILTROS E ORDENAÇÃO COM USEMEMO OBRIGATÓRIO
  const filteredAndSorted[Entidades] = useMemo(() => {
    const searchFields: (keyof [Entity])[] = ['name', 'campo2'];

    const filterConditions = {
      all: () => true,
      active: ([entidade]: [Entity]) => [entidade].isActive,
      inactive: ([entidade]: [Entity]) => ![entidade].isActive,
    };

    const sortConditions = {
      name: (a: [Entity], b: [Entity]) => a.name.localeCompare(b.name),
      createdAt: (a: [Entity], b: [Entity]) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      isActive: (a: [Entity], b: [Entity]) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0),
    };

    const filtered = filterItems([entidades] || [], searchTerm, searchFields, filterBy, filterConditions);
    return sortItems(filtered, sortBy, sortConditions);
  }, [[entidades], searchTerm, filterBy, sortBy]);

  // ESTATÍSTICAS COM USEMEMO E STATS_COLORS OBRIGATÓRIO
  const stats = useMemo(() => {
    const baseStats = calculateStats([entidades] || [], favorites);
    return {
      ...baseStats,
      active: ([entidades] || []).filter(e => e.isActive).length,
      inactive: ([entidades] || []).filter(e => !e.isActive).length,
    };
  }, [[entidades], favorites]);

  const statsData = useMemo(
    () => [
      { value: stats.total, label: 'Total', ...STATS_COLORS.primary },
      { value: stats.active, label: 'Ativos', ...STATS_COLORS.success },
      { value: stats.inactive, label: 'Inativos', ...STATS_COLORS.error },
      { value: stats.favorites, label: 'Favoritos', ...STATS_COLORS.warning },
    ],
    [stats]
  );

  // HANDLERS PADRÃO
  const handleView[Entity] = ([entidade]Id: number) => setSelected[Entity]([entidade]Id);
  const handleCloseDetails = () => setSelected[Entity](null);
  const handleNew[Entity] = () => { setEditing[Entity](null); setShowForm(true); };
  const handleEdit[Entity] = ([entidade]: [Entity]) => { setEditing[Entity]([entidade]); setShowForm(true); };
  const handleFormSuccess = () => { refresh[Entidades](); setShowForm(false); setEditing[Entity](null); };
  const handleFormClose = () => { setShowForm(false); setEditing[Entity](null); };

  // LOADING STATE OBRIGATÓRIO
  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px">
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#94A3B8' }}>
          Carregando [entidades]...
        </Typography>
      </Box>
    );
  }

  // RENDER PADRÃO OBRIGATÓRIO
  return (
    <Box>
      <Paper elevation={0} sx={{ /* estilo padrão */ }}>
        <ModuleHeader
          title="[Módulo]s"
          subtitle="Gerencie os [entidades]"
          icon={<IconeDoModulo sx={{ fontSize: 28 }} />}
          onRefresh={refresh[Entidades]}
          onAdd={handleNew[Entity]}
          addButtonText="Novo [Entity]"
        />
        <StatsGrid stats={statsData} />
      </Paper>

      <FilterControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar [entidades]..."
        filterBy={filterBy}
        onFilterChange={value => setFilterBy(value as FilterOption)}
        filterOptions={filterOptions}
        sortBy={sortBy}
        onSortChange={value => setSortBy(value as SortOption)}
        sortOptions={sortOptions}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onMenuOpen={handleMenuOpen}
        anchorEl={anchorEl}
        onMenuClose={handleMenuClose}
      />

      {/* Grid usando padrão estabelecido com cards */}
      {/* EmptyState quando necessário */}
      {/* Modais de detalhes e formulário */}
    </Box>
  );
}
```

### **2. Arquivo de Formulário: `[Módulo]Form.tsx`**

```typescript
'use client';

// IMPORTS OBRIGATÓRIOS - NUNCA CRIAR NOVOS
import { FormTextField, FormSelectField } from '@/components/common/FormField';
import { useNotification } from '@/contexts/NotificationContext';
import { useForm } from '@/hooks/useForm';
import { use[Módulo]s } from '@/hooks';
import { [entity]Schema } from '@/lib/schemas';
import { [Entity]FormData } from '@/types/forms.types';
import { ErrorHandler } from '@/utils/errorHandler';

interface [Entity]FormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  [entity]?: [Entity];
}

export default function [Entity]Form({ open, onClose, onSuccess, [entity] }: [Entity]FormProps) {
  const { create[Entity], update[Entity] } = use[Módulo]s();
  const { showSuccess, showError } = useNotification();

  // USEFORM OBRIGATÓRIO
  const form = useForm<[Entity]FormData>({
    initialValues: {
      name: [entity]?.name || '',
      // ... outros campos
    },
    validationSchema: [entity]Schema,
    onSubmit: async (values) => {
      try {
        if ([entity]) {
          await update[Entity]([entity].id, values);
          showSuccess(`${values.name} atualizado com sucesso!`);
        } else {
          await create[Entity](values);
          showSuccess(`${values.name} criado com sucesso!`);
        }
        onSuccess?.();
        onClose();
      } catch (error) {
        const errorMessage = ErrorHandler.extractErrorMessage(error);
        ErrorHandler.logError(error, '[Entity] Form');
        showError(errorMessage);
      }
    },
  });

  // RESET FORM OBRIGATÓRIO
  useEffect(() => {
    if (open) {
      if ([entity]) {
        form.setValues({
          name: [entity].name,
          // ... outros campos
        });
      } else {
        form.resetForm();
      }
    }
  }, [open, [entity]]);

  // SEMPRE USAR FormTextField/FormSelectField
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={form.handleSubmit}>
        <DialogContent>
          <FormTextField
            name="name"
            label="Nome"
            value={form.values.name || ''}
            onChange={(value) => form.setFieldValue('name', value)}
            onBlur={() => form.setFieldTouched('name')}
            error={form.errors.name}
            touched={form.touched.name}
            required
            disabled={form.isSubmitting}
          />

          {/* Outros campos seguindo o mesmo padrão */}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={form.isSubmitting}
          >
            {form.isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
```

### **3. Arquivo de Detalhes: `[Módulo]Details.tsx`**

```typescript
'use client';

// IMPORTS OBRIGATÓRIOS
import { use[Entity] } from '@/hooks/use[Módulo]s';
import { useForm } from '@/hooks/useForm';
import { FormTextField, FormSelectField } from '@/components/common/FormField';
import { [entity]Schema } from '@/lib/schemas';
import { ErrorHandler } from '@/utils/errorHandler';
import { useNotification } from '@/contexts/NotificationContext';

interface [Entity]DetailsProps {
  [entity]Id: number;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function [Entity]Details({ [entity]Id, onClose, onUpdate }: [Entity]DetailsProps) {
  // HOOK ESPECÍFICO OBRIGATÓRIO
  const { [entity], isLoading, mutate } = use[Entity]([entity]Id);
  const [editing, setEditing] = useState(false);
  const { showSuccess, showError } = useNotification();

  // USEFORM PARA EDIÇÃO
  const form = useForm({
    initialValues: {
      name: [entity]?.name || '',
      // ... outros campos
    },
    validationSchema: [entity]Schema,
    onSubmit: async (values) => {
      try {
        await mutate(async () => {
          const response = await fetch(`/api/[entidades]/${[entity]Id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          });
          if (!response.ok) throw new Error('Erro ao atualizar');
          return response.json();
        }, false);
        await mutate();
        showSuccess(`${values.name} atualizado com sucesso`);
        setEditing(false);
        onUpdate?.();
      } catch (error) {
        const errorMessage = ErrorHandler.extractErrorMessage(error);
        ErrorHandler.logError(error, '[Entity] Details Update');
        showError(errorMessage);
      }
    },
  });

  // SEMPRE USAR FormTextField COM OPTIONAL CHAINING
  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>
        <FormTextField
          name="name"
          label="Nome"
          value={editing ? form.values.name || '' : [entity]?.name || ''}
          onChange={(value) => form.setFieldValue('name', value)}
          error={form.errors.name}
          touched={form.touched.name}
          disabled={!editing}
        />
        {/* Outros campos seguindo o padrão */}
      </DialogContent>
    </Dialog>
  );
}
```

## 🎯 CHECKLIST OBRIGATÓRIO PARA NOVOS MÓDULOS

### **📋 Antes de Começar:**

- [ ] ✅ Verificar se já existe hook para a entidade (`use[Entidade]s`)
- [ ] ✅ Verificar se tipos já existem em `@/types/entities.types`
- [ ] ✅ Verificar se schemas existem em `@/lib/schemas`
- [ ] ✅ Confirmar que não há componentes similares existentes

### **🔧 Durante o Desenvolvimento:**

- [ ] ✅ Usar APENAS hooks existentes (`useForm`, `useListState`, `use[Entity]s`)
- [ ] ✅ Usar APENAS contexts existentes (`useNotification`, `useAuth`)
- [ ] ✅ Usar APENAS componentes existentes (`FormTextField`, `ModuleHeader`, etc.)
- [ ] ✅ Usar APENAS utilitários existentes (`filterUtils`, `ErrorHandler`, `STATS_COLORS`)
- [ ] ✅ Aplicar `useMemo` em filtros, ordenação e estatísticas
- [ ] ✅ Implementar loading states adequados
- [ ] ✅ Usar optional chaining (`?.`) para propriedades possivelmente undefined

### **✅ Depois de Concluir:**

- [ ] ✅ Verificar linting sem erros críticos
- [ ] ✅ Confirmar que funcionalidade está preservada
- [ ] ✅ Verificar que aparência está consistente
- [ ] ✅ Testar performance com dados reais
- [ ] ✅ Confirmar reutilização máxima de código

## 🚨 PADRÕES DE VALIDAÇÃO

### **❌ CÓDIGO REJEITADO:**

```typescript
// ❌ NUNCA FAZER
const [data, setData] = useState([]); // Use SWR hooks
const [loading, setLoading] = useState(false); // Use SWR isLoading
useEffect(() => {
  fetchData();
}, []); // Use SWR hooks
const handleChange = (e) => setData(e.target.value); // Use useForm
<TextField onChange={handleChange} />; // Use FormTextField
console.error(error); // Use ErrorHandler
```

### **✅ CÓDIGO APROVADO:**

```typescript
// ✅ SEMPRE FAZER
const { data, isLoading, mutate } = useEntity();
const form = useForm({ ... });
const { searchTerm, sortBy, toggleFavorite } = useListState();
<FormTextField onChange={(value) => form.setFieldValue('field', value)} />
ErrorHandler.logError(error, 'Context');
```

## 📦 ESTRUTURA DE ARQUIVOS OBRIGATÓRIA

```
frontend/components/[modulo]/
├── [Modulo]List.tsx      // Lista principal (OBRIGATÓRIO)
├── [Modulo]Form.tsx      // Formulário (OBRIGATÓRIO)
├── [Modulo]Details.tsx   // Detalhes (OBRIGATÓRIO)
├── index.ts              // Exports (OBRIGATÓRIO)
└── [Auxiliares].tsx      // Componentes específicos (SE NECESSÁRIO)
```

## 🎯 RESULTADO ESPERADO

Seguindo este guia, cada novo módulo terá:

### **Performance** 🚀

- Cache SWR para dados
- useMemo para computações pesadas
- Hooks otimizados para estado

### **Consistência** 📏

- Mesmo padrão em todos os módulos
- Reutilização máxima de código
- Nomenclatura padronizada

### **Manutenibilidade** 🔧

- Código limpo e organizado
- Lógica centralizada
- Tratamento de erro padronizado

### **Confiabilidade** 🔒

- Tipos seguros com TypeScript
- Validação centralizada com Zod
- Optional chaining para evitar crashes

## ⚠️ CONSEQUÊNCIAS DO NÃO CUMPRIMENTO

**Código que NÃO seguir este guia será REJEITADO e deverá ser refatorado.**

### **Motivos para Rejeição:**

- ❌ Criação de contexts desnecessários
- ❌ Criação de hooks duplicados
- ❌ Uso de fetch manual em vez de SWR
- ❌ Criação de componentes já existentes
- ❌ Não uso dos utilitários padronizados
- ❌ Falta de otimizações obrigatórias

---

**💡 Lembre-se: O objetivo é REUTILIZAR ao máximo, NUNCA RECRIAR o que já existe!**

**Este guia garante que TODOS os módulos mantenham o MESMO PADRÃO de qualidade e organização estabelecido no projeto MedFlow.**
