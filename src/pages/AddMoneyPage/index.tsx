// import { useMemo } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { useTranslation } from "react-i18next";
// import { useGetAddMoneyHistory } from "@/hooks/data/useAddMoney";
import PageTitle from "@/components/shared/PageTitle";
import AddMoneyFilters from "@/components/addMoney/AddMoneyFilters";
import { AddMoneyTableColumns } from "@/components/addMoney/AddMoneyTableColumns";
import SummaryCard from "@/components/shared/SummaryCard";
import type { ReactElement } from "react";
// import { SingleSelectDropdown } from "@/components/shared/SingleSelectDropdown";
import CurrencyInput from "@/components/CurrencyInput";
import { Label } from "@/components/ui/label";
import ActionButton from "@/components/shared/ActionButton";
import { useAddMoneyTransactions, useWallet } from "@/hooks/data/useWallet";
import { geAgentIdFromStorage } from "@/utils/authHelpers";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
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

// Validation schema for add money form
const addMoneySchema = z.object({
  walletCurrencyId: z.number({
    required_error: "Please select a currency",
  }),
  amount: z
    .number({
      required_error: "Please enter an amount",
    })
    .min(0.01, "Amount must be at least 0.01"),
});

const AddMoneyPage: React.FC = () => {
  const [t] = useTranslation("global");
  const navigate = useNavigate();
  const columns = AddMoneyTableColumns();
  const filters = {};
  const resetFilters = () => {};
  const applyFilters = () => {};

  // Get agent ID and fetch wallet
  const agentId = geAgentIdFromStorage();
  const { data: wallet, isLoading: isLoadingWallet } = useWallet(agentId || "");
  const { data: addMoneyTransactions } = useAddMoneyTransactions("");
  const addMoneyTransactionsData = useMemo(() => {
    return addMoneyTransactions?.data || [];
  }, [addMoneyTransactions]);

  // State for currency and amount
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<
    number | undefined
  >();
  const [amount, setAmount] = useState<number>(0);

  // Prepare currency options from wallet
  const currencyOptions = useMemo(() => {
    if (!wallet?.wallet_currencies) return [];
    return wallet.wallet_currencies.map((wc) => ({
      id: wc.currency.id,
      code: wc.currency.code,
      name: wc.currency.name,
    }));
  }, [wallet]);

  // Find the selected wallet currency to get its ID
  const selectedWalletCurrency = useMemo(() => {
    if (!selectedCurrencyId || !wallet?.wallet_currencies) return null;
    return wallet.wallet_currencies.find(
      (wc) => wc.currency.id === selectedCurrencyId
    );
  }, [selectedCurrencyId, wallet]);

  // Handle add money button click
  const handleAddMoney = () => {
    try {
      // Validate form data
      const validationResult = addMoneySchema.safeParse({
        walletCurrencyId: selectedWalletCurrency?.id,
        amount,
      });

      if (!validationResult.success) {
        // Show validation errors
        validationResult.error.errors.forEach((error) => {
          toast.error(error.message);
        });
        return;
      }

      // Store the data in sessionStorage to use in the payment page
      sessionStorage.setItem(
        "addMoneyData",
        JSON.stringify({
          walletCurrencyId: selectedWalletCurrency?.id,
          amount,
          currencyCode: selectedWalletCurrency?.currency.code,
        })
      );

      // Navigate to payment page with walletCurrencyId
      navigate(`/payment/add-${selectedWalletCurrency?.id}`);
    } catch (error) {
      console.error("Error handling add money:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

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

  // const paymentGatewayOptions = [
  //   { label: "Paypal", value: "paypal" },
  //   { label: "Card", value: "card" },
  // ];
  return (
    <div className="space-y-4">
      <div className="space-y-4 border-b-1 pb-5 border-b-gray-200">
        <div className="flex justify-between items-center">
          <PageTitle title={t("modules.pages.addMoney.title")} />
        </div>
        <div className="bg-white rounded-lg border p-5 ">
          <div className="flex gap-3">
            {/* <div className="flex flex-col gap-1 w-1/3">
              <Label className="text-[14px]">
                Payment Gateway<span>*</span>
              </Label>
              <SingleSelectDropdown
                options={paymentGatewayOptions}
                selectedValue=""
                onValueChange={() => {}}
              />
            </div> */}
            <div className="flex flex-col gap-1 w-1/2">
              <Label className="text-[14px]">
                Currency & Amount<span>*</span>
              </Label>
              <CurrencyInput
                currencyOptions={currencyOptions}
                selectedCurrencyId={selectedCurrencyId}
                amount={amount}
                onCurrencyChange={setSelectedCurrencyId}
                onAmountChange={setAmount}
                loading={isLoadingWallet}
                placeholder="Select currency"
                amountPlaceholder="Enter amount"
              />
            </div>
            <div className="w-1/2">
              <SummaryCard title="Summary" data={dataList} />
            </div>
          </div>
          <div className="border-t-1 border-gray-200 mt-5 pt-5 flex justify-end">
            <ActionButton
              title="add money"
              type="action"
              onClick={handleAddMoney}
            />
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
            data={addMoneyTransactionsData}
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
