// Crea la carpeta de trabajo de una canción nueva dentro de estudio/.
//
// estudio/ está en .gitignore, así que la plantilla de NOTAS.md vive aquí,
// en el repo, y no dentro de la propia carpeta ignorada: así sobrevive a un
// cambio de máquina.
//
// Uso: node scripts/nueva-cancion.mjs <slug>
import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const BASE = "estudio/canciones";

const NOTAS = (slug) => `# ${slug}

Rellena lo que sepas y deja en blanco lo que no. Lo que quede vacío
simplemente no aparecerá en la página.

## Datos

- **Título exacto** (con acentos):
- **Slug** (la URL): ${slug}
- **Año de publicación original**:
- **Año de reedición** (solo si es una nueva versión):

## Descripción

Dos o tres frases. Se muestran en la página y también las usa Google como
descripción del resultado de búsqueda, así que que funcionen sueltas.

**En español:**


**En inglés** (si la dejas vacía, la traduzco yo):


## Letra

Pégala tal cual, con sus saltos de línea. Si marcas partes entre corchetes
—\`[Coro]\`, \`[Verso 2]\`— se muestran atenuadas.

\`\`\`

\`\`\`

## Créditos

- **Escrito por**:
- **Mezcla**:
- **Portada**:

## Enlaces

- **Bandcamp**:
- **SoundCloud** (para el reproductor de la página):
- **YouTube**:
- **Smart link de Hypeddit** (si existe):

## Venta

- **URL de checkout de Lemon Squeezy**:

Si aún no tienes el producto creado, déjalo en blanco: la página sale con el
botón "Próximamente" y lo enchufamos después.
`;

const LEEME = `Deja aquí:

- \`portada.png\` (o .jpg / .webp) — la portada a máxima resolución, cuadrada.
  El optimizador la convierte sola en /images/covers/ml-<slug>-coverart.webp.
- \`audio/\` — el archivo que recibe quien compra (WAV, MP3 o un ZIP con ambos).
- \`extras/\` — cualquier otra cosa: fotos, artes alternativos, stems.
- \`NOTAS.md\` — rellénalo con el año, la letra, los créditos y los enlaces.
`;

const slug = process.argv[2];

if (!slug) {
  console.error("Falta el slug.\n\n  node scripts/nueva-cancion.mjs mi-cancion\n");
  process.exit(1);
}

if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error(
    `"${slug}" no vale como slug.\n` +
      "Solo minúsculas, números y guiones: sin acentos, sin espacios, sin ñ.\n" +
      "Ejemplo: sabes-correr\n"
  );
  process.exit(1);
}

const dir = path.join(BASE, slug);

try {
  await stat(dir);
  console.error(`Ya existe ${dir}. No toco nada.`);
  process.exit(1);
} catch {
  // no existe: seguimos
}

await mkdir(path.join(dir, "audio"), { recursive: true });
await mkdir(path.join(dir, "extras"), { recursive: true });
await writeFile(path.join(dir, "NOTAS.md"), NOTAS(slug));
await writeFile(path.join(dir, "LEEME.md"), LEEME);

console.log(`Listo: ${dir}

  1. Deja la portada como ${dir}/portada.png
  2. El audio a vender en ${dir}/audio/
  3. Rellena ${dir}/NOTAS.md
  4. Avísame y monto la página.
`);
