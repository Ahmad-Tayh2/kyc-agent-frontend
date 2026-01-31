import ActionButton from "@/components/shared/ActionButton";
import PageTitle from "@/components/shared/PageTitle";
import { cn } from "@/lib/utils";
import type { GetTransfersDataProps } from "@/types/transfers";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface DetailsCardProps {
  transfer: GetTransfersDataProps;
  printAreaRef: any;
}

interface CardContentProps {
  transfer: GetTransfersDataProps;
  printAreaRef: any;
}

interface MiniCardLayoutProps {
  title?: string;
  children?: ReactNode;
}
const DetailsCard = (props: DetailsCardProps) => {
  const { transfer, printAreaRef } = props;
  return (
    <div className="bg-white rounded-md border-1 border-gray-200">
      <CardContent transfer={transfer} printAreaRef={printAreaRef} />
      <CardFooter />
    </div>
  );
};

const CardContent = (props: CardContentProps) => {
  const { transfer, printAreaRef } = props;
  const { t } = useTranslation("global");

  const transfersDetails = [
    { label: "Transfer Number", value: transfer?.reference_number },
    { label: "Send On", value: "" },
    { label: "Delivery", value: "" },
    { label: "Pickup location", value: "" },
    { label: "Transfer Reason", value: "" },
    { label: "Transfer Time", value: "" },
    { label: "Payment Method", value: transfer.payment_method },
    {
      label: "Amount Sent",
      value: transfer?.sent_amount + " " + transfer?.send_currency,
    },
    {
      label: "Transfer Fee",
      value: transfer.extra_fees_amount + " " + transfer?.send_currency,
    },
    {
      label: "Agent Total Commission/Profit",
      value: transfer?.total_commission_amount + " " + transfer?.send_currency,
    },
    { label: "Total Amount Paid", value: transfer?.total_payable_amount },
    {
      label: "Recipient Gets",
      value: transfer.receive_amount + " " + transfer.receive_currency,
    },
    { label: "Equivalent", value: "" },
    { label: "Reference Notes", value: transfer?.comment },
  ];

  return (
    <div ref={printAreaRef}>
      <div className="p-5 hidden print:block text-2xl font-bold mb-1 text-center">
        <PageTitle title={t("modules.pages.transfers.details.title")} />
      </div>
      <div className="flex flex-row flex-wrap gap-5 p-5">
        <div className="flex-1 h-fit min-w-[220px]">
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
        </div>
        <div className="flex-1 h-fit min-w-[220px]">
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
        <div className="flex-1 h-fit min-w-[400px]">
          <MiniCardLayout title={"Transfers Details"}>
            {transfersDetails?.map((transferItem, key) => (
              <div
                className={cn(
                  "flex justify-between px-5 py-3 odd:bg-primary/4",
                  key !== 0 && "border-t-1 border-gray-200",
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
    </div>
  );
  // return (
  //   <div className="flex flex-col sm:flex-row gap-5 p-5">
  //     <div className="flex flex-row gap-5 w-full h-fit sm:w-2/3">
  //       <div className="w-1/2">
  //         <MiniCardLayout title={"Sender Details"}>
  //           <div className="p-5">
  //             <div className="font-bold">
  //               {transfer?.customer?.first_name +
  //                 " " +
  //                 transfer?.customer?.last_name}
  //             </div>
  //             <div>Address should appear here</div>
  //           </div>
  //         </MiniCardLayout>
  //       </div>
  //       <div className="w-1/2">
  //         <MiniCardLayout title={"Recipient Details"}>
  //           <div className="p-5">
  //             <div className="font-bold">
  //               {transfer?.recipient?.first_name +
  //                 " " +
  //                 transfer?.recipient?.last_name}
  //             </div>
  //             <div>Address should appear here</div>
  //           </div>
  //         </MiniCardLayout>
  //       </div>
  //     </div>
  //     <div className="w-full sm:w-1/3 print-area" ref={printAreaRef}>
  //       <MiniCardLayout title={"Transfers Details"}>
  //         {transfersDetails?.map((transferItem, key) => (
  //           <div
  //             className={cn(
  //               "flex justify-between px-5 py-3 odd:bg-primary/4",
  //               key !== 0 && "border-t-1 border-gray-200",
  //             )}
  //             key={key}
  //           >
  //             <div>{transferItem?.label}</div>
  //             <div className="font-bold">{transferItem?.value}</div>
  //           </div>
  //         ))}
  //       </MiniCardLayout>
  //     </div>
  //   </div>
  // );
};
const CardFooter = () => {
  return (
    // remove class hidden when use it
    <div className="flex gap-2 justify-end border-t-1 border-gray-200 p-5 hidden">
      <ActionButton title="cancel" type="cancel" disabled />
      <ActionButton title="pay out transfers" type="action" disabled />
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
