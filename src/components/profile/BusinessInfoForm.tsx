import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchableSelect from "@/components/ui/searchable-select";
import { useCountries, useCitiesByCountry } from "@/hooks/data/useAddress";
import { useTranslation } from "react-i18next";

interface BusinessInfoFormProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  editMode: boolean;
}

const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({
  formData,
  handleInputChange,
  editMode,
}) => {
  const [t] = useTranslation("global");

  // Address data
  const { data: countries = [], isLoading: countriesLoading } = useCountries();
  const { data: businessCities = [], isLoading: businessCitiesLoading } =
    useCitiesByCountry(formData.businessCountry || null);

  const countryOptions = countries?.map((country) => ({
    value: country.id.toString(),
    label: country.name,
  })) || [];

  const businessCityOptions = businessCities?.map((city) => ({
    value: city.id.toString(),
    label: city.name,
  })) || [];

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-5">
        <div className="flex flex-col gap-1 md:col-span-2">
          <Label className="text-[14px]">
            {t("modules.profile.fields.businessName.label")}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            disabled={!editMode}
            value={formData.businessName || ""}
            onChange={(e) => handleInputChange("businessName", e.target.value)}
            placeholder={t("modules.profile.fields.businessName.placeholder")}
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.profile.fields.businessStreetName.label")}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            disabled={!editMode}
            value={formData.businessStreetName || ""}
            onChange={(e) => handleInputChange("businessStreetName", e.target.value)}
            placeholder={t("modules.profile.fields.businessStreetName.placeholder")}
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.profile.fields.businessHouseNumber.label")}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            disabled={!editMode}
            value={formData.businessHouseNumber || ""}
            onChange={(e) => handleInputChange("businessHouseNumber", e.target.value)}
            placeholder={t("modules.profile.fields.businessHouseNumber.placeholder")}
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.profile.fields.businessPostalCode.label")}
          </Label>
          <Input
            disabled={!editMode}
            value={formData.businessPostalCode || ""}
            onChange={(e) => handleInputChange("businessPostalCode", e.target.value)}
            placeholder={t("modules.profile.fields.businessPostalCode.placeholder")}
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.profile.fields.businessExtraAddressDetails.label")}
          </Label>
          <Input
            disabled={!editMode}
            value={formData.businessExtraAddressDetails || ""}
            onChange={(e) =>
              handleInputChange("businessExtraAddressDetails", e.target.value)
            }
            placeholder={t("modules.profile.fields.businessExtraAddressDetails.placeholder")}
          />
        </div>
        
        <SearchableSelect
          label={t("modules.profile.fields.businessCountry.label")}
          placeholder={t("modules.profile.fields.businessCountry.placeholder")}
          options={countryOptions}
          value={formData.businessCountry || ""}
          onChange={(value) => handleInputChange("businessCountry", value.toString())}
          loading={countriesLoading}
          disabled={!editMode}
          required
        />
        
        <SearchableSelect
          label={t("modules.profile.fields.businessCity.label")}
          placeholder={t("modules.profile.fields.businessCity.placeholder")}
          options={businessCityOptions}
          value={formData.businessCity || ""}
          onChange={(value) => handleInputChange("businessCity", value.toString())}
          loading={businessCitiesLoading}
          disabled={!editMode || !formData.businessCountry}
          required
        />
      </div>
    </div>
  );
};

export default BusinessInfoForm; 