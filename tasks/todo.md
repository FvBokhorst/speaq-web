# SPEAQ Website Update - Todo

## Tasks
- [x] Create `src/lib/i18n.ts` with all 9 language translations
- [x] Create `src/app/components/LanguageSwitcher.tsx`
- [x] Create `src/app/components/ThemeToggle.tsx`
- [x] Update `src/app/globals.css` with light mode overrides
- [x] Update `src/app/page.tsx` - make client component, add i18n, SVG icons, nav bar with controls
- [x] `npm run build` - passed with zero errors
- [x] Git add, commit, push
- [x] Deploy to Cloud Run

## Review
All 3 changes implemented:
1. **i18n**: Full translations for 9 languages (EN, NL, FR, ES, RU, DE, SL, LG, SW). LanguageSwitcher dropdown in nav bar. Language buttons in the Languages section also switch language. Stored in localStorage.
2. **Download SVGs**: Apple logo (white fill), Android robot (green #3DDC84 fill), Globe (stroke icon) -- all inline SVGs, no emoji.
3. **Dark/Light mode**: ThemeToggle with Sun/Moon SVGs in nav bar. html.light class overrides all theme CSS variables. Stored in localStorage. Default is dark.

Build passed, pushed to main, deployed to Cloud Run at https://speaq-web-244491980730.europe-west1.run.app
