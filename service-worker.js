const CACHE_NAME = "task-manager-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/js/app.js",
  "/js/index.js",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Archivos en caché");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => {
          return (
            response ||
            fetch(event.request).then((networkResponse) => {
              return caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
            })
          );
        })
        .catch(() => {
          return caches.match("/index.html");
        })
    );
  }
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.text() : "Notificación de tarea";

  event.waitUntil(
    self.registration.showNotification("Gestor de Tareas", {
      body: data,
      icon: "/icons/icon-192x192.png",
    })
  );
});
