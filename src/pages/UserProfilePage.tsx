import React, { useState, useEffect } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import PersonalInfoForm from "../components/profile/PersonalInfoForm";
import BusinessInfoForm from "../components/profile/BusinessInfoForm";
import {
  useAgentProfile,
  useUpdateAgentProfile,
  useUploadAgentDocs,
} from "@/hooks/data/useAgent";
import type { agentDocsData, ProfileFormData } from "@/types/agent";
import { useTranslation } from "react-i18next";
import EditMultiSectionCard from "@/components/shared/EditMultiSectionCard";
import AgentDocumentUpload from "@/components/profile/AgentDocumentUpload";

// Utility function to get agent ID from localStorage
const getUserIdFromStorage = (): number | null => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.agent?.id || null;
  } catch {
    return null;
  }
};

// Initial form data
const initialFormData: ProfileFormData = {
  // Personal Information
  firstName: "",
  lastName: "",
  date_of_birth: "",
  email: "",
  phone: "",
  countryCode: "",
  streetName: "",
  houseNumber: "",
  city: "",
  country: "",
  state: "",
  postalCode: "",
  extraAddressDetails: "",
  gender: "",

  // Business Information
  businessName: "",
  businessStreetName: "",
  businessHouseNumber: "",
  businessCity: "",
  businessCountry: "",
  businessState: "",
  businessPostalCode: "",
  businessExtraAddressDetails: "",

  // Agent Information
  agentType: "sales_person",
  isSendingPartner: false,
  isPayoutPartner: false,
  sendingAgentGroupId: 0,
  payoutAgentGroupId: 0,
  commission: 0,
};

