import React, { useMemo } from "react";
import { SearchInput } from "@/components/shared/SearchInput";
import { FilterButton } from "@/components/shared/FilterButton";
import MultiSelectDropdown from "@/components/shared/MultiSelectDropdown";
import DatePicker from "@/components/shared/DatePicker";
import type { TransferFilterState } from "@/hooks/data/useTransferFilters";
import type { TransferStatus } from "@/types/transfers";
import { useCurrencies } from "@/hooks/data/useCurrency";
import type { CustomerType } from "@/types/customers";
import type { RecipientDataType } from "@/types/recipients";
import {
  TRASACTIONS_STATUSES,
  PAYMENT_METHODS,
} from "@/constants/appConstants";

const statusOptions = TRASACTIONS_STATUSES?.map((status) => ({
  value: status,
  label: status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
}));

const paymentMethodsOptions = PAYMENT_METHODS?.map((paymentMethod) => ({
  value: paymentMethod,
  label: paymentMethod
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase()),
}));
interface TransferFiltersProps {
  filters: TransferFilterState;
  customers: CustomerType[];
  recipients: RecipientDataType[];
  onUpdateSearchTerm: (search: string) => void;
  onUpdateStatus: (status: TransferStatus[]) => void;
  onUpdateCustomersIds: (status: string[]) => void;
  onUpdateRecipientsIds: (recipientsIds: string[]) => void;
  onUpdateSendingDate: (date: string) => void;
  onUpdateReceiveCurrency: (currencyIds: string[]) => void;
  onUpdatePaymentMethods: (paymentMethods: string[]) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

const TransferFilters: React.FC<TransferFiltersProps> = ({
  filters,
  customers,
  recipients,
  onUpdateSearchTerm,
  onUpdateCustomersIds,
  onUpdateRecipientsIds,
  onUpdateStatus,
  onUpdateSendingDate,
  onUpdateReceiveCurrency,
  onUpdatePaymentMethods,
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
  const recipientsOptions: any = [
    ...recipients?.map((recipient: RecipientDataType) => ({
      label: recipient.first_name + " " + recipient.last_name,
      value: recipient.id,
    })),
  ];
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <SearchInput
        placeholder="Search transfers..."
        value={filters.search_term ?? ""}
        onChange={onUpdateSearchTerm}
      />
      <div className="flex items-center justify-start w-fit gap-1 flex-wrap">
        <FilterButton
          onClick={() => {}}
          onResetClick={onResetFilters}
          onApplyFilters={onApplyFilters}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
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
              label="Recipients"
              placeholder="All"
              options={recipientsOptions}
              value={filters.recipient_ids ?? []}
              onChange={onUpdateRecipientsIds}
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
            <MultiSelectDropdown
              label="Payment Methods"
              placeholder="All"
              options={paymentMethodsOptions}
              value={filters.payment_methods ?? []}
              onChange={(value) => onUpdatePaymentMethods(value as string[])}
              showSelectAll
            />
            <DatePicker
              label="Date"
              value={filters.sending_date || ""}
              onChange={onUpdateSendingDate}
            />
            <MultiSelectDropdown
              label="Receive Currency"
              placeholder="All"
              options={currencyOptions}
              value={filters.receive_currencies || []}
              onChange={(value) => onUpdateReceiveCurrency(value as any)}
              showSelectAll
            />
          </div>
        </FilterButton>
      </div>
    </div>
  );
};

export default TransferFilters;
