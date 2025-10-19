import type { WorldpayCallbackData } from '../types/worldpay';
import { clearPaymentProviderConflicts } from './paymentConflictResolver';

// Types and Interfaces
export interface PaymentData {
  amount: number;
  currency: string;
  order_code: string;
  status: string;
  payment_method?: string;
  transaction_id?: string;
}

/**
 * Shows user-friendly loading message during payment processing
 */
export const showPaymentLoading = (message: string): void => {
  console.log('PAYMENT LOADING:', message);
  // Implementation can be enhanced with actual UI feedback
};

/**
 * Hides payment loading state
 */
export const hidePaymentLoading = (): void => {
  console.log('PAYMENT LOADING: Hidden');
  // Implementation can be enhanced with actual UI feedback
};

/**
 * Shows success message to user
 */
export const showSuccessMessage = (message: string): void => {
  console.log('SUCCESS:', message);
  // Implementation can be enhanced with toast notifications
};

/**
 * Shows error message to user
 */
export const showErrorMessage = (message: string): void => {
  console.error('ERROR:', message);
  // Implementation can be enhanced with toast notifications
};

/**
 * Shows info message to user
 */
export const showInfoMessage = (message: string): void => {
  console.info('INFO:', message);
  // Implementation can be enhanced with toast notifications
};

/**
 * Validates payment data structure
 */
export const validatePaymentData = (data: unknown): data is PaymentData => {
  if (!data || typeof data !== 'object') return false;

  const payment = data as Record<string, unknown>;
  return (
    typeof payment.amount === 'number' &&
    typeof payment.currency === 'string' &&
    typeof payment.order_code === 'string' &&
    typeof payment.status === 'string'
  );
};

/**
 * Handles network errors with user-friendly messages
 */
export const handleNetworkError = (error: unknown): string => {
  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes('Network Error')) {
      return 'Network connection failed. Please check your internet connection and try again.';
    }
    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
    if (error.message.includes('404')) {
      return 'Payment service not found. Please contact support.';
    }
    if (error.message.includes('500')) {
      return 'Payment service temporarily unavailable. Please try again later.';
    }
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Redirects user to Worldpay payment page
 * Backend handles all XML order creation, we just redirect to the URL
 */
export const redirectToWorldpay = (redirectUrl: string): void => {
  console.log('=== WORLDPAY REDIRECT DEBUG ===');
  console.log('Redirect URL:', redirectUrl);

  // Simple redirect to Worldpay
  showPaymentLoading('Redirecting to Worldpay...');
  window.location.href = redirectUrl;
};

/**
 * Creates a manual iframe as fallback when Worldpay library fails
 */
const createManualIframe = (
  redirectUrl: string,
  container: HTMLElement,
  _onSuccess?: (data: WorldpayCallbackData | Record<string, unknown>) => void,
  onError?: (error: string) => void,
  _onCancel?: () => void
): void => {
  // Note: _onSuccess and _onCancel are not used in manual iframe fallback
  // as we can't easily detect payment completion without postMessage communication
  console.log('🔄 Creating manual iframe fallback...', {
    onSuccess: !!_onSuccess,
    onCancel: !!_onCancel,
  });

  // Clear container
  container.innerHTML = '';

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = redirectUrl;
  iframe.style.cssText = `
    width: 100%;
    height: 600px;
    border: none;
    border-radius: 8px;
  `;

  // Add loading indicator
  const loadingDiv = document.createElement('div');
  loadingDiv.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem;">
      <div style="margin-bottom: 1rem;">
        <svg style="width: 2rem; height: 2rem; animation: spin 1s linear infinite;" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="32" stroke-dashoffset="32">
            <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
            <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
      <p>Loading payment form...</p>
      <p style="font-size: 0.8rem; color: #666; margin-top: 0.5rem;">Using fallback iframe (Worldpay library unavailable)</p>
    </div>
  `;

  // Show loading first
  container.appendChild(loadingDiv);

  // Handle iframe load
  iframe.onload = () => {
    console.log('🔄 Manual iframe loaded');
    container.innerHTML = '';
    container.appendChild(iframe);
  };

  iframe.onerror = () => {
    console.error('❌ Manual iframe failed to load');
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; border: 1px solid #e5e5e5; border-radius: 8px;">
        <h3 style="color: #dc2626; margin-bottom: 1rem;">Payment Loading Failed</h3>
        <p style="margin-bottom: 1rem;">Unable to load the payment form. This might be due to:</p>
        <ul style="text-align: left; margin-bottom: 1rem;">
          <li>Network connectivity issues</li>
          <li>Browser security settings blocking the payment page</li>
          <li>Payment service temporarily unavailable</li>
        </ul>
        <button onclick="window.location.href='${redirectUrl}'" style="background: #2563eb; color: white; padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer;">
          Open Payment Page Directly
        </button>
      </div>
    `;
    onError?.(
      'Failed to load payment form. Please try opening the payment page directly.'
    );
  };

  // Add iframe after a short delay to show loading
  setTimeout(() => {
    loadingDiv.appendChild(iframe);
  }, 500);
};

