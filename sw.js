// The cache will only be updated when this serviceworker file has changes (see 'activate' event).
// Changing this version number is an easy way to trigger a cache update since this file will have
// changes.
const VERSION = '0.1.2';

self.addEventListener('install', event => {
  // When a new version is installed, normally a serviceworker
  // waits until all tabs are closed before activating it.
  // Since this service worker isn't very complex,
  // it's fine to activate any new serviceworker version immediately.
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log("Updating offline cache");
  event.waitUntil(
    Promise.all(
      // Cache/update the source so it'll be available when offline
      caches.open('affective-state-v1').then(cache => {
        return cache.addAll([
          '/',
          '/script.js',
          '/style.css',
          '/icons/icon-32.png',
          '/icons/icon-192.png',
          '/icons/icon-512.png'
        ]);
      }),
      // Make sure all tabs go through this serviceworker
      // to ensure the latest version is used everywhere
      clients.claim()
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    // If the file is cached, use the cached version to fulfil the request
    // (cache-first strategy, falling back to network if not found)
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});