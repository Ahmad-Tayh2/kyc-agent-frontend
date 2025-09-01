import {
  CurrenciesAmountStep,
  CustomerRecipientStep,
  PayStep,
  ReviewStep,
  StepIndicator,
  type Step,
} from "@/components/sendRemittance";
import ActionButton from "@/components/shared/ActionButton";
import PageTitle from "@/components/shared/PageTitle";
import { useSendRemittanceStore } from "@/store/sendRemittanceStore";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

type StepName = "customer" | "currencies" | "review" | "pay";

const SendRemittancePage: React.FC = () => {
  const { t } = useTranslation("global");

  // Use the store state directly without the complex helper hook
  const currentStep = useSendRemittanceStore((state) => state.currentStep);
  const completedSteps = useSendRemittanceStore(
    (state) => state.completedSteps
  );
  const setMode = useSendRemittanceStore((state) => state.setMode);
  const resetStore = useSendRemittanceStore((state) => state.resetStore);
  const setCurrentStep = useSendRemittanceStore(
    (state) => state.setCurrentStep
  );
  const markStepCompleted = useSendRemittanceStore(
    (state) => state.markStepCompleted
  );
  const isStepValid = useSendRemittanceStore((state) => state.isStepValid);
  const stepOneData = useSendRemittanceStore((state) => state.data.stepOne);
  const stepTwoData = useSendRemittanceStore((state) => state.data.stepTwo);
  const stepThreeData = useSendRemittanceStore((state) => state.data.stepThree);
  const stepFourData = useSendRemittanceStore((state) => state.data.stepFour);

  // Initialize store for create mode when component mounts
  useEffect(() => {
    setMode("create");
    resetStore();
  }, [setMode, resetStore]);

  // Helper function to get validation message for current step
  const getValidationMessage = (step: StepName): string | null => {
    if (isStepValid(step)) return null;

    switch (step) {
      case "customer":
        if (!stepOneData.customer) return "Please select a customer";
        if (!stepOneData.recipient) return "Please select a recipient";
        if (!stepOneData.sendCountry) return "Please select sending country";
        if (!stepOneData.receiveCountry)
          return "Please select receiving country";
        if (!stepOneData.remittanceMethod)
          return "Please select remittance method";
        return "Please complete all required fields";

      case "currencies":
        if (!stepTwoData.sendCurrency) return "Please select send currency";
        if (!stepTwoData.receiveCurrency)
          return "Please select receive currency";
        if (stepTwoData.sendAmount <= 0)
          return "Please enter a valid send amount";
        if (!stepTwoData.exchangeDetails)
          return "Please get exchange rate details";
        return "Please complete currency and amount information";

      case "review":
        if (!stepThreeData.sourceOfIncome)
          return "Please select source of income";
        if (!stepThreeData.remittancePurpose)
          return "Please select remittance purpose";
        return "Please complete review information";

      case "pay":
        if (!stepFourData.paymentMethod) return "Please select payment method";
        return "Please complete payment information";

      default:
        return null;
    }
  };

  const steps: Step[] = [
    {
      number: 1,
      title: "Customer/Recipient",
      name: "customer",
    },
    {
      number: 2,
      title: "Currencies/Amount",
      name: "currencies",
    },
    {
      number: 3,
      title: "Review",
      name: "review",
    },
    {
      number: 4,
      title: "Pay",
      name: "pay",
    },
  ];

  const canNavigateToStep = (step: StepName): boolean => {
    switch (step) {
      case "customer":
        return true; // Always accessible
      case "currencies":
        return completedSteps.includes("customer");
      case "review":
        return (
          completedSteps.includes("customer") &&
          completedSteps.includes("currencies")
        );
      case "pay":
        return (
          completedSteps.includes("customer") &&
          completedSteps.includes("currencies") &&
          completedSteps.includes("review")
        );
      default:
        return false;
    }
  };

  const handleStepClick = (stepName: string) => {
    const step = stepName as StepName;
    // Allow clicking on completed steps or the next available step
    if (completedSteps.includes(step) || canNavigateToStep(step)) {
      setCurrentStep(step);
    }
  };

  const handleNext = () => {
    // Only proceed if current step is valid
    if (!isStepValid(currentStep)) {
      return;
    }

    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      markStepCompleted(currentStep);
    }

    // Navigate to next step
    switch (currentStep) {
      case "customer":
        setCurrentStep("currencies");
        break;
      case "currencies":
        setCurrentStep("review");
        break;
      case "review":
        setCurrentStep("pay");
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case "currencies":
        setCurrentStep("customer");
        break;
      case "review":
        setCurrentStep("currencies");
        break;
      case "pay":
        setCurrentStep("review");
        break;
      default:
        break;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "customer":
        return <CustomerRecipientStep />;
      case "currencies":
        return <CurrenciesAmountStep />;
      case "review":
        return <ReviewStep />;
      case "pay":
        return <PayStep />;
      default:
        return <CustomerRecipientStep />;
    }
  };

  const renderActionButtons = () => {
    const validationMessage = getValidationMessage(currentStep);

    switch (currentStep) {
      case "customer":
        // CONTINUE (one button)
        return (
          <div className="flex flex-col gap-2 m-5 pt-5">
            {validationMessage && (
              <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                <strong>Required:</strong> {validationMessage}
              </div>
            )}
            <div
              className={`flex justify-end items-end gap-4
              }`}
            >
              <ActionButton
                title="Continue"
                onClick={handleNext}
                buttonProps={{
                  disabled: !isStepValid("customer"),
                }}
              />
            </div>
          </div>
        );

      case "currencies":
        // BACK and SAVE & CONTINUE (or just show Continue if step is completed)
        return (
          <div className="flex flex-col gap-2 m-5 pt-5">
            {validationMessage && !completedSteps.includes("currencies") && (
              <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                <strong>Required:</strong> {validationMessage}
              </div>
            )}
            <div className="flex justify-end items-end gap-4">
              <ActionButton title="Back" onClick={handleBack} type="cancel" />
              {completedSteps.includes("currencies") ? (
                <ActionButton title="Continue" onClick={handleNext} />
              ) : (
                <ActionButton
                  title="Save & Continue"
                  onClick={handleNext}
                  buttonProps={{
                    disabled: !isStepValid("currencies"),
                  }}
                />
              )}
            </div>
          </div>
        );

      case "review":
        // BACK and SAVE & CONTINUE
        return (
          <div className="flex flex-col gap-2 m-5 pt-5">
            {validationMessage && (
              <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                <strong>Required:</strong> {validationMessage}
              </div>
            )}
            <div className="flex justify-end items-end gap-4">
              <ActionButton title="Back" onClick={handleBack} type="cancel" />
              <ActionButton
                title="Save & Continue"
                onClick={handleNext}
                buttonProps={{
                  disabled: !isStepValid("review"),
                }}
              />
            </div>
          </div>
        );

      case "pay":
        // BACK
        return (
          <div className="flex justify-end items-end gap-4 m-5 pt-5">
            <ActionButton title="Back" onClick={handleBack} type="cancel" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <PageTitle title={t("modules.pages.sendRemittance.title")} />
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg border">
        {/* Step Indicator */}
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />

        {/* Separator line after step indicator */}
        <hr className="border-gray-200" />

        {/* Current Step Content */}
        {renderCurrentStep()}

        {/* Separator line before action buttons */}
        <hr className="border-gray-200" />

        {/* Action Buttons */}
        {renderActionButtons()}
      </div>
    </div>
  );
};

export default SendRemittancePage;
