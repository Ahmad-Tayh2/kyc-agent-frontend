import type {
  SendRemittanceData,
  SendRemittanceStore,
} from "@/types/sendRemittance";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// Initial state factory
const createInitialData = (): SendRemittanceData => ({
  stepOne: {
    customer: null,
    recipient: null,
    sendCountry: null,
    receiveCountry: null,
    remittanceMethod: null,
    payoutAgent: null,
    selectedPaymentMethodType: null,
  },
  stepTwo: {
    sendCurrency: null,
    sendAmount: 0,
    receiveCurrency: null,
    receiveAmount: 0,
    exchangeDetails: null,
    extraFeesPercent: 0,
  },
  stepThree: {
    sourceOfIncome: null,
    remittancePurpose: null,
    extraDetails: "",
    descriptionOrReference: "",
  },
  stepFour: {
    paymentMethod: null,
    paymentLink: undefined,
    paymentLinkByTransaction: undefined,
    remittance_cart_id: "",
  },
});

export const useSendRemittanceStore = create<SendRemittanceStore>()(
  devtools(
    immer((set, get) => ({
      // Initial State
      mode: "create",
      remittanceId: undefined,
      currentStep: "customer",
      completedSteps: [],
      data: createInitialData(),
      isLoading: false,
      errors: {},
      transferCreated: false,

      // Mode and Navigation Actions
      setMode: (mode) =>
        set((state) => {
          state.mode = mode;
          if (mode === "create") {
            state.remittanceId = undefined;
            state.data = createInitialData();
            state.completedSteps = [];
            state.currentStep = "customer";
            state.errors = {};
            state.transferCreated = false;
          }
        }),

      setRemittanceId: (id) =>
        set((state) => {
          state.remittanceId = id;
        }),

      setCurrentStep: (step) =>
        set((state) => {
          const { canNavigateToStep } = get();
          if (canNavigateToStep(step)) {
            state.currentStep = step;
          }
        }),

      markStepCompleted: (step) =>
        set((state) => {
          if (!state.completedSteps.includes(step)) {
            state.completedSteps.push(step);
          }
        }),

      resetCompletedSteps: () =>
        set((state) => {
          state.completedSteps = [];
        }),

      // Step 1 Actions
      setCustomer: (customer) =>
        set((state) => {
          state.data.stepOne.customer = customer;

          // Reset recipient when customer changes
          if (customer?.id !== state.data.stepOne.customer?.id) {
            state.data.stepOne.recipient = null;
          }
        }),

      setRecipient: (recipient) =>
        set((state) => {
          state.data.stepOne.recipient = recipient;
          // Auto-set receive country from recipient's country
          if (recipient) {
            state.data.stepOne.receiveCountry = {
              id: recipient.countryId,
              name: recipient.countryName,
              iso3: recipient.countryIso3,
            };
          }
        }),

      setSendCountry: (country) =>
        set((state) => {
          state.data.stepOne.sendCountry = country;
          // Reset send currency when send country changes
          if (country?.id !== state.data.stepOne.sendCountry?.id) {
            state.data.stepTwo.sendCurrency = null;
            state.data.stepTwo.sendAmount = 0;
            state.data.stepTwo.exchangeDetails = null;
          }
        }),

      setReceiveCountry: (country) =>
        set((state) => {
          state.data.stepOne.receiveCountry = country;
          // Reset receive currency when receive country changes
          if (country?.id !== state.data.stepOne.receiveCountry?.id) {
            state.data.stepTwo.receiveCurrency = null;
            state.data.stepTwo.receiveAmount = 0;
            state.data.stepTwo.exchangeDetails = null;
          }
        }),

      setRemittanceMethod: (method) =>
        set((state) => {
          state.data.stepOne.remittanceMethod = method;
          // Clear payout agent when remittance method is selected
          if (method) {
            state.data.stepOne.payoutAgent = null;
            state.data.stepOne.selectedPaymentMethodType = "remittance_method";
          }
        }),

      setPayoutAgent: (agent) =>
        set((state) => {
          state.data.stepOne.payoutAgent = agent;
          // Clear remittance method when payout agent is selected
          if (agent) {
            state.data.stepOne.remittanceMethod = null;
            state.data.stepOne.selectedPaymentMethodType = "payout_agent";
          }
        }),

      setSelectedPaymentMethodType: (type) =>
        set((state) => {
          state.data.stepOne.selectedPaymentMethodType = type;
          // Clear both when type is null
          if (!type) {
            state.data.stepOne.remittanceMethod = null;
            state.data.stepOne.payoutAgent = null;
          }
        }),

      // Step 2 Actions
      setSendCurrency: (currency) =>
        set((state) => {
          state.data.stepTwo.sendCurrency = currency;
          // Reset amounts and exchange details when currency changes
          if (currency?.id !== state.data.stepTwo.sendCurrency?.id) {
            state.data.stepTwo.sendAmount = 0;
            state.data.stepTwo.receiveAmount = 0;
            state.data.stepTwo.exchangeDetails = null;
          }
        }),

      setSendAmount: (amount) =>
        set((state) => {
          state.data.stepTwo.sendAmount = amount;
          // Reset exchange details when amount changes
          state.data.stepTwo.exchangeDetails = null;
        }),

      setReceiveCurrency: (currency) =>
        set((state) => {
          state.data.stepTwo.receiveCurrency = currency;
          // Reset amounts and exchange details when currency changes
          if (currency?.id !== state.data.stepTwo.receiveCurrency?.id) {
            state.data.stepTwo.receiveAmount = 0;
            state.data.stepTwo.exchangeDetails = null;
          }
        }),

      setReceiveAmount: (amount) =>
        set((state) => {
          state.data.stepTwo.receiveAmount = amount;
        }),

      setExchangeDetails: (details) =>
        set((state) => {
          state.data.stepTwo.exchangeDetails = details;
          // if (details) {
          //   state.data.stepTwo.receiveAmount = details.total;
          // }
        }),

      setExtraFeesPercent: (percent) =>
        set((state) => {
          state.data.stepTwo.extraFeesPercent = percent;
        }),

      // Step 3 Actions
      setSourceOfIncome: (source) =>
        set((state) => {
          state.data.stepThree.sourceOfIncome = source;
        }),

      setRemittancePurpose: (purpose) =>
        set((state) => {
          state.data.stepThree.remittancePurpose = purpose;
        }),

      setExtraDetails: (details) =>
        set((state) => {
          state.data.stepThree.extraDetails = details;
        }),

      setDescriptionOrReference: (description) =>
        set((state) => {
          state.data.stepThree.descriptionOrReference = description;
        }),

      // Step 4 Actions
      setPaymentMethod: (method) =>
        set((state) => {
          state.data.stepFour.paymentMethod = method;
          // Clear payment link if method is not payment_link
          if (method !== "payment_link") {
            state.data.stepFour.paymentLink = undefined;
          }
        }),

      setPaymentLink: (link) =>
        set((state) => {
          state.data.stepFour.paymentLink = link;
        }),
      setPaymentLinkByTransaction: (link: any) =>
        set((state) => {
          state.data.stepFour.paymentLinkByTransaction = link;
        }),
      setCartAddedTo: (cart?: string | { id: string }) =>
        set((state) => {
          state.data.stepFour.remittance_cart_id =
            typeof cart === "string" ? cart : cart?.id || "";
        }),
      setTransferCreated: (created: boolean) =>
        set((state) => {
          state.transferCreated = created;
        }),

      // Utility Actions
      clearErrors: () =>
        set((state) => {
          state.errors = {};
        }),

      setError: (field, error) =>
        set((state) => {
          state.errors[field] = error;
        }),

      resetStore: () =>
        set((state) => {
          state.mode = "create";
          state.remittanceId = undefined;
          state.currentStep = "customer";
          state.completedSteps = [];
          state.data = createInitialData();
          state.isLoading = false;
          state.errors = {};
          state.transferCreated = false;
        }),

      loadExistingRemittance: async (remittanceId) => {
        set((state) => {
          state.isLoading = true;
          state.mode = "edit";
          state.remittanceId = remittanceId;
        });

        try {
          // TODO: Implement API call to load existing remittance data
          // const remittanceData = await transferService.getTransferById(remittanceId);
          //
          // set((state) => {
          //   // Map the API response to store format
          //   state.data = mapApiResponseToStoreData(remittanceData);
          //   state.completedSteps = ['customer', 'currencies', 'review']; // Set based on data availability
          //   state.currentStep = 'review'; // Or appropriate step for editing
          // });

          console.log("Loading existing remittance:", remittanceId);
        } catch (error) {
          console.error("Failed to load existing remittance:", error);
          set((state) => {
            state.errors.general = "Failed to load remittance data";
          });
        } finally {
          set((state) => {
            state.isLoading = false;
          });
        }
      },

      // Navigation Helpers
      canNavigateToStep: (step) => {
        const { completedSteps } = get();

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
      },

      isStepCompleted: (step) => {
        const { completedSteps } = get();
        return completedSteps.includes(step);
      },

      isStepValid: (step) => {
        const { data } = get();

        switch (step) {
          case "customer":
            return !!(
              data.stepOne.customer &&
              data.stepOne.recipient &&
              data.stepOne.sendCountry &&
              data.stepOne.receiveCountry &&
              (data.stepOne.remittanceMethod || data.stepOne.payoutAgent)
            );
          case "currencies":
            return !!(
              (
                data.stepTwo.sendCurrency &&
                data.stepTwo.receiveCurrency &&
                data.stepTwo.sendAmount > 0
              )
              // &&
              // data.stepTwo.exchangeDetails
            );
          case "review":
            return !!(
              data.stepThree.sourceOfIncome && data.stepThree.remittancePurpose
            );
          case "pay":
            return !!data.stepFour.paymentMethod;
          default:
            return false;
        }
      },
    })),
    {
      name: "send-remittance-store",
    }
  )
);

