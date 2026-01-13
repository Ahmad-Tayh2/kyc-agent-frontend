import React, { type ReactNode } from "react";
import EditIcon from "@/assets/icons/edit-icon.svg?react";
import SaveIcon from "@/assets/icons/save-icon.svg?react";
import { cn } from "@/lib/utils";

interface EditSectionCardProps {
  sectionTitle?: string;
  description?: string;
  onSave?: () => void;
  loading?: boolean;
  editMode?: boolean;
  setEditMode?: (editMode: boolean) => void;
  checkOtherSectionEditMode?: boolean;
  children?: ReactNode;
  className?: string;
}

const EditSectionCard: React.FC<EditSectionCardProps> = ({
  sectionTitle,
  description,
  onSave,
  loading = false,
  editMode,
  setEditMode,
  checkOtherSectionEditMode,
  children,
  className,
}) => {
  const handleEdit = () => !checkOtherSectionEditMode && setEditMode?.(true);
  return (
    <div
      className={cn(className, "bg-white  rounded-lg border border-[#E7EFEF]")}
    >
      <div className="flex items-center justify-between mb-4 border-b border-b-[#E7EFEF] p-5">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">{sectionTitle}</h2>
          {description && (
            <p className="text-[14px] text-[#656565]">{description}</p>
          )}
        </div>
        {setEditMode && (
          <>
            {editMode ? (
              <button
                onClick={onSave}
                className="cursor-pointer text-white text-[12px] flex items-center gap-1 px-2 py-1 rounded-full border border-primary bg-primary"
                disabled={loading}
              >
                <SaveIcon />
                <span className="font-medium">Save</span>
              </button>
            ) : (
              <button
                onClick={handleEdit}
                className="cursor-pointer text-primary-600 text-[12px] flex items-center gap-1 px-2 py-1 rounded-full border border-[#E5E5E5]"
              >
                <EditIcon />
                <span className="font-medium">Edit</span>
              </button>
            )}
          </>
        )}
      </div>
      {children}
    </div>
  );
};

export default EditSectionCard;
