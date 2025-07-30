import { useState, useCallback } from "react";
import { appendQueryParam } from "@/utils/queryHelpers";

export interface RecipientsFilterState {
  search_term?: string;
  customer_ids?: string[];
  country_id?: number;
  remittance_method_ids?: string[];
  ids?: string[];
  added_by?: number;
}

export const useRecipientsFilters = () => {
  const [filters, setFilters] = useState<RecipientsFilterState>({
    search_term: "",
    customer_ids: [],
    country_id: undefined,
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

  const updateCuntryId = useCallback((country_id: number) => {
    setFilters((prev) => ({ ...prev, country_id }));
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

  const resetFilters = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      status: [],
      dateCreated: { startDate: null, endDate: null },
      country: [],
    }));

    let filterString: string = "";
    if (filters?.search_term) {
      filterString = appendQueryParam(
        filterString,
        "search_term",
        filters.search_term
      );
    }
    //do not reset the numbers also
    setFilterString(filterString);
  }, [filters?.search_term]);

  const applyFilters = useCallback(() => {
    let filterString: string = "";

    if (filters?.search_term) {
      filterString = appendQueryParam(
        filterString,
        "search_term",
        filters.search_term
      );
    }

    if (filters?.customer_ids && filters.customer_ids.length > 0) {
      filterString = appendQueryParam(
        filterString,
        "customer_ids",
        filters.customer_ids
      );
    }
    if (filters?.country_id) {
      filterString = appendQueryParam(
        filterString,
        "country_id",
        filters.country_id
      );
    }
    if (
      filters?.remittance_method_ids &&
      filters.remittance_method_ids.length > 0
    ) {
      filterString = appendQueryParam(
        filterString,
        "remittance_method_ids",
        filters.remittance_method_ids
      );
    }
    if (filters?.ids && filters.ids?.length > 0) {
      filterString = appendQueryParam(filterString, "ids", filters.ids);
    }
    if (filters?.added_by) {
      filterString = appendQueryParam(
        filterString,
        "added_by",
        filters.added_by
      );
    }

    setFilterString(filterString);
  }, [filters]);

  return {
    filters,
    filtersString,
    updateSearchTerm,
    updateCustomersIds,
    updateCuntryId,
    updateRemittanceMethodIds,
    updateIds,
    updateAddedBy,

    resetFilters,
    applyFilters,
  };
};
