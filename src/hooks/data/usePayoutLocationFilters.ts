import type { paginationProps } from "@/types/shared/pagination";
import {
  createFilterApply,
  createFilterReset,
  createHasActiveFilters,
} from "@/utils/filterHelpers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "../utils/useDebounce";

export interface PayoutLocationFilterState {
  search?: string;
  country_codes?: string[];
  //pagination
  page?: number;
  per_page?: number;
}

export const usePayoutLocationFilters = () => {
  const [filters, setFilters] = useState<PayoutLocationFilterState>({
    search: "",
    country_codes: [],
    //pagination
    page: 1,
    per_page: 15,
  });
  const debouncedSearch = useDebounce(filters?.search);

  const [filtersString, setFilterString] = useState<string>("");
  useEffect(() => {
    applyFilters();
  }, [debouncedSearch, filters?.per_page, filters?.page, filters?.country_codes]);
  // Update functions for each filter
  const updateSearchTerm = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const updateCountryFilter = useCallback((country_codes: string[]) => {
    setFilters((prev) => ({ ...prev, country_codes, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    createFilterReset(filters, setFilters, setFilterString, [
      "search",
      // "country_codes",
    ])();
  }, [filters]);

  const applyFilters = useCallback(() => {
    createFilterApply(
      { ...filters, search: debouncedSearch },
      setFilterString
    )();
  }, [filters, debouncedSearch]);

  // useEffect(() => {
  //   applyFilters();
  // }, [applyFilters]);

  const hasActiveFilters = useMemo(
    () => createHasActiveFilters(filters, ["search", "country_codes"]),
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
    updateCountryFilter,
    resetFilters,
    applyFilters,
    hasActiveFilters,
    updatePagination,
  };
};
