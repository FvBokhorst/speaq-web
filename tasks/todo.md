# SPEAQ PWA Chat Application - Build Plan

## Tasks

- [ ] 1. Create `src/app/app/crypto.ts` -- AES-256-GCM encryption via SubtleCrypto
- [ ] 2. Create `src/app/app/page.tsx` -- Full chat app (Welcome, Main, Chat, Contacts, Settings)
- [ ] 3. Create `public/sw.js` -- Service worker for offline caching
- [ ] 4. Update `next.config.ts` -- Add wss relay to CSP connect-src
- [ ] 5. Update `public/manifest.json` -- Set start_url to /app
- [ ] 6. npm run build (must pass)
- [ ] 7. Git commit + push
- [ ] 8. Deploy to Cloud Run

## Design
- WebSocket: wss://speaq-relay-244491980730.europe-west1.run.app
- Encryption: AES-256-GCM, key = SHA-256(sorted IDs)
- Brand tokens from globals.css
- Mobile-first, dark mode, NO emoji icons
- Fonts: Playfair Display / DM Sans / JetBrains Mono

## Previous Sprint (completed)
- i18n (9 languages), LanguageSwitcher, ThemeToggle, light/dark mode
