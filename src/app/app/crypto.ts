/**
 * SPEAQ Web Crypto Module
 * AES-256-GCM encryption via Web Crypto API (SubtleCrypto)
 * Compatible key derivation with React Native app (SHA-256 of sorted IDs)
 */

/** Generate a 16-char hex SPEAQ ID using crypto.getRandomValues */
export function generateId(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Derive an AES-256-GCM CryptoKey from two SPEAQ IDs */
export async function deriveKey(
  myId: string,
  contactId: string
): Promise<CryptoKey> {
  const sorted = [myId, contactId].sort().join(":");
  const encoder = new TextEncoder();
  const data = encoder.encode(sorted);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return crypto.subtle.importKey("raw", hashBuffer, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}

/** Encrypt plaintext with AES-256-GCM, returns base64 string (iv + ciphertext) */
export async function encrypt(
  key: CryptoKey,
  plaintext: string
): Promise<string> {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(plaintext)
  );
  // Combine iv (12 bytes) + ciphertext into one buffer
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return btoa(String.fromCharCode(...combined));
}

/** Decrypt base64 AES-256-GCM ciphertext, returns plaintext */
export async function decrypt(
  key: CryptoKey,
  ciphertextB64: string
): Promise<string> {
  const raw = Uint8Array.from(atob(ciphertextB64), (c) => c.charCodeAt(0));
  const iv = raw.slice(0, 12);
  const ciphertext = raw.slice(12);
  const plainBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(plainBuffer);
}
