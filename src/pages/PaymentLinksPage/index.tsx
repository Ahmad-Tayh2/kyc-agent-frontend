// import { useMemo } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { useTranslation } from "react-i18next";
// import { useGetCustomers } from "@/hooks/data/useCustomers";
// import { useNavigate } from "react-router-dom";

import PageTitle from "@/components/shared/PageTitle";
import PaymentLinksFilters from "@/components/paymentLinks/PaymentLinksFilters";
import { paymentLinksColumns } from "@/components/paymentLinks/paymentLinksTableColumns";
import { useCustomerFilters } from "@/hooks/data/useCustomerFilters";
// import { ROUTES } from "@/constants/routes";

const PaymentLinksPage: React.FC = () => {
  const [t] = useTranslation("global");
  //   const navigate = useNavigate();
  const columns = paymentLinksColumns();

  const {
    filters,
    // filtersString,
    // updateSearchTerm,
    // updateReferenceNumber,
    updateStatus,
    updateDateRange,
    // updateCustomersIds,
    resetFilters,
    applyFilters,
    // updatePagination,
  } = useCustomerFilters();

  //   const { data: response, isLoading, error } = useGetCustomers(filtersString);

  // Memoize customers data to prevent unnecessary re-renders
  //   const customersData = useMemo(() => {
  //     return response?.data || [];
  //   }, [response?.data]);

  //   const customersMeta = useMemo(() => {
  //     return response?.meta || [];
  //   }, [response?.meta]);

  //   const pagination = {
  //     enable: true,
  //     page: customersMeta?.current_page,
  //     per_page: customersMeta?.per_page,
  //     total: customersMeta?.total,
  //     from: customersMeta?.from,
  //     to: customersMeta?.to,
  //     last_page: customersMeta?.last_page,
  //     onChangeRowsPerPage: (value: number) => {
  //       updatePagination({ per_page: value });
  //     },
  //     setPage: (value: number) => {
  //       updatePagination({ page: value });
  //     },
  //   };
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <PageTitle title={t("modules.pages.paymentLinks.title")} />
        <PaymentLinksFilters
          filters={filters}
          // onUpdateReferenceNumber={updateReferenceNumber}
          onUpdateStatus={updateStatus}
          onUpdateDateRange={updateDateRange}
          // onUpdateCustomersIds={updateCustomersIds}
          onUpdateCustomersIds={() => {}}
          onResetFilters={resetFilters}
          onApplyFilters={applyFilters}
        />
      </div>
      <div>
        <DataTable
          data={[]}
          columns={columns}
          //   isLoading={isLoading}
          //   error={error}
          //   pagination={pagination}
        />
      </div>
    </div>
  );
};

export default PaymentLinksPage;
