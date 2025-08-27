import { useMemo } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { useTranslation } from "react-i18next";
import { useRecipients } from "@/hooks/data/useRecipients";
import { useNavigate } from "react-router-dom";

import AddRecipientIcon from "@/assets/icons/add-customer.svg?react";
import ActionButton from "@/components/shared/ActionButton";
import PageTitle from "@/components/shared/PageTitle";
import RecipientsFilters from "@/components/recipients/RecipientsFilters";
import { recipientsColumns } from "@/components/recipients/RecipientsTableColumns";
import { useRecipientsFilters } from "@/hooks/data/useRecipientsFilters";
import { useGetCustomers } from "@/hooks/data/useCustomers";
import { ROUTES } from "@/constants/routes";

const RecipientsPage: React.FC = () => {
  const [t] = useTranslation("global");
  const navigate = useNavigate();
  const columns = recipientsColumns();

  const {
    filters,
    filtersString,
    updateSearchTerm,
    updateCustomersIds,
    updateCountryIds,
    updateRemittanceMethodIds,
    resetFilters,
    applyFilters,
    updatePagination,
  } = useRecipientsFilters();

  const { data: response, isLoading, error } = useRecipients(filtersString);
  const { data: CustomersResponse } = useGetCustomers(filtersString);

  const recipientsData = useMemo(() => {
    return response?.data || [];
  }, [response?.data]);

  const recipientsMeta = useMemo(() => {
    return response?.meta || [];
  }, [response?.meta]);

  const customersData = useMemo(() => {
    return CustomersResponse?.data || [];
  }, [CustomersResponse?.data]);

  const handleAddRecipient = () => {
    navigate(ROUTES.RECIPIENTS.CREATE);
  };

  const pagination = {
    enable: true,
    page: recipientsMeta?.current_page,
    per_page: recipientsMeta?.per_page,
    total: recipientsMeta?.total,
    from: recipientsMeta?.from,
    to: recipientsMeta?.to,
    last_page: recipientsMeta?.last_page,
    onChangeRowsPerPage: (value: number) => {
      updatePagination({ per_page: value });
    },
    setPage: (value: number) => {
      updatePagination({ page: value });
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <PageTitle title={t("modules.pages.recipients.title")} />
        <ActionButton
          title="add new recipient"
          icon={<AddRecipientIcon />}
          onClick={handleAddRecipient}
        />
      </div>
      <RecipientsFilters
        filters={filters}
        customers={customersData}
        onUpdateSearchTerm={updateSearchTerm}
        onUpdateCustomersIds={updateCustomersIds}
        onUpdateCountryIds={updateCountryIds}
        onUpdateRemittanceMethodIds={updateRemittanceMethodIds}
        onResetFilters={resetFilters}
        onApplyFilters={applyFilters}
      />
      <div>
        <DataTable
          data={recipientsData}
          columns={columns}
          isLoading={isLoading}
          error={error}
          pagination={pagination}
        />
      </div>
    </div>
  );
};

export default RecipientsPage;
