import React from 'react';
import CheckedIcon from '@/assets/icons/checked-icon.svg?react';
import NextStepArrow from '@/assets/icons/next-step-arrow.svg?react';

export interface Step {
  number: number;
  title: string;
  name: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: string;
  completedSteps: string[];
  onStepClick: (stepName: string) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}) => (
  <div className='flex items-center justify-start p-5'>
    <div className='flex items-center space-x-4'>
      {steps?.map((step) => (
        <React.Fragment key={step.name}>
          <div
            className={`flex items-center p-2 rounded-full cursor-pointer ${
              currentStep === step.name
                ? 'text-white bg-primary'
                : 'text-gray-400'
            }`}
            onClick={() => onStepClick(step.name)}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === step.name
                  ? 'text-primary bg-white'
                  : 'border-gray-300'
              }`}
            >
              {completedSteps.includes(step.name) &&
              currentStep !== step.name ? (
                <CheckedIcon />
              ) : (
                <span>{step.number}</span>
              )}
            </div>
            <span className='ml-2 font-medium'>{step.title}</span>
          </div>
          {step.number < steps.length && <NextStepArrow />}
        </React.Fragment>
      ))}
    </div>
  </div>
);

export default StepIndicator;
