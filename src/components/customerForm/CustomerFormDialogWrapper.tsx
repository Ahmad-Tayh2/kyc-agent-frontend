import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CustomerForm from "./CustomerForm";

interface CustomerFormDialogProps {
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  token?: string;
  mode?: "generate" | "preview";
}

const CustomerFormDialog: React.FC<CustomerFormDialogProps> = ({
  trigger,
  isOpen,
  onOpenChange,
  token,
  mode = "generate",
}) => {
  const [open, setOpen] = useState(isOpen || false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  if (token && mode === "preview") {
    // If token is provided and mode is preview, show the customer form in preview mode
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Form Preview</DialogTitle>
          </DialogHeader>
          <CustomerForm
            mode="preview"
            token={token}
            onClose={() => handleOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // Original dialog content for generating new forms (existing functionality)
  // This would include the existing CustomerFormDialog content
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Generate Customer Form Link</DialogTitle>
        </DialogHeader>
        {/* TODO: Add original form generation content here */}
        <div className="p-4">
          <p>Original form generation functionality goes here...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerFormDialog;
