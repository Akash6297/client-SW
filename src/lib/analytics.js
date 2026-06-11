import { getPublic } from '../admin/api/client';

let initStarted = false;
let configured = false;
const pendingPaths = [];

/**
 * Loads Google Analytics (GA4) gtag.js using the Measurement ID configured in
 * /admin/settings, mirroring the standard gtag.js snippet. Safe to call
 * multiple times — only initializes once per session.
 */
export function initGa() {
  if (initStarted) return;
  initStarted = true;

  getPublic('getPublicSettings').then((settings) => {
    const id = settings?.GA_MEASUREMENT_ID;
    if (!id) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { send_page_view: false });

    configured = true;
    pendingPaths.forEach((path) => window.gtag('event', 'page_view', { page_path: path }));
    pendingPaths.length = 0;
  });
}

/**
 * Records a SPA pageview as a GA4 page_view event. If GA hasn't finished
 * loading yet (e.g. on the very first page load), the path is queued and
 * sent as soon as gtag is configured — so the first hit is never lost.
 */
export function trackPageview(path) {
  if (configured && window.gtag) {
    window.gtag('event', 'page_view', { page_path: path });
  } else {
    pendingPaths.push(path);
  }
}
