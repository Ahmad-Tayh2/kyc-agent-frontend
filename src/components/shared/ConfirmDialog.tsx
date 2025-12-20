import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;

  title?: string;
  description?: string;
  message?: string | React.ReactNode;

  confirmText?: string;
  cancelText?: string;

  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  isLoading = false,
}: ConfirmDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0">
        {/* Header */}
        <DialogHeader className="p-5 border-b border-gray-200">
          <DialogTitle className="max-w-[95%]">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="p-5">
          {message ? (
            <div className="text-gray-700 text-[15px]">{message}</div>
          ) : null}
        </div>

        {/* Footer */}
        <DialogFooter className="flex !justify-end p-5 gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
