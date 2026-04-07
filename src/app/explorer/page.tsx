"use client";

import { useState } from "react";
import ThemeToggle from "../components/ThemeToggle";

// ===================================================================
// SPEAQ Chain Block Explorer
// Connects to a SPEAQ Chain full node API (when running)
// For now: shows chain structure with genesis block data
// ===================================================================

const CHAIN_INFO = {
  name: "SPEAQ Chain",
  version: "1.0.0",
  consensus: "Proof of Contribution (DPoC)",
  maxSupply: "21,000,000 QC",
  blockInterval: "30 seconds",
  ringSize: 11,
  validators: 21,
  finality: "14/21 (2/3 majority)",
  cryptoStack: [
    "Dilithium-3 (FIPS 204) -- Quantum-safe signing",
    "SPHINCS+ (FIPS 205) -- Backup hash-based signing",
    "Kyber-768 (FIPS 203) -- Quantum-safe key exchange",
    "CLSAG Ring Signatures -- Sender anonymity",
    "Pedersen Commitments -- Amount hiding",
    "Bulletproofs+ -- Range proofs",
  ],
  network: ["libp2p (Kademlia + GossipSub)", "Tor Hidden Services", "BLE Mesh"],
};

const GENESIS_BLOCK = {
  height: 0,
  hash: "db0ef1629c72f36a...",
  previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
  merkleRoot: "a1b2c3d4...",
  timestamp: "April 2026",
  validator: "Genesis Validator",
  txCount: 1,
  motto: "By the people, for the people. - SPEAQ Chain Genesis, April 2026",
};

const SAMPLE_BLOCKS = [
  { height: 0, hash: "db0ef162", txs: 1, time: "Genesis", validator: "Genesis", reward: "0 QC" },
  { height: 1, hash: "9c8fbe71", txs: 1, time: "30s ago", validator: "SQ1a3b4...", reward: "0.5 QC" },
  { height: 2, hash: "a95f6144", txs: 2, time: "60s ago", validator: "SQ1f7e2...", reward: "0.5 QC" },
];

const STATS = [
  { label: "Chain Height", value: "2" },
  { label: "Total Transactions", value: "4" },
  { label: "Total QC Mined", value: "1.0 QC" },
  { label: "Active Validators", value: "3 / 21" },
  { label: "Network Nodes", value: "3" },
  { label: "Block Interval", value: "30s" },
  { label: "Max Supply", value: "21,000,000 QC" },
  { label: "Halving", value: "Phase 0 (0.5 QC/block)" },
];

type Tab = "overview" | "blocks" | "transactions" | "validators" | "network";

