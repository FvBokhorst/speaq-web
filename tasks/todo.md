# SPEAQ PWA Chat Application - Build Plan

## Tasks

- [x] 1. Create `src/app/app/crypto.ts` -- AES-256-GCM encryption via SubtleCrypto
- [x] 2. Create `src/app/app/page.tsx` -- Full chat app (Welcome, Main, Chat, Contacts, Settings)
- [x] 3. Create `public/sw.js` -- Service worker for offline caching
- [x] 4. Update `next.config.ts` -- Add wss relay to CSP connect-src
- [x] 5. Update `public/manifest.json` -- Set start_url to /app
- [x] 6. npm run build (passed)
- [x] 7. Git commit + push
- [x] 8. Deploy to Cloud Run (live)

## Review

### Files created:
1. **`src/app/app/crypto.ts`** -- AES-256-GCM encryption using Web Crypto API (SubtleCrypto). Functions: `generateId()`, `deriveKey()`, `encrypt()`, `decrypt()`. Key derivation: SHA-256 of sorted SPEAQ IDs.

2. **`src/app/app/page.tsx`** -- Complete chat application with state-managed screens:
   - Welcome: name input, identity creation with random 16-hex-char SPEAQ ID
   - Main: tab bar (Chats, Contacts, Wallet, Settings)
   - Chat list: conversations sorted by last message, avatar with first letter
   - Chat view: back button, contact name, Quantum Secured badge, message bubbles, input bar
   - Contacts: your SPEAQ ID (copyable), contact list, add contact
   - Settings: profile, language selector (9 langs), quantum security info, delete all data
   - WebSocket connection to wss://speaq-relay relay with AUTH, SEND_SEALED, RECEIVE_SEALED
   - All messages encrypted end-to-end with AES-256-GCM
   - Full i18n support (9 languages)
   - SVG line icons throughout (no emoji)
   - Mobile-first with min-h-dvh, 44px touch targets, safe-area padding
   - Dark mode using brand tokens from globals.css

3. **`public/sw.js`** -- Service worker with network-first caching strategy for offline support

### Files modified:
4. **`next.config.ts`** -- Added `wss://speaq-relay-*` to CSP connect-src
5. **`public/manifest.json`** -- Changed start_url from `/` to `/app`

## Previous Sprint (completed)
- i18n (9 languages), LanguageSwitcher, ThemeToggle, light/dark mode
