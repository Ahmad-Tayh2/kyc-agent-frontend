import ActionButton from "@/components/shared/ActionButton";
import { cn } from "@/lib/utils";

const DetailsCard = (props: any) => {
  const { transfer } = props;
  console.log("transfer = ", transfer);
  return (
    <div className="bg-white rounded-md border-1 border-gray-200">
      <CardContent />
      <CardFooter />
    </div>
  );
};

const CardContent = () => {
  const transfersDetails = [
    { label: "Transfer Number", value: "8374-84256712" },
    { label: "Send On", value: "13/09/2023" },
    { label: "Delivery", value: "mobile" },
    { label: "Pickup location", value: "N/A" },
    { label: "Transfer Reason", value: "Family support" },
    { label: "Transfer Tmer", value: "15 minutes" },
    { label: "Send On", value: "13/09/2023" },
    { label: "Delivery", value: "mobile" },
    { label: "Pickup location", value: "N/A" },
    { label: "Pickup location", value: "N/A" },
    { label: "Transfer Reason", value: "Family support" },
    { label: "Transfer Tmer", value: "15 minutes" },
    { label: "Send On", value: "13/09/2023" },
  ];
  return (
    <div className="flex flex-row gap-5 p-5">
      <div className="flex flex-col gap-5 w-1/3">
        <MiniCardLayout title={"Sender Details"}>
          <div className="p-5">
            <div className="font-bold">Hassan Ali</div>
            <div>21, town, 12354 mummff jjj</div>
          </div>
        </MiniCardLayout>
        <MiniCardLayout title={"Recipient Details"}>
          <div className="p-5">
            <div className="font-bold">Hassan Ali</div>
            <div>21, town, 12354 mummff jjj</div>
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

const MiniCardLayout = (props: any) => {
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
