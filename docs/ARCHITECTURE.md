# Architecture

[← back to CLAUDE.md](../CLAUDE.md)

## Overview

A small content site on **Next.js 15 (Pages Router)**, deployed on **Vercel**. There is no
database and no custom backend — content is either hardcoded in the pages, typed into the release
catalogue (`src/data/releases.ts`), or pulled from embeds (YouTube, SoundCloud) and external links
(Printful shop, Hypeddit smart links, Lemon Squeezy checkout). The newsletter signup is
native (Kit).

## Pages (`src/pages`)

| Route | File | Purpose |
|---|---|---|
| `/` | `index.tsx` | Hero: muted background video loop (`/videos/home-background.mp4`) with poster + dark overlay. |
| `/sobre` (EN `/en/about`) | `sobre.tsx` | Identidad del proyecto. El slug inglés se sirve con un rewrite en `next.config.js`; `/en/sobre` redirige a `/en/about`. |
| `/musica` | `musica/index.tsx` | Cover grid generated from `src/data/releases.ts`. Each cover links to its own release page or, while that page isn't ready, to the Hypeddit smart link. |
| `/musica/[slug]` | `musica/[slug].tsx` | Release template (SSG via `getStaticPaths`/`getStaticProps`, one page per locale). Cover, description, download CTA, user-initiated SoundCloud preview, lyrics, credits, links, newsletter. Only releases with `hasPage: true` are generated. |
| `/sitemap.xml` | `sitemap.xml.ts` | XML sitemap rendered on demand from the static route list + the release catalogue. Replaced the old hand-maintained `public/sitemap.xml`. |
| `/videos` | `videos.tsx` | 6 YouTube videos rendered through `YouTubeFacade` (thumbnail → iframe on click). |
| `/fotos` | `fotos.tsx` | Masonry (CSS columns) photo gallery via `next/image`; client-side shuffle after mount. The repeating bleed title is localized (`FOTOS…` / `PHOTOS…`). |
| `/contacto` | `contacto.tsx` | Heading + `mailto:` link. |
| `/api/subscribe` | `api/subscribe.ts` | POST `{ email }`. Validates it and subscribes to Kit (ConvertKit) v4 server-side. The only place the API key is read. |
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
- **`SoundCloudFacade.tsx`** — same idea for the per-release preview on `/musica/[slug]`: a play
  button that mounts the SoundCloud iframe only after a click.
- **`NewsletterProvider.tsx`** — wraps the app in `_app.tsx` and owns the single newsletter modal.
  `useNewsletter().openNewsletter()` opens it from anywhere (Layout button, release CTA).
- **`NewsletterModal.tsx`** — dialog (`role="dialog"`, `aria-modal`), closes with Esc / backdrop /
  close button, traps Tab inside and restores focus to the trigger on close.
- **`NewsletterForm.tsx`** — email field + submit, states idle/loading/success/error announced via
  `aria-live`. Posts to `/api/subscribe`; never sees the API key.

## Content layer (`src/data/releases.ts`)

