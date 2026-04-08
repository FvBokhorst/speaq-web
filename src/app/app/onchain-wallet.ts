// SPEAQ On-Chain Wallet -- ML-DSA-65 (FIPS 204) Sovereign Keys
// Cross-compatible with Rust blockchain node (fips204 crate)
//
// This wallet stores quantum-resistant signing keys locally.
// The keys never leave the device. The blockchain node cannot access them.
// "By the people, for the people."

import { ml_dsa65 } from "@noble/post-quantum/ml-dsa.js";
import { sha256 } from "@noble/hashes/sha2.js";

const ONCHAIN_WALLET_KEY = "speaq_onchain_wallet";

export interface OnChainWallet {
  publicKey: string;   // hex encoded, 1952 bytes
  secretKey: string;   // hex encoded, 4032 bytes
  address: string;     // SQ1 + hex (SHA-256 of public key)
  createdAt: number;
}

// Convert Uint8Array to hex
function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Convert hex to Uint8Array
function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

// Derive on-chain address from public key: SHA-256(publicKey)
function deriveAddress(publicKey: Uint8Array): string {
  const hash = sha256(publicKey);
  return "SQ1" + toHex(hash);
}

// Generate a new on-chain wallet (ML-DSA-65 keypair)
export function generateOnChainWallet(): OnChainWallet {
  const seed = new Uint8Array(32);
  crypto.getRandomValues(seed);
  const keys = ml_dsa65.keygen(seed);

  const address = deriveAddress(keys.publicKey);

  const wallet: OnChainWallet = {
    publicKey: toHex(keys.publicKey),
    secretKey: toHex(keys.secretKey),
    address,
    createdAt: Date.now(),
  };

  // Save to localStorage
  localStorage.setItem(ONCHAIN_WALLET_KEY, JSON.stringify(wallet));

  return wallet;
}

// Load existing on-chain wallet from localStorage
export function loadOnChainWallet(): OnChainWallet | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(ONCHAIN_WALLET_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

// Sign a transaction with the on-chain wallet
export function signTransaction(message: Uint8Array, secretKeyHex: string): Uint8Array {
  const sk = fromHex(secretKeyHex);
  // ml_dsa65.sign(message, secretKey) -- message first, then key
  return ml_dsa65.sign(message, sk);
}

// Verify a signature
export function verifySignature(
  message: Uint8Array,
  signature: Uint8Array,
  publicKeyHex: string
): boolean {
  const pk = fromHex(publicKeyHex);
  return ml_dsa65.verify(signature, message, pk);
}

// Get or create on-chain wallet
export function getOrCreateOnChainWallet(): OnChainWallet {
  const existing = loadOnChainWallet();
  if (existing) return existing;
  return generateOnChainWallet();
}
