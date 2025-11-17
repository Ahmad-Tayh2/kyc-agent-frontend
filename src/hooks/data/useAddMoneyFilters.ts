import type { paginationProps } from "@/types/shared/pagination";
import {
  createFilterApply,
  createFilterReset,
  createHasActiveFilters,
} from "@/utils/filterHelpers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "../utils/useDebounce";

export interface AddMoneyTransactionsFilterState {
  search?: string;
  status?: string[];
  //pagination
  page?: number;
  per_page?: number;
}

export const useAddMoneyFilters = () => {
  const [filters, setFilters] = useState<AddMoneyTransactionsFilterState>({
    search: "",
    status: [],
    //pagination
    page: 1,
    per_page: 10,
  });
  const debouncedSearch = useDebounce(filters?.search);

  const [filtersString, setFilterString] = useState<string>("");

  useEffect(() => {
    applyFilters();
  }, [debouncedSearch, filters?.per_page, filters?.page]);

  // Update functions for each filter
  const updateStatus = useCallback((status: string[]) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const resetFilters = useCallback(
    createFilterReset(filters, setFilters, setFilterString, ["search"]),
    [filters]
  );

  const applyFilters = useCallback(
    createFilterApply({ ...filters, search: debouncedSearch }, setFilterString),
    [filters, debouncedSearch]
  );

  const hasActiveFilters = useMemo(
    () => createHasActiveFilters(filters, ["search"]),
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
    updateStatus,
    resetFilters,
    applyFilters,
    hasActiveFilters,
    updatePagination,
  };
};
