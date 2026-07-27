# CLAUDE.md — María Lunares

Hub document for AI assistants and developers. Keep this file lean; details live in `docs/`.

## What this is

The official website for the music artist **María Lunares**: a small, visual, single-purpose
site (music, videos, photos, contact, external shop). Spanish-first, with an English version.

## Stack

- **Next.js 15.1.9** — Pages Router (`src/pages`), not the App Router.
- **React 18 + TypeScript** (strict).
- **Tailwind CSS 3** + some `styled-jsx` for per-page layout.
- **Icons:** `@iconify/react` (the only runtime UI dependency besides Next/React).
- **Deploy:** Vercel. Image optimization via built-in `next/image`.

## Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (must pass before deploy)
npm run lint     # eslint (next lint)
node scripts/optimize-images.mjs   # regenerate optimized images from originals/
```

## File map

```
src/
  pages/            index, musica/ (grid + [slug]), videos, fotos, contacto,
                    sitemap.xml (+ _app, _document)
  components/       layout, Seo, BackgroundMusic, YouTubeFacade, SoundCloudFacade
  data/             releases.ts (catálogo de canciones — fuente única de /musica)
  i18n/             translations.ts (ES/EN dictionary) + useTranslations.ts
  styles/           globals.css
scripts/            optimize-images.mjs   (sharp media pipeline)
public/             optimized images, background video, og-image, favicon, robots
originals/          full-res media backup — GITIGNORED, never served
docs/               ARCHITECTURE.md · DESIGN.md · AUDIT.md · ASSETS.md
```

## Releases

`/musica` y las páginas `/musica/[slug]` se generan desde **`src/data/releases.ts`**. Para publicar
una canción nueva basta con añadir un objeto al array `releases`:

1. Optimiza la portada (`originals/images` → `node scripts/optimize-images.mjs`) y usa la ruta
   `/images/<archivo>.webp`.
2. Añade la entrada con `slug`, `title`, `year`, `cover`, `descriptionEs`, `descriptionEn`,
   `lyrics`, `credits`, `links` y `soundcloudTrackUrl`.
3. Pon `hasPage: true` cuando las descripciones ES/EN estén escritas. Sin ese flag la portada de
   `/musica` enlaza a `externalUrl` (smart link de Hypeddit) en lugar de a la página interna.
4. Pega el `checkoutUrl` de Lemon Squeezy cuando exista. Vacío = botón "Próximamente" deshabilitado.

El sitemap (`src/pages/sitemap.xml.ts`) se genera desde ese mismo array, así que la ruta nueva
aparece sola. No hay ningún otro archivo que tocar.

**Dónde vive cada texto:** las etiquetas de interfaz (Escuchar, Descargar, Letra, Créditos) están en
`src/i18n/translations.ts` porque son fijas y pocas. El contenido por canción (descripciones ES/EN,
letra, créditos, enlaces) vive en `releases.ts`: crece con cada release y pertenece al catálogo, no
al diccionario.

## Conventions

- **Spanish-first.** Default locale `es`; English served under `/en`. All user-facing strings
  go through `src/i18n/translations.ts` — never hardcode copy in components.
- **Every page renders `<Seo>`** (`src/components/Seo.tsx`) for title/description/OG/hreflang.
- **Media:** never commit full-res files to `public/`. Drop originals in `originals/` and run the
  optimizer. See [docs/ASSETS.md](docs/ASSETS.md).
- **Comments and copy are in Spanish** to match the existing codebase.

## ⚠️ Needs confirmation

- **Production domain.** SEO/canonical/sitemap default to `https://marialunares.com`. If the real
  domain differs, set `NEXT_PUBLIC_SITE_URL` in the environment (and update `public/sitemap.xml`,
  `public/robots.txt`). See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#environment).

## Deeper docs

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — pages, data flow, integrations, i18n, deployment.
- [docs/DESIGN.md](docs/DESIGN.md) — brand & visual system.
- [docs/AUDIT.md](docs/AUDIT.md) — UX & performance audit + status of recommendations.
- [docs/ASSETS.md](docs/ASSETS.md) — media inventory & optimization pipeline.
