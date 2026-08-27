// Catálogo de releases (canciones y EPs).
//
// Esta es la ÚNICA fuente de verdad para /musica y para las páginas
// /musica/[slug]. Para publicar una canción nueva basta con añadir un objeto
// a `releases` (ver CLAUDE.md → "Añadir un release").
//
// Por qué el contenido vive aquí y no en src/i18n/translations.ts:
// translations.ts guarda las etiquetas de interfaz (Escuchar, Descargar,
// Letra, Créditos), que son fijas y pocas. El contenido por canción
// (descripciones ES/EN, letra, créditos, enlaces) crece con cada release y
// pertenece al catálogo, no al diccionario.

export interface ReleaseLinks {
  bandcamp?: string;
  soundcloud?: string;
  youtube?: string;
}

export interface ReleaseCredits {
  writtenBy: string;
  mix: string;
  cover: string;
}

export interface Release {
  /** Identificador en la URL: /musica/<slug>. */
  slug: string;
  title: string;
  /** Año de publicación original. Opcional mientras no esté confirmado. */
  year?: number;
  /** Año de la nueva versión, si la canción se reeditó. */
  reissueYear?: number;
  /** Ruta dentro de /public (usar siempre imágenes optimizadas). */
  cover: string;
  descriptionEs: string;
  descriptionEn: string;
  /** Texto plano con saltos de línea. Las líneas [entre corchetes] se marcan solas. */
  lyrics?: string;
  credits?: ReleaseCredits;
  links?: ReleaseLinks;
  /** Enlace de compra/descarga (Lemon Squeezy). Vacío = "Próximamente". */
  checkoutUrl?: string;
  /** Pista de SoundCloud para el adelanto embebido de la página. */
  soundcloudTrackUrl?: string;
  /** Smart link externo (Hypeddit) para releases que aún no tienen página propia. */
  externalUrl?: string;
  /**
   * Marca el release como listo para tener su propia página en /musica/[slug].
   * Mientras sea false (o falte), la portada de /musica enlaza a `externalUrl`.
   * Antes de ponerlo en true: rellena descriptionEs y descriptionEn.
   */
  hasPage?: boolean;
}

export const releases: Release[] = [
  {
    // TODO: confirmar año y añadir descripciones antes de activar hasPage.
    slug: "lejos",
    title: "Lejos",
    cover: "/images/covers/ml-lejos-coverart.webp",
    descriptionEs: "",
    descriptionEn: "",
    externalUrl: "https://hypeddit.com/7cfw0z",
    soundcloudTrackUrl: "https://soundcloud.com/marialunares/lejos",
  },
  {
    slug: "sabes-correr",
    title: "Sabes Correr",
    year: 2017,
    reissueYear: 2026,
    cover: "/images/covers/ml-sabes-correr-coverart.webp",
    descriptionEs:
      "Sabes Correr nació en 2017 y renace hoy, terminada como siempre debió sonar. Un adiós entre dos que corren en direcciones opuestas: trip-hop oscuro con guitarras, texturas psicodélicas y sonidos espaciales.",
    descriptionEn:
      "Sabes Correr was written in 2017 and is reborn today, finished the way it always should have sounded. A goodbye between two people running in opposite directions: dark trip-hop with guitars, psychedelic textures and spatial sounds.",
    lyrics: `No pierdas la esperanza de amarte a ti mismo
Yo no la he perdido, aunque a ti sí, aunque a ti sí
Sé que mil y una veces me he clavado tu estaca
En el pecho vacío, sin ti, sin ti

Nunca aprendí a decir adiós a un ser vivo
Los fantasmas de la noche son mis amigos
Pero de ser necesario, yo reconozco que
Como el coyote, yo sé matar, yo sé cazar

Y tú, tú sabes correr
Tú, tú, tú, tú, corres
Entre el olvido, ayer y hoy
Entre el olvido, ayer y hoy
Y tú, tú sabes correr
Tú, tú, tú, tú, corres por tu camino
Y yo corro por el mío
Y buena suerte, y buena suerte

Y buena suerte
Y buena suerte`,
    credits: {
      writtenBy: "Maria Lunares (Cinthya Paulino)",
      mix: "Cryo Mix",
      cover: "Maria Lunares (Cinthya Paulino)",
    },
    links: {
      bandcamp: "https://marialunares.bandcamp.com/track/sabes-correr",
      soundcloud: "https://soundcloud.com/marialunares/sabescorrer",
      youtube: "https://youtu.be/Ql-CUR6wggk",
    },
    soundcloudTrackUrl: "https://soundcloud.com/marialunares/sabescorrer",
    checkoutUrl: "https://marialunares.lemonsqueezy.com/checkout/buy/3d3adc09-ffe6-4384-be81-2b0d4d5d0bd5",
    // Se conserva el smart link anterior; al tener hasPage, la grid enlaza a la página propia.
    externalUrl: "https://hypeddit.com/wdp8t4",
    hasPage: true,
  },
  {
    // TODO: confirmar año y añadir descripciones antes de activar hasPage.
    slug: "de-noche",
    title: "De Noche",
    cover: "/images/covers/ml-de-noche-coverart.webp",
    descriptionEs: "",
    descriptionEn: "",
    externalUrl: "https://hypeddit.com/l3psaf",
  },
  {
    // TODO: confirmar título exacto y año antes de activar hasPage.
    slug: "sol-trips",
    title: "Sol Trips",
    cover: "/images/covers/ml-sol-trips-coverart.webp",
    descriptionEs: "",
    descriptionEn: "",
    externalUrl: "https://hypeddit.com/jz5sqo",
  },
  {
    // TODO: confirmar año y añadir descripciones antes de activar hasPage.
    slug: "sol",
    title: "Sol",
    cover: "/images/covers/ml-sol-coverart.webp",
    descriptionEs: "",
    descriptionEn: "",
    externalUrl: "https://hypeddit.com/uz51hf",
  },
];

/** Releases con página propia dentro del sitio. */
export function hasOwnPage(release: Release): boolean {
  return release.hasPage === true;
}

/** Busca un release por slug (usado por getStaticProps). */
export function getRelease(slug: string): Release | undefined {
  return releases.find((r) => r.slug === slug);
}

/**
 * Destino de la portada en /musica: página propia si está lista, si no el
 * smart link externo. Devuelve null si no hay ninguno de los dos.
 */
export function releaseHref(release: Release): string | null {
  if (hasOwnPage(release)) return `/musica/${release.slug}`;
  return release.externalUrl ?? null;
}
