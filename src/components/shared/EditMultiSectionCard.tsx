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
  customerSections: EditSection[];
  checkOtherSectionEditMode?: boolean;
  className?: string;
}

const EditMultiSectionCard: React.FC<EditMultiSectionCardProps> = ({
  customerSections,
  checkOtherSectionEditMode,
  className,
}) => {
  const [selectedSection, setSelectedSection] = useState(0);
  const handleEdit = () =>
    !checkOtherSectionEditMode &&
    customerSections?.[selectedSection]?.setEditMode?.(true);
  return (
    <div
      className={cn(className, "bg-white rounded-lg border border-[#E7EFEF]")}
    >
      <div className="flex items-center justify-between mb-4 border-b border-b-[#E7EFEF] px-5">
        <div className="flex items-center gap-5 mt-auto">
          {customerSections?.map((section: EditSection, index: number) => (
            <button
              key={index}
              className={cn(
                "text-lg font-semibold border-b-2  px-3 py-1 rounded-t-sm border-transparent hover:border-primary/50 hover:bg-primary/1 hover:text-primary/50",
                selectedSection === index &&
                  "border-primary bg-primary/5 text-primary hover:border-primary hover:bg-primary/5 hover:text-primary"
              )}
              onClick={() => {
                setSelectedSection(index);
                customerSections?.[selectedSection]?.setEditMode?.(false);
              }}
            >
              {section.sectionTitle}
            </button>
          ))}
        </div>

        {customerSections?.[selectedSection]?.setEditMode && (
          <div className="p-3">
            {customerSections?.[selectedSection]?.editMode ? (
              <button
                onClick={customerSections?.[selectedSection]?.onSave}
                className="cursor-pointer text-white text-[12px] flex items-center gap-1 px-2 py-1 rounded-full border border-primary bg-primary"
                disabled={customerSections?.[selectedSection]?.loading}
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
      {customerSections?.[selectedSection]?.content}
    </div>
  );
};

export default EditMultiSectionCard;
