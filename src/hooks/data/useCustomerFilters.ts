import { useState, useCallback, useMemo, useEffect } from "react";
import {
  createFilterApply,
  createFilterReset,
  createHasActiveFilters,
} from "@/utils/filterHelpers";
import { useDebounce } from "../utils/useDebounce";

export interface CustomerFilterState {
  search?: string;
  reference_number?: string;
  status?: string[];
  countries?: number[];
  date_from?: string;
  date_to?: string;
}

export const useCustomerFilters = () => {
  const [filters, setFilters] = useState<CustomerFilterState>({
    search: "",
    reference_number: "",
    status: [],
    countries: [],
    date_from: "",
    date_to: "",
  });
  const debouncedSearch = useDebounce(filters?.search);

  const [filtersString, setFilterString] = useState<string>("");

  useEffect(() => {
    applyFilters();
  }, [debouncedSearch]);

  // Update functions for each filter
  const updateSearchTerm = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
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

  const updateCountryIds = useCallback((countries: number[]) => {
    setFilters((prev) => ({ ...prev, countries }));
  }, []);

  const resetFilters = useCallback(
    createFilterReset(filters, setFilters, setFilterString, [
      "search",
      "reference_number",
    ]),
    [filters]
  );

  const applyFilters = useCallback(
    createFilterApply({ ...filters, search: debouncedSearch }, setFilterString),
    [filters, debouncedSearch]
  );

  const hasActiveFilters = useMemo(
    () => createHasActiveFilters(filters, ["search", "reference_number"]),
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
