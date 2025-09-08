// import { useMemo } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { useTranslation } from "react-i18next";
// import { useGetAccountStatements } from "@/hooks/data/useAccountStatements";
import PageTitle from "@/components/shared/PageTitle";
import AccountStatementsFilters from "@/components/accountStatements/AccountStatementsFilters";
import { AccountStatementsTableColumns } from "@/components/accountStatements/AccountStatementsTableColumns";
import TransactionDetailsDialog from "@/components/accountStatements/TransactionDetailsDialog";
// import { useCommissionFilters } from "@/hooks/data/useCommissionFilters";
// import { ROUTES } from "@/constants/routes";

const AccountStatementsPage: React.FC = () => {
  const [t] = useTranslation("global");
  const columns = AccountStatementsTableColumns();
  const filters = {};
  const resetFilters = () => {};
  const applyFilters = () => {};

  // const {
  //   filters,
  //   filtersString,
  //   updateSearchTerm,
  //   resetFilters,
  //   applyFilters,
  //   // updatePagination,
  // } = useCommissionFilters();

  // const { data: response, isLoading, error } = useGetCommission(filtersString);

  // Memoize customers data to prevent unnecessary re-renders
  // const commissionData = useMemo(() => {
  //   return response?.data || [];
  // }, [response?.data]);

  // const commissionMeta = useMemo(() => {
  //   return response?.meta || [];
  // }, [response?.meta]);

  // const pagination = {
  //   enable: true,
  //   page: commissionMeta?.current_page,
  //   per_page: commissionMeta?.per_page,
  //   total: commissionMeta?.total,
  //   from: commissionMeta?.from,
  //   to: commissionMeta?.to,
  //   last_page: commissionMeta?.last_page,
  //   onChangeRowsPerPage: (value: number) => {
  //     updatePagination({ per_page: value });
  //   },
  //   setPage: (value: number) => {
  //     updatePagination({ page: value });
  //   },
  // };
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <PageTitle title={t("modules.pages.accountStatements.title")} />
        <AccountStatementsFilters
          filters={filters}
          onResetFilters={resetFilters}
          onApplyFilters={applyFilters}
        />
      </div>

      <div>
        <TransactionDetailsDialog
          trigger={<div> transaction details popup</div>}
        />
        <DataTable
          data={[]}
          columns={columns}
          // isLoading={isLoading}
          // error={error}
          // pagination={pagination}
        />
      </div>
    </div>
  );
};

export default AccountStatementsPage;
