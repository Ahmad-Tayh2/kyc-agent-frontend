import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchableSelect from "@/components/ui/searchable-select";
import DatePicker from "@/components/shared/DatePicker";
import PhoneInput from "@/components/shared/PhoneInput";
import { useCountries, useCitiesByCountry } from "@/hooks/data/useAddress";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import UncheckedIcon from "@/assets/icons/unchecked-icon.svg?react";
import CheckedIcon from "@/assets/icons/checked-icon.svg?react";

interface PersonalInfoFormProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  handleDateChange: (field: string, value: any) => void;
  editMode: boolean;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  formData,
  handleInputChange,
  handleDateChange,
  editMode,
}) => {
  const [t] = useTranslation("global");

  // Address data
  const { data: countries = [], isLoading: countriesLoading } = useCountries();
  const { data: cities = [], isLoading: citiesLoading } = useCitiesByCountry(
    formData.country || null
  );

  // Country phone code options
  const countryPhoneOptions = countries?.map((country: any) => ({
    value: country.phone_code,
    label: country.name,
    code: country.phone_code,
    countryCode: country.iso2,
  }));

  const countryOptions = countries?.map((country) => ({
    value: country.id.toString(),
    label: country.name,
  })) || [];

  const cityOptions = cities?.map((city) => ({
    value: city.id.toString(),
    label: city.name,
  })) || [];

  const genderOptions = [
    { label: t("modules.profile.fields.gender.male"), value: "male" },
    { label: t("modules.profile.fields.gender.female"), value: "female" },
  ];

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-5">
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.profile.fields.firstName.label")}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            disabled={!editMode}
            value={formData.firstName || ""}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            placeholder={t("modules.profile.fields.firstName.placeholder")}
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.profile.fields.lastName.label")}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            disabled={!editMode}
            value={formData.lastName || ""}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            placeholder={t("modules.profile.fields.lastName.placeholder")}
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.profile.fields.dob.label")}
            <span className="text-red-500">*</span>
          </Label>
          <DatePicker
            disabled={!editMode}
            value={formData.dob || ""}
            onChange={(date: string) => handleDateChange("dob", date)}
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.profile.fields.email.label")}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            type="email"
            disabled={!editMode}
            value={formData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder={t("modules.profile.fields.email.placeholder")}
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.profile.fields.phone.label")}
            <span className="text-red-500">*</span>
          </Label>
          <PhoneInput
            disabled={!editMode}
            placeholder={t("modules.profile.fields.phone.placeholder")}
            countryOptions={countryPhoneOptions || []}
            selectedCountry={formData.countryCode || ""}
            phoneNumber={formData.phone || ""}
            onCountryChange={(countryCode) => {
              handleInputChange("countryCode", countryCode);
              handleInputChange("phone", "");
            }}
            onPhoneChange={(phoneNumber) =>
              handleInputChange("phone", phoneNumber)
            }
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.profile.fields.streetName.label")}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            disabled={!editMode}
            value={formData.streetName || ""}
            onChange={(e) => handleInputChange("streetName", e.target.value)}
            placeholder={t("modules.profile.fields.streetName.placeholder")}
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.profile.fields.houseNumber.label")}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            disabled={!editMode}
            value={formData.houseNumber || ""}
            onChange={(e) => handleInputChange("houseNumber", e.target.value)}
            placeholder={t("modules.profile.fields.houseNumber.placeholder")}
          />
        </div>
        
        <SearchableSelect
          label={t("modules.profile.fields.country.label")}
          placeholder={t("modules.profile.fields.country.placeholder")}
          options={countryOptions}
          value={formData.country || ""}
          onChange={(value) => handleInputChange("country", value.toString())}
          loading={countriesLoading}
          disabled={!editMode}
          required
        />

        <SearchableSelect
          label={t("modules.profile.fields.city.label")}
          placeholder={t("modules.profile.fields.city.placeholder")}
          options={cityOptions}
          value={formData.city || ""}
          onChange={(value) => handleInputChange("city", value.toString())}
          loading={citiesLoading}
          disabled={!editMode || !formData.country}
          required
        />

        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.profile.fields.state.label")}
          </Label>
          <Input
            disabled={!editMode}
            value={formData.state || ""}
            onChange={(e) => handleInputChange("state", e.target.value)}
            placeholder={t("modules.profile.fields.state.placeholder")}
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.profile.fields.postalCode.label")}
          </Label>
          <Input
            disabled={!editMode}
            value={formData.postalCode || ""}
            onChange={(e) => handleInputChange("postalCode", e.target.value)}
            placeholder={t("modules.profile.fields.postalCode.placeholder")}
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.profile.fields.extraAddressDetails.label")}
          </Label>
          <Input
            disabled={!editMode}
            value={formData.extraAddressDetails || ""}
            onChange={(e) =>
              handleInputChange("extraAddressDetails", e.target.value)
            }
            placeholder={t("modules.profile.fields.extraAddressDetails.placeholder")}
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-2">
          <Label>{t("modules.profile.fields.gender.label")}</Label>
          <div className="flex items-center gap-2">
            {genderOptions?.map((genderOption: any) => (
              <button
                key={genderOption.value}
                type="button"
                className={cn(
                  "w-full flex items-center border gap-1 rounded-lg px-4 py-3 text-[14px] text-left transition",
                  "border-gray-200 bg-white",
                  !editMode && "cursor-not-allowed opacity-60"
                )}
                disabled={!editMode}
                onClick={() => {
                  if (editMode) {
                    handleInputChange("gender", genderOption.value);
                  }
                }}
              >
                {formData.gender === genderOption.value ? (
                  <CheckedIcon />
                ) : (
                  <UncheckedIcon />
                )}
                {genderOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm; 