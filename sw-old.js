// Service Worker for Tushar Basak Portfolio
const CACHE_NAME = 'tushar-basak-portfolio-v1.0.0';
const OFFLINE_URL = '/offline.html';
const NOT_FOUND_URL = '/404.html';

// Complete list of files to cache for full offline functionality
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/404.html',
  '/favicon.ico',

  // CSS Files
  '/css/style.css',
  '/css/preloader.min.css',
  '/css/style-switcher.css',
  '/css/skins/color-1.css',
  '/css/skins/color-2.css',
  '/css/skins/color-3.css',
  '/css/skins/color-4.css',
  '/css/skins/color-5.css',

  // JavaScript Files
  '/js/main.js',
  '/js/script.js',
  '/js/preloader.min.js',
  '/js/style-switcher.js',

  // Images
  '/assets/images/hero.webp',
  '/assets/images/logo.png',
  '/assets/images/favicon-16x16.png',
  '/assets/images/favicon-32x32.png',
  '/assets/images/apple-touch-icon.png',
  '/assets/images/android-chrome-192x192.png',
  '/assets/images/android-chrome-512x512.png',
  '/assets/images/mstile-150x150.png',

  // Portfolio Images
  '/assets/images/portfolio/AI.webp',
  '/assets/images/portfolio/Cloud.webp',
  '/assets/images/portfolio/Cybersecurity.webp',
  '/assets/images/portfolio/ML.webp',
  '/assets/images/portfolio/Python.webp',
  '/assets/images/portfolio/SQL.webp',

  // Documents
  '/assets/resume.pdf',
  '/assets/Strive.pdf',
  '/assets/site.webmanifest'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - Cache First strategy with 404 and offline handling
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests (CDN, fonts, etc.)
  if (!event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Silently fail for external resources when offline
        return new Response('', { status: 404 });
      })
    );
    return;
  }

  // Helper function to check if request is for a page/navigation
  const isNavigationRequest = (request) => {
    return request.destination === 'document' ||
           request.mode === 'navigate' ||
           request.url.endsWith('.html') ||
           request.url === self.location.origin + '/' ||
           (!request.url.includes('.') && !request.url.includes('?'));
  };

  // Helper function to check if URL is a valid route
  const isValidRoute = (url) => {
    const validRoutes = [
      '/',
      '/index.html',
      '/offline.html',
      '/404.html',
      '/test-offline.html',
      '/test-404.html'
    ];

    const pathname = new URL(url).pathname;

    // Check exact matches
    if (validRoutes.includes(pathname)) {
      return true;
    }

    // Check if it's a valid file extension (assets)
    const validExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.webp', '.ico', '.pdf', '.svg', '.woff', '.woff2', '.ttf', '.webmanifest'];
    if (validExtensions.some(ext => pathname.endsWith(ext))) {
      return true;
    }

    return false;
  };

  // Cache First strategy for all local requests
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // If we have a cached response, return it
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return cachedResponse;
        }

        // No cached response, try network
        console.log('Service Worker: Fetching from network', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Handle different response statuses
            if (response.status === 404) {
              // For navigation requests to invalid routes, serve 404 page
              if (isNavigationRequest(event.request)) {
                console.log('Service Worker: 404 for navigation, serving 404 page');
                return caches.match(NOT_FOUND_URL);
              }
              return response;
            }

            if (!response || response.status !== 200) {
              // For navigation requests with other errors, check if offline
              if (isNavigationRequest(event.request)) {
                console.log('Service Worker: Network error for navigation, serving offline page');
                return caches.match(OFFLINE_URL);
              }
              return response;
            }

            // Clone and cache successful responses
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
                console.log('Service Worker: Cached new resource', event.request.url);
              });

            return response;
          })
          .catch((error) => {
            console.error('Service Worker: Network request failed', event.request.url, error);

            // For navigation requests, determine if it's a 404 or offline issue
            if (isNavigationRequest(event.request)) {
              // Check if the route is invalid (should be 404)
              if (!isValidRoute(event.request.url)) {
                console.log('Service Worker: Invalid route, serving 404 page');
                return caches.match(NOT_FOUND_URL);
              }

              // Valid route but network failed (offline)
              console.log('Service Worker: Valid route but offline, serving offline page');
              return caches.match(OFFLINE_URL);
            }

            // For other resources, return error response
            return new Response('', {
              status: 408,
              statusText: 'Network request failed'
            });
          });
      })
  );
});

// Background sync for form submissions (if needed in future)
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    event.waitUntil(
      // Handle background sync for contact forms
      console.log('Service Worker: Background sync triggered')
    );
  }
});

// Push notification handling (if needed in future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/assets/images/favicon-32x32.png',
      badge: '/assets/images/favicon-16x16.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'View Portfolio',
          icon: '/assets/images/favicon-16x16.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/assets/images/favicon-16x16.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
