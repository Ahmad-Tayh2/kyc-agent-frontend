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

import { useSendRemittanceNavigation } from '@/hooks/useSendRemittanceNavigation';

import { useSendRemittanceValidation } from '@/hooks/useSendRemittanceValidation';

import {
  buildDraftTransferPayload,
  buildUpdateTransferPayload,
} from '@/utils/sendRemittancePayload';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useTranslation } from 'react-i18next';

import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

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

  const storeData = useSendRemittanceStore((state) => state.data);

  // Track original data snapshot for edit mode change detection

  const originalDataSnapshot = useRef<typeof storeData | null>(null);

  const location = useLocation();

  const pathSegments = location.pathname.split('/');

  const sendRemittanceIndex = pathSegments.findIndex(
    (segment) => segment === 'send-remittance'
  );

  const transactionRef =
    sendRemittanceIndex !== -1 && pathSegments[sendRemittanceIndex + 1]
      ? pathSegments[sendRemittanceIndex + 1]
      : null;

  const isEditMode = !!transactionRef;

  // Use custom hooks for navigation and validation

  const navigation = useSendRemittanceNavigation();

  const { validationMessage } = useSendRemittanceValidation();

  //actions

  const {
    setMode,
    resetStore,
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
    setExchangeDetails,
    setExtraFeesPercent,
  } = useSendRemittanceStore((state) => state);

  // Get markStepCompleted from store for initialization

  const markStepCompleted = useSendRemittanceStore(
    (state) => state.markStepCompleted
  );

  const setCurrentStep = useSendRemittanceStore(
    (state) => state.setCurrentStep
  );

  useEffect(() => {
    const shouldReset = mode === 'create' && !reference_number;

    if (shouldReset) {
      resetStore();
    }

    if (mode === 'edit') {
      setCurrentStep('customer');
    } else if (mode === 'create') {
      updateStatus(['draft']);
    }

    setMode(mode);
  }, [mode, reference_number]);

  useEffect(() => {
    if (transferData?.id && mode === 'edit') {
      // Transform API data to match store structure

      // Set step 1 data

      if (transferData.customer) {
        setCustomer({
          id: transferData.customer.id,

          firstName: transferData.customer.first_name,

          lastName: transferData.customer.last_name,

          fullName:
            transferData.customer.full_name ||
            `${transferData.customer.first_name} ${transferData.customer.last_name}`,

          countryId: transferData.customer.country?.id || 0,

          countryIso3: transferData.customer.country?.iso3 || '',

          countryName: transferData.customer.country?.name || '',
        });
      }

      if (transferData.send_country) {
        setSendCountry({
          id: transferData.send_country.id,

          name: transferData.send_country.name,

          iso3: transferData.send_country.iso3 || '',
        });
      }

      if (transferData.recipient) {
        setRecipient({
          id: transferData.recipient.id,

          firstName: transferData.recipient.first_name,

          lastName: transferData.recipient.last_name,

          fullName: `${transferData.recipient.first_name} ${transferData.recipient.last_name}`,

          countryId: transferData.recipient.country?.id || 0,

          countryIso3: transferData.recipient.country?.iso3 || '',

          // API returns country as string directly, not an object

          countryName:
            typeof transferData.recipient.country === 'string'
              ? transferData.recipient.country
              : transferData.recipient.country?.name || '',

          countryPhoneCode: transferData.recipient.country_phone_code || '',

          // API returns 'phone' not 'phone_number'

          phoneNumber:
            transferData.recipient.phone ||
            transferData.recipient.phone_number ||
            '',

          email: transferData.recipient.email || '',

          address: {
            streetName: transferData.recipient.address?.street || '',

            houseNumber: '',

            postalCode: transferData.recipient.address?.postal_code || '',

            extraDetails: '',

            city: transferData.recipient.address?.city?.name || '',

            state: transferData.recipient.address?.state?.name || '',

            // Use country string from recipient if address.country is not available

            country:
              transferData.recipient.address?.country?.name ||
              (typeof transferData.recipient.country === 'string'
                ? transferData.recipient.country
                : ''),
          },

          customers: transferData.recipient.customers || [],
        });
      }

      if (transferData.receive_country) {
        setReceiveCountry({
          id: transferData.receive_country.id,

          name: transferData.receive_country.name,

          iso3: transferData.receive_country.iso3 || '',
        });
      }

      if (transferData.remittance_method) {
        setRemittanceMethod({
          id: transferData.remittance_method.id,

          name: transferData.remittance_method.name,

          type: 'remittance_method',
        });
      }

      // Set step 2 data

      if (transferData.sent_amount) {
        setSendAmount(Number(transferData.sent_amount));
      }

      if (transferData.receive_amount) {
        setReceiveAmount(Number(transferData.receive_amount));
      }

      if (transferData.send_currency) {
        setSendCurrency({ code: transferData.send_currency });
      }

      if (transferData.receive_currency) {
        setReceiveCurrency({ code: transferData.receive_currency });
      }

      // Set exchange details from transaction data

      if (transferData.platform_exchange_rate) {
        // Handle both API response formats

        const sentAmount =
          transferData.sent_amount ||
          transferData.sent_amount_in_send_currency ||
          0;

        const receiveAmount =
          transferData.receive_amount ||
          transferData.receive_amount_in_send_currency ||
          0;

        setExchangeDetails({
          // New transaction preview fields

          send_amount: Number(sentAmount),

          send_currency_code: transferData.send_currency || '',

          total_commission: Number(transferData.total_commission_amount) || 0,

          send_agent_commission:
            Number(transferData.sending_agent_commission_amount) || 0,

          extra_fees: Number(transferData.extra_fees_amount) || 0,

          total_paypal_amount: Number(transferData.total_payable_amount) || 0,

          platform_exchange_rate:
            Number(transferData.platform_exchange_rate) || 0,

          receive_amount: Number(receiveAmount),

          receive_currency_code: transferData.receive_currency || '',

          recipient_net_amount: Number(transferData.payout_amount) || 0,

          // Legacy fields for backward compatibility

          applied_exchange_rate: transferData.platform_exchange_rate,

          to_amount: receiveAmount,

          margin_amount: transferData.extra_fees_amount || '0',

          from_amount: sentAmount,
        });
      }

      // Set extra fees percentage if available

      if (
        transferData.extra_fees_applied_percent !== undefined &&
        transferData.extra_fees_applied_percent !== null
      ) {
        setExtraFeesPercent(Number(transferData.extra_fees_applied_percent));
      }

      // Set checkbox states if available

      const setIsAllFeesIncludedInSendAmount =
        useSendRemittanceStore.getState().setIsAllFeesIncludedInSendAmount;

      const setIsCalculateFromReceiveAmount =
        useSendRemittanceStore.getState().setIsCalculateFromReceiveAmount;

      if (transferData.is_all_included_in_send_amount !== undefined) {
        setIsAllFeesIncludedInSendAmount(
          Boolean(transferData.is_all_included_in_send_amount)
        );
      } else {
        // If is_all_included_in_send_amount is not provided, check if send_amount equals total_payable_amount

        const sendAmount = Number(transferData.sent_amount || 0);

        const totalPayableAmount = Number(
          transferData.total_payable_amount || 0
        );

        // Use a small tolerance for floating point comparison

        const isAllFeesIncluded =
          Math.abs(sendAmount - totalPayableAmount) < 0.01;

        setIsAllFeesIncludedInSendAmount(isAllFeesIncluded);
      }

      if (transferData.do_calculate_from_receive_amount !== undefined) {
        setIsCalculateFromReceiveAmount(
          Boolean(transferData.do_calculate_from_receive_amount)
        );
      }

      // Set step 3 data

      if (transferData.source_income) {
        setSourceOfIncome({
          id: transferData.source_income.id,

          formal_name: transferData.source_income.formal_name,
        });
      }

      if (transferData.remittance_purpose) {
        setRemittancePurpose({
          id: transferData.remittance_purpose.id,

          formal_name: transferData.remittance_purpose.formal_name,
        });
      }

      // Set step 4 data

      if (transferData.remittance_cart_id) {
        setCartAddedTo(transferData.remittance_cart_id);
      }
    }
  }, [
    transferData,

    mode,

    // Don't include storeData in dependencies to avoid infinite loop

    // The snapshot is saved in a separate effect below
  ]);

  // Save snapshot after data is loaded in edit mode

  useEffect(() => {
    if (isEditMode && transferData?.id && !originalDataSnapshot.current) {
      // Wait a bit to ensure all data is loaded

      const timer = setTimeout(() => {
        originalDataSnapshot.current = JSON.parse(JSON.stringify(storeData));
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isEditMode, transferData?.id, storeData]);

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

        countryId: recipient.address?.country?.id || 0,

        countryIso3: recipient.address?.country?.iso3 || '',

        countryName: recipient.address?.country?.name || '',

        countryPhoneCode: recipient.country_phone_code || '',

        phoneNumber: recipient.phone_number || '',

        email: recipient.email || '',

        address: {
          streetName: recipient.address?.street || '',

          houseNumber: '',

          postalCode: recipient.address?.postal_code || '',

          extraDetails: '',

          city: recipient.address?.city?.name || '',

          state: recipient.address?.state?.name || '',

          country: recipient.address?.country?.name || '',
        },

        customers: recipient?.customers || [],
      });
    }
  }, [recipientData]);

  // Validation message is now handled by the hook

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
    if (!navigation.isStepCompleted('currencies')) {
      markStepCompleted('currencies');
    }

    setCurrentStep('review');
  });

  const { mutateAsync: editTransfer } = useUpdateTransfer(reference_number!);

  // Function to detect if data has changed

  const hasDataChanged = useCallback(() => {
    if (!isEditMode || !originalDataSnapshot.current) return false;

    const original = originalDataSnapshot.current;

    const current = storeData;

    // Compare only user-editable fields, excluding auto-calculated fields

    // Step 1 - Customer & Recipient

    if (original.stepOne.customer?.id !== current.stepOne.customer?.id)
      return true;

    if (original.stepOne.recipient?.id !== current.stepOne.recipient?.id)
      return true;

    if (original.stepOne.sendCountry?.id !== current.stepOne.sendCountry?.id)
      return true;

    if (
      original.stepOne.receiveCountry?.id !== current.stepOne.receiveCountry?.id
    )
      return true;

    if (
      original.stepOne.remittanceMethod?.id !==
      current.stepOne.remittanceMethod?.id
    )
      return true;

    if (original.stepOne.payoutAgent?.id !== current.stepOne.payoutAgent?.id)
      return true;

    // Step 2 - Currencies & Amounts (exclude exchangeDetails as it's auto-calculated)

    if (original.stepTwo.sendCurrency?.id !== current.stepTwo.sendCurrency?.id)
      return true;

    if (
      original.stepTwo.receiveCurrency?.id !==
      current.stepTwo.receiveCurrency?.id
    )
      return true;

    if (original.stepTwo.extraFeesPercent !== current.stepTwo.extraFeesPercent)
      return true;

    if (
      original.stepTwo.isAllFeesIncludedInSendAmount !==
      current.stepTwo.isAllFeesIncludedInSendAmount
    )
      return true;

    if (
      original.stepTwo.isCalculateFromReceiveAmount !==
      current.stepTwo.isCalculateFromReceiveAmount
    )
      return true;

    // Compare amounts based on calculation mode

    if (current.stepTwo.isCalculateFromReceiveAmount) {
      // When calculating from receive, only compare receive amount (send amount is auto-calculated)

      if (
        Math.abs(
          original.stepTwo.receiveAmount - current.stepTwo.receiveAmount
        ) > 0.01
      )
        return true;
    } else {
      // When calculating from send, only compare send amount (receive amount is auto-calculated)

      if (
        Math.abs(original.stepTwo.sendAmount - current.stepTwo.sendAmount) >
        0.01
      )
        return true;
    }

    // Step 3 - Review

    if (
      original.stepThree.sourceOfIncome?.id !==
      current.stepThree.sourceOfIncome?.id
    )
      return true;

    if (
      original.stepThree.remittancePurpose?.id !==
      current.stepThree.remittancePurpose?.id
    )
      return true;

    if (original.stepThree.extraDetails !== current.stepThree.extraDetails)
      return true;

    if (
      original.stepThree.descriptionOrReference !==
      current.stepThree.descriptionOrReference
    )
      return true;

    // Step 4 - Payment

    if (original.stepFour.paymentMethod !== current.stepFour.paymentMethod)
      return true;

    return false;
  }, [isEditMode, storeData]);

  // Handler for currencies step validation and draft creation

  const handleCurrenciesValidation = useCallback(async () => {
    const transferDraftPayload = buildDraftTransferPayload(storeData);

    if (!transferDraftPayload) {
      return;
    }

    const createTransferResponse = await createDraftTransfer(
      transferDraftPayload
    );

    navigate(
      ROUTES.SEND_REMITTANCE.EDIT(
        createTransferResponse?.data?.reference_number
      )
    );
  }, [storeData, createDraftTransfer, navigate]);

  // Handler for next button

  const handleNext = useCallback(async () => {
    // Check for changes in edit mode and auto-save

    if (isEditMode && hasDataChanged()) {
      const transferUpdatePayload = buildUpdateTransferPayload(storeData);

      if (transferUpdatePayload) {
        await editTransfer(transferUpdatePayload);

        // Update snapshot after successful update

        originalDataSnapshot.current = JSON.parse(JSON.stringify(storeData));
      }
    }

    // Currencies step needs special handling for create mode

    if (navigation.currentStep === 'currencies' && mode === 'create') {
      handleCurrenciesValidation();

      return;
    }

    // For all other cases, use the navigation hook

    navigation.goToNextStep();
  }, [
    navigation,

    mode,

    handleCurrenciesValidation,

    isEditMode,

    hasDataChanged,

    storeData,

    editTransfer,
  ]);

  // Handler for back button

  const handleBack = useCallback(async () => {
    // Check for changes in edit mode and auto-save

    if (isEditMode && hasDataChanged()) {
      const transferUpdatePayload = buildUpdateTransferPayload(storeData);

      if (transferUpdatePayload) {
        await editTransfer(transferUpdatePayload);

        // Update snapshot after successful update

        originalDataSnapshot.current = JSON.parse(JSON.stringify(storeData));
      }
    }

    navigation.goToPreviousStep();
  }, [navigation, isEditMode, hasDataChanged, storeData, editTransfer]);

  const renderCurrentStep = () => {
    switch (navigation.currentStep) {
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
        return (
          <PayStep
            transferId={transferData?.id}
            transferRef={transferData?.reference_number}
          />
        );

      default:
        return <CustomerRecipientStep />;
    }
  };

  const renderActionButtons = () => {
    if (mode === 'edit') {
      return (
        <div className='flex flex-col gap-2 m-5 pt-5'>
          {validationMessage && (
            <div className='text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200'>
              <strong>Required:</strong> {validationMessage}
            </div>
          )}

          <div className='flex justify-end items-end gap-4'>
            {navigation.canGoBack && (
              <ActionButton
                type='cancel'
                title='Back'
                onClick={handleBack}
                disabled={false}
              />
            )}

            {navigation.currentStep !== 'pay' && (
              <ActionButton
                title='Save & Continue'
                onClick={handleNext}
                disabled={!navigation.canGoForward}
              />
            )}
          </div>
        </div>
      );
    }

    switch (navigation.currentStep) {
      case 'customer':
        return (
          <div className='flex flex-col gap-2 m-5 pt-5'>
            {validationMessage && (
              <div className='text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200'>
                <strong>Required:</strong> {validationMessage}
              </div>
            )}

            <div className='flex justify-end items-end gap-4'>
              <ActionButton
                title='Continue'
                onClick={handleNext}
                disabled={!navigation.canGoForward}
              />
            </div>
          </div>
        );

      case 'currencies':
        return (
          <div className='flex flex-col gap-2 m-5 pt-5'>
            {validationMessage &&
              !navigation.completedSteps.includes(navigation.currentStep) && (
                <div className='text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200'>
                  <strong>Required:</strong> {validationMessage}
                </div>
              )}

            <div className='flex justify-end items-end gap-4'>
              <ActionButton title='Back' onClick={handleBack} type='cancel' />

              {navigation.isStepCompleted(navigation.currentStep) ? (
                <ActionButton title='Continue' onClick={handleNext} />
              ) : (
                <ActionButton
                  title='Save & Continue'
                  onClick={handleNext}
                  disabled={!navigation.canGoForward}
                />
              )}
            </div>
          </div>
        );

      case 'review':
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
                disabled={!navigation.canGoForward}
              />
            </div>
          </div>
        );

      case 'pay':
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

  // Check if there are unsaved changes

  const hasUnsavedChanges = isEditMode && hasDataChanged();

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

        {hasUnsavedChanges && (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300'>
            Unsaved changes
          </span>
        )}
      </div>

      <div className='bg-white rounded-lg border'>
        <StepIndicator
          steps={steps}
          currentStep={navigation.currentStep}
          completedSteps={navigation.completedSteps}
        />

        <hr className='border-gray-200' />

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
