import { useMemo } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { useTranslation } from "react-i18next";
import { useGetCustomers } from "@/hooks/data/useCustomers";
import { useNavigate } from "react-router-dom";

import AddCustomerIcon from "@/assets/icons/add-customer.svg?react";
import ActionButton from "@/components/shared/ActionButton";
import PageTitle from "@/components/shared/PageTitle";
import CustomerFilters from "@/components/customers/CustomerFilters";
import { customerColumns } from "@/components/customers/CustomerTableColumns";
import { useCustomerFilters } from "@/hooks/data/useCustomerFilters";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/authStore";

const CustomersPage: React.FC = () => {
  const [t] = useTranslation("global");
  const navigate = useNavigate();
  const columns = customerColumns();

  const {
    filters,
    filtersString,
    updateSearchTerm,
    updateReferenceNumber,
    updateStatus,
    updateDateRange,
    updateCountryIds,
    resetFilters,
    applyFilters,
    updatePagination,
  } = useCustomerFilters();

  const { data: response, isLoading, error } = useGetCustomers(filtersString);
  const { user } = useAuthStore();

  // Memoize customers data to prevent unnecessary re-renders
  const customersData = useMemo(() => {
    return response?.data || [];
  }, [response?.data]);

  const customersMeta = useMemo(() => {
    return response?.meta || [];
  }, [response?.meta]);

  const handleAddCustomer = () => {
    navigate(ROUTES.CUSTOMERS.CREATE);
  };
  const pagination = {
    enable: true,
    page: customersMeta?.current_page,
    per_page: customersMeta?.per_page,
    total: customersMeta?.total,
    from: customersMeta?.from,
    to: customersMeta?.to,
    last_page: customersMeta?.last_page,
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
        <div>
          <PageTitle title={t("modules.pages.customers.title")} />
          {pagination?.total && (
            <div>
              Total: <b>{pagination?.total}</b>
            </div>
          )}
        </div>
        {user?.agent?.agent_type !== "strategic_partner" && (
          <ActionButton
            title={t("modules.pages.customers.addButton")}
            icon={<AddCustomerIcon />}
            onClick={handleAddCustomer}
          />
        )}
      </div>
      <CustomerFilters
        filters={filters}
        onUpdateSearchTerm={updateSearchTerm}
        onUpdateReferenceNumber={updateReferenceNumber}
        onUpdateStatus={updateStatus}
        onUpdateDateRange={updateDateRange}
        onUpdateCountryIds={updateCountryIds}
        onResetFilters={resetFilters}
        onApplyFilters={applyFilters}
      />
      <div>
        <DataTable
          data={customersData}
          columns={columns}
          isLoading={isLoading}
          error={error}
          pagination={pagination}
        />
      </div>
    </div>
  );
};

export default CustomersPage;
