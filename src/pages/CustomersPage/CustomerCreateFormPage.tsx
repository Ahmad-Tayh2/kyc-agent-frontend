import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCustomer } from "@/hooks/useCustomers";
import CustomerBasicDetails from "./CustomerBasicDetails";
import DatePicker from "@/components/DatePicker";
import { ROUTES } from "@/constants/routes";
import { AlertCircle, Upload } from "lucide-react";
import BackArrowIcon from "@/assets/icons/back-arrow.svg?react";
import NextStepArrow from "@/assets/icons/next-step-arrow.svg?react";
import CheckedIcon from "@/assets/icons/checked-icon.svg?react";
import ClockDelayIcon from "@/assets/icons/clock-delay.svg?react";
import UploadIcon from "@/assets/icons/upload-icon.svg?react";
import type { CustomerCreateData } from "@/services/customers";
import CustomerSuccessModal from "@/components/customers/CustomerSuccessModal";
import PageTitle from "@/components/PageTitle";
import ActionButton from "@/components/ActionButton";

type FormStep = "basic" | "identity" | "income";

const CustomerCreateFormPage: React.FC = () => {
  // const [t] = useTranslation("global");
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<FormStep>("basic");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState<Partial<CustomerCreateData>>({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    streetName: "",
    houseNumber: "",
    city: "",
    postalCode: "",
    country: "",
    gender: undefined,
    phoneNumber: "",
    countryCode: "",
    status: "",
  });
  const { mutateAsync: createCustomer } = useCreateCustomer();
  const handleInputChange = (
    field: keyof CustomerCreateData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear city when country changes
    if (field === "country") {
      setFormData((prev) => ({
        ...prev,
        city: "",
      }));
    }
  };

  const handleDateChange = (field: keyof CustomerCreateData, date: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleNext = () => {
    if (currentStep === "basic") {
      setCurrentStep("identity");
    } else if (currentStep === "identity") {
      setCurrentStep("income");
    }
  };

  const handleBack = () => {
    if (currentStep === "identity") {
      setCurrentStep("basic");
    } else if (currentStep === "income") {
      setCurrentStep("identity");
    }
  };

  const handleSubmit = async () => {
    try {
      await createCustomer(formData as CustomerCreateData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to create customer:", error);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.CUSTOMERS.LIST);
  };

  const handleSuccessContinue = () => {
    setShowSuccessModal(false);
    navigate(ROUTES.CUSTOMERS.LIST);
  };
  const steps = [
    {
      number: 1,
      title: "Basic Details",
      name: "basic",
    },
    {
      number: 2,
      title: "Customer Identity",
      name: "identity",
    },
    {
      number: 3,
      title: "Proof of Income",
      name: "income",
    },
  ];
  const renderStepIndicator = () => (
    <div className="flex items-center justify-start p-5">
      <div className="flex items-center space-x-4">
        {steps?.map((step) => (
          <>
            <div
              key={step.name}
              className={`flex items-center p-2 rounded-full ${
                currentStep === step.name
                  ? "text-white bg-primary"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === step.name
                    ? "text-primary bg-white"
                    : "border-gray-300"
                }`}
              >
                {currentStep === step.name ||
                currentStep == "basic" ||
                step.name === "income" ? (
                  <span>{step.number}</span>
                ) : (
                  <CheckedIcon />
                )}
              </div>
              <span className="ml-2 font-medium">{step.title}</span>
            </div>
            {step.number < 3 && <NextStepArrow />}
          </>
        ))}
      </div>
    </div>
  );

  const renderCustomerIdentity = () => (
    <div className="space-y-6 px-5">
      <InformationMessage />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <Label htmlFor="documentType">Document Type</Label>
          <Select
            value={formData.documentType || ""}
            onValueChange={(value: string) =>
              handleInputChange("documentType", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="national_id">National ID</SelectItem>
              <SelectItem value="drivers_license">Driver's License</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="documentNumber">Document Number</Label>
          <Input
            id="documentNumber"
            placeholder="Enter document number"
            value={formData.documentNumber || ""}
            onChange={(e) =>
              handleInputChange("documentNumber", e.target.value)
            }
          />
        </div>

        <div>
          <Label htmlFor="documentIssueDate">Document Issue Date</Label>
          <DatePicker
            value={formData.documentIssueDate || ""}
            onChange={(date: string) =>
              handleDateChange("documentIssueDate", date)
            }
          />
        </div>

        <div>
          <Label htmlFor="documentExpiryDate">Document Expiry Date</Label>
          <DatePicker
            value={formData.documentExpiryDate || ""}
            onChange={(date: string) =>
              handleDateChange("documentExpiryDate", date)
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label>Upload the front face of your ID</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
            <UploadIcon width={90} />
            <p className="text-teal-600 font-medium">Upload document</p>
            <p className="text-sm text-gray-500">
              Drag or click here to upload your document
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Upload the back face of your ID</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center flex flex-col items-center justify-center">
            <UploadIcon width={90} />
            <p className="text-teal-600 font-medium">Upload document</p>
            <p className="text-sm text-gray-500">
              Drag or click here to upload your document
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProofOfIncome = () => (
    <div className="space-y-6 px-5">
      <InformationMessage />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label>Upload Recent Three Months Bank Statements</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-teal-600 font-medium">Upload Bank statement</p>
            <p className="text-sm text-gray-500">
              Drag or click here to upload your document
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>
              Upload Extra Documents of other income with description
            </Label>
            <AlertCircle className="h-4 w-4 text-gray-400" />
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-teal-600 font-medium">Upload extra document</p>
            <p className="text-sm text-gray-500">
              Drag or click here to upload your document
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-start items-center gap-3">
        <button
          onClick={handleCancel}
          className="text-primary top-1 cursor-pointer"
        >
          <BackArrowIcon width={30} height={30} />
        </button>
        <PageTitle title={"Add New Customer"} />
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg border ">
        <div className="p-6 border-b-1">Add new customer details here.</div>

        {/* Step Indicator */}
        {renderStepIndicator()}
        {currentStep === "basic" && (
          <CustomerBasicDetails
            formData={formData}
            handleInputChange={handleInputChange}
            handleDateChange={handleDateChange}
          />
        )}
        {currentStep === "identity" && renderCustomerIdentity()}
        {currentStep === "income" && renderProofOfIncome()}

        {/* Action Buttons */}
        <div className="flex justify-end items-end gap-4 m-5 pt-5 border-t-1">
          {currentStep === "identity" && (
            <ActionButton title="skip step" onClick={handleBack} type="link" />
          )}
          <ActionButton title="cancel" onClick={handleCancel} type="cancel" />

          {currentStep === "income" ? (
            <ActionButton
              title="save & continue"
              onClick={handleSubmit}
              buttonProps={{
                disabled: true,
              }}
            />
          ) : (
            <ActionButton
              title="save & continue"
              onClick={handleNext}
              className="bg-teal-600 hover:bg-teal-700"
            />
          )}
        </div>
      </div>

      {/* Success Modal */}
      <CustomerSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onContinue={handleSuccessContinue}
      />
    </div>
  );
};

const InformationMessage = () => {
  return (
    <div className="bg-[#fdf2f0] border-red-200 rounded-full w-fit px-2 py-1">
      <div className="flex items-center gap-2">
        <ClockDelayIcon />
        <p className="text-sm w-fit">
          This is not mandatory at the moment. You can fill them later.
        </p>
      </div>
    </div>
  );
};
export default CustomerCreateFormPage;
