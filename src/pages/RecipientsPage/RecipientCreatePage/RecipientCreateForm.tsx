import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import BackArrowIcon from "@/assets/icons/back-arrow.svg?react";
import NextStepArrow from "@/assets/icons/next-step-arrow.svg?react";
import CheckedIcon from "@/assets/icons/checked-icon.svg?react";
import PageTitle from "@/components/shared/PageTitle";
import ActionButton from "@/components/shared/ActionButton";
import { useCountries, useCitiesByCountry } from "@/hooks/data/useAddress";
import RecipientBasicDetails from "./components/RecipientBasicDetails";
import RecipientRemittanceMethods from "./components/RecipientRemittanceMethods";
import RecipientBankDetails from "./components/RecipientBankDetails";

type FormStep = "basic" | "remittance" | "bank";

interface RecipientFormData {
  // Basic Details
  customer_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  street_name: string;
  house_number: string;
  postal_code: string;
  city_id: string;
  country_id: string;
  gender: string;
  country_phone_code: string;
  phone_number: string;

  // Mobile Wallet Import
  import_mobile_wallet: boolean;
  mobile_wallet_type: string;
  mobile_wallet_number: string;
  wallet_account_number: string;

  // Remittance Methods
  remittance_methods: string[];
  cash_pickup_addresses: Array<{
    id: string;
    name: string;
    phone: string;
    address: string;
    selected: boolean;
  }>;
  wallet_accounts: Array<{
    id: string;
    wallet_type: string;
    phone: string;
    account_number: string;
    selected: boolean;
  }>;
  search_available_wallets: boolean;
  search_mobile_number: string;
  search_wallet_account: string;

  // Bank Details
  bank_details: {
    bank_name: string;
    account_number: string;
    swift_code: string;
    account_type: string;
    iban: string;
    bic_code: string;
    bank_address: string;
  };
}

const RecipientCreateForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<FormStep>("basic");
  const [completedSteps, setCompletedSteps] = useState<FormStep[]>([]);

  const [formData, setFormData] = useState<RecipientFormData>({
    first_name: "",
    last_name: "",
    email: "",
    date_of_birth: "",
    street_name: "",
    house_number: "",
    postal_code: "",
    city_id: "",
    country_id: "",
    gender: "",
    country_phone_code: "",
    phone_number: "",
    import_mobile_wallet: false,
    mobile_wallet_type: "",
    mobile_wallet_number: "",
    wallet_account_number: "",
    remittance_methods: [],
    cash_pickup_addresses: [
      {
        id: "1",
        name: "Ahmed Tayeh",
        phone: "+97 70876547678",
        address: "123, Street name, city name, country name, 770017",
        selected: true,
      },
    ],
    wallet_accounts: [
      {
        id: "1",
        wallet_type: "ZAAD",
        phone: "+9784948584949",
        account_number: "45678647435678",
        selected: true,
      },
    ],
    search_available_wallets: false,
    search_mobile_number: "",
    search_wallet_account: "",
    bank_details: {
      bank_name: "",
      account_number: "",
      swift_code: "",
      account_type: "",
      iban: "",
      bic_code: "",
      bank_address: "",
    },
  });

  const { data: countries = [] } = useCountries();
  const { data: cities = [] } = useCitiesByCountry(formData.country_id || "");

  const countryOptions =
    countries?.map((country: any) => ({
      value: country.id,
      label: country.name,
    })) || [];

  const cityOptions =
    cities?.map((city: any) => ({
      value: city.id,
      label: city.name,
    })) || [];

  const countryPhoneOptions =
    countries?.map((country: any) => ({
      value: country.phone_code,
      label: country.name,
      code: country.phone_code,
      countryCode: country.iso2,
    })) || [];

  const customerOptions = [
    { value: "1", label: "Mohammad Imran (my self)" },
    { value: "2", label: "Hassan Ali" },
  ];

  const mobileWalletOptions = [
    { value: "zaad", label: "ZAAD" },
    { value: "e_dahab", label: "E-Dahab" },
    { value: "waafi", label: "Waafi" },
  ];

  const accountTypeOptions = [
    { label: "Savings", value: "savings" },
    { label: "Checking", value: "checking" },
    { label: "Current", value: "current" },
    { label: "Business", value: "business" },
  ];

  const handleInputChange = (field: string, value: any) => {
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

  const handleBankDetailsChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      bank_details: {
        ...prev.bank_details,
        [field]: value,
      },
    }));
  };

  const handleDateChange = (field: string, date: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleStepClick = (step: FormStep) => {
    if (completedSteps.includes(step) || canNavigateToStep(step)) {
      setCurrentStep(step);
    }
  };

  const canNavigateToStep = (step: FormStep): boolean => {
    switch (step) {
      case "basic":
        return true;
      case "remittance":
        return completedSteps.includes("basic");
      case "bank":
        return (
          completedSteps.includes("basic") &&
          completedSteps.includes("remittance")
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    if (currentStep === "basic") {
      setCurrentStep("remittance");
    } else if (currentStep === "remittance") {
      setCurrentStep("bank");
    }
  };

  const handleBack = () => {
    if (currentStep === "remittance") {
      setCurrentStep("basic");
    } else if (currentStep === "bank") {
      setCurrentStep("remittance");
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting recipient data:", formData);
      // TODO: Implement API call to create recipient
      // await createRecipient(formData);
      navigate(ROUTES.RECIPIENTS.LIST);
    } catch (error) {
      console.error("Error creating recipient:", error);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.RECIPIENTS.LIST);
  };

  const steps = [
    {
      number: 1,
      title: "Basic Details",
      name: "basic" as FormStep,
    },
    {
      number: 2,
      title: "Remittance Methods",
      name: "remittance" as FormStep,
    },
    {
      number: 3,
      title: "Bank Details (Optional)",
      name: "bank" as FormStep,
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
                step.name === "bank" ? (
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
        <PageTitle title="Add New Recipients" />
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b-1">Add new customer details here.</div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        {currentStep === "basic" && (
          <RecipientBasicDetails
            formData={formData}
            handleInputChange={handleInputChange}
            handleDateChange={handleDateChange}
            customerOptions={customerOptions}
            mobileWalletOptions={mobileWalletOptions}
            countryOptions={countryOptions}
            cityOptions={cityOptions}
            countryPhoneOptions={countryPhoneOptions}
          />
        )}

        {currentStep === "remittance" && (
          <RecipientRemittanceMethods
            formData={formData}
            handleInputChange={handleInputChange}
            countryPhoneOptions={countryPhoneOptions}
          />
        )}

        {currentStep === "bank" && (
          <RecipientBankDetails
            formData={formData}
            handleBankDetailsChange={handleBankDetailsChange}
            accountTypeOptions={accountTypeOptions}
          />
        )}

        {/* Action Buttons */}
        <div className="flex justify-end items-end gap-4 m-5 pt-5 border-t-1">
          {currentStep === "remittance" && (
            <ActionButton title="skip step" onClick={handleBack} type="link" />
          )}
          <ActionButton title="cancel" onClick={handleCancel} type="cancel" />

          {currentStep === "bank" ? (
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

export default RecipientCreateForm;
