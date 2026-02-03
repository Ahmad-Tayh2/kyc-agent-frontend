import BackArrowIcon from '@/assets/icons/back-arrow.svg?react';
import CheckedIcon from '@/assets/icons/checked-icon.svg?react';
import NextStepArrow from '@/assets/icons/next-step-arrow.svg?react';
import ActionButton from '@/components/shared/ActionButton';
import PageTitle from '@/components/shared/PageTitle';
import { ROUTES } from '@/constants/routes';
import {
  useCitiesByCountry,
  useCountries,
  useStatesByCountry,
} from '@/hooks/data/useAddress';
import { useCreateBankAccount } from '@/hooks/data/useBankAccounts';
import { useCurrencies } from '@/hooks/data/useCurrency';
import { useGetCustomers } from '@/hooks/data/useCustomers';
import { usePayoutLocations } from '@/hooks/data/usePayoutLocation';
import { useCreateRecipientPayout } from '@/hooks/data/useRecipientPayout';
import { useCreateRecipientRemittanceMethod } from '@/hooks/data/useRecipientRemittanceMethods';
import {
  useCreateRecipient,
  useCreateRecipientIntermediate,
} from '@/hooks/data/useRecipients';
import {
  useRemittanceMethods,
  useVerifyAccountInfo,
} from '@/hooks/data/useRemittanceMethod';
import { useAuthStore } from '@/store/authStore';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import RecipientBankDetails from './components/RecipientBankDetails';
import RecipientBasicDetails from './components/RecipientBasicDetails';
import RemittanceMethodStep from './components/RemittanceMethodStep';
import type { RemittanceMethod } from '@/types/remittanceMethod';
export const createRecipientSchema = z.object({
  customer_id: z.union([z.string(), z.number()]).refine((val) => {
    if (typeof val === 'string') return val.trim() !== '';
    if (typeof val === 'number') return !isNaN(val);
    return false;
  }, 'Customer is required'),
  first_name: z
    .string()
    .min(2, 'First name must contain at least 2 characters')
    .max(50, 'First name is too long'),
  last_name: z
    .string()
    .min(2, 'Last name must contain at least 2 characters')
    .max(50, 'Last name is too long'),
  email: z.string(),
  date_of_birth: z.string().nonempty('Date of birth is required'),
  // .refine(
  //   (date) => !isNaN(Date.parse(date)),
  //   "Invalid date format (must be YYYY-MM-DD)"
  // ),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: 'Gender is required' }),
  }),
  country_id: z.union([z.string(), z.number()]).refine((val) => {
    if (typeof val === 'string') return val.trim() !== '';
    if (typeof val === 'number') return !isNaN(val);
    return false;
  }, 'Country is required'),

  city_id: z.union([z.string(), z.number()]).refine((val) => {
    if (typeof val === 'string') return val.trim() !== '';
    if (typeof val === 'number') return !isNaN(val);
    return false;
  }, 'City is required'),

  street_name: z.string().nonempty('Street name is required'),
  house_number: z.string().nonempty('House number is required'),
  // postal_code: z.string().optional(),
  phone_number: z
    .string()
    .nonempty('Phone number is required')
    .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
  country_phone_code: z.string().nonempty('Country phone code required'),
});
export const bankAccountSchema = z.object({
  accountable_type: z.literal('Recipient'),
  accountable_id: z.union([z.string(), z.number()]).refine((val) => {
    if (typeof val === 'string') return val.trim() !== '';
    if (typeof val === 'number') return !isNaN(val);
    return false;
  }, 'Recipient ID is required'),

  first_name: z
    .string()
    .min(2, 'First name must contain at least 2 characters'),
  last_name: z.string().min(2, 'Last name must contain at least 2 characters'),

  street_name: z.string().nonempty('Street name is required'),
  house_number: z.string().nonempty('House number is required'),
  postal_code: z.string().optional(),
  extra_address_details: z.string().optional(),

  city_id: z.number({ invalid_type_error: 'City is required' }),
  state_id: z.number().optional(),
  country_id: z.number({ invalid_type_error: 'Country is required' }),

  bank_name: z.string().nonempty('Bank name is required'),
  account_type: z.string().nonempty('Account type is required'),
  account_number: z
    .string()
    .nonempty('Account number is required')
    .regex(
      /^[0-9A-Za-z]+$/,
      'Account number must contain only letters or digits',
    ),

  swift_code: z
    .string()
    .nonempty('SWIFT code is required')
    .regex(
      /^[A-Z0-9]{8,11}$/,
      'SWIFT code must be 8–11 uppercase letters or digits',
    ),
  bic_code: z.string().nonempty('BIC code is required'),
  currency_id: z.number({ invalid_type_error: 'Currency is required' }),
  iban_code: z
    .string()
    .nonempty('IBAN is required')
    .regex(
      /^[A-Z0-9]+$/,
      'IBAN must contain only uppercase letters and digits',
    ),

  bank_address: z.string().nonempty('Bank address is required'),
});

