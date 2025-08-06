import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import BackArrowIcon from "@/assets/icons/back-arrow.svg?react";
import PageTitle from "@/components/shared/PageTitle";
import EditSectionCard from "@/components/shared/EditSectionCard";
import {
  useGetRecipient,
  useUpdateRecipient,
} from "@/hooks/data/useRecipients";
import type {
  RecipientDataType,
  RecipientUpdatedDataType,
} from "@/types/recipients";
import RecipientBasicDetails from "../RecipientBasicDetails";
import RecipientRemittanceDetails from "./RecipientRemittanceDetails";
import RecipientBankDetails from "./RecipientBankDetails";

const CustomerEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, error } = useGetRecipient(id!);
  const [recipientData, setRecipientData] = useState<RecipientDataType | null>(
    null
  );
  const [basicInfoEditMode, setBasicInfoEditMode] = React.useState(false);
  const [bankDetailsEditMode, setBankDetailsEditMode] = React.useState(false);

  // check in one of the other sections in already in the edit mode
  const checkOtherSectionEditMode = (current: "bank" | "basic") => {
    if (current === "bank") return basicInfoEditMode;
    else if (current === "basic") return bankDetailsEditMode;
    else return true;
  };
  const { mutateAsync: updateRecipient } = useUpdateRecipient(id!);

  useEffect(() => {
    if (data?.data) {
      setRecipientData(data?.data);
    }
  }, [data]);

  const handleBack = () => {
    navigate(ROUTES.RECIPIENTS.LIST);
  };

  const handleInputChange = (field: string, value: any) => {
    setRecipientData((prev: any) => {
      const previousState = prev ?? {};
      if (field.includes(".")) {
        const [parentKey, childKey] = field.split(".");
        let updatedState = { ...previousState };
        if (!updatedState[parentKey]) {
          updatedState[parentKey] = {};
        }
        updatedState[parentKey] = {
          ...updatedState[parentKey],
          [childKey]: value,
        };
        return updatedState;
      }
      return { ...previousState, [field]: value };
    });
  };

  const handleDateChange = (field: string, value: any) => {
    setRecipientData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const payloadToUpdate: Partial<RecipientUpdatedDataType> = {
        first_name: recipientData?.first_name,
        last_name: recipientData?.last_name,
        date_of_birth: recipientData?.date_of_birth,
        gender: recipientData?.gender,
        address: {
          street_name: recipientData?.address?.street_name,
          house_number: recipientData?.address?.house_number,
          postal_code: recipientData?.address?.postal_code,
          extra_address_details: recipientData?.address?.extra_address_details,
          city_id: recipientData?.address?.city?.id,
          state_id: recipientData?.address?.state?.id,
          country_id: recipientData?.address?.country?.id,
        },
        phone_number: recipientData?.phone_number,
        country_phone_code: recipientData?.country_phone_code,
        bank_details: recipientData?.bank_details,
      };
      await updateRecipient(payloadToUpdate);
      setBasicInfoEditMode(false);
      setBankDetailsEditMode(false);
    } catch (e) {
      console.log(" error = ", error?.message);
    }
  };

  // if (isLoading) return <div className="p-8">Loading...</div>;
  // if (error)
  //   return <div className="p-8 text-red-500">Error loading recipient.</div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="">
        <div className="flex justify-start items-center gap-3">
          <button
            onClick={handleBack}
            className="text-primary top-1 cursor-pointer"
          >
            <BackArrowIcon width={30} height={30} />
          </button>
          <PageTitle
            title={`${recipientData?.first_name || ""} ${
              recipientData?.last_name || ""
            }`}
          />
        </div>
        {recipientData?.created_at && (
          <div className="ml-10">
            Registered on:{" "}
            {new Date(recipientData?.created_at).toLocaleDateString()}
          </div>
        )}
      </div>
      <EditSectionCard
        sectionTitle="Recipient Bio"
        onSave={handleSave}
        loading={false}
        editMode={basicInfoEditMode}
        setEditMode={setBasicInfoEditMode}
        checkOtherSectionEditMode={checkOtherSectionEditMode("basic")}
      >
        <RecipientBasicDetails
          data={recipientData}
          handleInputChange={handleInputChange}
          handleDateChange={handleDateChange}
          editMode={basicInfoEditMode}
        />
      </EditSectionCard>
      <EditSectionCard
        sectionTitle="Remittance methods"
        onSave={handleSave}
        loading={false}
        editMode={basicInfoEditMode}
        setEditMode={setBasicInfoEditMode}
      >
        <RecipientRemittanceDetails
        // data={data}
        // handleInputChange={handleInputChange}
        // handleDateChange={handleDateChange}
        // editMode={basicInfoEditMode}
        />
      </EditSectionCard>
      <EditSectionCard
        sectionTitle="Bank Details"
        onSave={handleSave}
        loading={false}
        editMode={bankDetailsEditMode}
        setEditMode={setBankDetailsEditMode}
        checkOtherSectionEditMode={checkOtherSectionEditMode("bank")}
      >
        <RecipientBankDetails
          data={recipientData}
          handleInputChange={handleInputChange}
          handleDateChange={handleDateChange}
          editMode={bankDetailsEditMode}
        />
      </EditSectionCard>
    </div>
  );
};

export default CustomerEditPage;
