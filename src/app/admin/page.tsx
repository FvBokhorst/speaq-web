"use client";

import { useState, useEffect, useCallback } from "react";
import ThemeToggle from "../components/ThemeToggle";

// --- Constants ---

const STATS_API = "/api/admin/stats";
const INCIDENTS_API = "/api/admin/incidents";
const COUNTRY_STATS_API = "/api/admin/country-stats";
const MAX_SUPPLY = 21_000_000;
const REFRESH_INTERVAL = 30_000; // 30 seconds

// --- Types ---

interface AdminStats {
  users: {
    total: number;
    activeNow: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
    newThisYear: number;
    growth: { date: string; count: number }[];
  };
  miners: {
    totalReceipts: number;
    activeNow: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
    newThisYear: number;
  };
  economy: {
    totalQCMined: number;
    maxSupply: number;
    remaining: number;
    percentMined: number;
  };
  network: {
    connectedClients: number;
    registeredKeys: number;
    totalMessagesRelayed: number;
    offlineQueued: number;
    uptimeSeconds: number;
    serverStartedAt: number;
  };
}

interface CountryStat {
  code: string;
  count: number;
  name: string;
}

// --- Helpers ---

async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Admin PIN hash from environment variable
const EXPECTED_HASH = process.env.NEXT_PUBLIC_ADMIN_PIN_HASH || "";

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

// --- SVG Line Chart ---

function LineChart({
  data,
  color,
  height = 120,
  label,
}: {
  data: { date: string; count: number }[];
  color: string;
  height?: number;
  label: string;
}) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-text-muted text-sm"
        style={{ height }}
      >
        No data
      </div>
    );
  }

  const width = 600;
  const padding = { top: 10, right: 10, bottom: 30, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => d.count), 1);
  const minVal = Math.min(...data.map((d) => d.count));

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1 || 1)) * chartW;
    const y =
      padding.top +
      chartH -
      ((d.count - minVal) / (maxVal - minVal || 1)) * chartH;
    return { x, y, ...d };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // Area fill
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  // Y-axis labels
  const yLabels = [minVal, Math.round((maxVal + minVal) / 2), maxVal];

  return (
    <div className="w-full">
      <p className="text-text-muted text-xs font-mono uppercase tracking-wider mb-2">
        {label}
      </p>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {yLabels.map((val, i) => {
          const y =
            padding.top +
            chartH -
            ((val - minVal) / (maxVal - minVal || 1)) * chartH;
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="rgba(100,116,139,0.15)"
                strokeDasharray="4"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                fill="#64748B"
                fontSize="10"
                fontFamily="monospace"
              >
                {formatNumber(val)}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill={color} opacity="0.1" />

        {/* Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" />

        {/* Dots */}
        {points
          .filter((_, i) => i % Math.max(1, Math.floor(points.length / 8)) === 0 || i === points.length - 1)
          .map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />
          ))}

        {/* X-axis labels */}
        {points
          .filter((_, i) => i % Math.max(1, Math.floor(points.length / 6)) === 0 || i === points.length - 1)
          .map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={height - 5}
              textAnchor="middle"
              fill="#64748B"
              fontSize="9"
              fontFamily="monospace"
            >
              {p.date}
            </text>
          ))}
      </svg>
    </div>
  );
}

// --- Progress Bar ---

function ProgressBar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-3 bg-bg-elevated rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

// --- Stat Card ---

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-lg p-4">
      <p className="text-text-muted text-xs font-mono uppercase tracking-wider">
        {label}
      </p>
      <p className="text-2xl font-semibold text-text-primary mt-1">
        {typeof value === "number" ? formatNumber(value) : value}
      </p>
      {sub && <p className="text-text-muted text-xs mt-1">{sub}</p>}
    </div>
  );
}

// --- SVG Icons (line style, no emoji) ---

function IconUsers() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconMiner() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" />
      <line x1="12" y1="11" x2="12" y2="17" />
      <line x1="9" y1="14" x2="15" y2="14" />
    </svg>
  );
}

function IconCredits() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M14.5 9a3.5 3.5 0 0 0-5 0" />
      <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
      <line x1="12" y1="6" x2="12" y2="18" />
    </svg>
  );
}

