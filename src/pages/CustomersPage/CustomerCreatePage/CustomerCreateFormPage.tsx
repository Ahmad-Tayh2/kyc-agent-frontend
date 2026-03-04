import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
import FileIcon from "@/assets/icons/file-icon.svg?react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import BackArrowIcon from "@/assets/icons/back-arrow.svg?react";
import CheckedIcon from "@/assets/icons/checked-icon.svg?react";
import ClockDelayIcon from "@/assets/icons/clock-delay.svg?react";
import NextStepArrow from "@/assets/icons/next-step-arrow.svg?react";
import UploadIcon from "@/assets/icons/upload-icon.svg?react";
import ActionButton from "@/components/shared/ActionButton";
import DatePicker from "@/components/shared/DatePicker";
import PageTitle from "@/components/shared/PageTitle";
import { ROUTES } from "@/constants/routes";
import {
  useCreateCustomer,
  useUploadIdentityDocuments,
  useUploadIncomeDocuments,
} from "@/hooks/data/useCustomers";
import type {
  CustomerCreateData,
  CustomerIdentityFileData,
  CustomerIncomeFileData,
} from "@/services/customers";
import { AlertCircle } from "lucide-react";
import CustomerBasicDetails from "./components/CustomerBasicDetails";
// import { SingleSelectDropdown } from "@/components/shared/SingleSelectDropdown";
import ErrorField from "@/components/shared/ErrorField";
import SearchableSelect from "@/components/ui/searchable-select";
import {
  customerSchema,
  identitySchema,
} from "../CustomerEditPage/CustomerEditPage";

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
    document_type: "",
    document_number: "",
    issuing_date: "",
    expiry_date: "",
    front_image: null,
    back_image: null,
  });

  const [incomeData, setIncomeData] = useState<CustomerIncomeFileData[]>([]);
  useEffect(() => {
    console.log("incomeeess = ", incomeData);
  }, [incomeData]);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [identityErrors, setIdentityErrors] = useState<Record<string, string>>(
    {},
  );
  const validateIdentityData = () => {
    const result = identitySchema.safeParse(identityData);

    if (!result.success) {
      const errors: any = result.error.flatten().fieldErrors;
      setIdentityErrors(errors);
      return false;
    }
    setIdentityErrors({});
    return true;
  };

  const { mutateAsync: createCustomer, isPending: isCreationPending } =
    useCreateCustomer();
  const {
    mutateAsync: uploadIdentityDocuments,
    isPending: isIdentityDocsPending,
  } = useUploadIdentityDocuments({
    onSuccess: () => {
      setIdentityErrors({});
    },
    onCreateError: (errorsData: any) => setIdentityErrors(errorsData),
  });
  const { mutateAsync: uploadIncomeDocuments, isPending: isIcomeDocsPending } =
    useUploadIncomeDocuments();

  const handleInputChange = (
    field: keyof CustomerCreateData,
    value: string,
  ) => {
    // Clear city when country changes
    if (field === "country_id") {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        city_id: "",
        state_id: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
    // Clear error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev: Record<string, string[]>) => ({
        ...prev,
        [field]: [],
      }));
    }
  };

  const handleDateChange = (field: keyof CustomerCreateData, date: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }));
    // Clear error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev: Record<string, string[]>) => ({
        ...prev,
        [field]: [],
      }));
    }
  };

  const handleIdentityChange = (
    field: keyof CustomerIdentityFileData,
    value: any,
  ) => {
    setIdentityData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (identityErrors[field]) {
      setIdentityErrors((prev: Record<string, string>) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleUploadIncomeFile = (files: FileList | null, type: string) => {
    console.log(" files = ", files);
    console.log(" type = ", type);
    if (!files || files?.length === 0 || !type) return;
    setIncomeData((prev: any) => {
      const updatedData: any[] = [];
      let exist = false;
      if (prev?.length) {
        console.log(" yes find one = =  = = = = = ");
        for (const item of prev) {
          if (item.document_type === type) {
            updatedData?.push({
              document: files,
              document_type: type,
            });
            exist = true;
          } else {
            updatedData?.push(item);
          }
          console.log(" updatedData contains *******", updatedData);
        }
        if (!exist) {
          updatedData?.push({
            document: files,
            document_type: type,
          });
        }
      } else {
        updatedData?.push({
          document: files,
          document_type: type,
        });
      }

      return updatedData;
    });
  };
  const handleFileUpload = (
    field: string,
    files: FileList | null,
    isMultiple = false,
  ) => {
    if (!files || files.length === 0) return;

    if (isMultiple) {
      // const fileArray = Array.from(files);
      // if (field === "bankStatements") {
      //   handleIncomeChange("bankStatements", fileArray);
      // } else if (field === "extraDocuments") {
      //   handleIncomeChange("extraDocuments", fileArray);
      // }
    } else {
      const file = files[0];
      if (field === "front_image") {
        handleIdentityChange("front_image", file);
      } else if (field === "back_image") {
        handleIdentityChange("back_image", file);
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
  const [customerId, setCustomerId] = useState(null);

  const handleNext = async () => {
    if (currentStep === "basic") {
      const payloadToValidate: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email ?? "",
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        country_id: formData.country_id,
        city_id: formData.city_id,
        street_name: formData.street_name,
        house_number: formData.house_number,
        postal_code: formData.postal_code ?? "",
        phone_number: formData.phone_number,
        country_phone_code: formData.country_phone_code,
        // status: formData.status,
      };
      const validationResult = customerSchema.safeParse(payloadToValidate);

      if (!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors;
        console.log("check ==== errors = ", errors);

        // // Optional: show toast or inline messages
        // toast.error("Please fix the highlighted errors before saving.");
        setValidationErrors(errors); // We'll define this state below
        return;
      }
      // Step 1: Create customer with basic data (sync)

      const customerResponse = await createCustomer(
        formData as CustomerCreateData,
      );
      if (customerResponse.data?.id) {
        setCustomerId(customerResponse.data?.id);
        // Mark current step as completed
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps((prev) => [...prev, currentStep]);
        }
        setCurrentStep("identity");
      }
    } else if (currentStep === "identity") {
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }
      //validate identity docs
      const isIdentityValid = validateIdentityData();
      if (!isIdentityValid) {
        // optional: toast.error("Please fix errors before saving");
        return;
      }
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
  const handleSkip = () => {
    if (currentStep === "identity") {
      setCurrentStep("income");
    }
  };
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const handleSubmitIncome = async () => {
    try {
      if (!customerId) {
        throw new Error("Customer ID not received from server");
      }
      setIsSubmitDisabled(true);
      let identityResult: any = undefined;
      // Step 2: Upload identity documents (async)
      if (identityData.document_type && identityData.document_number) {
        identityResult = await uploadIdentityDocuments({
          id: customerId,
          data: identityData,
        }).catch((error) => {
          console.error("Failed to upload identity documents:", error);
        });
        console.log(" result identityResult  = ", identityResult);
      }

      // Step 3: Upload income documents (async)
      if (incomeData?.length) {
        for (const data of incomeData) {
          await uploadIncomeDocuments({ id: customerId, data }).catch(
            (error) => {
              console.error("Failed to upload income documents:", error);
            },
          );
        }
      }
      navigate(ROUTES.CUSTOMERS.LIST);
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

  const documentExpiryEndMonth = new Date(
    new Date().getFullYear() + 20,
    11,
    31,
  );

  const renderStepIndicator = () => (
    <div className="flex items-center justify-start p-5 overflow-auto">
      <div className="flex items-center space-x-4 w-max">
        {steps?.map((step) => (
          <React.Fragment key={step.name}>
            <div
              key={step.name}
              className={`flex items-center p-1 sm:p-2 rounded-full whitespace-nowrap text-xs sm:text-sm md:text-base  ${
                (completedSteps.includes(step?.name) ||
                  canNavigateToStep(step?.name)) &&
                "cursor-pointer"
              } ${
                currentStep === step.name
                  ? "text-white bg-primary"
                  : "text-gray-400"
              }`}
              onClick={() => handleStepClick(step.name)}
            >
              <div
                className={`w-5 sm:w-8 h-5 sm:h-8 rounded-full flex items-center justify-center ${
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

  const renderCustomerIdentity = () => {
    const documentTypesOptions = [
      { label: "Passport", value: "passport" },
      { label: "National ID", value: "id_card" },
      { label: "Residence Permit ", value: "residence_permit" },
      { label: "Driver's License", value: "driving_license" },
    ];
    return (
      <div className="space-y-6 px-5">
        <div className="text-[14px] bg-[#FDF2F0] flex items-center gap-2 mb-5 w-fit py-1 px-2 rounded-full">
          <ClockDelayIcon className="text-blue-600" />
          <p>
            This is not mandatroy at the moment. You can skip the step and fill
            them later.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <SearchableSelect
              label="Document Type"
              options={documentTypesOptions}
              value={identityData?.document_type || ""}
              onChange={(value: string | number) =>
                handleIdentityChange("document_type", String(value))
              }
              required
              error={identityErrors?.document_type}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="documentNumber">Document Number</Label>
            <Input
              id="documentNumber"
              name="documentNumber"
              placeholder="Enter document number"
              value={identityData.document_number || ""}
              onChange={(e) =>
                handleIdentityChange("document_number", e.target.value)
              }
            />
            {identityErrors?.document_number && (
              <ErrorField errors={[identityErrors?.document_number[0]]} />
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="documentIssueDate">Document Issue Date</Label>
            <DatePicker
              value={identityData.issuing_date || ""}
              onChange={(date: string) =>
                handleIdentityChange("issuing_date", date)
              }
            />
            {identityErrors?.issuing_date && (
              <ErrorField errors={[identityErrors?.issuing_date[0]]} />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="documentExpiryDate">Document Expiry Date</Label>
            <DatePicker
              value={identityData.expiry_date || ""}
              onChange={(date: string) =>
                handleIdentityChange("expiry_date", date)
              }
              endMonth={documentExpiryEndMonth}
              disabledBefore={new Date()}
            />

            {identityErrors?.expiry_date && (
              <ErrorField errors={[identityErrors?.expiry_date[0]]} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label>Upload the front face of your ID</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) =>
                  handleFileUpload("front_image", e.target.files)
                }
                className="hidden"
                id="front_image"
              />
              <label
                htmlFor="front_image"
                className="p-6 cursor-pointer text-center flex flex-col items-center justify-center h-full w-full"
              >
                <UploadIcon width={90} />
                <p className="text-teal-600 font-medium">Upload document</p>
                <p className="text-sm text-gray-500">
                  Drag or click here to upload your document
                </p>
              </label>
            </div>
            {identityErrors?.front_image && (
              <ErrorField errors={[identityErrors?.front_image[0]]} />
            )}
            {identityData?.front_image && (
              <div className="flex items-center gap-2 border border-[#656565] rounded-md p-2 mt-2">
                <span>
                  {/* You can use an icon here */}
                  <FileIcon color="var(--primary)" />
                </span>
                <div>
                  <div className="font-medium">
                    {identityData?.front_image?.name}
                  </div>
                  <div className="text-xs text-[#656565]">
                    {(identityData?.front_image?.size / 1024).toFixed(0)}{" "}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Label>Upload the back face of your ID</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg text-center flex flex-col items-center justify-center">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload("back_image", e.target.files)}
                className="hidden"
                id="back_image"
              />
              <label
                htmlFor="back_image"
                className="p-6 cursor-pointer text-center flex flex-col items-center justify-center w-full h-full"
              >
                <UploadIcon width={90} />
                <p className="text-teal-600 font-medium">Upload document</p>
                <p className="text-sm text-gray-500">
                  Drag or click here to upload your document
                </p>
              </label>
            </div>
            {identityData?.back_image && (
              <div className="flex items-center gap-2 border border-[#656565] rounded-md p-2 mt-2">
                <span>
                  {/* You can use an icon here */}
                  <FileIcon color="var(--primary)" />
                </span>
                <div>
                  <div className="font-medium">
                    {identityData?.back_image?.name}
                  </div>
                  <div className="text-xs text-[#656565]">
                    {(identityData?.back_image?.size / 1024).toFixed(0)}{" "}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderProofOfIncome = () => (
    <div className="space-y-6 px-5">
      <div className="text-[14px] bg-[#FDF2F0] flex items-center gap-2 mb-5 w-fit py-1 px-2 rounded-full">
        <ClockDelayIcon className="text-blue-600" />
        <p>This is not mandatroy at the moment. You can fill them later.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label>Upload Recent Three Months Bank Statements</Label>

          <div className="border-2 border-dashed border-gray-300 rounded-lg text-center flex flex-col items-center justify-center">
            <input
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              multiple
              onChange={(e) =>
                // handleFileUpload("bankStatements", e.target.files, true)
                {
                  handleUploadIncomeFile(
                    e.target.files,
                    "recent_three_months_income",
                  );
                }
              }
              className="hidden"
              id="bankStatements"
            />
            <label
              htmlFor="bankStatements"
              className="p-6 cursor-pointer text-center flex flex-col items-center justify-center w-full h-full"
            >
              <UploadIcon width={90} />
              <p className="text-teal-600 font-medium">Upload Bank statement</p>
              <p className="text-sm text-gray-500">
                Drag or click here to upload your document
              </p>
            </label>
          </div>
          {incomeData?.find(
            (data: any) => data?.document_type === "recent_three_months_income",
          )?.document?.length && (
            <div className="flex items-center gap-2 border border-[#656565] rounded-md p-2 mt-2">
              <span>
                {/* You can use an icon here */}
                <FileIcon color="var(--primary)" />
              </span>
              <div>
                <div className="font-medium">
                  {
                    incomeData?.find(
                      (data: any) =>
                        data?.document_type === "recent_three_months_income",
                    )?.document?.[0]?.name
                  }
                </div>
                {/* <div className="text-xs text-[#656565]">
                  {(
                    incomeData?.find(
                      (data: any) =>
                        data?.document_type === "recent_three_months_income"
                    )?.document?.[0]?.size / 1024
                  ).toFixed(0)}{" "}
                </div> */}
              </div>
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
          <div className="border-2 border-dashed border-gray-300 rounded-lg text-center">
            <input
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              multiple
              onChange={(e) =>
                // handleFileUpload("extraDocuments", e.target.files, true)
                handleUploadIncomeFile(e.target.files, "additional_proof")
              }
              className="hidden"
              id="extraDocuments"
            />
            {/* <label htmlFor="extraDocuments" className="cursor-pointer">
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-teal-600 font-medium">Upload extra document</p>
              <p className="text-sm text-gray-500">
                Drag or click here to upload your document
              </p>
            </label> */}
            <label
              htmlFor="extraDocuments"
              className="p-6 cursor-pointer text-center flex flex-col items-center justify-center"
            >
              <UploadIcon width={90} />
              <p className="text-teal-600 font-medium">Upload extra document</p>
              <p className="text-sm text-gray-500">
                Drag or click here to upload your document
              </p>
            </label>
          </div>
          {incomeData?.find(
            (data: any) => data?.document_type === "additional_proof",
          )?.document?.length && (
            <div className="flex items-center gap-2 border border-[#656565] rounded-md p-2 mt-2">
              <span>
                {/* You can use an icon here */}
                <FileIcon color="var(--primary)" />
              </span>
              <div>
                <div className="font-medium">
                  {
                    incomeData?.find(
                      (data: any) => data?.document_type === "additional_proof",
                    )?.document?.[0]?.name
                  }
                </div>
                {/* <div className="text-xs text-[#656565]">
                  {(
                    incomeData?.find(
                      (data: any) =>
                        data?.document_type === "additional_proof"
                    )?.document?.[0]?.size / 1024
                  ).toFixed(0)}{" "}
                </div> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  // const disableContinue = useMemo(() => {
  //   if (currentStep === "basic") {
  //     if (
  //       !formData?.first_name ||
  //       !formData?.last_name ||
  //       !formData?.email ||
  //       !formData?.date_of_birth ||
  //       !formData?.street_name ||
  //       !formData?.house_number ||
  //       !formData?.country_id ||
  //       !formData?.city_id ||
  //       !formData?.gender ||
  //       !formData?.country_phone_code ||
  //       !formData?.phone_number
  //     )
  //       return true;
  //   }
  //   return false;
  // }, [currentStep, formData]);

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
            validationErrors={validationErrors}
          />
          // <CustomerBasicDetails
          //   formData={formData}
          //   handleInputChange={handleInputChange}
          //   handleDateChange={handleDateChange}
          // />
        )}
        {currentStep === "identity" && renderCustomerIdentity()}
        {currentStep === "income" && renderProofOfIncome()}

        {/* Action Buttons */}
        <div className="flex justify-end items-end gap-4 m-5 pt-5 border-t-1">
          <ActionButton
            title="Back"
            onClick={handleBack}
            type="cancel"
            className="mr-auto"
            disabled={currentStep === "basic"}
          />
          {currentStep === "identity" && (
            <ActionButton title="skip step" onClick={handleSkip} type="link" />
          )}
          <ActionButton title="cancel" onClick={handleCancel} type="cancel" />
          {currentStep === "income" ? (
            <ActionButton
              title="save & continue"
              onClick={handleSubmitIncome}
              disabled={
                isSubmitDisabled ||
                isCreationPending ||
                isIdentityDocsPending ||
                isIcomeDocsPending
              }
            />
          ) : (
            <ActionButton
              title="save & continue"
              onClick={handleNext}
              className="bg-teal-600 hover:bg-teal-700"
              disabled={isCreationPending}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerCreateFormPage;
