// MINIMAL OFFLINE SERVICE WORKER - ALWAYS NETWORK FIRST!
const CACHE_NAME = 'luminode-offline-v1';
const OFFLINE_URL = '/offline.html';

// Only cache absolute essentials
const ESSENTIAL_URLS = [
  '/',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ESSENTIAL_URLS);
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
    })
  );
  self.clients.claim();
});

// NETWORK FIRST - Always try online version first!
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request, {
      cache: 'no-cache',
      credentials: 'same-origin'
    }).then((response) => {
      // Clone the response before using it
      const responseToCache = response.clone();
      
      // Update cache with fresh version
      caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, responseToCache);
      });
      
      return response;
    }).catch(() => {
      // Only use cache if network fails
      return caches.match(event.request).then((response) => {
        if (response) {
          // Add header to indicate offline mode
          const headers = new Headers(response.headers);
          headers.set('X-Offline-Mode', 'true');
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: headers
          });
        }
        
        // If not in cache, return offline page
        return caches.match(OFFLINE_URL);
      });
    })
  );
});