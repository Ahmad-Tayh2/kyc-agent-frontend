import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useCreatePayment } from '@/hooks/data/usePayment';
import type { PaymentData, PaymentRequest } from '@/types/payment';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { StripeCardElementChangeEvent } from '@stripe/stripe-js';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface StripePaymentFormProps {
  transactionId?: number | string; // Allow string transaction references
  paymentLinkToken?: string;
  walletCurrencyId?: number; // For wallet top-up
  amount?: number;
  currency?: string;
  description?: string;
  onSuccess?: (paymentData: PaymentData) => void;
  onError?: (error: string) => void;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: false,
};

export default function StripePaymentForm({
  transactionId,
  paymentLinkToken,
  walletCurrencyId,
  amount,
  currency,
  description,
  onSuccess,
  onError,
}: StripePaymentFormProps) {
  const { t } = useTranslation('global');
  const stripe = useStripe();
  const elements = useElements();
  const createPaymentMutation = useCreatePayment();

  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string>('');
  const [cardComplete, setCardComplete] = useState(false);

  const handleCardChange = (event: StripeCardElementChangeEvent) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError('');
    }
    setCardComplete(event.complete);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setCardError('');

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setCardError(
        t('modules.pages.paymentPage.providers.stripe.errors.elementNotFound'),
      );
      setIsProcessing(false);
      return;
    }

    try {
      // Create payment method
      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

      if (stripeError) {
        setCardError(
          stripeError.message ||
            t('modules.pages.paymentPage.providers.stripe.errors.cardError'),
        );
        setIsProcessing(false);
        return;
      }

      if (!paymentMethod) {
        setCardError(
          t('modules.pages.paymentPage.providers.stripe.errors.methodFailed'),
        );
        setIsProcessing(false);
        return;
      }

      // Prepare payment request
      const paymentRequest: PaymentRequest = {
        transactionReference: transactionId || null,
        paymentLinkToken: paymentLinkToken || null,
        walletCurrencyId: walletCurrencyId || null,
        amount: walletCurrencyId ? amount : null, // Include amount for wallet top-up
        provider: 'stripe',
        payment_method: paymentMethod.id, // Send the payment method token instead of 'card'
        description: description || `Payment for ${amount} ${currency}`,
        metadata: {
          amount,
          currency,
        },
      };

      // Process payment through backend
      const response = await createPaymentMutation.mutateAsync(paymentRequest);

      if (response.status && response.data) {
        onSuccess?.(response.data);
      } else {
        const errorMsg = response.errors
          ? Object.values(response.errors).flat().join(', ')
          : response.message ||
            t('modules.pages.paymentPage.providers.stripe.errors.failed');
        setCardError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : t('modules.pages.paymentPage.providers.stripe.errors.failed');
      setCardError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {t('modules.pages.paymentPage.providers.stripe.cardInfo')}
          </label>
          <div className='border border-gray-300 rounded-md p-3 bg-white'>
            <CardElement
              options={cardElementOptions}
              onChange={handleCardChange}
            />
          </div>
        </div>

        {/* Card Error Display */}
        {cardError && (
          <Alert className='border-red-200 bg-red-50'>
            <AlertDescription className='text-red-700'>
              {cardError}
            </AlertDescription>
          </Alert>
        )}

        {/* Payment Summary */}
        {amount && currency && (
          <div className='bg-gray-50 p-4 rounded-md'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>
                {t('modules.pages.paymentPage.providers.stripe.amount')}
              </span>
              <span className='font-medium'>
                {amount} {currency.toUpperCase()}
              </span>
            </div>
            {description && (
              <div className='flex justify-between items-center mt-2'>
                <span className='text-sm text-gray-600'>
                  {t('modules.pages.paymentPage.providers.stripe.description')}
                </span>
                <span className='text-sm'>{description}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <Button
        type='submit'
        disabled={
          !stripe ||
          !cardComplete ||
          isProcessing ||
          createPaymentMutation.isPending
        }
        className='w-full bg-primary/90 hover:bg-primary text-white py-3'
      >
        {isProcessing || createPaymentMutation.isPending
          ? t('modules.pages.paymentPage.providers.stripe.processing')
          : t('modules.pages.paymentPage.providers.stripe.pay', {
              amount: `${amount} ${currency?.toUpperCase()}`,
            })}
      </Button>
    </form>
  );
}
