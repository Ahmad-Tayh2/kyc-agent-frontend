import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import BackArrowIcon from "@/assets/icons/back-arrow.svg?react";
import PageTitle from "@/components/shared/PageTitle";
import StatusLabel from "@/components/shared/StatusLabel";
import {
  useGetCustomer,
  useGetCustomerRecipients,
  useUpdateCustomer,
  useGetIncomeDocuments,
  useGetIdentityDocuments,
  useUploadIdentityDocuments,
  useUploadIncomeDocuments,
} from "@/hooks/data/useCustomers";
import { CUSTOMER_STATUS_COLORS } from "@/constants/appConstants";
import EditSectionCard from "@/components/shared/EditSectionCard";
import CustomerBasicDetails from "../CustomerCreatePage/components/CustomerBasicDetails";
import CustomerDocumentUpload from "@/components/customers/CustomerDocumentUpload";
import { DataTable } from "@/components/shared/DataTable";
import ActionButton from "@/components/shared/ActionButton";
import { useGetTransfers } from "@/hooks/data/useTransfers";
import { useGetPaymentLinks } from "@/hooks/data/usePaymentLinks";
import { transferColumns } from "@/components/transfers/TransferTableColumns";
import { customerRecipientsColumns } from "@/components/recipients/RecipientsTableColumns";
import { customerPaymentLinksColumns } from "@/components/paymentLinks/paymentLinksTableColumns";
import EditMultiSectionCard from "@/components/shared/EditMultiSectionCard";
import type {
  CustomerIdentityFileData,
  CustomerIncomeFileData,
} from "@/types/customers";
import { z } from "zod";
export const identitySchema = z.object({
  document_type: z.string().nonempty("Document type is required"),
  document_number: z.string().nonempty("Document number is required"),
  issuing_date: z
    .string()
    .nonempty("Document issue date is required")
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
  expiry_date: z
    .string()
    .nonempty("Document expiry date is required")
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
  front_image: z
    .any()
    .refine((file) => file != null, "Front document file is required"),
  // back_image: z
  //   .any()
  //   .refine((file) => file != null, "Back document file is required"),
});

export const customerSchema = z.object({
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
  house_number: z.string().nonempty("Street name is required"),
  // postal_code: z.string().min(3, "Postal code is too short"),
  phone_number: z
    .string()
    .nonempty("Phone number is required")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
  // .min(6, "Phone number is too short"),
  country_phone_code: z.string().nonempty("Country phone code required"),
  status: z.string().optional(),
});

const CustomerEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetCustomer(id!);
  const [formData, setFormData] = useState<any>({});
  const [basicInfoEditMode, setBasicInfoEditMode] = React.useState(false);

  const transferCols = transferColumns();
  const recipientsCols = customerRecipientsColumns();
  const paymentsCols = customerPaymentLinksColumns();

  const { mutateAsync: updateCustomer, isPending: isUpdateCustomerPending } =
    useUpdateCustomer(
      id!,
      () => {
        setBasicInfoEditMode(false);
        setValidationErrors({});
      },
      (errorsData: any) => setValidationErrors(errorsData)
    );

  const { data: identityDataResponse } = useGetIdentityDocuments(id!);
  const { data: incomeDataResponse } = useGetIncomeDocuments(id!);

  const {
    mutateAsync: uploadIdentityDocuments,
    isPending: isPendingIndentity,
  } = useUploadIdentityDocuments({
    onSuccess: () => {
      setBasicInfoEditMode(false);
      setIdentityErrors({});
    },
    onError: (errorsData: any) => setIdentityErrors(errorsData),
  });
  const { mutateAsync: uploadIncomeDocuments, isPending: isPendingIncomes } =
    useUploadIncomeDocuments();

  const {
    data: transfersResponse,
    isLoading: isTransfersLoading,
    error: tansfersError,
  } = useGetTransfers(`?customer_ids[]=${id}`);
  const {
    data: recipientsResponse,
    isLoading: isRecipientLoading,
    error: recipientError,
  } = useGetCustomerRecipients(id!);
  const {
    data: paymentResponse,
    isLoading: isPaymentsLoading,
    error: paymentError,
  } = useGetPaymentLinks(`?customer_ids[]=${id}&status[]=valid_link`);
  const recipientsData = useMemo(() => {
    return recipientsResponse?.data || [];
  }, [recipientsResponse]);
  const transfersData = useMemo(() => {
    return transfersResponse?.data || [];
  }, [transfersResponse?.data]);

  const paymentData = useMemo(() => {
    return paymentResponse?.data?.data || [];
  }, [paymentResponse?.data]);

  useEffect(() => {
    if (data && data.data) {
      setFormData({
        country_id: data.data?.country.id,
        city_id: data.data?.city.id,
        state_id: data.data?.state?.id,
        postal_code: data.data.postal_code ?? "",
        first_name: data.data.first_name,
        last_name: data.data.last_name,
        email: data?.data?.email,
        date_of_birth: data.data.date_of_birth,
        gender: data.data.gender,
        street_name: data.data.street_name,
        house_number: data.data.house_number,
        phone_number: data.data.phone_number,
        country_phone_code: data.data.country_phone_code,
        extra_address_details: data.data.extra_address_details ?? "",
        status: data.data.status,
        created_at: data.data.created_at,
      });
    }
  }, [data]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleInputChange = (field: string, value: any) => {
    // Clear city when country changes
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
    // Clear error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev: Record<string, string[]>) => ({
        ...prev,
        [field]: [],
      }));
    }
  };

  const handleDateChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev: Record<string, string[]>) => ({
        ...prev,
        [field]: [],
      }));
    }
  };
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [identityErrors, setIdentityErrors] = useState<Record<string, string>>(
    {}
  );
  const validateIdentityData = () => {
    const result = identitySchema.safeParse(identityData);

    if (!result.success) {
      const errors: any = result.error.flatten().fieldErrors;
      setIdentityErrors(errors);
      return false;
    }
    setIdentityErrors({});
    return true;
  };

  const handleSave = async () => {
    try {
      const payloadToUpdate: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        country_id: formData.country_id,
        city_id: formData.city_id,
        street_name: formData.street_name,
        house_number: formData.house_number,
        postal_code: formData.postal_code ?? "",
        phone_number: formData.phone_number,
        country_phone_code: formData.country_phone_code,
        // status: formData.status,
      };
      const validationResult = customerSchema.safeParse(payloadToUpdate);
      console.log("check ==== epayloadToUpdate = ", payloadToUpdate);

      if (!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors;
        console.log("check ==== epayloadToUpdate = ", payloadToUpdate);
        console.log("check ==== error edits = ", errors);

        // // Optional: show toast or inline messages
        // toast.error("Please fix the highlighted errors before saving.");
        setValidationErrors(errors); // We'll define this state below
        return;
      }
      const result = await updateCustomer(payloadToUpdate);
      console.log(" customer data resultttt  == = ", result);
    } catch (e) {
      // handle error
    }
  };
  const handleSaveDocuments = async () => {
    console.log(" save documents ", identityData);
    console.log(" save incomeData ", incomeData);
    const isIdentityValid = validateIdentityData();
    if (!isIdentityValid) {
      // optional: toast.error("Please fix errors before saving");
      return;
    }
    const result = await uploadIdentityDocuments({
      id: id!,
      data: identityData,
    });
    console.log(" result doccccssss  = ", result);
    if (incomeData?.length) {
      for (let data of incomeData) {
        uploadIncomeDocuments({ id: id!, data });
      }
    }
  };

  const statusColor =
    CUSTOMER_STATUS_COLORS[
      formData.status as keyof typeof CUSTOMER_STATUS_COLORS
    ] || "#000000";
  React.useEffect(() => {});
  const [identityData, setIdentityData] = useState<CustomerIdentityFileData>({
    document_type: "",
    document_number: "",
    issuing_date: "",
    expiry_date: "",
    front_image: null,
    back_image: null,
  });
  useEffect(() => {
    if (identityDataResponse?.data?.length) {
      setIdentityData(identityDataResponse?.data[0]);
    }
  }, [identityDataResponse]);
  const [incomeData, setIncomeData] = useState<CustomerIncomeFileData[]>([]);
  useEffect(() => {
    // if (identityDataResponse.front_image) {
    //   console.log(
    //     "identityDataResponse front_image*** = ",
    //     identityDataResponse
    //   );
    // }
    console.log(" identityDataResponse ******** ", identityDataResponse);
  }, [identityDataResponse]);
  useEffect(() => {
    console.log("incomeDataResponse = ", incomeDataResponse);
  }, [incomeDataResponse]);

  const customerSections: any[] = [
    {
      sectionTitle: "Customer Bio",
      onSave: handleSave,
      loading: isUpdateCustomerPending,
      editMode: basicInfoEditMode,
      setEditMode: setBasicInfoEditMode,
      content: (
        <CustomerBasicDetails
          formData={formData}
          handleInputChange={handleInputChange}
          handleDateChange={handleDateChange}
          editMode={basicInfoEditMode}
          validationErrors={validationErrors}
        />
      ),
    },
    {
      sectionTitle: "Documents",
      onSave: handleSaveDocuments,
      loading: isPendingIndentity || isPendingIncomes,
      editMode: basicInfoEditMode,
      setEditMode: setBasicInfoEditMode,
      content: (
        <CustomerDocumentUpload
          identityData={identityData}
          setIdentityData={setIdentityData}
          incomeData={incomeData}
          setIncomeData={setIncomeData}
          editMode={basicInfoEditMode}
          identityErrors={identityErrors}
        />
      ),
    },
  ];

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error)
    return <div className="p-8 text-red-500">Error loading customer.</div>;
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-start items-start gap-2 flex-wrap">
          <button
            onClick={handleBack}
            className="text-primary top-1 cursor-pointer"
          >
            <BackArrowIcon width={30} height={30} />
          </button>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium pt-1">Customer: </span>
            <PageTitle
              title={`${formData.first_name || ""} ${formData.last_name || ""}`}
            />
          </div>
          <StatusLabel
            value={formData.status || "active"}
            color={statusColor}
            className="rounded-full"
          />
        </div>
        {formData.created_at && (
          <div className="sm:ml-10">
            Registered on: {new Date(formData.created_at).toLocaleDateString()}
          </div>
        )}
      </div>

      <EditMultiSectionCard sections={customerSections} />
      <EditSectionCard sectionTitle="Recent transactions">
        <div className="p-5 flex flex-col gap-5">
          <DataTable
            data={transfersData}
            columns={transferCols}
            isLoading={isTransfersLoading}
            error={tansfersError}
          />
          <ActionButton
            title="see all transactions"
            type="cancel"
            className="m-auto"
            onClick={() => navigate(ROUTES.TRANSFERS.LIST)}
          />
        </div>
      </EditSectionCard>
      <EditSectionCard sectionTitle="Recipients">
        <div className="p-5 flex flex-col gap-5">
          <DataTable
            data={recipientsData as any}
            columns={recipientsCols}
            isLoading={isRecipientLoading}
            error={recipientError}
          />
          <ActionButton
            title="see all recipients"
            type="cancel"
            className="m-auto"
            onClick={() =>
              navigate(
                ROUTES.RECIPIENTS.LIST +
                  `?customer_ids=${id}&search=${formData?.first_name}`
              )
            }
          />
        </div>
      </EditSectionCard>
      <EditSectionCard sectionTitle="Pending Payments">
        <div className="p-5 flex flex-col gap-5">
          <DataTable
            data={paymentData}
            columns={paymentsCols}
            isLoading={isPaymentsLoading}
            error={paymentError}
          />
          <ActionButton
            title="see all payment links"
            type="cancel"
            className="m-auto"
            onClick={() => navigate(ROUTES.PAYMENT_LINKS.LIST)}
          />
        </div>
      </EditSectionCard>
    </div>
  );
};

export default CustomerEditPage;
