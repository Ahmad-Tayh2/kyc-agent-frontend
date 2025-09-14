import type { PaymentProvider, PaymentProviderConfig } from '@/types/payment';

export const PAYMENT_PROVIDERS: Record<PaymentProvider, PaymentProviderConfig> =
  {
    stripe: {
      name: 'stripe',
      displayName: 'Stripe',
      supportedMethods: ['card'],
      requiresRedirect: false,
    },
    paypal: {
      name: 'paypal',
      displayName: 'PayPal',
      supportedMethods: ['card', 'digital_wallet'],
      requiresRedirect: true,
    },
    worldpay: {
      name: 'worldpay',
      displayName: 'WorldPay',
      supportedMethods: ['card', 'bank_transfer'],
      requiresRedirect: false,
    },
  };

export const getPaymentProvider = (
  provider: PaymentProvider
): PaymentProviderConfig => {
  return PAYMENT_PROVIDERS[provider];
};

export const getSupportedProviders = (): PaymentProviderConfig[] => {
  return Object.values(PAYMENT_PROVIDERS);
};

export const isProviderSupported = (
  provider: string
): provider is PaymentProvider => {
  return provider in PAYMENT_PROVIDERS;
};
