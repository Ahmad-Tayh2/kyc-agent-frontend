import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PaymentCancelledPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<{
    orderCode: string | null;
    provider: string | null;
    transactionId: string | null;
    paymentLinkToken: string | null;
  }>({
    orderCode: null,
    provider: null,
    transactionId: null,
    paymentLinkToken: null,
  });

  useEffect(() => {
    const orderCodeParam =
      searchParams.get('orderCode') || searchParams.get('order_code');
    const provider = searchParams.get('provider');
    const transactionId = searchParams.get('transactionId');
    const paymentLinkToken = searchParams.get('paymentLinkToken');

    setPaymentData({
      orderCode: orderCodeParam,
      provider,
      transactionId,
      paymentLinkToken,
    });

    // Clean up stored data
    localStorage.removeItem('worldpay_order_code');
    localStorage.removeItem('payment_id');

    // Auto-redirect after 8 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 8000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  const handleRetry = () => {
    // Retry with the original token if available
    if (paymentData.transactionId) {
      navigate(`/payment/${paymentData.transactionId}`);
    } else if (paymentData.paymentLinkToken) {
      navigate(`/payment/${paymentData.paymentLinkToken}`);
    } else {
      // Fallback to dashboard if no retry data available
      navigate('/dashboard');
    }
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='max-w-md w-full mx-4'>
        <div className='bg-white rounded-lg shadow-sm border p-8 text-center'>
          <div className='w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6'>
            <AlertTriangle className='w-8 h-8 text-yellow-600' />
          </div>

          <h1 className='text-2xl font-semibold text-gray-900 mb-2'>
            Payment Cancelled
          </h1>
          <p className='text-gray-600 mb-6'>
            Payment was cancelled. You can try again anytime.
          </p>

          {paymentData.orderCode && (
            <div className='bg-gray-50 rounded-lg p-4 mb-6'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Order Code:</span>
                <span className='font-medium'>{paymentData.orderCode}</span>
              </div>
              {paymentData.provider && (
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Provider:</span>
                  <span className='font-medium capitalize'>
                    {paymentData.provider}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className='flex gap-3 mb-4'>
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

          <p className='text-xs text-gray-500'>
            You will be redirected to dashboard in a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
