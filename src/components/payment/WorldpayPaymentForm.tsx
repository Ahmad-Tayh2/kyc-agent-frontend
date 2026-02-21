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
import { useTranslation } from 'react-i18next';

interface WorldpayPaymentFormProps {
  transactionId?: number | string;
  paymentLinkToken?: string;
  walletCurrencyId?: number; // For wallet top-up
  amount?: number; // Required when walletCurrencyId is provided
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
  walletCurrencyId,
  amount,
  description,
  mode = 'iframe', // Default to iframe mode using official Worldpay library
  onError,
  onSuccess,
}: WorldpayPaymentFormProps) => {
  const { t } = useTranslation('global');
  const [status, setStatus] = useState<WorldpayFormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  // Hook to ensure iframe visibility
  useWorldpayIframeVisibility(
    'worldpay-iframe-container',
    mode === 'iframe' && status === 'iframe-loading',
  );

  // Create payment session and handle payment flow
  useEffect(() => {
    const processWorldpayPayment = async () => {
      try {
        setStatus('loading');
        showPaymentLoading(t('modules.pages.paymentPage.providers.worldpay.initializing'));

        // Create session request data
        const requestData = walletCurrencyId
          ? { walletCurrencyId, amount, description }
          : transactionId
            ? { transactionReference: String(transactionId), description }
            : { paymentLinkToken: String(paymentLinkToken), description };

        // Validate payment data
        validatePaymentData(requestData);

        const session = await createWorldpaySession(requestData);

        // Store order code and payment ID for tracking
        localStorage.setItem('worldpay_order_code', session.order_code);
        localStorage.setItem('payment_id', String(session.payment_id));

        // Store currency conversion info if available (for display in payment summary)
        if (
          session.payable_currency &&
          session.currency &&
          session.payable_currency !== session.currency
        ) {
          const conversionData = {
            total_amount: session.total_amount,
            currency: session.currency,
            payable_amount: session.payable_amount,
            payable_currency: session.payable_currency,
          };
          console.log(
            '💱 Worldpay currency conversion detected:',
            conversionData,
          );
          sessionStorage.setItem(
            'worldpay_currency_conversion',
            JSON.stringify(conversionData),
          );

          // Dispatch custom event to notify PaymentPage that conversion data is ready
          console.log('📢 Dispatching worldpay-conversion-ready event');
          window.dispatchEvent(
            new CustomEvent('worldpay-conversion-ready', {
              detail: conversionData,
            }),
          );
        } else {
          console.log('ℹ️ No currency conversion needed or same currency');
          // Clear any previous conversion data
          sessionStorage.removeItem('worldpay_currency_conversion');
        }

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
            openWorldpayIframe(
              session.redirect_url,
              'worldpay-iframe-container',
              (data) => {
                onSuccess?.(data as Record<string, unknown>);
              },
              (error) => {
                onError(error);
              },
              () => {
                onError(t('modules.pages.paymentPage.providers.worldpay.cancelled'));
              },
            );
          }, 200);
        } else if (mode === 'lightbox') {
          setStatus('submitting');
          // Open in lightbox
          openWorldpayLightbox(
            session.redirect_url,
            (data) => {
              onSuccess?.(data as Record<string, unknown>);
            },
            (error) => {
              onError(error);
            },
            () => {
              onError(t('modules.pages.paymentPage.providers.worldpay.cancelled'));
            },
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
  }, [
    transactionId,
    paymentLinkToken,
    walletCurrencyId,
    amount,
    description,
    mode,
    onError,
    onSuccess,
    t,
  ]);

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
          <CardTitle>
            {t('modules.pages.paymentPage.providers.worldpay.initializing')}
          </CardTitle>
          <CardDescription>
            {t('modules.pages.paymentPage.providers.worldpay.settingUp')}
          </CardDescription>
        </CardHeader>
        <CardContent className='flex items-center justify-center py-10'>
          <div className='flex flex-col items-center'>
            <Loader2 className='h-8 w-8 animate-spin text-blue-600 mb-4' />
            <p className='text-gray-600 text-center'>
              {t('modules.pages.paymentPage.providers.worldpay.pleaseWait')}
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
          {t('modules.pages.paymentPage.providers.worldpay.retry')}
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
            <CardTitle>
              {t('modules.pages.paymentPage.providers.worldpay.completeTitle')}
            </CardTitle>
            <CardDescription>
              {t('modules.pages.paymentPage.providers.worldpay.completeSubtitle')}
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
                  {t('modules.pages.paymentPage.providers.worldpay.loadingForm')}
                </p>
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
                ? t('modules.pages.paymentPage.providers.worldpay.openingWindow')
                : t('modules.pages.paymentPage.providers.worldpay.redirecting')}
            </CardTitle>
            <CardDescription>
              {mode === 'lightbox'
                ? t('modules.pages.paymentPage.providers.worldpay.popupWindow')
                : t('modules.pages.paymentPage.providers.worldpay.redirectMessage')}
            </CardDescription>
          </CardHeader>
          <CardContent className='flex items-center justify-center py-10'>
            <div className='flex flex-col items-center'>
              <Loader2 className='h-10 w-10 animate-spin text-blue-600 mb-4' />
              <p className='text-gray-600 text-center'>
                {t('modules.pages.paymentPage.providers.worldpay.doNotClose')}
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
        <CardTitle>
          {t('modules.pages.paymentPage.providers.worldpay.ready')}
        </CardTitle>
        <CardDescription>
          {t('modules.pages.paymentPage.providers.worldpay.settingUp')}
        </CardDescription>
      </CardHeader>
      <CardContent className='flex items-center justify-center py-10'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </CardContent>
    </Card>
  );
};

export default WorldpayPaymentForm;
