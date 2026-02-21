import { useEffect } from 'react';

export const useWorldpayIframeVisibility = (
  containerId: string,
  isActive: boolean,
) => {
  useEffect(() => {
    if (!isActive) return;

    const checkIframeVisibility = () => {
      const container = document.getElementById(containerId);
      const iframe = container?.querySelector('iframe');

      if (iframe) {
        // console.log('🔍 Checking iframe visibility:', {
        //   width: iframe.style.width,
        //   height: iframe.style.height,
        //   display: iframe.style.display,
        //   visibility: iframe.style.visibility,
        //   opacity: iframe.style.opacity
        // });

        // Force iframe to be visible
        iframe.style.width = '100%';
        iframe.style.minWidth = '100%';
        iframe.style.display = 'block';
        iframe.style.visibility = 'visible';
        iframe.style.opacity = '1';

        // Remove loading overlay if exists
        const overlay = container?.querySelector('.absolute');
        if (overlay) {
          overlay.remove();
          console.log('🧹 Removed loading overlay');
        }
      }
    };

    // Check immediately and then every second for 10 seconds
    const intervals = [100, 500, 1000, 2000, 3000, 5000, 7000, 10000];
    const timeouts = intervals.map((delay) =>
      setTimeout(checkIframeVisibility, delay),
    );

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [containerId, isActive]);
};
