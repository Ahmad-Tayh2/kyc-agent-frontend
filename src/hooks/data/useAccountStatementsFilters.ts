import type { paginationProps } from "@/types/shared/pagination";
import {
  createFilterApply,
  createFilterReset,
  createHasActiveFilters,
} from "@/utils/filterHelpers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "../utils/useDebounce";

export interface AccountStatementsFilterState {
  search?: string;

  type?: string[];
  currencies: string[];
  date_from?: string;
  date_to?: string;
  //pagination
  page?: number;
  per_page?: number;
}

export const useAccountStatementsFilters = () => {
  const [filters, setFilters] = useState<AccountStatementsFilterState>({
    search: "",
    type: [],
    currencies: [],
    date_from: "",
    date_to: "",
    //pagination
    page: 1,
    per_page: 10,
  });
  const debouncedSearch = useDebounce(filters?.search);

  const [filtersString, setFilterString] = useState<string>("");

  useEffect(() => {
    applyFilters();
  }, [debouncedSearch, filters?.per_page, filters?.page]);

  const updateTypes = useCallback((type: string[]) => {
    setFilters((prev) => ({ ...prev, type }));
  }, []);

  const updateDateRange = useCallback(
    (dateRange: { startDate: string | null; endDate: string | null }) => {
      setFilters((prev) => ({
        ...prev,
        date_from: dateRange.startDate || "",
        date_to: dateRange.endDate || "",
      }));
    },
    []
  );
  const updateCurrencies = useCallback((currencies: string[]) => {
    setFilters((prev) => ({ ...prev, currencies }));
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

    updateTypes,
    updateDateRange,
    updateCurrencies,

    resetFilters,
    applyFilters,
    hasActiveFilters,
    updatePagination,
  };
};
