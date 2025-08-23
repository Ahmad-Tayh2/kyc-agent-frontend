import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import BackArrowIcon from "@/assets/icons/back-arrow.svg?react";
import NextStepArrow from "@/assets/icons/next-step-arrow.svg?react";
import CheckedIcon from "@/assets/icons/checked-icon.svg?react";
import PageTitle from "@/components/shared/PageTitle";
import ActionButton from "@/components/shared/ActionButton";
import {
  useCountries,
  useCitiesByCountry,
  useStatesByCountry,
} from "@/hooks/data/useAddress";
import { useCreateRecipient } from "@/hooks/data/useRecipients";
import { useCreateBankAccount } from "@/hooks/data/useBankAccounts";
import { useCurrencies } from "@/hooks/data/useCurrency";
import RecipientBasicDetails from "./components/RecipientBasicDetails";

import RecipientBankDetails from "./components/RecipientBankDetails";
import { useGetCustomers } from "@/hooks/data/useCustomers";

type FormStep = "basic" | "bank";

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

  // Bank Details
  bank_details: {
    bank_name: string;
    account_number: string;
    swift_code: string;
    account_type: string;
    iban: string;
    bic_code: string;
    bank_address: string;
    currency_id: string;
    extra_address_details: string;
    state_id: string;
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
    bank_details: {
      bank_name: "",
      account_number: "",
      swift_code: "",
      account_type: "",
      iban: "",
      bic_code: "",
      bank_address: "",
      currency_id: "",
      extra_address_details: "",
      state_id: "",
    },
  });

  const { mutateAsync: createRecipient, isPending: isCreatingRecipient } =
    useCreateRecipient();
  const { mutateAsync: createBankAccount, isPending: isCreatingBankAccount } =
    useCreateBankAccount();

  const { data: countries = [] } = useCountries();
  const { data: cities = [] } = useCitiesByCountry(formData.country_id || "");
  const { data: states = [] } = useStatesByCountry(formData.country_id || null);
  const { data: currencies = [] } = useCurrencies();
  const { data: customersResponse } = useGetCustomers("");

  // Memoize customers data to prevent unnecessary re-renders
  const customersData = useMemo(() => {
    return customersResponse?.data || [];
  }, [customersResponse?.data]);

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

  const stateOptions =
    states?.map((state: any) => ({
      value: state.id,
      label: state.name,
    })) || [];

  const countryPhoneOptions =
    countries?.map((country: any) => ({
      value: country.phone_code,
      label: country.name,
      code: country.phone_code,
      countryCode: country.iso2,
    })) || [];

  const customerOptions = [
    ...customersData?.map((customer: any) => ({
      label: customer.full_name,
      value: customer.id,
    })),
  ];

  const accountTypeOptions = [
    { label: "Savings", value: "savings" },
    { label: "Checking", value: "checking" },
    { label: "Current", value: "current" },
    { label: "Business", value: "business" },
  ];

  const currencyOptions =
    currencies?.map((currency: any) => ({
      label: `${currency.code} - ${currency.name}`,
      value: currency.id.toString(),
    })) || [];

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
      case "bank":
        return completedSteps.includes("basic");
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    if (currentStep === "basic") {
      setCurrentStep("bank");
    }
  };

  const handleSubmit = async () => {
    try {
      // Step 1: Create recipient with basic data (sync)
      const recipientResponse = await createRecipient({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        country_phone_code: formData.country_phone_code,
        phone_number: formData.phone_number,
        address: {
          street_name: formData.street_name,
          house_number: formData.house_number,
          postal_code: formData.postal_code,
          extra_address_details: formData.bank_details.extra_address_details,
          city_id: parseInt(formData.city_id),
          state_id:
            formData.bank_details.state_id &&
            formData.bank_details.state_id !== ""
              ? parseInt(formData.bank_details.state_id)
              : undefined,
          country_id: parseInt(formData.country_id),
        },
        customer_ids: formData.customer_id
          ? [parseInt(formData.customer_id)]
          : [],
        remittance_methods: [],
      });

      const recipientId = recipientResponse.data?.id;
      if (!recipientId) {
        throw new Error("Recipient ID not received from server");
      }

      // Step 2: Create bank account (async) - only if bank details are provided
      if (
        formData.bank_details.bank_name &&
        formData.bank_details.account_number
      ) {
        const bankAccountData = {
          accountable_type: "Recipient" as const,
          accountable_id: recipientId,
          first_name: formData.first_name,
          last_name: formData.last_name,
          street_name: formData.street_name,
          house_number: formData.house_number,
          postal_code: formData.postal_code,
          extra_address_details: formData.bank_details.extra_address_details,
          city_id: parseInt(formData.city_id),
          state_id:
            formData.bank_details.state_id &&
            formData.bank_details.state_id !== ""
              ? parseInt(formData.bank_details.state_id)
              : undefined,
          country_id: parseInt(formData.country_id),
          bank_name: formData.bank_details.bank_name,
          account_number: formData.bank_details.account_number,
          swift_code: formData.bank_details.swift_code,
          currency_id: parseInt(formData.bank_details.currency_id),
          iban_code: formData.bank_details.iban,
          bank_address: formData.bank_details.bank_address,
        };

        await createBankAccount(bankAccountData);
      }

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
            {step.number < 2 && <NextStepArrow />}
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
        <div className="p-6 border-b-1">Add new recipient details here.</div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        {currentStep === "basic" && (
          <RecipientBasicDetails
            formData={formData}
            handleInputChange={handleInputChange}
            handleDateChange={handleDateChange}
            customerOptions={customerOptions}
            countryOptions={countryOptions}
            cityOptions={cityOptions}
            countryPhoneOptions={countryPhoneOptions}
          />
        )}

        {currentStep === "bank" && (
          <RecipientBankDetails
            formData={formData}
            handleBankDetailsChange={handleBankDetailsChange}
            accountTypeOptions={accountTypeOptions}
            currencyOptions={currencyOptions}
            stateOptions={stateOptions}
          />
        )}

        {/* Action Buttons */}
        <div className="flex justify-end items-end gap-4 m-5 pt-5 border-t-1">
          <ActionButton title="cancel" onClick={handleCancel} type="cancel" />

          {currentStep === "bank" ? (
            <ActionButton
              title="save & continue"
              onClick={handleSubmit}
              buttonProps={{
                disabled: isCreatingRecipient || isCreatingBankAccount,
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
