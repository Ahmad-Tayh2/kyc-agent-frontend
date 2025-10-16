import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { WorldpaySessionResponse } from '@/services/worldpay';
import { createWorldpaySession } from '@/services/worldpay';
import type { PaymentData } from '@/types/payment';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface WorldpayPaymentFormProps {
  transactionId?: number | string; // Allow string transaction references like "TR-74871798"
  paymentLinkToken?: string;
  amount?: number; // Optional since we're not using it directly anymore
  currency?: string; // Optional since we're not using it directly anymore
  description?: string; // Optional since we're not using it directly anymore
  onSuccess?: (paymentData: PaymentData) => void; // Optional since we're redirecting
  onError: (error: string) => void;
}

type WorldpayFormStatus = 'idle' | 'loading' | 'ready' | 'submitting' | 'error';

// We're using the direct redirect approach instead of the client-side JavaScript library

const WorldpayPaymentForm = ({
  transactionId,
  paymentLinkToken,
  onError,
}: WorldpayPaymentFormProps) => {
  const [status, setStatus] = useState<WorldpayFormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [sessionData, setSessionData] =
    useState<WorldpaySessionResponse | null>(null);

  // Create payment session on component mount
  useEffect(() => {
    const initializeWorldpay = async () => {
      try {
        setStatus('loading');

        console.log('Debug - transactionId:', transactionId);
        console.log('Debug - paymentLinkToken:', paymentLinkToken);

        if (!transactionId && !paymentLinkToken) {
          throw new Error('Transaction ID or payment link token is required');
        }

        // Use the transaction reference directly from the URL
        // It could be a string like "TR-74871798" or a numeric ID
        const requestData = transactionId
          ? { transactionReference: String(transactionId) } // Ensure it's a string
          : { paymentLinkToken };

        const session = await createWorldpaySession(requestData);
        setSessionData(session);

        // No need to load the Worldpay script since we'll redirect directly
        setStatus('ready');
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to initialize payment';
        setErrorMessage(message);
        onError(message);
        setStatus('error');
      }
    };

    initializeWorldpay();
  }, [transactionId, paymentLinkToken, onError]);

  // Redirect to Worldpay hosted payment page when session data is ready
  useEffect(() => {
    if (status !== 'ready' || !sessionData) {
      return;
    }

    try {
      // Get the session URL from the response
      const { session_id: sessionUrl } = sessionData;

      console.log('Redirecting to Worldpay session URL:', sessionUrl);

      // Redirect to the Worldpay hosted payment page
      window.location.href = sessionUrl;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to redirect to Worldpay';
      setErrorMessage(message);
      onError(message);
      setStatus('error');
    }
  }, [status, sessionData, onError]);

  // Handle retry after error
  const handleRetry = () => {
    setStatus('idle');
    setErrorMessage('');
    window.location.reload();
  };

  if (status === 'loading') {
    return (
      <div className='flex flex-col items-center justify-center p-6'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600 mb-4' />
        <p className='text-gray-600 text-center'>
          Initializing payment form...
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className='space-y-4'>
        <Alert className='border-red-200 bg-red-50'>
          <AlertDescription className='text-red-700'>
            {errorMessage}
          </AlertDescription>
        </Alert>
        <Button
          onClick={handleRetry}
          className='w-full bg-blue-600 hover:bg-blue-700'
        >
          Retry Payment
        </Button>
      </div>
    );
  }

  return (
    <div className='worldpay-container relative'>
      {/* Worldpay form container */}
      <div id='worldpay-payment-form' className='min-h-[300px]'></div>

      {/* Loading state while form initializes */}
      {status !== 'ready' && (
        <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-80'>
          <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
        </div>
      )}
    </div>
  );
};

export default WorldpayPaymentForm;
