import React from "react";
import { SearchInput } from "@/components/SearchInput";
import { FilterButton } from "@/components/FilterButton";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import DateRangeSelector from "@/components/DateRangeSelector";
import CountrySelector from "@/components/CountrySelector";
import { useCountries } from "@/hooks/useAddress";
import type { FilterState } from "@/hooks/useCustomerFilters";

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "kyc_identity", label: "KYC Identity" },
  { value: "kyc_income", label: "KYC Income" },
  { value: "banned", label: "Banned" },
];

interface CustomerFiltersProps {
  filters: FilterState;
  onUpdateSearchName: (name: string) => void;
  onUpdateCustomerNumber: (number: string) => void;
  onUpdateStatus: (status: string[]) => void;
  onUpdateDateCreated: (dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  }) => void;
  onUpdateCountry: (country: string[]) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  filters,
  onUpdateSearchName,
  onUpdateCustomerNumber,
  onUpdateStatus,
  onUpdateDateCreated,
  onUpdateCountry,
  onResetFilters,
  onApplyFilters,
}) => {
  const { data: countriesData = [] } = useCountries();

  const countries = React.useMemo(() => {
    if (!countriesData) return [];
    return countriesData?.map((country: any) => ({
      code: country?.iso2,
      name: country.name,
    }));
  }, [countriesData]);

  return (
    <div className="flex items-center justify-between flex-wrap">
      <SearchInput
        placeholder="Search by customer's name or phone"
        value={filters.searchName}
        onChange={onUpdateSearchName}
      />
      <div className="flex items-center justify-start w-fit gap-1 flex-wrap">
        <SearchInput
          placeholder="Search by customer's number"
          value={filters.customerNumber}
          onChange={onUpdateCustomerNumber}
        />
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
              value={filters.status}
              onChange={onUpdateStatus}
            />
            <DateRangeSelector
              label="Date"
              placeholder="Select date range"
              value={filters.dateCreated}
              onChange={onUpdateDateCreated}
            />
            <CountrySelector
              label="Country"
              placeholder="Select countries"
              countries={countries}
              value={filters.country}
              onChange={onUpdateCountry}
            />
          </div>
        </FilterButton>
      </div>
    </div>
  );
};

export default CustomerFilters;
