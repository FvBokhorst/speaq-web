# scripts/

## build-whitepaper.mjs

Generates DOCX files from the HTML whitepaper masters in `public/`.

### Quick usage

```bash
# Just convert existing HTML to DOCX (no translation):
npm run build:whitepaper

# Translate EN -> NL via Gemini, then convert both to DOCX:
npm run build:whitepaper:translate
```

Outputs:
- `public/SPEAQ_Whitepaper_EN.docx` (from `public/whitepaper.html`)
- `public/SPEAQ_Whitepaper_NL.docx` (from `public/whitepaper-nl.html`)
- Vault copy at `~/Dropbox/.../02 Areas/SPEAQ/SPEAQ_Whitepaper_v3_NL_Publiek.docx` (when `--vault` flag is passed via npm script)

### Requirements

- `pandoc` on PATH: `brew install pandoc`
- For `--translate`: `GEMINI_API_KEY` in environment.

Recommended source for the API key (not committed):

```bash
export GEMINI_API_KEY=$(gcloud secrets versions access latest \
  --secret=gemini-translate-key --project=plexaris-ai-note-taker)
```

If you don't have a Secret Manager entry yet, create one:

```bash
echo -n "<your-key>" | gcloud secrets create gemini-translate-key \
  --data-file=- --project=plexaris-ai-note-taker
```

### When to re-run

- **Content change in `public/whitepaper.html`** (English master, source of truth): re-run with `--translate` so the Dutch version stays in sync.
- **Section/version bump only, no real content change**: `npm run build:whitepaper` (no API call) is enough; just re-converts existing HTML.
- **Initial run on a fresh checkout**: use `--translate` once to generate `whitepaper-nl.html`, then commit it.

### How translation works

The script sends the entire `whitepaper.html` (around 46 KB, well within Gemini 2.5 Flash's 1M token context) in a single API call. The prompt instructs Gemini to:
- Preserve all HTML tags, attributes, code blocks, and technical/proper names.
- Translate prose content to Dutch using professional whitepaper tone.
- Avoid em-dashes and emojis (Frank's house style).

The resulting `whitepaper-nl.html` is committed alongside the English master so future builds without `--translate` (and reviewers without the API key) still produce a current Dutch DOCX.

### Known cosmetic warnings

Pandoc emits warnings about `/speaq-logo.png` and a couple of inline SVG icons it can't fetch or render without `rsvg-convert`. They are skipped gracefully and the resulting DOCX text content is complete; the logo is replaced with its description text. To embed the logo properly, install `librsvg` (`brew install librsvg`) and ensure `public/speaq-logo.png` exists relative to the input HTML.
