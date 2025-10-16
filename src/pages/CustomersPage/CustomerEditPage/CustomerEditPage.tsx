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
    useUpdateCustomer(id!, () => setBasicInfoEditMode(false));

  const { data: identityDataResponse } = useGetIdentityDocuments(id!);
  const { data: incomeDataResponse } = useGetIncomeDocuments(id!);

  const {
    mutateAsync: uploadIdentityDocuments,
    isPending: isPendingIndentity,
  } = useUploadIdentityDocuments();
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
        postal_code: data.data.postal_code,
        first_name: data.data.first_name,
        last_name: data.data.last_name,
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
    navigate(ROUTES.CUSTOMERS.LIST);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const payloadToUpdate: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        country_id: formData.country_id,
        city_id: formData.city_id,
        street_name: formData.street_name,
        house_number: formData.house_number,
        postal_code: formData.postal_code,
        phone_number: formData.phone_number,
        country_phone_code: formData.country_phone_code,
        status: formData.status,
      };
      await updateCustomer(payloadToUpdate);
    } catch (e) {
      // handle error
    }
  };
  const handleSaveDocuments = async () => {
    console.log(" save documents ", identityData);
    console.log(" save incomeData ", incomeData);
    uploadIdentityDocuments({ id: id!, data: identityData });
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

  const [identityData, setIdentityData] = useState<CustomerIdentityFileData>({
    documentType: "",
    documentNumber: "",
    documentIssueDate: "",
    documentExpiryDate: "",
    frontDocument: null,
    backDocument: null,
  });
  const [incomeData, setIncomeData] = useState<CustomerIncomeFileData[]>([]);
  useEffect(() => {
    console.log("identityDataResponse = ", identityDataResponse);
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
      <div className="">
        <div className="flex justify-start items-center gap-3">
          <button
            onClick={handleBack}
            className="text-primary top-1 cursor-pointer"
          >
            <BackArrowIcon width={30} height={30} />
          </button>
          <PageTitle
            title={`${formData.first_name || ""} ${formData.last_name || ""}`}
          />
          <StatusLabel
            value={formData.status || "active"}
            color={statusColor}
            className="rounded-full"
          />
        </div>
        {formData.created_at && (
          <div className="ml-10">
            Registered on: {new Date(formData.created_at).toLocaleDateString()}
          </div>
        )}
      </div>

      <EditMultiSectionCard customerSections={customerSections} />
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
            onClick={() => navigate(ROUTES.RECIPIENTS.LIST)}
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
