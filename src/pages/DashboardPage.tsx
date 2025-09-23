import {
  Issues,
  MyCustomers,
  Profits,
  Transfers,
  Wallet,
  Withdrawals,
} from "@/components/dashbord";
import React from "react";
// import { useTranslation } from "react-i18next";

const DashboardPage: React.FC = () => {
  // const [t] = useTranslation("global");

  return (
    <div className="space-y-4 flex flex-col h-full">
      {/* <h1 className="text-2xl font-bold">
        {t("modules.pages.dashboard.title")}
      </h1> */}
      <div className="w-full h-full grid grid-cols-4 grid-rows-custom gap-4 grid-rows-[27%_35%_35%]">
        <div className="col-span-4">
          <Wallet />
        </div>
        <div className="col-span-2">
          <Profits />
        </div>
        <div className="col-span-2">
          <Transfers />
        </div>
        <div className="col-span-2">
          <MyCustomers />
        </div>
        <div className="col-span-1">
          <Withdrawals />
        </div>
        <div className="col-span-1">
          <Issues />
        </div>
      </div>
    </div>
  );
};
//

export default DashboardPage;
