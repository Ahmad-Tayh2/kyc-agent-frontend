// Payment Provider Types
export type PaymentProvider = 'stripe' | 'paypal' | 'worldpay';

// Payment Method Types
export type PaymentMethod = 'card' | 'bank_transfer' | 'digital_wallet';

// Payment Request Types
export interface PaymentRequest {
  transactionId?: number | string | null; // Allow string transaction references
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
