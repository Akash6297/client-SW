import { useState, useEffect } from 'react';
import { getPublic } from '../admin/api/client';

function merge(defaults, override) {
  if (!override) return defaults;
  return {
    title: override.Title || defaults.title,
    description: override.Description || defaults.description,
    url: override.Canonical || defaults.url,
    image: override.OGImage || defaults.image,
    type: defaults.type,
    keywords: override.Keywords || defaults.keywords,
  };
}

/**
 * Fetches an admin-managed SEO override for `pageKey` and merges it over the
 * hardcoded `defaults`. Falls back to `defaults` if no override exists or the
 * admin backend isn't configured.
 */
export default function useSeoOverride(pageKey, defaults) {
  const [data, setData] = useState(defaults);

  useEffect(() => {
    let cancelled = false;
    const cacheKey = `sw_seo_${pageKey}`;

    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        if (!cancelled) setData(merge(defaults, JSON.parse(cached)));
      } catch {
        // ignore malformed cache
      }
    }

    getPublic('getSeo', { page: pageKey }).then((override) => {
      if (cancelled || !override) return;
      sessionStorage.setItem(cacheKey, JSON.stringify(override));
      setData(merge(defaults, override));
    });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  return data;
}
