import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCurrencies, useExchangeMoney } from '@/hooks/useCurrency';
import type { WalletCurrency } from '@/types/wallet';
import { Info } from 'lucide-react';
import CurrencyInput from '@/components/CurrencyInput';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';

// Form validation schema
const exchangeSchema = z.object({
  fromCurrencyId: z
    .number()
    .min(1, 'Please select a currency to exchange from'),
  toCurrencyId: z.number().min(1, 'Please select a currency to exchange to'),
  fromAmount: z.number().min(0.01, 'Amount must be greater than 0'),
  toAmount: z.number().min(0, 'Invalid amount'),
});

type ExchangeFormData = z.infer<typeof exchangeSchema>;

interface ExchangeCurrenciesDialogProps {
  trigger?: React.ReactNode;
  walletCurrencies: WalletCurrency[];
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ExchangeCurrenciesDialog: React.FC<ExchangeCurrenciesDialogProps> = ({
  trigger,
  walletCurrencies,
  isOpen,
  onOpenChange,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Fetch all available currencies
  const { data: allCurrencies = [], isLoading: currenciesLoading } =
    useCurrencies();
  const exchangeMutation = useExchangeMoney();

  const form = useForm<ExchangeFormData>({
    resolver: zodResolver(exchangeSchema),
    defaultValues: {
      fromCurrencyId: 0,
      toCurrencyId: 0,
      fromAmount: 0,
      toAmount: 0,
    },
  });

  // Set default currencies when data is loaded
  useEffect(() => {
    // Set default fromCurrency (first wallet currency)
    if (walletCurrencies.length > 0 && form.getValues('fromCurrencyId') === 0) {
      form.setValue('fromCurrencyId', walletCurrencies[0].currency.id);
    }

    // Set default toCurrency (USD or first available currency)
    if (allCurrencies.length > 0 && form.getValues('toCurrencyId') === 0) {
      const usdCurrency = allCurrencies.find((c) => c.code === 'USD');
      const defaultToCurrency = usdCurrency || allCurrencies[0];

      // Make sure it's not the same as the fromCurrency
      const fromCurrencyId = form.getValues('fromCurrencyId');
      if (defaultToCurrency.id !== fromCurrencyId) {
        form.setValue('toCurrencyId', defaultToCurrency.id);
      } else {
        // If USD is the same as fromCurrency, pick the next available one
        const alternativeCurrency = allCurrencies.find(
          (c) => c.id !== fromCurrencyId
        );
        if (alternativeCurrency) {
          form.setValue('toCurrencyId', alternativeCurrency.id);
        }
      }
    }
  }, [walletCurrencies, allCurrencies, form]);

  // Reset form to defaults when dialog opens
  useEffect(() => {
    if (isOpen && walletCurrencies.length > 0 && allCurrencies.length > 0) {
      const defaultFromCurrency = walletCurrencies[0].currency.id;
      const usdCurrency = allCurrencies.find((c) => c.code === 'USD');
      const defaultToCurrency =
        usdCurrency?.id !== defaultFromCurrency
          ? usdCurrency?.id || allCurrencies[0].id
          : allCurrencies.find((c) => c.id !== defaultFromCurrency)?.id ||
            allCurrencies[0].id;

      form.reset({
        fromCurrencyId: defaultFromCurrency,
        toCurrencyId: defaultToCurrency,
        fromAmount: 0,
        toAmount: 0,
      });
    }
  }, [isOpen, walletCurrencies, allCurrencies, form]);

  const watchedFromCurrency = form.watch('fromCurrencyId');
  const watchedToCurrency = form.watch('toCurrencyId');
  const watchedFromAmount = form.watch('fromAmount');

  // Get the selected currencies for display
  const selectedFromCurrency = walletCurrencies.find(
    (wc) => wc.currency.id === watchedFromCurrency
  );
  const selectedToCurrency = allCurrencies.find(
    (c) => c.id === watchedToCurrency
  );

  // Calculate the conversion (fake calculation for now)
  const getConversionInfo = () => {
    if (
      !selectedFromCurrency ||
      !selectedToCurrency ||
      !watchedFromAmount ||
      watchedFromAmount <= 0
    ) {
      return null;
    }

    // Fake conversion rate (in real app, this would come from an API)
    const rate = 1.2; // EUR to USD example
    const convertedAmount = watchedFromAmount * rate;
    const charges = watchedFromAmount * 0.02; // 2% fee

    return {
      rate,
      convertedAmount,
      charges,
      total: convertedAmount - charges,
    };
  };

  const conversionInfo = getConversionInfo();

  const handleSubmit = async (data: ExchangeFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await exchangeMutation.mutateAsync({
        from_wallet_currency_id: data.fromCurrencyId,
        to_wallet_currency_id: data.toCurrencyId,
        from_amount: data.fromAmount,
      });

      setSuccessMessage('Currency exchange completed successfully!');

      // Reset form with default currencies
      const defaultFromCurrency =
        walletCurrencies.length > 0 ? walletCurrencies[0].currency.id : 0;
      const usdCurrency = allCurrencies.find((c) => c.code === 'USD');
      const defaultToCurrency =
        usdCurrency?.id !== defaultFromCurrency
          ? usdCurrency?.id ||
            (allCurrencies.length > 0 ? allCurrencies[0].id : 0)
          : allCurrencies.find((c) => c.id !== defaultFromCurrency)?.id || 0;

      form.reset({
        fromCurrencyId: defaultFromCurrency,
        toCurrencyId: defaultToCurrency,
        fromAmount: 0,
        toAmount: 0,
      });

      // Close dialog after a short delay
      setTimeout(() => {
        onOpenChange?.(false);
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(
          error.message || 'An error occurred during currency exchange'
        );
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const dialogContent = (
    <DialogContent className='sm:max-w-3xl max-h-[90vh] overflow-y-auto'>
      <DialogHeader>
        <DialogTitle className='text-xl font-semibold'>
          Exchange Currencies
        </DialogTitle>
      </DialogHeader>

      {/* Info Message */}
      <div className='bg-gray-100 rounded-lg p-4 flex items-start space-x-3'>
        <Info className='w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0' />
        <p className='text-sm text-gray-700'>
          If you opt to convert money to a currency that is not yet in your
          wallet, then the new currency will be added to your wallet after a
          successful exchange process
        </p>
      </div>

      {currenciesLoading ? (
        <div className='flex justify-center py-8'>
          <Loader />
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {/* From Currency Section - Existing Currencies */}
              <div className='space-y-4'>
                <div className='flex items-center space-x-2'>
                  <h3 className='text-lg font-medium text-gray-900'>
                    Existing Currencies
                  </h3>
                  <Info className='w-4 h-4 text-gray-400' />
                </div>

                <div className='space-y-3'>
                  <FormField
                    control={form.control}
                    name='fromCurrencyId'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CurrencyInput
                            placeholder='Select currency from your wallet'
                            amountPlaceholder='Enter amount to exchange'
                            currencyOptions={walletCurrencies.map((wc) => ({
                              id: wc.currency.id,
                              code: wc.currency.code,
                              name: wc.currency.name,
                            }))}
                            selectedCurrencyId={field.value || undefined}
                            amount={watchedFromAmount}
                            onCurrencyChange={(currencyId) =>
                              field.onChange(currencyId)
                            }
                            onAmountChange={(amount) => {
                              form.setValue('fromAmount', amount);
                              // Auto-calculate the to amount when from amount changes
                              if (conversionInfo) {
                                form.setValue('toAmount', conversionInfo.total);
                              }
                            }}
                            showBalance={true}
                            availableBalance={
                              selectedFromCurrency
                                ? parseFloat(selectedFromCurrency.amount)
                                : undefined
                            }
                            error={
                              form.formState.errors.fromCurrencyId?.message ||
                              form.formState.errors.fromAmount?.message
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {conversionInfo && selectedToCurrency && (
                    <div className='bg-teal-50 rounded-lg p-4 space-y-2'>
                      <div className='text-sm text-gray-600'>
                        <div className='flex justify-between'>
                          <span>Exchange Rate:</span>
                          <span>
                            1 {selectedFromCurrency?.currency.code} ={' '}
                            {conversionInfo.rate} {selectedToCurrency.code}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span>Converted Amount:</span>
                          <span>
                            {conversionInfo.convertedAmount.toFixed(2)}{' '}
                            {selectedToCurrency.code}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span>Charges (2%):</span>
                          <span>
                            -{conversionInfo.charges.toFixed(2)}{' '}
                            {selectedToCurrency.code}
                          </span>
                        </div>
                        <hr className='my-2' />
                        <div className='flex justify-between font-semibold text-teal-600'>
                          <span>You will receive:</span>
                          <span>
                            {conversionInfo.total.toFixed(2)}{' '}
                            {selectedToCurrency.code}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* To Currency Section - All Currencies */}
              <div className='space-y-4'>
                <div className='flex items-center space-x-2'>
                  <h3 className='text-lg font-medium text-gray-900'>
                    All Currencies
                  </h3>
                  <Info className='w-4 h-4 text-gray-400' />
                </div>

                <div className='space-y-3'>
                  <FormField
                    control={form.control}
                    name='toCurrencyId'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CurrencyInput
                            placeholder='Select target currency'
                            amountPlaceholder='Amount you will receive'
                            currencyOptions={allCurrencies
                              .filter(
                                (currency) =>
                                  currency.id !== watchedFromCurrency
                              )
                              .map((currency) => ({
                                id: currency.id,
                                code: currency.code,
                                name: currency.name,
                              }))}
                            selectedCurrencyId={field.value || undefined}
                            amount={conversionInfo ? conversionInfo.total : 0}
                            onCurrencyChange={(currencyId) =>
                              field.onChange(currencyId)
                            }
                            onAmountChange={() => {}} // Read-only for "to" currency
                            readOnly={true}
                            error={form.formState.errors.toCurrencyId?.message}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Error and Success Messages */}
            {errorMessage && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-4 text-red-700'>
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className='bg-green-50 border border-green-200 rounded-lg p-4 text-green-700'>
                {successMessage}
              </div>
            )}

            <div className='flex justify-center space-x-4'>
              <Button
                type='submit'
                disabled={isSubmitting || !conversionInfo}
                className='bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg font-medium'
              >
                {isSubmitting ? 'Processing...' : 'CONFIRM'}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange?.(false)}
                disabled={isSubmitting}
                className='border-2 border-teal-500 text-teal-500 px-8 py-3 rounded-lg font-medium hover:bg-teal-50'
              >
                CANCEL
              </Button>
            </div>
          </form>
        </Form>
      )}
    </DialogContent>
  );

  if (trigger) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {dialogContent}
    </Dialog>
  );
};

export default ExchangeCurrenciesDialog;
