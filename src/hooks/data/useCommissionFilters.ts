import type { paginationProps } from "@/types/shared/pagination";
import {
  createFilterApply,
  createFilterReset,
  createHasActiveFilters,
} from "@/utils/filterHelpers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "../utils/useDebounce";

export interface CommissionEarnedFilterState {
  search?: string;
  status?: string[];
  send_countries?: number[];
  receive_countries?: number[];
  date_from?: string;
  date_to?: string;
  //pagination
  page?: number;
  per_page?: number;
}

export const useCommissionFilters = () => {
  const [filters, setFilters] = useState<CommissionEarnedFilterState>({
    search: "",
    status: [],
    send_countries: [],
    receive_countries: [],
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

  // Update functions for each filter
  const updateSearchTerm = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const updateTransactionStatus = useCallback((status: string[]) => {
    setFilters((prev) => ({ ...prev, status }));
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
  const updateSendingCountry = useCallback((send_countries: number[]) => {
    setFilters((prev) => ({ ...prev, send_countries }));
  }, []);
  const updateReceivedCountry = useCallback((receive_countries: number[]) => {
    setFilters((prev) => ({ ...prev, receive_countries }));
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
    updateSearchTerm,

    updateTransactionStatus,
    updateDateRange,
    updateSendingCountry,
    updateReceivedCountry,

    resetFilters,
    applyFilters,
    hasActiveFilters,
    updatePagination,
  };
};
