// Service Worker for Tushar Basak Portfolio - Enhanced Caching Strategy
const CACHE_NAME = 'tushar-basak-portfolio-v1.0.0';
const RUNTIME_CACHE = 'runtime-cache-v1.0.0';
const IMAGE_CACHE = 'image-cache-v1.0.0';
const FONT_CACHE = 'font-cache-v1.0.0';

// Performance configuration
const SW_CONFIG = {
  ENABLE_CONSOLE_LOGGING: false, // Production - logging disabled
  ENABLE_PERFORMANCE_LOGGING: false // Production - performance logging disabled
};

// Determine if we're on GitHub Pages or local development
const isGitHubPages = self.location.pathname.startsWith('/website/') || self.location.hostname === 'tusharbasak97.github.io';
const basePath = isGitHubPages ? '/website' : '';

// Define offline and 404 URLs with proper basePath
const OFFLINE_URL = basePath + '/offline.html';
const NOT_FOUND_URL = basePath + '/404.html';

// External resources to cache (CDN files)
const EXTERNAL_CACHE_URLS = [
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Kaushan+Script&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css',
  'https://unpkg.com/typed.js@2.1.0/dist/typed.umd.js'
];

// Core static resources (cache-first strategy)
const STATIC_CACHE_URLS = [
  basePath + '/',
  basePath + '/index.html',
  basePath + '/offline.html',
  basePath + '/404.html',

  // Critical JavaScript Files
  basePath + '/js/critical-css.js',
  basePath + '/js/lazy-loading.js',
  basePath + '/js/spa-navigation.js',
  basePath + '/js/contact-form-limiter.js',
  basePath + '/js/main.js',
  basePath + '/js/preloader.js',
  basePath + '/js/style-switcher.js',

  // Critical CSS Files
  basePath + '/css/style.css',
  basePath + '/css/preloader.css',
  basePath + '/css/style-switcher.css',
  basePath + '/css/skins/color-1.css',
  basePath + '/css/skins/color-2.css',
  basePath + '/css/skins/color-3.css',

  // Critical Images (icons and favicons)
  basePath + '/assets/images/favicon-32x32.png',
  basePath + '/assets/images/favicon-16x16.png',
  basePath + '/assets/images/apple-touch-icon.png',
  basePath + '/assets/images/android-chrome-192x192.png',
  basePath + '/assets/images/android-chrome-512x512.png',

  // Configuration files
  basePath + '/assets/site.webmanifest',
  basePath + '/favicon.ico',
  '/favicon.ico', // Root favicon for different path scenarios
  basePath + '/robots.txt',
  basePath + '/sitemap.xml'
];

// Images for runtime caching (stale-while-revalidate)
const IMAGE_CACHE_URLS = [
  basePath + '/assets/images/hero.webp',
  basePath + '/assets/images/hero.jpg',
  basePath + '/assets/images/logo.webp',
  basePath + '/assets/images/logo.png',
  basePath + '/assets/images/portfolio/AI.webp',
  basePath + '/assets/images/portfolio/Cloud.webp',
  basePath + '/assets/images/portfolio/Cybersecurity.webp',
  basePath + '/assets/images/portfolio/ML.webp',
  basePath + '/assets/images/portfolio/Python.webp',
  basePath + '/assets/images/portfolio/SQL.webp'
];

// Documents for runtime caching
const DOCUMENT_CACHE_URLS = [
  basePath + '/assets/resume.pdf',
  basePath + '/assets/Strive.pdf'
];

// Enhanced caching strategies
const CacheStrategies = {
  // Cache first - for static resources that rarely change
  cacheFirst: async (request, cacheName) => {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      swLog('Cache first strategy failed:', request.url, error);
      throw error;
    }
  },

  // Network first - for dynamic content
  networkFirst: async (request, cacheName, timeout = 3000) => {
    const cache = await caches.open(cacheName);

    try {
      const networkResponse = await Promise.race([
        fetch(request),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Network timeout')), timeout)
        )
      ]);

      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      swLog('Network first failed, trying cache:', request.url);
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      throw error;
    }
  },

  // Stale while revalidate - for images and assets
  staleWhileRevalidate: async (request, cacheName) => {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    const fetchPromise = fetch(request).then(networkResponse => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    }).catch(error => {
      swLog('Background fetch failed:', request.url, error);
    });

    return cachedResponse || fetchPromise;
  }
};

// Utility function for conditional logging
const swLog = (message, data = null) => {
  if (SW_CONFIG.ENABLE_CONSOLE_LOGGING) {
    swLog('[SW]', message, data);
  }
};

