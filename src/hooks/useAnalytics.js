import { useCallback, useEffect, useRef } from 'react';

function pushDataLayer(event, params) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...params,
  });
}

function pushGtag(event, params) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', event, params);
}

/**
 * GA4 / GTM-ready: dataLayer mirror + optional gtag().
 */
export function useAnalytics() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const gtmId = import.meta.env.VITE_GTM_CONTAINER_ID;
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    if (gtmId) {
      const script = document.createElement('script');
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `;
      document.head.appendChild(script);
    }

    if (measurementId && !gtmId) {
      const s = document.createElement('script');
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(s);

      const inline = document.createElement('script');
      inline.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${measurementId}', { send_page_view: false });
      `;
      document.head.appendChild(inline);
    }
  }, [measurementId, gtmId]);

  const track = useCallback((event, params = {}) => {
    const payload = { ...params, ts: Date.now() };
    pushDataLayer(event, payload);
    pushGtag(event, payload);
    if (import.meta.env.DEV) {
      console.debug('[analytics]', event, payload);
    }
  }, []);

  return { track };
}
