import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";
import { useState } from "react";
import CloseIcon from "@/assets/icons/close.svg?react";

interface ConfirmationDialogProps {
  trigger?: ReactNode;
  title?: ReactNode | string;
  showCloseIcon?: boolean;
  description?: string;
  children?: ReactNode;
  onConfirm?: () => void;
}
export default function ConfirmationDialog(props: ConfirmationDialogProps) {
  const { trigger, title, showCloseIcon, description, children, onConfirm } =
    props;
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleConfirmation = () => {
    onConfirm?.();
    handleClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {trigger ?? <Button variant="outline">Show Dialog</Button>}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <AlertDialogTitle>{title}</AlertDialogTitle>
            {showCloseIcon && (
              <div onClick={handleClose}>
                <CloseIcon />
              </div>
            )}
          </div>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmation}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
