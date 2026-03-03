
/* global clients */

const CACHE_NAME = 'barbeiros-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json'
  // Add other known static assets here or let them be cached on first load
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Bypass cache completely for non-GET requests (POST, PUT, DELETE, etc.)
  if (event.request.method !== 'GET') {
    return; // Let the browser handle the request natively
  }

  // 2. Bypass cache for API endpoints and Supabase interactions
  if (
    url.hostname.includes('supabase.co') || 
    url.pathname.includes('/rest/v1/') || 
    url.pathname.includes('/auth/') ||
    url.pathname.includes('/functions/v1/')
  ) {
    return; // Let the browser handle the request natively
  }

  // 3. Strategy: Navigation requests -> Network First, fallback to offline.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch((error) => {
          console.error('[SW] Navigation fetch failed:', error);
          return caches.match('/offline.html');
        })
    );
    return;
  }

  // 4. Strategy: Stale-While-Revalidate for other assets (CSS, JS, Images)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Validate response before cloning and caching
        // Ensure it's a valid response, HTTP status 200, and a basic type (not opaque if possible)
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // IMPORTANT: Clone the response BEFORE reading or caching
        // A response is a stream and can only be consumed once.
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          // Don't cache non-http/https schemes (like chrome-extension://)
          if (url.protocol.startsWith('http')) {
             cache.put(event.request, responseToCache).catch(err => {
               console.error('[SW] Cache put failed:', err);
             });
          }
        });
        
        return networkResponse;
      }).catch((error) => {
        console.error('[SW] Fetch failed in SWR:', error);
        // Do nothing here, as it will just fallback to cachedResponse if it exists
      });

      // Return cached response immediately if available, while fetchPromise updates cache in background
      // If not in cache, wait for fetchPromise
      return cachedResponse || fetchPromise;
    })
  );
});

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-appointments') {
    console.log('Syncing appointments in background...');
    // event.waitUntil(sendOfflineAppointments()); 
  }
});

// Push Notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-maskable.png',
      vibrate: [100, 50, 100],
      data: { url: data.url || '/' }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a window is already open, focus it
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open new window
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
