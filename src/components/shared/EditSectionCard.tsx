import React, { type ReactNode } from "react";
import EditIcon from "@/assets/icons/edit-icon.svg?react";
import SaveIcon from "@/assets/icons/save-icon.svg?react";

interface EditSectionCardProps {
  sectionTitle?: string;
  onSave: () => void;
  loading?: boolean;
  editMode?: boolean;
  setEditMode?: (editMode: boolean) => void;
  checkOtherSectionEditMode?: boolean;
  children?: ReactNode;
}

const EditSectionCard: React.FC<EditSectionCardProps> = ({
  sectionTitle,
  onSave,
  loading = false,
  editMode,
  setEditMode,
  checkOtherSectionEditMode,
  children,
}) => {
  const handleEdit = () => !checkOtherSectionEditMode && setEditMode?.(true);
  return (
    <div className="bg-white rounded-lg border border-[#E7EFEF]">
      <div className="flex items-center justify-between mb-4 border-b border-b-[#E7EFEF] p-5">
        <h2 className="text-lg font-semibold">{sectionTitle}</h2>
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
      </div>
      {children}
    </div>
  );
};

export default EditSectionCard;
