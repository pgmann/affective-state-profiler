// The cache will only be updated when this serviceworker file has changes (see 'activate' event).
// Changing this version number is an easy way to trigger a cache update since this file will have
// changes.
const VERSION = 'v1.0';

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
      caches.delete('affective-state-v1').then(() => caches.open('affective-state-v1')).then(cache => {
        return cache.addAll([
          // internal scripts
          '/',
          '/script.js',
          '/style.css',
          '/icons/icon-32.png',
          '/icons/icon-192.png',
          '/icons/icon-512.png',
          '/affectivestate.webmanifest',
          // internal libraries
          '/lib/nouislider.min.js',
          '/lib/nouislider.css',
          // external libraries
          'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css',
          'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.css',
          'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/js/all.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.bundle.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-zoom/0.7.7/chartjs-plugin-zoom.min.js',
          // fontawesome fonts
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/webfonts/fa-regular-400.eot',
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/webfonts/fa-regular-400.eot?#iefix',
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/webfonts/fa-regular-400.woff2',
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/webfonts/fa-regular-400.woff',
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/webfonts/fa-regular-400.ttf',
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/webfonts/fa-regular-400.svg#fontawesome',
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/webfonts/fa-solid-900.eot',
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/webfonts/fa-solid-900.eot?#iefix',
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/webfonts/fa-solid-900.woff2',
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/webfonts/fa-solid-900.woff',
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/webfonts/fa-solid-900.ttf',
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/webfonts/fa-solid-900.svg#fontawesome'
        ]);
      }),
      // Make sure all tabs go through this serviceworker
      // to ensure the latest version is used everywhere
      clients.claim()
    )
  );
});

self.addEventListener('fetch', event => {
  if (new URL(event.request.url).pathname == "/version") {
    event.respondWith(new Response(VERSION));
    return;
  }
  event.respondWith(
    // If the file is cached, use the cached version to fulfil the request
    // (cache-first strategy, falling back to network if not found)
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});