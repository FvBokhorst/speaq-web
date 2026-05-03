/**
 * SPEAQ TURN credentials helper - PWA side.
 *
 * Fetches time-limited TURN credentials from the relay and caches them
 * until ~30 seconds before TTL expiry. Falls back to STUN-only if the
 * TURN service is unreachable, so calls between same-network peers
 * continue to work even if the relay endpoint is down.
 *
 * Cross-platform contract: see 02 Areas/SPEAQ/SPEAQ_TURN_Contract_v1.md
 * Native equivalent: ~/speaq-build/src/services/turn.ts (identical shape).
 */

interface IceConfigResponse {
  iceServers: RTCIceServer[];
  ttl: number;
}

interface CachedConfig {
  iceServers: RTCIceServer[];
  fetchedAt: number;
  ttlSeconds: number;
}

let cached: CachedConfig | null = null;

// Same relay URL as page.tsx uses for register / witness / DMS endpoints.
// Hard-coded to match production WebSocket URL so TURN credentials come from
// the same origin. If you migrate to a custom domain, update both places.
const RELAY_BASE = "https://speaq-relay-244491980730.europe-west1.run.app";

const STUN_ONLY_FALLBACK: RTCIceServer[] = [
  { urls: "stun:turn.thespeaq.com:3478" },
];

const REFRESH_BUFFER_SECONDS = 30;

/**
 * Get ICE servers (STUN + TURN with credentials) for an outgoing or
 * incoming WebRTC call. Caches credentials until just before expiry to
 * minimise round-trips. Always resolves to a usable config; never throws.
 */
export async function getIceServers(speaqId: string): Promise<RTCIceServer[]> {
  if (!speaqId) return STUN_ONLY_FALLBACK;

  const now = Date.now();
  if (
    cached &&
    now < cached.fetchedAt + (cached.ttlSeconds - REFRESH_BUFFER_SECONDS) * 1000
  ) {
    return cached.iceServers;
  }

  try {
    const res = await fetch(`${RELAY_BASE}/api/v1/turn-credentials`, {
      method: "GET",
      headers: { "X-Speaq-Id": speaqId },
    });
    if (!res.ok) return STUN_ONLY_FALLBACK;
    const data: IceConfigResponse = await res.json();
    if (!Array.isArray(data?.iceServers) || data.iceServers.length === 0) {
      return STUN_ONLY_FALLBACK;
    }
    cached = {
      iceServers: data.iceServers,
      fetchedAt: now,
      ttlSeconds: typeof data.ttl === "number" && data.ttl > 0 ? data.ttl : 300,
    };
    return cached.iceServers;
  } catch {
    return STUN_ONLY_FALLBACK;
  }
}

/**
 * Force a fresh fetch on next getIceServers() call. Useful when an
 * authentication failure was detected and the cached credentials are
 * suspected of being stale.
 */
export function clearIceServersCache(): void {
  cached = null;
}
