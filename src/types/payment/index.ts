// Payment Provider Types
export type PaymentProvider = 'stripe' | 'paypal' | 'worldpay';

// Payment Method Types
export type PaymentMethod = 'card' | 'bank_transfer' | 'digital_wallet';

// Payment Request Types
export interface PaymentRequest {
  transactionReference?: number | string | null; // Allow string transaction references
  paymentLinkToken?: string | null;
  walletCurrencyId?: number | null; // For adding money to wallet
  amount?: number | null; // Required when walletCurrencyId is provided
  provider: PaymentProvider;
  payment_method: PaymentMethod | string; // Allow both payment method type and payment method token
  description?: string;
  metadata?: Record<string, unknown>;
}

// Payment Response Types
export interface PaymentData {
  id: number;
  transaction_uuid: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  provider_transaction_id: string;
  provider_payment_method: string;
  status: PaymentStatus;
  type: 'payment';
  description?: string;
  metadata?: Record<string, unknown>;
  processed_at: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentResponse {
  status: boolean;
  message: string;
  data: PaymentData | null;
  errors: Record<string, string[]> | null;
}

// Payment Status Types
export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

// Stripe Specific Types
export interface StripePaymentRequest extends PaymentRequest {
  provider: 'stripe';
  payment_method: 'card';
  stripe_payment_method_id?: string;
}

// Generic Payment Provider Interface
export interface PaymentProviderConfig {
  name: PaymentProvider;
  displayName: string;
  supportedMethods: PaymentMethod[];
  requiresRedirect: boolean;
}

// Payment Form Data
export interface PaymentFormData {
  provider: PaymentProvider;
  payment_method: PaymentMethod;
  description?: string;
  savePaymentMethod?: boolean;
}

// Payment Error Types
export interface PaymentError {
  code: string;
  message: string;
  type: 'card_error' | 'validation_error' | 'api_error' | 'network_error';
  param?: string;
}

// Payment Validation Types
export interface PaymentValidationRequest {
  transactionReference?: string | null;
  paymentLinkToken?: string | null;
  walletCurrencyId?: number | null;
  amount?: number | null;
}

// Common interfaces for validation response data
export interface Agent {
  id: number;
  name: string;
}

export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  country?: {
    id: number;
    name: string;
    code: string;
  };
}

export interface Recipient {
  id: number;
  name: string;
  phone: string;
  country_id?: number;
  country_name?: string;
  country_code?: string;
  country?: {
    id: number;
    name: string;
    code: string;
  };
}

export interface Country {
  id: number;
  name: string;
  code: string;
}

// Transaction Reference Validation Response
export interface TransactionValidationData {
  type: 'transaction';
  transaction_reference: string;
  payment_link_token: null;
  wallet_currency_id: null;
  total_amount: number;
  currency: string;
  agent: Agent;
  customer: Customer;
  recipient: Recipient;
  send_country: Country;
  receive_country: Country;
}

// Payment Link - Single Transaction Response
export interface PaymentLinkTransactionValidationData {
  type: 'payment_link';
  payment_link_type: 'transaction';
  transaction_reference: string;
  payment_link_token: string;
  wallet_currency_id: null;
  total_amount: number;
  currency: string;
  agent: Agent;
  customer: Customer;
  recipient: Recipient;
  send_country: Country;
  receive_country: Country;
}

// Payment Link - Remittance Cart Response
export interface PaymentLinkCartValidationData {
  type: 'payment_link';
  payment_link_type: 'remittance_cart';
  transaction_reference: null;
  payment_link_token: string;
  wallet_currency_id: null;
  total_amount: number;
  currency: string;
  agent: Agent;
  customer: Customer;
  recipients: Recipient[];
  send_country: Country;
  receive_countries: Country[];
  transactions_count: number;
}

// Add Money to Wallet Response
export interface AddMoneyValidationData {
  type: 'add_money';
  transaction_reference: null;
  payment_link_token: null;
  wallet_currency_id: number;
  total_amount: number;
  currency: string;
  agent: Agent;
  wallet_current_balance: number;
}

// Union type for all possible validation data types
export type PaymentValidationData =
  | TransactionValidationData
  | PaymentLinkTransactionValidationData
  | PaymentLinkCartValidationData
  | AddMoneyValidationData;

// Validation Response
export interface PaymentValidationResponse {
  status: boolean;
  message: string;
  data: PaymentValidationData | null;
  errors: string[] | null;
}
