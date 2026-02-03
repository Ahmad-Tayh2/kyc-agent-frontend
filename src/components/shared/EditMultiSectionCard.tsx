import React, { useState, type ReactElement } from "react";
import EditIcon from "@/assets/icons/edit-icon.svg?react";
import SaveIcon from "@/assets/icons/save-icon.svg?react";
import { cn } from "@/lib/utils";

interface EditSection {
  sectionTitle?: string;
  onSave?: () => void;
  loading?: boolean;
  editMode?: boolean;
  setEditMode?: (editMode: boolean) => void;
  content?: ReactElement | string;
}
interface EditMultiSectionCardProps {
  sections: EditSection[];
  checkOtherSectionEditMode?: boolean;
  className?: string;
}

const EditMultiSectionCard: React.FC<EditMultiSectionCardProps> = ({
  sections,
  checkOtherSectionEditMode,
  className,
}) => {
  const [selectedSection, setSelectedSection] = useState(0);
  const handleEdit = () =>
    !checkOtherSectionEditMode &&
    sections?.[selectedSection]?.setEditMode?.(true);
  return (
    <div
      className={cn(
        className,
        "bg-white rounded-lg border border-[#E7EFEF]  min-w-[350px]",
      )}
    >
      {/* <div className="flex items-center justify-between mb-4 border-b border-b-[#E7EFEF] px-5"> */}
      <div
        className="
      flex
      flex-col
      gap-3

      border-b
      border-b-[#E7EFEF]
      px-3
      py-2

      sm:flex-row
      sm:items-end
      sm:justify-between
      sm:px-5
      sm:py-0
    "
      >
        <div className="flex items-center gap-5 mt-auto">
          {/* <div
          className="
        flex
        gap-3
        overflow-x-auto
        scrollbar-hide

        sm:overflow-visible
      "
        > */}
          {sections?.map((section: EditSection, index: number) => (
            <button
              key={index}
              className={cn(
                "text-sm md:text-lg font-semibold border-b-2  px-3 py-1 rounded-t-sm border-transparent hover:border-primary/50 hover:bg-primary/1 hover:text-primary/50",
                selectedSection === index &&
                  "border-primary bg-primary/5 text-primary hover:border-primary hover:bg-primary/5 hover:text-primary",
              )}
              onClick={() => {
                setSelectedSection(index);
                sections?.[selectedSection]?.setEditMode?.(false);
              }}
            >
              {section.sectionTitle}
            </button>
          ))}
        </div>

        {sections?.[selectedSection]?.setEditMode && (
          <div className="p-3">
            {/* <div className="p-3 flex justify-end sm:justify-start"> */}
            {sections?.[selectedSection]?.editMode ? (
              <button
                onClick={sections?.[selectedSection]?.onSave}
                className="cursor-pointer text-white text-[12px] flex items-center gap-1 px-2 py-1 rounded-full border border-primary bg-primary"
                disabled={sections?.[selectedSection]?.loading}
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
        )}
      </div>
      {sections?.[selectedSection]?.content}
    </div>
  );
};

export default EditMultiSectionCard;
