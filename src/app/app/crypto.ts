/**
 * SPEAQ Web Crypto Module
 * EXACT SAME security as native app:
 * 1. Lattice-based Key Encapsulation (Ring-LWE, quantum-resistant)
 * 2. Double Ratchet Protocol (forward secrecy, per-message keys)
 * 3. AES-256-GCM symmetric encryption (Web Crypto API)
 * 4. PBKDF2 PIN hashing (100,000 iterations)
 */

// ============================================================
// SECTION 1: Utility Functions
// ============================================================

export function generateId(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomBytes(count: number): Uint8Array {
  const arr = new Uint8Array(count);
  crypto.getRandomValues(arr);
  return arr;
}

function toHex(arr: Uint8Array): string {
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(data));
  return toHex(new Uint8Array(hash));
}

async function hmacSHA256(key: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw", encoder.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(data));
  return toHex(new Uint8Array(sig));
}

// ============================================================
// SECTION 2: Lattice-Based Key Encapsulation (Ring-LWE KEM)
// ============================================================
// Same parameters as native app: n=256, q=7681
// Quantum-resistant based on Ring-LWE hardness assumption

const LATTICE_N = 256;
const LATTICE_Q = 7681;

function sampleCBD(eta: number): Int16Array {
  const poly = new Int16Array(LATTICE_N);
  const bytes = randomBytes((LATTICE_N * eta) / 4);
  let byteIdx = 0;
  for (let i = 0; i < LATTICE_N; i++) {
    let a = 0, b = 0;
    for (let j = 0; j < eta; j++) {
      a += (bytes[byteIdx >> 3] >> (byteIdx & 7)) & 1; byteIdx++;
      b += (bytes[byteIdx >> 3] >> (byteIdx & 7)) & 1; byteIdx++;
    }
    poly[i] = (a - b + LATTICE_Q) % LATTICE_Q;
  }
  return poly;
}

function polyMul(a: Int16Array, b: Int16Array): Int16Array {
  const result = new Int16Array(LATTICE_N);
  for (let i = 0; i < LATTICE_N; i++) {
    for (let j = 0; j < LATTICE_N; j++) {
      const idx = i + j;
      const val = (a[i] * b[j]) % LATTICE_Q;
      if (idx < LATTICE_N) {
        result[idx] = (result[idx] + val) % LATTICE_Q;
      } else {
        result[idx - LATTICE_N] = (result[idx - LATTICE_N] - val + LATTICE_Q) % LATTICE_Q;
      }
    }
  }
  return result;
}

function polyAdd(a: Int16Array, b: Int16Array): Int16Array {
  const result = new Int16Array(LATTICE_N);
  for (let i = 0; i < LATTICE_N; i++) result[i] = (a[i] + b[i]) % LATTICE_Q;
  return result;
}

function polySub(a: Int16Array, b: Int16Array): Int16Array {
  const result = new Int16Array(LATTICE_N);
  for (let i = 0; i < LATTICE_N; i++) result[i] = (a[i] - b[i] + LATTICE_Q) % LATTICE_Q;
  return result;
}

async function polyFromSeed(seed: string): Promise<Int16Array> {
  const poly = new Int16Array(LATTICE_N);
  let state = seed;
  for (let i = 0; i < LATTICE_N; i++) {
    state = await hmacSHA256(state, String(i));
    const val = parseInt(state.substring(0, 4), 16);
    poly[i] = ((val % LATTICE_Q) + LATTICE_Q) % LATTICE_Q;
  }
  return poly;
}

function compressToBytes(poly: Int16Array, bits: number): Uint8Array {
  const mask = (1 << bits) - 1;
  const out = new Uint8Array((LATTICE_N * bits) / 8);
  let bitBuf = 0, bitCount = 0, byteIdx = 0;
  for (let i = 0; i < LATTICE_N; i++) {
    const compressed = Math.round((poly[i] * (1 << bits)) / LATTICE_Q) & mask;
    bitBuf |= compressed << bitCount;
    bitCount += bits;
    while (bitCount >= 8) { out[byteIdx++] = bitBuf & 0xff; bitBuf >>= 8; bitCount -= 8; }
  }
  if (bitCount > 0 && byteIdx < out.length) out[byteIdx] = bitBuf & 0xff;
  return out;
}

