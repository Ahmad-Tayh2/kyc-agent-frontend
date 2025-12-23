import { useCountries } from "@/hooks/data/useAddress";
import type { PayoutLocationFilterState } from "@/hooks/data/usePayoutLocationFilters";
import { useMemo } from "react";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import CountryCodesSelector from "@/components/shared/CountryCodesSelector";
interface PayoutLocationsFiltersProps {
  filters: PayoutLocationFilterState;
  onUpdateCountryCodes: (codes: string[]) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

const PayoutLocationsFilters: React.FC<PayoutLocationsFiltersProps> = ({
  filters,
  onUpdateCountryCodes,
  onResetFilters,
  onApplyFilters,
}) => {
  const { t } = useTranslation("global");

  const { data: countriesData = [] } = useCountries();

  const countries = useMemo(() => {
    if (!countriesData) return [];
    return countriesData?.map((country: any) => ({
      id: country.id,
      code: country?.iso2,
      name: country.name,
    }));
  }, [countriesData]);
  return (
    <div className="p-5 border-t-1">
      <div className="flex flex-row gap-2 justify-start items-end ">
        <CountryCodesSelector
          label="Country"
          placeholder="Select countries"
          countries={countries}
          value={filters?.countries_codes ?? []}
          onChange={onUpdateCountryCodes}
          dropdownClassName="left-0"
        />
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
