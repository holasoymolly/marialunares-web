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
const WAV = path.join(DIR, "audio/wav");
const MP3 = path.join(DIR, "audio/mp3");
const ART = path.join(DIR, "coverart");

const album = flag("album", titulizar(slug));
const year = flag("year", "");
const artist = flag("artist", "Maria Lunares");

// ---------- utilidades ----------

function titulizar(s) {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ml-de-noche-01-asfalto.wav -> { num: "01", titulo: "Asfalto" }
function leerNombre(file) {
  const base = path.parse(file).name;
  const m = base.match(/-(\d{2})-(.+)$/);
  if (!m) return null;
  return { num: m[1], titulo: titulizar(m[2]) };
}

async function portadaPara(num, archivos) {
  const propia = archivos.find((f) => new RegExp(`-${num}-`).test(f) && IMG.has(path.extname(f).toLowerCase()));
  const disco = archivos.find((f) => /-00-|^00[-_.]/i.test(f) && IMG.has(path.extname(f).toLowerCase()));
  const elegida = propia ?? disco;
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
    await stat(WAV);
  } catch {
    console.error(`No existe ${WAV}. ¿Está bien el slug?`);
    process.exit(1);
  }

  const wavs = (await readdir(WAV)).filter((f) => f.toLowerCase().endsWith(".wav")).sort();
  if (!wavs.length) {
    console.error(`No hay ningún .wav en ${WAV}`);
    process.exit(1);
  }

  const artes = await readdir(ART).catch(() => []);
  if (!artes.length) console.warn(`Aviso: ${ART} está vacío, los audios irán sin portada.\n`);

  await mkdir(MP3, { recursive: true });
  const tmp = await mkdir(path.join(os.tmpdir(), `ml-audio-${slug}`), { recursive: true }).then(
    () => path.join(os.tmpdir(), `ml-audio-${slug}`)
  );

  const total = wavs.length;
  console.log(`${slug} — ${total} pista(s)   álbum "${album}"${year ? `, ${year}` : ""}\n`);

  for (const nombre of wavs) {
    const info = leerNombre(nombre);
    if (!info) {
      console.warn(`  ${nombre}: no puedo sacar el número de pista del nombre, lo salto`);
      continue;
    }
    const { num, titulo } = info;
    const wavPath = path.join(WAV, nombre);
    const arte = await portadaPara(num, artes);

    const tags = [
      ["TIT2", titulo],
      ["TPE1", artist],
      ["TPE2", artist],
      ["TALB", album],
      ["TRCK", `${Number(num)}/${total}`],
      ["TYER", year],
      ["TCON", "Electronic"],
    ];

    let jpeg = null;
    if (arte) {
      jpeg = await sharp(arte.ruta).resize(ART_MAX, ART_MAX, { fit: "cover" }).jpeg({ quality: 88 }).toBuffer();
    }

    // --- WAV ---
    let notaWav = "sin portada";
    if (jpeg) {
      const antes = await md5Audio(wavPath);
      const salida = await etiquetarWav(wavPath, jpeg, tags);
      const prueba = path.join(tmp, nombre);
      await writeFile(prueba, salida);
      const despues = await md5Audio(prueba);
      if (antes !== despues || !antes) {
        await unlink(prueba).catch(() => {});
        throw new Error(`${nombre}: el audio cambiaría. Abortado, no se ha tocado nada.`);
      }
      await writeFile(wavPath, salida);
      await unlink(prueba).catch(() => {});
      notaWav = arte.propia ? "portada propia" : "portada del disco";
    }

    // --- MP3 ---
    const mp3Path = path.join(MP3, `${path.parse(nombre).name}.mp3`);
    const existe = await stat(mp3Path).then(() => true).catch(() => false);
    let notaMp3;
    if (existe && !force) {
      notaMp3 = "ya existía (--force para rehacer)";
    } else {
      const jpgTmp = path.join(tmp, `${num}.jpg`);
      if (jpeg) await writeFile(jpgTmp, jpeg);
      const meta = tags.filter(([, v]) => v).flatMap(([id, v]) => {
        const clave = { TIT2: "title", TPE1: "artist", TPE2: "album_artist", TALB: "album", TRCK: "track", TYER: "date", TCON: "genre" }[id];
        return ["-metadata", `${clave}=${v}`];
      });
      await run("ffmpeg", [
        "-y", "-loglevel", "error",
        "-i", wavPath,
        ...(jpeg ? ["-i", jpgTmp] : []),
        "-map", "0:a",
        ...(jpeg ? ["-map", "1:v", "-c:v", "copy", "-disposition:v", "attached_pic"] : []),
        "-c:a", "libmp3lame", "-b:a", "320k", "-ar", "44100",
        "-id3v2_version", "3", "-write_id3v1", "1",
        ...meta,
        mp3Path,
      ]);
      notaMp3 = existe ? "rehecho" : "creado";
    }

    console.log(`  ${num}  ${titulo.padEnd(16)} wav: ${notaWav.padEnd(18)} mp3: ${notaMp3}`);
  }

  console.log("\nListo. El PCM de los WAV no se ha modificado (verificado por md5).");
}

main().catch((e) => {
  console.error(`\n${e.message}`);
  process.exit(1);
});
