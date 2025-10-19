import { Button } from '@/components/ui/button';
import { verifyPaymentStatus } from '@/services/worldpay';
import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderCode, setOrderCode] = useState<string | null>(null);

  useEffect(() => {
    const status = searchParams.get('status');
    const orderCodeParam = searchParams.get('orderCode');

    if (status === 'success' && orderCodeParam) {
      setOrderCode(orderCodeParam);

      // Optional: Verify payment status with backend
      verifyPaymentStatus(orderCodeParam)
        .then((result) => {
          if (result && result.status === 'completed') {
            console.log('Payment verified as completed');
          } else {
            console.warn('Payment status verification failed:', result);
          }
        })
        .catch((error) => {
          console.error('Error verifying payment status:', error);
        });

      // Clean up stored data
      localStorage.removeItem('worldpay_order_code');
      localStorage.removeItem('payment_id');

      // Auto-redirect after 5 seconds
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      // If no valid success parameters, redirect to error
      navigate('/payment/failed?error=invalid_success_params');
    }
  }, [searchParams, navigate]);

  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='max-w-md w-full mx-4'>
        <div className='bg-white rounded-lg shadow-sm border p-8 text-center'>
          <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
            <CheckCircle className='w-8 h-8 text-green-600' />
          </div>

          <h1 className='text-2xl font-semibold text-gray-900 mb-2'>
            Payment Successful!
          </h1>
          <p className='text-gray-600 mb-6'>
            Your payment has been processed successfully.
          </p>

          {orderCode && (
            <div className='bg-gray-50 rounded-lg p-4 mb-6'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Order Code:</span>
                <span className='font-medium'>{orderCode}</span>
              </div>
            </div>
          )}

          <Button
            onClick={handleContinue}
            className='w-full bg-green-600 hover:bg-green-700 mb-4'
          >
            Continue to Dashboard
          </Button>

          <p className='text-xs text-gray-500'>
            You will be redirected automatically in a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
