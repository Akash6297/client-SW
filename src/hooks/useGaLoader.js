import { useEffect } from 'react';
import { getPublic } from '../admin/api/client';

let gaLoaded = false;

/**
 * Loads Google Analytics (GA4) gtag.js if a Measurement ID is configured in
 * /admin/settings. Safe to call multiple times — only loads once per session.
 */
export default function useGaLoader() {
  useEffect(() => {
    if (gaLoaded) return;

    getPublic('getPublicSettings').then((settings) => {
      const id = settings?.GA_MEASUREMENT_ID;
      if (!id || gaLoaded) return;
      gaLoaded = true;

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', id, { send_page_view: false });
    });
  }, []);
}
