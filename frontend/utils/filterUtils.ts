/**
 * Utilitários para filtros e ordenação
 */

/**
 * Interface para opções de filtro
 */
export interface FilterOption {
    value: string;
    label: string;
}

/**
 * Interface para opções de ordenação
 */
export interface SortOption {
    value: string;
    label: string;
}

/**
 * Função genérica para filtrar itens
 * 
 * @param items - Array de itens
 * @param searchTerm - Termo de busca
 * @param searchFields - Campos para buscar
 * @param filterBy - Filtro atual
 * @param filterConditions - Condições de filtro
 */
export function filterItems<T>(
    items: T[],
    searchTerm: string,
    searchFields: (keyof T)[],
    filterBy: string,
    filterConditions: Record<string, (item: T) => boolean>
): T[] {
    return items.filter(item => {
        // Busca por termo
        const matchesSearch = searchTerm === '' || searchFields.some(field => {
            const value = item[field];
            return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });

        // Filtro por condição
        const matchesFilter = filterBy === 'all' || filterConditions[filterBy]?.(item) || false;

        return matchesSearch && matchesFilter;
    });
}

/**
 * Função genérica para ordenar itens
 * 
 * @param items - Array de itens
 * @param sortBy - Campo para ordenar
 * @param sortConditions - Condições de ordenação
 */
export function sortItems<T>(
    items: T[],
    sortBy: string,
    sortConditions: Record<string, (a: T, b: T) => number>
): T[] {
    const sortFunction = sortConditions[sortBy];
    if (!sortFunction) return items;

    return [...items].sort(sortFunction);
}

/**
 * Função para calcular estatísticas básicas
 * 
 * @param items - Array de itens
 * @param favorites - Set de favoritos
 * @param statCalculators - Calculadoras de estatísticas específicas
 */
export function calculateStats<T>(
    items: T[],
    favorites: Set<number>,
    statCalculators: Record<string, (items: T[]) => number> = {}
) {
    const baseStats = {
        total: items.length,
        favorites: favorites.size
    };

    return {
        ...baseStats,
        ...Object.fromEntries(
            Object.entries(statCalculators).map(([key, calculator]) => [key, calculator(items)])
        )
    };
} 