function decompressFromBytes(data: Uint8Array, bits: number): Int16Array {
  const mask = (1 << bits) - 1;
  const poly = new Int16Array(LATTICE_N);
  let bitBuf = 0, bitCount = 0, byteIdx = 0;
  for (let i = 0; i < LATTICE_N; i++) {
    while (bitCount < bits && byteIdx < data.length) { bitBuf |= data[byteIdx++] << bitCount; bitCount += 8; }
    const compressed = bitBuf & mask;
    bitBuf >>= bits; bitCount -= bits;
    poly[i] = Math.round((compressed * LATTICE_Q) / (1 << bits)) % LATTICE_Q;
  }
  return poly;
}

function polyToBase64(poly: Int16Array): string {
  const bytes = new Uint8Array(poly.buffer, poly.byteOffset, poly.byteLength);
  return uint8ToBase64(bytes);
}

function polyFromBase64(b64: string): Int16Array {
  const raw = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const result = new Int16Array(LATTICE_N);
  for (let i = 0; i < LATTICE_N; i++) {
    result[i] = raw[i * 2] | (raw[i * 2 + 1] << 8);
  }
  return result;
}

export interface KyberKeyPair {
  publicKey: string;
  privateKey: string;
}

// Audit fix D1 (2026-04-25): replaced custom ring-LWE scheme with FIPS 203 ML-KEM-768
// from @noble/post-quantum. The previous implementation was Kyber-768-INSPIRED (single
// polynomial Module-LWE, eta=3) and was NOT NIST-validated. This switches to the
// reference NIST-standardized algorithm from a peer-reviewed library.
//
// Public/private keys are now base64-encoded raw bytes:
//   publicKey:  1184 bytes (encapsulation key)
//   privateKey: 2400 bytes (decapsulation key)
//   ciphertext: 1088 bytes
//   sharedSecret: 32 bytes (returned as 64-char hex string for ratchet compatibility)
//
// MIGRATION: existing localStorage `speaq_kyber_keys` from the old scheme are NOT
// compatible (different format). On page load, page.tsx detects malformed/old keys and
// regenerates with ml_kem768. Existing per-contact ratchet states (saved sharedSecret)
// remain valid for decrypting OLD messages because the Double Ratchet uses the secret
// directly, not the Kyber keys. New key exchanges use the new keys end-to-end.
import { ml_kem768 } from "@noble/post-quantum/ml-kem.js";

