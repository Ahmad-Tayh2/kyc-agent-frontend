import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import SearchableSelect from "@/components/ui/searchable-select";
import DatePicker from "@/components/DatePicker";
import PhoneInput from "@/components/PhoneInput";
import FileUpload from "./FileUpload";
import { useCountries, useCitiesByCountry } from "@/hooks/useAddress";
import { useAgentProfile /*, useUpdateAgentProfile*/ } from "@/hooks/useAgent";
import { useTranslation } from "react-i18next";

interface EditableFormProps {
  section: "personal" | "company";
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
}

// Get agentId from localStorage user object
function getUserIdFromStorage() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.id || null;
  } catch {
    return null;
  }
}

const initialPersonalFields = {
  firstName: "",
  lastName: "",
  dob: "",
  email: "",
  streetName: "",
  city: "",
  country: "",
  state: "",
  phone: "",
  gender: "male",
  identity: null as File | null,
};

const initialCompanyFields = {
  businessName: "",
  businessStreetName: "",
  businessCity: "",
  businessCountry: "",
};

const EditableForm: React.FC<EditableFormProps> = ({
  section,
  editMode,
  // setEditMode,
}) => {
  const agentId = React.useMemo(() => getUserIdFromStorage(), []);
  const { data } = useAgentProfile(agentId);
  const [t] = useTranslation("global");
  // const { status: updateAgentStatus, mutateAsync: editAgent } =
  //   useUpdateAgentProfile(agentId);
  const [fields, setFields] = useState<any>(
    section === "personal" ? initialPersonalFields : initialCompanyFields
  );

  // Populate fields from API data
  useEffect(() => {
    if (data) {
      if (section === "personal") {
        setFields({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          dob: data.date_of_birth || "",
          email: data.email || "",
          streetName: data.street_name || "",
          city: data.city || "",
          country: data.country || "",
          state: data.state || "",
          phone: data.phone_number || "",
          gender: data.gender || "male",
          identity: null,
        });
      } else {
        setFields({
          businessName: data.business_name || "",
          businessStreetName: data.business_street_name || "",
          businessCity: data.business_city || "",
          businessCountry: data.business_country || "",
        });
      }
    }
  }, [data, section]);

  // Address data
  const { data: countries = [] } = useCountries();
  const { data: cities = [] } = useCitiesByCountry(fields.country);
  const { data: businessCities = [] } = useCitiesByCountry(
    fields.businessCountry
  );

  // Handlers
  const handleChange = (field: string, value: any) => {
    setFields((prev: any) => ({ ...prev, [field]: value }));
  };

  // const handleSave = () => {
  //   // Map fields to API payload
  //   const payload =
  //     section === "personal"
  //       ? {
  //           first_name: fields.firstName,
  //           last_name: fields.lastName,
  //           date_of_birth: fields.dob,
  //           email: fields.email,
  //           street_name: fields.streetName,
  //           city: fields.city,
  //           country: fields.country,
  //           state: fields.state,
  //           phone_number: fields.phone,
  //           gender: fields.gender,
  //         }
  //       : {
  //           business_name: fields.businessName,
  //           business_street_name: fields.businessStreetName,
  //           business_city: fields.businessCity,
  //           business_country: fields.businessCountry,
  //         };
  //   editAgent(payload, {
  //     onSuccess: () => setEditMode(false),
  //   });
  // };

  // Field renderers
  const renderPersonalFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="flex flex-col gap-1">
        <Label className="text-[14px]">
          {t("modules.profile.fields.firstName.label")}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          disabled={!editMode}
          value={fields.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
        />
      </div>
      <div>
        <Label className="text-[14px]">
          {t("modules.profile.fields.lastName.label")}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          disabled={!editMode}
          value={fields.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
        />
      </div>
      <div>
        <Label className="text-[14px]">
          {t("modules.profile.fields.dob.label")}
          <span className="text-red-500">*</span>
        </Label>
        <DatePicker
          disabled={!editMode}
          value={fields.dob}
          onChange={(v: string) => handleChange("dob", v)}
        />
      </div>
      <div>
        <Label className="text-[14px]">
          {t("modules.profile.fields.email.label")}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          disabled={!editMode}
          value={fields.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </div>
      <div className="col-span-2">
        <Label className="text-[14px]">
          {t("modules.profile.fields.streetName.label")}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          disabled={!editMode}
          value={fields.streetName}
          onChange={(e) => handleChange("streetName", e.target.value)}
        />
      </div>
      <div>
        <Label className="text-[14px]">
          {t("modules.profile.fields.city.label")}
          <span className="text-red-500">*</span>
        </Label>
        <SearchableSelect
          disabled={!editMode}
          options={cities.map((c: any) => ({ value: c.id, label: c.name }))}
          value={fields.city}
          onChange={(v) => handleChange("city", v)}
        />
      </div>
      <div>
        <Label className="text-[14px]">
          {t("modules.profile.fields.countryOfResidence.label")}
          <span className="text-red-500">*</span>
        </Label>
        <SearchableSelect
          disabled={!editMode}
          options={countries.map((c: any) => ({ value: c.id, label: c.name }))}
          value={fields.country}
          onChange={(v) => handleChange("country", v)}
        />
      </div>
      <div>
        <Label className="text-[14px]">
          {t("modules.profile.fields.state.label")}
        </Label>
        <Input
          disabled={!editMode}
          value={fields.state}
          onChange={(e) => handleChange("state", e.target.value)}
        />
      </div>
      <div>
        <Label className="text-[14px]">
          {t("modules.profile.fields.phone.label")}
          <span className="text-red-500">*</span>
        </Label>
        <PhoneInput
          disabled={!editMode}
          phoneNumber={fields.phone}
          onPhoneChange={(v) => handleChange("phone", v)}
        />
      </div>
      <div>
        <Label className="text-[14px]">
          {t("modules.profile.fields.gender.label")}
          <span className="text-red-500">*</span>
        </Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={fields.gender === "male" ? "default" : "outline"}
            disabled={!editMode}
            onClick={() => handleChange("gender", "male")}
          >
            {t("modules.profile.fields.gender.male")}
          </Button>
          <Button
            type="button"
            variant={fields.gender === "female" ? "default" : "outline"}
            disabled={!editMode}
            onClick={() => handleChange("gender", "female")}
          >
            {t("modules.profile.fields.gender.female")}
          </Button>
        </div>
      </div>
      <div className="col-span-2">
        <Label className="text-[14px]">
          {t("modules.profile.fields.identity.label")}
        </Label>
        <FileUpload
          file={fields.identity}
          onFileChange={(f) => handleChange("identity", f)}
        />
      </div>
    </div>
  );

  const renderCompanyFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <Label className="text-[14px]">
          {t("modules.profile.fields.businessName.label")}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          disabled={!editMode}
          value={fields.businessName}
          onChange={(e) => handleChange("businessName", e.target.value)}
        />
      </div>
      <div>
        <Label className="text-[14px]">
          {t("modules.profile.fields.businessStreetName.label")}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          disabled={!editMode}
          value={fields.businessStreetName}
          onChange={(e) => handleChange("businessStreetName", e.target.value)}
        />
      </div>
      <div>
        <Label className="text-[14px]">
          {t("modules.profile.fields.businessCity.label")}
          <span className="text-red-500">*</span>
        </Label>
        <SearchableSelect
          disabled={!editMode}
          options={businessCities.map((c: any) => ({
            value: c.id,
            label: c.name,
          }))}
          value={fields.businessCity}
          onChange={(v) => handleChange("businessCity", v)}
        />
      </div>
      <div>
        <Label className="text-[14px]">
          {t("modules.profile.fields.businessCountry.label")}
          <span className="text-red-500">*</span>
        </Label>
        <SearchableSelect
          disabled={!editMode}
          options={countries.map((c: any) => ({ value: c.id, label: c.name }))}
          value={fields.businessCountry}
          onChange={(v) => handleChange("businessCountry", v)}
        />
      </div>
    </div>
  );

  // if (isLoading) return <div>Loading...</div>;

  return (
    <form className="p-5">
      {section === "personal" ? renderPersonalFields() : renderCompanyFields()}
    </form>
  );
};

export default EditableForm;
