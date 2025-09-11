import React, { useState, useEffect, useMemo } from "react";
import { Info } from "lucide-react";
import CheckedIcon from "@/assets/icons/checked-icon.svg?react";
import CurrencyInput from "@/components/CurrencyInput";
import { useWallet } from "@/hooks/data/useWallet";
import {
  useCurrencies,
  useExchangeMoneyPreview,
} from "@/hooks/data/useCurrency";
import type { ExchangePreviewPayload } from "@/types/currency";
// import type { WalletCurrency } from "@/types/wallet";
import Loader from "@/components/shared/Loader";
import { Label } from "@/components/ui/label";
// import SummaryCard from "./SummaryCard";
import { useSendRemittanceStore } from "@/store/sendRemittanceStore";
import {
  useGetCountrySendingCurrencies,
  useGetCountryReceivingCurrencies,
} from "@/hooks/data/useCountryAllowedCurrency";
import SummaryCard, { type SummaryData } from "./SummaryCard";
import type { SendRemittanceExchangeDetails } from "@/types/sendRemittance";

const CurrenciesAmountStep: React.FC = () => {
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
  const exchangeDetails = useSendRemittanceStore(
    (state) => state.data.stepTwo?.exchangeDetails
  );
  // Form state
  const [toCurrencyId, setToCurrencyId] = useState<number>(0);
  const [fromAmount /*, setFromAmount*/] = useState<number>(0);

  // Data hooks
  const { data: wallet } = useWallet(agentId);
  const { data: allCurrencies = [] } = useCurrencies();

  const { data: sendingCurrencies } = useGetCountrySendingCurrencies(
    stepOne?.sendCountry?.id ?? ""
  );

  const { data: receivingCurrencies } = useGetCountryReceivingCurrencies(
    stepOne?.receiveCountry?.id ?? ""
  );

  // Get wallet currencies
  const walletCurrencies = wallet?.wallet_currencies || [];

  useEffect(() => {
    if (sendingCurrencies?.length) {
      const defaultCurrency = sendingCurrencies?.[0]?.currency;
      setSendCurrency({
        id: defaultCurrency?.id,
        name: defaultCurrency?.name,
        code: defaultCurrency?.code,
      });
    }
  }, [sendingCurrencies]);
  useEffect(() => {
    if (receivingCurrencies?.length && sendCurrency) {
      let defaultCurrency = null;
      for (let item of receivingCurrencies) {
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
  }, [receivingCurrencies, sendCurrency]);

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

  // Get the selected currencies for display
  const selectedToCurrency = allCurrencies.find((c) => c.id === toCurrencyId);

  // Set up the preview payload when the form values change
  const [previewPayload, setPreviewPayload] = useState<
    ExchangePreviewPayload | undefined
  >();

  useEffect(() => {
    const walletCurrency = walletCurrencies?.find((item) => {
      return item.currency.id === sendCurrency?.id;
    });
    if (
      sendCurrency?.id &&
      receiveCurrency?.id &&
      sendAmount &&
      sendAmount > 0 &&
      walletCurrencies?.length &&
      walletCurrency
    ) {
      setPreviewPayload({
        from_wallet_currency_id: walletCurrency?.id,
        to_currency_id: receiveCurrency?.id,
        from_amount: sendAmount,
      });
    } else {
      setPreviewPayload(undefined);
    }
  }, [sendCurrency, receiveCurrency, sendAmount, walletCurrencies]);

  // Fetch preview data from API
  const {
    data: previewData,
    isLoading: previewLoading,
    error: previewError,
  } = useExchangeMoneyPreview(previewPayload);

  // Prepare conversion info for display
  const conversionInfo = useMemo(() => {
    if (!previewData?.exchange_details) return null;
    console.log(
      " previewData?.exchange_details = ",
      previewData?.exchange_details
    );
    const {
      applied_exchange_rate,
      from_amount,
      to_amount,
      margin_amount,
      margin_percentage,
      market_rate,
    } = previewData?.exchange_details;
    setExchangeDetails(
      previewData?.exchange_details as SendRemittanceExchangeDetails
    );
    // const total =
    //   previewData.exchange_details.to_amount -
    //   previewData.exchange_details.margin_amount;
    setReceiveAmount(to_amount);
    return {
      rate: previewData.exchange_details.applied_exchange_rate,
      convertedAmount: previewData.exchange_details.to_amount,
      charges: previewData.exchange_details.margin_amount,
      // total,
    };
  }, [previewData]);

  // TODO: Get real data from previous step context/state
  // For now using mock data, but this should come from CustomerRecipientStep selections
  const summaryData: SummaryData = {
    sendingCustomer: stepOne?.customer?.fullName,
    sendingCountryIso: stepOne?.sendCountry?.iso3,
    recipient: stepOne?.recipient?.fullName,
    recipientCountryIso: stepOne?.receiveCountry?.iso3,
    remittanceMethod: stepOne?.remittanceMethod?.name,
    sendingCountry: stepOne?.sendCountry?.name,
    receivingCountry: stepOne?.receiveCountry?.name,
    sendingAmount: sendAmount,
    exchangeRate: `1${
      sendCurrency?.code
    } = ${exchangeDetails?.applied_exchange_rate?.toFixed(2)} ${
      receiveCurrency?.code
    }`, //applied_exchange_rate,
    // feesAndCharges: "",
    // commission: "",
    // extraFees: "",
    recipientGets: `${exchangeDetails?.to_amount}${receiveCurrency?.code}`,
    // totalPayableAmount: "",
  };

  // Calculate fees and total payable amount using real exchange data
  // const feesAndCharges = conversionInfo ? conversionInfo.charges + 1 : 10; // margin fee + $1 fixed fee
  // const totalPayableAmount = fromAmount + feesAndCharges;

  const availableBalance = useMemo(() => {
    if (!sendCurrency) return undefined;
    if (!walletCurrencies?.length) return parseFloat("0");
    const currency = walletCurrencies?.find((c) => {
      return c.currency_id === sendCurrency?.id;
    });
    if (!currency) return parseFloat("0");
    return parseFloat(currency?.amount);
  }, [walletCurrencies, sendCurrency]);
  const currentStep = useSendRemittanceStore((state) => state.currentStep);
  const isStepValid = useSendRemittanceStore((state) => state.isStepValid);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Currency Selection Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border-[#E7EFEF] border-b-1 pb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* From Currency Section - Wallet Currencies */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Label>Select the currency and sending amount</Label>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>

                <CurrencyInput
                  placeholder="Select from wallet"
                  amountPlaceholder="Enter amount"
                  currencyOptions={sendingCurrencies?.map((item: any) => {
                    return {
                      id: item?.currency?.id,
                      code: item?.currency?.code,
                      name: item?.currency?.name,
                    };
                  })}
                  selectedCurrencyId={sendCurrency?.id || undefined}
                  amount={sendAmount}
                  onCurrencyChange={(currencyId) => {
                    const currency = sendingCurrencies?.find(
                      (item: any) => item.currency?.id === currencyId
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
                />
              </div>

              {/* To Currency Section - All Currencies */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Label>Receiver get</Label>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>

                <CurrencyInput
                  placeholder="Select target currency"
                  amountPlaceholder="Amount to receive"
                  currencyOptions={receivingCurrencies?.map((item: any) => {
                    return {
                      id: item?.currency?.id,
                      code: item?.currency?.code,
                      name: item?.currency?.name,
                    };
                  })}
                  selectedCurrencyId={receiveCurrency?.id || undefined}
                  amount={receiveAmount}
                  onCurrencyChange={(currencyId) => setToCurrencyId(currencyId)}
                  // onAmountChange={() => {}} // Read-only for "to" currency
                  readOnly
                />

                {selectedToCurrency && fromAmount > 0 && (
                  <p className="text-sm text-gray-600">
                    Charges: ${conversionInfo?.charges.toFixed(2) || "5"} + 1
                  </p>
                )}
              </div>
            </div>

            {/* Loading and Error States */}
            {previewLoading && fromAmount > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-center">
                  <Loader size={16} />
                  <span className="ml-2 text-sm text-blue-600">
                    Calculating exchange rate...
                  </span>
                </div>
              </div>
            )}

            {previewError && fromAmount > 0 && (
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-sm text-red-600">
                  Unable to calculate exchange rate. Please try again.
                </div>
              </div>
            )}
          </div>
          <div className="border-[#E7EFEF] border-b-1 pb-5">
            <span>Your commission: 30% =</span>
            <span className="font-semibold">10 USD</span>
          </div>
          <div className="pb-5">
            <div>Add your extra fees percentage (Max 2.5%)</div>
            <div className="mt-2 p-4 bg-green-50 flex items-center gap-1 rounded-md">
              0%
            </div>
          </div>
        </div>

        {/* Summary Card - Right Side */}
        <div className="lg:col-span-1">
          <SummaryCard data={summaryData} />
        </div>
      </div>
      {/* Step Validation Info */}
      {isStepValid(currentStep) && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 text-sm text-green-800 font-medium flex items-center gap-1 rounded-md">
          <CheckedIcon />{" "}
          <span> Step completed! You can now proceed to the next step.</span>
        </div>
      )}
    </div>
  );
};

export default CurrenciesAmountStep;
