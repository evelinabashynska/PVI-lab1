const CACHE_NAME = "pwa-cache-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/bell.png",
  "/dashboard.html",
  "/manifest.json",
  "/menu.png",
  "/messages.html",
  "/reindeer.png",
  "/tasks.html",
  "/trash.png",
  "/user.png",
  "/screenshot1.png",
  "/screenshot2.png",
  "/screenshot3.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(console.error);
    })
  );
});
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  if (!url.startsWith("http") || url.startsWith("chrome-extension")) {
    console.warn("SW: Пропускаю запит", url);
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            return networkResponse;
          }

          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone()).catch((err) => {
              console.warn("SW: Не вдалося кешувати", event.request.url, err);
            });
            return networkResponse;
          });
        })
        .catch(() => caches.match("/offline.html"));
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
});
