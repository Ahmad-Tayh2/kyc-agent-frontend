// import {
//   Issues,
//   MyCustomers,
//   Profits,
//   Transfers,
//   Wallet,
//   Withdrawals,
// } from "@/components/dashbord";
// import React from "react";

// const DashboardPage: React.FC = () => {
//   return (
//     <div className="space-y-4 flex flex-col h-full">
//       <div className="w-full h-full grid grid-cols-4 grid-rows-custom gap-4 grid-rows-[27%_35%_35%]">
//         <div className="col-span-4">
//           <Wallet />
//         </div>
//         <div className="col-span-2">
//           <Profits />
//         </div>
//         <div className="col-span-2">
//           <Transfers />
//         </div>
//         <div className="col-span-2">
//           <MyCustomers />
//         </div>
//         <div className="col-span-1">
//           <Withdrawals />
//         </div>
//         <div className="col-span-1">
//           <Issues />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;

import {
  Issues,
  MyCustomers,
  Profits,
  Transfers,
  Wallet,
  Withdrawals,
} from "@/components/dashbord";
import React from "react";

const DashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full p-3 sm:p-4 space-y-4">
      <div
        className="
          w-full
          h-full
          grid
          gap-4

          grid-cols-1
          auto-rows-auto

          md:grid-cols-2

          lg:grid-cols-4
          lg:grid-rows-[27%_35%_35%]
        "
      >
        {/* Wallet */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <Wallet />
        </div>

        {/* Profits */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2">
          <Profits />
        </div>

        {/* Transfers */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2">
          <Transfers />
        </div>

        {/* Customers */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2">
          <MyCustomers />
        </div>

        {/* Withdrawals */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1">
          <Withdrawals />
        </div>

        {/* Issues */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1">
          <Issues />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
