import { API_URLS } from '@/constants/api';
import apiClient from '@/lib/axiosInstance';
import type {
  PaymentMethod,
  PaymentProvider,
  PaymentRequest,
  PaymentResponse,
} from '@/types/payment';

// Re-export types for easy access
export type {
  PaymentData,
  PaymentError,
  PaymentFormData,
  PaymentMethod,
  PaymentProvider,
  PaymentProviderConfig,
  PaymentRequest,
  PaymentResponse,
  PaymentStatus,
  StripePaymentRequest,
} from '@/types/payment';

export const paymentService = {
  // Create and process payment
  createPayment: async (
    paymentData: PaymentRequest
  ): Promise<PaymentResponse> => {
    const response = await apiClient.post(
      API_URLS.payments.create,
      paymentData
    );
    // Return response without handleApiResponse to preserve status and errors
    return response.data;
  },

  // Validate payment request data
  validatePaymentRequest: (data: PaymentRequest): string[] => {
    const errors: string[] = [];

    // Check required fields - at least one of transactionReference, paymentLinkToken, or walletCurrencyId is required
    if (
      !data.transactionReference &&
      !data.paymentLinkToken &&
      !data.walletCurrencyId
    ) {
      errors.push(
        'Either transactionReference, paymentLinkToken, or walletCurrencyId is required'
      );
    }

    // If walletCurrencyId is provided, amount is required
    if (data.walletCurrencyId && !data.amount) {
      errors.push('Amount is required when walletCurrencyId is provided');
    }

    // Validate amount if provided
    if (
      data.amount !== undefined &&
      data.amount !== null &&
      data.amount < 0.01
    ) {
      errors.push('Amount must be at least 0.01');
    }

    if (!data.provider) {
      errors.push('Provider is required');
    }

    if (!data.payment_method) {
      errors.push('Payment method is required');
    }

    // Validate provider
    const validProviders: PaymentProvider[] = ['stripe', 'paypal', 'worldpay'];
    if (data.provider && !validProviders.includes(data.provider)) {
      errors.push('Invalid payment provider');
    }

    // Validate payment method (can be either a PaymentMethod type or a token string)
    const validMethods: PaymentMethod[] = [
      'card',
      'bank_transfer',
      'digital_wallet',
    ];
    if (data.payment_method && typeof data.payment_method === 'string') {
      // If it's a string, check if it's a valid payment method type or assume it's a payment token
      if (
        !validMethods.includes(data.payment_method as PaymentMethod) &&
        !data.payment_method.startsWith('pm_') && // Stripe payment method token
        !data.payment_method.startsWith('card_') && // Stripe card token
        data.payment_method.length <= 10
      ) {
        // Generic token validation
        errors.push('Invalid payment method or token');
      }
    }

    // Provider-specific validation (only for PaymentMethod types, not tokens)
    if (
      data.provider === 'stripe' &&
      typeof data.payment_method === 'string' &&
      validMethods.includes(data.payment_method as PaymentMethod) &&
      data.payment_method !== 'card'
    ) {
      errors.push('Stripe currently only supports card payments');
    }

    return errors;
  },

  // Get supported payment methods for a provider
  getSupportedMethods: (provider: PaymentProvider): PaymentMethod[] => {
    switch (provider) {
      case 'stripe':
        return ['card'];
      case 'paypal':
        return ['card', 'digital_wallet'];
      case 'worldpay':
        return ['card', 'bank_transfer'];
      default:
        return [];
    }
  },
};
