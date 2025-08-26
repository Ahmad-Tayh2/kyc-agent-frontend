import React from "react";
// import { SearchInput } from "@/components/shared/SearchInput";
import { FilterButton } from "@/components/shared/FilterButton";
// import MultiSelectDropdown from "@/components/shared/MultiSelectDropdown";
// import DateRangeSelector from "@/components/shared/DateRangeSelector";
// import CountrySelector from "@/components/shared/CountrySelector";
// import { useCountries } from "@/hooks/data/useAddress";
import type { CustomerFilterState } from "@/hooks/data/useCustomerFilters";
import DateRangeSelector from "../shared/DateRangeSelector";
import MultiSelectDropdown from "../shared/MultiSelectDropdown";
// import { CUSTOMER_STATUSES } from "@/constants/appConstants";

// const statusOptions = CUSTOMER_STATUSES.map((status) => ({
//   value: status,
//   label: status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
// }));

interface PaymentLinksFiltersProps {
  filters: CustomerFilterState;
  // onUpdateReferenceNumber: (reference_number: string) => void;
  onUpdateStatus: (status: string[]) => void;
  onUpdateDateRange: (dateRange: {
    startDate: string | null;
    endDate: string | null;
  }) => void;
  onUpdateCustomersIds: (countries: number[]) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

const PaymentLinksFilters: React.FC<PaymentLinksFiltersProps> = ({
  filters,
  // onUpdateReferenceNumber,
  onUpdateStatus,
  onUpdateDateRange,
  // onUpdateCustomersIds,
  onResetFilters,
  onApplyFilters,
}) => {
  const dateRangeValue = {
    startDate: filters.date_from || null,
    endDate: filters.date_to || null,
  };

  // const customersOptions = [
  //   ...customers?.map((customer: CustomerType) => ({
  //     label: customer.full_name,
  //     value: customer.id,
  //   })),
  // ];

  return (
    <div className="flex items-center justify-between flex-wrap">
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
            <DateRangeSelector
              label="Reg. date"
              placeholder="Select date range"
              value={dateRangeValue}
              onChange={onUpdateDateRange}
            />
            <MultiSelectDropdown
              label="Customers"
              placeholder="All"
              options={[]}
              value={[]}
              onChange={() => {}}
              isSearchable
              checkboxPlacement="right"
            />
            <MultiSelectDropdown
              label="Status"
              placeholder="All"
              options={[]}
              value={filters.status ?? []}
              onChange={onUpdateStatus}
              showSelectAll
            />
            {/* 
        
            <CountrySelector
              label="Country"
              placeholder="Select countries"
              countries={countries}
              value={filters.countries ?? []}
              onChange={onUpdateCountryIds}
            /> */}
          </div>
        </FilterButton>
      </div>
    </div>
  );
};

export default PaymentLinksFilters;
