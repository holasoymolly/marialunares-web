// Genera public/images a partir de estudio/.
//
// Las dos carpetas NO son espejo la una de la otra, y es a propósito:
//
//   estudio/  se ordena por proyecto del mundo real (una canción, una sesión
//             de fotos) y guarda los archivos a máxima resolución. No se sube
//             a git ni se despliega.
//   public/   se ordena por lo que necesita la web y guarda versiones
//             comprimidas. Lo genera este script: no se edita a mano.
//
// Ningún nombre de carpeta se repite entre las dos, para que nunca parezcan
// duplicadas. El mapeo de una a otra es la tabla MAPA de aquí abajo.
//
// Uso: node scripts/optimize-images.mjs
import sharp from "sharp";
import { readdir, mkdir, copyFile, stat } from "node:fs/promises";
import path from "node:path";

const ESTUDIO = "estudio";
const OUT = "public/images";
const QUALITY = 80;

// De dónde sale cada cosa y dónde acaba.
//
// Hoy solo las portadas se generan desde estudio/. El resto de public/images
// ya está en su forma final y no hace falta regenerarlo:
//
//   brand/  el logo se copió siempre tal cual (1682x1682): eso YA es el original.
//   fotos/  reducidas a 2000px en su día. Los originales de cámara viven en el
//           backup, fuera de este ordenador. Si algún día hay que rehacerlas,
//           se traen a estudio/sesiones-fotos/<sesion>/ y se añade su regla aquí.
//   home/   el póster sale del video de fondo con ffmpeg (ver docs/ASSETS.md).
const MAPA = [
  {
    desde: "canciones",
    hacia: "covers",
    porProyecto: true,
    maxEdge: 1200,
    nombre: (slug) => `ml-${slug}-coverart.webp`,
  },
];

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
    if (entry.isDirectory()) out.push(...(await walk(full, base)));
    else if (EXTS.has(path.extname(entry.name).toLowerCase())) out.push(path.relative(base, full));
  }
  return out;
}

async function encode(inPath, outPath, maxEdge, forzarWebp = false) {
  const ext = path.extname(inPath).toLowerCase();
  let pipeline = sharp(inPath)
    .rotate()
    .resize({ width: maxEdge, height: maxEdge, fit: "inside", withoutEnlargement: true });
  if (forzarWebp || ext === ".webp") pipeline = pipeline.webp({ quality: QUALITY });
  else if (ext === ".png") pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 9 });
  else pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
  await pipeline.toFile(outPath);
}

// Las canciones son un caso aparte. La portada del release puede estar en dos
// sitios, en este orden:
//
//   1. coverart/<lo que sea>-00-<lo que sea>.png   <- convención de Molly: el
//      "00" marca la portada del disco, y 01, 02… las de cada pista.
//   2. portada.png en la raíz de la carpeta        <- alternativa simple.
//
// Las portadas por pista no se emiten a public/: hoy la web no las usa, viven
// en estudio/ y se incrustan en los archivos de audio al venderlos.
async function buscarPortada(dir) {
  const enRaiz = (await readdir(dir).catch(() => [])).find(
    (f) => path.parse(f).name.toLowerCase() === "portada" && EXTS.has(path.extname(f).toLowerCase())
  );
  if (enRaiz) return path.join(dir, enRaiz);

  const coverart = path.join(dir, "coverart");
  const archivos = await readdir(coverart).catch(() => []);
  const delDisco = archivos.find(
    (f) => /-00-|^00[-_.]/i.test(f) && EXTS.has(path.extname(f).toLowerCase())
  );
  return delDisco ? path.join(coverart, delDisco) : null;
}

async function procesarCanciones(regla) {
  const base = path.join(ESTUDIO, regla.desde);
  let entradas;
  try {
    entradas = await readdir(base, { withFileTypes: true });
  } catch {
    return { hechos: 0, sinPortada: [] };
  }

  let hechos = 0;
  const sinPortada = [];

  for (const entrada of entradas) {
    if (!entrada.isDirectory()) continue;
    const dir = path.join(base, entrada.name);
    const portada = await buscarPortada(dir);

    if (!portada) {
      sinPortada.push(entrada.name);
      continue;
    }

    const outPath = path.join(OUT, regla.hacia, regla.nombre(entrada.name));
    await mkdir(path.dirname(outPath), { recursive: true });
    await encode(portada, outPath, regla.maxEdge, true);
    hechos++;
    console.log(`  ${path.relative(base, portada)}  ->  ${outPath}`);
  }

  return { hechos, sinPortada };
}

async function main() {
  try {
    await stat(ESTUDIO);
  } catch {
    console.error(
      `No existe ${ESTUDIO}/.\n\n` +
        "Es tu mesa de trabajo y está fuera de git, así que hay que recuperarla\n" +
        "del backup con esta forma:\n" +
        MAPA.map((r) => `  ${ESTUDIO}/${r.desde}/`).join("\n")
    );
    process.exit(1);
  }

  let total = 0;
  const vacias = [];
  const avisos = [];

  for (const regla of MAPA) {
    console.log(`\n${regla.desde}/  ->  ${OUT}/${regla.hacia}/`);

    if (regla.porProyecto) {
      const { hechos, sinPortada } = await procesarCanciones(regla);
      total += hechos;
      if (!hechos) vacias.push(regla.desde);
      if (sinPortada.length) {
        avisos.push(`sin portada.*: ${sinPortada.join(", ")}`);
      }
      continue;
    }

    const archivos = await walk(path.join(ESTUDIO, regla.desde));
    if (!archivos.length) {
      vacias.push(regla.desde);
      continue;
    }

    for (const rel of archivos) {
      const inPath = path.join(ESTUDIO, regla.desde, rel);
      const outPath = path.join(OUT, regla.hacia, rel);
      await mkdir(path.dirname(outPath), { recursive: true });
      if (regla.copy) await copyFile(inPath, outPath);
      else await encode(inPath, outPath, regla.maxEdge);
      total++;
    }
    console.log(`  ${archivos.length} archivo(s)`);
  }

  console.log(`\nListo. ${total} imagen(es) generada(s) en ${OUT}.`);
  for (const aviso of avisos) console.warn(`Aviso: ${aviso}`);
  if (vacias.length) {
    console.warn(`Sin material todavía en ${ESTUDIO}/: ${vacias.join(", ")}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
