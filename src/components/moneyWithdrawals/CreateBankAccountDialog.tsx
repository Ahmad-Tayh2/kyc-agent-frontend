import { DialogClose } from "@/components/ui/dialog";
import ActionButton from "../shared/ActionButton";
import type { ReactElement } from "react";
import DialogCard from "../shared/DialogCard";

interface CreateBankAccountDialogProps {
  trigger?: ReactElement;
  content?: ReactElement;
}
const CreateBankAccountDialog = (props: CreateBankAccountDialogProps) => {
  const { trigger } = props;

  const content = () => {
    return <div>bank details fiels will be defined later from backend</div>;
  };
  const actionButtons = () => {
    return (
      <>
        <ActionButton type="action" title="Confirm" />
        <DialogClose asChild>
          <ActionButton type="cancel" title="cancel" />
        </DialogClose>
      </>
    );
  };
  return (
    <DialogCard
      trigger={trigger}
      title="Add New Bank Account"
      content={content()}
      actionButtons={actionButtons()}
    />
  );
};
export default CreateBankAccountDialog;
