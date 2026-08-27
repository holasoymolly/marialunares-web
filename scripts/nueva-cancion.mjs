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

const LEEME = (slug) => `Deja aquí:

- \`coverart/ml-${slug}-00-ep.png\` — la portada del release, a máxima
  resolución y cuadrada. El "00" es lo que marca cuál es la del disco: el
  optimizador la busca por ahí y la convierte en
  public/images/covers/ml-${slug}-coverart.webp.
- \`coverart/ml-${slug}-01-<tema>.png\`, \`-02-\`, \`-03-\`… — la portada de cada
  pista, si las tiene. No van a la web: se incrustan en los archivos de audio.
- \`audio/wav/\` — los másters.
- \`audio/mp3/\` — las versiones para quien compre desde el móvil.
- \`extras/\` — artes alternativos, stems, lo que sea.
- \`NOTAS.md\` — rellénalo con el año, la letra, los créditos y los enlaces.

Los nombres de \`coverart/\` y de \`audio/\` deben llevar el mismo número de
pista, para poder emparejarlos.
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

for (const sub of ["audio/wav", "audio/mp3", "coverart", "extras"]) {
  await mkdir(path.join(dir, sub), { recursive: true });
}
await writeFile(path.join(dir, "NOTAS.md"), NOTAS(slug));
await writeFile(path.join(dir, "LEEME.md"), LEEME(slug));

console.log(`Listo: ${dir}

  1. La portada del disco en ${dir}/coverart/ml-${slug}-00-ep.png
  2. El audio en ${dir}/audio/wav/ y ${dir}/audio/mp3/
  3. Rellena ${dir}/NOTAS.md
  4. Avísame y monto la página.
`);
