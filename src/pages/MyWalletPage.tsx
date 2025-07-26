import React from "react";
import { useTranslation } from "react-i18next";

const MyWalletPage: React.FC = () => {
  const { t } = useTranslation("global");
  
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("modules.pages.myWallet.title")}</h1>
      <div>{t("modules.pages.myWallet.content")}</div>
    </div>
  );
};

export default MyWalletPage; 