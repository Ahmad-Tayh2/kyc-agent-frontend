import BackArrowIcon from '@/assets/icons/back-arrow.svg?react';
import {
  CurrenciesAmountStep,
  CustomerRecipientStep,
  PayStep,
  ReviewStep,
  StepIndicator,
  type Step,
} from '@/components/sendRemittance';
import ActionButton from '@/components/shared/ActionButton';
import PageTitle from '@/components/shared/PageTitle';
import {
  useCreateTransfer,
  useGetTransfer,
  useGetTransfers,
  useUpdateTransfer,
} from '@/hooks/data/useTransfers';
import { useSendRemittanceStore } from '@/store/sendRemittanceStore';

import { DataTable } from '@/components/shared/DataTable';
import { draftTransfersTableColum } from '@/components/transfers/DraftTransfersTableColum';
import { ROUTES } from '@/constants/routes';
import { useGetCustomer } from '@/hooks/data/useCustomers';
import { useGetRecipient } from '@/hooks/data/useRecipients';
import { useTransferFilters } from '@/hooks/data/useTransferFilters';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

type StepName = 'customer' | 'currencies' | 'review' | 'pay';
interface SendRemittancePageProps {
  mode?: 'create' | 'edit';
}
const SendRemittancePage = (props: SendRemittancePageProps) => {
  const { mode = 'create' } = props;
  const { t } = useTranslation('global');
  const navigate = useNavigate();
  const columns = draftTransfersTableColum();

  const { reference_number } = useParams<{ reference_number: string }>();
  const { data: response } = useGetTransfer(reference_number!);

  const [searchParams] = useSearchParams();
  const customerIdQuery = searchParams.get('customer');
  const recipientIdQuery = searchParams.get('recipient');
  const { filtersString, updateStatus, updatePagination } = useTransferFilters({
    status: ['draft'],
  });
  const {
    data: draftTransfersResponse,
    isLoading: draftTransfersLoading,
    error: draftTransfersError,
  } = useGetTransfers(filtersString);

  // Memoize transfers data to prevent unnecessary re-renders
  const draftTransfersData = useMemo(() => {
    return draftTransfersResponse?.data || [];
  }, [draftTransfersResponse?.data]);
  const transfersMeta: any = useMemo(() => {
    return draftTransfersResponse?.meta || {};
  }, [draftTransfersResponse?.meta]);

  const transferData: any = useMemo(() => {
    return response?.data || {};
  }, [response]);

  const pagination = {
    enable: true,
    page: transfersMeta?.current_page,
    per_page: transfersMeta?.per_page,
    total: transfersMeta?.total,
    from: transfersMeta?.from,
    to: transfersMeta?.to,
    last_page: transfersMeta?.last_page,
    onChangeRowsPerPage: (value: number) => {
      updatePagination({ per_page: value });
    },
    setPage: (value: number) => {
      updatePagination({ page: value });
    },
  };
  const { stepOne, stepTwo, stepThree, stepFour } = useSendRemittanceStore(
    (state) => state.data
  );

  //actions
  const {
    currentStep,
    completedSteps,
    isStepValid,
    isStepCompleted,
    setMode,
    resetStore,
    setCurrentStep,
    setCustomer,
    setSendCountry,
    setRecipient,
    setReceiveCountry,
    setRemittanceMethod,
    setSendAmount,
    setReceiveAmount,
    setSendCurrency,
    setReceiveCurrency,
    setSourceOfIncome,
    setRemittancePurpose,
    setCartAddedTo,
    markStepCompleted,
  } = useSendRemittanceStore((state) => state);

  // const setExchangeDetails = useSendRemittanceStore(
  //   (state) => state.setExchangeDetails
  // );
  // Initialize store for create mode when component mounts
  useEffect(() => {
    resetStore();
    if (mode === 'edit') {
      markStepCompleted('customer');
      markStepCompleted('currencies');
      setCurrentStep('review');
    } else if (mode === 'create') {
      updateStatus(['draft']);
    }
    setMode(mode);
  }, [mode]);

  useEffect(() => {
    if (transferData?.id) {
      //set step 1 data
      setCustomer(transferData?.customer);
      setSendCountry(transferData?.send_country);
      setRecipient(transferData?.recipient);
      setReceiveCountry(transferData?.receive_country);
      setRemittanceMethod(transferData?.remittance_method);

      //set step 2 data
      setSendAmount(transferData?.sent_amount);
      setReceiveAmount(transferData?.receive_amount);
      setSendCurrency({ code: transferData?.send_currency });
      setReceiveCurrency({ code: transferData?.receive_currency });

      //setStep 3 data
      setSourceOfIncome(transferData?.source_income);
      setRemittancePurpose(transferData?.remittance_purpose);

      //step 4 data
      if (transferData?.remittance_cart_id) {
        setCartAddedTo(transferData?.remittance_cart_id);
      }
    }
  }, [transferData]);

  const { data: customerData } = useGetCustomer(customerIdQuery!);
  const { data: recipientData } = useGetRecipient(recipientIdQuery!);
  useEffect(() => {
    const customer = customerData?.data;
    if (customer?.id) {
      setRecipient(null);
      setReceiveCountry(null);
      const payload: any = {
        id: parseInt(customer.id),
        firstName: customer.first_name,
        lastName: customer.last_name,
        fullName: customer.full_name,
        countryId: 0, // Will be updated when we set send country
        countryIso3: '',
        countryName: customer.country.name,
      };
      setCustomer(payload);
    }
  }, [customerData]);

  useEffect(() => {
    const recipient = recipientData?.data;
    if (recipient?.id) {
      setRecipient({
        id: recipient.id,
        firstName: recipient.first_name,
        lastName: recipient.last_name,
        fullName: `${recipient.first_name} ${recipient.last_name}`,
        countryId: 0, // Will be updated when we set receive country
        countryIso3: '',
        countryName: '',
        countryPhoneCode: recipient.country_phone_code,
        phoneNumber: recipient.phone_number,
        email: recipient.email,
        address: {
          streetName: recipient.address.street || '',
          houseNumber: '', // Not available in current API response
          postalCode: recipient.address.postal_code || '',
          extraDetails: '', // Not available in current API response
          city: recipient.address.city?.name || '',
          state: recipient.address.state?.name || '',
          country: recipient.address.country?.name || '',
        },
        customers: recipient.customers,
      });
    }
  }, [recipientData]);

  // Helper function to get validation message for current step
  const getValidationMessage = (step: StepName): string | null => {
    if (isStepValid(step)) return null;

    switch (step) {
      case 'customer':
        if (!stepOne.customer) return 'Please select a customer';
        if (!stepOne.recipient) return 'Please select a recipient';
        if (!stepOne.sendCountry) return 'Please select sending country';
        if (!stepOne.receiveCountry) return 'Please select receiving country';
        if (!stepOne.remittanceMethod) return 'Please select remittance method';
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
  };

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
  const { mutateAsync: createDraftTransfer } = useCreateTransfer(() => {
    if (!isStepCompleted('currencies')) {
      markStepCompleted('currencies');
    }
    setCurrentStep('review');
  });
  const { mutateAsync: editTransfer } = useUpdateTransfer(reference_number!);
  const handleCurrenciesValidation = async () => {
    //function to create payload before sending it (may be in utils)
    const transferDraftPayload: any = {
      customer_id: stepOne?.customer?.id, //*
      recipient_id: stepOne?.recipient?.id, //*
      send_country_id: stepOne?.sendCountry?.id, //*
      receive_country_id: stepOne?.receiveCountry?.id, //*
      send_currency: stepTwo?.sendCurrency?.code, //*
      receive_currency: stepTwo?.receiveCurrency?.code, //*
      sent_amount: stepTwo?.sendAmount, //*
      total_payable_amount: stepTwo?.sendAmount, //*
      rm_sp_id: 1, //*  => should be got it later in step 1
      comment: 'Test new refactor',

      // Add either remittance_method_id or payout_agent_id based on selection
      ...(stepOne?.selectedPaymentMethodType === 'remittance_method' &&
      stepOne?.remittanceMethod?.id
        ? { remittance_method_id: stepOne.remittanceMethod.id }
        : {}),
      ...(stepOne?.selectedPaymentMethodType === 'payout_agent' &&
      stepOne?.payoutAgent?.id
        ? { payout_agent_id: stepOne.payoutAgent.id }
        : {}),

      // created_by: user?.agent?.id, //-----
      // receive_amount_in_send_currency: stepTwo?.receiveAmount, //--------
      // sending_agent_commission_currency: "USD", //--------
      // payout_agent_commission_currency: "EUR", //----------
      // sending_commission_currency: "USD", //----------
      // payout_commission_currency: "USD", //----------
    };
    const createTransferResponse = await createDraftTransfer(
      transferDraftPayload
    );
    navigate(
      ROUTES.SEND_REMITTANCE.EDIT(
        createTransferResponse?.data?.reference_number
      )
    );
  };
  const handleNext = () => {
    // Only proceed if current step is valid
    if (!isStepValid(currentStep)) {
      return;
    }
    // Mark current step as completed

    // Navigate to next step
    switch (currentStep) {
      case 'customer':
        if (!isStepCompleted(currentStep)) {
          markStepCompleted(currentStep);
        }
        setCurrentStep('currencies');
        break;
      case 'currencies':
        //here the api call
        if (mode === 'create') {
          handleCurrenciesValidation();
        } else {
          if (!isStepCompleted('currencies')) {
            markStepCompleted('currencies');
          }
          setCurrentStep('review');
        }

        break;
      case 'review':
        if (!isStepCompleted('review')) {
          markStepCompleted('review');
        }
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
        return (
          <CustomerRecipientStep
            customerId={customerIdQuery}
            recipientId={recipientIdQuery}
          />
        );
      case 'currencies':
        return <CurrenciesAmountStep />;
      case 'review':
        return <ReviewStep />;
      case 'pay':
        return <PayStep transferId={transferData?.id} />;
      default:
        return <CustomerRecipientStep />;
    }
  };
  const handleUpdateTransfer = async () => {
    //function to create payload before sending it (may be in utils)
    const transferDraftPayload: any = {
      customer_id: stepOne?.customer?.id, //*
      recipient_id: stepOne?.recipient?.id, //*
      send_country_id: stepOne?.sendCountry?.id, //*
      receive_country_id: stepOne?.receiveCountry?.id, //*
      send_currency: stepTwo?.sendCurrency?.code, //*
      receive_currency: stepTwo?.receiveCurrency?.code, //*
      sent_amount: stepTwo?.sendAmount ?? 200, //*
      total_payable_amount: stepTwo?.sendAmount ?? 200, //*
      rm_sp_id: 1, //*  => should be got it later in step 1
      comment: 'Test new refactor',

      // Add either remittance_method_id or payout_agent_id based on selection
      ...(stepOne?.selectedPaymentMethodType === 'remittance_method' &&
      stepOne?.remittanceMethod?.id
        ? { remittance_method_id: stepOne.remittanceMethod.id }
        : {}),
      ...(stepOne?.selectedPaymentMethodType === 'payout_agent' &&
      stepOne?.payoutAgent?.id
        ? { payout_agent_id: stepOne.payoutAgent.id }
        : {}),

      // created_by: user?.agent?.id, //-----
      // receive_amount_in_send_currency: stepTwo?.receiveAmount, //--------
      // sending_agent_commission_currency: "USD", //--------
      // payout_agent_commission_currency: "EUR", //----------
      // sending_commission_currency: "USD", //----------
      // payout_commission_currency: "USD", //----------

      remittance_purpose_id: stepThree?.remittancePurpose?.id,
      source_income_id: stepThree?.sourceOfIncome?.id,
    };
    await editTransfer(transferDraftPayload);
  };
  const handleBackAndUpdate = () => {
    //update
    handleUpdateTransfer();
    //back
    handleBack();
  };
  const handleNextAndUpdate = () => {
    //update
    handleUpdateTransfer();

    //next
    handleNext();
  };
  const renderActionButtons = () => {
    const validationMessage = getValidationMessage(currentStep);
    if (mode === 'edit') {
      return (
        <div className='flex flex-col gap-2 m-5 pt-5'>
          {validationMessage && (
            <div className='text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200'>
              <strong>Required:</strong> {validationMessage}
            </div>
          )}
          <div className='flex justify-end items-end gap-4'>
            {currentStep !== 'customer' && (
              <ActionButton
                type='cancel'
                title='Back'
                onClick={handleBackAndUpdate}
                disabled={!isStepValid(currentStep)}
              />
            )}

            {currentStep !== 'pay' && (
              <ActionButton
                title='Save & Continue'
                onClick={handleNextAndUpdate}
                disabled={!isStepValid(currentStep)}
              />
            )}
          </div>
        </div>
      );
    }
    switch (currentStep) {
      case 'customer':
        // CONTINUE (one button)
        return (
          <div className='flex flex-col gap-2 m-5 pt-5'>
            {validationMessage && (
              <div className='text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200'>
                <strong>Required:</strong> {validationMessage}
              </div>
            )}
            <div
              className={`flex justify-end items-end gap-4
              }`}
            >
              <ActionButton
                title='Continue'
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
              />
            </div>
          </div>
        );

      case 'currencies':
        // BACK and SAVE & CONTINUE (or just show Continue if step is completed)
        return (
          <div className='flex flex-col gap-2 m-5 pt-5'>
            {validationMessage && !completedSteps.includes(currentStep) && (
              <div className='text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200'>
                <strong>Required:</strong> {validationMessage}
              </div>
            )}
            <div className='flex justify-end items-end gap-4'>
              <ActionButton title='Back' onClick={handleBack} type='cancel' />
              {isStepCompleted(currentStep) ? (
                <ActionButton title='Continue' onClick={handleNext} />
              ) : (
                <ActionButton
                  title='Save & Continue'
                  onClick={handleNext}
                  disabled={!isStepValid(currentStep)}
                />
              )}
            </div>
          </div>
        );

      case 'review':
        // BACK and SAVE & CONTINUE
        return (
          <div className='flex flex-col gap-2 m-5 pt-5'>
            {validationMessage && (
              <div className='text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200'>
                <strong>Required:</strong> {validationMessage}
              </div>
            )}
            <div className='flex justify-end items-end gap-4'>
              <ActionButton title='Back' onClick={handleBack} type='cancel' />
              <ActionButton
                title='Save & Continue'
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
              />
            </div>
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

  const handleBackToTransfers = () => {
    navigate(ROUTES.TRANSFERS.LIST);
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-start items-center gap-3'>
        {mode === 'edit' && (
          <button
            onClick={handleBackToTransfers}
            className='text-primary top-1 cursor-pointer hover:text-primary/80 transition-colors'
            aria-label={t('common.back')}
          >
            <BackArrowIcon width={30} height={30} />
          </button>
        )}
        <PageTitle title={t('modules.pages.sendRemittance.title')} />
      </div>
      <div className='bg-white rounded-lg border'>
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
        <hr className='border-gray-200' />
        {/* TODO: changes the renders function into components */}
        {renderCurrentStep()}

        <hr className='border-gray-200' />
        {renderActionButtons()}
      </div>
      {mode === 'create' && (
        <div className='bg-white rounded-lg border'>
          <DataTable
            tableTitle='Draft Transfers'
            data={draftTransfersData}
            columns={columns}
            isLoading={draftTransfersLoading}
            error={draftTransfersError}
            pagination={pagination}
          />
        </div>
      )}
    </div>
  );
};

export default SendRemittancePage;
