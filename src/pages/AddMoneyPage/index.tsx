// import { useMemo } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { useTranslation } from "react-i18next";
// import { useGetAddMoneyHistory } from "@/hooks/data/useAddMoney";
import PageTitle from "@/components/shared/PageTitle";
import AddMoneyFilters from "@/components/addMoney/AddMoneyFilters";
import { AddMoneyTableColumns } from "@/components/addMoney/AddMoneyTableColumns";
import SummaryCard from "@/components/shared/SummaryCard";
import type { ReactElement } from "react";
import { SingleSelectDropdown } from "@/components/shared/SingleSelectDropdown";
import CurrencyInput from "@/components/CurrencyInput";
import { Label } from "@/components/ui/label";
import ActionButton from "@/components/shared/ActionButton";
// import { useAddMoneyFilters } from "@/hooks/data/useAddMoneyFilters";
// import { ROUTES } from "@/constants/routes";

interface addMoneySummaryData {
  label: string;
  value?: string | ReactElement;
  info?: string;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}
const AddMoneyPage: React.FC = () => {
  const [t] = useTranslation("global");
  const columns = AddMoneyTableColumns();
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
  const dataList: addMoneySummaryData[] = [
    { label: "Entered Amount", value: "100 USD", info: "test" },
    { label: "Exchange Rate", value: "1 USD = 0.95 EUR" },
    { label: "Fees and Charges", value: "2.0 USD" },
    { label: "Will Get", value: "100 USD" },
    {
      label: "Total Payable Amount",
      value: "103.00 USD",
      labelClassName: "text-base font-semibold text-primary",
    },
  ];

  const paymentGatewayOptions = [
    { label: "Paypal", value: "paypal" },
    { label: "Card", value: "card" },
  ];
  return (
    <div className="space-y-4">
      <div className="space-y-4 border-b-1 pb-5 border-b-gray-200">
        <div className="flex justify-between items-center">
          <PageTitle title={t("modules.pages.addMoney.title")} />
        </div>
        <div className="bg-white rounded-lg border p-5 ">
          <div className="flex gap-3">
            <div className="flex flex-col gap-1 w-1/3">
              <Label className="text-[14px]">
                Payment Gateway<span>*</span>
              </Label>
              <SingleSelectDropdown
                options={paymentGatewayOptions}
                selectedValue=""
                onValueChange={() => {}}
              />
            </div>
            <div className="flex flex-col gap-1 w-1/3">
              <Label className="text-[14px]">
                Amount<span>*</span>
              </Label>
              <CurrencyInput currencyOptions={[]} amount={0} />
            </div>
            <div className="w-1/3">
              <SummaryCard title="Summary" data={dataList} />
            </div>
          </div>
          <div className="border-t-1 border-gray-200 mt-5 pt-5 flex justify-end">
            <ActionButton title="add money" type="action" onClick={() => []} />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <PageTitle title={t("modules.pages.addMoney.historyTitle")} />
          <AddMoneyFilters
            filters={filters}
            onResetFilters={resetFilters}
            onApplyFilters={applyFilters}
          />
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
    </div>
  );
};

export default AddMoneyPage;
