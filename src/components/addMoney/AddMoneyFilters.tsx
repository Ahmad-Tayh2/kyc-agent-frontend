import React from "react";
import { FilterButton } from "@/components/shared/FilterButton";
import { ExportButton } from "../shared/ExportButton";
import type { AddMoneyTransactionsFilterState } from "@/hooks/data/useAddMoneyFilters";
import MultiSelectDropdown from "../shared/MultiSelectDropdown";
import { ADD_MONEY_TRANSACTIONS_STATUS } from "@/constants/appConstants";

const statusOptions = ADD_MONEY_TRANSACTIONS_STATUS.map((status) => ({
  value: status,
  label: status,
}));
interface AddMoneyFiltersProps {
  filters: AddMoneyTransactionsFilterState;
  onUpdateStatus: (status: string[]) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

const AddMoneyFilters: React.FC<AddMoneyFiltersProps> = ({
  filters,
  onUpdateStatus,
  onResetFilters,
  onApplyFilters,
}) => {
  const exportCommissionOptions = [
    { label: "Export to Excel", onClick: () => {} },
    { label: "Export to PDF", onClick: () => {} },
  ];
  return (
    <div className="flex items-center justify-between flex-wrap">
      <div className="flex items-center justify-start w-fit gap-1 flex-wrap">
        <ExportButton options={exportCommissionOptions} />
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
            {/* 
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

export default AddMoneyFilters;
