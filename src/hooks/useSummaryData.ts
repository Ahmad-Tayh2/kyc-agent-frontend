import type { SummaryData } from '@/components/sendRemittance/SummaryCard';
import { useSendRemittanceStore } from '@/store/sendRemittanceStore';
import { useMemo } from 'react';

/**
 * Custom hook to compute summary data from send remittance store
 * This ensures consistent summary data across all steps
 */
export const useSummaryData = (): SummaryData => {
  const stepOne = useSendRemittanceStore((state) => state.data.stepOne);
  const stepTwo = useSendRemittanceStore((state) => state.data.stepTwo);

  return useMemo(() => {
    const exchangeDetails = stepTwo.exchangeDetails;

    // Use new transaction preview fields if available, fallback to legacy
    const totalCommission = Number(exchangeDetails?.total_commission) || 0;
    const extraFeesFromResponse = Number(exchangeDetails?.extra_fees) || 0;
    const platformExchangeRate =
      Number(
        exchangeDetails?.platform_exchange_rate ||
          exchangeDetails?.applied_exchange_rate
      ) || 0;
    const totalPaypalAmount = Number(exchangeDetails?.total_paypal_amount) || 0;

    // Get send amount
    const sendAmount = Number(stepTwo.sendAmount) || 0;

    // Total payable amount - use total_paypal_amount from response if available
    const totalPayableAmount =
      totalPaypalAmount || sendAmount + totalCommission + extraFeesFromResponse;

    // Format exchange rate display - 2 decimal places
    const exchangeRateDisplay = platformExchangeRate
      ? `1 ${stepTwo.sendCurrency?.code || ''} = ${platformExchangeRate.toFixed(
          2
        )} ${stepTwo.receiveCurrency?.code || ''}`
      : undefined;

    // Format recipient gets display - show even if amount is 0
    const recipientGetsDisplay = stepTwo.receiveCurrency?.code
      ? `${Number(stepTwo.receiveAmount || 0).toFixed(2)} ${
          stepTwo.receiveCurrency.code
        }`
      : undefined;

    // Format fees and charges display: total_commission + extra_fees = value (send currency)
    const sendCurrencyCode = stepTwo.sendCurrency?.code || '';
    const feesAndCommissionTotal = totalCommission + extraFeesFromResponse;
    const feesAndChargesDisplay =
      feesAndCommissionTotal > 0
        ? `${totalCommission.toFixed(2)} + ${extraFeesFromResponse.toFixed(
            2
          )} = ${feesAndCommissionTotal.toFixed(2)} ${sendCurrencyCode}`
        : undefined;

    // Format extra fees display - just the extra fees value
    const extraFeesDisplay =
      stepTwo.sendCurrency?.code && extraFeesFromResponse > 0
        ? `${extraFeesFromResponse.toFixed(2)} ${stepTwo.sendCurrency.code}`
        : extraFeesFromResponse > 0
        ? extraFeesFromResponse.toFixed(2)
        : undefined;

    return {
      // Step 1 data
      sendingCustomer: stepOne.customer?.fullName,
      sendingCountryIso: stepOne.sendCountry?.iso3,
      recipient: stepOne.recipient?.fullName,
      recipientCountryIso: stepOne.receiveCountry?.iso3,
      remittanceMethod:
        stepOne.remittanceMethod?.name || stepOne.payoutAgent?.business_name,
      sendingCountry: stepOne.sendCountry?.name,
      receivingCountry: stepOne.receiveCountry?.name,

      // Step 2 data - use values from transaction preview
      sendingAmount: sendAmount,
      exchangeRate: exchangeRateDisplay,
      feesAndCharges: feesAndChargesDisplay, // Shows: total_commission + extra_fees = value (currency)
      commission: totalCommission, // Just total_commission
      extraFees: extraFeesDisplay, // Just extra fees
      recipientGets: recipientGetsDisplay,
      totalPayableAmount,
    };
  }, [stepOne, stepTwo]);
};
