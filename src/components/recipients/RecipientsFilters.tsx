import React, { useEffect, useMemo, useState } from "react";
import { SearchInput } from "@/components/shared/SearchInput";
import { FilterButton } from "@/components/shared/FilterButton";
import MultiSelectDropdown from "@/components/shared/MultiSelectDropdown";
import CountrySelector from "@/components/shared/CountrySelector";
import { useCountries } from "@/hooks/data/useAddress";
import type { RecipientsFilterState } from "@/hooks/data/useRecipientsFilters";
import type { CustomerType } from "@/types/customers";
import { useGetCustomersWithSearch } from "@/hooks/data/useCustomers";
import { useGetRemittanceMethods } from "@/hooks/data/useRemittanceMethods";
import { useSearchParams } from "react-router-dom";

interface RecipientsFiltersProps {
  filters: RecipientsFilterState;

  onUpdateSearchTerm: (name: string) => void;
  onUpdateCustomersIds: (status: string[]) => void;
  onUpdateCountryIds: (countries: number[]) => void;
  onUpdateRemittanceMethodIds: (remittance_methods_ids: string[]) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

const RecipientsFilters: React.FC<RecipientsFiltersProps> = ({
  filters,
  onUpdateSearchTerm,
  onUpdateCustomersIds,
  onUpdateCountryIds,
  onUpdateRemittanceMethodIds,
  onResetFilters,
  onApplyFilters,
}) => {
  const { data: countriesData = [] } = useCountries();
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const search_term = searchParams?.get("search");
    if (search_term) {
      setSearchCustomer(search_term);
    }
  }, [searchParams]);
  const handleResetFilters = () => {
    setSearchCustomer("");
    onResetFilters?.();
  };
  const countries = React.useMemo(() => {
    if (!countriesData) return [];
    return countriesData?.map((country: any) => ({
      id: country.id,
      code: country?.iso2,
      name: country.name,
    }));
  }, [countriesData]);

  const { data: customersResponse } = useGetCustomersWithSearch(searchCustomer);
  const customersData = useMemo(() => {
    return customersResponse?.data || [];
  }, [customersResponse?.data]);

  const { data: remittanceMethodsResponse } = useGetRemittanceMethods();
  const remittanceMethodsData = useMemo(() => {
    return remittanceMethodsResponse?.data || [];
  }, [remittanceMethodsResponse?.data]);

  const customersOptions = [
    ...customersData?.map((customer: CustomerType) => ({
      label: customer.full_name,
      value: String(customer.id),
    })),
  ];

  const remittanceMethodsOptions = [
    ...remittanceMethodsData?.map((rm_method: any) => ({
      label: rm_method?.name,
      value: rm_method?.id,
    })),
  ];

  return (
    <div className="flex items-center justify-between flex-wrap">
      <SearchInput
        placeholder="Search by recipient's name or phone"
        value={filters.search ?? ""}
        onChange={onUpdateSearchTerm}
      />
      <div className="flex items-center justify-start w-fit gap-1 flex-wrap">
        <FilterButton
          onClick={() => {}}
          onResetClick={handleResetFilters}
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
              searchTermValue={searchCustomer}
              onSearchTermChange={(value: string) => setSearchCustomer(value)}
            />
            <CountrySelector
              label="Country"
              placeholder="Select countries"
              countries={countries}
              value={filters.countries ?? []}
              onChange={onUpdateCountryIds}
            />
            <MultiSelectDropdown
              label="Remittance method"
              placeholder="All"
              options={remittanceMethodsOptions}
              value={filters.remittance_methods_ids ?? []}
              onChange={onUpdateRemittanceMethodIds}
            />
          </div>
        </FilterButton>
      </div>
    </div>
  );
};

export default RecipientsFilters;
