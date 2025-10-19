// Worldpay Hosted Payment Pages JavaScript library type declarations

declare global {
  interface Window {
    WPCL: {
      Library: new () => WorldpayLibrary;
    };
  }
}

interface WorldpayLibrary {
  setup(options: WorldpayOptions): void;
  destroy(): void;
}

interface WorldpayOptions {
  url: string;
  target?: string; // Required for iframe, not for lightbox
  type?: 'iframe' | 'lightbox';
  inject?: 'onload' | 'immediate' | 'default';
  accessibility?: boolean;
  debug?: boolean;
  hideContent?: boolean;
  disableScrolling?: boolean;
  trigger?: string; // For lightbox only
  lightboxMaskOpacity?: number;
  lightboxMaskColor?: string;
  customisation?: string;
  resultCallback?: (responseData: WorldpayCallbackData) => void;
  flowCallback?: (result: { page: string }) => void;
}

interface WorldpayCallbackData {
  order: {
    orderKey: string;
    status:
      | 'success'
      | 'pending'
      | 'failure'
      | 'error'
      | 'exception'
      | 'cancelled_by_shopper'
      | 'session_expired';
  };
  error: {
    referenceNumber?: string;
  } | null;
  gateway: Record<string, unknown> | null;
}

export type { WorldpayCallbackData, WorldpayLibrary, WorldpayOptions };
