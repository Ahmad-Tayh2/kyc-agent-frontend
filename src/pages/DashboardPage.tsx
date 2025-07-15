import React from "react";
import { useTranslation } from "react-i18next";

const DashboardPage: React.FC = () => {
  const [t] = useTranslation("global");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("pages.dashboard.title")}</h1>
      <div>{t("modules.pages.dashboard.content")}</div>
    </div>
  );
};

export default DashboardPage;
