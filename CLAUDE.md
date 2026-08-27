# CLAUDE.md — María Lunares

Hub document for AI assistants and developers. Keep this file lean; details live in `docs/`.

## What this is

The official website for the music artist **María Lunares**: a small, visual, single-purpose
site (music, videos, photos, contact, external shop). Spanish-first, with an English version.

**El género es neo-bolero espacial.** Del bolero viene la lírica —el desamor, la melancolía sin
vergüenza, en la línea de La Lupe—, no la instrumentación: musicalmente es trip-hop, electrónica
y sonidos espaciales.

> ⚠️ **Regla de copy:** «neo-bolero» **nunca aparece solo**. Siempre acompañado de trip-hop,
> electrónica, sonidos espaciales o experimental, para que no se lea como bolero tradicional.
> La regla está anotada también en `src/i18n/translations.ts`.

María Lunares es el proyecto de **Cinthya (Molly) Paulino**. Ya no toca formato DJ set: no usar
ese encuadre en ningún texto.

## Stack

- **Next.js 15.1.9** — Pages Router (`src/pages`), not the App Router.
- **React 18 + TypeScript** (strict).
- **Tailwind CSS 3** + some `styled-jsx` for per-page layout.
- **Icons:** `@iconify/react` (the only runtime UI dependency besides Next/React).
- **Deploy:** Vercel. Image optimization via built-in `next/image`.

## Commands

```bash
npm install
npm run dev      # http://localhost:3000  (⚠️ ver "Known issues")
npm run build    # production build (must pass before deploy)
npm run lint     # eslint (next lint)
node scripts/optimize-images.mjs           # portadas de estudio/ -> public/images
node scripts/nueva-cancion.mjs <slug>      # esqueleto de una canción nueva
node scripts/preparar-audio.mjs <slug> --album "X" --year AAAA   # portada + MP3 + etiquetas
node scripts/normalizar-nombres.mjs        # simula; --aplicar para renombrar
```

## Known issues

- **`npm run dev` no hidrata React** en el entorno local actual: la web se ve bien pero nada es
  interactivo (ni el modal del newsletter, ni el reproductor, ni el overlay de compra). No hay
  ningún error en consola. **No afecta a producción.** Comprobado que ocurre también con el código
  anterior a agosto de 2026 y con Node 18/22/26, así que es del entorno, no del repo.
  Para probar interactividad en local: `npm run build && npx next start`.
- `npm run build` y `npm run dev` comparten `.next`; al pasar de uno a otro conviene `rm -rf .next`.

## File map

```
src/
  pages/            index, sobre, musica/ (grid + [slug]), videos, fotos,
                    contacto, sitemap.xml, api/subscribe (+ _app, _document)
  components/       layout, Seo, BackgroundMusic, YouTubeFacade, SoundCloudFacade,
                    Newsletter{Provider,Modal,Form}
  data/             releases.ts (catálogo de canciones) · photos.ts (galería de /fotos)
  i18n/             translations.ts (ES/EN dictionary) + useTranslations.ts
  styles/           globals.css
scripts/            optimize-images.mjs   (portadas -> public/images)
                    nueva-cancion.mjs     (esqueleto de una canción en estudio/)
                    preparar-audio.mjs    (portada incrustada + MP3 + etiquetas)
                    normalizar-nombres.mjs (minúsculas y guiones, con guarda)
public/
  images/covers/    portadas, ml-<slug>-coverart.webp
  images/fotos/     sev/ · raices-bts/ · retratos/
  images/brand/     logo (normal y negativo)
  images/home/      póster del video de portada
  videos/           background video · og-image, favicons y robots en la raíz
estudio/            mesa de trabajo (GITIGNORED). Por canción:
                    coverart/ (00 = disco, 01+ = pistas) · audio/{wav,mp3}/ ·
                    extras/ · NOTAS.md
docs/               ARCHITECTURE.md · DESIGN.md · AUDIT.md · ASSETS.md
```

## Releases

`/musica` y las páginas `/musica/[slug]` se generan desde **`src/data/releases.ts`**. Para publicar
una canción nueva basta con añadir un objeto al array `releases`:

1. `node scripts/nueva-cancion.mjs <slug>` crea `estudio/canciones/<slug>/` con su `NOTAS.md`.
2. Deja en esa carpeta la portada (`coverart/ml-<slug>-00.jpg`) y el audio (`audio/wav/`), y corre:
   ```bash
   node scripts/optimize-images.mjs                              # portada -> public/images/covers/
   node scripts/preparar-audio.mjs <slug> --album "X" --year AAAA  # portada incrustada + MP3 + etiquetas
   ```
3. Añade la entrada al array con `slug`, `title`, `year`, `cover`, `descriptionEs`, `descriptionEn`,
   y lo que aplique: `lyrics` (sencillo) o `tracks` (EP/álbum), `credits`, `links`, `press`,
   `soundcloudTrackUrl`.
4. Pon `hasPage: true` cuando las descripciones ES/EN estén escritas. Sin ese flag la portada de
   `/musica` enlaza a `externalUrl` (smart link de Hypeddit) en lugar de a la página interna.
5. Pega el `checkoutUrl` de Lemon Squeezy cuando exista. Vacío = botón "Próximamente" deshabilitado.

