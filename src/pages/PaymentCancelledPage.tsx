import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PaymentCancelledPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderCode, setOrderCode] = useState<string | null>(null);

  useEffect(() => {
    const orderCodeParam =
      searchParams.get('orderCode') || searchParams.get('order_code');
    setOrderCode(orderCodeParam);

    // Clean up stored data
    localStorage.removeItem('worldpay_order_code');
    localStorage.removeItem('payment_id');

    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate('/checkout');
    }, 5000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

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
          <div className='w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6'>
            <AlertTriangle className='w-8 h-8 text-yellow-600' />
          </div>

          <h1 className='text-2xl font-semibold text-gray-900 mb-2'>
            Payment Cancelled
          </h1>
          <p className='text-gray-600 mb-6'>
            Payment was cancelled. You can try again anytime.
          </p>

          {orderCode && (
            <div className='bg-gray-50 rounded-lg p-4 mb-6'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Order Code:</span>
                <span className='font-medium'>{orderCode}</span>
              </div>
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
            You will be redirected to checkout in a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
