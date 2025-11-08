import CheckedIcon from '@/assets/icons/checked-icon.svg?react';
import CurrencyInput from '@/components/CurrencyInput';
import { useWallet } from '@/hooks/data/useWallet';
import type { TransactionPreviewPayload } from '@/types/transfers';
import { Info } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
// import type { WalletCurrency } from "@/types/wallet";
import Loader from '@/components/shared/Loader';
import { Label } from '@/components/ui/label';
// import SummaryCard from "./SummaryCard";
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAgentExtraFees } from '@/hooks/data/useAgent';
import {
  useGetCountryReceivingCurrencies,
  useGetCountrySendingCurrencies,
} from '@/hooks/data/useCountryAllowedCurrency';
import {
  useTransactionPreview,
  useTransactionPreviewByRef,
} from '@/hooks/data/useTransfers';
import { useSummaryData } from '@/hooks/useSummaryData';
import { useSendRemittanceStore } from '@/store/sendRemittanceStore';
import type { SendRemittanceExchangeDetails } from '@/types/sendRemittance';
import type { CountryCurrency } from '@/types/shared/countryAllowedCurrency';
import { useLocation } from 'react-router-dom';
import SummaryCard from './SummaryCard';

const CurrenciesAmountStep: React.FC = () => {
  // Check if there's a transaction reference in the URL path
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const sendRemittanceIndex = pathSegments.findIndex(
    (segment) => segment === 'send-remittance'
  );
  const transactionRef =
    sendRemittanceIndex !== -1 && pathSegments[sendRemittanceIndex + 1]
      ? pathSegments[sendRemittanceIndex + 1]
      : null;
  const isEditMode = !!transactionRef;

  // For now, we'll use a placeholder agent ID. In a real app, this would come from auth context
  const agentId = 2; // This should come from your auth context/state
  // Store state and actions
  const stepOne = useSendRemittanceStore((state) => state.data.stepOne);
  const sendCurrency = useSendRemittanceStore(
    (state) => state.data.stepTwo.sendCurrency
  );
  const receiveCurrency = useSendRemittanceStore(
    (state) => state.data.stepTwo.receiveCurrency
  );
  const sendAmount = useSendRemittanceStore(
    (state) => state.data.stepTwo.sendAmount
  );
  const receiveAmount = useSendRemittanceStore(
    (state) => state.data.stepTwo.receiveAmount
  );
  const setSendCurrency = useSendRemittanceStore(
    (state) => state.setSendCurrency
  );
  const setReceiveCurrency = useSendRemittanceStore(
    (state) => state.setReceiveCurrency
  );
  const setSendAmount = useSendRemittanceStore((state) => state.setSendAmount);
  const setReceiveAmount = useSendRemittanceStore(
    (state) => state.setReceiveAmount
  );

  const setExchangeDetails = useSendRemittanceStore(
    (state) => state.setExchangeDetails
  );
  const extraFeesPercent = useSendRemittanceStore(
    (state) => state.data.stepTwo.extraFeesPercent
  );
  const setExtraFeesPercent = useSendRemittanceStore(
    (state) => state.setExtraFeesPercent
  );
  const isAllFeesIncludedInSendAmount = useSendRemittanceStore(
    (state) => state.data.stepTwo.isAllFeesIncludedInSendAmount
  );
  const setIsAllFeesIncludedInSendAmount = useSendRemittanceStore(
    (state) => state.setIsAllFeesIncludedInSendAmount
  );
  const isCalculateFromReceiveAmount = useSendRemittanceStore(
    (state) => state.data.stepTwo.isCalculateFromReceiveAmount
  );
  const setIsCalculateFromReceiveAmount = useSendRemittanceStore(
    (state) => state.setIsCalculateFromReceiveAmount
  );

  // Data hooks
  const { data: wallet } = useWallet(agentId);
  const { data: extraFeesData } = useAgentExtraFees(agentId);

  const { data: sendingCurrencies } = useGetCountrySendingCurrencies(
    stepOne?.sendCountry?.id ?? ''
  );

  const { data: receivingCurrencies } = useGetCountryReceivingCurrencies(
    stepOne?.receiveCountry?.id ?? ''
  );

  // Get wallet currencies - memoized to prevent dependency issues
  const walletCurrencies = useMemo(() => {
    return wallet?.wallet_currencies || [];
  }, [wallet?.wallet_currencies]);

  // Log when edit mode is detected
  useEffect(() => {
    if (isEditMode && transactionRef) {
      console.log(
        'Edit mode detected - Using preview by reference:',
        transactionRef
      );
    } else {
      console.log('Create mode - Using normal preview');
    }
  }, [isEditMode, transactionRef]);

  useEffect(() => {
    if (sendingCurrencies?.length) {
      const defaultCurrency = sendingCurrencies?.[0]?.currency;
      setSendCurrency({
        id: defaultCurrency?.id,
        name: defaultCurrency?.name,
        code: defaultCurrency?.code,
      });
    }
  }, [sendingCurrencies, setSendCurrency]);

  useEffect(() => {
    if (receivingCurrencies?.length && sendCurrency) {
      let defaultCurrency = null;
      for (const item of receivingCurrencies) {
        if (item.currency.id !== sendCurrency?.id) {
          defaultCurrency = item.currency;
          break;
        }
      }
      if (defaultCurrency) {
        setReceiveCurrency({
          id: defaultCurrency?.id,
          name: defaultCurrency?.name,
          code: defaultCurrency?.code,
        });
      }
    }
  }, [receivingCurrencies, sendCurrency, setReceiveCurrency]);

  // Set default currencies when data is loaded
  // useEffect(() => {
  //   // Set default fromCurrency (first wallet currency)
  //   if (walletCurrencies.length > 0 && fromCurrencyId === 0) {
  //     setFromCurrencyId(walletCurrencies[0].id);
  //   }

  //   // Set default toCurrency (EUR or first available currency)
  //   if (allCurrencies.length > 0 && toCurrencyId === 0) {
  //     const eurCurrency = allCurrencies.find((c) => c.code === "EUR");
  //     const defaultToCurrency = eurCurrency || allCurrencies[0];

  //     // Make sure it's not the same as the fromCurrency
  //     const fromWalletCurrency = walletCurrencies.find(
  //       (wc: WalletCurrency) => wc.id === fromCurrencyId
  //     );

  //     if (
  //       fromWalletCurrency &&
  //       defaultToCurrency.id !== fromWalletCurrency.currency.id
  //     ) {
  //       setToCurrencyId(defaultToCurrency.id);
  //     } else {
  //       // If EUR is the same as fromCurrency, pick the next available one
  //       const alternativeCurrency = allCurrencies.find(
  //         (c) => fromWalletCurrency && c.id !== fromWalletCurrency.currency.id
  //       );
  //       if (alternativeCurrency) {
  //         setToCurrencyId(alternativeCurrency.id);
  //       }
  //     }
  //   }
  // }, [walletCurrencies, allCurrencies, fromCurrencyId, toCurrencyId]);

  // Set up the preview payload when the form values change
  const [previewPayload, setPreviewPayload] = useState<
    TransactionPreviewPayload | undefined
  >();

  // Set up preview by ref payload for edit mode
  const [previewByRefPayload, setPreviewByRefPayload] = useState<
    | Omit<
        import('@/types/transfers').TransactionPreviewByRefPayload,
        'transaction_reference'
      >
    | undefined
  >();

  useEffect(() => {
    if (isEditMode && transactionRef) {
      // Edit mode: use preview by reference
      const hasValidAmount = isCalculateFromReceiveAmount
        ? (receiveAmount && receiveAmount > 0)
        : (sendAmount && sendAmount > 0);

      if (
        sendCurrency?.code &&
        receiveCurrency?.code &&
        hasValidAmount
      ) {
        const payload: Omit<
          import('@/types/transfers').TransactionPreviewByRefPayload,
          'transaction_reference'
        > = {
          send_currency: sendCurrency.code,
          receive_currency: receiveCurrency.code,
          extra_fees_applied_percent: extraFeesPercent,
          is_all_included_in_send_amount: isAllFeesIncludedInSendAmount,
          do_calculate_from_receive_amount: isCalculateFromReceiveAmount,
          remittance_method_id: stepOne.remittanceMethod?.id || null,
          payout_agent_id: stepOne.payoutAgent?.id || null,
          // Only send the relevant amount based on calculation mode
          ...(isCalculateFromReceiveAmount
            ? { receive_amount: receiveAmount }
            : { send_amount: sendAmount }),
        };

        setPreviewByRefPayload(payload);
      } else {
        setPreviewByRefPayload(undefined);
      }
    } else {
      // Create mode: use regular preview
      const hasValidAmount = isCalculateFromReceiveAmount
        ? (receiveAmount && receiveAmount > 0)
        : (sendAmount && sendAmount > 0);

      if (
        stepOne?.customer?.id &&
        stepOne?.recipient?.id &&
        stepOne?.sendCountry?.id &&
        stepOne?.receiveCountry?.id &&
        sendCurrency?.code &&
        receiveCurrency?.code &&
        hasValidAmount
      ) {
        const payload: TransactionPreviewPayload = {
          customer_id: stepOne.customer.id,
          recipient_id: stepOne.recipient.id,
          remittance_method_id: stepOne.remittanceMethod?.id || null,
          send_country_id: stepOne.sendCountry.id,
          receive_country_id: stepOne.receiveCountry.id,
          payout_agent_id: stepOne.payoutAgent?.id || null,
          remittance_purpose_id: null,
          source_income_id: null,
          send_currency: sendCurrency.code,
          receive_currency: receiveCurrency.code,
          extra_fees_applied_percent: extraFeesPercent,
          is_all_included_in_send_amount: isAllFeesIncludedInSendAmount,
          do_calculate_from_receive_amount: isCalculateFromReceiveAmount,
          // Only send the relevant amount based on calculation mode
          ...(isCalculateFromReceiveAmount
            ? { receive_amount: receiveAmount }
            : { sent_amount: sendAmount }),
        };

        setPreviewPayload(payload);
      } else {
        setPreviewPayload(undefined);
      }
    }
  }, [
    isEditMode,
    transactionRef,
    stepOne,
    sendCurrency,
    receiveCurrency,
    sendAmount,
    receiveAmount,
    extraFeesPercent,
    isAllFeesIncludedInSendAmount,
    isCalculateFromReceiveAmount,
  ]);

  // Fetch preview data from API - conditionally based on mode
  const {
    data: previewData,
    isLoading: previewLoading,
    error: previewError,
  } = useTransactionPreview(isEditMode ? undefined : previewPayload);

  const {
    data: previewByRefData,
    isLoading: previewByRefLoading,
    error: previewByRefError,
  } = useTransactionPreviewByRef(
    isEditMode ? transactionRef || undefined : undefined,
    previewByRefPayload
  );

  // Select the appropriate preview data based on mode
  const activePreviewLoading = isEditMode
    ? previewByRefLoading
    : previewLoading;
  const activePreviewError = isEditMode ? previewByRefError : previewError;

  // Prepare conversion info for display
  const conversionInfo = useMemo(() => {
    const activeData = isEditMode ? previewByRefData : previewData;
    if (!activeData?.data) return null;
    console.log('previewData = ', activeData.data);

    const {
      send_amount,
      receive_amount,
      platform_exchange_rate,
      total_commission,
      send_agent_commission,
      extra_fees,
      recipient_net_amount,
    } = activeData.data;

    // Set exchange details with the new structure
    setExchangeDetails(activeData.data as SendRemittanceExchangeDetails);

    // Update amounts based on calculation mode
    if (isCalculateFromReceiveAmount) {
      // When calculating from receive amount, update the send amount from preview
      setSendAmount(Number(send_amount) || 0);
    } else {
      // Normal mode: update receive amount
      setReceiveAmount(Number(receive_amount) || 0);
    }

    return {
      rate: Number(platform_exchange_rate) || 0,
      convertedAmount: Number(receive_amount) || 0,
      charges: Number(total_commission) || 0,
      agentCommission: Number(send_agent_commission) || 0,
      extraFees: Number(extra_fees) || 0,
      recipientNetAmount: Number(recipient_net_amount) || 0,
    };
  }, [
    isEditMode,
    previewData,
    previewByRefData,
    isCalculateFromReceiveAmount,
    setExchangeDetails,
    setSendAmount,
    setReceiveAmount,
  ]);

  // Get computed summary data from centralized hook
  const summaryData = useSummaryData();

  // Calculate fees and total payable amount using real exchange data
  // const feesAndCharges = conversionInfo ? conversionInfo.charges + 1 : 10; // margin fee + $1 fixed fee
  // const totalPayableAmount = fromAmount + feesAndCharges;

  const availableBalance = useMemo(() => {
    if (!sendCurrency) return undefined;
    if (!walletCurrencies?.length) return parseFloat('0');
    const currency = walletCurrencies?.find((c) => {
      return c.currency_id === sendCurrency?.id;
    });
    if (!currency) return parseFloat('0');
    return parseFloat(currency?.amount);
  }, [walletCurrencies, sendCurrency]);

  // Get max allowed extra fees percentage
  const maxExtraFeesPercent = useMemo(() => {
    return extraFeesData?.data?.extra_fees_percentage || 0;
  }, [extraFeesData]);

  // Calculate extra fees amount based on send amount
  const extraFeesAmount = useMemo(() => {
    if (!sendAmount || !extraFeesPercent) return 0;
    return (sendAmount * extraFeesPercent) / 100;
  }, [sendAmount, extraFeesPercent]);

  const currentStep = useSendRemittanceStore((state) => state.currentStep);
  const isStepValid = useSendRemittanceStore((state) => state.isStepValid);

  return (
    <div className='p-6 space-y-6'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Currency Selection Section */}
        <div className='lg:col-span-2 space-y-6'>
          <div className='border-[#E7EFEF] border-b-1 pb-5'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {/* From Currency Section - Wallet Currencies */}
              <div className='space-y-4'>
                <div className='flex items-center space-x-2'>
                  <Label>Select the currency and sending amount</Label>
                  <Info className='w-4 h-4 text-gray-400' />
                </div>

                <CurrencyInput
                  placeholder='Select from wallet'
                  amountPlaceholder='Enter amount'
                  currencyOptions={sendingCurrencies?.map(
                    (item: CountryCurrency) => {
                      return {
                        id: item?.currency?.id,
                        code: item?.currency?.code,
                        name: item?.currency?.name,
                      };
                    }
                  )}
                  selectedCurrencyId={sendCurrency?.id || undefined}
                  amount={sendAmount}
                  onCurrencyChange={(currencyId) => {
                    const currency = sendingCurrencies?.find(
                      (item: CountryCurrency) =>
                        item.currency?.id === currencyId
                    )?.currency;
                    setSendCurrency({
                      id: currencyId,
                      name: currency?.name,
                      code: currency?.code,
                    });
                  }}
                  onAmountChange={(amount) => setSendAmount(amount)}
                  showBalance
                  availableBalance={availableBalance}
                  readOnly={isCalculateFromReceiveAmount}
                />
              </div>

              {/* To Currency Section - All Currencies */}
              <div className='space-y-4'>
                <div className='flex items-center space-x-2'>
                  <Label>Receiver get</Label>
                  <Info className='w-4 h-4 text-gray-400' />
                </div>

                <CurrencyInput
                  placeholder='Select target currency'
                  amountPlaceholder='Amount to receive'
                  currencyOptions={receivingCurrencies?.map(
                    (item: CountryCurrency) => {
                      return {
                        id: item?.currency?.id,
                        code: item?.currency?.code,
                        name: item?.currency?.name,
                      };
                    }
                  )}
                  selectedCurrencyId={receiveCurrency?.id || undefined}
                  amount={receiveAmount}
                  onCurrencyChange={(currencyId) => {
                    const currency = receivingCurrencies?.find(
                      (item: CountryCurrency) =>
                        item.currency?.id === currencyId
                    )?.currency;
                    setReceiveCurrency({
                      id: currencyId,
                      name: currency?.name,
                      code: currency?.code,
                    });
                  }}
                  onAmountChange={(amount) => setReceiveAmount(amount)}
                  readOnly={!isCalculateFromReceiveAmount}
                />
              </div>
            </div>

            {/* Fee Calculation Options */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='allFeesIncluded'
                  checked={isAllFeesIncludedInSendAmount}
                  onCheckedChange={(checked) => {
                    setIsAllFeesIncludedInSendAmount(checked === true);
                    // If this is checked, uncheck the other option
                    if (checked) {
                      setIsCalculateFromReceiveAmount(false);
                    }
                  }}
                />
                <label htmlFor='allFeesIncluded' className='text-sm text-gray-700 cursor-pointer'>
                  All fees and commissions included in send amount
                </label>
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='calculateFromReceive'
                  checked={isCalculateFromReceiveAmount}
                  onCheckedChange={(checked) => {
                    const isChecked = checked === true;
                    setIsCalculateFromReceiveAmount(isChecked);
                    // If this is checked, uncheck the other option and clear both amounts
                    if (isChecked) {
                      setIsAllFeesIncludedInSendAmount(false);
                      setSendAmount(0);
                      setReceiveAmount(0);
                    } else {
                      // If unchecked, clear receive amount
                      setReceiveAmount(0);
                    }
                  }}
                />
                <label htmlFor='calculateFromReceive' className='text-sm text-gray-700 cursor-pointer'>
                  Enter final receive amount
                </label>
              </div>
            </div>

            {isCalculateFromReceiveAmount && (
              <div className='mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md'>
                <p className='text-sm text-blue-800'>
                  Enter the receive amount above. The send amount will be calculated automatically based on the exchange rate.
                </p>
              </div>
            )}

            {/* Loading and Error States */}
            {activePreviewLoading && (sendAmount > 0 || receiveAmount > 0) && (
              <div className='bg-blue-50 rounded-lg p-4'>
                <div className='flex items-center justify-center'>
                  <Loader size={16} />
                  <span className='ml-2 text-sm text-blue-600'>
                    {isCalculateFromReceiveAmount
                      ? 'Calculating send amount...'
                      : 'Calculating exchange rate...'}
                  </span>
                </div>
              </div>
            )}

            {activePreviewError && (sendAmount > 0 || receiveAmount > 0) && (
              <div className='bg-red-50 rounded-lg p-4'>
                <div className='text-sm text-red-600'>
                  Unable to calculate exchange rate. Please try again.
                </div>
              </div>
            )}
          </div>
          <div className='border-[#E7EFEF] border-b-1 pb-5'>
            <span>Your commission: </span>
            <span className='font-semibold'>
              {conversionInfo?.agentCommission
                ? `${conversionInfo.agentCommission.toFixed(2)} ${
                    sendCurrency?.code || ''
                  }`
                : '0.00'}
            </span>
          </div>
          <div className='pb-5'>
            <div className='flex items-center gap-2 mb-2'>
              <Label>
                Add your extra fees percentage (Max {maxExtraFeesPercent}%)
              </Label>
              <Info className='w-4 h-4 text-gray-400' />
            </div>
            <div className='flex items-center gap-4'>
              <Input
                type='number'
                min='0'
                max={maxExtraFeesPercent}
                step='0.1'
                value={extraFeesPercent}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value >= 0 && value <= maxExtraFeesPercent) {
                    setExtraFeesPercent(value);
                  } else if (value > maxExtraFeesPercent) {
                    setExtraFeesPercent(maxExtraFeesPercent);
                  }
                }}
                placeholder='0'
                className='w-32'
              />
              <span className='text-sm text-gray-600'>%</span>
              {extraFeesAmount > 0 && sendCurrency && (
                <span className='text-sm font-medium text-green-600'>
                  = {extraFeesAmount.toFixed(2)} {sendCurrency.code}
                </span>
              )}
            </div>
            {extraFeesPercent > 0 && (
              <div className='mt-2 p-3 bg-green-50 border border-green-200 text-sm text-green-800 rounded-md'>
                Extra fees of {extraFeesPercent}% will be added (
                {extraFeesAmount.toFixed(2)} {sendCurrency?.code})
              </div>
            )}
          </div>
        </div>

        {/* Summary Card - Right Side */}
        <div className='lg:col-span-1'>
          <SummaryCard data={summaryData} />
        </div>
      </div>
      {/* Step Validation Info */}
      {isStepValid(currentStep) && (
        <div className='mt-4 p-3 bg-green-50 border border-green-200 text-sm text-green-800 font-medium flex items-center gap-1 rounded-md'>
          <CheckedIcon />{' '}
          <span> Step completed! You can now proceed to the next step.</span>
        </div>
      )}
    </div>
  );
};

export default CurrenciesAmountStep;
