import { cn } from "@/lib/utils";
import ActionButton from "../shared/ActionButton";
import StatusLabel from "../shared/StatusLabel";
import CopyLinkIcon from "@/assets/icons/copy-link.svg?react";
import { format } from "date-fns";

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
}
const CartHeader = (props: CartHeaderProps) => {
  const { customer, date, totalPayableAmount } = props;
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
        <StatusLabel value="Link Status" color="#ff0000" />
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
