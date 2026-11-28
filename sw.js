/* VetNet service worker: lets the site open without internet after the first visit.
   Strategy: network first (so your new pushes always show up), cache as the backup.
   To force everyone to refresh everything, change VERSION below. */
var VERSION = "vetnet-v1";
var CORE = ["./", "index.html", "style.css", "comfort.css", "feedback.css", "welcome.css", "exam.css", "skeleton.css", "search.css",
  "comfort-boot.js", "script.js", "safety.js", "feedback-data.js", "comfort.js", "feedback.js", "welcome.js", "exam.js",
  "diagrams-data.js", "skeleton.js", "search.js", "pwa.js", "manifest.webmanifest", "icon-192.png", "icon-512.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) {
    return Promise.all(CORE.map(function (u) { return c.add(u).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION && k.indexOf("vetnet-") === 0; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== self.location.origin || /admin\.html$/.test(u.pathname)) return;
  e.respondWith(caches.open(VERSION).then(function (c) {
    var net = fetch(r).then(function (res) { if (res && res.ok) c.put(r, res.clone()); return res; });
    var slow = new Promise(function (resolve) {
      setTimeout(function () { c.match(r, { ignoreSearch: true }).then(function (m) { if (m) resolve(m); }); }, 6000);
    });
    return Promise.race([net, slow]).catch(function () {
      return c.match(r, { ignoreSearch: true }).then(function (m) { return m || (r.mode === "navigate" ? c.match("index.html") : undefined) || Response.error(); });
    });
  }));
});