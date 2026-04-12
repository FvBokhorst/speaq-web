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

// Convert hex to ArrayBuffer (for Web Crypto API compatibility)
function fromHexBuf(hex: string): ArrayBuffer {
  return fromHex(hex).buffer as ArrayBuffer;
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

// Export wallet as encrypted JSON backup
export async function exportWalletBackup(wallet: OnChainWallet, pin: string): Promise<string> {
  const data = JSON.stringify(wallet);
  const pinBytes = new TextEncoder().encode(`SPEAQ-BACKUP:${pin}`);
  const keyMaterial = await crypto.subtle.importKey("raw", pinBytes, "PBKDF2", false, ["deriveKey"]);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: 600000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 } as AesDerivedKeyParams,
    false,
    ["encrypt"] as KeyUsage[]
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv as BufferSource }, key, new TextEncoder().encode(data));
  const backup = {
    v: 1,
    salt: toHex(salt),
    iv: toHex(iv),
    data: toHex(new Uint8Array(encrypted)),
    address: wallet.address,
    createdAt: wallet.createdAt,
  };
  return JSON.stringify(backup);
}

// Import wallet from encrypted JSON backup
export async function importWalletBackup(backupJson: string, pin: string): Promise<OnChainWallet> {
  const backup = JSON.parse(backupJson);
  if (backup.v !== 1) throw new Error("Unsupported backup version");
  const pinBytes = new TextEncoder().encode(`SPEAQ-BACKUP:${pin}`);
  const keyMaterial = await crypto.subtle.importKey("raw", pinBytes, "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: fromHexBuf(backup.salt), iterations: 600000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 } as AesDerivedKeyParams,
    false,
    ["decrypt"] as KeyUsage[]
  );
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromHexBuf(backup.iv) }, key, fromHexBuf(backup.data));
  const wallet: OnChainWallet = JSON.parse(new TextDecoder().decode(decrypted));
  localStorage.setItem(ONCHAIN_WALLET_KEY, JSON.stringify(wallet));
  return wallet;
}

const CHAIN_API = process.env.NEXT_PUBLIC_SPEAQ_NODE_URL || "http://localhost:9334";

// Send an on-chain transaction (signed with sovereign keys)
export async function sendOnChainTransaction(
  wallet: OnChainWallet,
  toAddress: string,
  amount: number
): Promise<{ success: boolean; txId?: string; error?: string }> {
  // Create transaction message
  const txData = JSON.stringify({ from: wallet.address, to: toAddress, amount, timestamp: Date.now() });
  const messageBytes = new TextEncoder().encode(txData);

  // Sign with ML-DSA-65
  const signature = signTransaction(messageBytes, wallet.secretKey);

  // Send to blockchain node
  try {
    const res = await fetch(`${CHAIN_API}/api/transaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: wallet.address,
        to: toAddress,
        amount,
        publicKey: wallet.publicKey,
        signature: toHex(signature),
        message: toHex(messageBytes),
      }),
    });
    const data = await res.json();
    if (res.ok) {
      return { success: true, txId: data.txId };
    }
    return { success: false, error: data.error || "Transaction rejected" };
  } catch (e) {
    return { success: false, error: "Failed to connect to blockchain node" };
  }
}
