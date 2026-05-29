# Architecture

[← back to CLAUDE.md](../CLAUDE.md)

## Overview

A small content site on **Next.js 15 (Pages Router)**, deployed on **Vercel**. There is no
database and no custom backend — all content is hardcoded in the pages or pulled from embeds
(YouTube, SoundCloud) and external links (Printful shop, Hypeddit smart links, Google Forms).

## Pages (`src/pages`)

| Route | File | Purpose |
|---|---|---|
| `/` | `index.tsx` | Hero: muted background video loop (`/videos/home-background.mp4`) with poster + dark overlay. |
| `/musica` | `musica.tsx` | Grid of album/single covers; each links to a Hypeddit smart link. |
| `/videos` | `videos.tsx` | 6 YouTube videos rendered through `YouTubeFacade` (thumbnail → iframe on click). |
| `/fotos` | `fotos.tsx` | Masonry (CSS columns) photo gallery via `next/image`; client-side shuffle after mount. The repeating bleed title is localized (`FOTOS…` / `PHOTOS…`). |
| `/contacto` | `contacto.tsx` | Heading + `mailto:` link. |
| `/tienda` | — | **No page.** `next.config.js` `redirects()` → external Printful shop (307). |

`_app.tsx` wraps every page in `Layout`. `_document.tsx` sets `<html lang>` from the active locale.

## Shared components (`src/components`)

- **`layout.tsx`** — fixed chrome on every page: logo (top-left), nav + language toggle
  (top-right), Newsletter button (bottom-left), social icons (bottom-right), background music
  player. Wraps page content in `<main>`.
- **`Seo.tsx`** — renders per-page `<Head>`: title, description, canonical, `hreflang`
  (es/en/x-default), Open Graph and Twitter Card tags. Base URL from `NEXT_PUBLIC_SITE_URL`.
- **`BackgroundMusic.tsx`** — user-initiated SoundCloud player. Shows a Play button; the iframe
  (and its autoplay) only mount after a click — browsers block autoplay, and this avoids loading
  a heavy third-party embed on first paint.
- **`YouTubeFacade.tsx`** — lightweight YouTube embed. Shows the thumbnail; loads the
  `youtube-nocookie.com` iframe only when the user presses play.

## Internationalization

- Configured in `next.config.js`: `i18n: { locales: ["es","en"], defaultLocale: "es" }`.
  Spanish is served at the root; English under `/en`.
- Copy lives in `src/i18n/translations.ts` (plain typed objects — no i18n library, the text
  volume is tiny). `useTranslations()` reads `router.locale` and returns the right dictionary.
- The language toggle in `Layout` calls `router.push(asPath, asPath, { locale })`.
- `Seo` emits `hreflang` alternates; `_document` sets `<html lang>` from `__NEXT_DATA__.locale`.

## Third-party integrations

| Service | Where | Notes |
|---|---|---|
| YouTube | `/videos` | Embeds via `youtube-nocookie.com`, lazy facade. |
| SoundCloud | background player | Playlist "De Noche" (`playlists/1922801791`). |
| Printful | nav "Tienda" + `/tienda` redirect | External storefront `marialunares.printful.me`. |
| Hypeddit | `/musica` cover links | Smart links to streaming platforms. |
| Google Forms | Newsletter button | `forms.gle/...`. |

## Environment

- `NEXT_PUBLIC_SITE_URL` — absolute site URL for canonical/OG/sitemap. **Defaults to
  `https://marialunares.com`** — confirm and override if the real domain differs.
- No secrets are required at runtime anymore. (The old `PRINTIFY_API_KEY` in `.env.local`
  belonged to the removed native checkout and is unused — safe to delete.)

## Deployment

- Vercel project is linked (`.vercel/project.json`). `vercel.json` sets `framework: nextjs`.
- This is a **server deployment** (not `output: export`), so `next/image` optimization and
  i18n routing work out of the box.

## History / removed surface

A full native checkout once existed (Stripe + PayPal + Printify API routes + cart/form/order
components). It was abandoned in favor of the external Printful shop and **removed** during the
2026 optimization pass, along with the global PayPal SDK and the `respuesta.json` API dump.
See [AUDIT.md](AUDIT.md).
