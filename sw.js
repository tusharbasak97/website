// Service Worker for Tushar Basak Portfolio - Complete Offline Support
const CACHE_NAME = 'tushar-basak-portfolio-v2.0.0';
const OFFLINE_URL = '/offline.html';
const NOT_FOUND_URL = '/404.html';

// COMPLETE list of ALL files for full offline functionality
const STATIC_CACHE_URLS = [
  // Root files
  '/',
  '/index.html',
  '/offline.html',
  '/404.html',
  '/test-offline.html',
  '/test-404.html',
  '/test-complete-offline.html',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',

  // CSS Files - ALL themes and styles
  '/css/style.css',
  '/css/preloader.min.css',
  '/css/style-switcher.css',
  '/css/skins/color-1.css',
  '/css/skins/color-2.css',
  '/css/skins/color-3.css',
  '/css/skins/color-4.css',
  '/css/skins/color-5.css',

  // JavaScript Files - ALL functionality
  '/js/main.js',
  '/js/script.js',
  '/js/preloader.min.js',
  '/js/style-switcher.js',

  // Images - ALL images for complete visual experience
  '/assets/images/hero.webp',
  '/assets/images/hero.jpg',
  '/assets/images/logo.png',
  '/assets/images/favicon-16x16.png',
  '/assets/images/favicon-32x32.png',
  '/assets/images/apple-touch-icon.png',
  '/assets/images/android-chrome-192x192.png',
  '/assets/images/android-chrome-512x512.png',
  '/assets/images/mstile-150x150.png',
  '/assets/images/safari-pinned-tab.svg',

  // Portfolio Images - ALL project images
  '/assets/images/portfolio/AI.webp',
  '/assets/images/portfolio/Cloud.webp',
  '/assets/images/portfolio/Cybersecurity.webp',
  '/assets/images/portfolio/ML.webp',
  '/assets/images/portfolio/Python.webp',
  '/assets/images/portfolio/SQL.webp',

  // Documents - ALL PDFs and certificates
  '/assets/resume.pdf',
  '/assets/Strive.pdf',

  // Configuration files
  '/assets/site.webmanifest',
  '/assets/browserconfig.xml',
  '/.well-known/security.txt'
];

// External resources to cache (CDN files)
const EXTERNAL_CACHE_URLS = [
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Kaushan+Script&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css'
];

// Install event - cache ALL resources for complete offline experience
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing with complete offline support...');
  event.waitUntil(
    Promise.all([
      // Cache all static resources
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching all static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      }),
      // Cache external resources
      caches.open(CACHE_NAME + '-external').then((cache) => {
        console.log('Service Worker: Caching external resources');
        return Promise.allSettled(
          EXTERNAL_CACHE_URLS.map(url =>
            fetch(url, { mode: 'cors' })
              .then(response => {
                if (response.ok) {
                  return cache.put(url, response);
                }
              })
              .catch(error => {
                console.warn('Failed to cache external resource:', url, error);
              })
          )
        );
      })
    ])
    .then(() => {
      console.log('Service Worker: Installation complete - Full offline support enabled');
      return self.skipWaiting();
    })
    .catch((error) => {
      console.error('Service Worker: Installation failed', error);
    })
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating with complete offline support...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== CACHE_NAME + '-external') {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete - Ready for full offline experience');
        return self.clients.claim();
      })
  );
});

// Fetch event - Comprehensive offline-first strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);

  // Handle external requests (CDN, fonts, etc.)
  if (requestUrl.origin !== self.location.origin) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            console.log('Service Worker: Serving external resource from cache', event.request.url);
            return cachedResponse;
          }

          // Try network for external resources
          return fetch(event.request)
            .then((response) => {
              if (response && response.ok) {
                // Cache successful external responses
                const responseToCache = response.clone();
                caches.open(CACHE_NAME + '-external')
                  .then((cache) => {
                    cache.put(event.request, responseToCache);
                  });
                return response;
              }
              return response;
            })
            .catch(() => {
              // Silently fail for external resources when offline
              return new Response('', { status: 404 });
            });
        })
    );
    return;
  }

  // Helper functions for local requests
  const isNavigationRequest = (request) => {
    return request.destination === 'document' ||
           request.mode === 'navigate' ||
           request.url.endsWith('.html') ||
           request.url === self.location.origin + '/' ||
           (!request.url.includes('.') && !request.url.includes('?'));
  };

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
    const validExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.webp', '.ico', '.pdf', '.svg', '.woff', '.woff2', '.ttf', '.webmanifest', '.xml', '.txt'];
    if (validExtensions.some(ext => pathname.endsWith(ext))) {
      return true;
    }

    return false;
  };

  // OFFLINE-FIRST strategy for local requests
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // ALWAYS serve from cache first if available (offline-first)
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache (offline-first)', event.request.url);

          // For HTML pages, try to update cache in background (stale-while-revalidate)
          if (isNavigationRequest(event.request)) {
            fetch(event.request)
              .then((response) => {
                if (response && response.ok) {
                  caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, response.clone());
                    console.log('Service Worker: Updated cache in background', event.request.url);
                  });
                }
              })
              .catch(() => {
                // Network failed, but we already have cached version
                console.log('Service Worker: Background update failed, using cached version');
              });
          }

          return cachedResponse;
        }

        // No cached response, try network (fallback)
        console.log('Service Worker: Not in cache, trying network', event.request.url);
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
              // For navigation requests with other errors, serve offline page
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

            // For navigation requests, determine appropriate fallback
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
              statusText: 'Network request failed - resource not cached'
            });
          });
      })
  );
});

// Background sync for future enhancements
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      console.log('Service Worker: Background sync triggered')
    );
  }
});

// Push notification handling for future enhancements
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

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    caches.keys().then(cacheNames => {
      event.ports[0].postMessage({
        caches: cacheNames,
        version: CACHE_NAME
      });
    });
  }
});

console.log('Service Worker: Loaded with complete offline support - Version', CACHE_NAME);
