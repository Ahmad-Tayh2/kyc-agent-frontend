import { useState, useCallback, useMemo } from "react";
import {
  createFilterApply,
  createFilterReset,
  createHasActiveFilters,
} from "@/utils/filterHelpers";
import type { BaseFilterState } from "@/utils/filterHelpers";
import type { TransferStatus } from "@/types/transfers";

export type TransferPaginationProps = {
  page?: number;
  per_page?: number;
};

export interface TransferFilterState extends BaseFilterState {
  status?: TransferStatus[];
  sending_date?: string;
  receive_currency?: string;
  page?: number;
  per_page?: number;
}

export const useTransferFilters = () => {
  const [filters, setFilters] = useState<TransferFilterState>({
    search: "",
    status: [],
    sending_date: "",
    receive_currency: "",
    page: 1,
    per_page: 20,
  });

  const [filtersString, setFilterString] = useState<string>("");

  // Update functions for each filter
  const updateSearchTerm = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const updateStatus = useCallback((status: TransferStatus[]) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const updateSendingDate = useCallback((sending_date: string) => {
    setFilters((prev) => ({ ...prev, sending_date }));
  }, []);

  const updateReceiveCurrency = useCallback((receive_currency: string) => {
    setFilters((prev) => ({ ...prev, receive_currency }));
  }, []);

  const resetFilters = useCallback(
    createFilterReset(filters, setFilters, setFilterString, ["search"]),
    [filters]
  );

  const applyFilters = useCallback(
    createFilterApply(filters, setFilterString),
    [filters]
  );

  const hasActiveFilters = useMemo(
    () => createHasActiveFilters(filters, ["search"]),
    [filters]
  );

  const updatePagination = (pagination: TransferPaginationProps) => {
    let updatedFilters: TransferPaginationProps = {};
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
    updateStatus,
    updateSendingDate,
    updateReceiveCurrency,
    resetFilters,
    applyFilters,
    hasActiveFilters,
    updatePagination,
  };
}; 