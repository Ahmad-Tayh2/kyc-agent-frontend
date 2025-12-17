import BrandingSection from "@/components/shared/BrandingSection";
import { Button } from "@/components/ui/button";
import { markPaymentProcessing, verifyPaymentStatus } from "@/services/worldpay";
import type { PaymentValidationData } from "@/types/payment";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<{
    orderCode: string | null;
    amount: string | null;
    currency: string | null;
    provider: string | null;
    transactionId: string | null;
  }>({
    orderCode: null,
    amount: null,
    currency: null,
    provider: null,
    transactionId: null,
  });
  const [validationData, setValidationData] = useState<PaymentValidationData | null>(null);

  useEffect(() => {
    const status = searchParams.get("status");
    const orderCode = searchParams.get("orderCode");
    const amount = searchParams.get("amount");
    const currency = searchParams.get("currency");
    const provider = searchParams.get("provider");
    const transactionId = searchParams.get("transactionId");

    if (status === "success" && orderCode) {
      setPaymentData({
        orderCode,
        amount,
        currency,
        provider,
        transactionId,
      });

      // Retrieve validation data from sessionStorage
      const storedValidationData = sessionStorage.getItem('paymentValidationData');
      if (storedValidationData) {
        try {
          const parsedData = JSON.parse(storedValidationData);
          setValidationData(parsedData);
        } catch (error) {
          console.error('Failed to parse validation data:', error);
        }
      }

      // Mark payment as processing (for Worldpay)
      const paymentId = localStorage.getItem("payment_id");
      if (provider === "worldpay" && paymentId) {
        markPaymentProcessing({
          payment_id: paymentId,
        })
          .then((result) => {
            console.log('Payment marked as processing:', result);
          })
          .catch((error) => {
            console.error('Failed to mark payment as processing:', error);
            // Don't block the success flow if this fails
          });
      }

      // Optional: Verify payment status with backend
      if (orderCode) {
        verifyPaymentStatus(orderCode)
          .then((result) => {
            if (result && result.status === "completed") {
              // Payment verified successfully
            }
          })
          .catch((_error) => {
            // Verification failed, but payment was already successful
          });
      }

      // Clean up stored data
      localStorage.removeItem("worldpay_order_code");
      localStorage.removeItem("payment_id");
      sessionStorage.removeItem("paymentValidationData");

      // Auto-redirect after 10 seconds
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 10000);

      return () => clearTimeout(timer);
    } else {
      // If no valid success parameters, redirect to error
      navigate("/payment/failed?error=invalid_success_params");
    }
  }, [searchParams, navigate]);

  const handleContinue = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center mb-6">
            <BrandingSection />
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 mt-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600">
              Your payment has been processed successfully.
            </p>
          </div>

          {/* Payment Summary */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {paymentData.amount}{' '}
                    <span className="text-2xl">
                      {paymentData.currency?.toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="px-6 py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order Code</span>
                <span className="font-mono font-medium text-gray-900">
                  {paymentData.orderCode}
                </span>
              </div>
              {paymentData.transactionId && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-mono text-gray-900">
                    {paymentData.transactionId}
                  </span>
                </div>
              )}
              {paymentData.provider && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Provider</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {paymentData.provider}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Validation Data Details */}
          {validationData && (
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">
                  Payment Details
                </h3>
              </div>

              <div className="px-6 py-4 space-y-4">
                {/* Transaction Reference */}
                {validationData.transaction_reference && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Transaction Reference</span>
                      <span className="font-mono font-medium text-gray-900">
                        {validationData.transaction_reference}
                      </span>
                    </div>
                    <div className="border-t border-gray-100" />
                  </>
                )}

                {/* Customer Information */}
                {validationData.type !== 'add_money' &&
                  'customer' in validationData && (
                    <>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-2">
                          Customer
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Name</span>
                            <span className="font-medium text-gray-900">
                              {validationData.customer.name}
                            </span>
                          </div>
                          {validationData.customer.email && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Email</span>
                              <span className="text-gray-900">
                                {validationData.customer.email}
                              </span>
                            </div>
                          )}
                          {validationData.customer.phone && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Phone</span>
                              <span className="text-gray-900">
                                {validationData.customer.phone}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="border-t border-gray-100" />
                    </>
                  )}

                {/* Single Recipient */}
                {validationData.type !== 'add_money' &&
                  'recipient' in validationData &&
                  validationData.recipient && (
                    <>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-2">
                          Recipient
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Name</span>
                            <span className="font-medium text-gray-900">
                              {validationData.recipient.name}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Phone</span>
                            <span className="text-gray-900">
                              {validationData.recipient.phone}
                            </span>
                          </div>
                          {(validationData.recipient.country ||
                            validationData.recipient.country_name) && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Country</span>
                              <span className="text-gray-900">
                                {validationData.recipient.country?.name ||
                                  validationData.recipient.country_name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="border-t border-gray-100" />
                    </>
                  )}

                {/* Multiple Recipients (Cart) */}
                {validationData.type === 'payment_link' &&
                  validationData.payment_link_type === 'remittance_cart' &&
                  'recipients' in validationData && (
                    <>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs font-medium text-gray-500">
                            Recipients
                          </p>
                          <span className="text-sm font-bold text-gray-900">
                            {validationData.recipients.length} Total
                          </span>
                        </div>
                        <div className="space-y-2">
                          {validationData.recipients
                            .slice(0, 5)
                            .map((recipient) => (
                              <div
                                key={recipient.id}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-gray-900">
                                  {recipient.name}
                                </span>
                                <span className="text-gray-600">
                                  {recipient.country_name ||
                                    recipient.country?.name}
                                </span>
                              </div>
                            ))}
                          {validationData.recipients.length > 5 && (
                            <p className="text-xs text-gray-500 italic">
                              +{validationData.recipients.length - 5} more
                              recipients
                            </p>
                          )}
                        </div>
                        {validationData.transactions_count && (
                          <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
                            <span className="text-sm text-gray-600">
                              Total Transactions
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {validationData.transactions_count}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="border-t border-gray-100" />
                    </>
                  )}

                {/* Transfer Route */}
                {validationData.type !== 'add_money' &&
                  'send_country' in validationData && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">From</p>
                          <p className="text-sm font-medium text-gray-900">
                            {validationData.send_country.name}
                          </p>
                        </div>
                        <div className="px-4">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 text-right">
                          <p className="text-xs text-gray-500 mb-1">To</p>
                          {'receive_country' in validationData &&
                          validationData.receive_country ? (
                            <p className="text-sm font-medium text-gray-900">
                              {validationData.receive_country.name}
                            </p>
                          ) : 'receive_countries' in validationData &&
                            validationData.receive_countries ? (
                            <p className="text-sm font-medium text-gray-900">
                              {validationData.receive_countries.length}{' '}
                              {validationData.receive_countries.length === 1
                                ? 'Country'
                                : 'Countries'}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div className="border-t border-gray-100" />
                    </>
                  )}

                {/* Wallet Info */}
                {validationData.type === 'add_money' && (
                  <>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2">
                        Wallet Top-up
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Previous Balance</span>
                          <span className="text-gray-900">
                            {validationData.wallet_current_balance}{' '}
                            {validationData.currency}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Amount Added</span>
                          <span className="font-medium text-green-600">
                            +{validationData.total_amount}{' '}
                            {validationData.currency}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <span className="text-sm font-medium text-gray-900">
                            New Balance
                          </span>
                          <span className="text-base font-bold text-gray-900">
                            {(
                              validationData.wallet_current_balance +
                              validationData.total_amount
                            ).toFixed(2)}{' '}
                            {validationData.currency}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-100" />
                  </>
                )}

                {/* Agent */}
                {validationData.agent?.name && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Processing Agent</span>
                    <span className="font-medium text-gray-900">
                      {validationData.agent.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <Button
            onClick={handleContinue}
            className="w-full bg-green-600 hover:bg-green-700 mb-4"
          >
            Continue to Dashboard
          </Button>
          <p className="text-xs text-gray-500 text-center">
            You will be redirected to dashboard automatically in a few
            seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
