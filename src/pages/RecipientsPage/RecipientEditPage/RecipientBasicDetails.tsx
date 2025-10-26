// import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhoneInput from "@/components/shared/PhoneInput";
import DatePicker from "@/components/shared/DatePicker";
import SearchableSelect from "@/components/ui/searchable-select";
import {
  useCitiesByCountry,
  useCountries,
  useStatesByCountry,
} from "@/hooks/data/useAddress";
import RadioInput from "@/components/shared/RadioInput";
import ErrorField from "@/components/shared/ErrorField";

const RecipientBasicDetails = (props: any) => {
  const {
    data,
    handleInputChange,
    handleDateChange,
    editMode = true,
    validationErrors,
  } = props;
  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  const { data: countries = [] } = useCountries();
  const { data: cities = [] } = useCitiesByCountry(data?.country_id || null);
  const { data: states = [] } = useStatesByCountry(data?.country_id || null);

  const countryOptions =
    countries?.map((country: any) => ({
      value: country.id,
      label: country.name,
    })) || [];

  const stateOptions =
    states?.map((state) => ({
      value: state.id.toString(),
      label: state.name,
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
          {validationErrors?.first_name && (
            <ErrorField errors={validationErrors.first_name} />
          )}
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
          {validationErrors?.last_name && (
            <ErrorField errors={validationErrors.last_name} />
          )}
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
          {validationErrors?.email && (
            <ErrorField errors={[validationErrors.email[0]]} />
          )}
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
          {validationErrors?.date_of_birth && (
            <ErrorField errors={validationErrors.date_of_birth} />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="street_name">
            Street Name<span className="text-red-500">*</span>
          </Label>
          <Input
            id="street_name"
            name="street_name"
            placeholder="Enter street name"
            value={data?.street_name || ""}
            onChange={(e) => handleInputChange("street_name", e.target.value)}
            disabled={!editMode}
          />
          {validationErrors?.street_name && (
            <ErrorField errors={validationErrors.street_name} />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]" htmlFor="house_number">
            House Number<span className="text-red-500">*</span>
          </Label>
          <Input
            id="house_number"
            name="house_number"
            placeholder="Enter house number"
            value={data?.house_number || ""}
            onChange={(e) => handleInputChange("house_number", e.target.value)}
            disabled={!editMode}
          />
          {validationErrors?.house_number && (
            <ErrorField errors={validationErrors.house_number} />
          )}
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
          error={validationErrors.country_id}
        />
        <SearchableSelect
          label={"State"}
          options={stateOptions}
          value={data?.state_id}
          onChange={(value) => handleInputChange("state_id", value)}
          disabled={!data?.country_id || !editMode}
          error={validationErrors.state_id}
        />
        <SearchableSelect
          label={"City"}
          options={cityOptions}
          value={data?.city_id}
          onChange={(value) => handleInputChange("city_id", value)}
          disabled={!data?.country_id || !editMode}
          required
          error={validationErrors.city_id}
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
          {validationErrors?.postal_code && (
            <ErrorField errors={validationErrors.postal_code} />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            Gender
            <span className="text-red-500">*</span>
          </Label>
          <RadioInput
            options={genderOptions}
            selectedValue={data?.gender}
            onSelectValue={(value: string) =>
              handleInputChange("gender", value)
            }
            disabled={!editMode}
          />
          {validationErrors?.gender && (
            <ErrorField errors={validationErrors.gender} />
          )}
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
          {validationErrors?.phone_number && (
            <ErrorField errors={validationErrors.phone_number} />
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipientBasicDetails;
