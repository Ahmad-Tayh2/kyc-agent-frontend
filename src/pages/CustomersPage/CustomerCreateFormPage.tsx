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
import {
  useCreateCustomer,
  useUploadIdentityDocuments,
  useUploadIncomeDocuments,
} from "@/hooks/useCustomers";
import CustomerBasicDetails from "./CustomerBasicDetails";
import DatePicker from "@/components/shared/DatePicker";
import { ROUTES } from "@/constants/routes";
import { AlertCircle, Upload } from "lucide-react";
import BackArrowIcon from "@/assets/icons/back-arrow.svg?react";
import NextStepArrow from "@/assets/icons/next-step-arrow.svg?react";
import CheckedIcon from "@/assets/icons/checked-icon.svg?react";
import ClockDelayIcon from "@/assets/icons/clock-delay.svg?react";
import UploadIcon from "@/assets/icons/upload-icon.svg?react";
import type {
  CustomerCreateData,
  CustomerIdentityFileData,
  CustomerIncomeFileData,
} from "@/services/customers";
import PageTitle from "@/components/shared/PageTitle";
import ActionButton from "@/components/shared/ActionButton";

type FormStep = "basic" | "identity" | "income";

const CustomerCreateFormPage: React.FC = () => {
  // const [t] = useTranslation("global");
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<FormStep>("basic");
  const [completedSteps, setCompletedSteps] = useState<FormStep[]>([]);
  const [formData, setFormData] = useState<Partial<CustomerCreateData>>({
    first_name: "",
    last_name: "",
    email: "",
    date_of_birth: "",
    street_name: "",
    house_number: "",
    postal_code: "",
    extra_address_details: "",
    city_id: "",
    state_id: "",
    country_id: "",
    gender: undefined,
    country_phone_code: "",
    phone_number: "",
    status: "active",
  });

  const [identityData, setIdentityData] = useState<CustomerIdentityFileData>({
    documentType: "",
    documentNumber: "",
    documentIssueDate: "",
    documentExpiryDate: "",
    frontDocument: null,
    backDocument: null,
  });

  const [incomeData, setIncomeData] = useState<CustomerIncomeFileData>({
    bankStatements: [],
    extraDocuments: [],
    extraDocumentsDescription: "",
  });

  const { mutateAsync: createCustomer } = useCreateCustomer();
  const { mutateAsync: uploadIdentityDocuments } = useUploadIdentityDocuments();
  const { mutateAsync: uploadIncomeDocuments } = useUploadIncomeDocuments();

  const handleInputChange = (
    field: keyof CustomerCreateData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear city when country changes
    if (field === "country_id") {
      setFormData((prev) => ({
        ...prev,
        city_id: "",
      }));
    }
  };

  const handleDateChange = (field: keyof CustomerCreateData, date: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleIdentityChange = (
    field: keyof CustomerIdentityFileData,
    value: any
  ) => {
    setIdentityData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleIncomeChange = (
    field: keyof CustomerIncomeFileData,
    value: any
  ) => {
    setIncomeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (
    field: string,
    files: FileList | null,
    isMultiple = false
  ) => {
    if (!files || files.length === 0) return;

    if (isMultiple) {
      const fileArray = Array.from(files);
      if (field === "bankStatements") {
        handleIncomeChange("bankStatements", fileArray);
      } else if (field === "extraDocuments") {
        handleIncomeChange("extraDocuments", fileArray);
      }
    } else {
      const file = files[0];
      if (field === "frontDocument") {
        handleIdentityChange("frontDocument", file);
      } else if (field === "backDocument") {
        handleIdentityChange("backDocument", file);
      }
    }
  };

  const handleStepClick = (step: FormStep) => {
    // Allow clicking on completed steps or the next available step
    if (completedSteps.includes(step) || canNavigateToStep(step)) {
      setCurrentStep(step);
    }
  };

  const canNavigateToStep = (step: FormStep): boolean => {
    switch (step) {
      case "basic":
        return true; // Always accessible
      case "identity":
        return completedSteps.includes("basic");
      case "income":
        return (
          completedSteps.includes("basic") &&
          completedSteps.includes("identity")
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

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
    console.log("test submit");
    try {
      // Step 1: Create customer with basic data (sync)
      const customerResponse = await createCustomer(
        formData as CustomerCreateData
      );

      const customerId = customerResponse.data?.id;
      if (!customerId) {
        throw new Error("Customer ID not received from server");
      }

      // Step 2: Upload identity documents (async)
      if (identityData.documentType && identityData.documentNumber) {
        uploadIdentityDocuments({ id: customerId, data: identityData }).catch(
          (error) => {
            console.error("Failed to upload identity documents:", error);
          }
        );
      }

      // Step 3: Upload income documents (async)
      if (
        incomeData.bankStatements.length > 0 ||
        incomeData.extraDocuments.length > 0
      ) {
        uploadIncomeDocuments({ id: customerId, data: incomeData }).catch(
          (error) => {
            console.error("Failed to upload income documents:", error);
          }
        );
      }
    } catch (error) {
      console.log(" show response = ", error);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.CUSTOMERS.LIST);
  };

  const steps = [
    {
      number: 1,
      title: "Basic Details",
      name: "basic" as FormStep,
    },
    {
      number: 2,
      title: "Customer Identity",
      name: "identity" as FormStep,
    },
    {
      number: 3,
      title: "Proof of Income",
      name: "income" as FormStep,
    },
  ];

  const renderStepIndicator = () => (
    <div className="flex items-center justify-start p-5">
      <div className="flex items-center space-x-4">
        {steps?.map((step) => (
          <React.Fragment key={step.name}>
            <div
              key={step.name}
              className={`flex items-center p-2 rounded-full ${
                currentStep === step.name
                  ? "text-white bg-primary"
                  : "text-gray-400"
              }`}
              onClick={() => handleStepClick(step.name)}
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
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderCustomerIdentity = () => (
    <div className="space-y-6 px-5">
      <div className="text-[14px] bg-[#FDF2F0] flex items-center gap-2 mb-5 w-fit py-1 px-2 rounded-full">
        <ClockDelayIcon className="text-blue-600" />
        <p>This is not mandatroy at the moment. You can fill them later.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <Label htmlFor="documentType">Document Type</Label>
          <Select
            value={identityData.documentType || ""}
            onValueChange={(value: string) =>
              handleIdentityChange("documentType", value)
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
            name="documentNumber"
            placeholder="Enter document number"
            value={identityData.documentNumber || ""}
            onChange={(e) =>
              handleIdentityChange("documentNumber", e.target.value)
            }
          />
        </div>

        <div>
          <Label htmlFor="documentIssueDate">Document Issue Date</Label>
          <DatePicker
            value={identityData.documentIssueDate || ""}
            onChange={(date: string) =>
              handleIdentityChange("documentIssueDate", date)
            }
          />
        </div>

        <div>
          <Label htmlFor="documentExpiryDate">Document Expiry Date</Label>
          <DatePicker
            value={identityData.documentExpiryDate || ""}
            onChange={(date: string) =>
              handleIdentityChange("documentExpiryDate", date)
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label>Upload the front face of your ID</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) =>
                handleFileUpload("frontDocument", e.target.files)
              }
              className="hidden"
              id="frontDocument"
            />
            <label
              htmlFor="frontDocument"
              className="cursor-pointer text-center"
            >
              <UploadIcon width={90} />
              <p className="text-teal-600 font-medium">Upload document</p>
              <p className="text-sm text-gray-500">
                Drag or click here to upload your document
              </p>
            </label>
          </div>
          {identityData.frontDocument && (
            <p className="text-sm text-green-600">
              ✓ {identityData.frontDocument.name}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label>Upload the back face of your ID</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center flex flex-col items-center justify-center">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileUpload("backDocument", e.target.files)}
              className="hidden"
              id="backDocument"
            />
            <label
              htmlFor="backDocument"
              className="cursor-pointer text-center"
            >
              <UploadIcon width={90} />
              <p className="text-teal-600 font-medium">Upload document</p>
              <p className="text-sm text-gray-500">
                Drag or click here to upload your document
              </p>
            </label>
          </div>
          {identityData.backDocument && (
            <p className="text-sm text-green-600">
              ✓ {identityData.backDocument.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderProofOfIncome = () => (
    <div className="space-y-6 px-5">
      <div className="text-[14px] bg-[#FDF2F0] flex items-center gap-2 mb-5 w-fit py-1 px-2 rounded-full">
        <ClockDelayIcon className="text-blue-600" />
        <p>This is not mandatroy at the moment. You can fill them later.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label>Upload Recent Three Months Bank Statements</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              multiple
              onChange={(e) =>
                handleFileUpload("bankStatements", e.target.files, true)
              }
              className="hidden"
              id="bankStatements"
            />
            <label htmlFor="bankStatements" className="cursor-pointer">
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-teal-600 font-medium">Upload Bank statement</p>
              <p className="text-sm text-gray-500">
                Drag or click here to upload your document
              </p>
            </label>
          </div>
          {incomeData.bankStatements.length > 0 && (
            <div className="space-y-1">
              {incomeData.bankStatements.map((file, index) => (
                <p key={index} className="text-sm text-green-600">
                  ✓ {file.name}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>
              Upload Extra Documents of other income with description
            </Label>
            <AlertCircle className="h-4 w-4 text-gray-400" />
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              multiple
              onChange={(e) =>
                handleFileUpload("extraDocuments", e.target.files, true)
              }
              className="hidden"
              id="extraDocuments"
            />
            <label htmlFor="extraDocuments" className="cursor-pointer">
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-teal-600 font-medium">Upload extra document</p>
              <p className="text-sm text-gray-500">
                Drag or click here to upload your document
              </p>
            </label>
          </div>
          {incomeData.extraDocuments.length > 0 && (
            <div className="space-y-1">
              {incomeData.extraDocuments.map((file, index) => (
                <p key={index} className="text-sm text-green-600">
                  ✓ {file.name}
                </p>
              ))}
            </div>
          )}
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
                disabled: false,
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
    </div>
  );
};

export default CustomerCreateFormPage;
