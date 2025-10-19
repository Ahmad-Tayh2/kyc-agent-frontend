import type { WorldpaySessionRequest } from '@/services/worldpay';
import { createWorldpaySession } from '@/services/worldpay';
import {
  handleNetworkError,
  redirectToWorldpay,
  validatePaymentData,
} from '@/utils/worldpay';
import { useCallback, useState } from 'react';

interface UseWorldpayPaymentProps {
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

interface UseWorldpayPaymentReturn {
  processPayment: (paymentData: WorldpaySessionRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Custom hook for handling Worldpay payments
 * Provides a clean interface for processing payments with proper error handling
 */
export const useWorldpayPayment = ({
  onError,
  onSuccess,
}: UseWorldpayPaymentProps = {}): UseWorldpayPaymentReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const processPayment = useCallback(
    async (paymentData: WorldpaySessionRequest) => {
      try {
        setIsLoading(true);
        setError(null);

        // Validate payment data
        validatePaymentData(paymentData);

        console.log('Creating Worldpay session with data:', paymentData);

        // Create payment session
        const sessionData = await createWorldpaySession(paymentData);

        console.log('Worldpay session created successfully:', sessionData);

        // Store order code and payment ID for tracking
        localStorage.setItem('worldpay_order_code', sessionData.order_code);
        localStorage.setItem('payment_id', String(sessionData.payment_id));

        // Simply redirect to Worldpay
        redirectToWorldpay(sessionData.redirect_url);

        // Call success callback if provided
        onSuccess?.();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : handleNetworkError(err);

        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [onError, onSuccess]
  );

  return {
    processPayment,
    isLoading,
    error,
    clearError,
  };
};

/**
 * Example usage:
 *
 * const { processPayment, isLoading, error, clearError } = useWorldpayPayment({
 *   onError: (error) => console.error('Payment failed:', error),
 *   onSuccess: () => console.log('Payment initiated successfully'),
 * });
 *
 * // To process a payment:
 * await processPayment({
 *   transactionReference: 'TR-123456',
 *   description: 'Payment for Order #123'
 * });
 */
