import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  createFilterApply,
  createFilterReset,
  createHasActiveFilters,
} from "@/utils/filterHelpers";
import { useDebounce } from "../utils/useDebounce";
import type { paginationProps } from "@/types/shared/pagination";
import { useSearchParams } from "react-router-dom";

export interface RecipientsFilterState {
  search?: string;
  customer_ids?: string[];
  countries?: number[];
  remittance_methods_ids?: string[];
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
    countries: [],
    remittance_methods_ids: [],
    ids: [],
    added_by: undefined,
    //pagination
    page: 1,
    per_page: 10,
  });

  const debouncedSearch = useDebounce(filters?.search);
  const [searchParams] = useSearchParams();
  const [filtersString, setFilterString] = useState<string>("");
  const hasInitializedFromURL = useRef(false);

  // 1) Initialize filters from URL only once
  useEffect(() => {
    if (hasInitializedFromURL.current) return;

    const customers = searchParams?.getAll("customer_ids");
    if (customers && customers.length > 0) {
      updateCustomersIds(customers);
    }

    hasInitializedFromURL.current = true;

    // Now trigger the FIRST API call after restoring URL filters
    applyFilters();
  }, [searchParams]);

  // 2) Normal filters updates (search, pagination…)
  useEffect(() => {
    if (!hasInitializedFromURL.current) return; // Don't run until initial load is done
    applyFilters();
  }, [debouncedSearch, filters?.per_page, filters?.page, filtersString]);

  const updateSearchTerm = useCallback((term: string) => {
    setFilters((prev) => ({ ...prev, search: term }));
  }, []);

  const updateCustomersIds = useCallback((customer_ids: string[]) => {
    setFilters((prev) => ({ ...prev, customer_ids }));
  }, []);

  const updateCountryIds = useCallback((countries: number[]) => {
    setFilters((prev) => ({ ...prev, countries }));
  }, []);

  const updateRemittanceMethodIds = useCallback(
    (remittance_methods_ids: string[]) => {
      setFilters((prev) => ({ ...prev, remittance_methods_ids }));
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
