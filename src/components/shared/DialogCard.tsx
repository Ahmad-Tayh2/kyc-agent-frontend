import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ReactElement } from "react";

interface ReportIssueDialogProps {
  trigger?: ReactElement;
  title?: ReactElement | string;
  description?: ReactElement | string;
  content?: ReactElement;
  actionButtons?: ReactElement;
}
const DialogCard = (props: ReportIssueDialogProps) => {
  const { trigger, title, description, content, actionButtons } = props;
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="p-0">
        <DialogHeader className="p-5 border-b-1 border-gray-200">
          <DialogTitle className="max-w-[95%]">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="p-5">{content}</div>
        <DialogFooter className="flex !justify-start p-5">
          {actionButtons}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DialogCard;
