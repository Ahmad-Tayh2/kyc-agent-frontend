import { useMemo } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { useTranslation } from "react-i18next";
import { useGetCustomers } from "@/hooks/useCustomers";
import { useNavigate } from "react-router-dom";

import AddCustomerIcon from "@/assets/icons/add-customer.svg?react";
import ActionButton from "@/components/shared/ActionButton";
import PageTitle from "@/components/shared/PageTitle";
import CustomerFilters from "@/components/customers/CustomerFilters";
import { customerColumns } from "@/components/customers/CustomerTableColumns";
import { useCustomerFilters } from "@/hooks/useCustomerFilters";
import { ROUTES } from "@/constants/routes";

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
  } = useCustomerFilters();

  const { data: response, isLoading, error } = useGetCustomers(filtersString);

  // Memoize customers data to prevent unnecessary re-renders
  const customersData = useMemo(() => {
    return response?.data || [];
  }, [response?.data]);

  const handleAddCustomer = () => {
    navigate(ROUTES.CUSTOMERS.CREATE);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <PageTitle title={t("modules.pages.customers.title")} />
        <ActionButton
          title="add new customer"
          icon={<AddCustomerIcon />}
          onClick={handleAddCustomer}
        />
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
          enablePagination={true}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default CustomersPage;
