import React, { useState } from "react";
import EditIcon from "@/assets/icons/edit-icon.svg?react";
import SaveIcon from "@/assets/icons/save-icon.svg?react";
import CustomerBasicDetails from "./CustomerBasicDetails";

interface CustomerSectionCardProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  onDateChange: (field: string, value: any) => void;
  onSave: () => void;
  loading?: boolean;
}

const CustomerSectionCard: React.FC<CustomerSectionCardProps> = ({
  formData,
  onChange,
  onDateChange,
  onSave,
  loading = false,
}) => {
  const [editMode, setEditMode] = useState(false);
  const handleEdit = () => setEditMode(true);
  const handleSave = () => {
    onSave();
    setEditMode(false);
  };

  return (
    <div className="bg-white rounded-lg border border-[#E7EFEF]">
      <div className="flex items-center justify-between mb-4 border-b border-b-[#E7EFEF] p-5">
        <h2 className="text-lg font-semibold">Customer Bio</h2>
        {editMode ? (
          <button
            onClick={handleSave}
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
      <CustomerBasicDetails
        formData={formData}
        handleInputChange={onChange}
        handleDateChange={onDateChange}
        editMode={editMode}
      />
    </div>
  );
};

export default CustomerSectionCard;
