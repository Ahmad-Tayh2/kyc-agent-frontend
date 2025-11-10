// import PaymentMethodSelector from "@/components/payment/PaymentMethodSelector";
import StripePaymentForm from "@/components/payment/StripePaymentForm";
import WorldpayPaymentForm from "@/components/payment/WorldpayPaymentForm";
import BrandingSection from "@/components/shared/BrandingSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useGetApisAndGateways } from "@/hooks/data/useApisAndGateways";
import { useGetTransferById } from "@/hooks/data/useTransfers";
import getStripe from "@/lib/stripe";
import type {
  PaymentData,
  PaymentMethod,
  PaymentProvider,
} from "@/types/payment";
import { Elements } from "@stripe/react-stripe-js";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Function to get Stripe promise only when needed to avoid conflicts with Worldpay
const getStripePromise = () => {
  return getStripe();
};
type ApiType = {
  name: string;
  is_active: boolean;
  id: number;
};
interface PaymentPageProps {
  defaultProvider?: PaymentProvider;
}

export default function PaymentPage({
  defaultProvider = "stripe",
}: PaymentPageProps) {
  const { transactionId, paymentLinkToken, token } = useParams<{
    transactionId?: string;
    paymentLinkToken?: string;
    token?: string; // New unified token parameter
  }>();
  const navigate = useNavigate();
  const {
    data: apisAndGatewaysResponse,
    // isLoading,
    // error,
  } = useGetApisAndGateways();
  function randomIntInRange(min: number, max: number): number {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw new Error("min and max must be integers for randomIntInRange");
    }
    if (min > max) {
      throw new Error("min must be <= max");
    }
    // Generate in [min, max]
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  useEffect(() => {
    const data =
      apisAndGatewaysResponse?.data?.filter((api: ApiType) => api?.is_active) ??
      [];
    if (data?.length) {
      const providerName = data?.[randomIntInRange(0, data?.length - 1)]?.name;
      if (providerName === "Stripe API") {
        setSelectedProvider("stripe");
      } else if (providerName === "Worldpay API") {
        setSelectedProvider("worldpay");
      }
    }
  }, [apisAndGatewaysResponse]);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "error"
  >("pending");
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedProvider, setSelectedProvider] =
    useState<PaymentProvider>(defaultProvider);
  const [selectedMethod /* setSelectedMethod*/] =
    useState<PaymentMethod | null>("card");

  // Token detection logic
  const [detectedTransactionId, setDetectedTransactionId] = useState<
    string | undefined
  >();
  const [detectedPaymentLinkToken, setDetectedPaymentLinkToken] = useState<
    string | undefined
  >();
  const [walletCurrencyId, setWalletCurrencyId] = useState<number | undefined>();
  const [walletAmount, setWalletAmount] = useState<number | undefined>();
  const [walletCurrencyCode, setWalletCurrencyCode] = useState<string | undefined>();

  useEffect(() => {
    if (token) {
      // Detect token type based on prefix
      if (token.startsWith("TR-")) {
        // Transaction reference
        setDetectedTransactionId(token);
        setDetectedPaymentLinkToken(undefined);
        setWalletCurrencyId(undefined);
        setWalletAmount(undefined);
        setWalletCurrencyCode(undefined);
      } else if (token.startsWith("add-")) {
        // Wallet top-up: extract walletCurrencyId from token
        const wcId = parseInt(token.replace("add-", ""));
        setWalletCurrencyId(wcId);

        // Get amount and currency from sessionStorage
        const addMoneyData = sessionStorage.getItem("addMoneyData");
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

  const { data: transferData } = useGetTransferById(
    detectedTransactionId ? parseInt(detectedTransactionId) : ""
  );

  // Payment info - uses wallet data if available, otherwise transfer data
  const paymentInfo = useMemo(() => ({
    amount: walletAmount || transferData?.data?.total_payable_amount || 0,
    currency: walletCurrencyCode || transferData?.data?.send_currency || "USD",
    description: walletCurrencyId
      ? `Add money to wallet - ${walletCurrencyCode}`
      : `Payment for transaction #${
          detectedTransactionId || detectedPaymentLinkToken
        }`,
  }), [walletAmount, walletCurrencyCode, walletCurrencyId, transferData, detectedTransactionId, detectedPaymentLinkToken]);

  useEffect(() => {
    // Only validate if we have processed the token detection
    const hasAnyToken = token || transactionId || paymentLinkToken;
    const hasDetectedValues =
      detectedTransactionId || detectedPaymentLinkToken || walletCurrencyId;

    if (hasAnyToken && !hasDetectedValues) {
      setErrorMessage("Invalid payment link. Unable to process payment token.");
      setPaymentStatus("error");
    } else if (!hasAnyToken) {
      setErrorMessage(
        "Invalid payment link. Missing transaction ID, payment link token, or wallet information."
      );
      setPaymentStatus("error");
    } else if (hasDetectedValues) {
      // Clear any previous errors when we have valid data
      if (paymentStatus === "error") {
        setPaymentStatus("pending");
        setErrorMessage("");
      }
    }
  }, [
    detectedTransactionId,
    detectedPaymentLinkToken,
    walletCurrencyId,
    token,
    transactionId,
    paymentLinkToken,
    paymentStatus,
  ]);

  const handlePaymentSuccess = (
    data: PaymentData | Record<string, unknown>
  ) => {
    // Handle both PaymentData and generic success data from iframe/lightbox
    let paymentData: PaymentData;

    if ("id" in data && "transaction_uuid" in data) {
      // It's a PaymentData object
      paymentData = data as PaymentData;
    } else {
      // It's generic data from iframe/lightbox, create a PaymentData object
      paymentData = {
        id: Date.now(), // Temporary ID
        transaction_uuid: (data.transaction_uuid as string) || "unknown",
        amount: paymentInfo.amount,
        currency: paymentInfo.currency,
        status: "completed",
        type: "payment",
        description: paymentInfo.description,
        provider: selectedProvider,
        provider_transaction_id:
          (data.order_code as string) || (data.orderKey as string) || "unknown",
        provider_payment_method: "card",
        processed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    // Redirect to success page with payment data
    const searchParams = new URLSearchParams({
      status: "success",
      orderCode: paymentData.provider_transaction_id,
      amount: paymentData.amount.toString(),
      currency: paymentData.currency,
      provider: paymentData.provider,
      transactionId: paymentData.transaction_uuid,
    });

    navigate(`/payment/success?${searchParams.toString()}`);
  };

  const handlePaymentError = (error: string) => {
    // Redirect to error page with error details
    const searchParams = new URLSearchParams({
      error: error,
      provider: selectedProvider,
      ...(detectedTransactionId && { transactionId: detectedTransactionId }),
      ...(detectedPaymentLinkToken && {
        paymentLinkToken: detectedPaymentLinkToken,
      }),
    });

    navigate(`/payment/failed?${searchParams.toString()}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleTryAgain = () => {
    setPaymentStatus("pending");
    setErrorMessage("");
    setPaymentData(null);
  };

  // Only initialize Stripe when it's the selected provider to avoid conflicts with Worldpay
  const stripePromise =
    selectedProvider === "stripe" ? getStripePromise() : null;

  // Clear any existing Stripe instances when switching to Worldpay
  useEffect(() => {
    if (selectedProvider === "worldpay") {
      // Clear any Stripe-related postMessage listeners that might interfere
    }
  }, [selectedProvider]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Header */}

        <div className="mb-8">
          <Button
            onClick={handleGoBack}
            variant="ghost"
            className="p-0 h-auto font-normal text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6 flex flex-col gap-5">
          <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>

          {/* Success State */}
          <BrandingSection
            description={
              <p className="text-gray-600 mt-2">
                Secure payment powered by{" "}
                {selectedProvider === "stripe"
                  ? "Stripe"
                  : selectedProvider === "worldpay"
                  ? "WorldPay"
                  : "our payment partners"}
              </p>
            }
          />
          {paymentStatus === "success" && paymentData && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Payment Successful!
                </h2>
                <p className="text-gray-600">
                  Your payment has been processed successfully.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium">
                    {paymentData.transaction_uuid}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">
                    {paymentData.amount} {paymentData.currency.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600 capitalize">
                    {paymentData.status}
                  </span>
                </div>
                {paymentData.description && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Description:</span>
                    <span className="font-medium">
                      {paymentData.description}
                    </span>
                  </div>
                )}
              </div>

              <Button
                onClick={handleGoBack}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Continue
              </Button>
            </div>
          )}
          {/* Error State */}
          {paymentStatus === "error" && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Payment Failed
                </h2>
                <p className="text-gray-600">
                  There was an issue processing your payment.
                </p>
              </div>

              {errorMessage && (
                <Alert className="border-red-200 bg-red-50 text-left">
                  <AlertDescription className="text-red-700">
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleTryAgain}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Try Again
                </Button>
                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  className="flex-1"
                >
                  Go Back
                </Button>
              </div>
            </div>
          )}
          {/* Payment Form State */}
          {paymentStatus === "pending" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Payment Details
                </h2>

                {/* Payment Summary */}
                <div className="bg-primary/10 border border-primary/50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-primary">
                      Amount Due:
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {paymentInfo.amount} {paymentInfo.currency.toUpperCase()}
                    </span>
                  </div>
                  {paymentInfo.description && (
                    <p className="text-sm">{paymentInfo.description}</p>
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
              {/* Stripe Payment Form */}
              {selectedProvider === "stripe" &&
                selectedMethod === "card" &&
                stripePromise && (
                  <Elements stripe={stripePromise}>
                    <StripePaymentForm
                      transactionId={detectedTransactionId} // Pass the detected transaction ID
                      paymentLinkToken={detectedPaymentLinkToken}
                      walletCurrencyId={walletCurrencyId}
                      amount={paymentInfo.amount}
                      currency={paymentInfo.currency}
                      description={paymentInfo.description}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </Elements>
                )}

              {/* Other Payment Providers */}
              {selectedProvider === "paypal" && (
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-600 mb-4">
                    PayPal integration coming soon
                  </p>
                  <Button disabled className="bg-gray-400">
                    Pay with PayPal
                  </Button>
                </div>
              )}

              {selectedProvider === "worldpay" && selectedMethod === "card" && (
                <WorldpayPaymentForm
                  transactionId={detectedTransactionId} // Pass the detected transaction ID
                  paymentLinkToken={detectedPaymentLinkToken}
                  walletCurrencyId={walletCurrencyId}
                  amount={walletAmount}
                  description={paymentInfo.description}
                  mode="iframe" // Iframe mode using official Worldpay library
                  onError={handlePaymentError}
                  onSuccess={handlePaymentSuccess}
                />
              )}

              {/* Security Notice */}
              <div className="text-center text-sm text-gray-500 border-t pt-4">
                <p>🔒 Your payment information is secure and encrypted</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
