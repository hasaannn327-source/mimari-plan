// Service Worker for Mimari Kat Planı Öneri Sistemi
const CACHE_NAME = 'kat-plani-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Files to cache for offline use
const STATIC_FILES = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/plans/plan_1_1plus1_1side.svg',
  '/plans/plan_2_2plus1_2side.svg',
  '/plans/plan_3_3plus1_3side.svg',
  '/plans/plan_4_4plus1_4side.svg'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    // Static files - serve from cache first
    if (STATIC_FILES.includes(url.pathname) || url.pathname === '/') {
      event.respondWith(
        caches.match(request)
          .then((response) => {
            if (response) {
              return response; // Return cached version
            }
            // If not in cache, fetch from network and cache
            return fetch(request)
              .then((networkResponse) => {
                if (networkResponse.status === 200) {
                  const responseClone = networkResponse.clone();
                  caches.open(STATIC_CACHE)
                    .then((cache) => {
                      cache.put(request, responseClone);
                    });
                }
                return networkResponse;
              });
          })
          .catch(() => {
            // If both cache and network fail, show offline page
            if (url.pathname === '/') {
              return caches.match('/index.html');
            }
            return new Response('Offline - Bu sayfa çevrimdışı kullanılamıyor', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain; charset=utf-8'
              })
            });
          })
      );
    }
    
    // API requests - try network first, fallback to cache
    else if (url.pathname.startsWith('/api/')) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            // Cache successful API responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
            }
            return response;
          })
          .catch(() => {
            // Try to serve from cache if network fails
            return caches.match(request)
              .then((cachedResponse) => {
                if (cachedResponse) {
                  return cachedResponse;
                }
                // Return offline response
                return new Response(JSON.stringify({
                  error: 'Çevrimdışı mod - API erişimi yok',
                  offline: true
                }), {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: new Headers({
                    'Content-Type': 'application/json; charset=utf-8'
                  })
                });
              });
          })
      );
    }
    
    // Other requests - network first, cache as fallback
    else {
      event.respondWith(
        fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
            }
            return response;
          })
          .catch(() => {
            // Try cache as fallback
            return caches.match(request);
          })
      );
    }
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle any pending offline actions
      console.log('Processing background sync...')
    );
  }
});

// Push notifications (if needed in future)
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    body: 'Yeni kat planı önerisi mevcut!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Görüntüle',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Kapat',
        icon: '/icons/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Kat Planı Önerisi', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

// Unhandled rejection handling
self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
});