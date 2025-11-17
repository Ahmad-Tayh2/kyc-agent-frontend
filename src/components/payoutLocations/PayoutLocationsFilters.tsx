import { useCountries } from "@/hooks/data/useAddress";
import type { PayoutLocationFilterState } from "@/hooks/data/usePayoutLocationFilters";
import { useMemo } from "react";
import MultiSelectDropdown from "../shared/MultiSelectDropdown";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
// import CountrySelector from "../shared/CountrySelector";
interface PayoutLocationsFiltersProps {
  filters: PayoutLocationFilterState;
  onUpdateCountryFilter: (countries: string[]) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

const PayoutLocationsFilters: React.FC<PayoutLocationsFiltersProps> = ({
  filters,
  onUpdateCountryFilter,
  onResetFilters,
  onApplyFilters,
}) => {
  const { t } = useTranslation("global");

  const { data: countriesData = [] } = useCountries();
  // const countries = useMemo(() => {
  //     if (!countriesData) return [];
  //     return countriesData?.map((country: any) => ({
  //       id: country.id,
  //       code: country?.iso2,
  //       name: country.name,
  //     }));
  //   }, [countriesData]);
  const countryOptions = useMemo(() => {
    if (!countriesData) return [];
    return countriesData?.map((country: any) => ({
      label: country.name,
      value: country?.iso2,
    }));
  }, [countriesData]);
  return (
    <div className="p-5 border-t-1">
      <div className="flex flex-row gap-2 justify-start items-end ">
        <MultiSelectDropdown
          label="Country"
          placeholder="All"
          options={countryOptions}
          value={filters.country_codes ?? []}
          onChange={onUpdateCountryFilter}
          showSelectAll
          className="w-1/4"
        />
        {/* <CountrySelector
              label="Country"
              placeholder="Select countries"
              countries={countries}
              value={filters.countries ?? []}
              onChange={onUpdateCountryIds}
            /> */}
        <Button
          variant="default"
          title={t("modules.components.filterButton.apply")}
          className="py-2 px-3"
          onClick={onApplyFilters}
        >
          {t("modules.components.filterButton.apply")}
        </Button>
        <Button
          variant="outline"
          title={t("modules.components.filterButton.reset")}
          className="py-2 px-3"
          onClick={onResetFilters}
        >
          {t("modules.components.filterButton.reset")}
        </Button>
      </div>
    </div>
  );
};

export default PayoutLocationsFilters;
