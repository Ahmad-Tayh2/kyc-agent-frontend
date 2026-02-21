// Utility to handle payment provider conflicts
export const clearPaymentProviderConflicts = (
  targetProvider: 'stripe' | 'worldpay',
) => {
  if (targetProvider === 'worldpay') {
    console.log(
      '🧹 Clearing potential payment provider conflicts for Worldpay...',
    );

    // Remove any Stripe-related event listeners that might interfere
    const stripeElements = document.querySelectorAll(
      '[id*="stripe"], [class*="stripe"], iframe[src*="stripe"]',
    );
    stripeElements.forEach((element) => {
      console.log('Found Stripe element:', element);
    });

    // Clear Stripe instances from window if they exist
    if (window.Stripe) {
      console.log('Stripe instance found on window, this may cause conflicts');
    }

    // Suppress Stripe postMessage interference
    const suppressStripeMessages = (event: MessageEvent) => {
      if (event.origin.includes('stripe.com') || event.data?.__stripeJsV3) {
        // console.log(
        //   '🚫 Suppressing Stripe postMessage to avoid Worldpay conflict'
        // );
        event.stopImmediatePropagation();
        return false;
      }
    };

    // Add temporary listener to suppress Stripe messages
    window.addEventListener('message', suppressStripeMessages, true);

    // Remove after 10 seconds (should be enough for Worldpay to initialize)
    setTimeout(() => {
      window.removeEventListener('message', suppressStripeMessages, true);
      // console.log('✅ Removed Stripe message suppression');
    }, 10000);
  }
};

// Add to window for debugging
declare global {
  interface Window {
    clearPaymentProviderConflicts: typeof clearPaymentProviderConflicts;
  }
}

if (typeof window !== 'undefined') {
  window.clearPaymentProviderConflicts = clearPaymentProviderConflicts;
}
