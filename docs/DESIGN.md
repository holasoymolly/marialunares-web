# Design System

[← back to CLAUDE.md](../CLAUDE.md)

The aesthetic is **minimal, dark, editorial** — oversized display type over black, with media
(video/photos/covers) as the visual payload. There is intentionally very little chrome text.

## Brand & mood

- Black background, white text, full-bleed media.
- Oversized headings (`text-9xl`) that bleed off-canvas on some pages (e.g. `/fotos`,
  `/musica`) for a poster-like, editorial feel. These display titles are localized too
  (e.g. the repeating `FOTOS…` / `PHOTOS…` strip on `/fotos`).
- The logo (Maria Lunares wordmark) swaps to a negative version on hover.

## Color

Defined in `src/styles/globals.css`:

| Token | Value | Use |
|---|---|---|
| Page background | `#000` (black) | Global `body` background. |
| Foreground | white | Default text. |
| `--background` / `--foreground` | CSS vars | Light/dark scheme vars (mostly superseded by the black canvas). |

Accent color is effectively the **SoundCloud orange** (`#ff5500`) inside the music player and
the red YouTube play button — used sparingly.

## Typography

- Font stack: `--font-sans: "Roboto", Arial, Helvetica, sans-serif` (currently falls back to
  the system sans; loading Roboto via `next/font` is a possible future enhancement).
- Display headings: `text-9xl font-bold/extrabold`, reduced to ~`4rem` on mobile via media
  queries in each page's `styled-jsx`.

## Layout pattern: fixed chrome

`Layout` pins persistent UI to the four corners; page content scrolls underneath in `<main>`:

```
┌───────────────────────────────────────────────┐
│ [logo]                         Sobre / Música   │  ← nav + ES|EN toggle (top-right)
│                                Videos / Fotos   │
│                                Tienda/Contacto  │
│                                                 │
│                 (page content)                  │
│                                                 │
│ [Newsletter]            [▶ music]  ◎ ◎ ◎ ◎      │  ← player + social icons (bottom)
└───────────────────────────────────────────────┘
```

Positioning uses `position: fixed` with `z-20`/`z-30`; page media sits at negative z-index.

## El menú fijo ocupa sitio, y hay que contarlo

El menú de la esquina superior derecha mide **268 px de alto en móvil** y **316 px a partir de
`sm`** (seis enlaces más el selector de idioma). Por debajo de `lg` el contenido ocupa todo el
ancho y pasaría por debajo de él, así que las páginas de texto largo arrancan más abajo:

```
pt-72 sm:pt-80 lg:pt-40
```

A partir de `lg` la columna de texto es lo bastante estrecha para no cruzarse con el menú, y se
puede subir. Añadir un enlace al menú cambia estos números.

## Páginas de texto largo

`/sobre` y `/musica/[slug]` comparten un mismo ritmo, pensado para leerse:

- **Etiqueta de sección** en versalitas: `text-xs uppercase tracking-[0.2em] opacity-60`
  (Escuchar, Letra, Pistas, Créditos, Enlaces, Prensa).
- **Dos columnas a partir de `lg`**: la etiqueta a la izquierda en una columna estrecha
  (`minmax(0,12rem)`), el texto a la derecha. Debajo de `lg` se apilan.
- **Ancho de lectura** limitado: `max-w-[58ch]` en párrafos, `max-w-[46ch]` en letras.
- **Botones** en píldora: el principal blanco sobre negro, el secundario con borde.
- **Entrada** con un `fade-up` de 500–700 ms, anulado por `prefers-reduced-motion`.

En los titulares grandes el límite de ancho va en `em`, no en `ch` sobre el contenedor: `ch` se
calcula con el tamaño de fuente del elemento padre, así que un `max-w-[24ch]` en el contenedor de
un titular de 76 px lo parte en seis líneas.

## Home

Nombre en grande, debajo el descriptor de género en versalitas espaciadas, y debajo la frase de
lugar. Todo centrado sobre el video de fondo con un velo negro al 50%.

## Tarjeta para compartir

`public/og-image.jpg`, 1200×630, la genera `scripts/og-image.mjs`: el retrato de la home
sangrando por la derecha sobre negro, fundido con un degradado, y a la izquierda el nombre, el
descriptor y el dominio. Se rehace cuando cambie la foto o el descriptor.

## Responsive breakpoints

Pages use ad-hoc `styled-jsx` media queries (not Tailwind screens), commonly:

- **Mobile:** `max-width: 768px` — headings shrink to ~4rem, galleries collapse to 1 column.
- **Tablet:** `769px–1024px` — intermediate sizing (see `/musica`).
- **Desktop:** `min-width: 1025px`.

> Note: several pages position elements with hardcoded `vw`/`vh` offsets and large
> `padding-top` values. It works but is fragile; treat with care when editing.

## Interaction & motion

- Hover: links go bold, icons/covers scale (`hover:scale-105/110`), 300ms transitions.
- `prefers-reduced-motion` is respected globally (animations/transitions reduced) — see
  `globals.css`.
- Media is decorative: the background video is `aria-hidden`; the music player and YouTube
  embeds are user-initiated.

## Accessibility notes

- Social icons and the language toggle have `aria-label`s; nav is a `<nav>` landmark.
- Contact email is a real `mailto:` link.
- Keep new interactive elements keyboard-focusable and labeled.
