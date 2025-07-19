import React from "react";
import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
import { ROUTES } from "@/constants/routes";
import BackArrowIcon from "@/assets/icons/back-arrow.svg?react";
import PageTitle from "@/components/PageTitle";
import CustomerBasicDetails from "./CustomerBasicDetails";
import StatusLabel from "@/components/StatusLabel";

// interface SearchFormData {
//   customerNumber: string;
//   email: string;
//   phoneNumber: string;
// }

const CustomerCreatePage: React.FC = () => {
  // const [t] = useTranslation("global");
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(ROUTES.CUSTOMERS.LIST);
  };
  const handleInputChange = () => {};
  const handleDateChange = () => {};
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="">
        <div className="flex justify-start items-center gap-3">
          <button
            onClick={handleBack}
            className="text-primary top-1 cursor-pointer"
          >
            <BackArrowIcon width={30} height={30} />
          </button>
          <PageTitle title={"Mohammad Imran"} />
          <StatusLabel
            value="active"
            color="#ff0000"
            className="rounded-full"
          />
        </div>
        <div className="ml-10">Registered on: 20 July 2025</div>
      </div>
      {/* Search Form */}
      <div className="bg-white rounded-lg border ">
        <div className="p-6 border-b-1 text-[18px]">Customer Bio</div>

        <CustomerBasicDetails
          formData={{}}
          handleInputChange={handleInputChange}
          handleDateChange={handleDateChange}
        />
      </div>
    </div>
  );
};

export default CustomerCreatePage;
