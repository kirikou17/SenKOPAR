const CACHE_NAME = 'senkopar-cache-v1';

// On garde uniquement la racine et le manifest pour valider l'installation
const ASSETS = [
  '/',
  '/manifest.json'
];

// ... Laisse tout le reste du code sw.js identique ...

// ... Laisse tout le reste de ton code sw.js exactement comme il est ...

// Installation du Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Force le SW a devenir actif immediatement
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // Prend le controle des pages immediatement
});

// Strategie : Reseau d'abord, Cache si hors-ligne
self.addEventListener('fetch', (e) => {
  // On ignore les requetes vers l'API Django ou l'exterieur
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(e.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (e.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});