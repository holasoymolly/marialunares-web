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
│ [logo]                         Música / Videos  │  ← nav + ES|EN toggle (top-right)
│                                Fotos / Tienda   │
│                                Contacto         │
│                                                 │
│                 (page content)                  │
│                                                 │
│ [Newsletter]            [▶ music]  ◎ ◎ ◎ ◎      │  ← player + social icons (bottom)
└───────────────────────────────────────────────┘
```

Positioning uses `position: fixed` with `z-20`/`z-30`; page media sits at negative z-index.

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
