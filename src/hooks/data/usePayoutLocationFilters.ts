import type { paginationProps } from '@/types/shared/pagination';
import {
  createFilterApply,
  createFilterReset,
  createHasActiveFilters,
} from '@/utils/filterHelpers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from '../utils/useDebounce';

export interface PayoutLocationFilterState {
  search?: string;
  //pagination
  page?: number;
  per_page?: number;
}

export const usePayoutLocationFilters = () => {
  const [filters, setFilters] = useState<PayoutLocationFilterState>({
    search: '',
    //pagination
    page: 1,
    per_page: 15,
  });
  const debouncedSearch = useDebounce(filters?.search);

  const [filtersString, setFilterString] = useState<string>('');

  // Update functions for each filter
  const updateSearchTerm = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const resetFilters = useCallback(() => {
    createFilterReset(filters, setFilters, setFilterString, ['search'])();
  }, [filters]);

  const applyFilters = useCallback(() => {
    createFilterApply(
      { ...filters, search: debouncedSearch },
      setFilterString
    )();
  }, [filters, debouncedSearch]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const hasActiveFilters = useMemo(
    () => createHasActiveFilters(filters, ['search']),
    [filters]
  );

  const updatePagination = (pagination: paginationProps) => {
    const updatedFilters: paginationProps = {};
    if (pagination?.page !== undefined) {
      updatedFilters.page = Number(pagination?.page);
    }
    if (pagination?.per_page !== undefined) {
      updatedFilters.per_page = Number(pagination?.per_page);
      updatedFilters.page = 1;
    }
    setFilters((prev) => ({ ...prev, ...updatedFilters }));
  };

  return {
    filters,
    filtersString,
    updateSearchTerm,
    resetFilters,
    applyFilters,
    hasActiveFilters,
    updatePagination,
  };
};
