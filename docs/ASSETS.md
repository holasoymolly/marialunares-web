# Media Assets

[← back to CLAUDE.md](../CLAUDE.md)

## Golden rule

**Never commit full-res media to `public/`.** Put originals in `originals/` (gitignored) and run
the optimizer. Only optimized files are served. This is what keeps the site fast and the repo
working tree small (~7.3 MB of media vs. the original ~458 MB).

## Pipeline

```bash
# 1. Drop new full-res files into originals/images (and originals/videos)
# 2. If it's a new image, add its filename to the right list in scripts/optimize-images.mjs
# 3. Regenerate optimized files into public/images
node scripts/optimize-images.mjs
```

`scripts/optimize-images.mjs` (uses `sharp`):
- **Photos** → ≤2000 px long edge, quality 80, original extension kept (jpeg via mozjpeg / webp).
- **Covers** → ≤1200 px, quality 80.
- **Logos** → copied through untouched (already tiny).
- Filenames are preserved so page `src`s never change. Files **not** in the lists are simply not
  emitted to `public/` (i.e. unused = not shipped).

Videos are handled manually with `ffmpeg` (one-off):

```bash
# Background loop: downscale, mute, web-optimize
ffmpeg -i originals/videos/<src>.mp4 -an -vf "scale=800:-2" \
  -c:v libx264 -profile:v high -preset slow -crf 30 -pix_fmt yuv420p \
  -movflags +faststart public/videos/home-background.mp4
# Poster frame (then convert PNG → webp with sharp; ffmpeg here lacks a webp encoder)
ffmpeg -i originals/videos/<src>.mp4 -frames:v 1 -vf "scale=800:-2" /tmp/poster.png
```

## What's served (`public/`)

| Asset | Used by |
|---|---|
| `images/sev_*.{jpg,webp}`, `img_9*.jpg`, `raices-bts-*.jpg` (28) | `/fotos` gallery |
| `images/ml_coverart_denoche.webp`, `ml-sol-trips`, `ml-sol`, `ml-sabes`, `ml-luna` (covers) | `/musica` |
| `images/ml-logo-blanco.webp`, `ml-logo-blanco-negativo.webp` | logo (default/hover) in `globals.css` |
| `images/home-poster.webp` | `/` video poster |
| `videos/home-background.mp4` | `/` background loop |
| `og-image.jpg` | social share card (all pages, via `Seo`) |
| `favicon.png`, `favicon.ico` | browser tab |
| `robots.txt`, `sitemap.xml` | SEO |

## Backed up but NOT served (`originals/`, gitignored)

- All full-res photo originals.
- Videos: `freepik__...75283.mp4` (source for the home loop), plus unused
  `home-background.mp4` (original 35 MB), `ml-asfalto-fragmento-noaudio.mp4` (65 MB),
  `maria-lunares-raices-live-fragmento-1080.mov` (31 MB).
- Unused covers: `ml_coverart_andando`, `ml_coverart_humo`, `ml-asfalto-coverart`,
  `ml-fantasmas-coverart`, `ml-sombra-coverart`.

> To bring an "unused" cover into the site: add it to the `COVERS` list in the optimizer, run it,
> then reference `/images/<name>.webp` from the page.

## Notes

- `og-image.jpg` is currently the "De Noche" cover centered on a 1200×630 black canvas. Replace
  with a purpose-built share graphic when available (see [AUDIT.md](AUDIT.md)).
- Git **history** still holds the old large blobs; only the working tree/deploys are slim.
