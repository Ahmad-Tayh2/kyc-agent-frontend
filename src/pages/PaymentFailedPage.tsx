import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PaymentFailedPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [orderCode, setOrderCode] = useState<string | null>(null);

  const mapErrorCode = useCallback((errorCode: string): string => {
    const errorMap: Record<string, string> = {
      '5': 'Card declined. Please try a different card.',
      '4': 'Invalid card details. Please check and try again.',
      '7': 'Insufficient funds. Please try a different card.',
      '8': 'Card expired. Please use a valid card.',
      '10': 'Transaction limit exceeded. Please contact your bank.',
    };

    return errorMap[errorCode] || 'Payment failed. Please try again.';
  }, []);

  const mapErrorMessage = useCallback(
    (errorCode: string | null, errorMessage: string): string => {
      if (errorCode) {
        return mapErrorCode(errorCode);
      }
      return errorMessage || 'Payment failed. Please try again.';
    },
    [mapErrorCode]
  );

  useEffect(() => {
    const orderCodeParam =
      searchParams.get('order_code') || searchParams.get('orderCode');
    const errorCode = searchParams.get('error_code');
    const errorMessageParam = searchParams.get('error_message');
    const error = searchParams.get('error');

    setOrderCode(orderCodeParam);

    // Map error messages to user-friendly versions
    let displayMessage = 'Payment failed. Please try again.';

    if (error === 'invalid_success_params') {
      displayMessage = 'Payment status unclear. Please contact support.';
    } else if (errorMessageParam) {
      displayMessage = mapErrorMessage(errorCode, errorMessageParam);
    } else if (errorCode) {
      displayMessage = mapErrorCode(errorCode);
    }

    setErrorMessage(displayMessage);

    // Clean up stored data
    localStorage.removeItem('worldpay_order_code');
    localStorage.removeItem('payment_id');
  }, [searchParams, mapErrorMessage, mapErrorCode]);

  const handleRetry = () => {
    navigate('/checkout');
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='max-w-md w-full mx-4'>
        <div className='bg-white rounded-lg shadow-sm border p-8 text-center'>
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>
            <XCircle className='w-8 h-8 text-red-600' />
          </div>

          <h1 className='text-2xl font-semibold text-gray-900 mb-2'>
            Payment Failed
          </h1>
          <p className='text-gray-600 mb-6'>
            There was an issue processing your payment.
          </p>

          {errorMessage && (
            <Alert className='border-red-200 bg-red-50 text-left mb-6'>
              <AlertDescription className='text-red-700'>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {orderCode && (
            <div className='bg-gray-50 rounded-lg p-4 mb-6'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Order Code:</span>
                <span className='font-medium'>{orderCode}</span>
              </div>
            </div>
          )}

          <div className='flex gap-3'>
            <Button
              onClick={handleRetry}
              className='flex-1 bg-blue-600 hover:bg-blue-700'
            >
              Try Again
            </Button>
            <Button onClick={handleGoHome} variant='outline' className='flex-1'>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
