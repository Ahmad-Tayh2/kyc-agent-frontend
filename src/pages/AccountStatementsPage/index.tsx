// import { useMemo } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { useTranslation } from "react-i18next";
// import { useGetAccountStatements } from "@/hooks/data/useAccountStatements";
import PageTitle from "@/components/shared/PageTitle";
import AccountStatementsFilters from "@/components/accountStatements/AccountStatementsFilters";
import { AccountStatementsTableColumns } from "@/components/accountStatements/AccountStatementsTableColumns";
// import TransactionDetailsDialog from "@/components/accountStatements/TransactionDetailsDialog";
import { useGetAccountStatements } from "@/hooks/data/useFinancialReport";
import { useMemo } from "react";
import { useAccountStatementsFilters } from "@/hooks/data/useAccountStatementsFilters";
// import { ROUTES } from "@/constants/routes";

const AccountStatementsPage: React.FC = () => {
  const [t] = useTranslation("global");
  const columns = AccountStatementsTableColumns();

  const {
    filters,
    filtersString,

    updateTypes,
    updateDateRange,
    updateCurrencies,
    resetFilters,
    applyFilters,
    updatePagination,
  } = useAccountStatementsFilters();

  const {
    data: response,
    isLoading,
    error,
  } = useGetAccountStatements(filtersString);

  const accountStatementsData = useMemo(() => {
    return response?.data || [];
  }, [response?.data]);

  const accountStatementsMeta = useMemo(() => {
    return response?.meta || [];
  }, [response?.meta]);

  const pagination = {
    enable: true,
    page: accountStatementsMeta?.current_page,
    per_page: accountStatementsMeta?.per_page,
    total: accountStatementsMeta?.total,
    from: accountStatementsMeta?.from,
    to: accountStatementsMeta?.to,
    last_page: accountStatementsMeta?.last_page,
    onChangeRowsPerPage: (value: number) => {
      updatePagination({ per_page: value });
    },
    setPage: (value: number) => {
      updatePagination({ page: value });
    },
  };
  return (
    <div className="space-y-4">
      {/* <div className="flex justify-between items-center"> */}
      <div className="flex justify-between items-center flex-wrap sm:flex-nowrap gap-3">
        <PageTitle title={t("modules.pages.accountStatements.title")} />
        <AccountStatementsFilters
          filters={filters}
          onUpdateTypes={updateTypes}
          onUpdateDateRange={updateDateRange}
          onUpdateCurrencies={updateCurrencies}
          onResetFilters={resetFilters}
          onApplyFilters={applyFilters}
        />
      </div>

      <div>
        {/* <TransactionDetailsDialog
          trigger={<div> transaction details popup</div>}
        /> */}
        <DataTable
          data={accountStatementsData}
          columns={columns}
          isLoading={isLoading}
          error={error}
          pagination={pagination}
        />
      </div>
    </div>
  );
};

export default AccountStatementsPage;