The release catalogue is a typed array and the single source of truth for `/musica`, the
`/musica/[slug]` pages and the sitemap. Adding a song = adding one object (see
[CLAUDE.md → Releases](../CLAUDE.md#releases)). Split of responsibilities:

- **`translations.ts`** — fixed UI labels (Escuchar, Descargar, Letra, Créditos) y la identidad
  de marca (`brand`: descriptor de género y frase de lugar).
- **`releases.ts`** — per-song content that grows over time (descriptions ES/EN, lyrics, credits,
  links, checkout URL). Un sencillo usa `lyrics`; un EP o álbum usa `tracks[]`, y entonces la
  página lista las pistas en lugar de una única letra. `press` guarda un extracto corto de
  prensa con su atribución.
- **`photos.ts`** — catálogo de la galería de `/fotos`: ruta y texto alternativo ES/EN de cada
  foto. Vive en `data/` por el mismo motivo que `releases.ts`: crece con cada sesión.

`hasPage` gates whether a release has its own page: while it is false the grid links out to
`externalUrl`, and `getStaticPaths` does not generate a route for it.

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
| SoundCloud | background player + release previews | Background player: track "Lejos". Previews: `soundcloudTrackUrl` per release. |
| Lemon Squeezy | release download CTA | `checkoutUrl` per release. Empty = disabled "Próximamente" button. When set, `lemon.js` (loaded with `next/script`, `afterInteractive`) opens the checkout in an overlay; the link keeps `target="_blank"` as a no-JS fallback. |
| Printful | nav "Tienda" + `/tienda` redirect | External storefront `marialunares.printful.me`. |
| Hypeddit | `/musica` cover links | Smart links to streaming platforms. |
| Kit (ConvertKit) | Newsletter modal | Native form → `POST /api/subscribe` → Kit API v4. Double opt-in. Replaced the old Google Form. |

## Environment

- `NEXT_PUBLIC_SITE_URL` — absolute site URL for canonical/OG/sitemap. The code default is
  `https://marialunares.com`, but the canonical domain is **`https://www.marialunares.com`**
  (the apex redirects there with a 308), so the variable is set to the `www` form in Vercel for
  Production and Preview.
- `KIT_API_KEY` / `KIT_FORM_ID` — Kit (ConvertKit) credentials for the newsletter. Read **only**
  inside `src/pages/api/subscribe.ts`; they are not `NEXT_PUBLIC_`, so they never reach the client
  bundle. Set them in Vercel for Production **and** Preview, and locally in `.env.local`.
- Template: `.env.example` (the only `.env*` file that is committed).
- (The old `PRINTIFY_API_KEY` in `.env.local` belonged to the removed native checkout and is
  unused — safe to delete.)

## Deployment

- Vercel project `marialunares` (team `molly-ylloms-projects`). `vercel.json` sets
  `framework: nextjs`. `.vercel/` is gitignored; re-link with `vercel link` if it is missing.
- This is a **server deployment** (not `output: export`), so `next/image` optimization and
  i18n routing work out of the box.

### Branches → environments

| Rama | Entorno | Dominio |
|---|---|---|
| `main` | Production | `www.marialunares.com` (apex 308 → `www`) |
| `preview` | Preview | `preview.marialunares.com` |

`preview.marialunares.com` is bound to the **branch**, not to a deployment, so every push to
`preview` updates it. Feature branches also get their own throwaway preview URL. Preview
deployments are behind Vercel Authentication (they 302 to the Vercel SSO login).

### DNS

Vercel hosts the zone (`ns1.vercel-dns.com` / `ns2.vercel-dns.com`); GoDaddy remains the
registrar. The zone is generated by Vercel: a wildcard `ALIAS` covering every subdomain, the apex
`ALIAS`, and three `CAA` records. No hand-written records are needed.

**Order matters when moving DNS to Vercel:** enable Vercel DNS *first* (Domains → the domain →
`Enable Vercel DNS`), verify the Vercel nameservers actually answer
(`dig @ns1.vercel-dns.com <host>` must return `NOERROR`, not `REFUSED`), and only then repoint the
nameservers at the registrar. Doing it the other way round takes the site down: on 2026-08-11 the
domain was still `serviceType: external` (no hosted zone) when the nameservers were switched, and
the site returned SERVFAIL until the change was reverted.

A custom domain on a preview branch may need a **redeploy** of that branch before Vercel issues
its TLS certificate, if the domain was attached after the last build.

## History / removed surface

A full native checkout once existed (Stripe + PayPal + Printify API routes + cart/form/order
components). It was abandoned in favor of the external Printful shop and **removed** during the
2026 optimization pass, along with the global PayPal SDK and the `respuesta.json` API dump.
See [AUDIT.md](AUDIT.md).
