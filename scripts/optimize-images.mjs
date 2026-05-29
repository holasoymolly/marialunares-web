// One-time / repeatable media optimizer.
// Reads full-res originals from ./originals/images and writes web-optimized
// versions into ./public/images, preserving filenames so page `src`s don't change.
//
// Usage: node scripts/optimize-images.mjs
import sharp from "sharp";
import { readdir, mkdir, copyFile } from "node:fs/promises";
import path from "node:path";

const SRC = "originals/images";
const OUT = "public/images";

// Only these are referenced by the site (see docs/ASSETS.md). Anything else is
// intentionally left out of public/ (unused → not shipped).
const PHOTOS = [
  "sev_1605.jpg", "sev_1647.jpg", "sev_1651.jpg", "sev_1668.jpg", "sev_1730.jpg", "sev1785.jpg",
  "img_9620.jpg", "img_9641.jpg", "img_9644.jpg", "img_9645.jpg", "img_9676.jpg", "img_9680.jpg",
  "raices-bts-3.jpg", "raices-bts-4.jpg", "raices-bts-6.jpg", "raices-bts-9.jpg", "raices-bts-20.jpg",
  "raices-bts-22.jpg", "raices-bts-28.jpg", "raices-bts-31.jpg", "raices-bts-39.jpg",
  "raices-bts-54.jpg", "raices-bts-57.jpg",
  "sev_1479.webp", "sev_1483.webp", "sev_1494.webp", "sev_1515.webp", "sev_1535.webp",
];
const COVERS = [
  "ml_coverart_denoche.webp", "ml-sol-trips-coverart.webp", "ml-sol-coverart.webp",
  "ml-sabes-coverart.webp", "ml-luna-coverart.webp",
];
// Small UI assets — already tiny, copy through untouched.
const PASSTHROUGH = ["ml-logo-blanco.webp", "ml-logo-blanco-negativo.webp"];

const MAX_PHOTO = 2000; // long edge, px
const MAX_COVER = 1200;
const QUALITY = 80;

async function encode(file, maxEdge) {
  const inPath = path.join(SRC, file);
  const outPath = path.join(OUT, file);
  const ext = path.extname(file).toLowerCase();
  let pipeline = sharp(inPath).rotate().resize({
    width: maxEdge,
    height: maxEdge,
    fit: "inside",
    withoutEnlargement: true,
  });
  if (ext === ".webp") pipeline = pipeline.webp({ quality: QUALITY });
  else if (ext === ".png") pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 9 });
  else pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
  await pipeline.toFile(outPath);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const available = new Set(await readdir(SRC));
  let count = 0;
  const missing = [];

  for (const f of PHOTOS) {
    if (!available.has(f)) { missing.push(f); continue; }
    await encode(f, MAX_PHOTO); count++;
  }
  for (const f of COVERS) {
    if (!available.has(f)) { missing.push(f); continue; }
    await encode(f, MAX_COVER); count++;
  }
  for (const f of PASSTHROUGH) {
    if (!available.has(f)) { missing.push(f); continue; }
    await copyFile(path.join(SRC, f), path.join(OUT, f)); count++;
  }

  console.log(`Optimized/copied ${count} images -> ${OUT}`);
  if (missing.length) console.warn("Missing from originals:", missing.join(", "));
}

main().catch((e) => { console.error(e); process.exit(1); });
