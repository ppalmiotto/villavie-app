// Villa Vie Service Worker — cache-busting version
// Only caches icons, never HTML or JS files
const CACHE_NAME = 'villavie-v5';
const CACHE_URLS = [
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_URLS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Never cache HTML or JS — always fetch fresh
  if (url.pathname.endsWith('.html') || 
      url.pathname.endsWith('.js') || 
      url.pathname === '/' ||
      url.pathname.endsWith('.css')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }
  
  // Cache only icons
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then(cached => 
        cached || fetch(event.request)
      )
    );
  }
});
