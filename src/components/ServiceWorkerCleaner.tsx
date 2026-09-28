'use client';

import { useEffect } from 'react';

/**
 * Unregisters any stale service workers from previous apps on this origin.
 * Only runs in the browser. Safe to keep in production — will no-op once
 * there are no registered service workers.
 */
export function ServiceWorkerCleaner() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().then((success) => {
          if (success) {
            console.info('[LifeOS] Unregistered stale service worker:', registration.scope);
          }
        });
      }
      // If any SWs were found, reload once after unregistering so the
      // browser fetches fresh HTML from Next.js instead of the SW cache.
      if (registrations.length > 0) {
        // Clear all caches too (handles Vite/Workbox cache from prior app)
        caches.keys().then((keys) => {
          keys.forEach((key) => caches.delete(key));
        });
        // Delay reload slightly so unregister() settles
        setTimeout(() => window.location.reload(), 200);
      }
    });
  }, []);

  return null;
}
