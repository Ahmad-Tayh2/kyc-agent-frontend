import { useState, useCallback, useMemo } from "react";

export interface TransactionFilterState {
  type: string[];
  status: string[];
  currency: string[];
  dateRange: { startDate: string | null; endDate: string | null };
  page: number;
  per_page: number;
}

export function useTransactionFilters() {
  const [filters, setFilters] = useState<TransactionFilterState>({
    type: [],
    status: [],
    currency: [],
    dateRange: {
      startDate: null,
      endDate: null,
    },
    page: 1,
    per_page: 15,
  });

  const [isFiltersApplied, setIsFiltersApplied] = useState(false);

  // Create a querystring from the filters
  const filtersString = useMemo(() => {
    const params = new URLSearchParams();

    // Always include pagination
    params.set("page", String(filters.page));
    params.set("per_page", String(filters.per_page));

    if (isFiltersApplied) {
      // Add transaction types with array format
      if (filters.type.length > 0) {
        filters.type.forEach((type) => {
          params.append("type[]", type);
        });
      }

      // Add status filters with array format
      if (filters.status.length > 0) {
        filters.status.forEach((status) => {
          params.append("status[]", status);
        });
      }

      // Add currency filters
      if (filters.currency.length > 0) {
        filters.currency.forEach((currency) => {
          params.append("currency", currency);
        });
      }

      // Add date range filters
      if (filters.dateRange.startDate) {
        params.append("date_from", filters.dateRange.startDate);
      }
      if (filters.dateRange.endDate) {
        params.append("date_to", filters.dateRange.endDate);
      }
    }

    return params.toString();
  }, [filters, isFiltersApplied]);

  // Update filters functions
  const updateType = useCallback((type: string[]) => {
    setFilters((prev) => ({ ...prev, type }));
  }, []);

  const updateStatus = useCallback((status: string[]) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const updateCurrency = useCallback((currency: string[]) => {
    setFilters((prev) => ({ ...prev, currency }));
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
      type: [],
      status: [],
      currency: [],
      dateRange: {
        startDate: null,
        endDate: null,
      },
      page: 1,
      per_page: 15,
    });
    setIsFiltersApplied(false);
  }, []);

  // Apply filters to trigger the API call
  const applyFilters = useCallback(() => {
    setIsFiltersApplied(true);
  }, []);

  const updatePagination = useCallback(
    (pagination: { page?: number; per_page?: number }) => {
      setFilters((prev) => ({
        ...prev,
        ...(pagination.page !== undefined && { page: pagination.page }),
        ...(pagination.per_page !== undefined && {
          per_page: pagination.per_page,
          page: 1,
        }),
      }));
    },
    []
  );

  return {
    filters,
    filtersString,
    updateType,
    updateStatus,
    updateCurrency,
    updateDateRange,
    resetFilters,
    applyFilters,
    updatePagination,
  };
}
