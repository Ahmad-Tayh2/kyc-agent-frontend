import { useState, useCallback, useEffect } from "react";
import { createFilterApply, createFilterReset } from "@/utils/filterHelpers";
import { useDebounce } from "../utils/useDebounce";
import type { paginationProps } from "@/types/shared/pagination";

export interface PaymentLinksFilterState {
  search?: string;
  customer_ids?: string[];
  created_from?: string;
  created_to?: string;
  status: string[];
  //pagination
  page?: number;
  per_page?: number;
}

export const usePaymentLinksFilters = () => {
  const [filters, setFilters] = useState<PaymentLinksFilterState>({
    search: "",
    customer_ids: [],
    status: [],
    created_from: "",
    created_to: "",
    //pagination
    page: 1,
    per_page: 1,
  });
  const debouncedSearch = useDebounce(filters?.search);

  const [filtersString, setFilterString] = useState<string>("");

  useEffect(() => {
    applyFilters();
  }, [debouncedSearch, filters?.per_page, filters?.page]);

  const updateCustomersIds = useCallback((customer_ids: string[]) => {
    setFilters((prev) => ({ ...prev, customer_ids }));
  }, []);
  const updateStatus = useCallback((status: string[]) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const updateDateRange = useCallback(
    (dateRange: { startDate: string | null; endDate: string | null }) => {
      setFilters((prev) => ({
        ...prev,
        created_from: dateRange.startDate || "",
        created_to: dateRange.endDate || "",
      }));
    },
    []
  );

  const resetFilters = useCallback(
    createFilterReset(filters, setFilters, setFilterString, ["search"]),
    [filters]
  );

  const applyFilters = useCallback(
    createFilterApply({ ...filters, search: debouncedSearch }, setFilterString),
    [filters, debouncedSearch]
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
    updateStatus,
    updateDateRange,
    updateCustomersIds,
    resetFilters,
    applyFilters,
    updatePagination,
  };
};
