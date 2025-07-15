import { DataTable } from "@/components/DataTable";
import React from "react";
import { useTranslation } from "react-i18next";

const CustomersPage: React.FC = () => {
  const [t] = useTranslation("global");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        {t("modules.pages.customers.title")}
      </h1>
      <div>
        <DataTable />
      </div>
    </div>
  );
};

export default CustomersPage;
