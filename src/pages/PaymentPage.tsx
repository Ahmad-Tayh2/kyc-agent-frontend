import PaymentMethodSelector from "@/components/payment/PaymentMethodSelector";
import StripePaymentForm from "@/components/payment/StripePaymentForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useGetTransferById } from "@/hooks/data/useTransfers";
import getStripe from "@/lib/stripe";
import type {
  PaymentData,
  PaymentMethod,
  PaymentProvider,
} from "@/types/payment";
import { Elements } from "@stripe/react-stripe-js";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const stripePromise = getStripe();

export default function PaymentPage() {
  const { transactionId, paymentLinkToken } = useParams<{
    transactionId?: string;
    paymentLinkToken?: string;
  }>();
  const navigate = useNavigate();

  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "error"
  >("pending");
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedProvider, setSelectedProvider] =
    useState<PaymentProvider>("stripe");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const { data: transferData } = useGetTransferById(
    transactionId ? parseInt(transactionId) : ""
  );

  // Sample payment info - in real app, this would come from API
  const [paymentInfo] = useState({
    amount: transferData?.data?.payout_amount || 0,
    currency: transferData?.data?.send_currency || "USD",
    description: `Payment for transaction #${transactionId}`,
  });

  useEffect(() => {
    // Validate that we have either transactionId or paymentLinkToken
    if (!transactionId && !paymentLinkToken) {
      setErrorMessage(
        "Invalid payment link. Missing transaction ID or payment link token."
      );
      setPaymentStatus("error");
    }
  }, [transactionId, paymentLinkToken]);

  const handlePaymentSuccess = (data: PaymentData) => {
    setPaymentData(data);
    setPaymentStatus("success");
    setErrorMessage("");
  };

  const handlePaymentError = (error: string) => {
    setErrorMessage(error);
    setPaymentStatus("error");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleTryAgain = () => {
    setPaymentStatus("pending");
    setErrorMessage("");
    setPaymentData(null);
  };

  // Loading state while Stripe initializes
  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Payment system is not available</p>
          <Button onClick={handleGoBack} variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={handleGoBack}
            variant="ghost"
            className="mb-4 p-0 h-auto font-normal text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>
          <p className="text-gray-600 mt-2">Secure payment powered by Stripe</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          {/* Success State */}
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-blue-900">
                      Amount Due:
                    </span>
                    <span className="text-lg font-bold text-blue-900">
                      {paymentInfo.amount} {paymentInfo.currency.toUpperCase()}
                    </span>
                  </div>
                  {paymentInfo.description && (
                    <p className="text-sm text-blue-700">
                      {paymentInfo.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Method Selection */}
              <PaymentMethodSelector
                selectedProvider={selectedProvider}
                selectedMethod={selectedMethod}
                onProviderChange={setSelectedProvider}
                onMethodChange={setSelectedMethod}
                className="mb-6"
              />

              {/* Stripe Payment Form */}
              {selectedProvider === "stripe" && selectedMethod === "card" && (
                <Elements stripe={stripePromise}>
                  <StripePaymentForm
                    transactionId={
                      transactionId ? parseInt(transactionId) : undefined
                    }
                    paymentLinkToken={paymentLinkToken}
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

              {selectedProvider === "worldpay" && (
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-600 mb-4">
                    WorldPay integration coming soon
                  </p>
                  <Button disabled className="bg-gray-400">
                    Pay with WorldPay
                  </Button>
                </div>
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