/**
 * Opens Worldpay payment in an iframe using official Worldpay library
 */
export const openWorldpayIframe = (
  redirectUrl: string,
  containerId: string,
  onSuccess?: (data: WorldpayCallbackData | Record<string, unknown>) => void,
  onError?: (error: string) => void,
  onCancel?: () => void
): void => {
  console.log('=== WORLDPAY IFRAME DEBUG (Official Library) ===');
  console.log('Redirect URL:', redirectUrl);
  console.log('Container ID:', containerId);

  // Clear any payment provider conflicts before initializing
  clearPaymentProviderConflicts('worldpay');

  try {
    // Check if Worldpay library is loaded
    console.log('🔍 Checking Worldpay library availability...', {
      WPCL: typeof window.WPCL,
      Library: window.WPCL?.Library,
      windowKeys: Object.keys(window).filter(
        (k) =>
          k.toLowerCase().includes('wp') || k.toLowerCase().includes('worldpay')
      ),
    });

    if (!window.WPCL) {
      console.error('❌ Worldpay library (WPCL) not loaded');
      console.log(
        'Available scripts:',
        Array.from(document.scripts).map((s) => s.src)
      );
      onError?.('Worldpay library not loaded. Please refresh the page.');
      return;
    }

    // Find container
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(
        `Container with ID '${containerId}' not found. Available elements:`,
        Array.from(document.querySelectorAll('[id]')).map((el) => el.id)
      );
      throw new Error(`Container with ID '${containerId}' not found`);
    }

    // Clear existing content
    container.innerHTML = '';

    // Create Worldpay library instance
    const libraryObject = new window.WPCL.Library();

    // Setup options for iframe
    const options = {
      url: redirectUrl,
      target: containerId,
      type: 'iframe' as const,
      inject: 'immediate' as const, // Use immediate for React
      accessibility: true,
      debug: true, // Enable debug for development
      disableScrolling: false,
      resultCallback: (responseData: WorldpayCallbackData) => {
        console.log('Worldpay payment result:', responseData);

        const status = responseData.order.status;
        switch (status) {
          case 'success':
            onSuccess?.(responseData);
            break;
          case 'failure':
          case 'error':
          case 'exception':
            onError?.(responseData.error?.referenceNumber || 'Payment failed');
            break;
          case 'cancelled_by_shopper':
          case 'session_expired':
            onCancel?.();
            break;
          case 'pending':
            // Handle pending payments
            onSuccess?.(responseData);
            break;
          default:
            onError?.(`Unknown payment status: ${status}`);
        }

        // Clean up the library instance
        libraryObject.destroy();
      },
      flowCallback: (result: { page: string }) => {
        console.log('Worldpay flow callback:', result.page);
      },
    };

    // Initialize the iframe
    console.log('🚀 Initializing Worldpay iframe with options:', options);

    // Temporarily suppress Stripe postMessage warnings to avoid log spam
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      const message = args[0];
      if (
        typeof message === 'string' &&
        (message.includes('post-message from different source') ||
          message.includes('malformed post-message received') ||
          message.includes('stripe'))
      ) {
        // Suppress Stripe-related warnings
        return;
      }
      originalConsoleWarn.apply(console, args);
    };

    try {
      libraryObject.setup(options);
      console.log('✅ Worldpay iframe initialized successfully');

      // Restore console.warn after setup
      setTimeout(() => {
        console.warn = originalConsoleWarn;
      }, 2000);

      // Check if iframe was actually created after a short delay
      setTimeout(() => {
        const iframeElement = container.querySelector(
          'iframe'
        ) as HTMLIFrameElement;
        if (iframeElement) {
          console.log('✅ Iframe element found in container:', iframeElement);

          // Fix iframe styling to ensure it's visible
          iframeElement.style.width = '100%';
          iframeElement.style.minWidth = '100%';
          iframeElement.style.maxWidth = '100%';
          iframeElement.style.display = 'block';
          iframeElement.style.visibility = 'visible';
          iframeElement.style.opacity = '1';

          // Clear the loading overlay
          const loadingOverlay = container.querySelector('.absolute');
          if (loadingOverlay) {
            loadingOverlay.remove();
          }

          console.log('🎨 Applied iframe styling fixes');
        } else {
          console.warn(
            '⚠️ No iframe found in container after setup, trying fallback...'
          );
          // Fallback to manual iframe creation
          createManualIframe(
            redirectUrl,
            container,
            onSuccess,
            onError,
            onCancel
          );
        }
      }, 1000);
    } catch (setupError) {
      console.error('❌ Worldpay setup failed:', setupError);
      // Fallback to manual iframe creation
      createManualIframe(redirectUrl, container, onSuccess, onError, onCancel);
    }
  } catch (error) {
    console.error('Error initializing Worldpay iframe:', error);
    onError?.(
      error instanceof Error ? error.message : 'Failed to initialize payment'
    );
  }
};

