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
import ActionButton from "../shared/ActionButton";

interface ConfirmDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  trigger?: ReactElement;
}

const CreateAgentBankAccountDialog = ({
  isOpen,
  setIsOpen,
  trigger,
}: ConfirmDialogProps) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // ONLY allow opening from the trigger
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="p-0">
        {/* Header */}
        <DialogHeader className="p-5 border-b border-gray-200">
          <DialogTitle className="max-w-[95%]">
            Add New Bank Account
          </DialogTitle>
          <DialogDescription>desciption</DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="p-5">test content here</div>

        {/* Footer */}
        <DialogFooter className="flex !justify-end p-5 gap-3">
          <ActionButton type="action" title="Confirm" />
          <ActionButton
            type="cancel"
            title="Cancel"
            onClick={() => setIsOpen(false)}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAgentBankAccountDialog;
