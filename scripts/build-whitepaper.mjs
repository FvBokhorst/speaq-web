#!/usr/bin/env node
/**
 * Build SPEAQ whitepaper DOCX files from HTML masters.
 *
 * Inputs:
 *   public/whitepaper.html         English master (versioned in git)
 *   public/whitepaper-nl.html      Dutch translation (versioned in git)
 *
 * Outputs (overwritten on each run):
 *   public/SPEAQ_Whitepaper_EN.docx
 *   public/SPEAQ_Whitepaper_NL.docx
 *
 * Vault copy when --vault flag is passed:
 *   ~/Dropbox/.../02 Areas/SPEAQ/SPEAQ_Whitepaper_v3_NL_Publiek.docx
 *
 * Requires pandoc on PATH (brew install pandoc).
 *
 * Usage:
 *   node scripts/build-whitepaper.mjs        # build both langs
 *   node scripts/build-whitepaper.mjs --vault # also copy NL DOCX into vault
 *   npm run build:whitepaper                 # via package.json
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = resolve(ROOT, 'public');

const VAULT_PATH = resolve(
  homedir(),
  'Dropbox',
  'Franciscus',
  'Mejena BV',
  '00.1 Frank van Bokhorst.com',
  'Plexaris Brain',
  '02 Areas',
  'SPEAQ',
  'SPEAQ_Whitepaper_v3_NL_Publiek.docx'
);

const TARGETS = [
  { lang: 'en', input: 'whitepaper.html', output: 'SPEAQ_Whitepaper_EN.docx' },
  { lang: 'nl', input: 'whitepaper-nl.html', output: 'SPEAQ_Whitepaper_NL.docx' },
];

function ensurePandoc() {
  try {
    execFileSync('pandoc', ['--version'], { stdio: 'ignore' });
  } catch {
    console.error('[build-whitepaper] pandoc not found on PATH. Install via: brew install pandoc');
    process.exit(1);
  }
}

function buildOne({ lang, input, output }) {
  const inputPath = resolve(PUBLIC, input);
  const outputPath = resolve(PUBLIC, output);
  if (!existsSync(inputPath)) {
    console.warn(`[build-whitepaper] skip ${lang}: ${input} not found`);
    return null;
  }
  // execFileSync (not execSync) so the input/output paths cannot trigger shell
  // injection even if filenames contained special characters.
  console.log(`[build-whitepaper] ${lang}: ${input} -> ${output}`);
  execFileSync(
    'pandoc',
    ['-f', 'html', '-t', 'docx', '-o', outputPath, inputPath, '--standalone', '--metadata', 'title=SPEAQ Whitepaper'],
    { stdio: 'inherit' }
  );
  return outputPath;
}

function copyToVault(localDocx) {
  if (!existsSync(localDocx)) {
    console.warn(`[build-whitepaper] vault copy skipped: ${localDocx} missing`);
    return;
  }
  const vaultDir = dirname(VAULT_PATH);
  if (!existsSync(vaultDir)) {
    mkdirSync(vaultDir, { recursive: true });
  }
  copyFileSync(localDocx, VAULT_PATH);
  console.log(`[build-whitepaper] copied to vault: ${VAULT_PATH}`);
}

// --- Gemini translation -----------------------------------------------------
// Translates the EN whitepaper.html to Dutch using Gemini 2.5 Flash and writes
// whitepaper-nl.html. Gemini's 1M-token context handles the full document in
// one call. Requires GEMINI_API_KEY in the environment - do NOT commit the key.
//
// For production usage, the key should be pulled from GCP Secret Manager:
//   export GEMINI_API_KEY=$(gcloud secrets versions access latest \
//     --secret=gemini-translate-key --project=plexaris-ai-note-taker)

const TRANSLATE_PROMPT_TEMPLATE = `You are translating the SPEAQ Whitepaper from English to Dutch.

PRESERVE EXACTLY (do not translate or modify):
- All HTML tags, attributes, classes, ids, inline styles
- All <style>...</style> and <script>...</script> blocks
- Code references inside <code>...</code> (HTTP codes, command names, paths)
- Technical/proper names: SPEAQ, Plexaris, mediasoup, mediasoup-SFU, coturn, WebRTC,
  DTLS-SRTP, AES-256, AES-256-GCM, ML-KEM-768, ML-DSA-65, SPHINCS+, FIPS 203/204/205,
  Kyber, Q-Credits, Sparks, Proof of Contribution, peer-to-peer, STUN, TURN, TURNS,
  Web Push, VAPID, Apple Watch, iOS, WebKit, Safari, PWA, Service Worker,
  cross-network, end-to-end, libp2p, Dilithium, NIST, GCP, Cloud Run, Let's Encrypt,
  Polkadot, Filecoin, IPFS, ECDSA P-256, HMAC-SHA256, SHA-256, opaque, gold-backed
- All URLs (sfu.thespeaq.com, turn.thespeaq.com, thespeaq.com, etc)
- All numeric values and units
- Filenames, image src attributes, anchor refs

TRANSLATE TO DUTCH (Nederlands):
- Text content between HTML tags (<h1>, <h3>, <p>, <li>, <td>, <th>, <span> with prose)
- Headings, paragraph prose, table cell content, list items, callouts
- Use professional Dutch as found in technical white papers
- DO NOT use em-dashes (-) or double hyphens; use single hyphens or commas instead
- DO NOT use emojis
- Use Dutch typographic conventions

OUTPUT: only the translated HTML document, exactly as it would appear if you saved
the file. No surrounding markdown code fences. No explanation. No commentary.

INPUT HTML BEGINS BELOW:

`;

async function translateViaGemini(htmlContent) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not set in environment - cannot translate');
  }
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: TRANSLATE_PROMPT_TEMPLATE + htmlContent }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 65536,
    },
  };
  console.log(`[translate] sending ${htmlContent.length} bytes to ${model}...`);
  const t0 = Date.now();
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText.slice(0, 500)}`);
  }
  const data = await res.json();
  const translated = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!translated) {
    throw new Error('Gemini returned no translation: ' + JSON.stringify(data).slice(0, 500));
  }
  console.log(`[translate] received ${translated.length} bytes in ${Math.round((Date.now() - t0) / 1000)}s`);
  // Strip any accidental markdown fences.
  return translated.replace(/^```html\s*\n/i, '').replace(/\n```\s*$/i, '');
}

async function generateNlHtml() {
  const enPath = resolve(PUBLIC, 'whitepaper.html');
  const nlPath = resolve(PUBLIC, 'whitepaper-nl.html');
  const enHtml = readFileSync(enPath, 'utf8');
  const nlHtml = await translateViaGemini(enHtml);
  writeFileSync(nlPath, nlHtml, 'utf8');
  console.log(`[translate] wrote ${nlPath}`);
}

async function main() {
  ensurePandoc();
  const wantTranslate = process.argv.includes('--translate') || process.argv.includes('--translate=nl');
  const wantVaultCopy = process.argv.includes('--vault');

  if (wantTranslate) {
    await generateNlHtml();
  }

  const built = TARGETS.map(buildOne).filter(Boolean);
  if (wantVaultCopy) {
    const nlDocx = resolve(PUBLIC, 'SPEAQ_Whitepaper_NL.docx');
    copyToVault(nlDocx);
  }
  console.log(`[build-whitepaper] done (${built.length} files)`);
}

main().catch((err) => {
  console.error(`[build-whitepaper] FAILED: ${err.message}`);
  process.exit(1);
});
