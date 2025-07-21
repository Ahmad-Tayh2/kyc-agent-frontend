// import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhoneInput from "@/components/PhoneInput";
import DatePicker from "@/components/DatePicker";
import CheckedIcon from "@/assets/icons/checked-icon.svg?react";
import UncheckedIcon from "@/assets/icons/unchecked-icon.svg?react";
import SearchableSelect from "@/components/ui/searchable-select";
import { cn } from "@/lib/utils";
import { useCitiesByCountry, useCountries } from "@/hooks/useAddress";
const CustomerBasicDetails = (props: any) => {
  const {
    formData,
    handleInputChange,
    handleDateChange,
    editMode = false,
  } = props;
  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];
  const statusOptions = [{ label: "Active", value: "active" }];

  const { data: countries = [] } = useCountries();
  const { data: cities = [] } = useCitiesByCountry(formData.country || null);
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
          <Label className="text-[14px]" htmlFor="firstName">
            First Name
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            placeholder="First Name"
            value={formData.firstName || ""}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            disabled={!editMode}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="lastName">
            Last Name<span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            placeholder="Last Name"
            value={formData.lastName || ""}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            disabled={!editMode}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="email">
            Email<span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="The email must be verified"
            value={formData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={!editMode}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="dateOfBirth">
            Date of Birth<span className="text-red-500">*</span>
          </Label>
          <DatePicker
            value={formData.dateOfBirth || ""}
            onChange={(date: string) => handleDateChange("dateOfBirth", date)}
            disabled={!editMode}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="streetName">
            Street Name<span className="text-red-500">*</span>
          </Label>
          <Input
            id="streetName"
            placeholder="Enter street name and house number"
            value={formData.streetName || ""}
            onChange={(e) => handleInputChange("streetName", e.target.value)}
            disabled={!editMode}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="houseNumber">
            House Number<span className="text-red-500">*</span>
          </Label>
          <Input
            id="houseNumber"
            placeholder="Enter street name and house number"
            value={formData.houseNumber || ""}
            onChange={(e) => handleInputChange("houseNumber", e.target.value)}
            disabled={!editMode}
          />
        </div>
        <SearchableSelect
          label={"Country"}
          options={countryOptions}
          value={formData.country}
          onChange={(value) => {
            console.log(" change country = ", value);
            handleInputChange("country", value);
          }}
          required
          disabled={!editMode}
        />

        <SearchableSelect
          label={"City"}
          options={cityOptions}
          value={formData.city}
          onChange={(value) => handleInputChange("city", value)}
          disabled={!formData.country || !editMode}
          required
        />
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="postalCode">
            Postal Code<span className="text-red-500">*</span>
          </Label>
          <Input
            id="postalCode"
            placeholder="Enter your postal code"
            value={formData.postalCode || ""}
            onChange={(e) => handleInputChange("postalCode", e.target.value)}
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
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="phoneNumber">
            Phone Number<span className="text-red-500">*</span>
          </Label>
          <PhoneInput
            placeholder="Enter your phone number"
            countryOptions={countryPhoneOptions}
            selectedCountry={formData.countryCode || ""}
            phoneNumber={formData.phoneNumber || ""}
            onCountryChange={(countryCode: string) =>
              handleInputChange("countryCode", countryCode)
            }
            onPhoneChange={(phoneNumber: string) =>
              handleInputChange("phoneNumber", phoneNumber)
            }
            disabled={!editMode}
          />
        </div>
        <div className="flex flex-col gap-1">
          <SearchableSelect
            label={"Status"}
            options={statusOptions}
            value={formData.status || ""}
            onChange={(value) => handleInputChange("status", value.toString())}
            required
            disabled={!editMode}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerBasicDetails;
