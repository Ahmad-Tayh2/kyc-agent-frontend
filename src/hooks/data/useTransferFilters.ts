import { useState, useCallback, useMemo, useEffect } from "react";
import {
  createFilterApply,
  createFilterReset,
  createHasActiveFilters,
} from "@/utils/filterHelpers";
import type { BaseFilterState } from "@/utils/filterHelpers";
import type { TransferStatus } from "@/types/transfers";
import type { paginationProps } from "@/types/shared/pagination";
import { useDebounce } from "@/hooks/utils/useDebounce";

export type TransferPaginationProps = {
  page?: number;
  per_page?: number;
};

export interface TransferFilterState extends BaseFilterState {
  search_term?: string;
  customer_ids?: string[];
  recipient_ids?: string[];
  status?: any[];
  // status?: TransferStatus[];
  sending_date?: string;
  receive_currencies?: string[];
  payment_methods?: string[];
  //pagination
  page?: number;
  per_page?: number;
}

export const useTransferFilters = (initFilters?: TransferFilterState) => {
  const [filters, setFilters] = useState<TransferFilterState>({
    search_term: "",
    status: [],
    customer_ids: [],
    sending_date: "",
    receive_currencies: [],
    payment_methods: [],
    //pagination
    page: 1,
    per_page: 15,
    ...initFilters,
  });
  const [filtersString, setFilterString] = useState<string>("");
  const debouncedSearch = useDebounce(filters?.search_term);

  useEffect(() => {
    applyFilters();
  }, [debouncedSearch, filters?.per_page, filters?.page]);
  // Update functions for each filter
  const updateSearchTerm = useCallback((search_term: string) => {
    setFilters((prev) => ({ ...prev, search_term }));
  }, []);

  const updateStatus = useCallback((status: TransferStatus[]) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);
  const updateCustomersIds = useCallback((customer_ids: string[]) => {
    setFilters((prev) => ({ ...prev, customer_ids }));
  }, []);
  const updateRecipientsIds = useCallback((recipient_ids: string[]) => {
    setFilters((prev: any) => ({ ...prev, recipient_ids }));
  }, []);
  const updateSendingDate = useCallback((sending_date: string) => {
    setFilters((prev) => ({ ...prev, sending_date }));
  }, []);

  const updateReceiveCurrency = useCallback((receive_currencies: string[]) => {
    setFilters((prev: any) => ({ ...prev, receive_currencies }));
  }, []);
  const updatePaymentMethods = useCallback((payment_methods: string[]) => {
    setFilters((prev: any) => ({ ...prev, payment_methods }));
  }, []);

  const resetFilters = useCallback(
    createFilterReset(filters, setFilters, setFilterString, ["search_term"]),
    [filters],
  );

  const applyFilters = useCallback(
    createFilterApply(
      { ...filters, search_term: debouncedSearch },
      setFilterString,
    ),
    [filters, debouncedSearch],
  );

  const hasActiveFilters = useMemo(
    () => createHasActiveFilters(filters, ["search_term"]),
    [filters],
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
    updateStatus,
    updateCustomersIds,
    updateRecipientsIds,
    updateSendingDate,
    updateReceiveCurrency,
    updatePaymentMethods,
    resetFilters,
    applyFilters,
    hasActiveFilters,
    updatePagination,
  };
};
