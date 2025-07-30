import React from "react";
import { useTranslation } from "react-i18next";

const SendRemittancePage: React.FC = () => {
  const { t } = useTranslation("global");
  
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("modules.pages.sendRemittance.title")}</h1>
      <div>{t("modules.pages.sendRemittance.content")}</div>
    </div>
  );
};

export default SendRemittancePage; 