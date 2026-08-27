# Media Assets

[← back to CLAUDE.md](../CLAUDE.md)

## Golden rule

**Never commit full-res media to `public/`.** Put the originals in `estudio/` (gitignored) and run
the optimizer. Only optimized files are served. This is what keeps the site fast and the repo
working tree small.

## Folder layout

`estudio/` and `public/images/` are **not** mirrors of each other, on purpose:
`estudio/` is organised by real-world project and holds the full-res masters;
`public/images/` is organised by what the site needs and holds compressed
copies. No folder name is shared between them, so they never look duplicated.

```
estudio/                              (gitignored — masters, never deployed)
  canciones/<slug>/
    coverart/ml-<slug>-00-ep.png        the release cover ("00" identifies it)
    coverart/ml-<slug>-01-<track>.png   per-track covers, numbered like the audio
    audio/wav/  ·  audio/mp3/           "Maria Lunares - <Album> - 01 <Track>.wav"
    extras/  ·  lemon-squeezy/  ·  NOTAS.md

public/images/                        (do not edit by hand)
  covers/    ml-<slug>-coverart.webp    <- generated from canciones/*/portada.*
  fotos/<sesion>/                       <- already final (2000 px, q80)
  brand/                                <- already final (copied untouched)
  home/                                 <- poster frame, made with ffmpeg
```

Only covers are generated today; the `MAPA` table at the top of
`scripts/optimize-images.mjs` holds that mapping. The rest of `public/images/`
is already in its final form. Camera originals for `fotos/` (up to 21 MB each)
live in the external backup, not in the repo — bring a session back into
`estudio/sesiones-fotos/<sesion>/` and add a rule to `MAPA` if they ever need
regenerating.

A song's cover lives **with its song**, not in a separate images folder: if it
belongs to a release, it goes in that release's folder.

Files at the root of `public/` that the script does **not** manage:
`favicon.png`, `favicon.ico`, `og-image.jpg`, `robots.txt`,
`videos/home-background.mp4`.

## Pipeline

```bash
# 1. Canción nueva: crea su carpeta de trabajo y su NOTAS.md
node scripts/nueva-cancion.mjs mi-cancion

# 2. Deja los archivos y regenera public/images
node scripts/optimize-images.mjs

# 3. Deja los audios listos para vender: portada incrustada + MP3 320 kbps
node scripts/preparar-audio.mjs mi-cancion --album "Mi Canción" --year 2026
```

`preparar-audio.mjs` incrusta en cada WAV la portada de su pista (emparejada por
número con `coverart/`) y genera el MP3 que falte. El muxer de WAV de ffmpeg no
admite imágenes, así que el script escribe a mano un chunk `id3 ` del RIFF y
comprueba por md5 que el PCM no cambió. Es idempotente; `--force` rehace los MP3.

Los nombres de los archivos de audio llegan tal cual a quien compra, así que se
escriben legibles: `Maria Lunares - Lejos.wav` para un sencillo,
`Maria Lunares - De Noche - 01 Asfalto.wav` para un disco. La portada se
empareja con el audio por el número de pista, y los scripts aceptan tanto
guiones (`-01-`) como espacios (`- 01 `).

**Apple Music ignora la portada en WAV** (sí la leen Rekordbox, Serato, Traktor,
foobar2000). Por eso conviene vender siempre los dos formatos.

Además de las carpetas de `estudio/images/`, el optimizador recoge la portada de
cada canción desde `estudio/canciones/<slug>/portada.*` y la emite como
`public/images/covers/ml-<slug>-coverart.webp`. No hay que copiar nada a mano.

`scripts/optimize-images.mjs` (uses `sharp`) **discovers files on its own** — there is no list to
keep in sync. One rule per top-level folder:

| Folder | Rule |
|---|---|
| `covers/` | ≤1200 px long edge, quality 80 |
| `fotos/` | ≤2000 px long edge, quality 80 (recurses into session subfolders) |
| `home/` | ≤1600 px long edge, quality 80 |
| `brand/` | copied through untouched (already tiny) |

Extension is preserved: `.webp` → webp, `.png` → png, anything else → jpeg via mozjpeg.
If `estudio/images/` is missing, the script exits with an error naming the folders it expects.

Videos are handled manually with `ffmpeg` (one-off):

```bash
# Background loop: downscale, mute, web-optimize
ffmpeg -i estudio/videos/<src>.mp4 -an -vf "scale=800:-2" \
  -c:v libx264 -profile:v high -preset slow -crf 30 -pix_fmt yuv420p \
  -movflags +faststart public/videos/home-background.mp4
# Poster frame (then convert PNG → webp with sharp; ffmpeg here lacks a webp encoder)
ffmpeg -i estudio/videos/<src>.mp4 -frames:v 1 -vf "scale=800:-2" /tmp/poster.png
```

## What's served (`public/`)

| Asset | Used by |
|---|---|
| `images/covers/ml-{lejos,sabes-correr,de-noche,sol-trips,sol}-coverart.webp` | `/musica` + `/musica/[slug]` |
| `images/fotos/{sev,raices-bts,retratos}/*` (28) | `/fotos` gallery |
| `images/brand/ml-logo-blanco{,-negativo}.webp` | logo (default/hover) in `globals.css` |
| `images/home/home-poster.webp` | `/` video poster |
| `videos/home-background.mp4` | `/` background loop |
| `og-image.jpg` | social share card (all pages, via `Seo`). La genera `scripts/og-image.mjs` |
| `favicon.png`, `favicon.ico` | browser tab |
| `robots.txt` | SEO (the sitemap is generated by `src/pages/sitemap.xml.ts`) |

> `covers/ml-luna-coverart.webp` and `covers/ml-sabes-coverart.webp` sit with the rest but are not
> linked from `/musica` yet — they are waiting for their releases.

## Known gaps

- Git **history** still holds the old large blobs; only the working tree/deploys are slim.
