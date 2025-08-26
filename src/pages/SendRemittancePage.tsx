import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageTitle from '@/components/shared/PageTitle';
import ActionButton from '@/components/shared/ActionButton';
import {
  StepIndicator,
  CustomerRecipientStep,
  CurrenciesAmountStep,
  ReviewStep,
  PayStep,
  type Step,
} from '@/components/sendRemittance';

type StepName = 'customer' | 'currencies' | 'review' | 'pay';

const SendRemittancePage: React.FC = () => {
  const { t } = useTranslation('global');
  const [currentStep, setCurrentStep] = useState<StepName>('customer');
  const [completedSteps, setCompletedSteps] = useState<StepName[]>([]);

  const steps: Step[] = [
    {
      number: 1,
      title: 'Customer/Recipient',
      name: 'customer',
    },
    {
      number: 2,
      title: 'Currencies/Amount',
      name: 'currencies',
    },
    {
      number: 3,
      title: 'Review',
      name: 'review',
    },
    {
      number: 4,
      title: 'Pay',
      name: 'pay',
    },
  ];

  const canNavigateToStep = (step: StepName): boolean => {
    switch (step) {
      case 'customer':
        return true; // Always accessible
      case 'currencies':
        return completedSteps.includes('customer');
      case 'review':
        return (
          completedSteps.includes('customer') &&
          completedSteps.includes('currencies')
        );
      case 'pay':
        return (
          completedSteps.includes('customer') &&
          completedSteps.includes('currencies') &&
          completedSteps.includes('review')
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
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    // Navigate to next step
    switch (currentStep) {
      case 'customer':
        setCurrentStep('currencies');
        break;
      case 'currencies':
        setCurrentStep('review');
        break;
      case 'review':
        setCurrentStep('pay');
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'currencies':
        setCurrentStep('customer');
        break;
      case 'review':
        setCurrentStep('currencies');
        break;
      case 'pay':
        setCurrentStep('review');
        break;
      default:
        break;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'customer':
        return <CustomerRecipientStep />;
      case 'currencies':
        return <CurrenciesAmountStep />;
      case 'review':
        return <ReviewStep />;
      case 'pay':
        return <PayStep />;
      default:
        return <CustomerRecipientStep />;
    }
  };

  const renderActionButtons = () => {
    switch (currentStep) {
      case 'customer':
        // CONTINUE (one button)
        return (
          <div className='flex justify-end items-end gap-4 m-5 pt-5'>
            <ActionButton
              title='Continue'
              onClick={handleNext}
              buttonProps={{
                disabled: false,
              }}
            />
          </div>
        );

      case 'currencies':
        // BACK and SAVE & CONTINUE
        return (
          <div className='flex justify-end items-end gap-4 m-5 pt-5'>
            <ActionButton title='Back' onClick={handleBack} type='cancel' />
            <ActionButton
              title='Save & Continue'
              onClick={handleNext}
              buttonProps={{
                disabled: false,
              }}
            />
          </div>
        );

      case 'review':
        // BACK and SAVE & CONTINUE
        return (
          <div className='flex justify-end items-end gap-4 m-5 pt-5'>
            <ActionButton title='Back' onClick={handleBack} type='cancel' />
            <ActionButton
              title='Save & Continue'
              onClick={handleNext}
              buttonProps={{
                disabled: false,
              }}
            />
          </div>
        );

      case 'pay':
        // BACK
        return (
          <div className='flex justify-end items-end gap-4 m-5 pt-5'>
            <ActionButton title='Back' onClick={handleBack} type='cancel' />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <PageTitle title={t('modules.pages.sendRemittance.title')} />
      </div>

      {/* Form Content */}
      <div className='bg-white rounded-lg border'>
        {/* Step Indicator */}
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />

        {/* Separator line after step indicator */}
        <hr className='border-gray-200' />

        {/* Current Step Content */}
        {renderCurrentStep()}

        {/* Separator line before action buttons */}
        <hr className='border-gray-200' />

        {/* Action Buttons */}
        {renderActionButtons()}
      </div>
    </div>
  );
};

export default SendRemittancePage;