// Selector hooks for better performance and convenience
export const useSendRemittanceMode = () =>
  useSendRemittanceStore((state) => state.mode);

export const useSendRemittanceCurrentStep = () =>
  useSendRemittanceStore((state) => state.currentStep);

export const useSendRemittanceStepOne = () =>
  useSendRemittanceStore((state) => state.data.stepOne);

export const useSendRemittanceStepTwo = () =>
  useSendRemittanceStore((state) => state.data.stepTwo);

export const useSendRemittanceStepThree = () =>
  useSendRemittanceStore((state) => state.data.stepThree);

export const useSendRemittanceStepFour = () =>
  useSendRemittanceStore((state) => state.data.stepFour);

export const useSendRemittanceCompletedSteps = () =>
  useSendRemittanceStore((state) => state.completedSteps);

export const useSendRemittanceErrors = () =>
  useSendRemittanceStore((state) => state.errors);

export const useSendRemittanceActions = () => {
  return useSendRemittanceStore((state) => ({
    setMode: state.setMode,
    setRemittanceId: state.setRemittanceId,
    setCurrentStep: state.setCurrentStep,
    markStepCompleted: state.markStepCompleted,
    resetCompletedSteps: state.resetCompletedSteps,
    setCustomer: state.setCustomer,
    setRecipient: state.setRecipient,
    setSendCountry: state.setSendCountry,
    setReceiveCountry: state.setReceiveCountry,
    setRemittanceMethod: state.setRemittanceMethod,
    setPayoutAgent: state.setPayoutAgent,
    setSelectedPaymentMethodType: state.setSelectedPaymentMethodType,
    setSendCurrency: state.setSendCurrency,
    setSendAmount: state.setSendAmount,
    setReceiveCurrency: state.setReceiveCurrency,
    setReceiveAmount: state.setReceiveAmount,
    setExchangeDetails: state.setExchangeDetails,
    setExtraFeesPercent: state.setExtraFeesPercent,
    setSourceOfIncome: state.setSourceOfIncome,
    setRemittancePurpose: state.setRemittancePurpose,
    setExtraDetails: state.setExtraDetails,
    setDescriptionOrReference: state.setDescriptionOrReference,
    setPaymentMethod: state.setPaymentMethod,
    setPaymentLink: state.setPaymentLink,
    setPaymentLinkByTransaction: state.setPaymentLinkByTransaction,
    setCartAddedTo: state.setCartAddedTo,
    clearErrors: state.clearErrors,
    setError: state.setError,
    setTransferCreated: state.setTransferCreated,
    resetStore: state.resetStore,
    loadExistingRemittance: state.loadExistingRemittance,
    canNavigateToStep: state.canNavigateToStep,
    isStepCompleted: state.isStepCompleted,
    isStepValid: state.isStepValid,
  }));
};
