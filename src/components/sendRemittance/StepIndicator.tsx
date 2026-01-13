import React from "react";
import CheckedIcon from "@/assets/icons/checked-icon.svg?react";
import NextStepArrow from "@/assets/icons/next-step-arrow.svg?react";
import type { StepName } from "@/hooks/useSendRemittanceNavigation";

export interface Step {
  number: number;
  title: string;
  name: StepName;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: string;
  completedSteps: string[];
  setCurrentStep: (step: StepName) => void;
}
const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  setCurrentStep,
  completedSteps,
}) => {
  // "customer" | "currencies" | "review" | "pay";
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
  const handleStepClick = (step: StepName) => {
    // Allow clicking on completed steps or the next available step
    if (completedSteps.includes(step) || canNavigateToStep(step)) {
      setCurrentStep(step);
    }
  };
  return (
    <div className="flex items-center justify-start p-5 overflow-auto">
      <div className="flex items-center space-x-4 w-max">
        {steps?.map((step) => (
          <React.Fragment key={step.name}>
            <div
              className={`flex items-center p-1 sm:p-2 rounded-full  text-xs sm:text-sm md:text-base ${
                currentStep === step.name
                  ? "text-white bg-primary"
                  : "text-gray-400"
              }
              ${
                (completedSteps.includes(step?.name) ||
                  canNavigateToStep(step?.name)) &&
                "!cursor-pointer"
              }
              `}
              onClick={() => handleStepClick(step.name)}
            >
              <div
                className={`w-5 sm:w-8 h-5 sm:h-8  rounded-full flex items-center justify-center ${
                  currentStep === step.name
                    ? "text-primary bg-white"
                    : "border-gray-300"
                } `}
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
            {step.number < steps.length && <NextStepArrow />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
