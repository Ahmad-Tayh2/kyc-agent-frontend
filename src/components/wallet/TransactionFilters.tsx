import React from 'react';
import { FilterButton } from '@/components/FilterButton';
import MultiSelectDropdown from '@/components/MultiSelectDropdown';
import DateRangeSelector from '@/components/DateRangeSelector';
import type { TransactionFilterState } from '@/hooks/useTransactionFilters';
import { useCurrencies } from '@/hooks/useCurrency';
import type { Currency } from '@/types/currency';

// Transaction type options
const typeOptions = [
  { value: 'add_money', label: 'Add Money' },
  { value: 'withdraw_money', label: 'Withdraw Money' },
  { value: 'exchange_money', label: 'Exchange Money' },
];

// Transaction status options
const statusOptions = [
  { value: 'initiated', label: 'Initiated' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'cancelled', label: 'Cancelled' },
];

interface TransactionFiltersProps {
  filters: TransactionFilterState;
  onUpdateType: (type: string[]) => void;
  onUpdateStatus: (status: string[]) => void;
  onUpdateCurrency: (currency: string[]) => void;
  onUpdateDateRange: (dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  }) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onUpdateType,
  onUpdateStatus,
  onUpdateCurrency,
  onUpdateDateRange,
  onResetFilters,
  onApplyFilters,
}) => {
  // Get currencies from API
  const { data: currencies = [] } = useCurrencies();

  // Transform currencies into options format for dropdown
  const currencyOptions = React.useMemo(() => {
    if (!currencies) return [];
    return currencies.map((currency: Currency) => ({
      value: currency.code,
      label: (
        <div className='flex items-center gap-2'>
          <div
            className='w-6 h-6 rounded-full flex items-center justify-center'
            style={{ backgroundColor: 'rgba(24, 172, 172, 0.57)' }}
          >
            <span className='text-base font-bold' style={{ color: '#18ACAC' }}>
              {currency.symbol}
            </span>
          </div>
          {currency.code}
        </div>
      ),
    }));
  }, [currencies]);

  return (
    <div className='flex items-center justify-between flex-wrap'>
      <div className='flex items-center justify-start w-fit gap-1 flex-wrap'>
        <FilterButton
          onClick={() => {}}
          onResetClick={onResetFilters}
          onApplyFilters={onApplyFilters}
        >
          <div className='flex gap-2 w-fit'>
            <MultiSelectDropdown
              label='Transaction Type'
              placeholder='All'
              options={typeOptions}
              value={filters.type}
              onChange={onUpdateType}
            />
            <MultiSelectDropdown
              label='Status'
              placeholder='All'
              options={statusOptions}
              value={filters.status}
              onChange={onUpdateStatus}
            />
            <MultiSelectDropdown
              label='Currency'
              placeholder='All'
              options={currencyOptions}
              value={filters.currency}
              onChange={onUpdateCurrency}
            />
            <DateRangeSelector
              label='Date'
              placeholder='Select date range'
              value={filters.dateRange}
              onChange={onUpdateDateRange}
            />
          </div>
        </FilterButton>
      </div>
    </div>
  );
};

export default TransactionFilters;
