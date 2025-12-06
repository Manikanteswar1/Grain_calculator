const CACHE_NAME = "paddy-cache-v5.15";
const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
];

// Install – cache all core files safely
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(URLS_TO_CACHE);
      } catch (err) {
        console.warn("addAll failed, caching items individually...", err);
        for (const url of URLS_TO_CACHE) {
          try {
            await cache.add(url);
          } catch (e) {
            console.warn("Failed to cache", url, e);
          }
        }
      }
    })
  );
  self.skipWaiting();
});


// Activate – clean old caches (optional but good)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", (event) => {
  // For navigation (page load / reload)
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("./index.html").then((cached) => {
        return cached || fetch(event.request);
      })
    );
    return;
  }

  // For CSS, JS, etc – try cache first, then network
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
