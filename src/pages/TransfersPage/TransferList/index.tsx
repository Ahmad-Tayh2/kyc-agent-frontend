import { useMemo } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { useTranslation } from "react-i18next";
import { useGetTransfers } from "@/hooks/data/useTransfers";

import SendRemittanceIcon from "@/assets/icons/send-remittance.svg?react";
import ActionButton from "@/components/shared/ActionButton";
import PageTitle from "@/components/shared/PageTitle";
import TransferFilters from "@/components/transfers/TransferFilters";
import { transferColumns } from "@/components/transfers/TransferTableColumns";
import { useTransferFilters } from "@/hooks/data/useTransferFilters";
import { useGetCustomers } from "@/hooks/data/useCustomers";

const TransferList: React.FC = () => {
  const [t] = useTranslation("global");
  const columns = transferColumns();

  const {
    filters,
    filtersString,
    updateSearchTerm,
    updateStatus,
    updateCustomersIds,
    updateSendingDate,
    updateReceiveCurrency,
    resetFilters,
    applyFilters,
    updatePagination,
  } = useTransferFilters();

  const { data: response, isLoading, error } = useGetTransfers(filtersString);

  // Memoize transfers data to prevent unnecessary re-renders
  const transfersData = useMemo(() => {
    return response?.data || [];
  }, [response?.data]);

  const transfersMeta: any = useMemo(() => {
    return response?.meta || [];
  }, [response?.meta]);

  const { data: CustomersResponse } = useGetCustomers();

  const customersData = useMemo(() => {
    return CustomersResponse?.data || [];
  }, [CustomersResponse?.data]);

  const handleCreateTransfer = () => {
    // TODO: Implement transfer creation
    console.log("Create transfer clicked");
  };

  const pagination = {
    enable: true,
    page: transfersMeta?.current_page,
    per_page: transfersMeta?.per_page,
    total: transfersMeta?.total,
    from: transfersMeta?.from,
    to: transfersMeta?.to,
    last_page: transfersMeta?.last_page,
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
        <PageTitle title={t("modules.pages.transfers.title")} />
        <ActionButton
          title="Create new transfer"
          icon={<SendRemittanceIcon />}
          onClick={handleCreateTransfer}
        />
      </div>
      <TransferFilters
        filters={filters}
        customers={customersData}
        onUpdateSearchTerm={updateSearchTerm}
        onUpdateStatus={updateStatus}
        onUpdateCustomersIds={updateCustomersIds}
        onUpdateSendingDate={updateSendingDate}
        onUpdateReceiveCurrency={updateReceiveCurrency}
        onResetFilters={resetFilters}
        onApplyFilters={applyFilters}
      />
      <div>
        <DataTable
          data={transfersData}
          columns={columns}
          isLoading={isLoading}
          error={error}
          pagination={pagination}
        />
      </div>
    </div>
  );
};

export default TransferList;
