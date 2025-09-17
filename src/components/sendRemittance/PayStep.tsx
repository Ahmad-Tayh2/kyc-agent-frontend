import { useMemo } from "react";
import {
  Info,
  AlertCircle,
  ShoppingCart,
  Link,
  // Wallet,
  // CreditCard,
  Copy,
  Plus,
} from "lucide-react";
import CheckedIcon from "@/assets/icons/checked-icon.svg?react";

import SummaryCard, { type SummaryData } from "./SummaryCard";
import { Button } from "@/components/ui/button";
import { useSendRemittanceStore } from "@/store/sendRemittanceStore";
import { useCreatePaymentLink } from "@/hooks/data/usePaymentLinks";
import { copyToClipboard } from "@/helpers/text";
import {
  useAddTransactionToCart,
  useGetRemittanceCarts,
  useCreateRemittanceCart,
} from "@/hooks/data/useRemittanceCarts";
import { ROUTES } from "@/constants/routes";
interface PayStepProps {
  transferId?: number | string;
}
const PayStep = (props: PayStepProps) => {
  const { transferId } = props;
  // const [paymentMethod, setPaymentMethod] = useState<string>('customer');

  // Mock data - should come from previous steps
  // const summaryData = {
  //   sendingCustomer: "John Doe",
  //   sendingCountryIso: "USA",
  //   recipient: "Mohammad Imran",
  //   recipientCountryIso: "USA",
  //   remittanceMethod: "Cash Pickup",
  //   sendingCountry: "USA",
  //   receivingCountry: "Europe",
  //   sendingAmount: "500.00 USD",
  //   exchangeRate: "1 USD = 0.95 EUR",
  //   feesAndCharges: "10.00 USD",
  //   recipientGets: "476.00 EUR",
  //   totalPayableAmount: "511.00 USD",
  // };
  const stepOne = useSendRemittanceStore((state) => state.data.stepOne);
  const stepTwo = useSendRemittanceStore((state) => state.data.stepTwo);
  const stepFour = useSendRemittanceStore((state) => state.data.stepFour);
  const setPaymentLink = useSendRemittanceStore(
    (state) => state.setPaymentLink
  );
  const setCartAddedTo = useSendRemittanceStore(
    (state) => state.setCartAddedTo
  );
  const customer = { ...stepOne?.customer };
  const summaryData: SummaryData = {
    sendingCustomer: customer?.fullName,
    sendingCountryIso: stepOne?.sendCountry?.iso3,
    recipient: stepOne?.recipient?.fullName,
    recipientCountryIso: stepOne?.receiveCountry?.iso3,
    remittanceMethod: stepOne?.remittanceMethod?.name,
    sendingCountry: stepOne?.sendCountry?.name,
    receivingCountry: stepOne?.receiveCountry?.name,
    sendingAmount: stepTwo?.sendAmount,
    // exchangeRate: "",
    // feesAndCharges: "",
    // commission: "",
    // extraFees: "",
    // recipientGets: "",
    // totalPayableAmount: "",
  };

  const totalAmount = "0 USD";
  const { mutateAsync: createPaymentLink } = useCreatePaymentLink();
  const { mutateAsync: createRemittanceCart } = useCreateRemittanceCart();
  const { data: remittanceCartsResponse } = useGetRemittanceCarts(
    `?customer_id=${stepOne?.customer?.id}&currency=USD`
  );
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
        currency: "USD",
      });
      cartId = createResponse?.data?.id ?? null;
    }
    if (cartId) {
      const addingTransactionToCartResponse: any = await addTransationToCart({
        cartId,
        transaction_id: Number(transferId),
      });
      setCartAddedTo(addingTransactionToCartResponse?.data);
    }
  };
  const handleSendPaymentLink = async () => {
    const response = await createPaymentLink({
      payable_type: stepFour?.cartAddedTo?.id
        ? "RemittanceCart"
        : "Transaction",
      payable_id: stepFour?.cartAddedTo?.id
        ? stepFour?.cartAddedTo?.id
        : Number(transferId),
    });

    setPaymentLink(response?.data);
  };

  const handleCopyPaymentLink = () => {
    copyToClipboard(
      ROUTES.PAYMENT_LINKS.VALIDATION(stepFour?.paymentLink?.token),
      "Payment link copied to clipboard!"
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Total Amount Banner */}
          <div className="bg-[#E8F5F5] rounded-lg p-6 flex justify-between items-center">
            <h4 className="text-lg font-bold text-gray-900">
              Total amount to pay:{" "}
              <span className="text-teal-600">{totalAmount}</span>
            </h4>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white rounded-lg border p-6 space-y-6">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <h4 className="text-lg font-semibold text-gray-900">
                  Payment Method
                </h4>
              </div>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <Info className="w-4 h-4 mr-2" />
                Only single payment method should be used
              </p>
            </div>

            <hr className="my-3" />

            {/* Multiple Transfers Option */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">
                Do you need to create multiple transfers for the same customer
                today?
              </h4>
              <p className="text-sm text-gray-600">
                Then, add it to the "remittance cart" and ask the customer to
                pay once
              </p>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 flex items-start space-x-2 w-fit ">
                <p className="text-sm text-orange-700 inline-flex ">
                  <span>
                    <AlertCircle className="w-4 h-4 text-orange-500 mr-1" />
                  </span>
                  this option will deactivate any payment link that was created
                  for this transfer.
                </p>
              </div>

              {stepFour?.cartAddedTo?.id ? (
                <Button
                  variant="outline"
                  className="border-green-500 text-green-600 hover:text-green-600 cursor-default hover:bg-white"
                >
                  <CheckedIcon />
                  ADDED TO REMITTANCE CART
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="border-teal-500 text-teal-600 hover:bg-teal-50"
                  onClick={handleAddToRemittanceCart}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  ADD TO REMITTANCE CART
                </Button>
              )}
            </div>

            <hr className="my-3" />

            {/* Customer Payment Section */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <h4 className="font-medium text-gray-900">
                  Customer will pay for this transfer
                </h4>
                {stepFour?.paymentLink && (
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="link"
                      className="text-teal-600 hover:text-teal-700 p-0 h-auto text-sm cursor-pointer"
                      onClick={handleCopyPaymentLink}
                    >
                      <Copy className="w-4 h-4" />
                      COPY PAYMENT LINK
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">
                We will send the payment link to selected customer email and
                WhatsApp
              </p>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 flex items-start space-x-2 w-fit ">
                <p className="text-sm text-orange-700 inline-flex ">
                  <span>
                    <AlertCircle className="w-4 h-4 text-orange-500 mr-1" />
                  </span>
                  If this transfer was added to the remittance cart, sending a
                  payment link will remove this transfer from the Cart.
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  className="border-teal-500 text-teal-600 hover:bg-teal-50"
                  onClick={handleSendPaymentLink}
                >
                  <Link className="w-4 h-4 mr-2" />
                  SEND PAYMENT LINK
                </Button>
              </div>
            </div>
            <hr className="my-3" />

            {/* Agent Payment Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">
                You will pay for the transfer and then ask the customer for
                payment
              </h4>
              <p className="text-sm text-gray-600">
                You can send a payment link to the customer later, or you can
                take the amount in cash but then you need to manually update the
                transfer payment status.
              </p>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 flex items-start space-x-2 w-fit ">
                <p className="text-sm text-orange-700 inline-flex ">
                  <span>
                    <AlertCircle className="w-4 h-4 text-orange-500 mr-1" />
                  </span>
                  By choosing this payment method, the transfer will be removed
                  from the Remittance Cart if it was added in a Cart, and all
                  payment links will be deactivated
                </p>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="wallet-balance"
                      name="agent-payment-method"
                      value="wallet"
                      className="w-4 h-4 text-teal-600"
                    />
                    <label htmlFor="wallet-balance" className="text-gray-900">
                      From Wallet Balance (1200.00 USD)
                    </label>
                  </div>
                  <Button
                    variant="link"
                    className="text-teal-600 hover:text-teal-700 p-0 h-auto text-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4 border border-teal-500 rounded-full" />
                    ADD BALANCE
                  </Button>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="credit-card"
                    name="agent-payment-method"
                    value="credit-card"
                    className="w-4 h-4 text-teal-600"
                  />
                  <label htmlFor="credit-card" className="text-gray-900">
                    Credit Card
                  </label>
                </div>
              </div>

              <hr className="my-3" />

              <Button
                variant="outline"
                className="border-teal-500 text-teal-600 hover:bg-teal-50"
              >
                PAY ON BEHALF OF CUSTOMER
              </Button>
            </div>
          </div>
        </div>
        {/* Summary Card - Right Side */}
        <div className="lg:col-span-1">
          <SummaryCard data={summaryData} />
        </div>
      </div>
    </div>
  );
};

export default PayStep;
