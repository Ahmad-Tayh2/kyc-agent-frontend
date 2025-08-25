import { cn } from "@/lib/utils";
import ActionButton from "../shared/ActionButton";
import StatusLabel from "../shared/StatusLabel";
import CopyLinkIcon from "@/assets/icons/copy-link.svg?react";

interface CartItemProps {
  title: string;
  value: string;
  valueClassName?: string;
  className?: string;
}
const CartHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <CartItem
          title="Customer"
          value="Mohamed Imran"
          className="border-none"
        />
        <CartItem title="Date" value="30-Sep-2024 6:30" />
        <CartItem
          title="Total Payable Amount"
          value="16,000.00 USD"
          valueClassName="text-primary"
        />
      </div>
      <div className="flex items-center gap-0">
        <StatusLabel value="status" color="#ff0000" />
        <ActionButton type="link" title="resend" />
        <ActionButton
          type="link"
          title="copy link"
          icon={<CopyLinkIcon />}
          className="p-1"
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
