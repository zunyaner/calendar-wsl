/* 2027日历 service worker — static, cache-first, relative URLs */
const CACHE = "cal2027-wsl-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./css/app.css",
  "./js/app.js",
  "./data/calendar-data.json",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/hero-nanning.jpg",
  "./icons/hero-macau.jpg",
  "./icons/hero-2024.jpg",
  "./icons/hero-chengdu.jpg",
  "./icons/hero-nanjing.jpg",
  "./icons/month-nanning.jpg",
  "./icons/month-macau.jpg",
  "./icons/month-2024.jpg",
  "./icons/month-chengdu.jpg",
  "./icons/month-nanjing.jpg",
  "./data/photo-credits.json",
  "./company-2027.ics"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
