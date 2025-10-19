import { Alert, AlertDescription } from '@/components/ui/alert';
import { PAYMENT_PROVIDERS } from '@/lib/paymentProviders';
import { cn } from '@/lib/utils';
import type { PaymentMethod, PaymentProvider } from '@/types/payment';
import { Building, CreditCard, Smartphone } from 'lucide-react';
import { useState } from 'react';

interface PaymentMethodSelectorProps {
  selectedProvider: PaymentProvider;
  selectedMethod: PaymentMethod | null;
  onProviderChange: (provider: PaymentProvider) => void;
  onMethodChange: (method: PaymentMethod) => void;
  className?: string;
}

const PAYMENT_METHOD_ICONS = {
  card: CreditCard,
  digital_wallet: Smartphone,
  bank_transfer: Building,
};

const PAYMENT_METHOD_LABELS = {
  card: 'Credit/Debit Card',
  digital_wallet: 'Digital Wallet',
  bank_transfer: 'Bank Transfer',
};

export default function PaymentMethodSelector({
  selectedProvider,
  selectedMethod,
  onProviderChange,
  onMethodChange,
  className,
}: PaymentMethodSelectorProps) {
  const [showMethods, setShowMethods] = useState(false);

  const currentProvider = PAYMENT_PROVIDERS[selectedProvider];
  const supportedMethods = currentProvider.supportedMethods;

  const handleProviderSelect = (provider: PaymentProvider) => {
    onProviderChange(provider);
    const providerConfig = PAYMENT_PROVIDERS[provider];
    if (providerConfig.supportedMethods.length === 1) {
      onMethodChange(providerConfig.supportedMethods[0]);
      setShowMethods(false);
    } else {
      setShowMethods(true);
    }
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    onMethodChange(method);
    setShowMethods(false);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Provider Selection */}
      <div>
        <h3 className='text-sm font-medium text-gray-700 mb-3'>
          Select Payment Provider
        </h3>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
          {Object.values(PAYMENT_PROVIDERS).map((provider) => (
            <button
              key={provider.name}
              onClick={() => handleProviderSelect(provider.name)}
              className={cn(
                'flex items-center justify-center p-4 border rounded-lg transition-all',
                'hover:border-blue-300 hover:bg-blue-50',
                selectedProvider === provider.name
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                  : 'border-gray-200 bg-white'
              )}
            >
              <span className='font-medium text-sm'>
                {provider.displayName}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Method Selection */}
      {(showMethods || supportedMethods.length > 1) && (
        <div>
          <h3 className='text-sm font-medium text-gray-700 mb-3'>
            Select Payment Method
          </h3>
          <div className='space-y-2'>
            {supportedMethods.map((method) => {
              const Icon = PAYMENT_METHOD_ICONS[method];
              return (
                <button
                  key={method}
                  onClick={() => handleMethodSelect(method)}
                  className={cn(
                    'w-full flex items-center p-3 border rounded-lg transition-all text-left',
                    'hover:border-blue-300 hover:bg-blue-50',
                    selectedMethod === method
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                      : 'border-gray-200 bg-white'
                  )}
                >
                  <Icon className='w-5 h-5 text-gray-400 mr-3' />
                  <span className='font-medium text-sm'>
                    {PAYMENT_METHOD_LABELS[method]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Provider-specific notices */}
      {selectedProvider === 'paypal' && (
        <Alert className='border-yellow-200 bg-yellow-50'>
          <AlertDescription className='text-yellow-700'>
            You will be redirected to PayPal to complete your payment securely.
          </AlertDescription>
        </Alert>
      )}

      {selectedProvider === 'worldpay' && selectedMethod === 'card' && (
        <Alert className='border-blue-200 bg-blue-50'>
          <AlertDescription className='text-blue-700'>
            You will be redirected to Worldpay to complete your payment
            securely.
          </AlertDescription>
        </Alert>
      )}

      {selectedProvider === 'worldpay' &&
        selectedMethod === 'bank_transfer' && (
          <Alert className='border-blue-200 bg-blue-50'>
            <AlertDescription className='text-blue-700'>
              Bank transfer payments may take 1-3 business days to process.
            </AlertDescription>
          </Alert>
        )}
    </div>
  );
}