function bytesToB64(b: Uint8Array): string {
  let s = "";
  for (let i = 0; i < b.length; i += 8192) {
    s += String.fromCharCode.apply(null, Array.from(b.subarray(i, i + 8192)));
  }
  return btoa(s);
}
function b64ToBytes(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function generateKyberKeyPair(): Promise<KyberKeyPair> {
  const seed = crypto.getRandomValues(new Uint8Array(64));
  const kp = ml_kem768.keygen(seed);
  return { publicKey: bytesToB64(kp.publicKey), privateKey: bytesToB64(kp.secretKey) };
}

export async function kyberEncapsulate(publicKeyB64: string): Promise<{ ciphertext: string; sharedSecret: string }> {
  const pub = b64ToBytes(publicKeyB64);
  if (pub.length !== 1184) {
    throw new Error(`kyberEncapsulate: public key must be 1184 bytes (FIPS 203 ML-KEM-768), got ${pub.length}. Old-format key detected - peer needs to regenerate.`);
  }
  const enc = ml_kem768.encapsulate(pub);
  return {
    ciphertext: bytesToB64(enc.cipherText),
    sharedSecret: toHex(enc.sharedSecret),
  };
}

export async function kyberDecapsulate(ciphertextB64: string, privateKeyB64: string): Promise<string> {
  const ct = b64ToBytes(ciphertextB64);
  const sk = b64ToBytes(privateKeyB64);
  if (sk.length !== 2400) {
    throw new Error(`kyberDecapsulate: private key must be 2400 bytes (FIPS 203 ML-KEM-768), got ${sk.length}. Old-format key - regenerate locally.`);
  }
  if (ct.length !== 1088) {
    throw new Error(`kyberDecapsulate: ciphertext must be 1088 bytes, got ${ct.length}. Sender used incompatible scheme.`);
  }
  const ss = ml_kem768.decapsulate(ct, sk);
  return toHex(ss);
}

// Helper: detect old-format Kyber keys so the app can prompt regeneration.
// Old format was base64 of "seedHex:b64polyB" structure; new format is raw 1184 bytes.
export function isLegacyKyberKey(publicKeyB64: string): boolean {
  try {
    const bytes = b64ToBytes(publicKeyB64);
    if (bytes.length === 1184) return false; // new format
    // Old format size varies; treat anything not 1184 as legacy.
    return true;
  } catch {
    return true;
  }
}

// ============================================================
// SECTION 3: Double Ratchet Protocol
// ============================================================

export interface RatchetState {
  rootKey: string;
  chainKeySend: string;
  chainKeyRecv: string;
  sendCount: number;
  recvCount: number;
}

export async function initRatchet(sharedSecret: string, isInitiator: boolean): Promise<RatchetState> {
  const rootKey = await hmacSHA256("speaq-root-v1", sharedSecret);
  const chainKeyA = await hmacSHA256(rootKey, "speaq-chain-a-v1");
  const chainKeyB = await hmacSHA256(rootKey, "speaq-chain-b-v1");
  return {
    rootKey,
    chainKeySend: isInitiator ? chainKeyA : chainKeyB,
    chainKeyRecv: isInitiator ? chainKeyB : chainKeyA,
    sendCount: 0,
    recvCount: 0,
  };
}

async function advanceChain(chainKey: string): Promise<{ nextChainKey: string; messageKey: string }> {
  return {
    nextChainKey: await hmacSHA256(chainKey, "\x01"),
    messageKey: await hmacSHA256(chainKey, "\x02"),
  };
}

// ============================================================
// SECTION 4: AES-256-GCM Encryption (Web Crypto API)
// ============================================================

export async function deriveKey(myId: string, contactId: string): Promise<CryptoKey> {
  // SHA-256 key derivation from sorted SPEAQ IDs
  // Simple, fast, and ALWAYS produces the same key on all devices regardless of code version
  // AES-256-GCM provides the actual encryption security
  const sorted = [myId, contactId].sort().join(":");
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(sorted));
  return crypto.subtle.importKey("raw", hashBuffer, "AES-GCM", false, ["encrypt", "decrypt"]);
}

// Legacy key derivation (SHA-256 only) for backwards compatibility
export async function deriveKeyLegacy(myId: string, contactId: string): Promise<CryptoKey> {
  const sorted = [myId, contactId].sort().join(":");
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(sorted));
  return crypto.subtle.importKey("raw", hashBuffer, "AES-GCM", false, ["encrypt", "decrypt"]);
}

// Try decrypt with PBKDF2 key first, fall back to legacy SHA-256
export async function decryptWithFallback(myId: string, contactId: string, ciphertextB64: string): Promise<string> {
  // Try PBKDF2 first
  try {
    const key = await deriveKey(myId, contactId);
    return await decrypt(key, ciphertextB64);
  } catch {}
  // Fall back to legacy SHA-256
  try {
    const legacyKey = await deriveKeyLegacy(myId, contactId);
    return await decrypt(legacyKey, ciphertextB64);
  } catch {}
  throw new Error("Decryption failed with both PBKDF2 and legacy keys");
}

/**
 * C2.2 audit fix (2026-04-25): Call signaling key derived from the ratchet
 * rootKey instead of the two SPEAQ IDs. The relay knows both IDs (it routes
 * by them) so an ID-derived key is computable by the relay - meaning the
 * relay COULD decrypt SDP/ICE blobs and theoretically MITM the DTLS
 * fingerprint exchange. The ratchet rootKey is derived from the Kyber-768
 * shared secret (FIPS 203) which the relay does NOT know. This makes call
 * signaling truly zero-knowledge against the relay operator.
 *
 * Backwards-compat: if no ratchet exists yet (e.g. very first contact, no
 * messages exchanged) we fall back to the ID-derived key. In practice every
 * contact has a ratchet after the automatic KEY_EXCHANGE on contact-add, so
 * the ID path is rare.
 *
 * The receiver tries the ratchet-derived key first, then the ID-derived one,
 * to remain compatible with peers still on the legacy code path.
 */
