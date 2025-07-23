import React from 'react';
import { FilterButton } from '@/components/FilterButton';
import MultiSelectDropdown from '@/components/MultiSelectDropdown';
import DateRangeSelector from '@/components/DateRangeSelector';
import type { CustomerFormFilterState } from '@/hooks/useCustomerFormFilters';

// Customer form status options
const statusOptions = [
  { value: 'valid_link', label: 'Link Valid' },
  { value: 'expired_link', label: 'Link Expired' },
  { value: 'successful_registration', label: 'Registration Successful' },
];

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
              label='Status'
              placeholder='All'
              options={statusOptions}
              value={filters.status}
              onChange={updateStatus}
            />
            <DateRangeSelector
              label='Created Date'
              placeholder='Select date range'
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
