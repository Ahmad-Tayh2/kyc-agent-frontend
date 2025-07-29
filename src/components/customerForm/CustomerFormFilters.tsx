import React from 'react';
import { useTranslation } from 'react-i18next';
import { FilterButton } from '@/components/FilterButton';
import MultiSelectDropdown from '@/components/MultiSelectDropdown';
import DateRangeSelector from '@/components/DateRangeSelector';
import type { CustomerFormFilterState } from '@/hooks/useCustomerFormFilters';

interface CustomerFormFiltersProps {
  filters: CustomerFormFilterState;
  updateStatus: (status: string[]) => void;
  updateDateRange: (dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  }) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

const CustomerFormFilters: React.FC<CustomerFormFiltersProps> = ({
  filters,
  updateStatus,
  updateDateRange,
  onResetFilters,
  onApplyFilters,
}) => {
  const [t] = useTranslation('global');

  // Create translated status options
  const translatedStatusOptions = React.useMemo(
    () => [
      {
        value: 'valid_link',
        label: t('modules.pages.customerForm.statuses.linkValid'),
      },
      {
        value: 'expired_link',
        label: t('modules.pages.customerForm.statuses.linkExpired'),
      },
      {
        value: 'successful_registration',
        label: t('modules.pages.customerForm.statuses.registrationSuccessful'),
      },
    ],
    [t]
  );
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
              label={t('modules.pages.customerForm.filters.status')}
              placeholder={t('modules.pages.customerForm.filters.all')}
              options={translatedStatusOptions}
              value={filters.status}
              onChange={updateStatus}
            />
            <DateRangeSelector
              label={t('modules.pages.customerForm.filters.createdDate')}
              placeholder={t(
                'modules.pages.customerForm.filters.selectDateRange'
              )}
              value={filters.dateRange}
              onChange={updateDateRange}
            />
          </div>
        </FilterButton>
      </div>
    </div>
  );
};

export default CustomerFormFilters;