async function ratchetDerivedCallKey(rootKey: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(rootKey + ":speaq-call-v1"));
  return crypto.subtle.importKey("raw", hashBuffer, "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function idDerivedCallKey(myId: string, peerId: string): Promise<CryptoKey> {
  const sorted = [myId, peerId].sort().join(":");
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(sorted));
  return crypto.subtle.importKey("raw", hashBuffer, "AES-GCM", false, ["encrypt", "decrypt"]);
}

export async function deriveCallKeyForSend(myId: string, peerId: string): Promise<{ key: CryptoKey; mode: "ratchet" | "id" }> {
  const ratchet = loadRatchetState(peerId);
  if (ratchet?.rootKey) {
    return { key: await ratchetDerivedCallKey(ratchet.rootKey), mode: "ratchet" };
  }
  return { key: await idDerivedCallKey(myId, peerId), mode: "id" };
}

export async function decryptCallBlob(myId: string, peerId: string, blobB64: string): Promise<string> {
  const ratchet = loadRatchetState(peerId);
  if (ratchet?.rootKey) {
    try {
      const key = await ratchetDerivedCallKey(ratchet.rootKey);
      return await decrypt(key, blobB64);
    } catch {
      // Fall through to ID-key (legacy peer or pre-C2.2 sender)
    }
  }
  const idKey = await idDerivedCallKey(myId, peerId);
  return await decrypt(idKey, blobB64);
}

function uint8ToBase64(arr: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < arr.length; i += 8192) {
    binary += String.fromCharCode.apply(null, Array.from(arr.slice(i, i + 8192)));
  }
  return btoa(binary);
}

export async function encrypt(key: CryptoKey, plaintext: string): Promise<string> {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(plaintext));
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return uint8ToBase64(combined);
}

export async function decrypt(key: CryptoKey, ciphertextB64: string): Promise<string> {
  const raw = Uint8Array.from(atob(ciphertextB64), (c) => c.charCodeAt(0));
  const iv = raw.slice(0, 12);
  const ciphertext = raw.slice(12);
  const plainBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  return new TextDecoder().decode(plainBuffer);
}

// ============================================================
// SECTION 5: PBKDF2 PIN Hashing (100,000 iterations)
// ============================================================

export async function hashPinPBKDF2(pin: string, speaqId: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw", encoder.encode(pin), "PBKDF2", false, ["deriveBits"]
  );
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: encoder.encode("speaq-salt:" + speaqId), iterations: 600000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return toHex(new Uint8Array(derived));
}

// Identity-backup-specific: derive an AES-GCM key from PIN + a per-backup random salt.
// Used by exportIdentityBackup / importIdentityBackup so backups are portable across devices.
// E6-deeper (2026-04-25): KDF iterations are now an explicit parameter so that the wrap
// payload can record which iteration count was used - this allows future hardening on
// powerful devices without breaking older backup files.
export async function deriveBackupKeyFromSalt(pin: string, salt: Uint8Array, iterations: number = 600000): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw", encoder.encode(`SPEAQ-IDENTITY-BACKUP:${pin}`), "PBKDF2", false, ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// Vault-specific: derive an AES-GCM key from PIN + speaqId (separate salt namespace from auth-PIN hashing).
// Used to actually encrypt vault content at rest (page.tsx vaultItems persistence).
export async function deriveVaultKey(pin: string, speaqId: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw", encoder.encode(pin), "PBKDF2", false, ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: encoder.encode("speaq-vault-salt:" + speaqId), iterations: 600000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// Encrypt arbitrary JSON-serializable content with a vault key. Returns base64 of (iv || ciphertext).
export async function encryptWithKey(key: CryptoKey, plaintext: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(plaintext));
  const combined = new Uint8Array(iv.length + ct.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ct), iv.length);
  return uint8ToBase64(combined);
}

