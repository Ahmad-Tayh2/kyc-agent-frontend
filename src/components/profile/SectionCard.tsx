import React from "react";
import EditableForm from "./EditableForm";
import EditIcon from "@/assets/icons/edit-icon.svg?react";
import SaveIcon from "@/assets/icons/save-icon.svg?react";
import { useTranslation } from "react-i18next";
interface SectionCardProps {
  section: "personal" | "company";
}

const SectionCard: React.FC<SectionCardProps> = ({ section }) => {
  const [editMode, setEditMode] = React.useState(false);
  const [t] = useTranslation("global");
  
  const titles = {
    personal: t("modules.profile.personalInfo.title"),
    company: t("modules.profile.companyInfo.title"),
  };
  return (
    <div className="bg-white rounded-lg border border-[#E7EFEF]">
      <div className="flex items-center justify-between mb-4 border-b border-b-[#E7EFEF] p-5">
        <h2 className="text-lg font-semibold">{titles[section]}</h2>
        {editMode ? (
          <button
            onClick={() => setEditMode(false)}
            className="cursor-pointer text-white text-[12px] flex items-center gap-1 px-2 py-1 rounded-full border border-primary bg-primary"
          >
            <SaveIcon />
            <span className="font-medium">{t("common.buttons.save")}</span>
          </button>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="cursor-pointer text-primary-600 text-[12px] flex items-center gap-1 px-2 py-1 rounded-full border border-[#E5E5E5]"
          >
            <EditIcon />
            <span className="font-medium">{t("common.buttons.edit")}</span>
          </button>
        )}
      </div>
      <EditableForm
        section={section}
        editMode={editMode}
        setEditMode={setEditMode}
      />
    </div>
  );
};

export default SectionCard;
