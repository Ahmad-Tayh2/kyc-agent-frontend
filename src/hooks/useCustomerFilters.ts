import { useState, useCallback, useMemo } from "react";
import { format } from "date-fns";

export interface FilterState {
  searchName: string;
  customerNumber: string;
  status: string[];
  dateCreated: { startDate: string | null; endDate: string | null };
  country: string[];
}

export const useCustomerFilters = () => {
  const [filters, setFilters] = useState<FilterState>({
    searchName: "",
    customerNumber: "",
    status: [],
    dateCreated: { startDate: null, endDate: null },
    country: [],
  });

  const [filtersString, setFilterString] = useState<string>("");

  // Update functions for each filter
  const updateSearchName = useCallback((name: string) => {
    setFilters((prev) => ({ ...prev, searchName: name }));
  }, []);

  const updateCustomerNumber = useCallback((number: string) => {
    setFilters((prev) => ({ ...prev, customerNumber: number }));
  }, []);

  const updateStatus = useCallback((status: string[]) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const updateDateCreated = useCallback(
    (dateRange: { startDate: string | null; endDate: string | null }) => {
      setFilters((prev) => ({ ...prev, dateCreated: dateRange }));
    },
    []
  );

  const updateCountry = useCallback((country: string[]) => {
    setFilters((prev) => ({ ...prev, country }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      status: [],
      dateCreated: { startDate: null, endDate: null },
      country: [],
    }));

    // Keep search filters but reset others
    let filterString: string = "";
    if (filters?.searchName) {
      filterString +=
        filterString === ""
          ? `?search=${filters?.searchName}`
          : `&search=${filters?.searchName}`;
    }
    if (filters?.customerNumber) {
      filterString +=
        filterString === ""
          ? `?customer_number=${filters?.customerNumber}`
          : `&customer_number=${filters?.customerNumber}`;
    }
    setFilterString(filterString);
  }, [filters?.searchName, filters?.customerNumber]);

  const applyFilters = useCallback(() => {
    let filterString: string = "";

    if (filters?.dateCreated?.startDate) {
      filterString +=
        filterString === ""
          ? `?date_from=${filters?.dateCreated?.startDate}`
          : `&date_from=${filters?.dateCreated?.startDate}`;
    }

    if (filters?.dateCreated?.endDate) {
      filterString +=
        filterString === ""
          ? `?date_to=${filters?.dateCreated?.endDate}`
          : `&date_to=${filters?.dateCreated?.endDate}`;
    }

    if (filters?.searchName) {
      filterString +=
        filterString === ""
          ? `?search=${filters?.searchName}`
          : `&search=${filters?.searchName}`;
    }

    if (filters?.customerNumber) {
      filterString +=
        filterString === ""
          ? `?customer_number=${filters?.customerNumber}`
          : `&customer_number=${filters?.customerNumber}`;
    }

    if (filters?.status.length > 0) {
      const jsonString = JSON.stringify(filters?.status);
      const encodedString = encodeURIComponent(jsonString);
      filterString +=
        filterString === ""
          ? `?status=${encodedString}`
          : `&status=${encodedString}`;
    }

    if (filters?.country.length > 0) {
      filterString +=
        filterString === ""
          ? `?country=${filters?.country.join(",")}`
          : `&country=${filters?.country.join(",")}`;
    }

    setFilterString(filterString);
  }, [filters]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.status.length > 0 ||
      filters.dateCreated.startDate !== null ||
      filters.dateCreated.endDate !== null ||
      filters.country.length > 0
    );
  }, [filters]);

  return {
    filters,
    filtersString,
    updateSearchName,
    updateCustomerNumber,
    updateStatus,
    updateDateCreated,
    updateCountry,
    resetFilters,
    applyFilters,
    hasActiveFilters,
  };
};
