import { useState, useCallback, useMemo } from "react";
import { createFilterApply, createFilterReset, createHasActiveFilters } from "@/utils/filterHelpers";

export interface RecipientsFilterState {
  search_term?: string;
  customer_ids?: string[];
  country_ids?: number[];
  remittance_method_ids?: string[];
  ids?: string[];
  added_by?: number;
}

export const useRecipientsFilters = () => {
  const [filters, setFilters] = useState<RecipientsFilterState>({
    search_term: "",
    customer_ids: [],
    country_ids: [],
    remittance_method_ids: [],
    ids: [],
    added_by: undefined,
  });

  const [filtersString, setFilterString] = useState<string>("");

  const updateSearchTerm = useCallback((term: string) => {
    setFilters((prev) => ({ ...prev, search_term: term }));
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
    createFilterReset(filters, setFilters, setFilterString, ['search_term']),
    [filters]
  );

  const applyFilters = useCallback(
    createFilterApply(filters, setFilterString),
    [filters]
  );

  const hasActiveFilters = useMemo(
    () => createHasActiveFilters(filters, ['search_term']),
    [filters]
  );

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
  };
};
