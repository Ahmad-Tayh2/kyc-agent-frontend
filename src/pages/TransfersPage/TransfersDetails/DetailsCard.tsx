import ActionButton from "@/components/shared/ActionButton";
import { cn } from "@/lib/utils";
import type { GetTransfersDataProps } from "@/types/transfers";
import type { ReactNode } from "react";

interface DetailsCardProps {
  transfer: GetTransfersDataProps;
}

interface CardContentProps {
  transfer: GetTransfersDataProps;
}

interface MiniCardLayoutProps {
  title?: string;
  children?: ReactNode;
}
const DetailsCard = (props: DetailsCardProps) => {
  const { transfer } = props;
  return (
    <div className="bg-white rounded-md border-1 border-gray-200">
      <CardContent transfer={transfer} />
      <CardFooter />
    </div>
  );
};

const CardContent = (props: CardContentProps) => {
  const { transfer } = props;

  const transfersDetails = [
    { label: "Transfer Number", value: "" },
    { label: "Send On", value: "" },
    { label: "Delivery", value: "" },
    { label: "Pickup location", value: "" },
    { label: "Transfer Reason", value: "" },
    { label: "Transfer Time", value: "" },
    { label: "Payment Method", value: transfer.payment_method },
    { label: "Amount Sent", value: "" },
    { label: "Transfer Fee", value: transfer.extra_fees_amount },
    { label: "Agent Total Commission/Profit", value: "" },
    { label: "Total Amout Paid", value: "" },
    { label: "Recipient Gets", value: transfer.payout_amount },
    { label: "Equivalent", value: "" },
    { label: "Reference Notes", value: "" },
  ];
  return (
    <div className="flex flex-row gap-5 p-5">
      <div className="flex flex-col gap-5 w-1/3">
        <MiniCardLayout title={"Sender Details"}>
          <div className="p-5">
            <div className="font-bold">
              {transfer?.customer?.first_name +
                " " +
                transfer?.customer?.last_name}
            </div>
            <div>Address should appear here</div>
          </div>
        </MiniCardLayout>
        <MiniCardLayout title={"Recipient Details"}>
          <div className="p-5">
            <div className="font-bold">
              {transfer?.recipient?.first_name +
                " " +
                transfer?.recipient?.last_name}
            </div>
            <div>Address should appear here</div>
          </div>
        </MiniCardLayout>
      </div>
      <div className="w-2/3">
        <MiniCardLayout title={"Transfers Details"}>
          {transfersDetails?.map((transferItem, key) => (
            <div
              className={cn(
                "flex justify-between p-5",
                key !== 0 && "border-t-1 border-gray-200"
              )}
              key={key}
            >
              <div>{transferItem?.label}</div>
              <div className="font-bold">{transferItem?.value}</div>
            </div>
          ))}
        </MiniCardLayout>
      </div>
    </div>
  );
};
const CardFooter = () => {
  return (
    <div className="flex gap-2 justify-end border-t-1 border-gray-200 p-5">
      <ActionButton title="cancel" type="cancel" />
      <ActionButton title="pay out transfers" type="action" />
    </div>
  );
};

const MiniCardLayout = (props: MiniCardLayoutProps) => {
  const { title, children } = props;
  return (
    <div className="border-1 border-gray-200 rounded-md shadow-[0px_2px_0px_0px_rgba(0,0,0,0.05)]">
      <div className="p-5 font-semibold border-b-1 border-gray-200">
        {title}
      </div>
      {children}
    </div>
  );
};
export default DetailsCard;
