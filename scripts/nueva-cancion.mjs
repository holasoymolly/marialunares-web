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

const LEEME = (slug) => `Carpeta de trabajo de "${slug}". Nada de esto se sube
a git ni se despliega: aquí viven los originales.

## Dónde va cada cosa

| Carpeta | Qué guarda |
|---|---|
| \`coverart/\` | Portadas a máxima resolución. |
| \`audio/wav/\` | Los másters. |
| \`audio/mp3/\` | Las versiones para quien compre desde el móvil. |
| \`extras/\` | Artes alternativos, stems, lo que sea. |
| \`lemon-squeezy/\` | La imagen 1600x1200 de la ficha de tienda. |
| \`NOTAS.md\` | Año, letra, créditos y enlaces. Rellénalo. |

## Cómo nombrar los archivos

El nombre de los audios llega tal cual a quien compra, así que conviene que sea
presentable:

    audio/wav/Maria Lunares - <Título>.wav              (un sencillo)
    audio/wav/Maria Lunares - <Disco> - 01 <Tema>.wav   (un EP o álbum)

Las portadas se emparejan con el audio **por el número de pista**:

    coverart/ml-${slug}-00-ep.png        la del disco (el "00" la identifica)
    coverart/ml-${slug}-01-<tema>.png    la de la pista 01

Si solo hay una imagen en \`coverart/\`, no hace falta marcarla: se usa esa.

## Cuando esté todo

    node scripts/optimize-images.mjs
    node scripts/preparar-audio.mjs ${slug} --album "<Disco>" --year <AAAA>

El primero genera la portada de la web. El segundo incrusta la portada en cada
audio, crea el MP3 que falte y pone las etiquetas.
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

for (const sub of ["audio/wav", "audio/mp3", "coverart", "extras", "lemon-squeezy"]) {
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
