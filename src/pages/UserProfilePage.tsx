import React, { useState, useEffect } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import EditSectionCard from "../components/shared/EditSectionCard";
import PersonalInfoForm from "../components/profile/PersonalInfoForm";
import BusinessInfoForm from "../components/profile/BusinessInfoForm";
import { useAgentProfile, useUpdateAgentProfile } from "@/hooks/data/useAgent";
import type { ProfileFormData } from "@/types/agent";

// Get agentId from localStorage user object
function getUserIdFromStorage() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.id || null;
  } catch {
    return null;
  }
}

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
  const { mutateAsync: updateProfile, isPending } = useUpdateAgentProfile(agentId);
  
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
  const [personalInfoEditMode, setPersonalInfoEditMode] = useState(false);
  const [businessInfoEditMode, setBusinessInfoEditMode] = useState(false);

  // Populate fields from API data
  useEffect(() => {
    if (profileData?.data?.user) {
      const user = profileData.data.user;
      const agent = user.agent;
      
      setFormData({
        // Personal Information
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        dob: agent.date_of_birth || "",
        email: user.email || "",
        phone: user.phone_number || "",
        countryCode: user.country?.phone_code || "",
        streetName: user.address.street_name || "",
        houseNumber: user.address.house_number || "",
        city: user.address.city?.id?.toString() || "",
        country: user.address.country?.id?.toString() || "",
        state: user.address.state?.id?.toString() || "",
        postalCode: user.address.postal_code || "",
        extraAddressDetails: user.address.extra_address_details || "",
        gender: agent.gender || "male",
        
        // Business Information
        businessName: agent.business_details?.business_name || "",
        businessStreetName: agent.business_details?.address.street_name || "",
        businessHouseNumber: agent.business_details?.address.house_number || "",
        businessCity: agent.business_details?.address.city?.id?.toString() || "",
        businessCountry: agent.business_details?.address.country?.id?.toString() || "",
        businessState: agent.business_details?.address.state?.id?.toString() || "",
        businessPostalCode: agent.business_details?.address.postal_code || "",
        businessExtraAddressDetails: agent.business_details?.address.extra_address_details || "",
        
        // Agent Information
        agentType: agent.agent_type || "sales_person",
        isSendingPartner: agent.is_sending_partner || false,
        isPayoutPartner: agent.is_payout_partner || false,
        sendingAgentGroupId: agent.sending_agent_group_id || 0,
        payoutAgentGroupId: agent.payout_agent_group_id || 0,
        commission: agent.commission || 0,
      });
    }
  }, [profileData]);

  // Check if one of the other sections is already in edit mode
  const checkOtherSectionEditMode = (current: "personal" | "business") => {
    if (current === "personal") return businessInfoEditMode;
    else if (current === "business") return personalInfoEditMode;
    else return true;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear city when country changes
    if (field === "country") {
      setFormData((prev) => ({
        ...prev,
        city: "",
      }));
    }

    // Clear business city when business country changes
    if (field === "businessCountry") {
      setFormData((prev) => ({
        ...prev,
        businessCity: "",
      }));
    }
  };

  const handleDateChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePersonalInfoSave = async () => {
    try {
      const payload = {
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
        sending_agent_group_id: formData.sendingAgentGroupId,
        payout_agent_group_id: formData.payoutAgentGroupId,
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
              state_id: formData.businessState ? parseInt(formData.businessState) : undefined,
              country_id: parseInt(formData.businessCountry),
            },
          },
        }),
      };

      await updateProfile(payload);
      setPersonalInfoEditMode(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleBusinessInfoSave = async () => {
    try {
      const payload = {
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
        sending_agent_group_id: formData.sendingAgentGroupId,
        payout_agent_group_id: formData.payoutAgentGroupId,
        commission: formData.commission,
        business_details: {
          business_name: formData.businessName,
          address: {
            street_name: formData.businessStreetName,
            house_number: formData.businessHouseNumber,
            postal_code: formData.businessPostalCode || "",
            extra_address_details: formData.businessExtraAddressDetails || "",
            city_id: parseInt(formData.businessCity),
            state_id: formData.businessState ? parseInt(formData.businessState) : undefined,
            country_id: parseInt(formData.businessCountry),
          },
        },
      };

      await updateProfile(payload);
      setBusinessInfoEditMode(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="px-6 py-2 h-fit">
      <ProfileHeader />
      <div className="mt-6 space-y-6">
        <EditSectionCard
          sectionTitle="Personal Information"
          onSave={handlePersonalInfoSave}
          loading={isPending}
          editMode={personalInfoEditMode}
          setEditMode={setPersonalInfoEditMode}
          checkOtherSectionEditMode={checkOtherSectionEditMode("personal")}
        >
          <PersonalInfoForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleDateChange={handleDateChange}
            editMode={personalInfoEditMode}
          />
        </EditSectionCard>

        <EditSectionCard
          sectionTitle="Business Information"
          onSave={handleBusinessInfoSave}
          loading={isPending}
          editMode={businessInfoEditMode}
          setEditMode={setBusinessInfoEditMode}
          checkOtherSectionEditMode={checkOtherSectionEditMode("business")}
        >
          <BusinessInfoForm
            formData={formData}
            handleInputChange={handleInputChange}
            editMode={businessInfoEditMode}
          />
        </EditSectionCard>
      </div>
    </div>
  );
};

export default UserProfilePage;
