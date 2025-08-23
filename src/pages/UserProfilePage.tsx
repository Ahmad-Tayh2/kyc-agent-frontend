import React, { useState, useEffect } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import EditSectionCard from "../components/shared/EditSectionCard";
import PersonalInfoForm from "../components/profile/PersonalInfoForm";
import BusinessInfoForm from "../components/profile/BusinessInfoForm";
import { useAgentProfile, useUpdateAgentProfile } from "@/hooks/data/useAgent";
import type { ProfileFormData } from "@/types/agent";

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
  dob: "",
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
  gender: "male",

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
  const agentId = React.useMemo(() => getUserIdFromStorage(), []);
  const { data: profileData, isLoading } = useAgentProfile(agentId);
  const { mutateAsync: updateProfile, isPending } =
    useUpdateAgentProfile(agentId);

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
      dob: agent.date_of_birth || "",
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
  };

  // Handle date changes
  const handleDateChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
    date_of_birth: formData.dob,
    gender: formData.gender,
    // sending_agent_group_id: formData.sendingAgentGroupId,
    // payout_agent_group_id: formData.payoutAgentGroupId,
    commission: formData.commission,
    ...(formData.agentType === "business_partner" && {
      business_details: {
        business_name: formData.businessName,
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
    }),
  });

  // Handle form submission
  const handleFormSave = async () => {
    try {
      const payload = prepareUpdatePayload();
      await updateProfile(payload);
      setEditMode(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

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
        <EditSectionCard
          sectionTitle="Profile Information"
          onSave={handleFormSave}
          loading={isPending}
          editMode={editMode}
          setEditMode={setEditMode}
        >
          <PersonalInfoForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleDateChange={handleDateChange}
            editMode={editMode}
          />
          {formData.agentType === "business_partner" && (
            <BusinessInfoForm
              formData={formData}
              handleInputChange={handleInputChange}
              editMode={editMode}
            />
          )}
        </EditSectionCard>
      </div>
    </div>
  );
};

export default UserProfilePage;
