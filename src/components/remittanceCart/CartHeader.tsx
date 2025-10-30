import { cn } from "@/lib/utils";
import ActionButton from "../shared/ActionButton";
import StatusLabel from "../shared/StatusLabel";
import CopyLinkIcon from "@/assets/icons/copy-link.svg?react";
import { format } from "date-fns";
import { copyToClipboard } from "@/helpers/text";
import {
  useCreatePaymentLink,
  useGetPaymentLinkByCart,
} from "@/hooks/data/usePaymentLinks";
import { useState, useEffect } from "react";
import { ROUTES } from "@/constants/routes";
import { PAYMENT_LINKS_STATUSES_COLORS } from "@/constants/appConstants";

interface CartItemProps {
  title: string;
  value: string;
  valueClassName?: string;
  className?: string;
}
interface CartHeaderProps {
  customer: { id: number; first_name: string; last_name: string };
  date: string;
  totalPayableAmount: number | string;
  cartId?: number;
}
interface PaymentLinkType {
  token: string;
  status: string;
}
const CartHeader = (props: CartHeaderProps) => {
  const { customer, date, totalPayableAmount, cartId } = props;

  const { mutateAsync: createPaymentLink } = useCreatePaymentLink();
  const { data } = useGetPaymentLinkByCart(String(cartId));
  const [paymentLink, setPaymentLink] = useState<PaymentLinkType>({
    token: "",
    status: "",
  });
  useEffect(() => {
    if (data?.data[0]) {
      setPaymentLink(data?.data[0]);
    }
  }, [data]);
  const handleSendPaymentLink = async () => {
    const response = await createPaymentLink({
      payable_type: "RemittanceCart",
      payable_id: cartId,
    });
    setPaymentLink(response?.data);
  };
  const handleCopyLink = () => {
    paymentLink?.token;
    copyToClipboard(
      ROUTES.PAYMENT_LINKS.VALIDATION(paymentLink?.token),
      "Payment link copied to clipboard!"
    );
  };
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <CartItem
          title="Customer"
          value={`${customer?.first_name} ${customer?.last_name}`}
          className="border-none"
        />
        <CartItem
          title="Date"
          value={format(date, "PPpp")}
          // value="30-Sep-2024 6:30"
        />
        <CartItem
          title="Total Payable Amount"
          value={`${totalPayableAmount}USD`}
          valueClassName="text-primary"
        />
      </div>
      <div className="flex items-center gap-0">
        {paymentLink?.status && (
          <StatusLabel
            value={paymentLink?.status}
            color={
              PAYMENT_LINKS_STATUSES_COLORS?.[
                paymentLink?.status as keyof typeof PAYMENT_LINKS_STATUSES_COLORS
              ]
            }
          />
        )}
        <ActionButton
          type="link"
          title="resend"
          onClick={handleSendPaymentLink}
        />
        <ActionButton
          type="link"
          title="copy link"
          icon={<CopyLinkIcon />}
          className="p-1"
          onClick={handleCopyLink}
        />
      </div>
    </div>
  );
};

const CartItem = (props: CartItemProps) => {
  const { title, value, valueClassName, className } = props;
  return (
    <div
      className={cn(className, "flex flex-col px-5 border-l-1 border-gray-200")}
    >
      <div>{title}</div>
      <div className={cn("font-semibold", valueClassName)}>{value}</div>
    </div>
  );
};
export default CartHeader;
