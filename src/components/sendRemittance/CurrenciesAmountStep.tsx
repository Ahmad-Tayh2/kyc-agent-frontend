import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import CurrencyInput from '@/components/CurrencyInput';
import { useWallet } from '@/hooks/data/useWallet';
import {
  useCurrencies,
  useExchangeMoneyPreview,
} from '@/hooks/data/useCurrency';
import type { ExchangePreviewPayload } from '@/types/currency';
import type { WalletCurrency } from '@/types/wallet';
import Loader from '@/components/shared/Loader';
import { Label } from '@/components/ui/label';
import SummaryCard from './SummaryCard';

const CurrenciesAmountStep: React.FC = () => {
  // For now, we'll use a placeholder agent ID. In a real app, this would come from auth context
  const agentId = 2; // This should come from your auth context/state

  // Form state
  const [fromCurrencyId, setFromCurrencyId] = useState<number>(0);
  const [toCurrencyId, setToCurrencyId] = useState<number>(0);
  const [fromAmount, setFromAmount] = useState<number>(0);

  // Data hooks
  const { data: wallet } = useWallet(agentId);
  const { data: allCurrencies = [] } = useCurrencies();

  // Get wallet currencies
  const walletCurrencies = wallet?.wallet_currencies || [];

  // Set default currencies when data is loaded
  useEffect(() => {
    // Set default fromCurrency (first wallet currency)
    if (walletCurrencies.length > 0 && fromCurrencyId === 0) {
      setFromCurrencyId(walletCurrencies[0].id);
    }

    // Set default toCurrency (EUR or first available currency)
    if (allCurrencies.length > 0 && toCurrencyId === 0) {
      const eurCurrency = allCurrencies.find((c) => c.code === 'EUR');
      const defaultToCurrency = eurCurrency || allCurrencies[0];

      // Make sure it's not the same as the fromCurrency
      const fromWalletCurrency = walletCurrencies.find(
        (wc: WalletCurrency) => wc.id === fromCurrencyId
      );

      if (
        fromWalletCurrency &&
        defaultToCurrency.id !== fromWalletCurrency.currency.id
      ) {
        setToCurrencyId(defaultToCurrency.id);
      } else {
        // If EUR is the same as fromCurrency, pick the next available one
        const alternativeCurrency = allCurrencies.find(
          (c) => fromWalletCurrency && c.id !== fromWalletCurrency.currency.id
        );
        if (alternativeCurrency) {
          setToCurrencyId(alternativeCurrency.id);
        }
      }
    }
  }, [walletCurrencies, allCurrencies, fromCurrencyId, toCurrencyId]);

  // Get the selected currencies for display
  const selectedFromCurrency = walletCurrencies.find(
    (wc: WalletCurrency) => wc.id === fromCurrencyId
  );
  const selectedToCurrency = allCurrencies.find((c) => c.id === toCurrencyId);

  // Set up the preview payload when the form values change
  const [previewPayload, setPreviewPayload] = useState<
    ExchangePreviewPayload | undefined
  >();

  useEffect(() => {
    if (fromCurrencyId && toCurrencyId && fromAmount && fromAmount > 0) {
      setPreviewPayload({
        from_wallet_currency_id: fromCurrencyId,
        to_currency_id: toCurrencyId,
        from_amount: fromAmount,
      });
    } else {
      setPreviewPayload(undefined);
    }
  }, [fromCurrencyId, toCurrencyId, fromAmount]);

  // Fetch preview data from API
  const {
    data: previewData,
    isLoading: previewLoading,
    error: previewError,
  } = useExchangeMoneyPreview(previewPayload);

  // Prepare conversion info for display
  const conversionInfo = previewData?.exchange_details
    ? {
        rate: previewData.exchange_details.applied_exchange_rate,
        convertedAmount: previewData.exchange_details.to_amount,
        charges: previewData.exchange_details.margin_amount,
        total:
          previewData.exchange_details.to_amount -
          previewData.exchange_details.margin_amount,
      }
    : null;

  // TODO: Get real data from previous step context/state
  // For now using mock data, but this should come from CustomerRecipientStep selections
  const summaryData = {
    sendingCustomer: 'John Doe',
    sendingCountryIso: 'USA',
    recipient: 'Jane Smith',
    recipientCountryIso: 'RUS',
    remittanceMethod: 'Cash Pickup',
    sendingCountry: 'USA',
    receivingCountry: selectedToCurrency ? 'Europe' : 'Europe', // This should come from previous step
  };

  // Calculate fees and total payable amount using real exchange data
  const feesAndCharges = conversionInfo ? conversionInfo.charges + 1 : 10; // margin fee + $1 fixed fee
  const totalPayableAmount = fromAmount + feesAndCharges;

  return (
    <div className='p-6 space-y-6'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Currency Selection Section */}
        <div className='lg:col-span-2 space-y-6'>
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
                currencyOptions={walletCurrencies.map((wc: WalletCurrency) => ({
                  id: wc.id,
                  code: wc.currency.code,
                  name: wc.currency.name,
                }))}
                selectedCurrencyId={fromCurrencyId || undefined}
                amount={fromAmount}
                onCurrencyChange={(currencyId) => setFromCurrencyId(currencyId)}
                onAmountChange={(amount) => setFromAmount(amount)}
                showBalance={true}
                availableBalance={
                  selectedFromCurrency
                    ? parseFloat(selectedFromCurrency.amount)
                    : undefined
                }
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
                currencyOptions={allCurrencies
                  .filter((currency) => {
                    // Find the selected wallet currency
                    const fromWalletCurrency = walletCurrencies.find(
                      (wc: WalletCurrency) => wc.id === fromCurrencyId
                    );
                    // Filter out the currency that's already selected in the "from" dropdown
                    return fromWalletCurrency
                      ? currency.id !== fromWalletCurrency.currency.id
                      : true;
                  })
                  .map((currency) => ({
                    id: currency.id,
                    code: currency.code,
                    name: currency.name,
                  }))}
                selectedCurrencyId={toCurrencyId || undefined}
                amount={conversionInfo ? conversionInfo.total : 0}
                onCurrencyChange={(currencyId) => setToCurrencyId(currencyId)}
                onAmountChange={() => {}} // Read-only for "to" currency
                readOnly={true}
              />

              {selectedToCurrency && fromAmount > 0 && (
                <p className='text-sm text-gray-600'>
                  Charges: ${conversionInfo?.charges.toFixed(2) || '5'} + 1
                </p>
              )}
            </div>
          </div>

          {/* Loading and Error States */}
          {previewLoading && fromAmount > 0 && (
            <div className='bg-blue-50 rounded-lg p-4'>
              <div className='flex items-center justify-center'>
                <Loader size={16} />
                <span className='ml-2 text-sm text-blue-600'>
                  Calculating exchange rate...
                </span>
              </div>
            </div>
          )}

          {previewError && fromAmount > 0 && (
            <div className='bg-red-50 rounded-lg p-4'>
              <div className='text-sm text-red-600'>
                Unable to calculate exchange rate. Please try again.
              </div>
            </div>
          )}
        </div>

        {/* Summary Card */}
        <div className='lg:col-span-1'>
          <div className='bg-[#E4F2F2] rounded-lg border p-6 space-y-4 sticky top-6'>
            <h3 className='text-lg font-semibold text-gray-900'>Summary</h3>
            <hr />

            <div className='space-y-3 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Sending Customer</span>
                <span className='font-medium'>
                  {summaryData.sendingCustomer} ({summaryData.sendingCountryIso}
                  )
                </span>
              </div>

              <hr className='my-3' />

              <div className='flex justify-between'>
                <span className='text-gray-600'>Recipient</span>
                <span className='font-medium'>
                  {summaryData.recipient} ({summaryData.recipientCountryIso})
                </span>
              </div>

              <hr className='my-3' />

              <div className='flex justify-between'>
                <span className='text-gray-600'>Remittance Method</span>
                <span className='font-medium flex items-center'>
                  {summaryData.remittanceMethod}
                  <Info className='w-3 h-3 ml-1 text-gray-400' />
                </span>
              </div>

              <hr className='my-3' />

              <div className='flex justify-between'>
                <span className='text-gray-600'>Sending Country</span>
                <span className='font-medium'>
                  {summaryData.sendingCountry}
                </span>
              </div>

              <hr className='my-3' />

              <div className='flex justify-between'>
                <span className='text-gray-600'>Receiver Country</span>
                <span className='font-medium'>
                  {summaryData.receivingCountry}
                </span>
              </div>

              <hr className='my-3' />

              <div className='flex justify-between'>
                <span className='text-gray-600'>Sending Amount</span>
                <span className='font-medium'>
                  {fromAmount > 0
                    ? `${fromAmount.toFixed(2)} ${
                        selectedFromCurrency?.currency.code || 'USD'
                      }`
                    : '0.00 USD'}
                </span>
              </div>

              <hr className='my-3' />

              <div className='flex justify-between'>
                <span className='text-gray-600'>Exchange Rate</span>
                <span className='font-medium'>
                  {conversionInfo && selectedFromCurrency && selectedToCurrency
                    ? `1 ${
                        selectedFromCurrency.currency.code
                      } = ${conversionInfo.rate.toFixed(2)} ${
                        selectedToCurrency.code
                      }`
                    : '1 USD = 0.95 EUR'}
                </span>
              </div>

              <hr className='my-3' />

              <div className='flex justify-between'>
                <span className='text-gray-600'>Fees and Charges</span>
                <span className='font-medium'>
                  {fromAmount > 0 && conversionInfo && selectedFromCurrency
                    ? `${feesAndCharges.toFixed(2)} ${
                        selectedFromCurrency.currency.code
                      }`
                    : '10.00 USD'}
                </span>
              </div>

              <hr className='my-3' />

              <div className='flex justify-between'>
                <span className='text-gray-600'>Recipient Gets</span>
                <span className='font-medium'>
                  {conversionInfo && selectedToCurrency
                    ? `${conversionInfo.total.toFixed(2)} ${
                        selectedToCurrency.code
                      }`
                    : '476.00 EUR'}
                </span>
              </div>

              <hr className='my-3' />

              <div className='flex justify-between text-base font-semibold text-teal-600'>
                <span>Total Payable Amount</span>
                <span>
                  {fromAmount > 0 && selectedFromCurrency
                    ? `${totalPayableAmount.toFixed(2)} ${
                        selectedFromCurrency.currency.code
                      }`
                    : '511.00 USD'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrenciesAmountStep;
