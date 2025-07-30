import { useState, useCallback, useMemo } from "react";

export interface CustomerFormFilterState {
  status: string[];
  dateRange: { startDate: string | null; endDate: string | null };
}

export function useCustomerFormFilters() {
  const [filters, setFilters] = useState<CustomerFormFilterState>({
    status: [],
    dateRange: {
      startDate: null,
      endDate: null,
    },
  });

  const [isFiltersApplied, setIsFiltersApplied] = useState(false);

  // Create a querystring from the filters
  const filtersString = useMemo(() => {
    if (!isFiltersApplied) return "";

    const params = new URLSearchParams();

    // Add status filters with array format
    if (filters.status.length > 0) {
      filters.status.forEach((status) => {
        params.append("status[]", status);
      });
    }

    // Add date range filters
    if (filters.dateRange.startDate) {
      params.append("created_from", filters.dateRange.startDate);
    }
    if (filters.dateRange.endDate) {
      params.append("created_to", filters.dateRange.endDate);
    }

    return params.toString();
  }, [filters, isFiltersApplied]);

  // Update filters functions
  const updateStatus = useCallback((status: string[]) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const updateDateRange = useCallback(
    (dateRange: { startDate: string | null; endDate: string | null }) => {
      setFilters((prev) => ({ ...prev, dateRange }));
    },
    []
  );

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      status: [],
      dateRange: {
        startDate: null,
        endDate: null,
      },
    });
    setIsFiltersApplied(false);
  }, []);

  // Apply filters to trigger the API call
  const applyFilters = useCallback(() => {
    setIsFiltersApplied(true);
  }, []);

  return {
    filters,
    filtersString,
    updateStatus,
    updateDateRange,
    resetFilters,
    applyFilters,
  };
}
