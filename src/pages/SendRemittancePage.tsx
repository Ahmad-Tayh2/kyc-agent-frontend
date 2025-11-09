import BackArrowIcon from "@/assets/icons/back-arrow.svg?react";
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
import {
  useCreateTransfer,
  useGetTransfer,
  useGetTransfers,
  useUpdateTransfer,
} from "@/hooks/data/useTransfers";
import { useSendRemittanceStore } from "@/store/sendRemittanceStore";

import { DataTable } from "@/components/shared/DataTable";
import { draftTransfersTableColum } from "@/components/transfers/DraftTransfersTableColum";
import { ROUTES } from "@/constants/routes";
import { useGetCustomer } from "@/hooks/data/useCustomers";
import { useGetRecipient } from "@/hooks/data/useRecipients";
import { useTransferFilters } from "@/hooks/data/useTransferFilters";
import { useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSendRemittanceNavigation } from "@/hooks/useSendRemittanceNavigation";
import { useSendRemittanceValidation } from "@/hooks/useSendRemittanceValidation";
import {
  buildDraftTransferPayload,
  buildUpdateTransferPayload,
} from "@/utils/sendRemittancePayload";
interface SendRemittancePageProps {
  mode?: "create" | "edit";
}
const SendRemittancePage = (props: SendRemittancePageProps) => {
  const { mode = "create" } = props;
  const { t } = useTranslation("global");
  const navigate = useNavigate();
  const columns = draftTransfersTableColum();

  const { reference_number } = useParams<{ reference_number: string }>();
  const { data: response } = useGetTransfer(reference_number!);

  const [searchParams] = useSearchParams();
  const customerIdQuery = searchParams.get("customer");
  const recipientIdQuery = searchParams.get("recipient");
  const { filtersString, updateStatus, updatePagination } = useTransferFilters({
    status: ["draft"],
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

  // Initialize store for create mode when component mounts
  // Only run once when component mounts or when mode/reference_number changes
  useEffect(() => {
    // Only reset if we're in create mode without a reference number
    // or if we're switching between create and edit modes
    const shouldReset = mode === "create" && !reference_number;

    if (shouldReset) {
      resetStore();
    }

    if (mode === "edit") {
      markStepCompleted("customer");
      markStepCompleted("currencies");
      setCurrentStep("review");
    } else if (mode === "create") {
      updateStatus(["draft"]);
    }
    setMode(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, reference_number]);

  useEffect(() => {
    if (transferData?.id && mode === "edit") {
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
          countryIso3: transferData.customer.country?.iso3 || "",
          countryName: transferData.customer.country?.name || "",
        });
      }

      if (transferData.send_country) {
        setSendCountry({
          id: transferData.send_country.id,
          name: transferData.send_country.name,
          iso3: transferData.send_country.iso3 || "",
        });
      }

      if (transferData.recipient) {
        setRecipient({
          id: transferData.recipient.id,
          firstName: transferData.recipient.first_name,
          lastName: transferData.recipient.last_name,
          fullName: `${transferData.recipient.first_name} ${transferData.recipient.last_name}`,
          countryId: transferData.recipient.country?.id || 0,
          countryIso3: transferData.recipient.country?.iso3 || "",
          // API returns country as string directly, not an object
          countryName:
            typeof transferData.recipient.country === "string"
              ? transferData.recipient.country
              : transferData.recipient.country?.name || "",
          countryPhoneCode: transferData.recipient.country_phone_code || "",
          // API returns 'phone' not 'phone_number'
          phoneNumber:
            transferData.recipient.phone ||
            transferData.recipient.phone_number ||
            "",
          email: transferData.recipient.email || "",
          address: {
            streetName: transferData.recipient.address?.street || "",
            houseNumber: "",
            postalCode: transferData.recipient.address?.postal_code || "",
            extraDetails: "",
            city: transferData.recipient.address?.city?.name || "",
            state: transferData.recipient.address?.state?.name || "",
            // Use country string from recipient if address.country is not available
            country:
              transferData.recipient.address?.country?.name ||
              (typeof transferData.recipient.country === "string"
                ? transferData.recipient.country
                : ""),
          },
          customers: transferData.recipient.customers || [],
        });
      }

      if (transferData.receive_country) {
        setReceiveCountry({
          id: transferData.receive_country.id,
          name: transferData.receive_country.name,
          iso3: transferData.receive_country.iso3 || "",
        });
      }

      if (transferData.remittance_method) {
        setRemittanceMethod({
          id: transferData.remittance_method.id,
          name: transferData.remittance_method.name,
          type: "remittance_method",
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
        setExchangeDetails({
          applied_exchange_rate: transferData.platform_exchange_rate,
          to_amount: transferData.receive_amount,
          margin_amount: transferData.extra_fees_amount || "0",
          from_amount: transferData.sent_amount,
        });
      }

      // Set extra fees percentage if available
      if (
        transferData.extra_fees_applied_percent !== undefined &&
        transferData.extra_fees_applied_percent !== null
      ) {
        setExtraFeesPercent(Number(transferData.extra_fees_applied_percent));
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
    setCustomer,
    setSendCountry,
    setRecipient,
    setReceiveCountry,
    setRemittanceMethod,
    setSendAmount,
    setReceiveAmount,
    setSendCurrency,
    setReceiveCurrency,
    setExchangeDetails,
    setExtraFeesPercent,
    setSourceOfIncome,
    setRemittancePurpose,
    setCartAddedTo,
  ]);

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
        countryIso3: "",
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
        countryIso3: recipient.address?.country?.iso3 || "",
        countryName: recipient.address?.country?.name || "",
        countryPhoneCode: recipient.country_phone_code || "",
        phoneNumber: recipient.phone_number || "",
        email: recipient.email || "",
        address: {
          streetName: recipient.address?.street || "",
          houseNumber: "",
          postalCode: recipient.address?.postal_code || "",
          extraDetails: "",
          city: recipient.address?.city?.name || "",
          state: recipient.address?.state?.name || "",
          country: recipient.address?.country?.name || "",
        },
        customers: recipient?.customers || [],
      });
    }
  }, [recipientData]);

  // Validation message is now handled by the hook

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
  const { mutateAsync: createDraftTransfer } = useCreateTransfer(() => {
    if (!navigation.isStepCompleted("currencies")) {
      markStepCompleted("currencies");
    }
    setCurrentStep("review");
  });
  const { mutateAsync: editTransfer } = useUpdateTransfer(reference_number!);

  // Handler for currencies step validation and draft creation
  const handleCurrenciesValidation = useCallback(async () => {
    const transferDraftPayload = buildDraftTransferPayload(storeData, {
      comment: "Transfer created from send remittance flow",
      rmSpId: 1, // TODO: Get from proper source
    });

    if (!transferDraftPayload) {
      console.error("Failed to build transfer payload");
      return;
    }

    const createTransferResponse = await createDraftTransfer(
      transferDraftPayload as any // TODO: Fix type mismatch with TransactionCreateDataType
    );
    navigate(
      ROUTES.SEND_REMITTANCE.EDIT(
        createTransferResponse?.data?.reference_number
      )
    );
  }, [storeData, createDraftTransfer, navigate]);

  // Handler for next button
  const handleNext = useCallback(() => {
    // Currencies step needs special handling for create mode
    if (navigation.currentStep === "currencies" && mode === "create") {
      handleCurrenciesValidation();
      return;
    }

    // For all other cases, use the navigation hook
    navigation.goToNextStep();
  }, [navigation, mode, handleCurrenciesValidation]);

  // Handler for back button
  const handleBack = useCallback(() => {
    navigation.goToPreviousStep();
  }, [navigation]);

  const renderCurrentStep = () => {
    switch (navigation.currentStep) {
      case "customer":
        return (
          <CustomerRecipientStep
            customerId={customerIdQuery}
            recipientId={recipientIdQuery}
          />
        );
      case "currencies":
        return <CurrenciesAmountStep />;
      case "review":
        return <ReviewStep />;
      case "pay":
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

  // Handler for updating transfer (used in edit mode)
  const handleUpdateTransfer = useCallback(async () => {
    const transferUpdatePayload = buildUpdateTransferPayload(storeData, {
      comment: "Transfer updated from send remittance flow",
      rmSpId: 1, // TODO: Get from proper source
    });

    if (!transferUpdatePayload) {
      console.error("Failed to build update payload");
      return;
    }

    await editTransfer(transferUpdatePayload as any); // TODO: Fix type mismatch
  }, [storeData, editTransfer]);

  const handleBackAndUpdate = useCallback(() => {
    // Just go back without updating - user might want to change previous step data
    handleBack();
  }, [handleBack]);

  const handleNextAndUpdate = useCallback(() => {
    handleUpdateTransfer();
    handleNext();
  }, [handleUpdateTransfer, handleNext]);
  const renderActionButtons = () => {
    if (mode === "edit") {
      return (
        <div className="flex flex-col gap-2 m-5 pt-5">
          {validationMessage && (
            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
              <strong>Required:</strong> {validationMessage}
            </div>
          )}
          <div className="flex justify-end items-end gap-4">
            {navigation.canGoBack && (
              <ActionButton
                type="cancel"
                title="Back"
                onClick={handleBackAndUpdate}
                disabled={false}
              />
            )}

            {navigation.currentStep !== "pay" && (
              <ActionButton
                title="Save & Continue"
                onClick={handleNextAndUpdate}
                disabled={!navigation.canGoForward}
              />
            )}
          </div>
        </div>
      );
    }

    switch (navigation.currentStep) {
      case "customer":
        return (
          <div className="flex flex-col gap-2 m-5 pt-5">
            {validationMessage && (
              <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                <strong>Required:</strong> {validationMessage}
              </div>
            )}
            <div className="flex justify-end items-end gap-4">
              <ActionButton
                title="Continue"
                onClick={handleNext}
                disabled={!navigation.canGoForward}
              />
            </div>
          </div>
        );

      case "currencies":
        return (
          <div className="flex flex-col gap-2 m-5 pt-5">
            {validationMessage &&
              !navigation.completedSteps.includes(navigation.currentStep) && (
                <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                  <strong>Required:</strong> {validationMessage}
                </div>
              )}
            <div className="flex justify-end items-end gap-4">
              <ActionButton title="Back" onClick={handleBack} type="cancel" />
              {navigation.isStepCompleted(navigation.currentStep) ? (
                <ActionButton title="Continue" onClick={handleNext} />
              ) : (
                <ActionButton
                  title="Save & Continue"
                  onClick={handleNext}
                  disabled={!navigation.canGoForward}
                />
              )}
            </div>
          </div>
        );

      case "review":
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
                disabled={!navigation.canGoForward}
              />
            </div>
          </div>
        );

      case "pay":
        return (
          <div className="flex justify-end items-end gap-4 m-5 pt-5">
            <ActionButton title="Back" onClick={handleBack} type="cancel" />
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
    <div className="space-y-4">
      <div className="flex justify-start items-center gap-3">
        {mode === "edit" && (
          <button
            onClick={handleBackToTransfers}
            className="text-primary top-1 cursor-pointer hover:text-primary/80 transition-colors"
            aria-label={t("common.back")}
          >
            <BackArrowIcon width={30} height={30} />
          </button>
        )}
        <PageTitle title={t("modules.pages.sendRemittance.title")} />
      </div>
      <div className="bg-white rounded-lg border">
        <StepIndicator
          steps={steps}
          currentStep={navigation.currentStep}
          completedSteps={navigation.completedSteps}
        />
        <hr className="border-gray-200" />
        {/* TODO: changes the renders function into components */}
        {renderCurrentStep()}

        <hr className="border-gray-200" />
        {renderActionButtons()}
      </div>
      {mode === "create" && (
        <div className="bg-white rounded-lg border">
          <DataTable
            tableTitle="Draft Transfers"
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
