# UX & Performance Audit

[← back to CLAUDE.md](../CLAUDE.md)

Audit performed 2026-05. Status column reflects what was fixed in the optimization pass.
✅ done · ⏳ partial · 💡 future.

## Headline result

The site shipped **~458 MB of raw media** to visitors (single images up to **21 MB**, videos up
to **65 MB**). After optimization, served media is **~7.3 MB** total.

| | Before | After |
|---|---|---|
| `public/images` | 324 MB | 6.8 MB |
| `public/videos` | 134 MB | 0.4 MB |
| First Load JS (shared) | ~+PayPal SDK on every page | 93.8 kB |

## Findings & status

### Performance (P0)
- **Oversized images** (7–21 MB each, 28 on `/fotos`). → ✅ Re-encoded to web specs (webp/jpeg,
  ≤2000 px, q80) via `scripts/optimize-images.mjs`; originals moved to gitignored `originals/`.
- **Heavy home background video** (7.5 MB, 10 Mbps). → ✅ Re-encoded to ~435 KB, muted,
  `preload="none"`, with a `poster` image for fast first paint.
- **~131 MB of unused video** + several unused cover images committed. → ✅ Removed from `public/`
  (kept in `originals/`).
- **PayPal SDK loaded on every page** for the abandoned checkout. → ✅ Removed.
- **`next/image` without `sizes`/`priority`**, deprecated `layout="responsive"`. → ✅ Modernized on
  `/fotos` and `/musica`.
- **6 YouTube iframes loaded eagerly** on `/videos`. → ✅ Replaced with click-to-load facade.

### Code & repo hygiene (P0)
- Dead native-checkout code (cart/form/order components + Printify API routes). → ✅ Deleted.
- Unused deps (`stripe`, `@stripe/*`, `@paypal/react-paypal-js`, `axios`, `swiper`,
  `react-masonry-css`, `@heroicons/react`). → ✅ Uninstalled.
- `respuesta.json` (698 KB API dump), nested `marialunares/` git stub, stale `out/`, duplicate
  `tailwind.config.js` / `postcss.config.mjs`, dead `.custom-swiper` CSS. → ✅ Removed.
- Boilerplate `README.md`. → ✅ Rewritten to point at the docs.

### SEO & i18n (P1)
- `<html lang="en">` on Spanish content. → ✅ Now driven by locale.
- No per-page titles/descriptions, no Open Graph/Twitter, no sitemap. → ✅ `Seo` component on every
  page + `hreflang`, `og-image.jpg`, `sitemap.xml`, `robots.txt`.
- No English version. → ✅ Bilingual ES/EN with a language toggle (`/` and `/en`).

### UX & accessibility (P1)
- Autoplay SoundCloud embed (blocked by browsers, heavy). → ✅ User-initiated + lazy.
- `/fotos` shuffled with `Math.random()` during render (hydration risk). → ✅ Stable SSR order,
  shuffles once on mount; Fisher–Yates without mutating the source.
- Contact email not clickable. → ✅ `mailto:` link.
- Social icons unlabeled, no `<nav>` landmark. → ✅ `aria-label`s + `<nav>`.
- No reduced-motion handling. → ✅ Global `prefers-reduced-motion` rule.

### Polish (P2)
- `/tienda` client-side redirect (flash + bad for SEO). → ✅ Moved to server `redirects()` (307).
- Roboto declared but never loaded. → 💡 Future: load via `next/font` (skipped to avoid
  build-time font fetch; current system-sans fallback is fine).
- Pages use fragile hardcoded `vw/vh` positioning. → 💡 Future: refactor to flC/grid if revisited.

## Remaining opportunities (not yet done)

- **Confirm the production domain** and set `NEXT_PUBLIC_SITE_URL` so canonical/OG/sitemap are
  correct (currently defaults to `https://marialunares.com`).
- **Git history still contains the large originals** — the working tree and deploys are now small,
  but a history rewrite (e.g. `git filter-repo`) would shrink clones. Destructive; do only on
  request.
- Consider a real Open Graph design (branded 1200×630) instead of the auto-generated cover crop.
- Optionally self-host or further trim the SoundCloud player.
