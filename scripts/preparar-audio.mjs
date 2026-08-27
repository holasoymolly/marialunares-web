// Deja listos para vender los audios de una canción o EP:
//
//   1. Incrusta la portada en cada WAV (sin tocar el PCM).
//   2. Genera el MP3 320 kbps de cada pista que no lo tenga, con su portada.
//   3. Pone las etiquetas (título, artista, álbum, número de pista, año).
//
// La portada de cada pista sale de coverart/, emparejada por número:
//
//   audio/wav/ml-de-noche-01-asfalto.wav  <->  coverart/ml-de-noche-01-asfalto.png
//
// Si una pista no tiene la suya, se usa la del disco (la que lleva "-00-").
//
// Uso: node scripts/preparar-audio.mjs <slug> [--album "De Noche"] [--year 2025]
//                                             [--artist "Maria Lunares"] [--force]
import { readdir, readFile, writeFile, mkdir, stat, unlink } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import os from "node:os";
import sharp from "sharp";

const run = promisify(execFile);

const IMG = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const ART_MAX = 800; // px del arte incrustado: suficiente y no infla el archivo

// ---------- argumentos ----------

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--"));
const flag = (n, def) => {
  const i = args.indexOf(`--${n}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
};
const force = args.includes("--force");

if (!slug) {
  console.error(
    "Falta el slug.\n\n  node scripts/preparar-audio.mjs de-noche --album \"De Noche\" --year 2025\n"
  );
  process.exit(1);
}

const DIR = path.join("estudio/canciones", slug);
const AUDIO = path.join(DIR, "audio");
const ART = path.join(DIR, "coverart");

const album = flag("album", "");
const year = flag("year", "");
const artist = flag("artist", "Maria Lunares");
const tituloUnico = flag("title", "");

// ---------- utilidades ----------

function titulizar(s) {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Busca archivos con una extensión bajo audio/, a cualquier profundidad.
// Así da igual que estén en audio/wav/ o sueltos en audio/.
async function buscarAudio(ext) {
  const out = [];
  async function walk(dir) {
    const entradas = await readdir(dir, { withFileTypes: true }).catch(() => []);
    for (const e of entradas) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) await walk(full);
      else if (path.extname(e.name).toLowerCase() === ext) out.push(full);
    }
  }
  await walk(AUDIO);
  return out.sort();
}

// El número de pista sale del nombre (…-01-asfalto). Si no lo lleva y solo hay
// un archivo, es un sencillo: pista 1 de 1.
function numeroDe(file, total) {
  const m = path.parse(file).name.match(/-(\d{2})-/);
  if (m) return m[1];
  return total === 1 ? "01" : null;
}

// El título sale, por orden: de --title, del nombre numerado, o del slug.
function tituloDe(file, total) {
  if (tituloUnico) return tituloUnico;
  const m = path.parse(file).name.match(/-\d{2}-(.+)$/);
  if (m) return titulizar(m[1]);
  if (total === 1) return titulizar(slug);
  return titulizar(path.parse(file).name);
}

// La portada se empareja por número. Si no hay coincidencia, se usa la del
// disco (la que lleva "-00-"); y si en coverart/ solo hay una imagen, esa.
async function portadaPara(num, archivos) {
  const img = (f) => IMG.has(path.extname(f).toLowerCase());
  const soloImgs = archivos.filter(img);
  const propia = num ? soloImgs.find((f) => new RegExp(`-${num}-`).test(f)) : null;
  const disco = soloImgs.find((f) => /-00-|^00[-_.]/i.test(f));
  const unica = soloImgs.length === 1 ? soloImgs[0] : null;
  const elegida = propia ?? disco ?? unica;
  return elegida ? { ruta: path.join(ART, elegida), propia: Boolean(propia) } : null;
}

// ---------- WAV: chunk `id3 ` sin tocar el audio ----------

const sinc = (n) => Buffer.from([(n >> 21) & 0x7f, (n >> 14) & 0x7f, (n >> 7) & 0x7f, n & 0x7f]);

function frameTexto(id, valor) {
  const datos = Buffer.concat([Buffer.from([0x00]), Buffer.from(valor, "latin1"), Buffer.from([0x00])]);
  const cab = Buffer.alloc(10);
  cab.write(id, 0, "latin1");
  cab.writeUInt32BE(datos.length, 4);
  return Buffer.concat([cab, datos]);
}

function frameApic(jpeg) {
  const datos = Buffer.concat([
    Buffer.from([0x00]),
    Buffer.from("image/jpeg\0", "latin1"),
    Buffer.from([0x03]), // 3 = portada frontal
    Buffer.from([0x00]), // descripción vacía
    jpeg,
  ]);
  const cab = Buffer.alloc(10);
  cab.write("APIC", 0, "latin1");
  cab.writeUInt32BE(datos.length, 4);
  return Buffer.concat([cab, datos]);
}

function construirId3(tags, jpeg) {
  const frames = Buffer.concat([
    ...tags.filter(([, v]) => v).map(([id, v]) => frameTexto(id, v)),
    frameApic(jpeg),
  ]);
  const cab = Buffer.concat([Buffer.from("ID3", "latin1"), Buffer.from([3, 0, 0]), sinc(frames.length)]);
  return Buffer.concat([cab, frames]);
}

// Recorre los chunks del RIFF. Sirve para detectar un `id3 ` ya existente y
// quitarlo, en vez de ir apilando uno nuevo cada vez que se ejecuta el script.
function chunksRiff(buf) {
  const out = [];
  let off = 12;
  while (off + 8 <= buf.length) {
    const id = buf.toString("latin1", off, off + 4);
    const size = buf.readUInt32LE(off + 4);
    const total = 8 + size + (size % 2);
    out.push({ id, off, total });
    if (size < 0 || off + total > buf.length) break;
    off += total;
  }
  return out;
}

async function etiquetarWav(file, jpeg, tags) {
  let buf = await readFile(file);
  if (buf.toString("latin1", 0, 4) !== "RIFF" || buf.toString("latin1", 8, 12) !== "WAVE") {
    throw new Error(`${file}: no es un WAV RIFF`);
  }

  const viejo = chunksRiff(buf).find((c) => c.id === "id3 ");
  if (viejo) {
    buf = Buffer.concat([buf.subarray(0, viejo.off), buf.subarray(viejo.off + viejo.total)]);
  }

  const tag = construirId3(tags, jpeg);
  const cab = Buffer.alloc(8);
  cab.write("id3 ", 0, "latin1");
  cab.writeUInt32LE(tag.length, 4);
  const relleno = tag.length % 2 ? Buffer.from([0]) : Buffer.alloc(0);

  const nuevo = Buffer.concat([buf, cab, tag, relleno]);
  nuevo.writeUInt32LE(nuevo.length - 8, 4);
  return nuevo;
}

// md5 del audio decodificado: sirve para probar que el PCM no cambió.
async function md5Audio(file) {
  const { stdout } = await run("ffmpeg", ["-v", "error", "-i", file, "-map", "0:a", "-f", "md5", "-"]);
  return stdout.trim();
}

// ---------- principal ----------

async function main() {
  try {
    await stat(AUDIO);
  } catch {
    console.error(`No existe ${AUDIO}. ¿Está bien el slug?`);
    process.exit(1);
  }

  const wavs = await buscarAudio(".wav");
  const mp3s = await buscarAudio(".mp3");
  if (!wavs.length && !mp3s.length) {
    console.error(`No hay audio en ${AUDIO}`);
    process.exit(1);
  }

  const artes = await readdir(ART).catch(() => []);
  if (!artes.filter((f) => IMG.has(path.extname(f).toLowerCase())).length) {
    console.warn(`Aviso: no hay imágenes en ${ART}. Los audios irán sin portada.\n`);
  }

  const total = Math.max(wavs.length, mp3s.length);
  const disco = album || titulizar(slug);
  console.log(`${slug} — ${total} pista(s)   álbum "${disco}"${year ? `, ${year}` : ""}\n`);

  const tmp = path.join(os.tmpdir(), `ml-audio-${slug}`);
  await mkdir(tmp, { recursive: true });

  // Se recorre por WAV cuando los hay; si solo hay MP3, por MP3.
  const base = wavs.length ? wavs : mp3s;

  for (const fuente of base) {
    const num = numeroDe(fuente, base.length);
    const titulo = tituloDe(fuente, base.length);
    const arte = await portadaPara(num, artes);

    const tags = [
      ["TIT2", titulo],
      ["TPE1", artist],
      ["TPE2", artist],
      ["TALB", disco],
      ["TRCK", `${Number(num ?? 1)}/${total}`],
      ["TYER", year],
      ["TCON", "Electronic"],
    ];

    let jpeg = null;
    if (arte) {
      jpeg = await sharp(arte.ruta).resize(ART_MAX, ART_MAX, { fit: "cover" }).jpeg({ quality: 88 }).toBuffer();
    }

    // ---- WAV ----
    let notaWav = "—";
    if (fuente.toLowerCase().endsWith(".wav")) {
      if (!jpeg) notaWav = "sin portada";
      else {
        const antes = await md5Audio(fuente);
        const salida = await etiquetarWav(fuente, jpeg, tags);
        const prueba = path.join(tmp, path.basename(fuente));
        await writeFile(prueba, salida);
        const despues = await md5Audio(prueba);
        if (antes !== despues || !antes) {
          await unlink(prueba).catch(() => {});
          throw new Error(`${path.basename(fuente)}: el audio cambiaría. Abortado, no se ha tocado nada.`);
        }
        await writeFile(fuente, salida);
        await unlink(prueba).catch(() => {});
        notaWav = arte.propia ? "portada propia" : "portada del disco";
      }
    }

    // ---- MP3 ----
    const metaFf = tags.filter(([, v]) => v).flatMap(([id, v]) => {
      const clave = { TIT2: "title", TPE1: "artist", TPE2: "album_artist", TALB: "album", TRCK: "track", TYER: "date", TCON: "genre" }[id];
      return ["-metadata", `${clave}=${v}`];
    });
    const jpgTmp = path.join(tmp, `${num ?? "01"}.jpg`);
    if (jpeg) await writeFile(jpgTmp, jpeg);

    // ¿Ya hay un MP3 para esta pista? Se empareja por número, o por ser el único.
    const existente = num
      ? mp3s.find((m) => new RegExp(`-${num}-`).test(path.basename(m))) ?? (mp3s.length === 1 ? mp3s[0] : null)
      : mp3s.length === 1
        ? mp3s[0]
        : null;

    let notaMp3;
    if (existente && !force) {
      // Se le añaden etiquetas y portada SIN recodificar: -c:a copy.
      const salida = path.join(tmp, `tag-${path.basename(existente)}`);
      await run("ffmpeg", [
        "-y", "-loglevel", "error", "-i", existente,
        ...(jpeg ? ["-i", jpgTmp] : []),
        "-map", "0:a", ...(jpeg ? ["-map", "1:v", "-c:v", "copy", "-disposition:v", "attached_pic"] : []),
        "-c:a", "copy", "-map_metadata", "-1", "-id3v2_version", "3", "-write_id3v1", "1",
        ...metaFf, salida,
      ]);
      await writeFile(existente, await readFile(salida));
      await unlink(salida).catch(() => {});
      notaMp3 = jpeg ? "etiquetado, sin recodificar" : "etiquetado (sin portada)";
    } else {
      const destino = existente ?? path.join(path.dirname(fuente), `${path.parse(fuente).name}.mp3`);
      await mkdir(path.dirname(destino), { recursive: true });
      await run("ffmpeg", [
        "-y", "-loglevel", "error", "-i", fuente,
        ...(jpeg ? ["-i", jpgTmp] : []),
        "-map", "0:a", ...(jpeg ? ["-map", "1:v", "-c:v", "copy", "-disposition:v", "attached_pic"] : []),
        "-c:a", "libmp3lame", "-b:a", "320k",
        "-map_metadata", "-1", "-id3v2_version", "3", "-write_id3v1", "1",
        ...metaFf, destino,
      ]);
      notaMp3 = existente ? "rehecho desde el WAV" : "creado";
    }

    console.log(`  ${(num ?? "--").padEnd(3)} ${titulo.padEnd(16)} wav: ${notaWav.padEnd(20)} mp3: ${notaMp3}`);
  }

  console.log("\nListo. El PCM de los WAV no se ha modificado (verificado por md5).");
}

main().catch((e) => {
  console.error(`\n${e.message}`);
  process.exit(1);
});
