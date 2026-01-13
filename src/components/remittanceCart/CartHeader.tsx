import { cn } from "@/lib/utils";
import ActionButton from "../shared/ActionButton";
import StatusLabel from "../shared/StatusLabel";
import CopyLinkIcon from "@/assets/icons/copy-link.svg?react";
import { format } from "date-fns";
import { copyToClipboard } from "@/helpers/text";
import {
  useCreatePaymentLink,
  useRegeneratePaymentLink,
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
  id?: number;
  token: string;
  status: string;
}
const CartHeader = (props: CartHeaderProps) => {
  const { customer, date, totalPayableAmount, cartId } = props;

  const { mutateAsync: createPaymentLink } = useCreatePaymentLink();
  const { mutateAsync: regeneratePaymentLink } = useRegeneratePaymentLink();
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
  const handleGeneratePaymentLink = async () => {
    const response = await createPaymentLink({
      payable_type: "RemittanceCart",
      payable_id: cartId,
    });
    setPaymentLink(response?.data);
  };
  const handleRegeneratePaymentLink = async () => {
    if (paymentLink?.id) {
      const response = await regeneratePaymentLink(paymentLink?.id);
      setPaymentLink(response?.data);
    }
  };
  const handleCopyLink = () => {
    paymentLink?.token;
    copyToClipboard(
      window.location.origin +
        ROUTES.PAYMENT_LINKS.VALIDATION(paymentLink?.token),
      "Payment link copied to clipboard!"
    );
  };
  return (
    // <div className="flex justify-between items-center">
    <div
      className="
        flex
        gap-3
       flex-row
        justify-between
        md:items-center
      "
    >
      {/* <div className="flex items-center"> */}
      <div
        className="
        flex
        flex-col
        gap-5
        border-r-1

        md:flex-row
        md:items-center
        md:justify-between
        md:border-none
        pr-5
      "
      >
        <CartItem
          title="Customer"
          value={`${customer?.first_name} ${customer?.last_name}`}
          className="md:!border-l-0"
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
          className="!border-b-0 !pb-0"
        />
      </div>

      <div className="flex flex-col md:flex-row items-center gap-2">
        {paymentLink?.status && paymentLink?.token && (
          <StatusLabel
            value={paymentLink?.status}
            color={
              PAYMENT_LINKS_STATUSES_COLORS?.[
                paymentLink?.status as keyof typeof PAYMENT_LINKS_STATUSES_COLORS
              ]
            }
          />
        )}
        {paymentLink?.token && paymentLink?.id ? (
          <ActionButton
            type="link"
            title="Regenerate Link"
            onClick={handleRegeneratePaymentLink}
          />
        ) : (
          <ActionButton
            type="link"
            title="Generate Link"
            onClick={handleGeneratePaymentLink}
          />
        )}
        {paymentLink?.token && (
          <ActionButton
            type="link"
            title="copy link"
            icon={<CopyLinkIcon />}
            className="p-1"
            onClick={handleCopyLink}
          />
        )}
      </div>
    </div>
  );
};

const CartItem = (props: CartItemProps) => {
  const { title, value, valueClassName, className } = props;
  return (
    <div
      className={cn(
        className,
        "flex flex-col px-5 border-b-1 md:border-b-0 md:border-l-1 border-gray-200 pb-5"
      )}
    >
      <div>{title}</div>
      <div className={cn("font-semibold", valueClassName)}>{value}</div>
    </div>
  );
};
export default CartHeader;
