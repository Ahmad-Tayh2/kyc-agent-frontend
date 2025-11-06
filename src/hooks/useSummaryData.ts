import { useMemo } from 'react';
import { useSendRemittanceStore } from '@/store/sendRemittanceStore';
import type { SummaryData } from '@/components/sendRemittance/SummaryCard';

/**
 * Custom hook to compute summary data from send remittance store
 * This ensures consistent summary data across all steps
 */
export const useSummaryData = (): SummaryData => {
  const stepOne = useSendRemittanceStore((state) => state.data.stepOne);
  const stepTwo = useSendRemittanceStore((state) => state.data.stepTwo);

  return useMemo(() => {
    const exchangeDetails = stepTwo.exchangeDetails;

    // Calculate fees and charges - ensure all values are numbers
    const marginFee = Number(exchangeDetails?.margin_amount) || 0;
    const fixedFee = 0; // You can make this configurable
    const feesAndCharges = marginFee + fixedFee;

    // Calculate commission (30% of margin as per CurrenciesAmountStep)
    const commission = marginFee * 0.3;

    // Extra fees (placeholder - should come from step 2 when implemented)
    const extraFees = 0;

    // Total payable amount - ensure sendAmount is a number
    const sendAmount = Number(stepTwo.sendAmount) || 0;
    const totalPayableAmount = sendAmount + feesAndCharges + extraFees;

    // Format exchange rate display
    const exchangeRateDisplay = exchangeDetails?.applied_exchange_rate
      ? `1 ${stepTwo.sendCurrency?.code || ''} = ${Number(exchangeDetails.applied_exchange_rate).toFixed(4)} ${stepTwo.receiveCurrency?.code || ''}`
      : undefined;

    // Format recipient gets display - show even if amount is 0
    const recipientGetsDisplay = stepTwo.receiveCurrency?.code
      ? `${Number(stepTwo.receiveAmount || 0).toFixed(2)} ${stepTwo.receiveCurrency.code}`
      : undefined;

    return {
      // Step 1 data
      sendingCustomer: stepOne.customer?.fullName,
      sendingCountryIso: stepOne.sendCountry?.iso3,
      recipient: stepOne.recipient?.fullName,
      recipientCountryIso: stepOne.receiveCountry?.iso3,
      remittanceMethod:
        stepOne.remittanceMethod?.name ||
        stepOne.payoutAgent?.business_name,
      sendingCountry: stepOne.sendCountry?.name,
      receivingCountry: stepOne.receiveCountry?.name,

      // Step 2 data - use the safely converted sendAmount
      sendingAmount: sendAmount,
      exchangeRate: exchangeRateDisplay,
      feesAndCharges,
      commission,
      extraFees,
      recipientGets: recipientGetsDisplay,
      totalPayableAmount,
    };
  }, [stepOne, stepTwo]);
};
