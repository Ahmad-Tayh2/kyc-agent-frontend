import React from "react";
import { SearchInput } from "@/components/shared/SearchInput";
import { FilterButton } from "@/components/shared/FilterButton";
import MultiSelectDropdown from "@/components/shared/MultiSelectDropdown";
import DatePicker from "@/components/shared/DatePicker";
import { SingleSelectDropdown } from "@/components/shared/SingleSelectDropdown";
import type { TransferFilterState } from "@/hooks/data/useTransferFilters";
import type { TransferStatus } from "@/types/transfers";
import { CURRENCY_COUNTRY_CODE } from "@/constants/currencies";

const TRANSFER_STATUSES: TransferStatus[] = [
  "pending",
  "processing",
  "completed",
  "failed",
  "cancelled",
  "refunded",
];

const statusOptions = TRANSFER_STATUSES.map((status) => ({
  value: status,
  label: status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
}));

const currencyOptions = Object.keys(CURRENCY_COUNTRY_CODE).map((currency) => ({
  value: currency,
  label: currency,
}));

interface TransferFiltersProps {
  filters: TransferFilterState;
  onUpdateSearchTerm: (search: string) => void;
  onUpdateStatus: (status: TransferStatus[]) => void;
  onUpdateSendingDate: (date: string) => void;
  onUpdateReceiveCurrency: (currency: string) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

const TransferFilters: React.FC<TransferFiltersProps> = ({
  filters,
  onUpdateSearchTerm,
  onUpdateStatus,
  onUpdateSendingDate,
  onUpdateReceiveCurrency,
  onResetFilters,
  onApplyFilters,
}) => {
  return (
    <div className="flex items-center justify-between flex-wrap">
      <SearchInput
        placeholder="Search transfers..."
        value={filters.search ?? ""}
        onChange={onUpdateSearchTerm}
      />
      <div className="flex items-center justify-start w-fit gap-1 flex-wrap">
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
              onChange={(value) => onUpdateStatus(value as TransferStatus[])}
              showSelectAll
            />
            <DatePicker
              value={filters.sending_date || ""}
              onChange={onUpdateSendingDate}
            />
            <SingleSelectDropdown
              options={currencyOptions}
              selectedValue={filters.receive_currency || ""}
              onValueChange={onUpdateReceiveCurrency}
              placeholder="Select currency"
            />
          </div>
        </FilterButton>
      </div>
    </div>
  );
};

export default TransferFilters;
