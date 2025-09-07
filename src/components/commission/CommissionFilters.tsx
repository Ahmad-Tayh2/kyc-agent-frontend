import React from "react";
import { SearchInput } from "@/components/shared/SearchInput";
import { FilterButton } from "@/components/shared/FilterButton";
import type { CustomerFilterState } from "@/hooks/data/useCustomerFilters";
import { ExportButton } from "../shared/ExportButton";

interface CommissionFiltersProps {
  filters: CustomerFilterState;
  onUpdateSearchTerm: (search: string) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

const CommissionFilters: React.FC<CommissionFiltersProps> = ({
  filters,
  onUpdateSearchTerm,
  onResetFilters,
  onApplyFilters,
}) => {
  const exportCommissionOptions = [
    { label: "Export to Excel", onClick: () => {} },
    { label: "Export to PDF", onClick: () => {} },
  ];
  return (
    <div className="flex items-center justify-between flex-wrap">
      <SearchInput
        placeholder="Search either for Sender/Customer or Receiver/Recipient names"
        value={filters.search ?? ""}
        onChange={onUpdateSearchTerm}
      />
      <div className="flex items-center justify-start w-fit gap-1 flex-wrap">
        <ExportButton options={exportCommissionOptions} />
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
            {/* <MultiSelectDropdown
              label="Status"
              placeholder="All"
              options={statusOptions}
              value={filters.status ?? []}
              onChange={onUpdateStatus}
              showSelectAll
            />
            <DateRangeSelector
              label="Reg. date"
              placeholder="Select date range"
              value={dateRangeValue}
              onChange={onUpdateDateRange}
            />
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

export default CommissionFilters;