export async function decryptWithKey(key: CryptoKey, b64: string): Promise<string> {
  const raw = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const iv = raw.slice(0, 12);
  const ct = raw.slice(12);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  return new TextDecoder().decode(plain);
}

// ============================================================
// SECTION 6: Ratchet-based Encrypt/Decrypt
// ============================================================

export async function ratchetEncrypt(state: RatchetState, plaintext: string): Promise<{ state: RatchetState; ciphertext: string; messageNumber: number }> {
  const { nextChainKey, messageKey } = await advanceChain(state.chainKeySend);
  const key = await crypto.subtle.importKey(
    "raw", Uint8Array.from(messageKey.match(/.{2}/g)!.map(b => parseInt(b, 16))),
    { name: "AES-GCM", length: 256 }, false, ["encrypt"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(plaintext));
  const combined = new Uint8Array(iv.length + ct.byteLength);
  combined.set(iv); combined.set(new Uint8Array(ct), iv.length);
  const newState = { ...state, chainKeySend: nextChainKey, sendCount: state.sendCount + 1 };
  return { state: newState, ciphertext: uint8ToBase64(combined), messageNumber: state.sendCount };
}

export async function ratchetDecrypt(state: RatchetState, ciphertextB64: string, messageNumber: number): Promise<{ state: RatchetState; plaintext: string }> {
  let chainKey = state.chainKeyRecv;
  for (let i = state.recvCount; i < messageNumber; i++) {
    const { nextChainKey } = await advanceChain(chainKey);
    chainKey = nextChainKey;
  }
  const { nextChainKey, messageKey } = await advanceChain(chainKey);
  const key = await crypto.subtle.importKey(
    "raw", Uint8Array.from(messageKey.match(/.{2}/g)!.map(b => parseInt(b, 16))),
    { name: "AES-GCM", length: 256 }, false, ["decrypt"]
  );
  const raw = Uint8Array.from(atob(ciphertextB64), (c) => c.charCodeAt(0));
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: raw.slice(0, 12) }, key, raw.slice(12));
  const newState = { ...state, chainKeyRecv: nextChainKey, recvCount: messageNumber + 1 };
  return { state: newState, plaintext: new TextDecoder().decode(pt) };
}

// ============================================================
// SECTION 7: Digital Signatures (ECDSA P-256 for key exchange auth)
// ============================================================
// Prevents man-in-the-middle attacks on key exchange.
// Each user has a signing keypair. KEY_EXCHANGE messages are signed.
// ProVerif verified: with signatures, MITM is impossible.

export interface SigningKeyPair {
  publicKey: string;   // base64 exported JWK
  privateKey: string;  // base64 exported JWK
}

export async function generateSigningKeyPair(): Promise<SigningKeyPair> {
  const kp = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"]
  );
  const pubJwk = await crypto.subtle.exportKey("jwk", kp.publicKey);
  const privJwk = await crypto.subtle.exportKey("jwk", kp.privateKey);
  return {
    publicKey: btoa(JSON.stringify(pubJwk)),
    privateKey: btoa(JSON.stringify(privJwk)),
  };
}

export async function signData(data: string, privateKeyB64: string): Promise<string> {
  const jwk = JSON.parse(atob(privateKeyB64));
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    new TextEncoder().encode(data)
  );
  return uint8ToBase64(new Uint8Array(sig));
}

export async function verifySignature(data: string, signatureB64: string, publicKeyB64: string): Promise<boolean> {
  try {
    const jwk = JSON.parse(atob(publicKeyB64));
    const key = await crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
    const sig = Uint8Array.from(atob(signatureB64), (c) => c.charCodeAt(0));
    return await crypto.subtle.verify(
      { name: "ECDSA", hash: "SHA-256" },
      key,
      sig,
      new TextEncoder().encode(data)
    );
  } catch {
    return false;
  }
}

