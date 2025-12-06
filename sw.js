// improved sw.js — drop-in replacement
const CACHE_NAME = "paddy-cache-v4"; // bump this on next deploy (v5...)
const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Install – cache core files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  // allow activate() to run sooner if we ask later
  self.skipWaiting();
});

// Activate – remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch – navigation fallback + cache-first for assets
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("./index.html").then((cached) => cached || fetch(event.request).catch(() => cached))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((resp) => {
        // optionally update runtime cache for same-origin GET requests
        if (resp && resp.status === 200 && event.request.method === "GET" && new URL(event.request.url).origin === location.origin) {
          const respClone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, respClone));
        }
        return resp;
      }).catch(() => cached);
    })
  );
});

// Listen for SKIP_WAITING message from the page
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
