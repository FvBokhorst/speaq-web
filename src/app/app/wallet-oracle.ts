/**
 * Read-only client for the speaq-gold-feed oracle.
 *
 * Kept deliberately small and fail-safe: the PWA's existing conversion
 * helpers in wallet.ts stay untouched (they encode the protocol floor peg
 * of 1 QC = 0.01 gram gold). This module only adds a live market snapshot
 * for informational display next to that peg, and gracefully returns null
 * when the oracle is unreachable.
 */
export type GoldOracleSnapshot = {
  usdPerGram: number;
  usdPerTroyOunce: number;
  timestamp: string;
  sourcesUsed: string[];
  sourcesFailed: string[];
};

const ORACLE_URL = "/api/gold-oracle";
const CACHE_KEY = "speaq_gold_oracle_cache_v1";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function fetchLiveGoldPrice(): Promise<GoldOracleSnapshot | null> {
  const cached = readCache();
  if (cached) return cached;
  try {
    const res = await fetch(ORACLE_URL, { cache: "no-store" });
    if (!res.ok) return null;
    const data: {
      price_usd_per_gram?: number;
      price_usd_per_troy_ounce?: number;
      timestamp?: string;
      sources_used?: string[];
      sources_failed?: string[];
    } = await res.json();
    if (
      typeof data.price_usd_per_gram !== "number"
      || typeof data.price_usd_per_troy_ounce !== "number"
    ) return null;
    const snap: GoldOracleSnapshot = {
      usdPerGram: data.price_usd_per_gram,
      usdPerTroyOunce: data.price_usd_per_troy_ounce,
      timestamp: data.timestamp ?? new Date().toISOString(),
      sourcesUsed: data.sources_used ?? [],
      sourcesFailed: data.sources_failed ?? [],
    };
    writeCache(snap);
    return snap;
  } catch {
    return null;
  }
}

function readCache(): GoldOracleSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { at: number; value: GoldOracleSnapshot };
    if (Date.now() - parsed.at > CACHE_TTL_MS) return null;
    return parsed.value;
  } catch {
    return null;
  }
}

function writeCache(value: GoldOracleSnapshot): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), value }));
  } catch {}
}

export function formatRelativeAge(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return "just now";
  const min = Math.floor(ms / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
