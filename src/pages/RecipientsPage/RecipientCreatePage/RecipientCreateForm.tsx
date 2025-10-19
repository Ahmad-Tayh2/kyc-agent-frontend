import BackArrowIcon from "@/assets/icons/back-arrow.svg?react";
import CheckedIcon from "@/assets/icons/checked-icon.svg?react";
import NextStepArrow from "@/assets/icons/next-step-arrow.svg?react";
import ActionButton from "@/components/shared/ActionButton";
import PageTitle from "@/components/shared/PageTitle";
import { ROUTES } from "@/constants/routes";
import {
  useCitiesByCountry,
  useCountries,
  useStatesByCountry,
} from "@/hooks/data/useAddress";
import { useCreateBankAccount } from "@/hooks/data/useBankAccounts";
import { useCurrencies } from "@/hooks/data/useCurrency";
import { useGetCustomers } from "@/hooks/data/useCustomers";
import { usePayoutLocations } from "@/hooks/data/usePayoutLocation";
import { useCreateRecipientPayout } from "@/hooks/data/useRecipientPayout";
import { useCreateRecipientRemittanceMethod } from "@/hooks/data/useRecipientRemittanceMethods";
import {
  useCreateRecipient,
  useCreateRecipientIntermediate,
} from "@/hooks/data/useRecipients";
import {
  useRemittanceMethods,
  useVerifyAccountInfo,
} from "@/hooks/data/useRemittanceMethod";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import RecipientBankDetails from "./components/RecipientBankDetails";
import RecipientBasicDetails from "./components/RecipientBasicDetails";
import RemittanceMethodStep from "./components/RemittanceMethodStep";

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
  rm_service_providers: [
    {
      rm_sp_id: number;
      account_number?: string;
      country_phone_code?: string;
      phone_number?: string;
    }
  ];

  // Remittance Method Details
  remittance_methods: Array<{
    id?: string; // Temporary ID for UI management
    remittance_method_id: number;
    verification_status: "pending" | "verified" | "failed";
    verification_data?: {
      account_name_prefix: string;
      account_id_prefix: string;
    };
    service_data?: {
      phone_number: string;
      country_phone_code: string;
    };
    account_number?: string;
    added_to_recipient?: boolean;
  }>;

  // Payout Agent Details
  payout_agents: Array<{
    id: string; // Temporary ID for UI management
    payout_agent_id: number;
    account_number: string;
  }>;

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
  const [recipientId, setRecipientId] = useState<number | null>(null);

  const [searchParams] = useSearchParams();
  const customerIdQuery = searchParams.get("customer");

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
    rm_service_providers: [
      {
        rm_sp_id: 1,
        // account_number: "1234567890",
        // country_phone_code: "+1",
        // phone_number: "5551234567",
      },
    ],
    remittance_methods: [],
    payout_agents: [],
  });

  console.log("formData:", formData.payout_agents);

  const { isPending: isCreatingRecipient } = useCreateRecipient();
  const {
    mutateAsync: createRecipientIntermediate,
    isPending: isCreatingRecipientIntermediate,
  } = useCreateRecipientIntermediate();
  const { mutateAsync: createBankAccount, isPending: isCreatingBankAccount } =
    useCreateBankAccount();
  const {
    mutateAsync: createRecipientPayout,
    isPending: isCreatingRecipientPayout,
  } = useCreateRecipientPayout();
  const {
    mutateAsync: createRecipientRemittanceMethod,
    isPending: isAddingRemittanceMethod,
  } = useCreateRecipientRemittanceMethod();

  const { data: countries = [] } = useCountries();
  const { data: cities = [] } = useCitiesByCountry(formData.country_id || "");
  const { data: states = [] } = useStatesByCountry(formData.country_id || null);
  const { data: currencies = [] } = useCurrencies();
  const { data: customersResponse } = useGetCustomers("");
  const { data: remittanceMethods = [] } = useRemittanceMethods();
  const { mutateAsync: verifyAccountInfo, isPending: isVerifying } =
    useVerifyAccountInfo();
  const { data: payoutLocations = [] } = usePayoutLocations();

  // Memoize customers data to prevent unnecessary re-renders
  const customersData = useMemo(() => {
    return customersResponse?.data || [];
  }, [customersResponse?.data]);

  const countryOptions =
    countries?.map((country: any) => ({
      value: country.id,
      label: country.name,
      iso2: country.iso2,
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

  const handleAddRemittanceMethod = (methodId: number) => {
    const newId = Date.now().toString(); // Simple unique ID
    setFormData((prev) => ({
      ...prev,
      remittance_methods: [
        ...prev.remittance_methods,
        {
          id: newId,
          remittance_method_id: methodId,
          verification_status: "pending" as const,
        },
      ],
    }));
  };

  const handleUpdateRemittanceMethod = (
    id: string,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      remittance_methods: prev.remittance_methods.map((method) => {
        if (method.id === id) {
          if (field.includes(".")) {
            const [parentField, childField] = field.split(".");
            const parentValue = method[parentField as keyof typeof method];
            return {
              ...method,
              [parentField]: {
                ...(parentValue && typeof parentValue === "object"
                  ? (parentValue as Record<string, unknown>)
                  : {}),
                [childField]: value,
              },
            };
          } else {
            return {
              ...method,
              [field]: value,
            };
          }
        }
        return method;
      }),
    }));
  };

  const handleRemoveRemittanceMethod = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      remittance_methods: prev.remittance_methods.filter(
        (method) => method.id !== id
      ),
    }));
  };

  const handleAddMethodToRecipient = async (id: string) => {
    if (!recipientId) {
      console.error("Cannot add remittance method: No recipient ID available");
      return;
    }

    const methodData = formData.remittance_methods.find(
      (method) => method.id === id
    );

    if (!methodData) {
      console.error("Method data not found");
      return;
    }

    try {
      const requestData = {
        recipient_id: recipientId,
        remittance_method_id: methodData.remittance_method_id,
        account_number: methodData.account_number || undefined,
        country_phone_code:
          methodData.service_data?.country_phone_code || undefined,
        phone_number: methodData.service_data?.phone_number || undefined,
      };

      await createRecipientRemittanceMethod(requestData);

      // Update UI state to show it's been added
      setFormData((prev) => ({
        ...prev,
        remittance_methods: prev.remittance_methods.map((method) =>
          method.id === id ? { ...method, added_to_recipient: true } : method
        ),
      }));
    } catch (error) {
      console.error("Failed to add remittance method to recipient:", error);
      // You could add toast notification here for user feedback
    }
  };

  const handleAddPayoutAgent = (payoutAgentId: number) => {
    const newId = Date.now().toString(); // Simple unique ID
    setFormData((prev) => ({
      ...prev,
      payout_agents: [
        ...prev.payout_agents,
        {
          id: newId,
          payout_agent_id: payoutAgentId,
          account_number: "",
        },
      ],
    }));
  };

  const handleRemovePayoutAgent = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      payout_agents: prev.payout_agents.filter((agent) => agent.id !== id),
    }));
  };

  const handleVerifyAccount = async (id: string) => {
    const methodData = formData.remittance_methods.find(
      (method) => method.id === id
    );
    const selectedMethod = remittanceMethods?.data?.find(
      (method: any) => method.id === methodData?.remittance_method_id
    );

    if (!selectedMethod || !selectedMethod.validator_id || !methodData) {
      console.log("Missing required data for verification");
      return;
    }

    try {
      // Check for validator name, fallback to validation_type if available
      const validationType =
        selectedMethod.validator?.name || selectedMethod.validation_type || "";

      if (!validationType) {
        console.error("No validation type found for method:", selectedMethod);
        toast.error("Validation type not configured for this method");
        return;
      }

      const verificationRequest = {
        validation_type: validationType,
        service_data: {
          serviceCode: "00003", // Default service code as specified
          phoneNumber: `+${methodData.service_data?.country_phone_code?.replace(
            /^\+/,
            ""
          )}${methodData.service_data?.phone_number}`,
        },
        verification_data: {
          expected_account_name_prefix:
            methodData.verification_data?.account_name_prefix || "",
          expected_account_id_prefix:
            methodData.verification_data?.account_id_prefix || "",
        },
      };

      const response = await verifyAccountInfo(verificationRequest);

      // Check the actual API response structure
      if (response.data?.status === "success") {
        handleUpdateRemittanceMethod(id, "verification_status", "verified");
      } else {
        handleUpdateRemittanceMethod(id, "verification_status", "failed");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      handleUpdateRemittanceMethod(id, "verification_status", "failed");
    }
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
        return completedSteps.includes("remittance");
      default:
        return false;
    }
  };
  useEffect(() => {
    if (customerIdQuery && customerOptions?.length > 0) {
      const found = customerOptions?.find((item: any) => {
        return String(item?.value) === String(customerIdQuery);
      });
      if (found) handleInputChange("customer_id", found?.value);
    }
  }, [customerIdQuery, customerOptions]);
  const handleNext = async () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    if (currentStep === "basic") {
      // Create recipient when moving from basic to remittance step
      if (!recipientId) {
        try {
          const recipientResponse = await createRecipientIntermediate({
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
              extra_address_details:
                formData.bank_details.extra_address_details,
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
            rm_service_providers: [],
          });

          const newRecipientId = recipientResponse.data?.id;
          if (newRecipientId) {
            setRecipientId(newRecipientId);
          }
        } catch (error) {
          console.error("Error creating recipient:", error);
          return; // Don't proceed to next step if recipient creation fails
        }
      }
      setCurrentStep("remittance");
    } else if (currentStep === "remittance") {
      setCurrentStep("bank");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!recipientId) {
        throw new Error("No recipient ID available for final submission");
      }

      // Step 1: Create bank account - only if bank details are provided
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

      // Step 2: Create recipient payout relationships
      for (const payoutAgent of formData.payout_agents) {
        await createRecipientPayout({
          recipient_id: recipientId,
          payout_agent_id: payoutAgent.payout_agent_id,
        });
      }

      // Final success and navigation
      toast.success("Recipient created successfully!");
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
      title: "Remittance Method",
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
                {completedSteps.includes(step.name) &&
                currentStep !== step.name ? (
                  <CheckedIcon />
                ) : (
                  <span>{step.number}</span>
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
        {currentStep === "remittance" && (
          <RemittanceMethodStep
            remittanceMethods={remittanceMethods?.data || []}
            payoutAgents={payoutLocations?.data || []}
            formData={formData}
            countryPhoneOptions={countryPhoneOptions}
            countryOptions={countryOptions}
            onAddRemittanceMethod={handleAddRemittanceMethod}
            onUpdateRemittanceMethod={handleUpdateRemittanceMethod}
            onVerifyAccount={handleVerifyAccount}
            onRemoveRemittanceMethod={handleRemoveRemittanceMethod}
            onAddMethodToRecipient={handleAddMethodToRecipient}
            onAddPayoutAgent={handleAddPayoutAgent}
            onRemovePayoutAgent={handleRemovePayoutAgent}
            isVerifying={isVerifying}
            isAddingRemittanceMethod={isAddingRemittanceMethod}
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
                disabled:
                  isCreatingRecipient ||
                  isCreatingBankAccount ||
                  isCreatingRecipientPayout,
              }}
            />
          ) : currentStep === "remittance" ? (
            <ActionButton
              title="save & continue"
              onClick={handleNext}
              buttonProps={{
                disabled:
                  formData.remittance_methods.length === 0 ||
                  !formData.remittance_methods.some(
                    (method) => method.added_to_recipient
                  ) ||
                  formData.remittance_methods.some((method) => {
                    if (!method.added_to_recipient) return false;
                    const remittanceMethod = remittanceMethods?.data?.find(
                      (m: any) => m.id === method.remittance_method_id
                    );
                    return (
                      remittanceMethod?.validator_id &&
                      method.verification_status !== "verified"
                    );
                  }),
              }}
              className="bg-teal-600 hover:bg-teal-700"
            />
          ) : (
            <ActionButton
              title="save & continue"
              onClick={handleNext}
              buttonProps={{
                disabled: isCreatingRecipientIntermediate,
              }}
              className="bg-teal-600 hover:bg-teal-700"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipientCreateForm;
