// import ActionButton from "../shared/ActionButton";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// interface DetachRecipientDialogProps {
//   isOpen: boolean;
//   onClose: () => void;
// }
// const DetachRecipientDialog = (props: DetachRecipientDialogProps) => {
//   const { isOpen, onClose } = props;

//   const content = () => {
//     return <div>show transaction details here</div>;
//   };
//   const actionButtons = () => {
//     return (
//       <div className="flex justify-center w-full">
//         <ActionButton type="link" title="See Complete transaction" />
//       </div>
//     );
//   };
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="p-0">
//         <DialogHeader className="p-5 border-b-1 border-gray-200">
//           <DialogTitle className="max-w-[95%]">ttt</DialogTitle>
//           <DialogDescription>desss</DialogDescription>
//         </DialogHeader>
//         <div className="p-5">ccc</div>
//         <DialogFooter className="flex !justify-start p-5">
//           {/* {actionButtons} */}
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default DetachRecipientDialog;
import { useState } from "react";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

const DetachRecipientDialog = (props: any) => {
  const { isOpen, onClose, onConfirm } = props;
  // const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    onClose?.();
  };

  return (
    <div>
      {/* <button
        className="px-4 py-2 bg-red-500 text-white rounded"
        onClick={() => setOpen(true)}
      >
        Delete Item
      </button> */}

      <ConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        title="Delete recipient?"
        description="This action is permanent and cannot be undone."
        message="Are you sure you want to delete this recipient?"
        confirmText="Yes, delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        isLoading={loading}
      />
    </div>
  );
};

export default DetachRecipientDialog;
