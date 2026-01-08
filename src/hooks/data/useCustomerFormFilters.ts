import type { paginationProps } from "@/types/shared/pagination";
import { createFilterApply, createFilterReset } from "@/utils/filterHelpers";
import { useState, useCallback, useEffect } from "react";

export interface CustomerFormFilterState {
  search?: string;
  status: string[];
  created_from?: string | null;
  created_to?: string | null;
  //pagination
  page?: number;
  per_page?: number;
}

export function useCustomerFormFilters() {
  const [filters, setFilters] = useState<CustomerFormFilterState>({
    search: "",
    status: [],
    created_from: "",
    created_to: "",
    //pagination
    page: 1,
    per_page: 10,
  });
  const [filtersString, setFilterString] = useState<string>("");

  useEffect(() => {
    applyFilters();
  }, [filters?.per_page, filters?.page]);

  // Create a querystring from the filters
  // const filtersString = useMemo(() => {
  //   if (!isFiltersApplied) return "";

  //   const params = new URLSearchParams();

  //   // Add status filters with array format
  //   if (filters.status.length > 0) {
  //     filters.status.forEach((status) => {
  //       params.append("status[]", status);
  //     });
  //   }

  //   // Add date range filters
  //   if (filters.dateRange.startDate) {
  //     params.append("created_from", filters.dateRange.startDate);
  //   }
  //   if (filters.dateRange.endDate) {
  //     params.append("created_to", filters.dateRange.endDate);
  //   }

  //   return params.toString();
  // }, [filters, isFiltersApplied]);

  // Update filters functions
  const updateStatus = useCallback((status: string[]) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const updateDateRange = useCallback(
    (dateRange: { startDate: string | null; endDate: string | null }) => {
      setFilters((prev) => ({
        ...prev,
        created_from: dateRange?.startDate,
        created_to: dateRange?.endDate,
      }));
    },
    []
  );

  // Reset all filters

  const resetFilters = useCallback(
    createFilterReset(filters, setFilters, setFilterString, ["search"]),
    [filters]
  );

  const applyFilters = useCallback(
    createFilterApply({ ...filters }, setFilterString),
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
    updateDateRange,
    updatePagination,
    resetFilters,
    applyFilters,
  };
}
