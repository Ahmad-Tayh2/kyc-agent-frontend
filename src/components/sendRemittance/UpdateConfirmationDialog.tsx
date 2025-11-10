import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import React from 'react';

interface UpdateConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueWithoutUpdate: () => void;
  onApplyUpdates: () => void;
  isUpdating?: boolean;
}

const UpdateConfirmationDialog: React.FC<UpdateConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onContinueWithoutUpdate,
  onApplyUpdates,
  isUpdating = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <button
          onClick={onClose}
          className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
        >
          <X className='h-4 w-4' />
          <span className='sr-only'>Close</span>
        </button>

        <DialogHeader>
          <DialogTitle>Unsaved Changes Detected</DialogTitle>
          <DialogDescription>
            You have made changes to this step. Would you like to update the
            transaction before proceeding?
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-3 mt-4'>
          <Button
            onClick={onApplyUpdates}
            disabled={isUpdating}
            className='w-full'
          >
            {isUpdating ? 'Applying Updates...' : 'Apply Updates & Continue'}
          </Button>
          <Button
            onClick={onContinueWithoutUpdate}
            variant='outline'
            disabled={isUpdating}
            className='w-full'
          >
            Continue Without Updating
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateConfirmationDialog;