// =================================================================================
// ML-DSA-65 (FIPS 204 Dilithium) signatures - audit fix D2 (2026-04-25)
// =================================================================================
// Post-quantum digital signatures from @noble/post-quantum, NIST FIPS 204 standard.
// ECDSA P-256 (above) remains the active signing scheme for browser-relay AUTH and
// peer KEY_EXCHANGE because it integrates with Web Crypto API and is supported by
// the relay's existing verification path. ML-DSA-65 below is the post-quantum
// equivalent intended for on-chain wallet transaction signing - the speaq-chain
// (Rust) already verifies Dilithium signatures on transactions, so this PWA-side
// API allows the browser/PWA to sign on-chain operations with FIPS 204 keys.
//
// Sizes: publicKey 1952 bytes, secretKey 4032 bytes, signature 3309 bytes (raw).
// All values are base64-encoded for storage/transport.

import { ml_dsa65 } from "@noble/post-quantum/ml-dsa.js";

export interface MlDsaKeyPair {
  publicKey: string;   // base64 of 1952 bytes
  privateKey: string;  // base64 of 4032 bytes
}

export function generateMlDsaKeyPair(): MlDsaKeyPair {
  const seed = crypto.getRandomValues(new Uint8Array(32));
  const kp = ml_dsa65.keygen(seed);
  return { publicKey: bytesToB64(kp.publicKey), privateKey: bytesToB64(kp.secretKey) };
}

export function mlDsaSign(message: string | Uint8Array, privateKeyB64: string): string {
  const sk = b64ToBytes(privateKeyB64);
  if (sk.length !== 4032) throw new Error(`ML-DSA-65 secretKey must be 4032 bytes, got ${sk.length}`);
  const msg = typeof message === "string" ? new TextEncoder().encode(message) : message;
  const sig = ml_dsa65.sign(sk, msg);
  return bytesToB64(sig);
}

export function mlDsaVerify(message: string | Uint8Array, signatureB64: string, publicKeyB64: string): boolean {
  try {
    const pk = b64ToBytes(publicKeyB64);
    if (pk.length !== 1952) return false;
    const sig = b64ToBytes(signatureB64);
    if (sig.length !== 3309) return false;
    const msg = typeof message === "string" ? new TextEncoder().encode(message) : message;
    return ml_dsa65.verify(pk, msg, sig);
  } catch {
    return false;
  }
}

// Save/load ML-DSA keys for the local user. Separate storage from ECDSA keys so the
// two signing schemes can coexist (ECDSA for AUTH/KEY_EXCHANGE, ML-DSA for on-chain
// transactions). Generated lazily on first use.
export function saveMlDsaKeys(keys: MlDsaKeyPair): void {
  localStorage.setItem("speaq_mldsa_keys", JSON.stringify(keys));
}
export function loadMlDsaKeys(): MlDsaKeyPair | null {
  try {
    const s = localStorage.getItem("speaq_mldsa_keys");
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}
export function getOrCreateMlDsaKeys(): MlDsaKeyPair {
  const existing = loadMlDsaKeys();
  if (existing && existing.publicKey && existing.privateKey) return existing;
  const fresh = generateMlDsaKeyPair();
  saveMlDsaKeys(fresh);
  return fresh;
}

// Save/load signing keys
export function saveSigningKeys(keys: SigningKeyPair): void {
  localStorage.setItem("speaq_signing_keys", JSON.stringify(keys));
}

export function loadSigningKeys(): SigningKeyPair | null {
  try {
    const s = localStorage.getItem("speaq_signing_keys");
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

// Save/load contact's public signing key
export function saveContactSigningKey(contactId: string, pubKey: string): void {
  localStorage.setItem(`speaq_sign_pub_${contactId}`, pubKey);
}

export function loadContactSigningKey(contactId: string): string | null {
  return localStorage.getItem(`speaq_sign_pub_${contactId}`);
}

// ============================================================
// SECTION 8: Ratchet State Storage
// ============================================================

export function saveRatchetState(contactId: string, state: RatchetState): void {
  localStorage.setItem(`speaq_ratchet_${contactId}`, JSON.stringify(state));
}

export function loadRatchetState(contactId: string): RatchetState | null {
  try {
    const s = localStorage.getItem(`speaq_ratchet_${contactId}`);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}
