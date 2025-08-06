import React from "react";
import { SearchInput } from "@/components/shared/SearchInput";
import { FilterButton } from "@/components/shared/FilterButton";
import MultiSelectDropdown from "@/components/shared/MultiSelectDropdown";
import DateRangeSelector from "@/components/shared/DateRangeSelector";
import CountrySelector from "@/components/shared/CountrySelector";
import { useCountries } from "@/hooks/data/useAddress";
import type { CustomerFilterState } from "@/hooks/data/useCustomerFilters";
import { CUSTOMER_STATUSES } from "@/constants/appConstants";

const statusOptions = CUSTOMER_STATUSES.map((status) => ({
  value: status,
  label: status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
}));

interface CustomerFiltersProps {
  filters: CustomerFilterState;
  onUpdateSearchTerm: (search: string) => void;
  onUpdateReferenceNumber: (reference_number: string) => void;
  onUpdateStatus: (status: string[]) => void;
  onUpdateDateRange: (dateRange: {
    startDate: string | null;
    endDate: string | null;
  }) => void;
  onUpdateCountryIds: (country_ids: number[]) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  filters,
  onUpdateSearchTerm,
  // onUpdateReferenceNumber,
  onUpdateStatus,
  onUpdateDateRange,
  onUpdateCountryIds,
  onResetFilters,
  onApplyFilters,
}) => {
  const { data: countriesData = [] } = useCountries();

  const countries = React.useMemo(() => {
    if (!countriesData) return [];
    return countriesData?.map((country: any) => ({
      id: country.id,
      code: country?.iso2,
      name: country.name,
    }));
  }, [countriesData]);

  const dateRangeValue = {
    startDate: filters.date_from || null,
    endDate: filters.date_to || null,
  };

  return (
    <div className="flex items-center justify-between flex-wrap">
      <SearchInput
        placeholder="Search by customer's name or phone"
        value={filters.search ?? ""}
        onChange={onUpdateSearchTerm}
      />
      <div className="flex items-center justify-start w-fit gap-1 flex-wrap">
        {/* <SearchInput
          placeholder="Search by reference number"
          value={filters.reference_number ?? ""}
          onChange={onUpdateReferenceNumber}
        /> */}
        <FilterButton
          onClick={() => {}}
          onResetClick={onResetFilters}
          onApplyFilters={onApplyFilters}
        >
          <div className="flex gap-2 w-fit">
            <MultiSelectDropdown
              label="Status"
              placeholder="All"
              options={statusOptions}
              value={filters.status ?? []}
              onChange={onUpdateStatus}
              showSelectAll
            />
            <DateRangeSelector
              label="Date"
              placeholder="Select date range"
              value={dateRangeValue}
              onChange={onUpdateDateRange}
            />
            <CountrySelector
              label="Country"
              placeholder="Select countries"
              countries={countries}
              value={filters.country_ids ?? []}
              onChange={onUpdateCountryIds}
            />
          </div>
        </FilterButton>
      </div>
    </div>
  );
};

export default CustomerFilters;
