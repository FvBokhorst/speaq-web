const CACHE_NAME = "speaq-pwa-v113";
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
// The relay sends silent data-only payloads, never message or caller content;
// the notification is intentionally generic so the lock screen reveals nothing
// about who is talking to whom. Two payload types:
//   {t:"msg", ts:...}  -> generic "new message" notification
//   {t:"call", ts:...} -> generic "incoming call" notification
//
// i18n: notification body is localised based on navigator.language (browser
// locale of the device that registered the SW). 9 languages supported, same
// set as the in-app translations. Falls back to English if locale unknown.

const NOTIF_I18N = {
  msg: {
    en: "New message", nl: "Nieuw bericht", fr: "Nouveau message",
    es: "Nuevo mensaje", de: "Neue Nachricht", ru: "Новое сообщение",
    sl: "Novo sporocilo", lg: "Obubaka obupya", sw: "Ujumbe mpya",
  },
  call: {
    en: "Incoming call", nl: "Inkomende oproep", fr: "Appel entrant",
    es: "Llamada entrante", de: "Eingehender Anruf", ru: "Входящий вызов",
    sl: "Dohodni klic", lg: "Essimu eyingiza", sw: "Simu inayoingia",
  },
};

function pickLocale() {
  const raw = (self.navigator && self.navigator.language) || "en";
  const code = raw.toLowerCase().slice(0, 2);
  return (code in NOTIF_I18N.msg) ? code : "en";
}

self.addEventListener("push", (event) => {
  let payload = { t: "msg" };
  try {
    if (event.data) payload = event.data.json();
  } catch (e) { void e; }

  const isCall = payload && payload.t === "call";
  const locale = pickLocale();
  const title = "SPEAQ";
  const body = isCall ? NOTIF_I18N.call[locale] : NOTIF_I18N.msg[locale];
  const tag = isCall ? "speaq-call" : "speaq-msg";

  const options = {
    body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag,
    renotify: true,
    requireInteraction: isCall,
    data: { url: "/app", ts: Date.now(), kind: isCall ? "call" : "msg" },
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
