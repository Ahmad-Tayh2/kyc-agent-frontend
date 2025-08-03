import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import SearchableSelect from "@/components/ui/searchable-select";
import PhoneInput from "@/components/shared/PhoneInput";
import DatePicker from "@/components/shared/DatePicker";
import CheckedIcon from "@/assets/icons/checked-icon.svg?react";
import { cn } from "@/lib/utils";
import ActionButton from "@/components/shared/ActionButton";

interface RecipientBasicDetailsProps {
  formData: {
    customer_id?: string;
    first_name: string;
    last_name: string;
    email: string;
    date_of_birth: string;
    street_name: string;
    house_number: string;
    postal_code: string;
    city_id: string;
    country_id: string;
    gender: string;
    country_phone_code: string;
    phone_number: string;
    import_mobile_wallet: boolean;
    mobile_wallet_type: string;
    mobile_wallet_number: string;
    wallet_account_number: string;
  };
  handleInputChange: (field: string, value: any) => void;
  handleDateChange: (field: string, date: string) => void;
  customerOptions: Array<{ value: string; label: string }>;
  mobileWalletOptions: Array<{ value: string; label: string }>;
  countryOptions: Array<{ value: string; label: string }>;
  cityOptions: Array<{ value: string; label: string }>;
  countryPhoneOptions: Array<{
    value: string;
    label: string;
    code: string;
    countryCode: string;
  }>;
}

const RecipientBasicDetails: React.FC<RecipientBasicDetailsProps> = ({
  formData,
  handleInputChange,
  handleDateChange,
  customerOptions,
  mobileWalletOptions,
  countryOptions,
  cityOptions,
  countryPhoneOptions,
}) => {
  return (
    <div className="space-y-6 p-5">
      {/* Add recipient details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Add recipient details</h3>
        <SearchableSelect
          label="Customer"
          options={customerOptions}
          value={formData.customer_id || ""}
          onChange={(value) => handleInputChange("customer_id", value)}
          placeholder="Select customer"
        />
      </div>

      {/* Recipient Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recipient Details</h3>

        {/* Mobile Wallet Import */}
        <div className="space-y-4  bg-primary/5 p-5 rounded-md">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="import_mobile_wallet"
              checked={formData.import_mobile_wallet}
              onCheckedChange={(checked) =>
                handleInputChange("import_mobile_wallet", checked)
              }
            />
            <Label htmlFor="import_mobile_wallet">
              Import the user using their mobile wallet information
            </Label>
          </div>

          {formData.import_mobile_wallet && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="flex flex-col gap-1">
                <Label className="text-[14px]">
                  Mobile Wallet
                  <SearchableSelect
                    label=""
                    options={mobileWalletOptions}
                    value={formData.mobile_wallet_type}
                    onChange={(value) =>
                      handleInputChange("mobile_wallet_type", value)
                    }
                    placeholder="Select Mobile Wallet"
                  />
                </Label>
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-[14px]">Recipient mobile number</Label>
                <PhoneInput
                  placeholder="Enter mobile number"
                  countryOptions={countryPhoneOptions}
                  selectedCountry={formData.country_phone_code || ""}
                  phoneNumber={formData.mobile_wallet_number || ""}
                  onCountryChange={(countryCode: string) =>
                    handleInputChange("country_phone_code", countryCode)
                  }
                  onPhoneChange={(phoneNumber: string) =>
                    handleInputChange("mobile_wallet_number", phoneNumber)
                  }
                />
              </div>

              <div className="flex flex-col gap-1 ">
                <Label className="text-[14px]">Wallet Account Number</Label>
                <Input
                  placeholder="Enter wallet account number"
                  value={formData.wallet_account_number || ""}
                  onChange={(e) =>
                    handleInputChange("wallet_account_number", e.target.value)
                  }
                />
              </div>

              <div className="flex items-end">
                <ActionButton
                  title="SEARCH"
                  className="bg-primary hover:bg-primary/90"
                />
              </div>
            </div>
          )}
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-1">
            <Label className="text-[14px]" htmlFor="first_name">
              First Name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="first_name"
              placeholder="First Name"
              value={formData.first_name || ""}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-[14px]" htmlFor="last_name">
              Last Name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="last_name"
              placeholder="Last Name"
              value={formData.last_name || ""}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-[14px]" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="The email must be verified"
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-[14px]" htmlFor="date_of_birth">
              Date of Birth<span className="text-red-500">*</span>
            </Label>
            <DatePicker
              value={formData.date_of_birth || ""}
              onChange={(date: string) =>
                handleDateChange("date_of_birth", date)
              }
            />
          </div>
          {/* Address Information */}

          <div className="flex flex-col gap-1">
            <Label className="text-[14px]" htmlFor="street_name">
              Street Name
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="street_name"
              placeholder="Enter street name"
              value={formData.street_name || ""}
              onChange={(e) => handleInputChange("street_name", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-[14px]" htmlFor="street_name">
              House Number
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="street_name"
              placeholder="Enter house number"
              value={formData.house_number || ""}
              onChange={(e) => handleInputChange("street_name", e.target.value)}
            />
          </div>
          <SearchableSelect
            label="Country"
            options={countryOptions}
            value={formData.country_id}
            onChange={(value) => handleInputChange("country_id", value)}
            placeholder="Enter your country"
            required
          />
          <SearchableSelect
            label="City"
            options={cityOptions}
            value={formData.city_id}
            onChange={(value) => handleInputChange("city_id", value)}
            placeholder="Enter your city name"
            required
            disabled={!formData.country_id}
          />

          <div className="flex flex-col gap-1">
            <Label className="text-[14px]" htmlFor="postal_code">
              Postal Code<span className="text-red-500">*</span>
            </Label>
            <Input
              id="postal_code"
              placeholder="Enter your postal code"
              value={formData.postal_code || ""}
              onChange={(e) => handleInputChange("postal_code", e.target.value)}
            />
          </div>
          {/* Gender and Phone */}

          <div className="flex flex-col gap-1">
            <Label className="text-[14px]">
              Gender<span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-1">
              {[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
              ].map((genderOption) => (
                <button
                  key={genderOption.value}
                  type="button"
                  className={cn(
                    "w-full flex items-center border gap-1 rounded-lg px-4 py-3 text-[14px] text-left transition",
                    "border-gray-200 bg-white",
                    formData.gender === genderOption.value &&
                      "border-primary bg-primary/5"
                  )}
                  onClick={() =>
                    handleInputChange("gender", genderOption.value)
                  }
                >
                  {formData.gender === genderOption.value ? (
                    <CheckedIcon />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-gray-300" />
                  )}
                  {genderOption.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-[14px]">
              Phone Number<span className="text-red-500">*</span>
            </Label>
            <PhoneInput
              placeholder="Enter your phone number"
              countryOptions={countryPhoneOptions}
              selectedCountry={formData.country_phone_code || ""}
              phoneNumber={formData.phone_number || ""}
              onCountryChange={(countryCode: string) =>
                handleInputChange("country_phone_code", countryCode)
              }
              onPhoneChange={(phoneNumber: string) =>
                handleInputChange("phone_number", phoneNumber)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipientBasicDetails;
