import React from "react";
// import { SearchInput } from "@/components/shared/SearchInput";
import { FilterButton } from "@/components/shared/FilterButton";
// import MultiSelectDropdown from "@/components/shared/MultiSelectDropdown";
// import DateRangeSelector from "@/components/shared/DateRangeSelector";
// import CountrySelector from "@/components/shared/CountrySelector";
// import { useCountries } from "@/hooks/data/useAddress";
import type { PaymentLinksFilterState } from "@/hooks/data/usePaymentLinksFilters";
import DateRangeSelector from "../shared/DateRangeSelector";
import MultiSelectDropdown from "../shared/MultiSelectDropdown";
import type { CustomerType } from "@/types/customers";
import { PAYMENT_LINKS_STATUSES } from "@/constants/appConstants";

const statusOptions = PAYMENT_LINKS_STATUSES.map((status) => ({
  value: status,
  label: status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
}));

interface PaymentLinksFiltersProps {
  filters: PaymentLinksFilterState;
  customers: CustomerType[];
  onUpdateStatus: (status: string[]) => void;
  onUpdateDateRange: (dateRange: {
    startDate: string | null;
    endDate: string | null;
  }) => void;
  onUpdateCustomersIds: (customer_ids: string[]) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

const PaymentLinksFilters: React.FC<PaymentLinksFiltersProps> = ({
  filters,
  customers,
  onUpdateStatus,
  onUpdateDateRange,
  onUpdateCustomersIds,
  onResetFilters,
  onApplyFilters,
}) => {
  const customersOptions = [
    ...customers?.map((customer: CustomerType) => ({
      label: customer.full_name,
      value: customer.id,
    })),
  ];
  const dateRangeValue = {
    startDate: filters.created_from || null,
    endDate: filters.created_to || null,
  };
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
              options={customersOptions}
              value={filters.customer_ids ?? []}
              onChange={onUpdateCustomersIds}
              isSearchable
              checkboxPlacement="right"
            />
            <MultiSelectDropdown
              label="Status"
              placeholder="All"
              options={statusOptions}
              value={filters.status ?? []}
              onChange={onUpdateStatus}
              showSelectAll
            />
          </div>
        </FilterButton>
      </div>
    </div>
  );
};

export default PaymentLinksFilters;