// Install event - Enhanced caching with different strategies
self.addEventListener('install', (event) => {
  swLog('Installing with enhanced caching strategies...');
  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches.open(CACHE_NAME).then((cache) => {
        swLog('Service Worker: Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      }),

      // Pre-cache images with error handling
      caches.open(IMAGE_CACHE).then((cache) => {
        swLog('Service Worker: Pre-caching images');
        return Promise.allSettled(
          IMAGE_CACHE_URLS.map(url =>
            fetch(url).then(response => {
              if (response.ok) {
                return cache.put(url, response);
              }
            }).catch(error => {
              swLog('Failed to pre-cache image:', url, error);
            })
          )
        );
      }),

      // Cache external resources (fonts, CDN)
      caches.open(FONT_CACHE).then((cache) => {
        swLog('Service Worker: Caching external resources');
        return Promise.allSettled(
          EXTERNAL_CACHE_URLS.map(url =>
            fetch(url, { mode: 'cors' })
              .then(response => {
                if (response.ok) {
                  return cache.put(url, response);
                }
              })
              .catch(error => {
                swLog('Failed to cache external resource:', url, error);
              })
          )
        );
      })
    ])
    .then(() => {
      swLog('Service Worker: Installation complete - Enhanced caching enabled');
      return self.skipWaiting();
    })
    .catch((error) => {
      swLog('Service Worker: Installation failed', error);
    })
  );
});

// Activate event - Enhanced cache management
self.addEventListener('activate', (event) => {
  swLog('Service Worker: Activating with enhanced cache management...');

  const currentCaches = [CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE, FONT_CACHE];

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.includes(cacheName)) {
              swLog('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        swLog('Service Worker: Cache cleanup complete');
        return self.clients.claim();
      })
      .then(() => {
        // Notify clients about the update
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'SW_UPDATED',
              version: CACHE_NAME
            });
          });
        });
      })
      .then(() => {
        swLog('Service Worker: Activation complete - Enhanced caching ready');
      })
  );
});

// Enhanced fetch event with intelligent routing
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const pathname = requestUrl.pathname;

  // Route requests to appropriate caching strategies
  if (requestUrl.origin !== self.location.origin) {
    // External resources (fonts, CDN, analytics)
    event.respondWith(handleExternalRequest(event.request));
  } else if (pathname.endsWith('/favicon.ico') || pathname === '/favicon.ico') {
    // Favicon - cache first with aggressive caching
    event.respondWith(handleFaviconRequest(event.request));
  } else if (isImageRequest(pathname)) {
    // Images - stale while revalidate
    event.respondWith(CacheStrategies.staleWhileRevalidate(event.request, IMAGE_CACHE));
  } else if (isDocumentRequest(pathname)) {
    // Documents - cache first with network fallback
    event.respondWith(CacheStrategies.cacheFirst(event.request, RUNTIME_CACHE));
  } else if (isNavigationRequest(event.request)) {
    // HTML pages - network first with cache fallback
    event.respondWith(handleNavigationRequest(event.request));
  } else {
    // Static assets - cache first
    event.respondWith(CacheStrategies.cacheFirst(event.request, CACHE_NAME));
  }
});

// Handle external requests (fonts, CDN)
const handleExternalRequest = async (request) => {
  const requestUrl = new URL(request.url);

  // Use font cache for all external resources
  let cacheName = FONT_CACHE;

  try {
    return await CacheStrategies.staleWhileRevalidate(request, cacheName);
  } catch (error) {
    swLog('External request failed:', request.url, error);
    // Return empty response for failed external resources
    return new Response('', {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};

// Handle navigation requests with enhanced fallbacks
const handleNavigationRequest = async (request) => {
  try {
    // Try network first for fresh content
    const networkResponse = await CacheStrategies.networkFirst(request, RUNTIME_CACHE, 2000);
    return networkResponse;
  } catch (error) {
    swLog('Navigation request failed, checking cache and fallbacks:', request.url);

    // Try cache
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Determine appropriate fallback
    const requestUrl = new URL(request.url);
    if (!isValidRoute(request.url)) {
      swLog('Service Worker: Invalid route, serving 404 page');
      return caches.match(NOT_FOUND_URL);
    }

    // Valid route but offline
    swLog('Service Worker: Valid route but offline, serving offline page');
    return caches.match(OFFLINE_URL);
  }
};

// Handle favicon requests with aggressive caching
const handleFaviconRequest = async (request) => {
  try {
    // Try cache first for favicon
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      swLog('Service Worker: Serving favicon from cache');
      return cachedResponse;
    }

    // Try network if not in cache
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache the favicon with long expiration
      cache.put(request, networkResponse.clone());
      swLog('Service Worker: Cached favicon from network');
      return networkResponse;
    }

    throw new Error('Favicon network request failed');
  } catch (error) {
    swLog('Service Worker: Favicon request failed:', error);

    // Try to serve a fallback favicon from assets
    const fallbackFavicon = basePath + '/assets/images/favicon-32x32.png';
    const cache = await caches.open(CACHE_NAME);
    const fallbackResponse = await cache.match(fallbackFavicon);

    if (fallbackResponse) {
      swLog('Service Worker: Serving fallback favicon');
      return fallbackResponse;
    }

    // Return empty response if all fails
    return new Response('', {
      status: 204,
      statusText: 'No Content'
    });
  }
};

// Utility functions for request classification
const isImageRequest = (pathname) => {
  return /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(pathname);
};

const isDocumentRequest = (pathname) => {
  return /\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i.test(pathname);
};

const isNavigationRequest = (request) => {
  return request.destination === 'document' ||
         request.mode === 'navigate' ||
         request.url.endsWith('.html') ||
         (!request.url.includes('.') && !request.url.includes('?'));
};

// Enhanced route validation
const isValidRoute = (url) => {
  const pathname = new URL(url).pathname;
  const relativePath = pathname.replace(basePath, '');

  const validRoutes = [
    '/',
    '/index.html',
    '/offline.html',
    '/404.html'
  ];

  // Check exact matches
  if (validRoutes.includes(relativePath) || validRoutes.includes(pathname)) {
    return true;
  }

  // SPA routing - allow hash routes and main page access
  if (relativePath === '/' || pathname === basePath + '/' || pathname === basePath) {
    return true;
  }

  // Valid file extensions
  const validExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.webp', '.ico', '.pdf', '.svg', '.woff', '.woff2', '.ttf', '.webmanifest', '.xml', '.txt'];
  if (validExtensions.some(ext => pathname.endsWith(ext))) {
    return true;
  }

  // SPA routes (no extension, no query params)
  if (!pathname.includes('.') && !pathname.includes('?')) {
    return true;
  }

  return false;
};

// Background sync for future enhancements
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      swLog('Service Worker: Background sync triggered')
    );
  }
});

