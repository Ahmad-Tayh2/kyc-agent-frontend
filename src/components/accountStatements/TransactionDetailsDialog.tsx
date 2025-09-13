// import { DialogClose } from "@/components/ui/dialog";
import ActionButton from "../shared/ActionButton";
import type { ReactElement } from "react";
import DialogCard from "../shared/DialogCard";

interface TransactionDetailsDialogProps {
  trigger?: ReactElement;
  content?: ReactElement;
}
const TransactionDetailsDialog = (props: TransactionDetailsDialogProps) => {
  const { trigger } = props;

  const content = () => {
    return <div>show transaction details here</div>;
  };
  const actionButtons = () => {
    return (
      <div className="flex justify-center w-full">
        <ActionButton type="link" title="See Complete transaction" />
      </div>
    );
  };
  return (
    <DialogCard
      trigger={trigger}
      title="Transaction Details"
      content={content()}
      actionButtons={actionButtons()}
    />
  );
};
export default TransactionDetailsDialog;
