// import { useMemo } from "react";
import { DataTable } from '@/components/shared/DataTable';
import { useTranslation } from 'react-i18next';
// import { useGetAddMoneyHistory } from "@/hooks/data/useAddMoney";
import AddMoneyFilters from '@/components/addMoney/AddMoneyFilters';
import { AddMoneyTableColumns } from '@/components/addMoney/AddMoneyTableColumns';
import PageTitle from '@/components/shared/PageTitle';
import SummaryCard from '@/components/shared/SummaryCard';
import type { ReactElement } from 'react';
// import { SingleSelectDropdown } from "@/components/shared/SingleSelectDropdown";
import CurrencyInput from '@/components/CurrencyInput';
import ActionButton from '@/components/shared/ActionButton';
import { Label } from '@/components/ui/label';
import { useAddMoneyFilters } from '@/hooks/data/useAddMoneyFilters';
import { useAddMoneyTransactions, useWallet } from '@/hooks/data/useWallet';
import { geAgentIdFromStorage } from '@/utils/authHelpers';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
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
    required_error: 'Please select a currency',
  }),
  amount: z
    .number({
      required_error: 'Please enter an amount',
    })
    .min(0.01, 'Amount must be at least 0.01'),
});

const AddMoneyPage: React.FC = () => {
  const [t] = useTranslation('global');
  const navigate = useNavigate();
  const columns = AddMoneyTableColumns();

  const {
    filters,
    filtersString: addMoneyFiltersString,
    updateStatus: updateAddMoneyTransactionsStatus,
    resetFilters: resetAddMoneyTransactionsFilters,
    applyFilters: applyAddMoneyTransactionsFilters,
    // updatePagination,
  } = useAddMoneyFilters();

  // Get agent ID and fetch wallet
  const agentId = geAgentIdFromStorage();
  const { data: wallet, isLoading: isLoadingWallet } = useWallet(agentId || '');
  const {
    data: addMoneyTransactions,
    isLoading: isLoadingAddMoneyTransactions,
    error: errorAddMoneyTransactions,
  } = useAddMoneyTransactions(addMoneyFiltersString);

  const addMoneyTransactionsData = useMemo(() => {
    return addMoneyTransactions?.data || [];
  }, [addMoneyTransactions]);

  // const addMoneyTransactionsMeta = useMemo(() => {
  //   return addMoneyTransactions?.meta || [];
  // }, [addMoneyTransactions]);

  // State for currency and amount
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<
    number | undefined
  >();
  const [amount, setAmount] = useState<number>(0);

  // Prepare currency options from wallet
  const currencyOptions = useMemo(() => {
    if (!wallet?.wallet_currencies) return [];
    return wallet.wallet_currencies.map((wc) => ({
      id: wc?.currency?.id,
      code: wc?.currency?.code,
      name: wc?.currency?.name,
    }));
  }, [wallet]);

  // Find the selected wallet currency to get its ID
  const selectedWalletCurrency = useMemo(() => {
    if (!selectedCurrencyId || !wallet?.wallet_currencies) return null;
    return wallet.wallet_currencies.find(
      (wc) => wc?.currency?.id === selectedCurrencyId,
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
        'addMoneyData',
        JSON.stringify({
          walletCurrencyId: selectedWalletCurrency?.id,
          amount,
          currencyCode: selectedWalletCurrency?.currency?.code,
        }),
      );

      // Navigate to payment page with walletCurrencyId
      navigate(`/payment/add-${selectedWalletCurrency?.id}`);
    } catch (error) {
      console.error('Error handling add money:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  // const addMoneyTransactionsPagination = {
  //   enable: true,
  //   page: addMoneyTransactionsMeta?.current_page,
  //   per_page: addMoneyTransactionsMeta?.per_page,
  //   total: addMoneyTransactionsMeta?.total,
  //   from: addMoneyTransactionsMeta?.from,
  //   to: addMoneyTransactionsMeta?.to,
  //   last_page: addMoneyTransactionsMeta?.last_page,
  //   onChangeRowsPerPage: (value: number) => {
  //     updatePagination({ per_page: value });
  //   },
  //   setPage: (value: number) => {
  //     updatePagination({ page: value });
  //   },
  // };
  const dataList: addMoneySummaryData[] = [
    { label: 'Entered Amount', value: '100 USD', info: 'test' },
    { label: 'Exchange Rate', value: '1 USD = 0.95 EUR' },
    { label: 'Fees and Charges', value: '2.0 USD' },
    { label: 'Will Get', value: '100 USD' },
    {
      label: 'Total Payable Amount',
      value: '103.00 USD',
      labelClassName: 'text-base font-semibold text-primary',
    },
  ];

  // const paymentGatewayOptions = [
  //   { label: "Paypal", value: "paypal" },
  //   { label: "Card", value: "card" },
  // ];
  return (
    <div className='space-y-4'>
      <div className='space-y-4 border-b-1 pb-5 border-b-gray-200'>
        <div className='flex justify-between items-center'>
          <PageTitle title={t('modules.pages.addMoney.title')} />
        </div>
        <div className='bg-white rounded-lg border p-5 '>
          <div className='flex flex-col md:flex-row gap-3'>
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
            <div className='flex flex-col gap-1 w-1/2'>
              <Label className='text-[14px]'>
                Currency & Amount<span>*</span>
              </Label>
              <CurrencyInput
                currencyOptions={currencyOptions}
                selectedCurrencyId={selectedCurrencyId}
                amount={amount}
                onCurrencyChange={setSelectedCurrencyId}
                onAmountChange={setAmount}
                loading={isLoadingWallet}
                placeholder='Select currency'
                amountPlaceholder='Enter amount'
              />
            </div>
            <div className='w-full md:w-1/2'>
              <SummaryCard title='Summary' data={dataList} />
            </div>
          </div>
          <div className='border-t-1 border-gray-200 mt-5 pt-5 flex justify-end'>
            <ActionButton
              title='add money'
              type='action'
              onClick={handleAddMoney}
            />
          </div>
        </div>
      </div>
      <div className='space-y-4'>
        <div className='bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3'>
          <svg
            className='w-5 h-5 text-green-600 mt-0.5 flex-shrink-0'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <div className='flex-1'>
            <p className='text-sm text-green-700 font-medium'>
              Processing Time Notice:{' '}
              <span className='text-sm text-green-700 mt-1'>
                Add money operations could take some time to process.
              </span>
            </p>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <PageTitle title={t('modules.pages.addMoney.historyTitle')} />
          <AddMoneyFilters
            filters={filters}
            onUpdateStatus={updateAddMoneyTransactionsStatus}
            onResetFilters={resetAddMoneyTransactionsFilters}
            onApplyFilters={applyAddMoneyTransactionsFilters}
          />
        </div>
        <div>
          <DataTable
            data={addMoneyTransactionsData}
            columns={columns}
            isLoading={isLoadingAddMoneyTransactions}
            error={errorAddMoneyTransactions}
            // pagination={addMoneyTransactionsPagination}
          />
        </div>
      </div>
    </div>
  );
};

export default AddMoneyPage;
