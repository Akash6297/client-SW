import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ADMIN_SCRIPT_URL } from '../admin/config';

/**
 * Logs a pageview on every route change: pushes to GA4 (if loaded via
 * useGaLoader) and to the admin backend's lightweight pageview counter.
 */
export default function usePageviewTracker() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'page_view', { page_path: location.pathname + location.search });
    }

    if (ADMIN_SCRIPT_URL && !ADMIN_SCRIPT_URL.includes('PASTE_YOUR')) {
      fetch(ADMIN_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'logPageview', payload: { path: location.pathname } }),
      }).catch(() => {});
    }
  }, [location.pathname, location.search]);
}
