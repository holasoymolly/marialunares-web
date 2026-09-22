// Genera el registro de ISRC que exige SODINPRO.
//
// La obligación que viene con el código de registrante DO-A1R es llevar, por
// cada ISRC emitido: código, artista, título, versión, duración, tipo y año.
// Ese registro NO se lleva a mano en una hoja aparte: se genera desde
// releases.ts, que ya es la única fuente de verdad del catálogo. Así no hay dos
// listas que se contradigan.
//
// El ISRC identifica una GRABACIÓN, no un lanzamiento: por eso un sencillo
// lleva el suyo en el release y un EP lleva uno por pista.
//
// Uso:
//   node scripts/registro-isrc.mjs                    → lo imprime
//   node scripts/registro-isrc.mjs > ../gestion/06-apoyos-y-fondos/registro-isrc.csv
import { releases } from "../src/data/releases.ts";

const ARTISTA = "Maria Lunares";

const mmss = (s) =>
  s == null ? "" : `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

// Una fila por grabación. Un release con `tracks` aporta una fila por pista;
// uno sin `tracks` es un sencillo y aporta la suya.
const filas = releases.flatMap((r) =>
  r.tracks?.length
    ? r.tracks.map((t) => ({
        isrc: t.isrc,
        titulo: t.title,
        version: r.title, // el EP o álbum al que pertenece
        duracion: t.durationSeconds,
        anio: r.year,
      }))
    : [{ isrc: r.isrc, titulo: r.title, version: "", duracion: r.durationSeconds, anio: r.year }],
);

const sinCodigo = filas.filter((f) => !f.isrc);
if (sinCodigo.length) {
  console.error(`AVISO: ${sinCodigo.length} grabación(es) sin ISRC: ${sinCodigo.map((f) => f.titulo).join(", ")}`);
}

const esc = (v) => (String(v ?? "").includes(",") ? `"${v}"` : String(v ?? ""));
const cab = ["isrc", "artista", "titulo", "version", "duracion", "tipo", "anio_publicacion"];

console.log(cab.join(","));
for (const f of filas.sort((a, b) => String(a.isrc).localeCompare(String(b.isrc)))) {
  console.log([f.isrc, ARTISTA, f.titulo, f.version, mmss(f.duracion), "audio", f.anio].map(esc).join(","));
}
