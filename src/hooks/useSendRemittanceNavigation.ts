import { useCallback } from "react";
import { useSendRemittanceStore } from "@/store/sendRemittanceStore";

export type StepName = "customer" | "currencies" | "review" | "pay";

/**
 * Custom hook for managing send remittance step navigation
 * Encapsulates navigation logic and validation
 */
export const useSendRemittanceNavigation = () => {
  const currentStep = useSendRemittanceStore((state) => state.currentStep);
  const completedSteps = useSendRemittanceStore(
    (state) => state.completedSteps
  );
  const setCurrentStep = useSendRemittanceStore(
    (state) => state.setCurrentStep
  );
  const markStepCompleted = useSendRemittanceStore(
    (state) => state.markStepCompleted
  );
  const isStepValid = useSendRemittanceStore((state) => state.isStepValid);
  const isStepCompleted = useSendRemittanceStore(
    (state) => state.isStepCompleted
  );

  const navigateToStep = useCallback(
    (step: StepName) => {
      setCurrentStep(step);
    },
    [setCurrentStep]
  );

  const goToNextStep = useCallback(() => {
    if (!isStepValid(currentStep)) {
      return false;
    }

    // Mark current step as completed
    if (!isStepCompleted(currentStep)) {
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

    return true;
  }, [
    currentStep,
    isStepValid,
    isStepCompleted,
    markStepCompleted,
    setCurrentStep,
  ]);

  const goToPreviousStep = useCallback(() => {
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
  }, [currentStep, setCurrentStep]);

  const canGoBack = currentStep !== "customer";
  const canGoForward = currentStep !== "pay" && isStepValid(currentStep);

  return {
    currentStep,
    setCurrentStep,
    completedSteps,
    navigateToStep,
    goToNextStep,
    goToPreviousStep,
    canGoBack,
    canGoForward,
    isStepValid,
    isStepCompleted,
  };
};
