/**
 * Web Push client helpers.
 *
 * Handles permission request, VAPID subscription, and server sync.
 * All fetches go to the SPEAQ relay over https; the relay then owns
 * the subscription lifecycle in Firestore.
 */

// Public VAPID key is safe to commit (it is the PUBLIC half of the keypair;
// the private half lives only in GCP Secret Manager on the relay). Inlined
// here because the Next.js Docker build step intermittently failed to pick
// up .env.production during Cloud Build, leaving this key empty at runtime.
const PUBLIC_VAPID_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  "BGcuHZh4otk3cOk_IY8wXjpkW3JVJJb70jre0SO2Q9My3k-a0ckj76PCYS1TdAVJ5OPKcPDyIY6bs9jjkjPlaqw";
const RELAY_BASE = "https://speaq-relay-244491980730.europe-west1.run.app";
const LOCAL_FLAG_KEY = "speaq_push_state";

export type PushLocalState =
  | { status: "unsupported" }
  | { status: "pristine" }
  | { status: "dismissed"; until: number }
  | { status: "declined" }
  | { status: "subscribed"; endpoint: string; subscribedAt: number };

export function loadPushState(): PushLocalState {
  if (typeof window === "undefined") return { status: "pristine" };
  try {
    const raw = localStorage.getItem(LOCAL_FLAG_KEY);
    if (!raw) return { status: "pristine" };
    return JSON.parse(raw) as PushLocalState;
  } catch {
    return { status: "pristine" };
  }
}

export function savePushState(state: PushLocalState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_FLAG_KEY, JSON.stringify(state));
  } catch {}
}

export function isPushSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const normalized = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(normalized);
  const buf = new ArrayBuffer(raw.length);
  const arr = new Uint8Array(buf);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

async function getRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null;
  const reg = await navigator.serviceWorker.ready;
  return reg;
}

export async function requestPermissionAndSubscribe(speaqId: string): Promise<PushLocalState> {
  if (!isPushSupported()) return { status: "unsupported" };
  if (!PUBLIC_VAPID_KEY) {
    console.warn("[push] NEXT_PUBLIC_VAPID_PUBLIC_KEY missing; cannot subscribe");
    return { status: "pristine" };
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    const state: PushLocalState = { status: "declined" };
    savePushState(state);
    return state;
  }

  const reg = await getRegistration();
  if (!reg) return { status: "unsupported" };

  const existing = await reg.pushManager.getSubscription();
  const sub =
    existing ||
    (await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
    }));

  const payload = {
    speaqId,
    subscription: sub.toJSON(),
    platform: "web" as const,
  };

  const res = await fetch(`${RELAY_BASE}/api/push/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.warn("[push] subscribe rejected by relay", res.status);
    return { status: "pristine" };
  }

  const state: PushLocalState = {
    status: "subscribed",
    endpoint: sub.endpoint,
    subscribedAt: Date.now(),
  };
  savePushState(state);
  return state;
}

export async function unsubscribePush(speaqId: string): Promise<void> {
  if (!isPushSupported()) return;
  const reg = await getRegistration();
  const sub = reg ? await reg.pushManager.getSubscription() : null;
  const endpoint = sub?.endpoint;

  if (sub) await sub.unsubscribe().catch(() => undefined);

  await fetch(`${RELAY_BASE}/api/push/unsubscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(endpoint ? { speaqId, endpoint } : { speaqId }),
  }).catch(() => undefined);

  savePushState({ status: "pristine" });
}

export function dismissPromptFor(hours: number): void {
  savePushState({ status: "dismissed", until: Date.now() + hours * 60 * 60 * 1000 });
}
