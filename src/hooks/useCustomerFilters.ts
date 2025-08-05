import { useState, useCallback, useMemo } from "react";
import {
  createFilterApply,
  createFilterReset,
  createHasActiveFilters,
} from "@/utils/filterHelpers";

export interface CustomerFilterState {
  search_term?: string;
  reference_number?: string;
  status?: string[];
  country_ids?: number[];
  date_from?: string;
  date_to?: string;
}

export const useCustomerFilters = () => {
  const [filters, setFilters] = useState<CustomerFilterState>({
    search_term: "",
    reference_number: "",
    status: [],
    country_ids: [],
    date_from: "",
    date_to: "",
  });

  const [filtersString, setFilterString] = useState<string>("");

  // Update functions for each filter
  const updateSearchTerm = useCallback((search_term: string) => {
    setFilters((prev) => ({ ...prev, search_term }));
  }, []);

  const updateReferenceNumber = useCallback((reference_number: string) => {
    setFilters((prev) => ({ ...prev, reference_number }));
  }, []);

  const updateStatus = useCallback((status: string[]) => {
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

  const updateCountryIds = useCallback((country_ids: number[]) => {
    setFilters((prev) => ({ ...prev, country_ids }));
  }, []);

  const resetFilters = useCallback(
    createFilterReset(filters, setFilters, setFilterString, [
      "search_term",
      "reference_number",
    ]),
    [filters]
  );

  const applyFilters = useCallback(
    createFilterApply(filters, setFilterString),
    [filters]
  );

  const hasActiveFilters = useMemo(
    () => createHasActiveFilters(filters, ["search_term", "reference_number"]),
    [filters]
  );

  return {
    filters,
    filtersString,
    updateSearchTerm,
    updateReferenceNumber,
    updateStatus,
    updateDateRange,
    updateCountryIds,
    resetFilters,
    applyFilters,
    hasActiveFilters,
  };
};
