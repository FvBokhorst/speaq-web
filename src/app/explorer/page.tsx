"use client";

import { useState, useEffect } from "react";
import ThemeToggle from "../components/ThemeToggle";

const NODE_API = "/api/admin/chain";

interface ChainData {
  chain_height: number;
  balance: number;
  balance_sparks: number;
  genesis_hash: string;
  connected_peers: number;
  version: string;
}

export default function ExplorerPage() {
  const [tab, setTab] = useState<"overview" | "network">("overview");
  const [chain, setChain] = useState<ChainData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChain = () => {
      fetch(NODE_API)
        .then((r) => r.json())
        .then((d: ChainData) => { setChain(d); setLoading(false); })
        .catch(() => setLoading(false));
    };
    fetchChain();
    const interval = setInterval(fetchChain, 30000);
    return () => clearInterval(interval);
  }, []);

  const maxSupply = 21_000_000;
  const totalMined = chain ? chain.balance : 0;
  const percentMined = chain ? ((chain.balance / maxSupply) * 100).toFixed(6) : "0";
  const remaining = maxSupply - totalMined;
  const blockReward = 0.5;
  const blocksPerDay = (24 * 60 * 60) / 30;
  const qcPerDay = blocksPerDay * blockReward;

  return (
    <div className="min-h-screen bg-bg-deep text-text-primary">
      {/* Header */}
      <header className="border-b border-[rgba(100,116,139,0.15)] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3">
              <img src="/speaq-logo.png" alt="SPEAQ" width="32" height="32" className="rounded-full" />
              <div>
                <h1 className="text-lg font-bold font-[family-name:var(--font-playfair)]">SPEAQ Explorer</h1>
                <p className="text-[10px] text-quantum-teal font-[family-name:var(--font-jetbrains)] uppercase tracking-wider">Quantum-Resistant Blockchain</p>
              </div>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className={`w-2 h-2 rounded-full ${chain ? "bg-[#22C55E]" : "bg-resistance-red"}`} />
            <span className="text-xs font-[family-name:var(--font-jetbrains)] text-text-muted">{chain ? "Live" : "Offline"}</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-6 border-b border-[rgba(100,116,139,0.1)]">
        <div className="max-w-5xl mx-auto flex gap-1">
          {(["overview", "network"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t ? "text-voice-gold border-voice-gold" : "text-text-muted border-transparent hover:text-text-primary"}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="max-w-5xl mx-auto">

          {loading && (
            <div className="text-center py-12"><p className="text-sm text-text-muted">Connecting to SPEAQ Chain node...</p></div>
          )}

          {!loading && tab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Chain Height", value: chain ? chain.chain_height.toLocaleString() : "-" },
                  { label: "Total QC Distributed", value: chain ? `${chain.balance.toFixed(1)} QC` : "-" },
                  { label: "Supply Distributed", value: chain ? `${percentMined}%` : "-" },
                  { label: "Remaining", value: chain ? `${remaining.toLocaleString()} QC` : "-" },
                  { label: "Block Reward", value: `${blockReward} QC` },
                  { label: "Block Interval", value: "30 seconds" },
                  { label: "QC per Day", value: `~${qcPerDay.toFixed(0)} QC` },
                  { label: "Max Supply", value: "21,000,000 QC" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.1)]">
                    <p className="text-[10px] font-[family-name:var(--font-jetbrains)] text-text-muted uppercase tracking-wider">{stat.label}</p>
                    <p className="text-lg font-bold text-text-primary mt-1 font-[family-name:var(--font-playfair)]">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Supply Progress */}
              <div className="bg-bg-card rounded-xl p-5 border border-[rgba(100,116,139,0.1)]">
                <p className="text-[10px] font-[family-name:var(--font-jetbrains)] text-quantum-teal uppercase tracking-wider mb-3">Supply Distribution</p>
                <div className="w-full h-4 rounded-full bg-bg-elevated overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-voice-gold to-quantum-teal transition-all"
                    style={{ width: `${Math.max(parseFloat(percentMined), 0.5)}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-text-muted mt-2">
                  <span>{totalMined.toFixed(1)} QC distributed</span>
                  <span>{remaining.toLocaleString()} QC remaining</span>
                </div>
              </div>

              {/* Halving Schedule */}
              <div className="bg-bg-card rounded-xl p-5 border border-[rgba(100,116,139,0.1)]">
                <p className="text-[10px] font-[family-name:var(--font-jetbrains)] text-voice-gold uppercase tracking-wider mb-3">Halving Schedule</p>
                <div className="space-y-2">
                  {[
                    { phase: 1, reward: "0.50 QC", target: "2,100,000 QC", status: totalMined < 2100000 ? "active" : "done" },
                    { phase: 2, reward: "0.25 QC", target: "4,200,000 QC", status: totalMined >= 2100000 && totalMined < 4200000 ? "active" : totalMined >= 4200000 ? "done" : "future" },
                    { phase: 3, reward: "0.125 QC", target: "6,300,000 QC", status: "future" },
                    { phase: 4, reward: "0.0625 QC", target: "8,400,000 QC", status: "future" },
                  ].map((h) => (
                    <div key={h.phase} className={`flex items-center justify-between px-4 py-2 rounded-lg ${h.status === "active" ? "bg-voice-gold/10 border border-voice-gold/20" : "bg-bg-elevated"}`}>
                      <span className="text-xs font-[family-name:var(--font-jetbrains)]">Phase {h.phase}</span>
                      <span className="text-xs text-text-muted">{h.reward}/block</span>
                      <span className="text-xs text-text-muted">until {h.target}</span>
                      <span className={`text-[10px] font-[family-name:var(--font-jetbrains)] ${h.status === "active" ? "text-voice-gold" : h.status === "done" ? "text-quantum-teal" : "text-text-muted"}`}>
                        {h.status === "active" ? "ACTIVE" : h.status === "done" ? "DONE" : "UPCOMING"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Genesis Block */}
              <div>
                <p className="text-[10px] font-[family-name:var(--font-jetbrains)] text-voice-gold uppercase tracking-wider mb-3">Genesis Block</p>
                <div className="bg-bg-card rounded-xl p-5 border border-voice-gold/20">
                  <p className="text-sm text-text-primary font-[family-name:var(--font-playfair)] italic mb-4">"By the people, for the people."</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div><span className="text-text-muted">Height:</span> <span className="font-[family-name:var(--font-jetbrains)] text-voice-gold">0</span></div>
                    <div><span className="text-text-muted">Hash:</span> <span className="font-[family-name:var(--font-jetbrains)] text-quantum-teal break-all">{chain?.genesis_hash || "-"}</span></div>
                    <div><span className="text-text-muted">Node Version:</span> <span className="font-[family-name:var(--font-jetbrains)]">{chain?.version || "-"}</span></div>
                    <div><span className="text-text-muted">Connected Peers:</span> <span className="font-[family-name:var(--font-jetbrains)]">{chain?.connected_peers ?? "-"}</span></div>
                  </div>
                </div>
              </div>

              {/* Token Allocation */}
              <div className="bg-bg-card rounded-xl p-5 border border-[rgba(100,116,139,0.1)]">
                <p className="text-[10px] font-[family-name:var(--font-jetbrains)] text-quantum-teal uppercase tracking-wider mb-3">Token Allocation</p>
                <div className="space-y-2">
                  {[
                    { label: "Contribution Rewards", pct: 85, color: "bg-voice-gold" },
                    { label: "Freedom Fund", pct: 5, color: "bg-quantum-teal" },
                    { label: "Founders (4yr vest)", pct: 5, color: "bg-text-muted" },
                    { label: "Development", pct: 3, color: "bg-text-secondary" },
                    { label: "Early Contributors", pct: 2, color: "bg-voice-warm" },
                  ].map((a) => (
                    <div key={a.label} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-sm ${a.color} shrink-0`} />
                      <span className="text-xs text-text-primary flex-1">{a.label}</span>
                      <span className="text-xs font-[family-name:var(--font-jetbrains)] text-text-muted">{a.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!loading && tab === "network" && (
            <div className="space-y-6">
              <p className="text-[10px] font-[family-name:var(--font-jetbrains)] text-quantum-teal uppercase tracking-wider">Cryptographic Stack</p>
              <div className="space-y-2">
                {[
                  { name: "AES-256-GCM (NIST)", desc: "Symmetric encryption for text messages and payment payloads. Active and verified standard." },
                  { name: "Double Ratchet Protocol", desc: "Forward secrecy - fresh derived key per message. Active." },
                  { name: "Custom lattice key exchange (NOT FIPS 203)", desc: "Kyber-768-inspired homemade scheme. NOT NIST-validated. Migration to verified FIPS 203 library on roadmap." },
                  { name: "ECDSA P-256 (NIST, pre-quantum)", desc: "Signed key exchange between contacts. Active. Quantum-vulnerable - replaced by post-quantum signatures on roadmap." },
                  { name: "SHA-256 (NIST)", desc: "Cryptographic hashing for addresses, witness records, block links. Active." },
                  { name: "HMAC-SHA256 (NIST)", desc: "Server-side mining receipt tags. Note: relay-internal only, not user-signed double-proof." },
                  { name: "WebRTC DTLS-SRTP", desc: "Voice and video media encryption (standard). Note: signaling SDP/ICE itself is plaintext via relay." },
                  { name: "[ROADMAP] FIPS 203 Kyber-768", desc: "Replacement for the custom lattice scheme. Not yet implemented." },
                  { name: "[ROADMAP] FIPS 204 ML-DSA-65", desc: "Wallet transaction signatures. Not yet implemented." },
                  { name: "[ROADMAP] FIPS 205 SPHINCS+", desc: "Hash-based backup signatures. Not yet implemented." },
                ].map((item) => (
                  <div key={item.name} className="bg-bg-card rounded-lg px-4 py-3 border border-[rgba(100,116,139,0.08)]">
                    <p className="text-sm font-[family-name:var(--font-jetbrains)] text-quantum-teal">{item.name}</p>
                    <p className="text-xs text-text-muted mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>

              <p className="text-[10px] font-[family-name:var(--font-jetbrains)] text-voice-gold uppercase tracking-wider mt-6">Audit Status (2026-04-25)</p>
              <div className="bg-bg-card rounded-xl p-4 border border-voice-gold/20">
                <p className="text-xs text-text-muted">ProVerif protocol models exist in the source tree but have not been independently verified against the running implementation. NIST certification claims (FIPS 203/204/205) describe planned state, not current implementation. An external security audit by a specialized firm has NOT been performed; this is on the open roadmap.</p>
              </div>

              <p className="text-[10px] font-[family-name:var(--font-jetbrains)] text-voice-gold uppercase tracking-wider mt-6">Network Infrastructure</p>
              <div className="space-y-2">
                {[
                  "libp2p (GossipSub + Kademlia DHT)",
                  "Noise Protocol (node-to-node encryption)",
                  "RocksDB (persistent blockchain storage)",
                  "Google Cloud Platform (europe-west1 + us-west1)",
                ].map((item) => (
                  <div key={item} className="bg-bg-card rounded-lg px-4 py-3 border border-[rgba(100,116,139,0.08)] flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-voice-gold shrink-0" />
                    <span className="text-sm font-[family-name:var(--font-jetbrains)]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[rgba(100,116,139,0.1)] px-6 py-4 mt-12">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-text-muted">
          <a href="/" className="hover:text-voice-gold transition-colors">Back to SPEAQ</a>
          <span className="font-[family-name:var(--font-playfair)] italic">By the people, for the people.</span>
        </div>
      </footer>
    </div>
  );
}
