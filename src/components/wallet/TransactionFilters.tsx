import React from 'react';
import { useTranslation } from 'react-i18next';
import { FilterButton } from '@/components/FilterButton';
import MultiSelectDropdown from '@/components/MultiSelectDropdown';
import DateRangeSelector from '@/components/DateRangeSelector';
import type { TransactionFilterState } from '@/hooks/useTransactionFilters';
import { useCurrencies } from '@/hooks/useCurrency';
import type { Currency } from '@/types/currency';

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
  const [t] = useTranslation('global');

  // Get currencies from API
  const { data: currencies = [] } = useCurrencies();

  // Create translated type options
  const translatedTypeOptions = React.useMemo(
    () => [
      {
        value: 'add_money',
        label: t('modules.pages.wallet.transactions.types.addMoney'),
      },
      {
        value: 'withdraw_money',
        label: t('modules.pages.wallet.transactions.types.withdrawMoney'),
      },
      {
        value: 'exchange_money',
        label: t('modules.pages.wallet.transactions.types.exchangeMoney'),
      },
    ],
    [t]
  );

  // Create translated status options
  const translatedStatusOptions = React.useMemo(
    () => [
      {
        value: 'initiated',
        label: t('modules.pages.wallet.transactions.statuses.initiated'),
      },
      {
        value: 'processing',
        label: t('modules.pages.wallet.transactions.statuses.processing'),
      },
      {
        value: 'completed',
        label: t('modules.pages.wallet.transactions.statuses.completed'),
      },
      {
        value: 'failed',
        label: t('modules.pages.wallet.transactions.statuses.failed'),
      },
      {
        value: 'cancelled',
        label: t('modules.pages.wallet.transactions.statuses.cancelled'),
      },
    ],
    [t]
  );

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
              label={t(
                'modules.pages.wallet.transactions.filters.transactionType'
              )}
              placeholder={t('modules.pages.wallet.transactions.filters.all')}
              options={translatedTypeOptions}
              value={filters.type}
              onChange={onUpdateType}
            />
            <MultiSelectDropdown
              label={t('modules.pages.wallet.transactions.filters.status')}
              placeholder={t('modules.pages.wallet.transactions.filters.all')}
              options={translatedStatusOptions}
              value={filters.status}
              onChange={onUpdateStatus}
            />
            <MultiSelectDropdown
              label={t('modules.pages.wallet.transactions.filters.currency')}
              placeholder={t('modules.pages.wallet.transactions.filters.all')}
              options={currencyOptions}
              value={filters.currency}
              onChange={onUpdateCurrency}
            />
            <DateRangeSelector
              label={t('modules.pages.wallet.transactions.filters.date')}
              placeholder={t(
                'modules.pages.wallet.transactions.filters.selectDateRange'
              )}
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
