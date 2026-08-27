// Optimizador de medios: lee los originales a máxima resolución de
// ./estudio/images y escribe versiones para web en ./public/images.
//
// Descubre los archivos solo. Antes había una lista fija de nombres y era muy
// fácil añadir una portada nueva, olvidarse de apuntarla y que el script la
// ignorara sin decir nada. Ahora basta con dejar el archivo en la carpeta
// correcta de estudio/.
//
// La estructura de estudio/images se refleja tal cual en public/images:
//
//   estudio/images/covers/ml-lejos-coverart.webp
//        -> public/images/covers/ml-lejos-coverart.webp
//   estudio/images/fotos/sev/sev_1605.jpg
//        -> public/images/fotos/sev/sev_1605.jpg
//
// Uso: node scripts/optimize-images.mjs
import sharp from "sharp";
import { readdir, mkdir, copyFile, stat } from "node:fs/promises";
import path from "node:path";

const SRC = "estudio/images";
const OUT = "public/images";
const SONGS = "estudio/canciones";
const QUALITY = 80;

// Una regla por carpeta de primer nivel. `maxEdge` es el lado largo máximo en
// píxeles; `copy` pasa el archivo tal cual (los logos ya son diminutos).
const RULES = {
  covers: { maxEdge: 1200 },
  fotos: { maxEdge: 2000 },
  home: { maxEdge: 1600 },
  brand: { copy: true },
};

const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

// Recorre un directorio y devuelve las rutas relativas de las imágenes.
async function walk(dir, base = dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full, base)));
    } else if (EXTS.has(path.extname(entry.name).toLowerCase())) {
      out.push(path.relative(base, full));
    }
  }
  return out;
}

async function encode(inPath, outPath, maxEdge) {
  const ext = path.extname(inPath).toLowerCase();
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

// Las portadas también pueden venir de la carpeta de trabajo de cada canción:
// estudio/canciones/<slug>/portada.png -> public/images/covers/ml-<slug>-coverart.webp
// Así basta con soltar el archivo ahí; no hay que copiarlo a images/covers/.
async function coversDeCanciones() {
  const out = [];
  let slugs;
  try {
    slugs = await readdir(SONGS, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of slugs) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(SONGS, entry.name);
    const files = await readdir(dir).catch(() => []);
    const portada = files.find(
      (f) => path.parse(f).name.toLowerCase() === "portada" && EXTS.has(path.extname(f).toLowerCase())
    );
    if (portada) {
      out.push({
        inPath: path.join(dir, portada),
        outPath: path.join(OUT, "covers", `ml-${entry.name}-coverart.webp`),
        slug: entry.name,
      });
    }
  }
  return out;
}

async function main() {
  try {
    await stat(SRC);
  } catch {
    console.error(
      `No existe ${SRC}.\n` +
        `Los originales están fuera del repo (estudio/ está en .gitignore).\n` +
        `Recupéralos de tu backup con esta estructura:\n` +
        Object.keys(RULES)
          .map((d) => `  ${SRC}/${d}/`)
          .join("\n")
    );
    process.exit(1);
  }

  let total = 0;
  const skipped = [];

  for (const [dir, rule] of Object.entries(RULES)) {
    const files = await walk(path.join(SRC, dir));
    if (!files.length) {
      skipped.push(dir);
      continue;
    }

    for (const rel of files) {
      const inPath = path.join(SRC, dir, rel);
      const outPath = path.join(OUT, dir, rel);
      await mkdir(path.dirname(outPath), { recursive: true });
      if (rule.copy) await copyFile(inPath, outPath);
      else await encode(inPath, outPath, rule.maxEdge);
      total++;
    }

    console.log(`${dir}: ${files.length} archivo(s) -> ${path.join(OUT, dir)}`);
  }

  // Portadas que vienen de estudio/canciones/<slug>/portada.*
  const desdeCanciones = await coversDeCanciones();
  for (const { inPath, outPath, slug } of desdeCanciones) {
    await mkdir(path.dirname(outPath), { recursive: true });
    await sharp(inPath)
      .rotate()
      .resize({ width: RULES.covers.maxEdge, height: RULES.covers.maxEdge, fit: "inside", withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outPath);
    total++;
    console.log(`canciones/${slug}: portada -> ${outPath}`);
  }

  console.log(`\nListo. ${total} imagen(es) procesada(s).`);
  if (skipped.length) {
    console.warn(`Carpetas vacías o ausentes en ${SRC}: ${skipped.join(", ")}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
