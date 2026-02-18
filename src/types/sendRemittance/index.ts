export interface SendRemittanceCustomer {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  countryId: number;
  countryIso3: string;
  countryName: string;
}

export interface SendRemittanceRecipient {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  countryId: number;
  countryIso3: string;
  countryName: string;
  countryPhoneCode: string;
  phoneNumber: string;
  email: string;
  address: {
    streetName: string;
    houseNumber: string;
    postalCode: string;
    extraDetails: string;
    city: string;
    state: string;
    country: string;
  };
  customers: { id: number; full_name: string }[];
}

export interface SendRemittanceCountry {
  id: number;
  name: string;
  iso3: string;
}

export interface SendRemittanceCurrency {
  id?: number;
  code: string;
  name?: string;
}

export interface SendRemittanceMethod {
  id: number;
  name: string;
  description?: string;
  type?: 'remittance_method' | 'payout_agent'; // To distinguish between RM and payout agent
}

export interface SendRemittancePayoutAgent {
  id: number;
  name: string;
  business_name?: string;
  type?: 'remittance_method' | 'payout_agent';
}

export interface SendRemittanceSourceIncome {
  id: number;
  formal_name: string;
}

export interface SendRemittancePurpose {
  id: number;
  formal_name: string;
}

export type PaymentMethod =
  | 'remittance_cart'
  | 'payment_link'
  | 'wallet'
  | 'credit_card';

export interface SendRemittanceExchangeDetails {
  // New transaction preview fields
  send_amount: number;
  send_currency_code: string;
  total_commission: number;
  send_agent_commission: number;
  extra_fees: number;
  total_paypal_amount: number;
  platform_exchange_rate: number;
  receive_amount: number;
  receive_currency_code: string;
  recipient_net_amount: number;

  // Legacy fields for backward compatibility (optional)
  applied_exchange_rate?: number;
  from_amount?: number;
  to_amount?: number;
  margin_amount?: number;
  margin_percentage?: number;
  market_rate?: number;
}

// Step 1 Data
export interface SendRemittanceStepOne {
  customer: SendRemittanceCustomer | null;
  recipient: SendRemittanceRecipient | null;
  sendCountry: SendRemittanceCountry | null;
  receiveCountry: SendRemittanceCountry | null;
  remittanceMethod: SendRemittanceMethod | null;
  payoutAgent: SendRemittancePayoutAgent | null;
  selectedPaymentMethodType: 'remittance_method' | 'payout_agent' | null;
}

// Step 2 Data
export interface SendRemittanceStepTwo {
  sendCurrency: SendRemittanceCurrency | null;
  sendAmount: number;
  receiveCurrency: SendRemittanceCurrency | null;
  receiveAmount: number;
  exchangeDetails: SendRemittanceExchangeDetails | null;
  extraFeesPercent: number;
  isAllFeesIncludedInSendAmount: boolean;
  isCalculateFromReceiveAmount: boolean;
}

// Step 3 Data
export interface SendRemittanceStepThree {
  sourceOfIncome: SendRemittanceSourceIncome | null;
  remittancePurpose: SendRemittancePurpose | null;
  extraDetails: string;
  descriptionOrReference: string;
}

// Step 4 Data (Pay step)
export interface SendRemittanceStepFour {
  paymentMethod: PaymentMethod | null;
  paymentLink?:
    | string
    | { id: string; url: string; token?: string; status?: string };
  paymentLinkByTransaction?: {
    id: string;
    url: string;
    token?: string;
    status?: string;
  };
  remittance_cart?: {
    id: number;
    currency: string;
    status: string | null;
    payment_link: {
      token: string;
      status: string;
      expired_at: string;
    } | null;
  } | null;
}

// Complete Send Remittance Data
export interface SendRemittanceData {
  stepOne: SendRemittanceStepOne;
  stepTwo: SendRemittanceStepTwo;
  stepThree: SendRemittanceStepThree;
  stepFour: SendRemittanceStepFour;
}

// Store State
export interface SendRemittanceState {
  mode: 'create' | 'edit';
  remittanceId?: number;
  currentStep: 'customer' | 'currencies' | 'review' | 'pay';
  completedSteps: ('customer' | 'currencies' | 'review' | 'pay')[];
  data: SendRemittanceData;
  isLoading: boolean;
  errors: Record<string, string>;
  transferCreated: boolean;
}

// Store Actions
export interface SendRemittanceActions {
  // Mode and navigation
  setMode: (mode: 'create' | 'edit') => void;
  setRemittanceId: (id?: number) => void;
  setCurrentStep: (step: 'customer' | 'currencies' | 'review' | 'pay') => void;
  markStepCompleted: (
    step: 'customer' | 'currencies' | 'review' | 'pay',
  ) => void;
  resetCompletedSteps: () => void;

  // Step 1 actions
  setCustomer: (customer: SendRemittanceCustomer | null) => void;
  setRecipient: (recipient: SendRemittanceRecipient | null) => void;
  setSendCountry: (country: SendRemittanceCountry | null) => void;
  setReceiveCountry: (country: SendRemittanceCountry | null) => void;
  setRemittanceMethod: (method: SendRemittanceMethod | null) => void;
  setPayoutAgent: (agent: SendRemittancePayoutAgent | null) => void;
  setSelectedPaymentMethodType: (
    type: 'remittance_method' | 'payout_agent' | null,
  ) => void;

  // Step 2 actions
  setSendCurrency: (currency: SendRemittanceCurrency | null) => void;
  setSendAmount: (amount: number) => void;
  setReceiveCurrency: (currency: SendRemittanceCurrency | null) => void;
  setReceiveAmount: (amount: number) => void;
  setExchangeDetails: (details: SendRemittanceExchangeDetails | null) => void;
  setExtraFeesPercent: (percent: number) => void;
  setIsAllFeesIncludedInSendAmount: (value: boolean) => void;
  setIsCalculateFromReceiveAmount: (value: boolean) => void;

  // Step 3 actions
  setSourceOfIncome: (source: SendRemittanceSourceIncome | null) => void;
  setRemittancePurpose: (purpose: SendRemittancePurpose | null) => void;
  setExtraDetails: (details: string) => void;
  setDescriptionOrReference: (description: string) => void;

  // Step 4 actions
  setPaymentMethod: (method: PaymentMethod | null) => void;
  setPaymentLink: (
    link?:
      | string
      | { id: string; url: string; token?: string; status?: string },
  ) => void;
  setPaymentLinkByTransaction: (link?: {
    id: string;
    url: string;
    token?: string;
    status?: string;
  }) => void;
  setCartAddedTo: (cart?: string | { id: string }) => void;

  // Utility actions
  clearErrors: () => void;
  setError: (field: string, error: string) => void;
  setTransferCreated: (created: boolean) => void;
  resetStore: () => void;
  loadExistingRemittance: (remittanceId: number) => Promise<void>;

  // Navigation helpers
  canNavigateToStep: (
    step: 'customer' | 'currencies' | 'review' | 'pay',
  ) => boolean;
  isStepCompleted: (
    step: 'customer' | 'currencies' | 'review' | 'pay',
  ) => boolean;
  isStepValid: (step: 'customer' | 'currencies' | 'review' | 'pay') => boolean;
}

export type SendRemittanceStore = SendRemittanceState & SendRemittanceActions;
