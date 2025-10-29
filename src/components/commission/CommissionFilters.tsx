import React from "react";
import { SearchInput } from "@/components/shared/SearchInput";
import { FilterButton } from "@/components/shared/FilterButton";
import type { CommissionEarnedFilterState } from "@/hooks/data/useCommissionFilters";
import { ExportButton } from "../shared/ExportButton";
import MultiSelectDropdown from "../shared/MultiSelectDropdown";
import DateRangeSelector from "../shared/DateRangeSelector";
import CountrySelector from "../shared/CountrySelector";
import { useCountries } from "@/hooks/data/useAddress";
import { TRASACTIONS_STATUSES } from "@/constants/appConstants";

const statusOptions = TRASACTIONS_STATUSES.map((status) => ({
  value: status,
  label: status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
}));
interface CommissionFiltersProps {
  filters: CommissionEarnedFilterState;
  onUpdateSearchTerm: (search: string) => void;
  onUpdateTransactionStatus: (status: string[]) => void;
  onUpdateDateRange: (dateRange: {
    startDate: string | null;
    endDate: string | null;
  }) => void;
  onUpdateSendingCountry: (countries: number[]) => void;
  onUpdateReceivedCountry: (countries: number[]) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

const CommissionFilters: React.FC<CommissionFiltersProps> = ({
  filters,
  onUpdateSearchTerm,

  onUpdateTransactionStatus,
  onUpdateDateRange,
  onUpdateSendingCountry,
  onUpdateReceivedCountry,

  onResetFilters,
  onApplyFilters,
}) => {
  const { data: countriesData = [] } = useCountries();

  const countries = React.useMemo(() => {
    if (!countriesData) return [];
    return countriesData?.map((country: any) => ({
      id: country.id,
      code: country?.iso2,
      name: country.name,
    }));
  }, [countriesData]);

  const dateRangeValue = {
    startDate: filters.date_from || null,
    endDate: filters.date_to || null,
  };

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
            <MultiSelectDropdown
              label="Status"
              placeholder="All"
              options={statusOptions}
              value={filters.status ?? []}
              onChange={onUpdateTransactionStatus}
              showSelectAll
            />
            <DateRangeSelector
              label="Reg. date"
              placeholder="Select date range"
              value={dateRangeValue}
              onChange={onUpdateDateRange}
            />
            <CountrySelector
              label="Sending Country"
              placeholder="Select countries"
              countries={countries}
              value={filters.send_countries ?? []}
              onChange={onUpdateSendingCountry}
            />
            <CountrySelector
              label="Destination Country"
              placeholder="Select countries"
              countries={countries}
              value={filters.receive_countries ?? []}
              onChange={onUpdateReceivedCountry}
            />
          </div>
        </FilterButton>
      </div>
    </div>
  );
};

export default CommissionFilters;
