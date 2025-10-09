import React, { useMemo } from "react";
import { SearchInput } from "@/components/shared/SearchInput";
import { FilterButton } from "@/components/shared/FilterButton";
import MultiSelectDropdown from "@/components/shared/MultiSelectDropdown";
import DatePicker from "@/components/shared/DatePicker";
import { SingleSelectDropdown } from "@/components/shared/SingleSelectDropdown";
import type { TransferFilterState } from "@/hooks/data/useTransferFilters";
import type { TransferStatus } from "@/types/transfers";
import { useCurrencies } from "@/hooks/data/useCurrency";
import type { CustomerType } from "@/types/customers";

const TRANSFER_STATUSES: TransferStatus[] = [
  "draft",
  "in-progress",
  "completed",
  "cancelled",
  "blocked",
  "refunded",
];

const statusOptions = TRANSFER_STATUSES.map((status) => ({
  value: status,
  label: status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
}));

interface TransferFiltersProps {
  filters: TransferFilterState;
  customers: CustomerType[];
  onUpdateSearchTerm: (search: string) => void;
  onUpdateStatus: (status: TransferStatus[]) => void;
  onUpdateCustomersIds: (status: string[]) => void;
  onUpdateSendingDate: (date: string) => void;
  onUpdateReceiveCurrency: (currency: string) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

const TransferFilters: React.FC<TransferFiltersProps> = ({
  filters,
  customers,
  onUpdateSearchTerm,
  onUpdateCustomersIds,
  onUpdateStatus,
  onUpdateSendingDate,
  onUpdateReceiveCurrency,
  onResetFilters,
  onApplyFilters,
}) => {
  const { data: currencies = [] } = useCurrencies();
  const currencyOptions = useMemo(() => {
    return currencies?.map((currency) => ({
      value: currency?.code,
      label: `${currency?.name} (${currency?.code})`,
    }));
  }, [currencies]);

  const customersOptions = [
    ...customers?.map((customer: CustomerType) => ({
      label: customer.full_name,
      value: customer.id,
    })),
  ];
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
              onChange={(value) => onUpdateStatus(value as TransferStatus[])}
              showSelectAll
            />
            <DatePicker
              label="Date"
              value={filters.sending_date || ""}
              onChange={onUpdateSendingDate}
            />
            <SingleSelectDropdown
              label="Currency"
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
