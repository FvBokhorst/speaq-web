"use client";

import { useState, useEffect, useCallback } from "react";
import ThemeToggle from "../components/ThemeToggle";

// --- Constants ---

const STATS_API = "/api/admin/stats";
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

// --- Helpers ---

async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Pre-computed SHA-256 hash of admin PIN
const EXPECTED_HASH =
  "8e0d3608677364333b81bcdd3693af27df33f93b6bbf743d82b8e612b0a828de";

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
    } finally {
      setLoading(false);
    }
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
              <div className="bg-bg-card border border-[rgba(212,168,83,0.2)] rounded-lg p-4 mb-3">
                <p className="text-voice-warm text-xs font-mono">
                  Node not connected -- blockchain stats unavailable
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Chain Height" value="--" sub="Node offline" />
                <StatCard
                  label="Avg Block Time"
                  value="30s"
                  sub="Target"
                />
                <StatCard
                  label="Total Txs"
                  value="--"
                  sub="Node offline"
                />
                <StatCard
                  label="Blocks/Day"
                  value="--"
                  sub="Node offline"
                />
              </div>
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
