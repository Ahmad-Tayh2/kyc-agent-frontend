import BackArrowIcon from "@/assets/icons/back-arrow.svg?react";
import EditSectionCard from "@/components/shared/EditSectionCard";
import PageTitle from "@/components/shared/PageTitle";
import {
  useGetRecipient,
  useUpdateRecipient,
} from "@/hooks/data/useRecipients";
import type {
  RecipientDataType,
  RecipientUpdatedDataType,
} from "@/types/recipients";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RecipientBasicDetails from "./RecipientBasicDetails";
import RecipientRemittanceDetails from "./RecipientRemittanceDetails";
// import RecipientBankDetails from "./RecipientBankDetails";
import { z } from "zod";

export const editRecipientSchema = z.object({
  // customer_id: z.union([z.string(), z.number()]).refine((val) => {
  //   if (typeof val === "string") return val.trim() !== "";
  //   if (typeof val === "number") return !isNaN(val);
  //   return false;
  // }, "Customer is required"),
  first_name: z
    .string()
    .min(2, "First name must contain at least 2 characters")
    .max(50, "First name is too long"),
  last_name: z
    .string()
    .min(2, "Last name must contain at least 2 characters")
    .max(50, "Last name is too long"),
  email: z
    .string()
    .email("Invalid email address format")
    .optional()
    .or(z.literal("")),
  date_of_birth: z.string().nonempty("Date of birth is required"),
  // .refine(
  //   (date) => !isNaN(Date.parse(date)),
  //   "Invalid date format (must be YYYY-MM-DD)"
  // ),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Gender is required" }),
  }),
  country_id: z.union([z.string(), z.number()]).refine((val) => {
    if (typeof val === "string") return val.trim() !== "";
    if (typeof val === "number") return !isNaN(val);
    return false;
  }, "Country is required"),

  city_id: z.union([z.string(), z.number()]).refine((val) => {
    if (typeof val === "string") return val.trim() !== "";
    if (typeof val === "number") return !isNaN(val);
    return false;
  }, "City is required"),

  street_name: z.string().nonempty("Street name is required"),
  house_number: z.string().nonempty("House number is required"),
  // postal_code: z.string().optional(),
  phone_number: z
    .string()
    .nonempty("Phone number is required")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
  country_phone_code: z.string().nonempty("Country phone code required"),
});

const RecipientEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetRecipient(id!);
  const [formData, setFormData] = useState<any>({});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});

  const [recipientData, setRecipientData] = useState<RecipientDataType | null>(
    null,
  );
  const [basicInfoEditMode, setBasicInfoEditMode] = React.useState(false);
  const [remittanceMethodsEditMode, setRemittanceMethodsEditMode] =
    React.useState(false);
  const [bankDetailsEditMode, setBankDetailsEditMode] = React.useState(false);

  // check in one of the other sections in already in the edit mode
  const checkOtherSectionEditMode = (
    current: "bank" | "basic" | "remittance",
  ) => {
    if (current === "bank")
      return basicInfoEditMode || remittanceMethodsEditMode;
    else if (current === "basic")
      return bankDetailsEditMode || remittanceMethodsEditMode;
    else if (current === "remittance")
      return basicInfoEditMode || bankDetailsEditMode;
    else return true;
  };
  const { mutateAsync: updateRecipient } = useUpdateRecipient(
    id!,
    () => {
      setBasicInfoEditMode(false);
      setValidationErrors({});
    },
    (errorsData: any) => setValidationErrors(errorsData),
  );

  useEffect(() => {
    if (data?.data) {
      setRecipientData(data?.data);
    }
  }, [data]);

  useEffect(() => {
    if (data && data.data) {
      setFormData({
        first_name: data.data.first_name,
        last_name: data.data.last_name,
        email: data.data.email,
        date_of_birth: data.data.date_of_birth,
        country_id: data.data?.address?.country?.id,
        city_id: data.data?.address?.city?.id,
        state_id: data.data?.address?.state?.id,
        postal_code: data.data?.address?.postal_code,
        street_name: data.data?.address?.street_name,
        house_number: data.data?.address?.house_number,
        gender: data.data.gender,
        phone_number: data.data.phone_number,
        country_phone_code: data.data.country_phone_code,
      });
    }
  }, [data]);
  const handleInputChange = (field: string, value: any) => {
    if (field === "country_id") {
      setFormData((prev: any) => ({
        ...prev,
        [field]: value,
        city_id: "",
        state_id: "",
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [field]: value,
      }));
    }
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: [] }));
    }
  };

  const handleDateChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: [] }));
    }
  };
  const handleBack = () => {
    navigate(-1);
  };

  // const handleInputChange = (field: string, value: any) => {
  //   setRecipientData((prev: any) => {
  //     const previousState = prev ?? {};
  //     if (field.includes(".")) {
  //       const [parentKey, childKey] = field.split(".");
  //       let updatedState = { ...previousState };
  //       if (!updatedState[parentKey]) {
  //         updatedState[parentKey] = {};
  //       }
  //       updatedState[parentKey] = {
  //         ...updatedState[parentKey],
  //         [childKey]: value,
  //       };
  //       return updatedState;
  //     }
  //     return { ...previousState, [field]: value };
  //   });
  // };

  // const handleDateChange = (field: string, value: any) => {
  //   setRecipientData((prev: any) => ({ ...prev, [field]: value }));
  // };

  const handleSave = async () => {
    try {
      const payloadToUpdate: Partial<RecipientUpdatedDataType> = {
        first_name: formData?.first_name,
        last_name: formData?.last_name,
        email: formData.email ?? "",
        date_of_birth: formData?.date_of_birth
          ? format(formData?.date_of_birth, "yyyy-MM-dd")
          : "",
        gender: formData?.gender,
        address: {
          street_name: formData?.street_name,
          house_number: formData.house_number,
          postal_code: formData?.postal_code ?? "",
          extra_address_details: formData?.extra_address_details,
          city_id: formData?.city_id,
          state_id: formData?.state_id,
          country_id: formData?.country_id,
        },
        phone_number: formData?.phone_number,
        country_phone_code: formData?.country_phone_code,
        bank_details: formData?.bank_details,
      };

      // Flatten fields for validation
      const flattenedData = {
        ...payloadToUpdate,
        ...payloadToUpdate.address,
      };

      const validationResult = editRecipientSchema.safeParse(flattenedData);

      if (!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors;
        setValidationErrors(errors);
        console.log("Validation errors:", errors);
        return;
      }
      await updateRecipient(payloadToUpdate);
      setBasicInfoEditMode(false);
      setRemittanceMethodsEditMode(false);
      setBankDetailsEditMode(false);
    } catch (e) {
      console.log(" error = ", error?.message);
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error)
    return <div className="p-8 text-red-500">Error loading recipient.</div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-start items-center gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex justify-start items-start gap-2 flex-wrap">
            <button
              onClick={handleBack}
              className="text-primary top-1 cursor-pointer"
            >
              <BackArrowIcon width={30} height={30} />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-medium">Recipient: </span>
              <PageTitle
                title={`${recipientData?.first_name || ""} ${
                  recipientData?.last_name || ""
                }`}
              />
            </div>
          </div>
          {recipientData?.created_at && (
            <div className="ml-10">
              Registered on:{" "}
              {new Date(recipientData?.created_at).toLocaleDateString()}
            </div>
          )}
        </div>
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
          data={formData}
          handleInputChange={handleInputChange}
          handleDateChange={handleDateChange}
          editMode={basicInfoEditMode}
          validationErrors={validationErrors}
        />
      </EditSectionCard>

      <EditSectionCard
        sectionTitle="Remittance methods"
        onSave={() => {
          // For remittance methods, we don't need to save basic recipient data
          // The component handles its own save operations
          setRemittanceMethodsEditMode(false);
        }}
        loading={false}
        editMode={remittanceMethodsEditMode}
        setEditMode={setRemittanceMethodsEditMode}
        checkOtherSectionEditMode={checkOtherSectionEditMode("remittance")}
      >
        <RecipientRemittanceDetails
          data={recipientData}
          editMode={remittanceMethodsEditMode}
        />
      </EditSectionCard>

      {/* <EditSectionCard
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
      </EditSectionCard> */}
    </div>
  );
};

export default RecipientEditPage;
