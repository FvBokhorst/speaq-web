const CACHE_NAME = "speaq-pwa-v111";
const STATIC_ASSETS = ["/manifest.json", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (event.request.url.includes("wss://") || event.request.url.includes("ws://")) return;

  // NEVER cache the app page -- always fetch fresh
  if (event.request.url.includes("/app")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-first for static assets only
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// --- Push notifications -----------------------------------------------------
// The relay sends silent data-only payloads ("{t":"msg","ts":...}). We never
// receive message content; the notification is intentionally generic so the
// lock screen reveals nothing about who is talking to whom.

self.addEventListener("push", (event) => {
  const title = "SPEAQ";
  const body = "New message";

  const options = {
    body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: "speaq-msg",
    renotify: true,
    requireInteraction: false,
    data: { url: "/app", ts: Date.now() },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/app";

  event.waitUntil(
    (async () => {
      const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const client of all) {
        if (client.url.includes("/app")) {
          client.focus();
          return;
        }
      }
      await self.clients.openWindow(target);
    })()
  );
});