type FormStep = 'basic' | 'remittance' | 'bank';

interface RecipientFormData {
  // Basic Details
  customer_id?: string;
  agent_id?: string;
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
    },
  ];

  // Remittance Method Details
  remittance_methods: Array<{
    id?: string; // Temporary ID for UI management
    remittance_method_id: number;
    verification_status: 'pending' | 'verified' | 'failed';
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
    iban_code: string;
    bic_code: string;
    bank_address: string;
    currency_id: string;
    extra_address_details: string;
    state_id: string;
  };
}

const RecipientCreateForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<FormStep>('basic');
  const [completedSteps, setCompletedSteps] = useState<FormStep[]>([]);
  const [recipientId, setRecipientId] = useState<number | null>(null);

  const [searchParams] = useSearchParams();
  const customerIdQuery = searchParams.get('customer');
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [bankValidationErrors, setBankValidationErrors] = useState<
    Record<string, string[]>
  >({});

  const [formData, setFormData] = useState<RecipientFormData>({
    first_name: '',
    last_name: '',
    email: '',
    date_of_birth: '',
    street_name: '',
    house_number: '',
    postal_code: '',
    city_id: '',
    country_id: '',
    gender: '',
    country_phone_code: '',
    phone_number: '',
    bank_details: {
      bank_name: '',
      account_number: '',
      swift_code: '',
      account_type: '',
      iban_code: '',
      bic_code: '',
      bank_address: '',
      currency_id: '',
      extra_address_details: '',
      state_id: '',
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

  // console.log("formData:", formData.payout_agents);
  const { isPending: isCreatingRecipient } = useCreateRecipient();
  const {
    mutateAsync: createRecipientIntermediate,
    isPending: isCreatingRecipientIntermediate,
    status: createRecipientStatus,
  } = useCreateRecipientIntermediate({
    keyToInvalidate:
      formData.customer_id === 'agent_id'
        ? 'agent-recipients'
        : 'get-recipients',
  });
  const { mutateAsync: createBankAccount, isPending: isCreatingBankAccount } =
    useCreateBankAccount({
      onSuccess: () => navigate(ROUTES.RECIPIENTS.LIST),
      keyToInvalidate: 'get-recipients',
    });
  const {
    mutateAsync: createRecipientPayout,
    isPending: isCreatingRecipientPayout,
  } = useCreateRecipientPayout();
  const {
    mutateAsync: createRecipientRemittanceMethod,
    isPending: isAddingRemittanceMethod,
  } = useCreateRecipientRemittanceMethod();

  const { data: countries = [] } = useCountries();
  const { data: cities = [] } = useCitiesByCountry(formData.country_id || '');
  const { data: states = [] } = useStatesByCountry(formData.country_id || null);
  const { data: currencies = [] } = useCurrencies();
  const { data: customersResponse } = useGetCustomers('');
  const { data: remittanceMethods = [] } = useRemittanceMethods();
  const { mutateAsync: verifyAccountInfo, isPending: isVerifying } =
    useVerifyAccountInfo();
  const { data: payoutLocations = [] } = usePayoutLocations();

  // Memoize customers data to prevent unnecessary re-renders
  const customersData = useMemo(() => {
    return customersResponse?.data || [];
  }, [customersResponse?.data]);

  const countryOptions = useMemo(() => {
    return (
      countries?.map((country: any) => ({
        value: country.id,
        label: country.name,
        iso2: country.iso2,
      })) || []
    );
  }, [countries]);

  const cityOptions = useMemo(() => {
    return (
      cities?.map((city: any) => ({
        value: city.id,
        label: city.name,
      })) || []
    );
  }, [cities]);

  const stateOptions = useMemo(() => {
    return (
      states?.map((state: any) => ({
        value: state.id,
        label: state.name,
      })) || []
    );
  }, [states]);

  const countryPhoneOptions = useMemo(() => {
    return (
      countries?.map((country: any) => ({
        value: country.phone_code,
        label: country.name,
        code: country.phone_code,
        countryCode: country.iso2,
      })) || []
    );
  }, [countries]);

  const currencyOptions = useMemo(() => {
    return (
      currencies?.map((currency: any) => ({
        label: `${currency.code} - ${currency.name}`,
        value: currency.id.toString(),
      })) || []
    );
  }, [currencies]);
  const customerOptions = useMemo(() => {
    return (
      customersData?.map((customer: any) => ({
        label: customer.full_name,
        value: customer.id,
        name: 'customer_id',
      })) ?? []
    );
  }, [customersData]);
  const accountTypeOptions = [
    { label: 'Savings', value: 'savings' },
    { label: 'Checking', value: 'checking' },
    { label: 'Current', value: 'current' },
    { label: 'Business', value: 'business' },
  ];

  const handleInputChange = (field: string, value: any) => {
    if (field === 'country_id') {
      setFormData((prev: any) => ({
        ...prev,
        [field]: value,
        city_id: '',
        state_id: '',
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [field]: value,
      }));
    }
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: [] }));
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
    if (bankValidationErrors[field]) {
      setBankValidationErrors((prev) => ({ ...prev, [field]: [] }));
    }
  };

  const handleDateChange = (field: string, date: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: [] }));
    }
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
          verification_status: 'pending' as const,
        },
      ],
    }));
  };

  const handleUpdateRemittanceMethod = (
    id: string,
    field: string,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      remittance_methods: prev.remittance_methods.map((method) => {
        if (method.id === id) {
          if (field.includes('.')) {
            const [parentField, childField] = field.split('.');
            const parentValue = method[parentField as keyof typeof method];
            return {
              ...method,
              [parentField]: {
                ...(parentValue && typeof parentValue === 'object'
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
        (method) => method.id !== id,
      ),
    }));
  };

  const handleAddMethodToRecipient = async (id: string) => {
    if (!recipientId) {
      console.error('Cannot add remittance method: No recipient ID available');
      return;
    }

    const methodData = formData.remittance_methods.find(
      (method) => method.id === id,
    );

    if (!methodData) {
      console.error('Method data not found');
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
          method.id === id ? { ...method, added_to_recipient: true } : method,
        ),
      }));
    } catch (error) {
      console.error('Failed to add remittance method to recipient:', error);
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
          account_number: '',
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
      (method) => method.id === id,
    );
    const selectedMethod = remittanceMethods?.data?.find(
      (method: any) => method.id === methodData?.remittance_method_id,
    );

    if (!selectedMethod || !selectedMethod.validator_id || !methodData) {
      console.log('Missing required data for verification');
      return;
    }

    try {
      // Check for validator name, fallback to validation_type if available
      const validationType =
        selectedMethod.validator?.name || selectedMethod.validation_type || '';

      if (!validationType) {
        console.error('No validation type found for method:', selectedMethod);
        toast.error('Validation type not configured for this method');
        return;
      }

      const verificationRequest = {
        validation_type: validationType,
        service_data: {
          serviceCode: '00003', // Default service code as specified
          phoneNumber: `+${methodData.service_data?.country_phone_code?.replace(
            /^\+/,
            '',
          )}${methodData.service_data?.phone_number}`,
        },
        verification_data: {
          expected_account_name_prefix:
            methodData.verification_data?.account_name_prefix || '',
          expected_account_id_prefix:
            methodData.verification_data?.account_id_prefix || '',
        },
      };

      const response = await verifyAccountInfo(verificationRequest);

      // Check the actual API response structure
      if (response.data?.status === 'success') {
        handleUpdateRemittanceMethod(id, 'verification_status', 'verified');
      } else {
        handleUpdateRemittanceMethod(id, 'verification_status', 'failed');
      }
    } catch (error) {
      console.error('Verification failed:', error);
      handleUpdateRemittanceMethod(id, 'verification_status', 'failed');
    }
  };

  const handleStepClick = (step: FormStep) => {
    if (completedSteps.includes(step) || canNavigateToStep(step)) {
      setCurrentStep(step);
    }
  };

  const canNavigateToStep = (step: FormStep): boolean => {
    switch (step) {
      case 'basic':
        return true;
      case 'remittance':
        return completedSteps.includes('basic');
      case 'bank':
        return completedSteps.includes('remittance');
      default:
        return false;
    }
  };
  const { user } = useAuthStore();
  const extraOption = useMemo(
    () => ({
      label: `${user?.first_name} ${user?.last_name} (Myself)`,
      value: 'agent_id',
    }),
    [user],
  );
  useEffect(() => {
    if (customerIdQuery) {
      if (String(customerIdQuery) === 'agent_id') {
        handleInputChange('customer_id', String(customerIdQuery));
      } else if (customerOptions?.length > 0) {
        const found = customerOptions?.find((item: any) => {
          return String(item?.value) === String(customerIdQuery);
        });
        if (found) {
          handleInputChange('customer_id', found?.value);
        }
      }
    }
  }, [customerIdQuery, customerOptions]);
  useEffect(() => {
    if (customerIdQuery && String(customerIdQuery) === 'myself') {
      handleInputChange('customer_id', 'agent_id');
    }
  }, [customerIdQuery]);
  const handleNext = async () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    if (currentStep === 'basic') {
      // Create recipient when moving from basic to remittance step
      const recipientPayload = {
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
          city_id: formData.city_id,
          state_id:
            formData.bank_details.state_id &&
            formData.bank_details.state_id !== ''
              ? formData.bank_details.state_id
              : undefined,
          country_id: formData.country_id,
        },
        customer_ids:
          formData.customer_id === 'agent_id'
            ? undefined
            : formData.customer_id
              ? [parseInt(formData.customer_id)]
              : [],
        customer_id:
          formData.customer_id === 'agent_id'
            ? undefined
            : parseInt(formData.customer_id ?? ''),

        agent_id:
          formData.customer_id === 'agent_id' ? user?.agent?.id : undefined,

        rm_service_providers: [],
      };
      // Flatten fields for validation
      const flattenedData = {
        ...recipientPayload,
        ...recipientPayload.address,
        customer_id: formData.customer_id,
      };

      const validationResult = createRecipientSchema.safeParse(flattenedData);

      if (!validationResult.success) {
        const errors = validationResult?.error?.flatten().fieldErrors;
        setValidationErrors(errors);
        console.log('Validation errors ------- :', errors);
        return;
      }
      if (!recipientId) {
        try {
          const recipientResponse =
            await createRecipientIntermediate(recipientPayload);

          const newRecipientId = recipientResponse.data?.id;
          if (newRecipientId) {
            setRecipientId(newRecipientId);
          }
        } catch (error) {
          console.error('Error creating recipient:', error);
          return; // Don't proceed to next step if recipient creation fails
        }
      }
      setCurrentStep('remittance');
    } else if (currentStep === 'remittance') {
      setCurrentStep('bank');
    }
  };

  const handleSubmit = async () => {
    try {
      if (!recipientId) {
        throw new Error('No recipient ID available for final submission');
      }
      // Flatten fields for validation
      const bankAccountData = {
        accountable_type: 'Recipient' as const,
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
          formData.bank_details.state_id !== ''
            ? parseInt(formData.bank_details.state_id)
            : undefined,
        country_id: parseInt(formData.country_id),
        bank_name: formData.bank_details.bank_name,
        account_number: formData.bank_details.account_number,
        account_type: formData.bank_details.account_type,
        swift_code: formData.bank_details.swift_code,
        bic_code: formData.bank_details.bic_code,

        currency_id: parseInt(formData.bank_details.currency_id),
        iban_code: formData.bank_details.iban_code,
        bank_address: formData.bank_details.bank_address,
      };

      const validationResult = bankAccountSchema.safeParse(bankAccountData);

      if (!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors;
        setBankValidationErrors(errors);
        console.log('Bank details validation errors:', errors);
        return;
      }
      // Step 1: Create bank account - only if bank details are provided
      if (
        formData.bank_details.bank_name &&
        formData.bank_details.account_number
      ) {
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
      toast.success('Recipient bank account created successfully!');
      if (formData.customer_id === 'agent_id') {
        navigate(ROUTES.SETTINGS.TAB('recipients'));
      } else {
        navigate(ROUTES.RECIPIENTS.LIST);
      }
    } catch (error) {
      console.error('Error creating recipient:', error);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.RECIPIENTS.LIST);
  };
  const handleBack = () => {
    const currentStepNumber =
      steps?.find((step) => step.name === currentStep)?.number ?? -1;
    if (currentStepNumber > 1) {
      setCurrentStep(steps?.[currentStepNumber - 1 - 1].name);
    }
  };
  const steps = [
    {
      number: 1,
      title: 'Basic Details',
      name: 'basic' as FormStep,
    },
    {
      number: 2,
      title: 'Remittance Method',
      name: 'remittance' as FormStep,
    },
    {
      number: 3,
      title: 'Bank Details (Optional)',
      name: 'bank' as FormStep,
    },
  ];
  const renderStepIndicator = () => (
    <div className='flex items-center justify-start p-5 overflow-auto'>
      <div className='flex items-center space-x-4 w-max'>
        {steps?.map((step) => (
          <React.Fragment key={step.name}>
            <div
              key={step.name}
              className={`flex items-center p-1 sm:p-2 rounded-full whitespace-nowrap text-xs sm:text-sm md:text-base ${
                currentStep === step.name
                  ? 'text-white bg-primary'
                  : 'text-gray-400'
              }`}
              onClick={() => handleStepClick(step.name)}
            >
              <div
                className={`w-5 sm:w-8 h-5 sm:h-8 rounded-full flex items-center justify-center  ${
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
            {step.number < 3 && <NextStepArrow />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
  const handleSkip = () => {
    if (createRecipientStatus === 'success' && recipientId) {
      toast.info('You can add bank details later');
      if (formData.customer_id === 'agent_id') {
        navigate(ROUTES.SETTINGS.TAB('recipients'));
      } else {
        navigate(ROUTES.RECIPIENTS.LIST);
      }
    }
  };

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex justify-start items-center gap-3'>
        <button
          onClick={handleCancel}
          className='text-primary top-1 cursor-pointer'
        >
          <BackArrowIcon width={30} height={30} />
        </button>
        <PageTitle title='Add New Recipients' />
      </div>

      {/* Form Content */}
      <div className='bg-white rounded-lg border'>
        <div className='p-6 border-b-1'>Add new recipient details here.</div>
        {/* Step Indicator */}
        {renderStepIndicator()}
        {/* Step Content */}
        {currentStep === 'basic' && (
          <RecipientBasicDetails
            formData={formData}
            handleInputChange={handleInputChange}
            handleDateChange={handleDateChange}
            customerOptions={customerOptions}
            extraCustomerOption={extraOption}
            countryOptions={countryOptions}
            cityOptions={cityOptions}
            countryPhoneOptions={countryPhoneOptions}
            validationErrors={validationErrors}
          />
        )}
        {currentStep === 'remittance' && (
          <RemittanceMethodStep
            remittanceMethods={
              remittanceMethods?.data.filter(
                (rm: RemittanceMethod) =>
                  !rm.name.toLowerCase().includes('cash'),
              ) || []
            }
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
        {currentStep === 'bank' && (
          <RecipientBankDetails
            formData={formData}
            handleBankDetailsChange={handleBankDetailsChange}
            accountTypeOptions={accountTypeOptions}
            currencyOptions={currencyOptions}
            stateOptions={stateOptions}
            validationErrors={bankValidationErrors}
          />
        )}
        {/* Action Buttons */}
        <div className='flex items-center sm:justify-end p-5 overflow-auto'>
          {/* <div className='flex justify-between items-end gap-4 m-5 pt-5 border-t-1'> */}
          <ActionButton
            title='back'
            onClick={handleBack}
            type='cancel'
            disabled={currentStep === 'basic'}
          />
          <div className='flex justify-end items-end gap-4'>
            {currentStep === 'bank' && (
              <ActionButton
                title='skip step'
                onClick={handleSkip}
                type='link'
              />
            )}
            <ActionButton title='cancel' onClick={handleCancel} type='cancel' />
            {currentStep === 'bank' ? (
              <>
                <ActionButton
                  title='save & continue'
                  onClick={handleSubmit}
                  buttonProps={{
                    disabled:
                      isCreatingRecipient ||
                      isCreatingBankAccount ||
                      isCreatingRecipientPayout,
                  }}
                />
              </>
            ) : currentStep === 'remittance' ? (
              <ActionButton
                title='save & continue'
                onClick={handleNext}
                //disabled to refactor later

                // disabled={
                //   formData.remittance_methods.length === 0 ||
                //   !formData.remittance_methods.some(
                //     (method) => method.added_to_recipient
                //   ) ||
                //   formData.remittance_methods.some((method) => {
                //     if (!method.added_to_recipient) return false;
                //     const remittanceMethod = remittanceMethods?.data?.find(
                //       (m: any) => m.id === method.remittance_method_id
                //     );
                //     return (
                //       remittanceMethod?.validator_id &&
                //       method.verification_status !== "verified"
                //     );
                //   })
                // }
                className='bg-teal-600 hover:bg-teal-700'
              />
            ) : (
              <ActionButton
                title='save & continue'
                onClick={handleNext}
                disabled={isCreatingRecipientIntermediate}
                className='bg-teal-600 hover:bg-teal-700'
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipientCreateForm;
