import { useMemo } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { useTranslation } from "react-i18next";
import { useRecipients } from "@/hooks/useRecipients";
// import { useNavigate } from "react-router-dom";

// import AddCustomerIcon from "@/assets/icons/add-customer.svg?react";
// import ActionButton from "@/components/shared/ActionButton";
import PageTitle from "@/components/shared/PageTitle";
import RecipientsFilters from "@/components/recipients/RecipientsFilters";
import { recipientsColumns } from "@/components/recipients/RecipientsTableColumns";
import { useRecipientsFilters } from "@/hooks/useRecipientsFilters";
// import { ROUTES } from "@/constants/routes";

const RecipientsPage: React.FC = () => {
  const [t] = useTranslation("global");
  // const navigate = useNavigate();
  const columns = recipientsColumns();

  const {
    filters,
    filtersString,
    updateSearchTerm,
    updateCustomersIds,
    // updateCuntryId,
    updateRemittanceMethodIds,
    updateIds,
    // updateAddedBy,
    resetFilters,
    applyFilters,
  } = useRecipientsFilters();

  const { data: response, isLoading, error } = useRecipients(filtersString);

  const recipientsData = useMemo(() => {
    return response?.data || [];
  }, [response?.data]);

  // const handleAddRecipient = () => {
  //   navigate(ROUTES.RECIPIENTS.CREATE);
  // };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <PageTitle title={t("modules.pages.recipients.title")} />
        {/* <ActionButton
          title="add new customer"
          icon={<AddCustomerIcon />}
          onClick={handleAddRecipient}
        /> */}
      </div>
      <RecipientsFilters
        filters={filters}
        onUpdateSearchTerm={updateSearchTerm}
        onUpdateCustomersIds={updateCustomersIds}
        // onUpdateCuntryId={updateCuntryId}
        onUpdateRemittanceMethodIds={updateRemittanceMethodIds}
        onUpdateIds={updateIds}
        // onUpdateAddedBy={updateAddedBy}
        onResetFilters={resetFilters}
        onApplyFilters={applyFilters}
      />
      <div>
        <DataTable
          data={recipientsData}
          columns={columns}
          enablePagination={true}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default RecipientsPage;
