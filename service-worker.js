const CACHE_NAME = 'ae-lister-cache-v1';
const FILES_TO_CACHE = [
  '.',
  './index.html',
  './manifest.json',
  './static/style.css',
  './static/app.js'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request)
      .then(resp => resp || fetch(evt.request))
  );
});