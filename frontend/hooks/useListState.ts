import { useState, useCallback } from 'react';

/**
 * Hook customizado para gerenciar estado comum das listas
 *
 * @param initialViewMode - Modo de visualização inicial
 * @param initialSortBy - Ordenação inicial
 * @param initialFilterBy - Filtro inicial
 */
export function useListState<
  TViewMode extends 'grid' | 'list',
  TSortBy extends string,
  TFilterBy extends string,
>(
  initialViewMode: TViewMode = 'grid' as TViewMode,
  initialSortBy: TSortBy = '' as TSortBy,
  initialFilterBy: TFilterBy = '' as TFilterBy
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<TViewMode>(initialViewMode);
  const [sortBy, setSortBy] = useState<TSortBy>(initialSortBy);
  const [filterBy, setFilterBy] = useState<TFilterBy>(initialFilterBy);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  /**
   * Toggle favorito para um item
   */
  const toggleFavorite = useCallback((itemId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });
  }, []);

  /**
   * Abrir menu de filtros adicionais
   */
  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  /**
   * Fechar menu de filtros adicionais
   */
  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  /**
   * Resetar todos os filtros
   */
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setFilterBy(initialFilterBy);
    setSortBy(initialSortBy);
    setViewMode(initialViewMode);
  }, [initialFilterBy, initialSortBy, initialViewMode]);

  return {
    // Estados
    searchTerm,
    viewMode,
    sortBy,
    filterBy,
    favorites,
    anchorEl,

    // Setters
    setSearchTerm,
    setViewMode,
    setSortBy,
    setFilterBy,

    // Handlers
    toggleFavorite,
    handleMenuOpen,
    handleMenuClose,
    resetFilters,
  };
}
