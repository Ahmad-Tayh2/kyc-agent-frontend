import React from "react";
import { FilterButton } from "@/components/shared/FilterButton";
import type { AccountStatementsFilterState } from "@/hooks/data/useAccountStatementsFilters";
import { ExportButton } from "../shared/ExportButton";
import MultiSelectDropdown from "../shared/MultiSelectDropdown";
import DateRangeSelector from "../shared/DateRangeSelector";
import { useCurrencies } from "@/hooks/data/useCurrency";
import { TRASACTIONS_TYPES } from "@/constants/appConstants";

interface AccountStatementsFiltersProps {
  filters: AccountStatementsFilterState;
  onUpdateTypes: (type: string[]) => void;
  onUpdateDateRange: (dateRange: {
    startDate: string | null;
    endDate: string | null;
  }) => void;
  onUpdateCurrencies: (currencies: string[]) => void;

  onResetFilters: () => void;
  onApplyFilters: () => void;
}
const typeOptions = TRASACTIONS_TYPES.map((type) => ({
  value: type,
  label: type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
}));
const AccountStatementsFilters: React.FC<AccountStatementsFiltersProps> = ({
  filters,

  onUpdateTypes,
  onUpdateDateRange,
  onUpdateCurrencies,

  onResetFilters,
  onApplyFilters,
}) => {
  const exportCommissionOptions = [
    { label: "Export to Excel", onClick: () => {} },
    { label: "Export to PDF", onClick: () => {} },
  ];
  const dateRangeValue = {
    startDate: filters.date_from || null,
    endDate: filters.date_to || null,
  };
  const { data: currencies = [] } = useCurrencies();

  const currencyOptions =
    currencies?.map((currency: any) => ({
      label: `${currency?.code} - ${currency?.name}`,
      value: currency?.code,
    })) || [];

  return (
    <div className="flex items-center justify-between flex-wrap">
      <div className="flex items-center justify-start w-fit gap-1 flex-wrap">
        <ExportButton options={exportCommissionOptions} />
        <FilterButton
          onClick={() => {}}
          onResetClick={onResetFilters}
          onApplyFilters={onApplyFilters}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <MultiSelectDropdown
              label="Type"
              placeholder="All"
              options={typeOptions}
              value={filters.type ?? []}
              onChange={onUpdateTypes}
              showSelectAll
            />
            <DateRangeSelector
              label="Reg. date"
              placeholder="Select date range"
              value={dateRangeValue}
              onChange={onUpdateDateRange}
            />
            <MultiSelectDropdown
              label={"Currency"}
              placeholder={"Select currency"}
              options={currencyOptions}
              value={filters.currencies}
              onChange={onUpdateCurrencies}
            />
          </div>
        </FilterButton>
      </div>
    </div>
  );
};

export default AccountStatementsFilters;
