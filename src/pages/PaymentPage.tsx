// import PaymentMethodSelector from "@/components/payment/PaymentMethodSelector";
import WorldpayPaymentForm from '@/components/payment/WorldpayPaymentForm';
import BrandingSection from '@/components/shared/BrandingSection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useGetApisAndGateways } from '@/hooks/data/useApisAndGateways';
import { usePaymentValidation } from '@/hooks/data/usePaymentValidation';
import { useGetTransferById } from '@/hooks/data/useTransfers';
import type {
  PaymentData,
  PaymentMethod,
  PaymentProvider,
} from '@/types/payment';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const StripePaymentForm = lazy(
  () => import('@/components/payment/StripePaymentForm'),
);

type ApiType = {
  name: string;
  is_active: boolean;
  id: number;
};

export default function PaymentPage() {
  const { t } = useTranslation('global');
  const { transactionId, paymentLinkToken, token } = useParams<{
    transactionId?: string;
    paymentLinkToken?: string;
    token?: string; // New unified token parameter
  }>();
  const navigate = useNavigate();
  const {
    data: apisAndGatewaysResponse,
    isLoading: isLoadingGateways,
    // error,
  } = useGetApisAndGateways();

  // State declarations
  const [paymentStatus, setPaymentStatus] = useState<
    'pending' | 'success' | 'error'
  >('pending');
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedProvider, setSelectedProvider] =
    useState<PaymentProvider | null>(null);
  const [selectedMethod /* setSelectedMethod*/] =
    useState<PaymentMethod | null>('card');
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  // Token detection logic
  const [detectedTransactionId, setDetectedTransactionId] = useState<
    string | undefined
  >();
  const [detectedPaymentLinkToken, setDetectedPaymentLinkToken] = useState<
    string | undefined
  >();
  const [walletCurrencyId, setWalletCurrencyId] = useState<
    number | undefined
  >();
  const [walletAmount, setWalletAmount] = useState<number | undefined>();
  const [walletCurrencyCode, setWalletCurrencyCode] = useState<
    string | undefined
  >();

  // Worldpay currency conversion data (if applicable)
  const [worldpayCurrencyConversion, setWorldpayCurrencyConversion] = useState<{
    total_amount: string;
    currency: string;
    payable_amount: number;
    payable_currency: string;
  } | null>(null);

  // Determine which payment providers are enabled
  const enabledProviders = useMemo(() => {
    const activeApis =
      apisAndGatewaysResponse?.data?.filter((api: ApiType) => api?.is_active) ??
      [];

    const providers: PaymentProvider[] = [];

    activeApis.forEach((api: ApiType) => {
      if (api.name === 'Stripe API') {
        providers.push('stripe');
      } else if (api.name === 'Worldpay API') {
        providers.push('worldpay');
      }
    });

    return providers;
  }, [apisAndGatewaysResponse]);

  function randomIntInRange(min: number, max: number): number {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw new Error('min and max must be integers for randomIntInRange');
    }
    if (min > max) {
      throw new Error('min must be <= max');
    }
    // Generate in [min, max]
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Set initial provider based on enabled providers
  useEffect(() => {
    if (enabledProviders.length > 0 && !selectedProvider) {
      // Randomly select from enabled providers
      const randomProvider =
        enabledProviders[randomIntInRange(0, enabledProviders.length - 1)];
      setSelectedProvider(randomProvider);
    }
  }, [enabledProviders, selectedProvider]);

  // Load Worldpay currency conversion data from sessionStorage
  useEffect(() => {
    const loadConversionData = () => {
      const conversionData = sessionStorage.getItem(
        'worldpay_currency_conversion',
      );
      if (conversionData) {
        try {
          setWorldpayCurrencyConversion(JSON.parse(conversionData));
        } catch (error) {
          console.error(
            'Failed to parse worldpay currency conversion data:',
            error,
          );
        }
      }
    };

    // Load initially
    loadConversionData();

    // Listen for custom event when Worldpay stores conversion data
    const handleConversionReady = (event: CustomEvent) => {
      console.log('Worldpay conversion data received:', event.detail);
      setWorldpayCurrencyConversion(event.detail);
    };

    window.addEventListener(
      'worldpay-conversion-ready',
      handleConversionReady as EventListener,
    );

    return () => {
      window.removeEventListener(
        'worldpay-conversion-ready',
        handleConversionReady as EventListener,
      );
    };
  }, [selectedProvider]); // Reload when provider changes

  useEffect(() => {
    if (token) {
      // Detect token type based on prefix
      if (token.startsWith('TR-')) {
        // Transaction reference
        setDetectedTransactionId(token);
        setDetectedPaymentLinkToken(undefined);
        setWalletCurrencyId(undefined);
        setWalletAmount(undefined);
        setWalletCurrencyCode(undefined);
      } else if (token.startsWith('add-')) {
        // Wallet top-up: extract walletCurrencyId from token
        const wcId = parseInt(token.replace('add-', ''));
        setWalletCurrencyId(wcId);

        // Get amount and currency from sessionStorage
        const addMoneyData = sessionStorage.getItem('addMoneyData');
        if (addMoneyData) {
          const parsed = JSON.parse(addMoneyData);
          setWalletAmount(parsed.amount);
          setWalletCurrencyCode(parsed.currencyCode);
        }

        setDetectedTransactionId(undefined);
        setDetectedPaymentLinkToken(undefined);
      } else {
        // Payment link token
        setDetectedPaymentLinkToken(token);
        setDetectedTransactionId(undefined);
        setWalletCurrencyId(undefined);
        setWalletAmount(undefined);
        setWalletCurrencyCode(undefined);
      }
    } else {
      // Fallback to existing parameters
      setDetectedTransactionId(transactionId);
      setDetectedPaymentLinkToken(paymentLinkToken);
      setWalletCurrencyId(undefined);
      setWalletAmount(undefined);
      setWalletCurrencyCode(undefined);
    }
  }, [token, transactionId, paymentLinkToken]);

  // Use payment validation hook
  const {
    data: validationData,
    isLoading: isValidating,
    isError: isValidationError,
    error: validationError,
    isValid,
  } = usePaymentValidation({
    transactionReference: detectedTransactionId,
    paymentLinkToken: detectedPaymentLinkToken,
    walletCurrencyId: walletCurrencyId,
    amount: walletAmount,
    enabled: !!(
      detectedTransactionId ||
      detectedPaymentLinkToken ||
      walletCurrencyId
    ),
  });

  const { data: transferData } = useGetTransferById(
    detectedTransactionId ? parseInt(detectedTransactionId) : '',
  );

  // Payment info - uses validation data first, then falls back to existing logic
  const paymentInfo = useMemo(() => {
    if (validationData) {
      // Use validated data
      return {
        amount: validationData.total_amount,
        currency: validationData.currency,
        description:
          validationData.type === 'add_money'
            ? t('modules.pages.paymentPage.messages.addMoney', {
                currency: validationData.currency,
              })
            : validationData.type === 'payment_link' &&
                validationData.payment_link_type === 'remittance_cart'
              ? t('modules.pages.paymentPage.messages.multipleTransactions', {
                  count: validationData.transactions_count,
                })
              : t('modules.pages.paymentPage.messages.singleTransaction', {
                  id:
                    validationData.transaction_reference ||
                    validationData.payment_link_token,
                }),
      };
    }

    // Fallback to old logic
    return {
      amount: walletAmount || transferData?.data?.total_payable_amount || 0,
      currency:
        walletCurrencyCode || transferData?.data?.send_currency || 'USD',
      description: walletCurrencyId
        ? t('modules.pages.paymentPage.messages.addMoney', {
            currency: walletCurrencyCode,
          })
        : t('modules.pages.paymentPage.messages.singleTransaction', {
            id: detectedTransactionId || detectedPaymentLinkToken,
          }),
    };
  }, [
    validationData,
    walletAmount,
    walletCurrencyCode,
    walletCurrencyId,
    transferData,
    detectedTransactionId,
    detectedPaymentLinkToken,
    t,
  ]);

  useEffect(() => {
    // Don't show errors while validating - wait for validation to complete
    if (isValidating) {
      // Keep pending state during validation
      return;
    }

    // Handle validation results after validation completes
    if (isValidationError && validationError) {
      setErrorMessage(validationError);
      setPaymentStatus('error');
    } else if (isValid && validationData) {
      // Clear any previous errors when validation succeeds
      setPaymentStatus('pending');
      setErrorMessage('');
    }
    // Don't set error states on initial render - only after validation has been attempted
    // The validation hook will handle showing errors if needed
  }, [
    isValidating,
    isValidationError,
    validationError,
    isValid,
    validationData,
  ]);

  const handlePaymentSuccess = useCallback(
    (data: PaymentData | Record<string, unknown>) => {
      // Handle both PaymentData and generic success data from iframe/lightbox
      let paymentData: PaymentData;

      if ('id' in data && 'transaction_uuid' in data) {
        // It's a PaymentData object
        paymentData = data as PaymentData;
      } else {
        // It's generic data from iframe/lightbox, create a PaymentData object
        paymentData = {
          id: Date.now(), // Temporary ID
          transaction_uuid: (data.transaction_uuid as string) || 'unknown',
          amount: paymentInfo.amount,
          currency: paymentInfo.currency,
          status: 'completed',
          type: 'payment',
          description: paymentInfo.description,
          provider: selectedProvider || 'stripe', // Fallback to stripe if null
          provider_transaction_id:
            (data.order_code as string) ||
            (data.orderKey as string) ||
            'unknown',
          provider_payment_method: 'card',
          processed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      // Store validation data in sessionStorage to pass to success page
      if (validationData) {
        sessionStorage.setItem(
          'paymentValidationData',
          JSON.stringify(validationData),
        );
      }

      // Clear Worldpay currency conversion data
      sessionStorage.removeItem('worldpay_currency_conversion');

      // Redirect to success page with payment data
      const searchParams = new URLSearchParams({
        status: 'success',
        orderCode: paymentData.provider_transaction_id,
        amount: paymentData.amount.toString(),
        currency: paymentData.currency,
        provider: paymentData.provider,
        transactionId: paymentData.transaction_uuid,
      });

      navigate(`/payment/success?${searchParams.toString()}`);
    },
    [paymentInfo, selectedProvider, validationData, navigate],
  );

  const handlePaymentError = useCallback(
    (error: string) => {
      // Clear Worldpay currency conversion data
      sessionStorage.removeItem('worldpay_currency_conversion');

      // Redirect to error page with error details
      const searchParams = new URLSearchParams({
        error: error,
        provider: selectedProvider || 'unknown',
        ...(detectedTransactionId && { transactionId: detectedTransactionId }),
        ...(detectedPaymentLinkToken && {
          paymentLinkToken: detectedPaymentLinkToken,
        }),
      });

      navigate(`/payment/failed?${searchParams.toString()}`);
    },
    [
      selectedProvider,
      detectedTransactionId,
      detectedPaymentLinkToken,
      navigate,
    ],
  );

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleTryAgain = useCallback(() => {
    setPaymentStatus('pending');
    setErrorMessage('');
    setPaymentData(null);
  }, []);

  // Dynamically load Stripe SDK only when ALL conditions are met
  const [StripeElementsComponent, setStripeElementsComponent] = useState<
    React.ComponentType<{
      stripe: import('@stripe/stripe-js').Stripe | null;
      children: React.ReactNode;
    }> | null
  >(null);

  const [stripeInstance, setStripeInstance] = useState<
    import('@stripe/stripe-js').Stripe | null
  >(null);

  useEffect(() => {
    if (
      isLoadingGateways ||
      !enabledProviders.includes('stripe') ||
      selectedProvider !== 'stripe' ||
      selectedMethod !== 'card'
    ) {
      return;
    }

    let cancelled = false;

    Promise.all([
      import('@stripe/react-stripe-js'),
      import('@/lib/stripe').then((m) => m.default()),
    ]).then(([stripeReact, stripe]) => {
      if (!cancelled) {
        setStripeElementsComponent(
          () =>
            stripeReact.Elements as React.ComponentType<{
              stripe: import('@stripe/stripe-js').Stripe | null;
              children: React.ReactNode;
            }>,
        );
        setStripeInstance(stripe);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isLoadingGateways, enabledProviders, selectedProvider, selectedMethod]);

  // Memoize payment forms to prevent re-renders when details toggle
  const stripePaymentForm = useMemo(() => {
    if (
      isLoadingGateways ||
      selectedProvider !== 'stripe' ||
      !enabledProviders.includes('stripe') ||
      selectedMethod !== 'card' ||
      !StripeElementsComponent ||
      !stripeInstance
    ) {
      return null;
    }

    return (
      <StripeElementsComponent stripe={stripeInstance} key='stripe-elements'>
        <Suspense fallback={null}>
          <StripePaymentForm
            transactionId={detectedTransactionId}
            paymentLinkToken={detectedPaymentLinkToken}
            walletCurrencyId={walletCurrencyId}
            amount={paymentInfo.amount}
            currency={paymentInfo.currency}
            description={paymentInfo.description}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </Suspense>
      </StripeElementsComponent>
    );
  }, [
    isLoadingGateways,
    selectedProvider,
    enabledProviders,
    selectedMethod,
    StripeElementsComponent,
    stripeInstance,
    detectedTransactionId,
    detectedPaymentLinkToken,
    walletCurrencyId,
    paymentInfo.amount,
    paymentInfo.currency,
    paymentInfo.description,
    handlePaymentSuccess,
    handlePaymentError,
  ]);

  const worldpayPaymentForm = useMemo(
    () =>
      selectedProvider === 'worldpay' &&
      enabledProviders.includes('worldpay') &&
      selectedMethod === 'card' ? (
        <WorldpayPaymentForm
          key='worldpay-payment-form'
          transactionId={detectedTransactionId}
          paymentLinkToken={detectedPaymentLinkToken}
          walletCurrencyId={walletCurrencyId}
          amount={walletAmount}
          description={paymentInfo.description}
          mode='iframe'
          onError={handlePaymentError}
          onSuccess={handlePaymentSuccess}
        />
      ) : null,
    [
      selectedProvider,
      enabledProviders,
      selectedMethod,
      detectedTransactionId,
      detectedPaymentLinkToken,
      walletCurrencyId,
      walletAmount,
      paymentInfo.description,
      handlePaymentError,
      handlePaymentSuccess,
    ],
  );

  // Clear any existing Stripe instances when switching to Worldpay
  useEffect(() => {
    if (selectedProvider === 'worldpay') {
      // Clear any Stripe-related postMessage listeners that might interfere
    }
  }, [selectedProvider]);

  return (
    <div className='h-screen overflow-y-auto bg-gray-50'>
      <div className='max-w-2xl mx-auto py-8 px-4'>
        {/* Header */}

        <div className='mb-8'>
          <Button
            onClick={handleGoBack}
            variant='ghost'
            className='p-0 h-auto font-normal text-gray-600 hover:text-gray-900'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            {t('modules.pages.paymentPage.back')}
          </Button>
        </div>
        <div className='bg-white rounded-lg shadow-sm border p-6 flex flex-col gap-5'>
          <h1 className='text-3xl font-bold text-gray-900'>
            {t('modules.pages.paymentPage.title')}
          </h1>

          {/* Success State */}
          <BrandingSection
            description={
              <p className='text-gray-600 mt-2'>
                {t('modules.pages.paymentPage.branding.poweredBy')}{' '}
                {selectedProvider === 'stripe'
                  ? t('modules.pages.paymentPage.branding.stripe')
                  : selectedProvider === 'worldpay'
                    ? t('modules.pages.paymentPage.branding.worldpay')
                    : selectedProvider === 'paypal'
                      ? t('modules.pages.paymentPage.branding.paypal')
                      : t('modules.pages.paymentPage.branding.default')}
              </p>
            }
          />
          {paymentStatus === 'success' && paymentData && (
            <div className='text-center space-y-6'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto'>
                <CheckCircle className='w-8 h-8 text-green-600' />
              </div>

              <div>
                <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
                  {t('modules.pages.paymentPage.success.title')}
                </h2>
                <p className='text-gray-600'>
                  {t('modules.pages.paymentPage.success.message')}
                </p>
              </div>

              <div className='bg-gray-50 rounded-lg p-4 space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>
                    {t('modules.pages.paymentPage.success.transactionId')}
                  </span>
                  <span className='font-medium'>
                    {paymentData.transaction_uuid}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>
                    {t('modules.pages.paymentPage.success.amount')}
                  </span>
                  <span className='font-medium'>
                    {paymentData.amount} {paymentData.currency.toUpperCase()}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>
                    {t('modules.pages.paymentPage.success.status')}
                  </span>
                  <span className='font-medium text-green-600 capitalize'>
                    {t(`components.statusLabel.${paymentData.status}`)}
                  </span>
                </div>
                {paymentData.description && (
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>
                      {t('modules.pages.paymentPage.success.description')}
                    </span>
                    <span className='font-medium'>
                      {paymentData.description}
                    </span>
                  </div>
                )}
              </div>

              <Button
                onClick={handleGoBack}
                className='w-full bg-green-600 hover:bg-green-700'
              >
                {t('modules.pages.paymentPage.success.continue')}
              </Button>
            </div>
          )}
          {/* Error State */}
          {paymentStatus === 'error' && !isValidating && (
            <div className='text-center space-y-6'>
              <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto'>
                <XCircle className='w-8 h-8 text-red-600' />
              </div>

              <div>
                <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
                  {t('modules.pages.paymentPage.error.title')}
                </h2>
                <p className='text-gray-600'>
                  {t('modules.pages.paymentPage.error.message')}
                </p>
              </div>

              {errorMessage && (
                <Alert className='border-red-200 bg-red-50 text-left'>
                  <AlertDescription className='text-red-700'>
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}

              <div className='flex gap-3'>
                <Button
                  onClick={handleTryAgain}
                  className='flex-1 bg-blue-600 hover:bg-blue-700'
                >
                  {t('modules.pages.paymentPage.error.tryAgain')}
                </Button>
                <Button
                  onClick={handleGoBack}
                  variant='outline'
                  className='flex-1'
                >
                  {t('modules.pages.paymentPage.error.goBack')}
                </Button>
              </div>
            </div>
          )}

          {/* Payment Form State */}
          {paymentStatus === 'pending' && !isValidating && (
            <div className='space-y-6'>
              {/* Show loading while checking enabled providers */}
              {isLoadingGateways && (
                <div className='text-center py-8'>
                  <p className='text-gray-600'>
                    {t('modules.pages.paymentPage.loading.loadingMethods')}
                  </p>
                </div>
              )}

              {/* Show error if no providers are enabled */}
              {!isLoadingGateways && enabledProviders.length === 0 && (
                <Alert className='border-red-200 bg-red-50'>
                  <AlertDescription className='text-red-700'>
                    {t('modules.pages.paymentPage.loading.noProviders')}
                  </AlertDescription>
                </Alert>
              )}

              {/* Show payment form only if providers are available */}
              {!isLoadingGateways && enabledProviders.length > 0 && (
                <>
                  <div>
                    {/* <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                      Payment Details
                    </h2> */}

                    {/* Payment Summary - Minimal Design */}
                    <div className='border border-gray-200 rounded-lg overflow-hidden mb-6'>
                      {/* Amount Header */}
                      <div className='bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-5 border-b border-gray-200'>
                        <div className='flex justify-between items-start'>
                          <div>
                            <p className='text-sm text-gray-600 mb-1'>
                              {t(
                                'modules.pages.paymentPage.summary.totalAmount',
                              )}
                            </p>
                            <p className='text-3xl font-bold text-gray-900'>
                              {paymentInfo.amount}{' '}
                              <span className='text-2xl'>
                                {paymentInfo.currency.toUpperCase()}
                              </span>
                            </p>
                            {/* Show currency conversion for Worldpay if applicable */}
                            {(() => {
                              return selectedProvider === 'worldpay' &&
                                worldpayCurrencyConversion &&
                                worldpayCurrencyConversion.payable_currency !==
                                  worldpayCurrencyConversion.currency ? (
                                <p className='text-sm text-gray-600 mt-2'>
                                  (
                                  {t(
                                    'modules.pages.paymentPage.summary.equivalentTo',
                                  )}{' '}
                                  <span className='font-semibold text-gray-900'>
                                    {worldpayCurrencyConversion.payable_amount}{' '}
                                    {worldpayCurrencyConversion.payable_currency.toUpperCase()}
                                    )
                                  </span>
                                </p>
                              ) : null;
                            })()}
                          </div>
                          {validationData && (
                            <button
                              onClick={() =>
                                setIsDetailsExpanded(!isDetailsExpanded)
                              }
                              className='flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mt-2'
                            >
                              <span>
                                {isDetailsExpanded
                                  ? t(
                                      'modules.pages.paymentPage.summary.hideDetails',
                                    )
                                  : t(
                                      'modules.pages.paymentPage.summary.showDetails',
                                    )}
                              </span>
                              <svg
                                className={`w-4 h-4 transition-transform ${
                                  isDetailsExpanded ? 'rotate-180' : ''
                                }`}
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M19 9l-7 7-7-7'
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Transaction Details */}
                      {validationData && isDetailsExpanded && (
                        <div className='px-6 py-5 space-y-4'>
                          {/* Transaction Reference */}
                          {validationData.transaction_reference && (
                            <div className='flex justify-between items-center'>
                              <span className='text-sm text-gray-600'>
                                {t(
                                  'modules.pages.paymentPage.details.transactionRef',
                                )}
                              </span>
                              <span className='text-sm font-mono font-medium text-gray-900'>
                                {validationData.transaction_reference}
                              </span>
                            </div>
                          )}

                          {/* Divider */}
                          {validationData.transaction_reference && (
                            <div className='border-t border-gray-100' />
                          )}

                          {/* Customer Information */}
                          {validationData.type !== 'add_money' &&
                            'customer' in validationData && (
                              <>
                                <div>
                                  <p className='text-xs font-medium text-gray-500 mb-3'>
                                    {t(
                                      'modules.pages.paymentPage.details.customer',
                                    )}
                                  </p>
                                  <div className='space-y-2'>
                                    <div className='flex justify-between'>
                                      <span className='text-sm text-gray-600'>
                                        {t(
                                          'modules.pages.paymentPage.details.name',
                                        )}
                                      </span>
                                      <span className='text-sm font-medium text-gray-900'>
                                        {validationData.customer.name}
                                      </span>
                                    </div>
                                    {validationData.customer.email && (
                                      <div className='flex justify-between'>
                                        <span className='text-sm text-gray-600'>
                                          {t(
                                            'modules.pages.paymentPage.details.email',
                                          )}
                                        </span>
                                        <span className='text-sm text-gray-900'>
                                          {validationData.customer.email}
                                        </span>
                                      </div>
                                    )}
                                    {validationData.customer.phone && (
                                      <div className='flex justify-between'>
                                        <span className='text-sm text-gray-600'>
                                          {t(
                                            'modules.pages.paymentPage.details.phone',
                                          )}
                                        </span>
                                        <span className='text-sm text-gray-900'>
                                          {validationData.customer.phone}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className='border-t border-gray-100' />
                              </>
                            )}

                          {/* Single Recipient */}
                          {validationData.type !== 'add_money' &&
                            'recipient' in validationData &&
                            validationData.recipient && (
                              <>
                                <div>
                                  <p className='text-xs font-medium text-gray-500 mb-3'>
                                    {t(
                                      'modules.pages.paymentPage.details.recipient',
                                    )}
                                  </p>
                                  <div className='space-y-2'>
                                    <div className='flex justify-between'>
                                      <span className='text-sm text-gray-600'>
                                        {t(
                                          'modules.pages.paymentPage.details.name',
                                        )}
                                      </span>
                                      <span className='text-sm font-medium text-gray-900'>
                                        {validationData.recipient.name}
                                      </span>
                                    </div>
                                    <div className='flex justify-between'>
                                      <span className='text-sm text-gray-600'>
                                        {t(
                                          'modules.pages.paymentPage.details.phone',
                                        )}
                                      </span>
                                      <span className='text-sm text-gray-900'>
                                        {validationData.recipient.phone}
                                      </span>
                                    </div>
                                    {(validationData.recipient.country ||
                                      validationData.recipient
                                        .country_name) && (
                                      <div className='flex justify-between'>
                                        <span className='text-sm text-gray-600'>
                                          {t(
                                            'modules.pages.paymentPage.details.country',
                                          )}
                                        </span>
                                        <span className='text-sm text-gray-900'>
                                          {validationData.recipient.country
                                            ?.name ||
                                            validationData.recipient
                                              .country_name}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className='border-t border-gray-100' />
                              </>
                            )}

                          {/* Multiple Recipients */}
                          {validationData.type === 'payment_link' &&
                            validationData.payment_link_type ===
                              'remittance_cart' &&
                            'recipients' in validationData && (
                              <>
                                <div>
                                  <div className='flex justify-between items-center mb-3'>
                                    <p className='text-xs font-medium text-gray-500'>
                                      {t(
                                        'modules.pages.paymentPage.details.recipients',
                                      )}
                                    </p>
                                    <span className='text-sm font-bold text-gray-900'>
                                      {validationData.recipients.length}{' '}
                                      {t(
                                        'modules.pages.paymentPage.details.total',
                                      )}
                                    </span>
                                  </div>
                                  <div className='space-y-2'>
                                    {validationData.recipients
                                      .slice(0, 3)
                                      .map((recipient) => (
                                        <div
                                          key={recipient.id}
                                          className='flex justify-between text-sm'
                                        >
                                          <span className='text-gray-900'>
                                            {recipient.name}
                                          </span>
                                          <span className='text-gray-600'>
                                            {recipient.country_name ||
                                              recipient.country?.name}
                                          </span>
                                        </div>
                                      ))}
                                    {validationData.recipients.length > 3 && (
                                      <p className='text-xs text-gray-500 italic'>
                                        {t(
                                          'modules.pages.paymentPage.details.moreRecipients',
                                          {
                                            count:
                                              validationData.recipients.length -
                                              3,
                                          },
                                        )}
                                      </p>
                                    )}
                                  </div>
                                  {validationData.transactions_count && (
                                    <div className='flex justify-between mt-3 pt-3 border-t border-gray-100'>
                                      <span className='text-sm text-gray-600'>
                                        {t(
                                          'modules.pages.paymentPage.details.totalTransactions',
                                        )}
                                      </span>
                                      <span className='text-sm font-medium text-gray-900'>
                                        {validationData.transactions_count}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className='border-t border-gray-100' />
                              </>
                            )}

                          {/* Transfer Route */}
                          {validationData.type !== 'add_money' &&
                            'send_country' in validationData && (
                              <>
                                <div className='flex items-center justify-between'>
                                  <div className='flex-1'>
                                    <p className='text-xs text-gray-500 mb-1'>
                                      {t(
                                        'modules.pages.paymentPage.details.from',
                                      )}
                                    </p>
                                    <p className='text-sm font-medium text-gray-900'>
                                      {validationData.send_country.name}
                                    </p>
                                  </div>
                                  <div className='px-4'>
                                    <svg
                                      className='w-5 h-5 text-gray-400'
                                      fill='none'
                                      stroke='currentColor'
                                      viewBox='0 0 24 24'
                                    >
                                      <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M14 5l7 7m0 0l-7 7m7-7H3'
                                      />
                                    </svg>
                                  </div>
                                  <div className='flex-1 text-right'>
                                    <p className='text-xs text-gray-500 mb-1'>
                                      {t(
                                        'modules.pages.paymentPage.details.to',
                                      )}
                                    </p>
                                    {'receive_country' in validationData &&
                                    validationData.receive_country ? (
                                      <p className='text-sm font-medium text-gray-900'>
                                        {validationData.receive_country.name}
                                      </p>
                                    ) : 'receive_countries' in validationData &&
                                      validationData.receive_countries ? (
                                      <p className='text-sm font-medium text-gray-900'>
                                        {
                                          validationData.receive_countries
                                            .length
                                        }{' '}
                                        {validationData.receive_countries
                                          .length === 1
                                          ? t(
                                              'modules.pages.paymentPage.details.countryLabel',
                                            )
                                          : t(
                                              'modules.pages.paymentPage.details.countries',
                                            )}
                                      </p>
                                    ) : null}
                                  </div>
                                </div>
                                <div className='border-t border-gray-100' />
                              </>
                            )}

                          {/* Wallet Info */}
                          {validationData.type === 'add_money' && (
                            <>
                              <div>
                                <p className='text-xs font-medium text-gray-500 mb-3'>
                                  {t(
                                    'modules.pages.paymentPage.details.wallet',
                                  )}
                                </p>
                                <div className='space-y-2'>
                                  <div className='flex justify-between'>
                                    <span className='text-sm text-gray-600'>
                                      {t(
                                        'modules.pages.paymentPage.details.currentBalance',
                                      )}
                                    </span>
                                    <span className='text-sm text-gray-900'>
                                      {validationData.wallet_current_balance}{' '}
                                      {validationData.currency}
                                    </span>
                                  </div>
                                  <div className='flex justify-between items-center pt-2 border-t border-gray-100'>
                                    <span className='text-sm font-medium text-gray-900'>
                                      {t(
                                        'modules.pages.paymentPage.details.newBalance',
                                      )}
                                    </span>
                                    <span className='text-base font-bold text-gray-900'>
                                      {(
                                        validationData.wallet_current_balance +
                                        validationData.total_amount
                                      ).toFixed(2)}{' '}
                                      {validationData.currency}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className='border-t border-gray-100' />
                            </>
                          )}

                          {/* Agent */}
                          {validationData.agent?.name && (
                            <div className='flex justify-between items-center'>
                              <span className='text-sm text-gray-600'>
                                {t('modules.pages.paymentPage.details.agent')}
                              </span>
                              <span className='text-sm font-medium text-gray-900'>
                                {validationData.agent.name}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* <PaymentMethodSelector
                selectedProvider={selectedProvider}
                selectedMethod={selectedMethod}
                onProviderChange={setSelectedProvider}
                onMethodChange={setSelectedMethod}
                className="mb-6"
              /> */}
                  {/* Stripe Payment Form - Only render if Stripe is enabled */}
                  {stripePaymentForm}

                  {/* Other Payment Providers */}
                  {selectedProvider === 'paypal' && (
                    <div className='text-center p-8 border-2 border-dashed border-gray-300 rounded-lg'>
                      <p className='text-gray-600 mb-4'>
                        {t(
                          'modules.pages.paymentPage.providers.paypal.comingSoon',
                        )}
                      </p>
                      <Button disabled className='bg-gray-400'>
                        {t(
                          'modules.pages.paymentPage.providers.paypal.payButton',
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Worldpay Payment Form - Only render if Worldpay is enabled */}
                  {worldpayPaymentForm}

                  {/* Security Notice */}
                  <div className='text-center text-sm text-gray-500 border-t pt-4'>
                    <p>{t('modules.pages.paymentPage.security.message')}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
