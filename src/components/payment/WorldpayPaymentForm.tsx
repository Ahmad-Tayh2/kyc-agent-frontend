import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useWorldpayIframeVisibility } from '@/hooks/utils/useWorldpayIframeVisibility';
import { createWorldpaySession } from '@/services/worldpay';
import {
  handleNetworkError,
  openWorldpayIframe,
  openWorldpayLightbox,
  redirectToWorldpay,
  showPaymentLoading,
  validatePaymentData,
} from '@/utils/worldpay';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface WorldpayPaymentFormProps {
  transactionId?: number | string;
  paymentLinkToken?: string;
  description?: string;
  mode?: 'redirect' | 'iframe' | 'lightbox';
  onError: (error: string) => void;
  onSuccess?: (data: Record<string, unknown>) => void;
}

type WorldpayFormStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'submitting'
  | 'iframe-loading'
  | 'error';

// Using Worldpay Hosted Payment Pages with form submission approach

const WorldpayPaymentForm = ({
  transactionId,
  paymentLinkToken,
  description,
  mode = 'iframe', // Default to iframe mode using official Worldpay library
  onError,
  onSuccess,
}: WorldpayPaymentFormProps) => {
  const [status, setStatus] = useState<WorldpayFormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  // Hook to ensure iframe visibility
  useWorldpayIframeVisibility(
    'worldpay-iframe-container',
    mode === 'iframe' && status === 'iframe-loading'
  );

  // Create payment session and handle payment flow
  useEffect(() => {
    const processWorldpayPayment = async () => {
      try {
        setStatus('loading');
        showPaymentLoading('Initializing payment...');

        console.log('Debug - transactionId:', transactionId);
        console.log('Debug - paymentLinkToken:', paymentLinkToken);

        // Create session request data
        const requestData = transactionId
          ? { transactionReference: String(transactionId), description }
          : { paymentLinkToken: String(paymentLinkToken), description };

        // Validate payment data
        validatePaymentData(requestData);

        console.log('Creating Worldpay session with data:', requestData);

        const session = await createWorldpaySession(requestData);

        console.log('Worldpay session created:', session);
        console.log('Redirect URL:', session.redirect_url);
        console.log('Order Code:', session.order_code);

        // Check for common issues
        if (!session.redirect_url.includes('worldpay.com')) {
          console.warn(
            '⚠️ WARNING: Redirect URL does not contain worldpay.com:',
            session.redirect_url
          );
        }

        // Store order code and payment ID for tracking
        localStorage.setItem('worldpay_order_code', session.order_code);
        localStorage.setItem('payment_id', String(session.payment_id));

        // Handle different display modes
        if (mode === 'redirect') {
          setStatus('submitting');
          // Simply redirect to Worldpay - backend has handled all the XML order creation
          redirectToWorldpay(session.redirect_url);
        } else if (mode === 'iframe') {
          // Set status to iframe-loading so the iframe container is visible
          setStatus('iframe-loading');

          // Small delay to ensure the container is rendered
          setTimeout(() => {
            console.log('🔄 Attempting iframe embedding');
            console.log('📋 Debug Info:', {
              redirectUrl: session.redirect_url,
              containerId: 'worldpay-iframe-container',
              containerExists: !!document.getElementById(
                'worldpay-iframe-container'
              ),
              WPCLAvailable: typeof window.WPCL,
            });

            openWorldpayIframe(
              session.redirect_url,
              'worldpay-iframe-container',
              (data) => {
                console.log('Payment successful:', data);
                onSuccess?.(data as Record<string, unknown>);
              },
              (error) => {
                console.warn('Iframe payment error:', error);
                onError(error);
              },
              () => {
                console.log('Payment cancelled');
                onError('Payment was cancelled');
              }
            );
          }, 200); // Increased delay to ensure DOM is ready
        } else if (mode === 'lightbox') {
          setStatus('submitting');
          // Open in lightbox
          openWorldpayLightbox(
            session.redirect_url,
            (data) => {
              console.log('Payment successful:', data);
              onSuccess?.(data as Record<string, unknown>);
            },
            (error) => {
              console.error('Payment failed:', error);
              onError(error);
            },
            () => {
              console.log('Payment cancelled');
              onError('Payment was cancelled');
            }
          );
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : handleNetworkError(err);
        setErrorMessage(message);
        onError(message);
        setStatus('error');
      }
    };

    processWorldpayPayment();
  }, [transactionId, paymentLinkToken, description, mode, onError, onSuccess]);

  // Handle retry after error
  const handleRetry = () => {
    setStatus('idle');
    setErrorMessage('');
    window.location.reload();
  };

  if (status === 'loading') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Initializing Payment</CardTitle>
          <CardDescription>
            Setting up your secure payment session...
          </CardDescription>
        </CardHeader>
        <CardContent className='flex items-center justify-center py-10'>
          <div className='flex flex-col items-center'>
            <Loader2 className='h-8 w-8 animate-spin text-blue-600 mb-4' />
            <p className='text-gray-600 text-center'>
              Please wait while we prepare your payment...
            </p>
          </div>
        </CardContent>
      </Card>
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

  if (status === 'submitting' || status === 'iframe-loading') {
    // Different display based on mode
    if (mode === 'iframe' && status === 'iframe-loading') {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Payment</CardTitle>
            <CardDescription>
              Complete your payment securely in the frame below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              ref={iframeContainerRef}
              id='worldpay-iframe-container'
              className='min-h-[600px] border rounded-lg relative overflow-hidden'
              style={
                {
                  minHeight: '600px',
                  width: '100%',
                  // Ensure iframe is properly sized
                  '--iframe-width': '100%',
                } as React.CSSProperties
              }
            >
              <div className='absolute inset-0 flex flex-col items-center justify-center bg-white'>
                <Loader2 className='h-8 w-8 animate-spin text-blue-600 mb-4' />
                <p className='text-gray-600 text-center'>
                  Loading payment form...
                </p>
                {process.env.NODE_ENV === 'development' && (
                  <button
                    onClick={() => {
                      const container = document.getElementById(
                        'worldpay-iframe-container'
                      );
                      const iframe = container?.querySelector('iframe');
                      console.log('🔍 Debug iframe:', {
                        container,
                        iframe,
                        iframeStyles: iframe
                          ? {
                              width: iframe.style.width,
                              height: iframe.style.height,
                              display: iframe.style.display,
                              visibility: iframe.style.visibility,
                            }
                          : 'No iframe found',
                      });
                    }}
                    className='mt-2 text-xs text-blue-600 underline'
                  >
                    Debug Iframe
                  </button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (status === 'submitting') {
      return (
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === 'lightbox'
                ? 'Opening Payment Window'
                : 'Redirecting to Payment'}
            </CardTitle>
            <CardDescription>
              {mode === 'lightbox'
                ? 'Your payment will open in a secure popup window...'
                : 'You are being redirected to Worldpay to complete your payment securely.'}
            </CardDescription>
          </CardHeader>
          <CardContent className='flex items-center justify-center py-10'>
            <div className='flex flex-col items-center'>
              <Loader2 className='h-10 w-10 animate-spin text-blue-600 mb-4' />
              <p className='text-gray-600 text-center'>
                Please do not close this window during the payment process.
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }
  }

  // Fallback - should not reach here normally
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Ready</CardTitle>
        <CardDescription>Preparing your payment session...</CardDescription>
      </CardHeader>
      <CardContent className='flex items-center justify-center py-10'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </CardContent>
    </Card>
  );
};

export default WorldpayPaymentForm;
