import { useMemo } from "react";
import { DataTable } from "@/components/DataTable";
import { useTranslation } from "react-i18next";
import { useGetCustomers } from "@/hooks/useCustomers";
import { useNavigate } from "react-router-dom";

import AddCustomerIcon from "@/assets/icons/add-customer.svg?react";
import ActionButton from "@/components/ActionButton";
import PageTitle from "@/components/PageTitle";
import CustomerFilters from "@/components/customers/CustomerFilters";
import { useCustomerColumns } from "@/components/customers/CustomerTableColumns";
import { useCustomerFilters } from "@/hooks/useCustomerFilters";
import { ROUTES } from "@/constants/routes";

const CustomersPage: React.FC = () => {
  const [t] = useTranslation("global");
  const navigate = useNavigate();
  const columns = useCustomerColumns();
  
  const {
    filters,
    filtersString,
    updateSearchName,
    updateCustomerNumber,
    updateStatus,
    updateDateCreated,
    updateCountry,
    resetFilters,
    applyFilters,
  } = useCustomerFilters();

  const { data: response, isLoading, error } = useGetCustomers(filtersString);

  // Memoize customers data to prevent unnecessary re-renders
  const customersData = useMemo(() => {
    return response?.data || [];
  }, [response?.data]);

  const handleAddCustomer = () => {
    navigate(ROUTES.CUSTOMERS + "/create");
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
        onUpdateSearchName={updateSearchName}
        onUpdateCustomerNumber={updateCustomerNumber}
        onUpdateStatus={updateStatus}
        onUpdateDateCreated={updateDateCreated}
        onUpdateCountry={updateCountry}
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
