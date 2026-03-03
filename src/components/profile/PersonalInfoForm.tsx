import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchableSelect from "@/components/ui/searchable-select";
import DatePicker from "@/components/shared/DatePicker";
import PhoneInput from "@/components/shared/PhoneInput";
import {
  useCountries,
  useCitiesByCountry,
  useStatesByCountry,
} from "@/hooks/data/useAddress";
import { useTranslation } from "react-i18next";
import RadioInput from "@/components/shared/RadioInput";
import ErrorField from "../shared/ErrorField";

interface PersonalInfoFormProps {
  formData: any;
  agentStatus?: string;
  errors: Record<string, string>;
  handleInputChange: (field: string, value: any) => void;
  handleDateChange: (field: string, value: any) => void;
  editMode: boolean;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  formData,
  agentStatus,
  errors,
  handleInputChange,
  handleDateChange,
  editMode,
}) => {
  const [t] = useTranslation("global");
  // Address data
  const { data: countries = [], isLoading: countriesLoading } = useCountries();
  const { data: cities = [], isLoading: citiesLoading } = useCitiesByCountry(
    formData.country || null,
  );
  const { data: states = [], isLoading: statesLoading } = useStatesByCountry(
    formData.country || null,
  );

  // Country phone code options
  const countryPhoneOptions = countries?.map((country: any) => ({
    value: country?.phone_code,
    label: country?.name,
    code: country?.phone_code,
    countryCode: country?.iso2,
  }));

  const countryOptions =
    countries?.map((country) => ({
      value: country?.id?.toString(),
      label: country?.name,
    })) || [];

  const cityOptions =
    cities?.map((city) => ({
      value: city?.id.toString(),
      label: city?.name,
    })) || [];
  const stateOptions =
    states?.map((state) => ({
      value: state?.id?.toString(),
      label: state?.name,
    })) || [];

  const genderOptions = [
    { label: t("modules.profile.fields.gender.male"), value: "male" },
    { label: t("modules.profile.fields.gender.female"), value: "female" },
  ];

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-2 gap-y-5">
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
          {errors?.firstName && <ErrorField errors={[errors?.firstName]} />}
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
          {errors?.lastName && <ErrorField errors={[errors?.lastName]} />}
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            {t("modules.profile.fields.dob.label")}
            <span className="text-red-500">*</span>
          </Label>
          <DatePicker
            disabled={!editMode}
            value={formData.date_of_birth || ""}
            onChange={(date: string) => handleDateChange("date_of_birth", date)}
          />
          {errors?.date_of_birth && (
            <ErrorField errors={[errors?.date_of_birth]} />
          )}
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
          {errors?.email && <ErrorField errors={[errors?.email]} />}
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
          {errors?.phone && <ErrorField errors={[errors?.phone]} />}
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
          {errors?.streetName && <ErrorField errors={[errors?.streetName]} />}
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
          {errors?.houseNumber && <ErrorField errors={[errors?.houseNumber]} />}
        </div>
        <SearchableSelect
          label={t("modules.profile.fields.country.label")}
          placeholder={t("modules.profile.fields.country.placeholder")}
          options={countryOptions}
          value={formData.country || ""}
          onChange={(value) => handleInputChange("country", value.toString())}
          loading={countriesLoading}
          disabled={!editMode || agentStatus === "active"} //always disabled with active agents cause they must not change his country
          required
          error={errors?.country}
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
          error={errors?.city}
        />

        <SearchableSelect
          label={t("modules.profile.fields.state.label")}
          placeholder={t("modules.profile.fields.state.placeholder")}
          options={stateOptions}
          value={formData?.state || ""}
          onChange={(value) => handleInputChange("state", value?.toString())}
          loading={statesLoading}
          disabled={!editMode || !formData?.country}
          error={errors?.state}
        />

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
          {errors?.postalCode && <ErrorField errors={[errors?.postalCode]} />}
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
            placeholder={t(
              "modules.profile.fields.extraAddressDetails.placeholder",
            )}
          />
          {errors?.extraAddressDetails && (
            <ErrorField errors={[errors?.extraAddressDetails]} />
          )}
        </div>

        <div className="md:col-span-1 flex flex-col gap-2">
          <Label>{t("modules.profile.fields.gender.label")}</Label>
          <RadioInput
            options={genderOptions}
            selectedValue={formData.gender}
            onSelectValue={(value: string) =>
              handleInputChange("gender", value)
            }
            disabled={!editMode}
          />
          {errors?.gender && <ErrorField errors={[errors?.gender]} />}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
