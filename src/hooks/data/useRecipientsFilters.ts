import { useState, useCallback, useMemo, useEffect } from "react";
import {
  createFilterApply,
  createFilterReset,
  createHasActiveFilters,
} from "@/utils/filterHelpers";
import { useDebounce } from "../utils/useDebounce";
import type { paginationProps } from "@/types/shared/pagination";

export interface RecipientsFilterState {
  search?: string;
  customer_ids?: string[];
  country_ids?: number[];
  remittance_method_ids?: string[];
  ids?: string[];
  added_by?: number;
  //pagination
  page?: number;
  per_page?: number;
}

export const useRecipientsFilters = () => {
  const [filters, setFilters] = useState<RecipientsFilterState>({
    search: "",
    customer_ids: [],
    country_ids: [],
    remittance_method_ids: [],
    ids: [],
    added_by: undefined,
    //pagination
    page: 1,
    per_page: 1,
  });
  const debouncedSearch = useDebounce(filters?.search);

  const [filtersString, setFilterString] = useState<string>("");

  useEffect(() => {
    applyFilters();
  }, [debouncedSearch, filters?.per_page, filters?.page]);

  const updateSearchTerm = useCallback((term: string) => {
    setFilters((prev) => ({ ...prev, search: term }));
  }, []);

  const updateCustomersIds = useCallback((customer_ids: string[]) => {
    setFilters((prev) => ({ ...prev, customer_ids }));
  }, []);

  const updateCountryIds = useCallback((country_ids: number[]) => {
    setFilters((prev) => ({ ...prev, country_ids }));
  }, []);

  const updateRemittanceMethodIds = useCallback(
    (remittance_method_ids: string[]) => {
      setFilters((prev) => ({ ...prev, remittance_method_ids }));
    },
    []
  );

  const updateIds = useCallback((ids: string[]) => {
    setFilters((prev) => ({ ...prev, ids }));
  }, []);

  const updateAddedBy = useCallback((added_by: number) => {
    setFilters((prev) => ({ ...prev, added_by }));
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
    let updatedFilters: paginationProps = {};
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
    updateCustomersIds,
    updateCountryIds,
    updateRemittanceMethodIds,
    updateIds,
    updateAddedBy,
    resetFilters,
    applyFilters,
    hasActiveFilters,
    updatePagination,
  };
};
