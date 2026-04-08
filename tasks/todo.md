# SPEAQ Web - Three Fixes

## Tasks

- [x] 1. TASK 1: Verify "Sovereign Wallet (FIPS 204)" section in all 9 languages - ALREADY PRESENT in all 9 (en, nl, fr, es, ru, de, sl, lg, sw)
- [x] 2. TASK 2: Replace all `--` (em dash) with `-` in user-facing text across all files
- [x] 3. TASK 3: Add hamburger menu to landing page + visible FAQ link
- [x] 4. Verify build passes with `npx next build` - PASSED

## Review

### Task 1: Sovereign Wallet section
All 9 languages already had both "Sovereign Wallet (FIPS 204)" and "SPEAQ Chain Blockchain" sections. No changes needed.

### Task 2: Em dash removal
Replaced `--` with `-` in user-facing text strings across these files:
- `src/app/faq/page.tsx` - ~20 replacements across all FAQ answers
- `src/app/terms/page.tsx` - 9 replacements (crypto stack, responsibilities, blockchain terms)
- `src/app/privacy/page.tsx` - 2 replacements (commitment, data storage sections)
- `src/app/explorer/page.tsx` - 6 replacements (crypto stack labels)
- `src/app/app/info-data.ts` - 18 replacements across all 9 languages (C+ heading, C+ body, Sovereign Wallet body)
- `src/app/app/page.tsx` - 5 replacements (mining active status, mining description, security description, disappear label, ML-DSA label)
- `src/lib/i18n.ts` - 2 replacements (Russian hero subtitle, Russian chat description)
- `src/app/admin/page.tsx` - 1 replacement (node status message)

Code comments with `--` were left unchanged (not user-facing).

### Task 3: Hamburger menu + FAQ link
- Added `menuOpen` state to Home component
- Added desktop horizontal nav links (Security, Download, Languages, FAQ, Privacy, Terms, Explorer) - hidden on mobile
- Added hamburger button (3-line icon / X icon) - visible only on mobile
- Added slide-in overlay menu from right side on mobile with all navigation links
- Menu closes when a link is clicked or backdrop is tapped
- Added `@keyframes slideIn` animation in globals.css
- Added `id="languages"` to the Languages section for scroll targeting
- Added visible FAQ link with question-mark icon above the Languages section
- All styles use existing SPEAQ brand CSS variables (bg-bg-deep, text-text-primary, voice-gold, bg-bg-card)
- Uses SVG line icons only (no emoji)

Build: `npx next build` passed successfully.