/**
 * Opens Worldpay payment in a lightbox overlay using official Worldpay library
 */
export const openWorldpayLightbox = (
  redirectUrl: string,
  onSuccess?: (data: WorldpayCallbackData | Record<string, unknown>) => void,
  onError?: (error: string) => void,
  onCancel?: () => void
): void => {
  console.log('=== WORLDPAY LIGHTBOX DEBUG (Official Library) ===');
  console.log('Redirect URL:', redirectUrl);

  // Clear any payment provider conflicts before initializing
  clearPaymentProviderConflicts('worldpay');

  try {
    // Check if Worldpay library is loaded
    if (!window.WPCL) {
      console.error('Worldpay library (WPCL) not loaded');
      onError?.('Worldpay library not loaded. Please refresh the page.');
      return;
    }

    // Create a trigger button for lightbox (required by Worldpay)
    const triggerId = 'worldpay-lightbox-trigger-' + Date.now();
    const triggerButton = document.createElement('button');
    triggerButton.id = triggerId;
    triggerButton.style.display = 'none'; // Hidden trigger
    document.body.appendChild(triggerButton);

    // Create Worldpay library instance
    const libraryObject = new window.WPCL.Library();

    // Setup options for lightbox
    const options = {
      url: redirectUrl,
      type: 'lightbox' as const,
      trigger: triggerId,
      accessibility: true,
      debug: true, // Enable debug for development
      // Remove problematic opacity setting - let Worldpay use defaults
      // lightboxMaskOpacity: 80,
      lightboxMaskColor: '#000000',
      resultCallback: (responseData: WorldpayCallbackData) => {
        console.log('Worldpay lightbox payment result:', responseData);

        const status = responseData.order.status;
        switch (status) {
          case 'success':
            onSuccess?.(responseData);
            break;
          case 'failure':
          case 'error':
          case 'exception':
            onError?.(responseData.error?.referenceNumber || 'Payment failed');
            break;
          case 'cancelled_by_shopper':
          case 'session_expired':
            onCancel?.();
            break;
          case 'pending':
            // Handle pending payments
            onSuccess?.(responseData);
            break;
          default:
            onError?.(`Unknown payment status: ${status}`);
        }

        // Clean up
        libraryObject.destroy();
        document.body.removeChild(triggerButton);
      },
      flowCallback: (result: { page: string }) => {
        console.log('Worldpay lightbox flow callback:', result.page);
      },
    };

    // Initialize the lightbox
    libraryObject.setup(options);

    // Automatically trigger the lightbox
    setTimeout(() => {
      console.log('🖱️ Triggering lightbox button click...');
      triggerButton.click();

      // Check if lightbox actually opened
      setTimeout(() => {
        const lightboxElement = document.querySelector(
          '[id*="lightbox"], [class*="lightbox"], [class*="worldpay"]'
        );
        if (lightboxElement) {
          console.log('✅ Lightbox element found:', lightboxElement);
        } else {
          console.warn(
            '⚠️ No lightbox element found - lightbox may not have opened'
          );
          onError?.(
            'Lightbox failed to open. This might be due to popup blockers or browser restrictions.'
          );
        }
      }, 1000);
    }, 100);

    console.log('✅ Worldpay lightbox initialized successfully');
  } catch (error) {
    console.error('Error initializing Worldpay lightbox:', error);
    onError?.(
      error instanceof Error ? error.message : 'Failed to initialize payment'
    );
  }
};
