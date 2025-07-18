import { useState, useCallback, useMemo } from "react";
import { format } from "date-fns";

export interface FilterState {
  searchName: string;
  customerNumber: string;
  status: string[];
  dateCreated: { startDate: Date | null; endDate: Date | null };
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
    (dateRange: { startDate: Date | null; endDate: Date | null }) => {
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
      const formattedStartDate = format(
        filters?.dateCreated?.startDate,
        "yyyy-MM-dd"
      );
      filterString +=
        filterString === ""
          ? `?date_from=${formattedStartDate}`
          : `&date_from=${formattedStartDate}`;
    }
    
    if (filters?.dateCreated?.endDate) {
      const formattedEndDate = format(
        filters?.dateCreated?.endDate,
        "yyyy-MM-dd"
      );
      filterString +=
        filterString === ""
          ? `?date_to=${formattedEndDate}`
          : `&date_to=${formattedEndDate}`;
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
      filterString +=
        filterString === ""
          ? `?status=${filters?.status.join(",")}`
          : `&status=${filters?.status.join(",")}`;
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