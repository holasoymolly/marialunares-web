// Pone en minúsculas y con guiones los nombres de archivo de estudio/canciones.
//
// POR DEFECTO NO TOCA NADA: enseña lo que haría. Hay que pasarle --aplicar.
//
// La comprobación que importa es la de colisiones: si dos archivos distintos
// acabaran con el mismo nombre, aborta sin renombrar ninguno. Renombrar sobre
// un archivo existente lo destruye sin aviso, y estudio/ está fuera de git, así
// que no habría forma de recuperarlo.
//
// Uso: node scripts/normalizar-nombres.mjs [slug] [--aplicar]
import { readdir, rename, access } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const run = promisify(execFile);
const BASE = "estudio/canciones";
const SUBDIRS = ["coverart", "lemon-squeezy", "audio/wav", "audio/mp3", "extras"];
const AUDIO = new Set([".wav", ".mp3", ".flac", ".aiff"]);

const args = process.argv.slice(2);
const aplicar = args.includes("--aplicar");
const soloSlug = args.find((a) => !a.startsWith("--"));

function slugify(s) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // "MariaLunaresSol" -> "Maria Lunares Sol": sin esto, un nombre pegado se
    // queda ilegible al pasarlo a minúsculas.
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

// El nombre destino conserva SIEMPRE lo que distingue al archivo. Solo se
// normaliza la forma: minúsculas, sin acentos, guiones en vez de espacios.
function destino(file) {
  const ext = path.extname(file).toLowerCase();
  return slugify(path.parse(file).name) + ext;
}

async function md5(f) {
  try {
    const { stdout } = await run("ffmpeg", ["-v", "error", "-i", f, "-map", "0:a", "-f", "md5", "-"]);
    return stdout.trim();
  } catch {
    return null;
  }
}

const existe = (f) => access(f).then(() => true).catch(() => false);

async function main() {
  const slugs = (await readdir(BASE, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((s) => !soloSlug || s === soloSlug);

  const plan = [];
  const problemas = [];

  for (const slug of slugs) {
    for (const rel of SUBDIRS) {
      const dir = path.join(BASE, slug, rel);
      const files = (await readdir(dir).catch(() => [])).filter((f) => f !== ".DS_Store");

      const porDestino = new Map();
      for (const f of files) {
        const nuevo = destino(f);
        if (!porDestino.has(nuevo)) porDestino.set(nuevo, []);
        porDestino.get(nuevo).push(f);
      }

      for (const [nuevo, origenes] of porDestino) {
        // 1) Dos o más archivos que acabarían con el mismo nombre.
        if (origenes.length > 1) {
          problemas.push(`${dir}\n      ${origenes.join("\n      ")}\n      -> todos a "${nuevo}"`);
          continue;
        }
        const f = origenes[0];
        if (f === nuevo) continue;
        // 2) Ya existe otro archivo con ese nombre.
        const soloCambiaLaCaja = f.toLowerCase() === nuevo.toLowerCase();
        if (!soloCambiaLaCaja && (await existe(path.join(dir, nuevo)))) {
          problemas.push(`${dir}\n      "${f}" -> "${nuevo}", que YA EXISTE`);
          continue;
        }
        plan.push({ dir, de: f, a: nuevo });
      }
    }
  }

  if (problemas.length) {
    console.error("COLISIONES. No se ha renombrado nada:\n");
    for (const p of problemas) console.error(`  ${p}\n`);
    console.error(
      "Renombra a mano lo que colisiona para que cada archivo tenga un nombre\n" +
        "propio, y vuelve a ejecutar. Nada de estudio/ está en git."
    );
    process.exit(1);
  }

  if (!plan.length) {
    console.log("Todos los nombres están ya normalizados.");
    return;
  }

  console.log(aplicar ? "Renombrando:\n" : "Se renombraría (nada tocado; usa --aplicar):\n");
  for (const { dir, de, a } of plan) {
    if (!aplicar) {
      console.log(`  ${dir}/\n    ${de}\n    -> ${a}\n`);
      continue;
    }
    const antes = path.join(dir, de);
    const despues = path.join(dir, a);
    const esAudio = AUDIO.has(path.extname(de).toLowerCase());
    const h1 = esAudio ? await md5(antes) : null;
    if (de.toLowerCase() === a.toLowerCase()) {
      const puente = path.join(dir, `.tmp-${a}`);
      await rename(antes, puente);
      await rename(puente, despues);
    } else {
      await rename(antes, despues);
    }
    const h2 = esAudio ? await md5(despues) : null;
    const ok = !esAudio || (h1 && h1 === h2);
    console.log(`  ${ok ? "OK" : "!!"}  ${de}\n      -> ${a}`);
  }

  if (!aplicar) console.log(`${plan.length} archivo(s). Ejecuta con --aplicar para hacerlo.`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
