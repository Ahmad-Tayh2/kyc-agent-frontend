import { useMemo } from 'react';
import { useSendRemittanceStore } from '@/store/sendRemittanceStore';

type StepName = 'customer' | 'currencies' | 'review' | 'pay';

/**
 * Custom hook for send remittance validation messages
 * Returns user-friendly validation messages for each step
 */
export const useSendRemittanceValidation = (step?: StepName) => {
  const currentStep = step || useSendRemittanceStore((state) => state.currentStep);
  const stepOne = useSendRemittanceStore((state) => state.data.stepOne);
  const stepTwo = useSendRemittanceStore((state) => state.data.stepTwo);
  const stepThree = useSendRemittanceStore((state) => state.data.stepThree);
  const stepFour = useSendRemittanceStore((state) => state.data.stepFour);
  const isStepValid = useSendRemittanceStore((state) => state.isStepValid);

  const validationMessage = useMemo(() => {
    if (isStepValid(currentStep)) return null;

    switch (currentStep) {
      case 'customer':
        if (!stepOne.customer) return 'Please select a customer';
        if (!stepOne.recipient) return 'Please select a recipient';
        if (!stepOne.sendCountry) return 'Please select sending country';
        if (!stepOne.receiveCountry) return 'Please select receiving country';
        if (!stepOne.remittanceMethod && !stepOne.payoutAgent)
          return 'Please select remittance method or payout agent';
        return 'Please complete all required fields';

      case 'currencies':
        if (!stepTwo.sendCurrency) return 'Please select send currency';
        if (!stepTwo.receiveCurrency) return 'Please select receive currency';
        if (stepTwo.sendAmount <= 0) return 'Please enter a valid send amount';
        if (!stepTwo.exchangeDetails) return 'Please get exchange rate details';
        return 'Please complete currency and amount information';

      case 'review':
        if (!stepThree.sourceOfIncome) return 'Please select source of income';
        if (!stepThree.remittancePurpose)
          return 'Please select remittance purpose';
        return 'Please complete review information';

      case 'pay':
        if (!stepFour.paymentMethod) return 'Please select payment method';
        return 'Please complete payment information';

      default:
        return null;
    }
  }, [currentStep, stepOne, stepTwo, stepThree, stepFour, isStepValid]);

  return {
    validationMessage,
    isValid: !validationMessage,
  };
};
