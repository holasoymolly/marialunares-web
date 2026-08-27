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

/**
 * Una pista dentro de un EP o álbum. Un sencillo no las usa: pone su letra
 * directamente en `lyrics`.
 */
export interface Track {
  title: string;
  /** Texto plano con saltos de línea. Las líneas [entre corchetes] se marcan solas. */
  lyrics?: string;
  /** Qué representa la pista dentro del concepto del disco. */
  noteEs?: string;
  noteEn?: string;
  /** Pista de SoundCloud para escucharla desde la página. */
  soundcloudTrackUrl?: string;
}

/**
 * Cita de prensa. Se guarda un extracto corto con su atribución y el enlace a
 * la reseña completa; el texto entero es de quien lo escribió, no nuestro.
 */
export interface ReleasePress {
  quote: string;
  author: string;
  outlet: string;
  url?: string;
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
  /**
   * Pistas del disco, en el orden en que se muestran. Solo para EPs y álbumes:
   * si está presente, la página las lista en lugar de una única letra.
   */
  tracks?: Track[];
  press?: ReleasePress;
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
    // TODO: confirmar el año de publicación y los créditos.
    slug: "de-noche",
    title: "De Noche",
    cover: "/images/covers/ml-de-noche-coverart.webp",
    descriptionEs:
      "De Noche es la historia de ML, un ser que cae a la Tierra y busca su luz interior en un mundo oscuro que no conoce. Cuatro pistas de trip-hop, electrónica y sonidos espaciales que recorren la dualidad entre esa oscuridad de adentro y la luz de la Luna que la guía.",
    descriptionEn:
      "De Noche is the story of ML, a being who falls to Earth and searches for her inner light in a dark world she doesn't know. Four tracks of trip-hop, electronica and spatial sounds tracing the duality between that darkness within and the light of the Moon that guides her.",
    tracks: [
      {
        title: "Asfalto",
        lyrics: `Donde las sombras fluyan
Bailando en la oscuridad
Debajo de las estrellas
Bailando en la oscuridad

[Coro]
Debajo del asfalto
Encuentro el ritmo
Pounding, pounding
Pounding, pounding`,
        noteEs: "La conexión de ML con la Tierra, donde se encuentra el ritmo.",
        noteEn: "ML's connection to the Earth, where the rhythm is found.",
      },
      {
        title: "Andando",
        lyrics: `[Verso]
Andando
Andando
Andando
Feeling it

[Coro Instrumental]`,
        noteEs:
          "La vida como un viaje donde los pasos no tienen fin: se guían por el instinto, por lo aprendido y por el ritmo al que dejas fluir las cosas.",
        noteEn:
          "Life as a journey where the steps never end: guided by instinct, by what you have learned, and by the rhythm you let things flow at.",
      },
      {
        title: "Humo",
        lyrics: `[Verso]
Rostros pasan pero están perdidos
Secretos que se esfuman con el humo
Mi rumbo lo veo yo
Laberinto resuelto

[Coro]
Aquí y ahora
El abismo es mío
Aunque no lo quieran ver
El abismo es mío`,
        noteEs:
          "La gente y sus secretos se pueden desvanecer, pero ML sigue su camino y conquista el abismo. Decir que el abismo le pertenece es reconocer el poder que da aceptar el caos y la oscuridad de adentro.",
        noteEn:
          "People and their secrets may fade, but ML keeps to her path and conquers the abyss. Saying the abyss is hers is recognising the power that comes from accepting the chaos and the darkness within.",
      },
      {
        title: "Fantasmas",
        lyrics: `[Verso]
Escondida me habla una luz
Siento el peso, es una cruz
En mi mente, el pecho se fuga
A ver si encuentra algo en la luna

[Coro]
Sueños con sombras
Tierras baldías
En el silencio
Están las almas`,
        noteEs:
          "Un momento de introspección: la luz y la oscuridad se encuentran, y la Luna guía a ML entre los sueños y las sombras que habitan su mente.",
        noteEn:
          "A moment of introspection: light and darkness meet, and the Moon guides ML through the dreams and shadows that live in her mind.",
      },
    ],
    // Extracto de la reseña de Discolai. Se cita una frase con atribución; el
    // texto completo es de su autor. Falta el enlace al original.
    press: {
      quote: "En este EP, ambos aspectos —la producción y la voz— se fusionan de manera perfecta.",
      author: "Max Cueto",
      outlet: "Discolai",
    },
    externalUrl: "https://hypeddit.com/l3psaf",
    hasPage: true,
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
