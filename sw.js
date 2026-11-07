var CACHE = "memory-v2";
var ASSETS = ["./", "./index.html", "./manifest.webmanifest",
             "./icon-180.png", "./icon-512.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (n) { return n !== CACHE; })
                        .map(function (n) { return caches.delete(n); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  e.respondWith(caches.match(e.request).then(function (r) {
    return r || fetch(e.request);
  }));
});