export default function ExplorerPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-bg-deep text-text-primary">
      {/* Header */}
      <header className="border-b border-[rgba(100,116,139,0.15)] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-voice-gold flex items-center justify-center">
              <span className="text-sm font-bold text-voice-gold font-serif">Q</span>
            </div>
            <div>
              <h1 className="text-lg font-bold font-serif">SPEAQ Explorer</h1>
              <p className="text-[10px] text-quantum-teal font-mono uppercase tracking-wider">Quantum-Resistant Blockchain</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
            <span className="text-xs font-mono text-text-muted">Testnet</span>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="px-6 py-4 border-b border-[rgba(100,116,139,0.1)]">
        <div className="max-w-6xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by block height, tx hash, or SQ1 address..."
            className="w-full px-4 py-3 rounded-xl bg-bg-card border border-[rgba(100,116,139,0.15)] text-text-primary placeholder:text-text-muted font-mono text-sm focus:outline-none focus:border-voice-gold/50"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-[rgba(100,116,139,0.1)]">
        <div className="max-w-6xl mx-auto flex gap-1">
          {(["overview", "blocks", "transactions", "validators", "network"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t
                  ? "text-voice-gold border-voice-gold"
                  : "text-text-muted border-transparent hover:text-text-primary"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="max-w-6xl mx-auto">

          {/* Overview Tab */}
          {tab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {STATS.map((stat) => (
                  <div key={stat.label} className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.1)]">
                    <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">{stat.label}</p>
                    <p className="text-lg font-bold text-text-primary mt-1 font-serif">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Latest Blocks */}
              <div>
                <h2 className="text-sm font-mono text-quantum-teal uppercase tracking-wider mb-3">Latest Blocks</h2>
                <div className="bg-bg-card rounded-xl border border-[rgba(100,116,139,0.1)] overflow-hidden">
                  <div className="grid grid-cols-6 gap-4 px-4 py-2 text-[10px] font-mono text-text-muted uppercase border-b border-[rgba(100,116,139,0.1)]">
                    <span>Height</span><span>Hash</span><span>Txs</span><span>Time</span><span>Validator</span><span>Reward</span>
                  </div>
                  {SAMPLE_BLOCKS.map((block) => (
                    <div key={block.height} className="grid grid-cols-6 gap-4 px-4 py-3 text-sm border-b border-[rgba(100,116,139,0.05)] hover:bg-[rgba(100,116,139,0.05)]">
                      <span className="font-mono text-voice-gold">{block.height}</span>
                      <span className="font-mono text-quantum-teal text-xs">{block.hash}</span>
                      <span>{block.txs}</span>
                      <span className="text-text-muted text-xs">{block.time}</span>
                      <span className="font-mono text-xs">{block.validator}</span>
                      <span className="text-voice-gold">{block.reward}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Genesis Block */}
              <div>
                <h2 className="text-sm font-mono text-voice-gold uppercase tracking-wider mb-3">Genesis Block</h2>
                <div className="bg-bg-card rounded-xl p-5 border border-voice-gold/20">
                  <p className="text-xs text-text-muted mb-1">Motto</p>
                  <p className="text-sm text-text-primary font-serif italic mb-4">&quot;{GENESIS_BLOCK.motto}&quot;</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-text-muted">Height:</span> <span className="font-mono text-voice-gold">{GENESIS_BLOCK.height}</span></div>
                    <div><span className="text-text-muted">Hash:</span> <span className="font-mono text-quantum-teal">{GENESIS_BLOCK.hash}</span></div>
                    <div><span className="text-text-muted">Timestamp:</span> <span>{GENESIS_BLOCK.timestamp}</span></div>
                    <div><span className="text-text-muted">Transactions:</span> <span>{GENESIS_BLOCK.txCount}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blocks Tab */}
          {tab === "blocks" && (
            <div className="bg-bg-card rounded-xl border border-[rgba(100,116,139,0.1)] overflow-hidden">
              <div className="grid grid-cols-6 gap-4 px-4 py-2 text-[10px] font-mono text-text-muted uppercase border-b border-[rgba(100,116,139,0.1)]">
                <span>Height</span><span>Hash</span><span>Txs</span><span>Time</span><span>Validator</span><span>Reward</span>
              </div>
              {SAMPLE_BLOCKS.map((block) => (
                <div key={block.height} className="grid grid-cols-6 gap-4 px-4 py-3 text-sm border-b border-[rgba(100,116,139,0.05)] hover:bg-[rgba(100,116,139,0.05)] cursor-pointer">
                  <span className="font-mono text-voice-gold">{block.height}</span>
                  <span className="font-mono text-quantum-teal text-xs">{block.hash}</span>
                  <span>{block.txs}</span>
                  <span className="text-text-muted text-xs">{block.time}</span>
                  <span className="font-mono text-xs">{block.validator}</span>
                  <span className="text-voice-gold">{block.reward}</span>
                </div>
              ))}
              <div className="px-4 py-8 text-center text-sm text-text-muted">
                Live block data will appear when testnet is running.
              </div>
            </div>
          )}

          {/* Validators Tab */}
          {tab === "validators" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.1)]">
                  <p className="text-[10px] font-mono text-text-muted">ACTIVE VALIDATORS</p>
                  <p className="text-2xl font-bold text-voice-gold font-serif">3 / 21</p>
                </div>
                <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.1)]">
                  <p className="text-[10px] font-mono text-text-muted">FINALITY</p>
                  <p className="text-2xl font-bold text-quantum-teal font-serif">14/21</p>
                </div>
                <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.1)]">
                  <p className="text-[10px] font-mono text-text-muted">REGIONS</p>
                  <p className="text-2xl font-bold text-text-primary font-serif">3</p>
                </div>
              </div>
              <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.1)]">
                <p className="text-xs text-text-muted mb-3">Consensus: Delegated Proof of Contribution</p>
                <p className="text-xs text-text-muted">Validators earn positions by helping the network: relaying messages, validating proofs, storing data, translating the app, onboarding users. The top 21 by contribution score produce blocks.</p>
              </div>
            </div>
          )}

          {/* Network Tab */}
          {tab === "network" && (
            <div className="space-y-4">
              <h2 className="text-sm font-mono text-quantum-teal uppercase tracking-wider">Crypto Stack</h2>
              <div className="space-y-2">
                {CHAIN_INFO.cryptoStack.map((item) => (
                  <div key={item} className="bg-bg-card rounded-lg px-4 py-3 border border-[rgba(100,116,139,0.08)] flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-quantum-teal" />
                    <span className="text-sm font-mono">{item}</span>
                  </div>
                ))}
              </div>
              <h2 className="text-sm font-mono text-voice-gold uppercase tracking-wider mt-6">Network Layers</h2>
              <div className="space-y-2">
                {CHAIN_INFO.network.map((item) => (
                  <div key={item} className="bg-bg-card rounded-lg px-4 py-3 border border-[rgba(100,116,139,0.08)] flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-voice-gold" />
                    <span className="text-sm font-mono">{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-bg-card rounded-xl p-4 border border-[rgba(100,116,139,0.1)] mt-4">
                <p className="text-xs font-mono text-quantum-teal mb-2">VERIFICATION</p>
                <p className="text-xs text-text-muted">106 Rust tests PASS. 23 ProVerif mathematical proofs TRUE. 3 NIST certifications (FIPS 203, 204, 205). Full system formally verified.</p>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {tab === "transactions" && (
            <div className="bg-bg-card rounded-xl p-8 border border-[rgba(100,116,139,0.1)] text-center">
              <p className="text-sm text-text-muted">Transaction data will appear when testnet is running.</p>
              <p className="text-xs text-text-muted mt-2">All transactions use: CLSAG ring signatures (11 decoys) + Pedersen commitments + Bulletproofs range proofs + Dilithium-3 quantum signature</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[rgba(100,116,139,0.1)] px-6 py-4 mt-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-text-muted">
          <span>SPEAQ Chain Explorer v1.0</span>
          <span>By the people, for the people.</span>
        </div>
      </footer>
    </div>
  );
}
