import CheckedIcon from '@/assets/icons/checked-icon.svg?react';
import {
  AlertCircle,
  // Wallet,
  // CreditCard,
  Copy,
  Info,
  Link,
  Plus,
  ShoppingCart,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { PAYMENT_LINKS_STATUSES_COLORS } from '@/constants/appConstants';
import { ROUTES } from '@/constants/routes';
import { copyToClipboard } from '@/helpers/text';
import {
  useCreatePaymentLink,
  useGetPaymentLinkByCart,
  useGetPaymentLinkByTransaction,
} from '@/hooks/data/usePaymentLinks';
import {
  useAddTransactionToCart,
  useCreateRemittanceCart,
  useGetRemittanceCarts,
} from '@/hooks/data/useRemittanceCarts';
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
  // const [paymentMethod, setPaymentMethod] = useState<string>('customer');
  const stepOne = useSendRemittanceStore((state) => state.data.stepOne);
  const stepFour = useSendRemittanceStore((state) => state.data.stepFour);
  const setPaymentLink = useSendRemittanceStore(
    (state) => state.setPaymentLink
  );
  const setPaymentLinkByTransaction = useSendRemittanceStore(
    (state) => state.setPaymentLinkByTransaction
  );
  const setCartAddedTo = useSendRemittanceStore(
    (state) => state.setCartAddedTo
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
  const { mutateAsync: createRemittanceCart } = useCreateRemittanceCart();
  const { data: remittanceCartsResponse } = useGetRemittanceCarts(
    `?customer_id=${stepOne?.customer?.id}&currency=USD`
  );

  const { data: paymentLinkByCartResponse } = useGetPaymentLinkByCart(
    stepFour?.remittance_cart_id!
  );
  const { data: paymentLinkByTrResponse } = useGetPaymentLinkByTransaction(
    transferId!
  );
  const paymentLinkByTransactionString = useMemo(() => {
    if (paymentLinkByTrResponse?.data?.[0]?.token) {
      setPaymentLinkByTransaction(paymentLinkByTrResponse?.data?.[0]);
      const link =
        window.location.origin +
        ROUTES.PAYMENT_LINKS.VALIDATION(
          paymentLinkByTrResponse?.data?.[0]?.token
        );
      return link;
    }
    return '';
    // return paymentLinkByTrResponse?.data?.[0]?.token || "";
  }, [paymentLinkByTrResponse]);

  useEffect(() => {
    if (paymentLinkByCartResponse?.data?.length) {
      setPaymentLink(paymentLinkByCartResponse?.data?.[0]);
    }
  }, [paymentLinkByCartResponse]);
  const existedRemittanceCart = useMemo(() => {
    return remittanceCartsResponse?.data?.data?.[0] ?? null;
  }, [remittanceCartsResponse]);
  const { mutateAsync: addTransationToCart } = useAddTransactionToCart();
  const handleAddToRemittanceCart = async () => {
    let cartId = existedRemittanceCart?.id ?? null;
    if (!cartId) {
      //create a cart
      const createResponse = await createRemittanceCart({
        customer_id: stepOne?.customer?.id,
        currency: 'USD',
      });
      cartId = createResponse?.data?.id ?? null;
    }
    if (cartId) {
      const addingTransactionToCartResponse: any = await addTransationToCart({
        cartId,
        transaction_id: Number(transferId),
      });
      setCartAddedTo(addingTransactionToCartResponse?.data?.id);
    }
  };
  // remittance_cart_id
  const handleSendPaymentLink = async () => {
    const response = await createPaymentLink({
      payable_type: stepFour?.remittance_cart_id
        ? 'RemittanceCart'
        : 'Transaction',
      payable_id: stepFour?.remittance_cart_id
        ? stepFour?.remittance_cart_id
        : Number(transferId),
    });

    setPaymentLink(response?.data);
  };

  const handleCopyPaymentLink = () => {
    if (paymentLinkByTransactionString) {
      copyToClipboard(
        paymentLinkByTransactionString,
        'Payment link copied to clipboard!'
      );
    }
  };

  // Main payment section selection - radio buttons
  const [selectedPaymentSection, setSelectedPaymentSection] = useState<
    'remittance_cart' | 'payment_link' | 'pay_on_behalf'
  >('payment_link');

  // Sub-selection for pay on behalf (wallet vs credit card)
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('wallet');

  const handlePayOnBehalfClick = () => {
    if (selectedPaymentMethod === 'credit-card') {
      if (transferRef) {
        const url =
          window.location.origin + ROUTES.PAYMENT_LINKS.VALIDATION(transferRef);
        window.location.href = url;
      }
    }

    // ... handle other cases or proceed normally
  };
  return (
    <div className='p-6 space-y-6'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Main Content - Left Side */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Total Amount Banner */}
          <div className='bg-[#E8F5F5] rounded-lg p-6 flex justify-between items-center'>
            <h4 className='text-lg font-bold text-gray-900'>
              Total amount to pay:{' '}
              <span className='text-teal-600'>{totalAmount}</span>
            </h4>
          </div>

          {/* Payment Method Section */}
          <div className='bg-white rounded-lg border p-6 space-y-6'>
            <div className='flex flex-col'>
              <div className='flex items-center space-x-2'>
                <h4 className='text-lg font-semibold text-gray-900'>
                  Payment Method
                </h4>
              </div>
              <p className='text-sm text-gray-600 flex items-center mt-1'>
                <Info className='w-4 h-4 mr-2' />
                Only single payment method should be used
              </p>
            </div>

            <hr className='my-3' />

            {/* Multiple Transfers Option - Remittance Cart */}
            <div
              className={`relative space-y-4 p-4 rounded-lg border transition-all cursor-pointer ${
                selectedPaymentSection === 'remittance_cart'
                  ? 'border-teal-500 bg-teal-50/30 shadow-sm'
                  : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPaymentSection('remittance_cart')}
            >
              <div className='flex items-start space-x-3'>
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
                      <div className='bg-orange-50 border border-orange-200 rounded-lg p-2 flex items-start space-x-2 w-fit '>
                        <p className='text-sm text-orange-700 inline-flex '>
                          <span>
                            <AlertCircle className='w-4 h-4 text-orange-500 mr-1' />
                          </span>
                          this option will deactivate any payment link that was
                          created for this transfer.
                        </p>
                      </div>

                      {stepFour?.remittance_cart_id ? (
                        <Button
                          variant='outline'
                          className='border-green-500 text-green-600 hover:text-green-600 cursor-default hover:bg-white'
                        >
                          <CheckedIcon />
                          ADDED TO REMITTANCE CART
                        </Button>
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
              className={`relative space-y-4 p-4 rounded-lg border transition-all cursor-pointer ${
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
              className={`relative space-y-4 p-4 rounded-lg border transition-all cursor-pointer ${
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
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-3'>
                            <input
                              type='radio'
                              id='wallet-balance'
                              name='agent-payment-method'
                              value='wallet'
                              className='w-4 h-4 text-teal-600'
                              onChange={() =>
                                setSelectedPaymentMethod('wallet')
                              }
                            />
                            <label
                              htmlFor='wallet-balance'
                              className='text-gray-900'
                            >
                              From Wallet Balance (1200.00 USD)
                            </label>
                          </div>
                          <Button
                            variant='link'
                            className='text-teal-600 hover:text-teal-700 p-0 h-auto text-sm cursor-pointer'
                          >
                            <Plus className='w-4 h-4 border border-teal-500 rounded-full' />
                            ADD BALANCE
                          </Button>
                        </div>

                        <div className='flex items-center space-x-3'>
                          <input
                            type='radio'
                            id='credit-card'
                            name='agent-payment-method'
                            value='credit-card'
                            className='w-4 h-4 text-teal-600'
                            onChange={() =>
                              setSelectedPaymentMethod('credit-card')
                            }
                          />
                          <label
                            htmlFor='credit-card'
                            className='text-gray-900'
                          >
                            Credit Card
                          </label>
                        </div>
                      </div>

                      <hr className='my-3' />

                      <Button
                        variant='outline'
                        className='border-teal-500 text-teal-600 hover:bg-teal-50'
                        onClick={handlePayOnBehalfClick}
                        disabled={selectedPaymentMethod !== 'credit-card'}
                      >
                        PAY ON BEHALF OF CUSTOMER
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
    </div>
  );
};

export default PayStep;