// Push notification handling for future enhancements
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

// Enhanced background sync for form submissions
self.addEventListener('sync', (event) => {
  swLog('Service Worker: Background sync triggered', event.tag);

  if (event.tag === 'form-sync') {
    event.waitUntil(syncFormSubmissions());
  }
});

// Sync form submissions when back online
const syncFormSubmissions = async () => {
  try {
    // Implementation for form sync would go here
    swLog('Service Worker: Form sync completed');
  } catch (error) {
    swLog('Service Worker: Form sync failed', error);
  }
};

// Enhanced push notification handling
self.addEventListener('push', (event) => {
  swLog('Service Worker: Push notification received');

  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'New update available!',
      icon: basePath + '/assets/images/android-chrome-192x192.png',
      badge: basePath + '/assets/images/favicon-32x32.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 'default',
        url: data.url || basePath + '/'
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
      ],
      requireInteraction: true,
      tag: 'portfolio-update'
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Portfolio Update', options)
    );
  }
});

// Enhanced notification click handling
self.addEventListener('notificationclick', (event) => {
  swLog('Service Worker: Notification clicked', event.action);

  event.notification.close();

  if (event.action === 'explore') {
    const urlToOpen = event.notification.data.url || basePath + '/';

    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(clientList => {
          // Check if there's already a window/tab open with the target URL
          for (const client of clientList) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }

          // If not, open a new window/tab
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Enhanced message handling for communication with main thread
self.addEventListener('message', (event) => {
  swLog('Service Worker: Message received', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    caches.keys().then(cacheNames => {
      const cacheInfo = {
        caches: cacheNames,
        version: CACHE_NAME,
        strategies: {
          static: CACHE_NAME,
          runtime: RUNTIME_CACHE,
          images: IMAGE_CACHE,
          fonts: FONT_CACHE
        }
      };

      event.ports[0].postMessage(cacheInfo);
    });
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    const cacheName = event.data.cacheName;
    if (cacheName) {
      caches.delete(cacheName).then(success => {
        event.ports[0].postMessage({ success, cacheName });
      });
    }
  }

  if (event.data && event.data.type === 'PREFETCH_RESOURCES') {
    const resources = event.data.resources || [];
    event.waitUntil(prefetchResources(resources));
  }
});

// Prefetch resources on demand
const prefetchResources = async (resources) => {
  const cache = await caches.open(RUNTIME_CACHE);

  for (const resource of resources) {
    try {
      const response = await fetch(resource);
      if (response.ok) {
        await cache.put(resource, response);
        swLog('Service Worker: Prefetched resource', resource);
      }
    } catch (error) {
      swLog('Service Worker: Failed to prefetch resource', resource, error);
    }
  }
};

// Performance monitoring
const logPerformanceMetrics = () => {
  if ('performance' in self) {
    const entries = performance.getEntriesByType('navigation');
    if (entries.length > 0) {
      const navigation = entries[0];
      swLog('Service Worker: Performance metrics', {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        cacheHitRatio: self.cacheHitCount / (self.cacheHitCount + self.cacheMissCount) || 0
      });
    }
  }
};

// Initialize performance counters
self.cacheHitCount = 0;
self.cacheMissCount = 0;

// Log performance metrics periodically
setInterval(logPerformanceMetrics, 60000); // Every minute

swLog('Service Worker: Enhanced version loaded - Version', CACHE_NAME);
swLog('Service Worker: Cache strategies initialized:', {
  static: CACHE_NAME,
  runtime: RUNTIME_CACHE,
  images: IMAGE_CACHE,
  fonts: FONT_CACHE
});
