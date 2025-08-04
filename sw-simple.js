// Simplified Service Worker - Minimal interference with routing
const CACHE_NAME = 'tushar-basak-portfolio-simple-v1.0.0';

// Basic files to cache
const STATIC_CACHE_URLS = [
  '/website/',
  '/website/index.html',
  '/website/offline.html',
  '/website/css/style.css',
  '/website/js/main.js',
  '/website/js/script.js',
  '/website/assets/images/hero.webp'
];

// Install event - cache basic resources
self.addEventListener('install', (event) => {
  console.log('Simple Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Simple Service Worker: Caching basic assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('Simple Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Simple Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Simple Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Simple Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Simple Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - MINIMAL interference, network-first for navigation
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);

  // Handle external requests normally (don't interfere)
  if (requestUrl.origin !== self.location.origin) {
    return; // Let browser handle external requests normally
  }

  // For navigation requests, always try network first
  if (event.request.destination === 'document' || event.request.mode === 'navigate') {
    console.log('Simple Service Worker: Navigation request - letting network handle', event.request.url);
    return; // Let browser handle navigation normally
  }

  // For other resources (CSS, JS, images), try cache then network
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('Simple Service Worker: Serving from cache', event.request.url);
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(event.request)
          .then((response) => {
            if (response && response.ok) {
              // Cache successful responses
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            return response;
          });
      })
      .catch((error) => {
        console.log('Simple Service Worker: Fetch failed', event.request.url, error);
        // Return network error as-is
        return fetch(event.request);
      })
  );
});

console.log('Simple Service Worker: Loaded - Version', CACHE_NAME);