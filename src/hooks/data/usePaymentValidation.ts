import { useState, useEffect, useCallback } from 'react';
import { paymentService } from '@/services/payment';
import type {
  PaymentValidationRequest,
  PaymentValidationResponse,
  PaymentValidationData,
} from '@/types/payment';

interface UsePaymentValidationOptions {
  transactionReference?: string;
  paymentLinkToken?: string;
  walletCurrencyId?: number;
  amount?: number;
  enabled?: boolean; // Whether to automatically validate on mount
}

interface UsePaymentValidationReturn {
  data: PaymentValidationData | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  isValid: boolean;
  validate: (options?: PaymentValidationRequest) => Promise<void>;
  reset: () => void;
}

export function usePaymentValidation(
  options: UsePaymentValidationOptions = {}
): UsePaymentValidationReturn {
  const {
    transactionReference,
    paymentLinkToken,
    walletCurrencyId,
    amount,
    enabled = true,
  } = options;

  const [data, setData] = useState<PaymentValidationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  const validate = useCallback(
    async (overrideOptions?: PaymentValidationRequest) => {
      // Build validation request
      const validationRequest: PaymentValidationRequest = {
        transactionReference:
          overrideOptions?.transactionReference ?? transactionReference,
        paymentLinkToken: overrideOptions?.paymentLinkToken ?? paymentLinkToken,
        walletCurrencyId: overrideOptions?.walletCurrencyId ?? walletCurrencyId,
        amount: overrideOptions?.amount ?? amount,
      };

      // Check if we have at least one required field
      if (
        !validationRequest.transactionReference &&
        !validationRequest.paymentLinkToken &&
        !validationRequest.walletCurrencyId
      ) {
        setIsError(true);
        setError(
          'At least one of transactionReference, paymentLinkToken, or walletCurrencyId is required'
        );
        setIsValid(false);
        return;
      }

      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const response: PaymentValidationResponse =
          await paymentService.validatePayment(validationRequest);

        if (response.status && response.data) {
          setData(response.data);
          setIsValid(true);
          setIsError(false);
          setError(null);
        } else {
          setData(null);
          setIsValid(false);
          setIsError(true);
          setError(response.message || 'Payment validation failed');
        }
      } catch (err: any) {
        setData(null);
        setIsValid(false);
        setIsError(true);
        setError(
          err.message ||
            'An error occurred while validating the payment. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [transactionReference, paymentLinkToken, walletCurrencyId, amount]
  );

  const reset = useCallback(() => {
    setData(null);
    setIsLoading(false);
    setIsError(false);
    setError(null);
    setIsValid(false);
  }, []);

  // Auto-validate on mount if enabled and we have required data
  useEffect(() => {
    if (
      enabled &&
      (transactionReference || paymentLinkToken || walletCurrencyId)
    ) {
      validate();
    }
  }, [enabled]); // Only run on mount when enabled changes

  return {
    data,
    isLoading,
    isError,
    error,
    isValid,
    validate,
    reset,
  };
}
