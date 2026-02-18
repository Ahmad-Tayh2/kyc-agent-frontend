import CheckedIcon from '@/assets/icons/checked-icon.svg?react';
import {
  AlertCircle,
  // Wallet,
  // CreditCard,
  Copy,
  Link,
  Loader2,
  Plus,
  ShoppingCart,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { PAYMENT_LINKS_STATUSES_COLORS } from '@/constants/appConstants';
import { ROUTES } from '@/constants/routes';
import { copyToClipboard } from '@/helpers/text';
import {
  useCreatePaymentLink,
  useGetPaymentLinkByTransaction,
} from '@/hooks/data/usePaymentLinks';
import { useAddTransactionToCart } from '@/hooks/data/useRemittanceCarts';
import {
  useCanPayTransaction,
  usePayTransaction,
} from '@/hooks/data/useWallet';
import { useSummaryData } from '@/hooks/useSummaryData';
import { useSendRemittanceStore } from '@/store/sendRemittanceStore';
import StatusLabel from '../shared/StatusLabel';
import SummaryCard from './SummaryCard';
interface PayStepProps {
  transferId?: string;
  transferRef?: string;
}
const PayStep = (props: PayStepProps) => {
  const { transferId, transferRef } = props;
  const navigate = useNavigate();
  // const [paymentMethod, setPaymentMethod] = useState<string>('customer');
  const stepFour = useSendRemittanceStore((state) => state.data.stepFour);
  const setPaymentLink = useSendRemittanceStore(
    (state) => state.setPaymentLink,
  );
  const setPaymentLinkByTransaction = useSendRemittanceStore(
    (state) => state.setPaymentLinkByTransaction,
  );
  const setCartAddedTo = useSendRemittanceStore(
    (state) => state.setCartAddedTo,
  );

  // Get computed summary data from centralized hook
  const summaryData = useSummaryData();
  const stepTwo = useSendRemittanceStore((state) => state.data.stepTwo);

  // Get total payable amount with currency code from store
  const totalAmount = summaryData.totalPayableAmount
    ? `${summaryData.totalPayableAmount.toFixed(2)} ${
        stepTwo.sendCurrency?.code || ''
      }`
    : '0.00';
  const { mutateAsync: createPaymentLink } = useCreatePaymentLink();

  const { data: paymentLinkByTrResponse } = useGetPaymentLinkByTransaction(
    transferId!,
  );
  const paymentLinkByTransactionString = useMemo(() => {
    if (paymentLinkByTrResponse?.data?.[0]?.token) {
      setPaymentLinkByTransaction(paymentLinkByTrResponse?.data?.[0]);
      const link =
        window.location.origin +
        ROUTES.PAYMENT_LINKS.VALIDATION(
          paymentLinkByTrResponse?.data?.[0]?.token,
        );
      return link;
    }
    return '';
    // return paymentLinkByTrResponse?.data?.[0]?.token || "";
  }, [paymentLinkByTrResponse]);

  // Auto-select remittance cart section if transaction is already in a cart
  useEffect(() => {
    if (stepFour?.remittance_cart?.id) {
      setSelectedPaymentSection('remittance_cart');
    }
  }, [stepFour?.remittance_cart]);

  const { mutateAsync: addTransationToCart } = useAddTransactionToCart();
  const handleAddToRemittanceCart = async () => {
    const addingTransactionToCartResponse: any = await addTransationToCart({
      transaction_id: Number(transferId),
    });
    // The response should contain the remittance_cart object
    if (addingTransactionToCartResponse?.data) {
      setCartAddedTo(addingTransactionToCartResponse.data);
    }
  };
  const handleSendPaymentLink = async () => {
    const response = await createPaymentLink({
      payable_type: stepFour?.remittance_cart?.id
        ? 'RemittanceCart'
        : 'Transaction',
      payable_id: stepFour?.remittance_cart?.id
        ? stepFour?.remittance_cart?.id
        : Number(transferId),
    });

    setPaymentLink(response?.data);
  };

  const handleCopyPaymentLink = () => {
    if (paymentLinkByTransactionString) {
      copyToClipboard(
        paymentLinkByTransactionString,
        'Payment link copied to clipboard!',
      );
    }
  };

  // Main payment section selection - radio buttons
  const [selectedPaymentSection, setSelectedPaymentSection] = useState<
    'remittance_cart' | 'payment_link' | 'pay_on_behalf'
  >('payment_link');

  // Sub-selection for pay on behalf (wallet vs credit card)
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('');

  // Payment success modal state
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  // Payment confirmation modal state
  const [showPaymentConfirmModal, setShowPaymentConfirmModal] = useState(false);

  // Wallet payment hooks - check when pay_on_behalf section is selected
  // This ensures we fetch wallet balance as soon as user selects this payment section
  const shouldCheckCanPay =
    !!transferRef && selectedPaymentSection === 'pay_on_behalf';

  const { data: canPayData, isLoading: isCheckingCanPay } =
    useCanPayTransaction(shouldCheckCanPay ? transferRef! : '');

  const { mutateAsync: payTransaction, isPending: isPayingTransaction } =
    usePayTransaction();

  const canPay = canPayData?.can_pay ?? false;
  const walletBalance = canPayData?.wallet_balance ?? 0;
  const walletCurrency = canPayData?.currency ?? stepTwo.sendCurrency?.code;

  const handlePayOnBehalfClick = async () => {
    if (selectedPaymentMethod === 'credit-card') {
      if (transferRef) {
        const url =
          window.location.origin + ROUTES.PAYMENT_LINKS.VALIDATION(transferRef);
        window.location.href = url;
      }
    } else if (selectedPaymentMethod === 'wallet') {
      // Show confirmation modal first
      setShowPaymentConfirmModal(true);
    }
  };

  const handleConfirmWalletPayment = async () => {
    setShowPaymentConfirmModal(false);

    try {
      const result = await payTransaction({
        transactionReference: transferRef!,
      });

      // Since handleApiResponse returns just the data field, result is the inner data object
      if (result) {
        setPaymentResult(result);
        setShowPaymentSuccessModal(true);
        toast.success('Payment successful!');
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Payment failed:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Payment failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleAddMoneyClick = () => {
    navigate(ROUTES.ADD_MONEY);
  };

  const handlePaymentSuccessClose = () => {
    setShowPaymentSuccessModal(false);
    navigate(ROUTES.TRANSFERS.LIST);
  };
  return (
    <div className='p-4 sm:p-6 space-y-6'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Main Content - Left Side */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Total Amount Banner */}
          <div className='bg-[#E8F5F5] rounded-lg p-4 sm:p-6 flex justify-between items-center'>
            <h4 className='text-lg font-bold text-gray-900'>
              Total amount to pay:{' '}
              <span className='text-teal-600'>{totalAmount}</span>
            </h4>
          </div>

          {/* Payment Method Section */}
          <div className='bg-white rounded-lg border p-2 sm:p-6 space-y-6'>
            <div className='flex flex-col space-y-3'>
              <div className='flex items-center space-x-2'>
                <h4 className='text-lg font-semibold text-gray-900'>
                  Payment Method
                </h4>
              </div>
              <div className='bg-orange-50 border-2 border-orange-300 rounded-lg p-3 flex items-start space-x-2'>
                <AlertCircle className='w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5' />
                <p className='text-sm font-semibold text-orange-800'>
                  Important: Payment method is final once started and cannot be
                  changed later
                </p>
              </div>
            </div>

            {/* Multiple Transfers Option - Remittance Cart */}
            <div
              className={`relative space-y-4 p-4 rounded-lg border transition-all cursor-pointer ${
                selectedPaymentSection === 'remittance_cart'
                  ? 'border-teal-500 bg-teal-50/30 shadow-sm'
                  : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPaymentSection('remittance_cart')}
            >
              <div className='flex items-start space-x-3 overflow-auto'>
                <div className='relative flex items-center mt-1'>
                  <input
                    type='radio'
                    id='remittance-cart-section'
                    name='payment-section'
                    value='remittance_cart'
                    checked={selectedPaymentSection === 'remittance_cart'}
                    onChange={() =>
                      setSelectedPaymentSection('remittance_cart')
                    }
                    className='peer sr-only'
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedPaymentSection === 'remittance_cart'
                        ? 'border-teal-500 bg-teal-500'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {selectedPaymentSection === 'remittance_cart' && (
                      <div className='w-2 h-2 rounded-full bg-white' />
                    )}
                  </div>
                </div>
                <div className='flex-1 space-y-4'>
                  <label
                    htmlFor='remittance-cart-section'
                    className='cursor-pointer block'
                  >
                    <h4 className='font-medium text-gray-900'>
                      Do you need to create multiple transfers for the same
                      customer today?
                    </h4>
                    <p className='text-sm text-gray-600 mt-1'>
                      Then, add it to the "remittance cart" and ask the customer
                      to pay once
                    </p>
                  </label>

                  {selectedPaymentSection === 'remittance_cart' && (
                    <>
                      {!stepFour?.remittance_cart?.id && (
                        <div className='bg-orange-50 border border-orange-200 rounded-lg p-2 flex items-start space-x-2 w-fit '>
                          <p className='text-sm text-orange-700 inline-flex '>
                            <span>
                              <AlertCircle className='w-4 h-4 text-orange-500 mr-1' />
                            </span>
                            this option will deactivate any payment link that
                            was created for this transfer.
                          </p>
                        </div>
                      )}

                      {stepFour?.remittance_cart?.id ? (
                        <div className='space-y-3'>
                          <div className='flex items-center space-x-2'>
                            <CheckedIcon className='w-5 h-5 text-green-600' />
                            <span className='font-medium text-green-600'>
                              This transaction is in the remittance cart
                            </span>
                          </div>

                          {stepFour?.remittance_cart?.payment_link?.token ? (
                            <div className='space-y-2'>
                              <p className='text-sm text-gray-600'>
                                Payment link for this cart:
                              </p>
                              <div className='flex items-center space-x-4'>
                                <Button
                                  variant='link'
                                  className='p-0 h-auto text-sm cursor-pointer'
                                  onClick={() => {
                                    const link =
                                      window.location.origin +
                                      ROUTES.PAYMENT_LINKS.VALIDATION(
                                        stepFour.remittance_cart!.payment_link!
                                          .token,
                                      );
                                    copyToClipboard(
                                      link,
                                      'Cart payment link copied to clipboard!',
                                    );
                                  }}
                                >
                                  {window.location.origin +
                                    ROUTES.PAYMENT_LINKS.VALIDATION(
                                      stepFour.remittance_cart.payment_link
                                        .token,
                                    )}
                                  <Copy className='w-4 h-4 ml-2' />
                                </Button>
                                {stepFour.remittance_cart.payment_link
                                  .status && (
                                  <StatusLabel
                                    value={
                                      stepFour.remittance_cart.payment_link
                                        .status
                                    }
                                    color={
                                      PAYMENT_LINKS_STATUSES_COLORS[
                                        stepFour.remittance_cart.payment_link
                                          .status as keyof typeof PAYMENT_LINKS_STATUSES_COLORS
                                      ] || '#000000'
                                    }
                                  />
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className='space-y-2'>
                              <p className='text-sm text-gray-600'>
                                Manage all cart transactions:
                              </p>
                              <Button
                                variant='outline'
                                className='border-teal-500 text-teal-600 hover:bg-teal-50'
                                onClick={() => navigate(ROUTES.REMITTANCE_CART)}
                              >
                                <ShoppingCart className='w-4 h-4 mr-2' />
                                GO TO REMITTANCE CART
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Button
                          variant='outline'
                          className='border-teal-500 text-teal-600 hover:bg-teal-50'
                          onClick={handleAddToRemittanceCart}
                        >
                          <ShoppingCart className='w-4 h-4 mr-2' />
                          ADD TO REMITTANCE CART
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <hr className='my-3' />

            {/* Customer Payment Section - Payment Link */}
            <div
              className={`relative space-y-4 p-4 rounded-lg border transition-all cursor-pointer overflow-auto ${
                selectedPaymentSection === 'payment_link'
                  ? 'border-teal-500 bg-teal-50/30 shadow-sm'
                  : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPaymentSection('payment_link')}
            >
              <div className='flex items-start space-x-3'>
                <div className='relative flex items-center mt-1'>
                  <input
                    type='radio'
                    id='payment-link-section'
                    name='payment-section'
                    value='payment_link'
                    checked={selectedPaymentSection === 'payment_link'}
                    onChange={() => setSelectedPaymentSection('payment_link')}
                    className='peer sr-only'
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedPaymentSection === 'payment_link'
                        ? 'border-teal-500 bg-teal-500'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {selectedPaymentSection === 'payment_link' && (
                      <div className='w-2 h-2 rounded-full bg-white' />
                    )}
                  </div>
                </div>
                <div className='flex-1 space-y-4'>
                  <label
                    htmlFor='payment-link-section'
                    className='cursor-pointer block'
                  >
                    <h4 className='font-medium text-gray-900'>
                      Customer will pay for this transfer
                    </h4>
                    <p className='text-sm text-gray-600 mt-1'>
                      We will send the payment link to selected customer email
                      and WhatsApp
                    </p>
                  </label>

                  {selectedPaymentSection === 'payment_link' && (
                    <>
                      <div className='bg-orange-50 border border-orange-200 rounded-lg p-2 flex items-start space-x-2 w-fit '>
                        <p className='text-sm text-orange-700 inline-flex '>
                          <span>
                            <AlertCircle className='w-4 h-4 text-orange-500 mr-1' />
                          </span>
                          If this transfer was added to the remittance cart,
                          sending a payment link will remove this transfer from
                          the Cart.
                        </p>
                      </div>

                      <div className='flex items-center space-x-4'>
                        {stepFour?.paymentLinkByTransaction &&
                        typeof stepFour?.paymentLinkByTransaction ===
                          'object' &&
                        stepFour?.paymentLinkByTransaction?.token &&
                        stepFour?.paymentLinkByTransaction?.status !==
                          'expired_link' ? (
                          <div className='flex items-center space-x-4'>
                            <Button
                              variant='link'
                              className='p-0 h-auto text-sm cursor-pointer'
                              onClick={handleCopyPaymentLink}
                            >
                              {paymentLinkByTransactionString?.slice(0, 80)}
                              {paymentLinkByTransactionString?.length > 80 &&
                                '...'}
                              {paymentLinkByTransactionString && (
                                <Copy className='w-4 h-4' />
                              )}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant='outline'
                            className='border-teal-500 text-teal-600 hover:bg-teal-50'
                            onClick={handleSendPaymentLink}
                          >
                            <Link className='w-4 h-4 mr-2' />
                            SEND PAYMENT LINK
                          </Button>
                        )}
                        {typeof stepFour?.paymentLinkByTransaction ===
                          'object' &&
                          stepFour?.paymentLinkByTransaction?.status && (
                            <StatusLabel
                              value={stepFour?.paymentLinkByTransaction?.status}
                              color={
                                PAYMENT_LINKS_STATUSES_COLORS[
                                  stepFour?.paymentLinkByTransaction
                                    ?.status as keyof typeof PAYMENT_LINKS_STATUSES_COLORS
                                ] || '#000000'
                              }
                            />
                          )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <hr className='my-3' />

            {/* Agent Payment Section - Pay on Behalf */}
            <div
              className={`relative space-y-4 p-4 rounded-lg border transition-all cursor-pointer overflow-auto ${
                selectedPaymentSection === 'pay_on_behalf'
                  ? 'border-teal-500 bg-teal-50/30 shadow-sm'
                  : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPaymentSection('pay_on_behalf')}
            >
              <div className='flex items-start space-x-3'>
                <div className='relative flex items-center mt-1'>
                  <input
                    type='radio'
                    id='pay-on-behalf-section'
                    name='payment-section'
                    value='pay_on_behalf'
                    checked={selectedPaymentSection === 'pay_on_behalf'}
                    onChange={() => setSelectedPaymentSection('pay_on_behalf')}
                    className='peer sr-only'
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedPaymentSection === 'pay_on_behalf'
                        ? 'border-teal-500 bg-teal-500'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {selectedPaymentSection === 'pay_on_behalf' && (
                      <div className='w-2 h-2 rounded-full bg-white' />
                    )}
                  </div>
                </div>
                <div className='flex-1 space-y-4'>
                  <label
                    htmlFor='pay-on-behalf-section'
                    className='cursor-pointer'
                  >
                    <h4 className='font-medium text-gray-900'>
                      You will pay for the transfer and then ask the customer
                      for payment
                    </h4>
                    <p className='text-sm text-gray-600 mt-1'>
                      You can send a payment link to the customer later, or you
                      can take the amount in cash but then you need to manually
                      update the transfer payment status.
                    </p>
                  </label>

                  {selectedPaymentSection === 'pay_on_behalf' && (
                    <>
                      <div className='bg-orange-50 border border-orange-200 rounded-lg p-2 flex items-start space-x-2 w-fit '>
                        <p className='text-sm text-orange-700 inline-flex '>
                          <span>
                            <AlertCircle className='w-4 h-4 text-orange-500 mr-1' />
                          </span>
                          By choosing this payment method, the transfer will be
                          removed from the Remittance Cart if it was added in a
                          Cart, and all payment links will be deactivated
                        </p>
                      </div>

                      {/* Payment Method Selection */}
                      <div className='space-y-3'>
                        <div className='flex items-center space-x-3'>
                          <input
                            type='radio'
                            id='wallet-balance'
                            name='agent-payment-method'
                            value='wallet'
                            checked={selectedPaymentMethod === 'wallet'}
                            className='w-4 h-4 text-teal-600'
                            onChange={() => setSelectedPaymentMethod('wallet')}
                          />
                          <label
                            htmlFor='wallet-balance'
                            className='text-gray-900 cursor-pointer'
                          >
                            From Wallet Balance
                          </label>
                        </div>

                        {/* Show wallet details only when wallet is selected */}
                        {selectedPaymentMethod === 'wallet' && (
                          <div className='ml-7 space-y-2'>
                            {isCheckingCanPay ? (
                              <div className='inline-flex items-center text-gray-600'>
                                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                                Loading wallet balance...
                              </div>
                            ) : (
                              <div className='bg-gray-50 rounded-lg p-3 space-y-2'>
                                <div className='flex justify-between items-center'>
                                  <span className='text-sm text-gray-600'>
                                    Current Balance:
                                  </span>
                                  <span className='font-semibold text-gray-900'>
                                    {walletBalance.toFixed(2)} {walletCurrency}
                                  </span>
                                </div>
                                {canPayData && (
                                  <>
                                    <div className='flex justify-between items-center'>
                                      <span className='text-sm text-gray-600'>
                                        Required Amount:
                                      </span>
                                      <span className='font-medium text-gray-900'>
                                        {canPayData.required_amount.toFixed(2)}{' '}
                                        {walletCurrency}
                                      </span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                      <span className='text-sm text-gray-600'>
                                        Balance After Payment:
                                      </span>
                                      <span className='font-medium text-teal-600'>
                                        {canPayData.balance_after_payment.toFixed(
                                          2,
                                        )}{' '}
                                        {walletCurrency}
                                      </span>
                                    </div>
                                  </>
                                )}
                                <div className='flex justify-end pt-2'>
                                  <Button
                                    variant='link'
                                    className='text-teal-600 hover:text-teal-700 p-0 h-auto text-sm'
                                    onClick={handleAddMoneyClick}
                                  >
                                    <Plus className='w-4 h-4 border border-teal-500 rounded-full mr-1' />
                                    ADD BALANCE
                                  </Button>
                                </div>
                              </div>
                            )}

                            {!isCheckingCanPay && !canPay && (
                              <div className='bg-red-50 border border-red-200 rounded-lg p-2 flex items-start space-x-2'>
                                <AlertCircle className='w-4 h-4 text-red-500 flex-shrink-0 mt-0.5' />
                                <p className='text-sm text-red-700'>
                                  Insufficient wallet balance. Please add money
                                  to your wallet to proceed.
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        <div className='flex items-center space-x-3'>
                          <input
                            type='radio'
                            id='credit-card'
                            name='agent-payment-method'
                            value='credit-card'
                            checked={selectedPaymentMethod === 'credit-card'}
                            className='w-4 h-4 text-teal-600'
                            onChange={() =>
                              setSelectedPaymentMethod('credit-card')
                            }
                          />
                          <label
                            htmlFor='credit-card'
                            className='text-gray-900 cursor-pointer'
                          >
                            Credit Card
                          </label>
                        </div>
                      </div>

                      <hr className='my-3' />

                      <Button
                        variant='outline'
                        className='border-teal-500 text-teal-600 hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed'
                        onClick={handlePayOnBehalfClick}
                        disabled={
                          !selectedPaymentMethod ||
                          (selectedPaymentMethod === 'wallet' &&
                            (!canPay || isCheckingCanPay)) ||
                          (selectedPaymentMethod === 'credit-card' &&
                            !transferRef) ||
                          isPayingTransaction
                        }
                      >
                        {isPayingTransaction ? (
                          <>
                            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                            Processing Payment...
                          </>
                        ) : (
                          'PAY ON BEHALF OF CUSTOMER'
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Summary Card - Right Side */}
        <div className='lg:col-span-1'>
          <SummaryCard data={summaryData} />
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      <AlertDialog
        open={showPaymentConfirmModal}
        onOpenChange={setShowPaymentConfirmModal}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className='space-y-3'>
                <p>
                  Are you sure you want to proceed with this payment from your
                  wallet?
                </p>
                {canPayData && (
                  <div className='bg-gray-50 rounded-lg p-4 space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>
                        Transaction Reference:
                      </span>
                      <span className='font-medium'>
                        {canPayData.transaction_reference}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Amount to Pay:</span>
                      <span className='font-medium text-red-600'>
                        {canPayData.required_amount.toFixed(2)}{' '}
                        {canPayData.currency}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>
                        Current Wallet Balance:
                      </span>
                      <span className='font-medium'>
                        {canPayData.wallet_balance.toFixed(2)}{' '}
                        {canPayData.currency}
                      </span>
                    </div>
                    <div className='flex justify-between border-t pt-2 mt-2'>
                      <span className='text-gray-600 font-semibold'>
                        Balance After Payment:
                      </span>
                      <span className='font-semibold text-teal-600'>
                        {canPayData.balance_after_payment.toFixed(2)}{' '}
                        {canPayData.currency}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowPaymentConfirmModal(false)}
              disabled={isPayingTransaction}
            >
              Cancel
            </Button>
            <AlertDialogAction
              onClick={handleConfirmWalletPayment}
              disabled={isPayingTransaction}
              className='bg-teal-600 hover:bg-teal-700'
            >
              {isPayingTransaction ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Processing...
                </>
              ) : (
                'Confirm Payment'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Payment Success Modal */}
      <AlertDialog
        open={showPaymentSuccessModal}
        onOpenChange={setShowPaymentSuccessModal}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-green-600'>
              Payment Successful!
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className='space-y-3'>
                <p>Your payment has been processed successfully.</p>
                {paymentResult && (
                  <div className='bg-gray-50 rounded-lg p-4 space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>
                        Transaction Reference:
                      </span>
                      <span className='font-medium'>
                        {paymentResult.transaction_reference}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Amount Paid:</span>
                      <span className='font-medium'>
                        {paymentResult.amount} {paymentResult.currency}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>
                        Wallet Balance Before:
                      </span>
                      <span className='font-medium'>
                        {paymentResult.wallet_balance_before}{' '}
                        {paymentResult.currency}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>
                        Wallet Balance After:
                      </span>
                      <span className='font-medium text-teal-600'>
                        {paymentResult.wallet_balance_after}{' '}
                        {paymentResult.currency}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>
                        Deduction Reference:
                      </span>
                      <span className='font-medium text-xs'>
                        {paymentResult.deduction_reference}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={handlePaymentSuccessClose}
              className='bg-teal-600 hover:bg-teal-700'
            >
              Done
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PayStep;