const UserProfilePage = () => {
  const [t] = useTranslation("global");
  const agentId = React.useMemo(() => getUserIdFromStorage(), []);
  const { data: profileData, isLoading } = useAgentProfile(agentId);
  const { mutateAsync: uploadDocs, isPending: isDocsPending } =
    useUploadAgentDocs();
  const { mutateAsync: updateProfile, isPending } = useUpdateAgentProfile({
    agentId,
    onError: (errorsData: any) => setErrors(errorsData),
  });

  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
  const [editMode, setEditMode] = useState(false);

  // Map API data to form data
  const mapApiDataToFormData = (apiData: any): ProfileFormData => {
    const user = apiData.user;
    const agent = user.agent;
    const businessDetails = agent.business_details;

    return {
      // Personal Information
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      date_of_birth: agent.date_of_birth || "",
      email: user.email || "",
      phone: user.phone_number || "",
      countryCode: user.country_phone_code || "",
      streetName: user.address.street_name || "",
      houseNumber: user.address.house_number || "",
      city: user.address.city?.id?.toString() || "",
      country: user.address.country?.id?.toString() || "",
      state: user.address.state?.id?.toString() || "",
      postalCode: user.address.postal_code || "",
      extraAddressDetails: user.address.extra_address_details || "",
      gender: agent.gender || "male",

      // Business Information
      businessName: businessDetails?.business_name || "",
      businessStreetName: businessDetails?.street_name || "",
      businessHouseNumber: businessDetails?.house_number || "",
      businessCity: businessDetails?.city?.id?.toString() || "",
      businessCountry: businessDetails?.country?.id?.toString() || "",
      businessState: businessDetails?.state?.id?.toString() || "",
      businessPostalCode: businessDetails?.postal_code || "",
      businessExtraAddressDetails: businessDetails?.extra_address_details || "",

      // Agent Information
      agentType: agent.agent_type || "sales_person",
      isSendingPartner: agent.is_sending_partner || false,
      isPayoutPartner: agent.is_payout_partner || false,
      // sendingAgentGroupId: agent.sending_agent_group_id || 0,
      // payoutAgentGroupId: agent.payout_agent_group_id || 0,
      commission: agent.commission || 0,
    };
  };

  // Populate form data from API response
  useEffect(() => {
    if (profileData?.data?.user) {
      const mappedData = mapApiDataToFormData(profileData.data);
      setFormData(mappedData);
    }
  }, [profileData]);

  // Handle input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear dependent fields when country changes
    if (field === "country") {
      setFormData((prev) => ({ ...prev, city: "" }));
    }
    if (field === "businessCountry") {
      setFormData((prev) => ({ ...prev, businessCity: "" }));
    }
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Handle date changes
  const handleDateChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  //validate fields

  const validateFields = () => {
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.firstName)
      newErrors.firstName = t("modules.register.fields.firstName.error");
    if (!formData.lastName)
      newErrors.lastName = t("modules.register.fields.lastName.error");
    if (!formData.date_of_birth)
      newErrors.date_of_birth = t("modules.register.fields.dob.error");
    if (!formData.email)
      newErrors.email = t("modules.register.fields.email.error");
    if (!formData.gender)
      newErrors.gender = t("modules.register.fields.email.error");

    if (!formData.streetName)
      newErrors.streetName = t("modules.register.fields.streetName.error");
    if (!formData.houseNumber)
      newErrors.houseNumber = t("modules.register.fields.houseNumber.error");
    if (!formData.city)
      newErrors.city = t("modules.register.fields.city.error");
    if (!formData.country)
      newErrors.country = t("modules.register.fields.country.error");

    if (!formData.countryCode)
      newErrors.countryCode = t("common.validation.required");
    if (!formData.phone)
      newErrors.phone = t("modules.register.fields.phone.error");

    if (formData.agentType === "business_partner") {
      if (!formData.businessName)
        newErrors.businessName = t(
          "modules.register.fields.businessName.error"
        );
      if (!formData.businessStreetName)
        newErrors.businessStreetName = t(
          "modules.register.fields.businessStreetName.error"
        );
      if (!formData.businessHouseNumber)
        newErrors.businessHouseNumber = t(
          "modules.register.fields.businessHouseNumber.error"
        );
      if (!formData.businessCity)
        newErrors.businessCity = t(
          "modules.register.fields.businessCity.error"
        );
      if (!formData.businessCountry)
        newErrors.businessCountry = t(
          "modules.register.fields.businessCountry.error"
        );
    }
    return newErrors;
  };
  // Prepare update payload
  const prepareUpdatePayload = () => ({
    user: {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone_number: formData.phone,
      country_phone_code: formData.countryCode,
      address: {
        street_name: formData.streetName,
        house_number: formData.houseNumber,
        postal_code: formData.postalCode || "",
        extra_address_details: formData.extraAddressDetails || "",
        city_id: parseInt(formData.city),
        state_id: formData.state ? parseInt(formData.state) : undefined,
        country_id: parseInt(formData.country),
      },
    },
    agent_type: formData.agentType,
    is_sending_partner: formData.isSendingPartner,
    is_payout_partner: formData.isPayoutPartner,
    date_of_birth: formData.date_of_birth,
    gender: formData.gender,
    // sending_agent_group_id: formData.sendingAgentGroupId,
    // payout_agent_group_id: formData.payoutAgentGroupId,
    commission: formData.commission,
    ...(formData.agentType === "business_partner" && {
      business_details: {
        business_name: formData.businessName,
        address: {
          street_name: formData.businessStreetName,
          house_number: formData.businessHouseNumber,
          postal_code: formData.businessPostalCode || "",
          extra_address_details: formData.businessExtraAddressDetails || "",
          city_id: parseInt(formData.businessCity),
          state_id: formData.businessState
            ? parseInt(formData.businessState)
            : undefined,
          country_id: parseInt(formData.businessCountry),
        },
      },
    }),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    console.log("errors == = ", errors);
  }, [errors]);
  // Handle form submission
  const handleFormSave = async () => {
    try {
      const validationErrors = validateFields();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      const payload: any = prepareUpdatePayload();
      await updateProfile(payload);
      setEditMode(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };
  const [docsData, setDocsData] = useState<agentDocsData>({
    document_type: "identity",
    files: [],
  });
  const handleSaveDocuments = async () => {
    if (!agentId) return;
    const result = await uploadDocs({ id: agentId!, data: docsData });
    if (result?.status) {
      setEditMode(false);
    }
  };

  const agentProfileSections: any[] = [
    {
      sectionTitle: "Profile Information",
      onSave: handleFormSave,
      loading: isPending,
      editMode: editMode,
      setEditMode: setEditMode,
      content: (
        <>
          <PersonalInfoForm
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleDateChange={handleDateChange}
            editMode={editMode}
          />

          {formData.agentType === "business_partner" && (
            <BusinessInfoForm
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              editMode={editMode}
            />
          )}
        </>
      ),
    },
    {
      sectionTitle: "Documents",
      onSave: handleSaveDocuments,
      loading: isDocsPending,
      editMode: editMode,
      setEditMode: setEditMode,
      content: (
        <AgentDocumentUpload
          docsData={docsData}
          gotDocs={{
            path1: profileData?.data?.user?.agent?.identity_file_path_1,
            path2: profileData?.data?.user?.agent?.identity_file_path_2,
          }}
          setDocsData={setDocsData}
          editMode={editMode}
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="px-6 py-2 h-fit">
      <ProfileHeader name={formData.firstName + " " + formData.lastName} />
      <div className="mt-6 space-y-6">
        <EditMultiSectionCard customerSections={agentProfileSections} />
      </div>
    </div>
  );
};

export default UserProfilePage;
