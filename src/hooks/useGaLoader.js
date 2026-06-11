import { useEffect } from 'react';
import { initGa } from '../lib/analytics';

/**
 * Loads Google Analytics (GA4) gtag.js if a Measurement ID is configured in
 * /admin/settings. Safe to call multiple times — only loads once per session.
 */
export default function useGaLoader() {
  useEffect(() => {
    initGa();
  }, []);
}
