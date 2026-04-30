"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Apple Guideline 1.2 - Moderator dashboard.
 *
 * Lists open abuse reports from Firestore, lets a moderator review the
 * recipient's decrypted view of the offending message, and choose:
 *   - Ban the offending SPEAQ ID (writes to `denied_speaq_ids`; the relay
 *     reads this list at AUTH and rejects banned IDs from the network).
 *   - Dismiss the report (no further action).
 *   - Defer (keep open for follow-up).
 *
 * Authentication mirrors the existing /admin page: SHA-256 hashed PIN
 * compared client-side against NEXT_PUBLIC_ADMIN_PIN_HASH, then PIN is
 * sent to the Next.js proxy /api/admin/abuse which forwards to the relay
 * with the relay-side admin secret.
 */

const EXPECTED_HASH = process.env.NEXT_PUBLIC_ADMIN_PIN_HASH || "";

async function hashPin(pin: string): Promise<string> {
  const enc = new TextEncoder().encode(pin);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

interface AbuseReport {
  id: string;
  reporterSpeaqId: string;
  reportedSpeaqId: string;
  reason: string;
  comment: string;
  messageContent: string;
  messageId: string | null;
  source: string;
  status: "open" | "actioned" | "dismissed";
  createdAt: number;
  actionedAt: number | null;
  actionedBy: string | null;
  resolution: null | "ban" | "dismiss" | "defer";
  language: string | null;
  appVersion: string | null;
}

function shortId(id: string): string {
  if (!id) return "(unknown)";
  if (id.length <= 16) return id;
  return id.slice(0, 8) + "..." + id.slice(-6);
}

function relativeTime(ms: number): string {
  if (!ms) return "?";
  const diff = Date.now() - ms;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function AdminAbusePage() {
  const [pin, setPin] = useState("");
  const [storedPin, setStoredPin] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState("");

  const [reports, setReports] = useState<AbuseReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"open" | "actioned" | "dismissed">("open");
  const [actioning, setActioning] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? sessionStorage.getItem("speaq-admin-pin") : null;
    if (saved) {
      setStoredPin(saved);
      setAuthenticated(true);
    }
    setAuthChecked(true);
  }, []);

  const fetchReports = useCallback(async () => {
    if (!storedPin) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/abuse?pin=${encodeURIComponent(storedPin)}&status=${filter}`);
      const body = await res.json();
      if (!res.ok || !body.ok) {
        setError(body.error || "Failed to load reports");
        setReports([]);
      } else {
        setReports(Array.isArray(body.reports) ? body.reports : []);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [storedPin, filter]);

  useEffect(() => {
    if (authenticated) fetchReports();
  }, [authenticated, fetchReports]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!EXPECTED_HASH) {
      setError("Admin PIN hash not configured");
      return;
    }
    const got = await hashPin(pin);
    if (got !== EXPECTED_HASH) {
      setError("Invalid PIN");
      return;
    }
    sessionStorage.setItem("speaq-admin-pin", pin);
    setStoredPin(pin);
    setAuthenticated(true);
    setPin("");
  }

  function handleLogout() {
    sessionStorage.removeItem("speaq-admin-pin");
    setStoredPin("");
    setAuthenticated(false);
    setReports([]);
  }

  async function action(reportId: string, action: "ban" | "dismiss" | "defer", banReason?: string) {
    setActioning(reportId);
    setError("");
    setActionMsg("");
    try {
      const res = await fetch("/api/admin/abuse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: storedPin, action, reportId, banReason, actionedBy: "admin" }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        setError(body.error || "Action failed");
      } else {
        setActionMsg(`Report ${reportId.slice(0, 8)} -> ${action}`);
        // Refresh the list and trigger relay deny-list refresh on ban.
        if (action === "ban") {
          await fetch("/api/admin/abuse", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pin: storedPin, action: "refresh-deny-list" }),
          }).catch(() => undefined);
        }
        fetchReports();
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setActioning(null);
    }
  }

  if (!authChecked) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-bg-deep text-text-muted">
        Loading...
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-bg-deep px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-bg-card rounded-2xl p-8 border border-[rgba(100,116,139,0.15)]">
          <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">SPEAQ Admin - Abuse</h1>
          <p className="text-xs text-text-muted mb-6">Apple Guideline 1.2 moderator dashboard</p>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Admin PIN"
            className="w-full px-4 py-3 rounded-xl bg-bg-elevated text-text-primary text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-voice-gold"
          />
          {error && <p className="text-xs text-[#E24B4A] mb-3">{error}</p>}
          <button type="submit" className="w-full bg-voice-gold text-bg-deep font-semibold py-3 rounded-xl">
            Sign in
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-deep text-text-primary">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold mb-1">Abuse reports</h1>
            <p className="text-xs text-text-muted">Apple Guideline 1.2 moderator dashboard. 24-hour response SLA.</p>
          </div>
          <button onClick={handleLogout} className="text-xs text-voice-gold underline">Sign out</button>
        </div>

        <div className="flex gap-2 mb-4">
          {(["open", "actioned", "dismissed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider ${filter === s ? "bg-voice-gold text-bg-deep" : "bg-bg-elevated text-text-muted"}`}
            >
              {s}
            </button>
          ))}
          <button
            onClick={fetchReports}
            disabled={loading}
            className="ml-auto px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider bg-bg-elevated text-text-muted"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {error && <p className="text-xs text-[#E24B4A] mb-3">{error}</p>}
        {actionMsg && <p className="text-xs text-quantum-teal mb-3">{actionMsg}</p>}

        {reports.length === 0 && !loading && (
          <div className="bg-bg-card rounded-xl p-8 text-center text-sm text-text-muted border border-[rgba(100,116,139,0.15)]">
            No reports in this bucket.
          </div>
        )}

        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="bg-bg-card rounded-xl border border-[rgba(100,116,139,0.15)] p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs font-mono text-text-muted">{r.id.slice(0, 8)} - {relativeTime(r.createdAt)} - {r.source}</p>
                  <p className="text-sm text-text-primary mt-1">
                    Reason: <span className="text-voice-gold font-semibold">{r.reason}</span>
                  </p>
                </div>
                {r.status !== "open" && (
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">{r.status}</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div>
                  <p className="text-text-muted mb-1">Reported (target)</p>
                  <p className="font-mono text-text-primary break-all">{r.reportedSpeaqId}</p>
                </div>
                <div>
                  <p className="text-text-muted mb-1">Reporter</p>
                  <p className="font-mono text-text-primary break-all">{shortId(r.reporterSpeaqId)}</p>
                </div>
              </div>
              {r.messageContent && (
                <div className="mb-3">
                  <p className="text-text-muted text-xs mb-1">Message (consent-based share by recipient):</p>
                  <p className="text-sm text-text-primary bg-bg-elevated p-3 rounded-lg break-words whitespace-pre-wrap">{r.messageContent}</p>
                </div>
              )}
              {r.comment && (
                <div className="mb-3">
                  <p className="text-text-muted text-xs mb-1">Reporter comment:</p>
                  <p className="text-sm text-text-secondary italic">{r.comment}</p>
                </div>
              )}
              {r.status === "open" && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => action(r.id, "ban", `${r.reason}: ${r.comment || "(no comment)"}`)}
                    disabled={actioning === r.id}
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold bg-[#E24B4A] text-white disabled:opacity-60"
                  >
                    {actioning === r.id ? "..." : "Ban + remove from network"}
                  </button>
                  <button
                    onClick={() => action(r.id, "dismiss")}
                    disabled={actioning === r.id}
                    className="px-3 py-2 rounded-lg text-sm font-semibold bg-bg-elevated text-text-primary disabled:opacity-60"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => action(r.id, "defer")}
                    disabled={actioning === r.id}
                    className="px-3 py-2 rounded-lg text-sm font-semibold bg-bg-elevated text-text-muted disabled:opacity-60"
                  >
                    Defer
                  </button>
                </div>
              )}
              {r.status !== "open" && r.actionedBy && (
                <p className="text-xs text-text-muted mt-2">
                  {r.resolution} by {r.actionedBy} - {relativeTime(r.actionedAt || 0)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
