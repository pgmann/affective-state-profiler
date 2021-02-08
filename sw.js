const VERSION = 0.1;

self.addEventListener('activate', event => {
  console.log("Updating offline cache");
  event.waitUntil(
    caches.open('affective-state-v1').then(cache => {
      return cache.addAll([
        '/index.html',
        '/script.js',
        '/icons/icon-32.png',
        '/icons/icon-192.png',
        '/icons/icon-512.png'
      ]);
    }),
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});