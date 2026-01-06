// import { useMemo } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { useTranslation } from "react-i18next";
// import { useMoneyWithdrawals } from "@/hooks/data/useMoneyWithdrawals";
import PageTitle from "@/components/shared/PageTitle";
import MoneyWithdrawalsFilters from "@/components/moneyWithdrawals/MoneyWithdrawalsFilters";
import { MoneyWithdrawalsTableColumns } from "@/components/moneyWithdrawals/MoneyWithdrawalsTableColumns";
import ActionButton from "@/components/shared/ActionButton";
import WithdrawalIcon from "@/assets/icons/withdrawal.svg?react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
// import { useMoneyWithdrawalsFilters } from "@/hooks/data/useMoneyWithdrawalsFilters";
// import { ROUTES } from "@/constants/routes";

const MoneyWithdrawalsPage: React.FC = () => {
  const [t] = useTranslation("global");
  const columns = MoneyWithdrawalsTableColumns();
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
  // } = useMoneyWithdrawalsFilters();
  const navigate = useNavigate();
  // const { data: response, isLoading, error } = useMoneyWithdrawals(filtersString);

  // const moneyWithdrawalsData = useMemo(() => {
  //   return response?.data || [];
  // }, [response?.data]);

  // const moneyWithdrawalsDataMeta = useMemo(() => {
  //   return response?.meta || [];
  // }, [response?.meta]);
  const handleRequestWithdrawal = () => {
    navigate(ROUTES.MONEY_WITHDRAWALS.REQUEST);
  };
  // const pagination = {
  //   enable: true,
  //   page: moneyWithdrawalsDataMeta?.current_page,
  //   per_page: moneyWithdrawalsDataMeta?.per_page,
  //   total: moneyWithdrawalsDataMeta?.total,
  //   from: moneyWithdrawalsDataMeta?.from,
  //   to: moneyWithdrawalsDataMeta?.to,
  //   last_page: moneyWithdrawalsDataMeta?.last_page,
  //   onChangeRowsPerPage: (value: number) => {
  //     updatePagination({ per_page: value });
  //   },
  //   setPage: (value: number) => {
  //     updatePagination({ page: value });
  //   },
  // };
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap sm:flex-nowrap">
        <PageTitle title={t("modules.pages.moneyWithdrawals.title")} />
        <div className="flex items-center gap-1">
          <MoneyWithdrawalsFilters
            filters={filters}
            onUpdateSearchTerm={updateSearchTerm}
            onResetFilters={resetFilters}
            onApplyFilters={applyFilters}
          />
          <ActionButton
            title="Request withdrawal"
            icon={<WithdrawalIcon />}
            onClick={handleRequestWithdrawal}
          />
        </div>
      </div>

      <div>
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
