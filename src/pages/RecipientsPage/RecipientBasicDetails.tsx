// import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhoneInput from "@/components/shared/PhoneInput";
import DatePicker from "@/components/shared/DatePicker";
import CheckedIcon from "@/assets/icons/checked-icon.svg?react";
import UncheckedIcon from "@/assets/icons/unchecked-icon.svg?react";
import SearchableSelect from "@/components/ui/searchable-select";
import { cn } from "@/lib/utils";
import { useCitiesByCountry, useCountries } from "@/hooks/data/useAddress";
import { CUSTOMER_STATUSES } from "@/constants/appConstants";

const RecipientBasicDetails = (props: any) => {
  const { data, handleInputChange, handleDateChange, editMode = true } = props;
  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];
  const statusOptions = CUSTOMER_STATUSES.map((status) => ({
    label: status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    value: status,
  }));

  const { data: countries = [] } = useCountries();
  const { data: cities = [] } = useCitiesByCountry(data?.country_id || null);
  const countryOptions =
    countries?.map((country: any) => ({
      value: country.id,
      label: country.name,
    })) || [];

  const cityOptions =
    cities?.map((city: any) => ({
      value: city.id,
      label: city.name,
    })) || [];

  const countryPhoneOptions =
    countries?.map((country: any) => ({
      value: country.phone_code,
      label: country.name,
      code: country.phone_code,
      countryCode: country.iso2,
    })) || [];
  return (
    <div className="space-y-6 p-5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="first_name">
            First Name
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="first_name"
            name="first_name"
            placeholder="First Name"
            value={data?.first_name || ""}
            onChange={(e) => handleInputChange("first_name", e.target.value)}
            disabled={!editMode}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="last_name">
            Last Name<span className="text-red-500">*</span>
          </Label>
          <Input
            id="last_name"
            name="last_name"
            placeholder="Last Name"
            value={data?.last_name || ""}
            onChange={(e) => handleInputChange("last_name", e.target.value)}
            disabled={!editMode}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="email">
            Email<span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="The email must be verified"
            value={data?.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={!editMode}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="date_of_birth">
            Date of Birth<span className="text-red-500">*</span>
          </Label>
          <DatePicker
            value={data?.date_of_birth || ""}
            onChange={(date: string) => handleDateChange("date_of_birth", date)}
            disabled={!editMode}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="street_name">
            Street Name<span className="text-red-500">*</span>
          </Label>
          <Input
            id="street_name"
            name="street_name"
            placeholder="Enter street name and house number"
            value={data?.street_name || ""}
            onChange={(e) => handleInputChange("street_name", e.target.value)}
            disabled={!editMode}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="house_number">
            House Number<span className="text-red-500">*</span>
          </Label>
          <Input
            id="house_number"
            name="house_number"
            placeholder="Enter street name and house number"
            value={data?.house_number || ""}
            onChange={(e) => handleInputChange("house_number", e.target.value)}
            disabled={!editMode}
          />
        </div>
        <SearchableSelect
          label={"Country"}
          options={countryOptions}
          value={data?.country_id}
          onChange={(value) => {
            console.log(" change country = ", value);
            handleInputChange("country_id", value);
          }}
          required
          disabled={!editMode}
        />

        <SearchableSelect
          label={"City"}
          options={cityOptions}
          value={data?.city_id}
          onChange={(value) => handleInputChange("city_id", value)}
          disabled={!data?.country_id || !editMode}
          required
        />
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="postal_code">
            Postal Code
          </Label>
          <Input
            id="postal_code"
            name="postal_code"
            placeholder="Enter your postal code"
            value={data?.postal_code || ""}
            onChange={(e) => handleInputChange("postal_code", e.target.value)}
            disabled={!editMode}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">Gender</Label>
          <div className="flex items-center gap-1">
            {genderOptions?.map((genderOption: any) => (
              <button
                key={genderOption.value}
                type="button"
                className={cn(
                  "w-full flex items-center border gap-1 rounded-lg px-4 py-3 text-[14px] text-left transition",
                  "border-gray-200 bg-white",
                  !editMode && "opacity-60 cursor-not-allowed"
                )}
                onClick={() => {
                  if (editMode) handleInputChange("gender", genderOption.value);
                }}
                disabled={!editMode}
              >
                {data?.gender === genderOption.value ? (
                  <CheckedIcon />
                ) : (
                  <UncheckedIcon />
                )}
                {genderOption.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="phone_number">
            Phone Number<span className="text-red-500">*</span>
          </Label>
          <PhoneInput
            placeholder="Enter your phone number"
            countryOptions={countryPhoneOptions}
            selectedCountry={data?.country_phone_code || ""}
            phoneNumber={data?.phone_number || ""}
            onCountryChange={(countryCode: string) =>
              handleInputChange("country_phone_code", countryCode)
            }
            onPhoneChange={(phoneNumber: string) =>
              handleInputChange("phone_number", phoneNumber)
            }
            disabled={!editMode}
          />
        </div>
        <div className="flex flex-col gap-1">
          <SearchableSelect
            label={"Status"}
            options={statusOptions}
            value={data?.status || ""}
            onChange={(value) => handleInputChange("status", value.toString())}
            required
            disabled={!editMode}
          />
        </div>
      </div>
    </div>
  );
};

export default RecipientBasicDetails;
