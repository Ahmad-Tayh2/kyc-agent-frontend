// import { useMemo } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { useTranslation } from "react-i18next";
// import { useGetCustomers } from "@/hooks/data/useCustomers";
// import { useNavigate } from "react-router-dom";

import PageTitle from "@/components/shared/PageTitle";
import PaymentLinksFilters from "@/components/paymentLinks/PaymentLinksFilters";
import { paymentLinksColumns } from "@/components/paymentLinks/paymentLinksTableColumns";
import { usePaymentLinksFilters } from "@/hooks/data/usePaymentLinksFilters";
import { useGetPaymentLinks } from "@/hooks/data/usePaymentLinks";
import { useMemo } from "react";
import { useGetCustomers } from "@/hooks/data/useCustomers";
// import { ROUTES } from "@/constants/routes";

const PaymentLinksPage: React.FC = () => {
  const [t] = useTranslation("global");
  //   const navigate = useNavigate();
  const columns = paymentLinksColumns();

  const {
    filters,
    filtersString,
    updateStatus,
    updateDateRange,
    updateCustomersIds,
    resetFilters,
    applyFilters,
    updatePagination,
  } = usePaymentLinksFilters();

  const {
    data: response,
    isLoading,
    error,
  } = useGetPaymentLinks(filtersString);

  const paymentLinksData = useMemo(() => {
    return response?.data?.data || [];
  }, [response?.data?.data]);

  const paymentLinksMeta = useMemo(() => {
    return response?.data?.meta || [];
  }, [response?.data?.meta]);

  const { data: CustomersResponse } = useGetCustomers("");

  const customersData = useMemo(() => {
    return CustomersResponse?.data || [];
  }, [CustomersResponse?.data]);

  const pagination = {
    enable: true,
    page: paymentLinksMeta?.current_page,
    per_page: paymentLinksMeta?.per_page,
    total: paymentLinksMeta?.total,
    from: paymentLinksMeta?.from,
    to: paymentLinksMeta?.to,
    last_page: paymentLinksMeta?.last_page,
    onChangeRowsPerPage: (value: number) => {
      updatePagination({ per_page: value });
    },
    setPage: (value: number) => {
      updatePagination({ page: value });
    },
  };
  return (
    <div className="space-y-4">
      <div className="flex justify-between sm:items-center flex-col sm:flex-row gap-3">
        <PageTitle title={t("modules.pages.paymentLinks.title")} />
        <PaymentLinksFilters
          filters={filters}
          customers={customersData}
          onUpdateStatus={updateStatus}
          onUpdateDateRange={updateDateRange}
          onUpdateCustomersIds={updateCustomersIds}
          onResetFilters={resetFilters}
          onApplyFilters={applyFilters}
        />
      </div>
      <div>
        <DataTable
          data={paymentLinksData}
          columns={columns}
          isLoading={isLoading}
          error={error}
          pagination={pagination}
        />
      </div>
    </div>
  );
};

export default PaymentLinksPage;