**Sencillo o disco.** Un sencillo pone su letra en `lyrics`. Un EP o álbum usa `tracks[]`: la
página lista las pistas numeradas, cada una con su título, su nota y su letra. Los dos casos
conviven; `sabes-correr` y `lejos` son sencillos, `de-noche` y `sol-trips` son discos.

El sitemap (`src/pages/sitemap.xml.ts`) se genera desde ese mismo array, así que la ruta nueva
aparece sola. No hay ningún otro archivo que tocar.

**Dónde vive cada texto:** las etiquetas de interfaz (Escuchar, Descargar, Letra, Créditos) están en
`src/i18n/translations.ts` porque son fijas y pocas. El contenido por canción (descripciones ES/EN,
letra, créditos, enlaces) vive en `releases.ts`: crece con cada release y pertenece al catálogo, no
al diccionario.

## Páginas de contenido

- **`/sobre`** (en inglés, `/about`) — identidad del proyecto: apertura, qué es María Lunares,
  el alter ego ML, la historia y el cierre con CTA. Todo el copy en `translations.ts` (`sobre`
  y `brand`).
- El slug cambia entre idiomas solo en esta página. `next.config.js` reescribe `/en/about` a la
  página `/sobre` y redirige `/en/sobre` para no dejar dos URLs con el mismo contenido.
  `<Seo>` acepta una prop `paths` para declarar la ruta canónica de cada idioma.

## Newsletter

La lista de correo es propia y vive en **Kit** (antes ConvertKit). El botón "Newsletter" del
`Layout` y la CTA de las páginas de release abren el mismo modal nativo
(`NewsletterProvider` → `NewsletterModal` → `NewsletterForm`), que envía el correo a la API route
`src/pages/api/subscribe.ts`. El Google Form (`forms.gle/...`) quedó retirado.

Variables de entorno (Vercel + `.env.local`, ver `.env.example`):

| Variable | Uso |
|---|---|
| `KIT_API_KEY` | API key v4 de Kit. Solo server-side, nunca en el bundle del cliente. |
| `KIT_FORM_ID` | ID del formulario de Kit al que se suscribe la gente. |

El alta contra Kit v4 son **dos llamadas, en este orden**:

1. `POST /v4/subscribers` — crea el suscriptor en la cuenta.
2. `POST /v4/forms/{KIT_FORM_ID}/subscribers` — lo asocia al formulario.

El paso 1 no es opcional: si el correo no existe todavía, el paso 2 responde **404**, no 422.

Los suscriptores dados de alta por API entran con estado `active` (sin confirmación pendiente),
así que lo que reciba la persona depende de lo que tenga configurado ese formulario en Kit.
Para ver los formularios de la cuenta y sus IDs: `GET https://api.kit.com/v4/forms`.

## Conventions

- **Spanish-first.** Default locale `es`; English served under `/en`. All user-facing strings
  go through `src/i18n/translations.ts` — never hardcode copy in components.
- **Every page renders `<Seo>`** (`src/components/Seo.tsx`) for title/description/OG/hreflang.
- **Media:** never commit full-res files to `public/`. Drop the originals in `estudio/` and run the
  optimizer. See [docs/ASSETS.md](docs/ASSETS.md).
- **Comments and copy are in Spanish** to match the existing codebase.

## Branches & environments

| Rama | Entorno | URL |
|---|---|---|
| `main` | Production | `https://www.marialunares.com` |
| `preview` | Preview (staging) | `https://preview.marialunares.com` |

- **Todo cambio entra por `preview`.** Cuando se valida ahí, se fusiona a `main`, y ese merge es
  el que despliega producción. Nunca se trabaja directamente contra `main`.
- Las ramas de feature salen de `preview` y vuelven por PR; se borran al fusionar.
- Vercel construye una preview automática por cada rama que se sube, además de la URL fija de
  `preview` (que está atada a la rama, no a un deployment concreto).
- `preview.marialunares.com` tiene la protección de deployments de Vercel activada: pide login.

## Environment

- **Production domain:** `https://www.marialunares.com` (the apex 308-redirects to `www`).
  `NEXT_PUBLIC_SITE_URL` is set to that value in Vercel for Production and Preview; the code
  default (without `www`) is only a fallback.
- **Preview domain:** `https://preview.marialunares.com`, atado a la rama `preview`.
- **DNS:** lo gestiona Vercel (nameservers `ns1.vercel-dns.com` / `ns2.vercel-dns.com`). El
  registrador sigue siendo GoDaddy: para cambiar nameservers hay que entrar ahí. La zona vive en
  Vercel (Domains → marialunares.com → DNS Records).
- **Newsletter:** `KIT_API_KEY` and `KIT_FORM_ID` are set in Vercel for Production and Preview.
  Copy `.env.example` to `.env.local` to test the signup locally.
- See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#environment).

## Deeper docs

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — pages, data flow, integrations, i18n, deployment.
- [docs/DESIGN.md](docs/DESIGN.md) — brand & visual system.
- [docs/AUDIT.md](docs/AUDIT.md) — UX & performance audit + status of recommendations.
- [docs/ASSETS.md](docs/ASSETS.md) — media inventory & optimization pipeline.