function IconChain() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <line x1="10" y1="6.5" x2="14" y2="6.5" />
      <line x1="10" y1="17.5" x2="14" y2="17.5" />
      <line x1="6.5" y1="10" x2="6.5" y2="14" />
      <line x1="17.5" y1="10" x2="17.5" y2="14" />
    </svg>
  );
}

function IconNetwork() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3" />
      <circle cx="5" cy="19" r="3" />
      <circle cx="19" cy="19" r="3" />
      <line x1="12" y1="8" x2="5" y2="16" />
      <line x1="12" y1="8" x2="19" y2="16" />
      <line x1="5" y1="19" x2="19" y2="19" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconRefresh({ spinning }: { spinning: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={spinning ? "animate-spin" : ""}
    >
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

// --- Main Page ---

export default function AdminPage() {
  const [pin, setPin] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [storedPin, setStoredPin] = useState("");
  const [chainData, setChainData] = useState<{ chain_height: number; balance: number; balance_sparks: number; genesis_hash: string } | null>(null);
  const [goldOracle, setGoldOracle] = useState<{
    price_usd_per_gram: number;
    price_usd_per_troy_ounce: number;
    timestamp: string;
    sources_used: string[];
    sources_failed: string[];
    method: string;
  } | null>(null);
  const [incidents, setIncidents] = useState<{ id: string; type: string; source: string; timestamp: string; issues: string; services?: { node: boolean; stats: boolean; relay: boolean }; chainHeight?: number; memFreeMB?: number }[]>([]);
  const [healthLog, setHealthLog] = useState<{ timestamp: string; source: string; status: string; node: boolean; stats: boolean; relay: boolean; chainHeight: number; memFreeMB?: number; relayClients?: number }[]>([]);
  const [countryStats, setCountryStats] = useState<CountryStat[]>([]);

  // Check session on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("speaq-admin-pin");
    if (saved) {
      setStoredPin(saved);
      setAuthenticated(true);
    }
    setAuthChecked(true);
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    if (!storedPin) return;
    setLoading(true);
    try {
      const res = await fetch(`${STATS_API}?pin=${encodeURIComponent(storedPin)}`);
      if (!res.ok) {
        if (res.status === 403) {
          setAuthenticated(false);
          sessionStorage.removeItem("speaq-admin-pin");
          setError("Invalid PIN");
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setStats(data);
      setError("");
    } catch (e: unknown) {
      setError(`Failed to connect to relay server: ${(e as Error)?.message || "unknown error"}`);
    }
    // Fetch blockchain data via server-side proxy (avoids mixed content)
    try {
      const chainRes = await fetch("/api/admin/chain");
      if (chainRes.ok) {
        setChainData(await chainRes.json());
      }
    } catch {}
    // Fetch incidents and health log
    try {
      const incRes = await fetch(INCIDENTS_API);
      if (incRes.ok) {
        const incData = await incRes.json();
        setIncidents(incData.incidents || []);
        setHealthLog(incData.healthLog || []);
      }
    } catch {}
    // Fetch gold oracle snapshot via server-side proxy (avoids CORS)
    try {
      const oracleRes = await fetch("/api/gold-oracle", { cache: "no-store" });
      if (oracleRes.ok) {
        setGoldOracle(await oracleRes.json());
      }
    } catch {}
    // Fetch country stats (privacy-preserving, timezone-based)
    try {
      const csRes = await fetch(`${COUNTRY_STATS_API}?pin=${encodeURIComponent(storedPin)}`);
      if (csRes.ok) {
        const csData = await csRes.json();
        setCountryStats(csData.countries || []);
      }
    } catch {}
    setLoading(false);
  }, [storedPin]);

  // Auto-fetch on auth
  useEffect(() => {
    if (authenticated && storedPin) {
      fetchStats();
      const interval = setInterval(fetchStats, REFRESH_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [authenticated, storedPin, fetchStats]);

  // Handle PIN submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;

    const pinHash = await hashPin(pin);
    // Try to authenticate by making the actual request
    setStoredPin(pin);
    sessionStorage.setItem("speaq-admin-pin", pin);

    try {
      const res = await fetch(`${STATS_API}?pin=${encodeURIComponent(pin)}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setAuthenticated(true);
        setError("");
      } else {
        setError("Invalid PIN");
        sessionStorage.removeItem("speaq-admin-pin");
        setStoredPin("");
      }
    } catch {
      // If relay is down, verify PIN locally
      const expectedHash = EXPECTED_HASH;
      if (pinHash === expectedHash) {
        setAuthenticated(true);
        setError("Authenticated (relay offline)");
      } else {
        setError("Invalid PIN");
        sessionStorage.removeItem("speaq-admin-pin");
        setStoredPin("");
      }
    }
  };

  // Loading state
  if (!authChecked) return null;

  // --- PIN Entry Screen ---
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-bg-card border border-[rgba(100,116,139,0.15)] mb-4">
              <span className="text-voice-gold">
                <IconLock />
              </span>
            </div>
            <h1 className="text-xl font-semibold text-text-primary">
              SPEAQ Admin
            </h1>
            <p className="text-text-muted text-sm mt-1">
              Enter PIN to access dashboard
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError("");
              }}
              placeholder="Admin PIN"
              className="w-full px-4 py-3 bg-bg-card border border-[rgba(100,116,139,0.2)] rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-voice-gold text-center text-lg tracking-[0.3em] font-mono"
              autoFocus
            />
            {error && (
              <p className="text-resistance-red text-sm text-center mt-2">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full mt-4 py-3 bg-voice-gold text-bg-deep font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Dashboard ---
  const s = stats;

  return (
    <div className="min-h-screen bg-bg-deep">
      {/* Header */}
      <header className="border-b border-[rgba(100,116,139,0.15)] bg-bg-surface">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-text-primary font-mono">
              SPEAQ Admin
            </h1>
            <p className="text-text-muted text-xs font-mono">
              Network Dashboard
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={fetchStats}
              className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors text-sm"
            >
              <IconRefresh spinning={loading} />
              Refresh
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem("speaq-admin-pin");
                setAuthenticated(false);
                setStoredPin("");
                setStats(null);
              }}
              className="text-text-muted hover:text-resistance-red transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="bg-[rgba(226,75,74,0.1)] border border-resistance-red/30 rounded-lg px-4 py-2 text-resistance-red text-sm">
            {error}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {!s ? (
          <div className="text-center py-20 text-text-muted">
            {loading ? "Loading stats..." : "No data available"}
          </div>
        ) : (
          <>
            {/* Section 1: Users */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-voice-gold">
                <IconUsers />
                <h2 className="text-sm font-mono uppercase tracking-wider">
                  Users
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
                <StatCard label="Total" value={s.users.total} />
                <StatCard
                  label="Active Now"
                  value={s.users.activeNow}
                  sub="Connected"
                />
                <StatCard label="New Today" value={s.users.newToday} />
                <StatCard label="This Week" value={s.users.newThisWeek} />
                <StatCard label="This Month" value={s.users.newThisMonth} />
                <StatCard label="This Year" value={s.users.newThisYear} />
              </div>
              <div className="bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-lg p-4">
                <LineChart
                  data={s.users.growth}
                  color="#D4A853"
                  label="User Growth (30 days)"
                />
              </div>
            </section>

            {/* Section 1b: Country Distribution */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-quantum-teal">
                <IconGlobe />
                <h2 className="text-sm font-mono uppercase tracking-wider">
                  User Distribution
                </h2>
                <span className="text-[10px] text-text-muted font-mono ml-2">
                  Timezone-based — no IP tracking
                </span>
              </div>

              {countryStats.length > 0 ? (
                <>
                  {/* Summary cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <StatCard
                      label="Countries"
                      value={countryStats.filter(c => c.code !== "XX").length}
                      sub="Active regions"
                    />
                    <StatCard
                      label="Top Country"
                      value={countryStats[0]?.name || "-"}
                      sub={`${countryStats[0]?.count || 0} users`}
                    />
                    <StatCard
                      label="Tracked Users"
                      value={countryStats.reduce((sum, c) => sum + c.count, 0)}
                      sub="With country data"
                    />
                    <StatCard
                      label="Unknown"
                      value={countryStats.find(c => c.code === "XX")?.count || 0}
                      sub="Timezone not mapped"
                    />
                  </div>

                  {/* Country bar chart + table */}
                  <div className="bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-lg p-4">
                    <p className="text-text-muted text-xs font-mono uppercase tracking-wider mb-3">
                      Users by Country
                    </p>
                    <div className="space-y-1.5 max-h-80 overflow-y-auto">
                      {countryStats
                        .filter(c => c.code !== "XX")
                        .map((country) => {
                          const maxCount = countryStats[0]?.count || 1;
                          const pct = (country.count / maxCount) * 100;
                          return (
                            <div key={country.code} className="flex items-center gap-3 group">
                              <span className="w-6 text-center text-xs font-mono text-text-muted shrink-0">
                                {country.code}
                              </span>
                              <div className="flex-1 h-5 bg-bg-elevated rounded overflow-hidden relative">
                                <div
                                  className="h-full rounded transition-all duration-500"
                                  style={{
                                    width: `${Math.max(pct, 2)}%`,
                                    backgroundColor: "rgba(45,212,191,0.4)",
                                  }}
                                />
                                <span className="absolute inset-y-0 left-2 flex items-center text-[11px] font-mono text-text-secondary">
                                  {country.name}
                                </span>
                              </div>
                              <span className="w-12 text-right text-xs font-mono text-quantum-teal shrink-0">
                                {country.count}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-lg p-4">
                  <p className="text-text-muted text-xs font-mono">
                    Country statistics will appear once the relay collects timezone data from connected users. No IP addresses are used.
                  </p>
                </div>
              )}
            </section>

            {/* Section 2: Miners */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-quantum-teal">
                <IconMiner />
                <h2 className="text-sm font-mono uppercase tracking-wider">
                  Miners
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
                <StatCard
                  label="Total Receipts"
                  value={s.miners.totalReceipts}
                />
                <StatCard
                  label="Active Now"
                  value={s.miners.activeNow}
                  sub="Connected"
                />
                <StatCard label="New Today" value={s.miners.newToday} />
                <StatCard label="This Week" value={s.miners.newThisWeek} />
                <StatCard label="This Month" value={s.miners.newThisMonth} />
                <StatCard label="This Year" value={s.miners.newThisYear} />
              </div>
              <div className="bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-lg p-4">
                <LineChart
                  data={s.users.growth}
                  color="#2DD4BF"
                  label="Miner Growth (30 days)"
                />
              </div>
            </section>

            {/* Section 3: Q-Credits Economy */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-voice-gold">
                <IconCredits />
                <h2 className="text-sm font-mono uppercase tracking-wider">
                  Q-Credits Economy
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <StatCard
                  label="Total QC Mined"
                  value={formatNumber(s.economy.totalQCMined)}
                  sub="In circulation"
                />
                <StatCard
                  label="Max Supply"
                  value={formatNumber(MAX_SUPPLY)}
                  sub="21M QC cap"
                />
                <StatCard
                  label="Remaining"
                  value={formatNumber(s.economy.remaining)}
                  sub="Left to mine"
                />
                <StatCard
                  label="Mined"
                  value={`${s.economy.percentMined.toFixed(4)}%`}
                  sub="Of total supply"
                />
              </div>
              <div className="bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-lg p-4">
                <p className="text-text-muted text-xs font-mono uppercase tracking-wider mb-3">
                  Supply Progress
                </p>
                <ProgressBar
                  value={s.economy.totalQCMined}
                  max={MAX_SUPPLY}
                  color="#D4A853"
                />
                <div className="flex justify-between mt-2 text-text-muted text-xs font-mono">
                  <span>0 QC</span>
                  <span>21,000,000 QC</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-lg p-4">
                  <p className="text-text-muted text-xs font-mono uppercase tracking-wider">
                    Current Block Reward
                  </p>
                  <p className="text-lg font-semibold text-text-primary mt-1">
                    0.0001 QC
                  </p>
                  <p className="text-text-muted text-xs mt-1">
                    Per relay contribution
                  </p>
                </div>
                <div className="bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-lg p-4">
                  <p className="text-text-muted text-xs font-mono uppercase tracking-wider">
                    Halving
                  </p>
                  <p className="text-lg font-semibold text-text-primary mt-1">
                    Not yet scheduled
                  </p>
                  <p className="text-text-muted text-xs mt-1">
                    Based on network growth
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: Blockchain */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-quantum-teal">
                <IconChain />
                <h2 className="text-sm font-mono uppercase tracking-wider">
                  Blockchain
                </h2>
              </div>
              {chainData ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <StatCard label="Chain Height" value={chainData.chain_height.toLocaleString()} sub="blocks produced" />
                  <StatCard label="Total QC Mined" value={chainData.balance.toFixed(2)} sub={`${(chainData.balance / 21000000 * 100).toFixed(4)}% of supply`} />
                  <StatCard label="Max Supply" value="21,000,000" sub="QC hard cap" />
                  <StatCard label="Remaining" value={(21000000 - chainData.balance).toLocaleString()} sub="QC still to mine" />
                  <StatCard label="Block Reward" value="0.5 QC" sub="per 30 seconds" />
                  <StatCard label="Blocks/Day" value="2,880" sub="24h x 120 blocks/hr" />
                  <StatCard label="QC/Day" value="1,440" sub="mining output" />
                  <StatCard label="Node" value="ONLINE" sub="VPS Amsterdam" />
                </div>
              ) : (
                <div className="bg-bg-card border border-[rgba(212,168,83,0.2)] rounded-lg p-4 mb-3">
                  <p className="text-voice-warm text-xs font-mono">
                    Connecting to blockchain node...
                  </p>
                </div>
              )}
            </section>

            {/* Section 4b: Gold Oracle */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-voice-gold">
                <IconChain />
                <h2 className="text-sm font-mono uppercase tracking-wider">
                  Gold Oracle
                </h2>
              </div>
              {goldOracle ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <StatCard
                    label="USD / gram"
                    value={`$${goldOracle.price_usd_per_gram.toFixed(2)}`}
                    sub={`$${goldOracle.price_usd_per_troy_ounce.toFixed(2)}/oz`}
                  />
                  <StatCard
                    label="Sources Active"
                    value={String(goldOracle.sources_used.length)}
                    sub={goldOracle.sources_used.join(" + ") || "none"}
                  />
                  <StatCard
                    label="Sources Failed"
                    value={String(goldOracle.sources_failed.length)}
                    sub={goldOracle.sources_failed.join(" + ") || "none"}
                  />
                  <StatCard
                    label="Method"
                    value={goldOracle.method}
                    sub={new Date(goldOracle.timestamp).toLocaleTimeString()}
                  />
                  <StatCard
                    label="Floor Peg"
                    value="0.01 g / QC"
                    sub="protocol guarantee"
                  />
                  <StatCard
                    label="Max Supply @ Peg"
                    value="210,000 g"
                    sub="21M QC x 0.01"
                  />
                  <StatCard
                    label="Endpoint"
                    value="/v1/price"
                    sub="speaq-gold-feed"
                  />
                  <StatCard
                    label="Signed"
                    value="v1.1"
                    sub="dilithium roadmap"
                  />
                </div>
              ) : (
                <div className="bg-bg-card border border-[rgba(212,168,83,0.2)] rounded-lg p-4 mb-3">
                  <p className="text-voice-warm text-xs font-mono">
                    Oracle unreachable. Check speaq-gold-feed on Cloud Run.
                  </p>
                </div>
              )}
            </section>

            {/* Section 5: Network */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-voice-gold">
                <IconNetwork />
                <h2 className="text-sm font-mono uppercase tracking-wider">
                  Network
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                <StatCard
                  label="Connected Clients"
                  value={s.network.connectedClients}
                  sub="WebSocket"
                />
                <StatCard
                  label="Registered Keys"
                  value={s.network.registeredKeys}
                  sub="Kyber public keys"
                />
                <StatCard
                  label="Messages Relayed"
                  value={s.network.totalMessagesRelayed}
                  sub="Total"
                />
                <StatCard
                  label="Offline Queued"
                  value={s.network.offlineQueued}
                  sub="Pending delivery"
                />
                <StatCard
                  label="Uptime"
                  value={formatUptime(s.network.uptimeSeconds)}
                  sub={`Since ${new Date(s.network.serverStartedAt).toLocaleDateString()}`}
                />
              </div>
            </section>
            {/* Section 6: System Health */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-quantum-teal">
                <IconRefresh spinning={false} />
                <h2 className="text-sm font-mono uppercase tracking-wider">
                  System Health
                </h2>
              </div>

              {/* Current Status */}
              {healthLog.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                  <StatCard label="Last Check" value={new Date(healthLog[0].timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })} sub={healthLog[0].source} />
                  <StatCard label="Node" value={healthLog[0].node ? "OK" : "DOWN"} sub={healthLog[0].node ? "Healthy" : "Alert"} />
                  <StatCard label="Stats Server" value={healthLog[0].stats ? "OK" : "DOWN"} sub={healthLog[0].stats ? "Healthy" : "Alert"} />
                  <StatCard label="Relay" value={healthLog[0].relay ? "OK" : "DOWN"} sub={`${healthLog[0].relayClients || 0} clients`} />
                  <StatCard label="Memory" value={healthLog[0].memFreeMB ? `${healthLog[0].memFreeMB}MB` : "-"} sub="Free" />
                </div>
              )}

              {/* Incidents */}
              {incidents.length > 0 && (
                <div className="bg-bg-card border border-resistance-red/20 rounded-lg p-4 mb-4">
                  <p className="text-resistance-red text-xs font-mono uppercase tracking-wider mb-3">
                    Recent Incidents ({incidents.length})
                  </p>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {incidents.slice(0, 20).map((inc) => (
                      <div key={inc.id} className="flex items-start gap-3 py-2 border-b border-[rgba(100,116,139,0.1)] last:border-0">
                        <div className="w-2 h-2 rounded-full bg-resistance-red mt-1.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text-primary">{inc.issues}</p>
                          <div className="flex gap-3 mt-1 text-[10px] font-mono text-text-muted">
                            <span>{new Date(inc.timestamp).toLocaleString()}</span>
                            <span>{inc.source}</span>
                            {inc.chainHeight !== undefined && <span>Height: {inc.chainHeight}</span>}
                            {inc.memFreeMB !== undefined && <span>Mem: {inc.memFreeMB}MB</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {incidents.length === 0 && (
                <div className="bg-bg-card border border-quantum-teal/20 rounded-lg p-4 mb-4">
                  <p className="text-quantum-teal text-xs font-mono">No incidents recorded. All systems healthy.</p>
                </div>
              )}

              {/* Health Check History */}
              <div className="bg-bg-card border border-[rgba(100,116,139,0.15)] rounded-lg p-4">
                <p className="text-text-muted text-xs font-mono uppercase tracking-wider mb-3">
                  Health Check History ({healthLog.length} entries)
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="text-text-muted border-b border-[rgba(100,116,139,0.1)]">
                        <th className="text-left py-2 pr-3">Time</th>
                        <th className="text-left py-2 pr-3">Source</th>
                        <th className="text-center py-2 pr-3">Node</th>
                        <th className="text-center py-2 pr-3">Stats</th>
                        <th className="text-center py-2 pr-3">Relay</th>
                        <th className="text-right py-2 pr-3">Height</th>
                        <th className="text-right py-2 pr-3">Memory</th>
                        <th className="text-right py-2">Clients</th>
                      </tr>
                    </thead>
                    <tbody>
                      {healthLog.slice(0, 48).map((entry, i) => (
                        <tr key={i} className="border-b border-[rgba(100,116,139,0.05)] hover:bg-[rgba(100,116,139,0.03)]">
                          <td className="py-1.5 pr-3 text-text-secondary">{new Date(entry.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })}</td>
                          <td className="py-1.5 pr-3 text-text-muted">{entry.source}</td>
                          <td className={`py-1.5 pr-3 text-center ${entry.node ? "text-quantum-teal" : "text-resistance-red"}`}>{entry.node ? "OK" : "DOWN"}</td>
                          <td className={`py-1.5 pr-3 text-center ${entry.stats ? "text-quantum-teal" : "text-resistance-red"}`}>{entry.stats ? "OK" : "DOWN"}</td>
                          <td className={`py-1.5 pr-3 text-center ${entry.relay ? "text-quantum-teal" : "text-resistance-red"}`}>{entry.relay ? "OK" : "DOWN"}</td>
                          <td className="py-1.5 pr-3 text-right text-voice-gold">{entry.chainHeight?.toLocaleString()}</td>
                          <td className="py-1.5 pr-3 text-right text-text-secondary">{entry.memFreeMB ? `${entry.memFreeMB}MB` : "-"}</td>
                          <td className="py-1.5 text-right text-text-secondary">{entry.relayClients ?? "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[rgba(100,116,139,0.15)] mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between text-text-muted text-xs font-mono">
          <span>SPEAQ Network v0.1.0</span>
          <span>Auto-refresh: 30s</span>
        </div>
      </footer>
    </div>
  );
}
