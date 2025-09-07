// import { useMemo } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { useTranslation } from "react-i18next";
// import { useGetCommission } from "@/hooks/data/useCommission";
import PageTitle from "@/components/shared/PageTitle";
import CommissionFilters from "@/components/commission/CommissionFilters";
import { CommissionTableColumns } from "@/components/commission/CommissionTableColumns";
import ReportIssueDialog from "@/components/commission/ReportIssueDialog";
// import { useCommissionFilters } from "@/hooks/data/useCommissionFilters";
// import { ROUTES } from "@/constants/routes";

const MoneyWithdrawalsPage: React.FC = () => {
  const [t] = useTranslation("global");
  const columns = CommissionTableColumns();
  const filters = {};
  const updateSearchTerm = () => {};
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
        <PageTitle title={t("modules.pages.commissionEarned.title")} />
      </div>

      <CommissionFilters
        filters={filters}
        onUpdateSearchTerm={updateSearchTerm}
        onResetFilters={resetFilters}
        onApplyFilters={applyFilters}
      />
      <div>
        <ReportIssueDialog trigger={<div>Report issue popup</div>} />
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

export default MoneyWithdrawalsPage;
