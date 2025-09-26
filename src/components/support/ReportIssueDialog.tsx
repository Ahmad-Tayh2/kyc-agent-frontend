import { DialogClose } from "@/components/ui/dialog";
import ActionButton from "../shared/ActionButton";
import type { ReactElement } from "react";
import DialogCard from "../shared/DialogCard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { SingleSelectDropdown } from "../shared/SingleSelectDropdown";

interface ReportIssueDialogProps {
  trigger?: ReactElement;
  content?: ReactElement;
}
const ReportIssueDialog = (props: ReportIssueDialogProps) => {
  const { trigger } = props;

  const issuesOptions = [{ label: "Add money", value: "add-money" }];
  const content = () => {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            Issues regarding<span>*</span>
          </Label>
          <SingleSelectDropdown
            options={issuesOptions}
            selectedValue={issuesOptions[0].value}
            onValueChange={() => {}}
            // className="min-h-[45px]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">
            Reference number<span>*</span>
          </Label>
          <Input placeholder="Enter reference number here" />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-[14px]">Username</Label>
          <Textarea placeholder="Enter description here" />
        </div>
      </div>
    );
  };
  const actionButtons = () => {
    return (
      <>
        <DialogClose asChild>
          <ActionButton type="cancel" title="cancel" />
        </DialogClose>
        <ActionButton type="action" title="report issue" />
      </>
    );
  };
  return (
    <DialogCard
      trigger={trigger}
      title="Report Issue"
      description="You can report an issue about specific actions/transfers/customers and provide some details"
      content={content()}
      actionButtons={actionButtons()}
    />
  );
};
export default ReportIssueDialog;
