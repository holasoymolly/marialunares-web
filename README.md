# Maria Lunares

Official website for the music artist **Maria Lunares** — neo-bolero espacial: trip-hop,
electrónica y sonidos espaciales. Música, videos, fotos y tienda.

> El nombre se escribe **sin tilde**: Maria Lunares.

Built with **Next.js 15 (Pages Router) · TypeScript · Tailwind CSS**, deployed on **Vercel**.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000  (⚠️ no hidrata en local: ver CLAUDE.md)
npm run build    # production build
npm run lint     # eslint

# Para probar interactividad en local hay que compilar:
npm run build && npx next start
```

## Scripts de medios

```bash
node scripts/nueva-cancion.mjs <slug>       # esqueleto de una canción en estudio/
node scripts/optimize-images.mjs            # portadas de estudio/ -> public/images
node scripts/preparar-audio.mjs <slug> …    # portada incrustada + MP3 + etiquetas
node scripts/normalizar-nombres.mjs         # minúsculas y guiones (con guarda de colisiones)
node scripts/og-image.mjs                   # tarjeta 1200x630 para redes
```

## Branches

| Rama | Entorno | URL |
|---|---|---|
| `main` | Production | <https://www.marialunares.com> |
| `preview` | Preview | <https://preview.marialunares.com> |

Los cambios entran por `preview` y se fusionan a `main` cuando están validados.

## Documentation

Full project context lives in [`CLAUDE.md`](./CLAUDE.md) (the hub) and the focused docs under [`docs/`](./docs):

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — how the app is built, pages, integrations, deployment, i18n.
- [`docs/DESIGN.md`](./docs/DESIGN.md) — brand & visual system.
- [`docs/AUDIT.md`](./docs/AUDIT.md) — UX & performance audit with prioritized recommendations.
- [`docs/ASSETS.md`](./docs/ASSETS.md) — media inventory & optimization pipeline.
