// Service Worker for Tushar Basak Portfolio
const CACHE_NAME = 'tushar-basak-portfolio-v2.0.0';

// Determine if we're on GitHub Pages or local development
const isGitHubPages = self.location.pathname.startsWith('/website/') || self.location.hostname === 'tusharbasak97.github.io';
const basePath = isGitHubPages ? '/website' : '';

const STATIC_CACHE_URLS = [
  basePath + '/',
  basePath + '/index.html',
  basePath + '/css/style.css',
  basePath + '/css/preloader.min.css',
  basePath + '/css/style-switcher.css',
  basePath + '/css/skins/color-1.css',
  basePath + '/js/main.js',
  basePath + '/js/script.js',
  basePath + '/js/preloader.min.js',
  basePath + '/js/style-switcher.js',
  basePath + '/assets/images/hero.webp',
  basePath + '/assets/images/favicon-32x32.png',
  basePath + '/assets/images/favicon-16x16.png',
  basePath + '/assets/resume.pdf',
  basePath + '/offline.html'
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

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return cachedResponse;
        }

        // Otherwise fetch from network
        console.log('Service Worker: Fetching from network', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the response for future use
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.error('Service Worker: Fetch failed', error);

            // Return offline page for navigation requests
            if (event.request.destination === 'document') {
              return caches.match(basePath + '/offline.html');
            }

            throw error;
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
      icon: basePath + '/assets/images/favicon-32x32.png',
      badge: basePath + '/assets/images/favicon-16x16.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'View Portfolio',
          icon: basePath + '/assets/images/favicon-16x16.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: basePath + '/assets/images/favicon-16x16.png'
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
      clients.openWindow(basePath + '/')
    );
  }
});
