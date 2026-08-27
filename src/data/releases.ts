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
  /** Rol aparte de la mezcla, aunque a menudo lo firme la misma persona. */
  mastering?: string;
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
    slug: "lejos",
    title: "Lejos",
    year: 2026,
    cover: "/images/covers/ml-lejos-coverart.webp",
    descriptionEs:
      "Marcharse cansada y abrir las alas igual. Lejos es dejar atrás las cenizas grises que te dieron y buscar el sol un pasito a la vez, aunque duela.",
    descriptionEn:
      "Leaving worn out and opening your wings anyway. Lejos is about leaving behind the grey ashes someone gave you and looking for the sun one small step at a time, even when it hurts.",
    lyrics: `[Verso 1]
Aunque yo
Llegue cansada
Abriré, abriré mis alas
Y volaré lejos de ti
Aunque yo llegue cansada

[Pre-Coro]
Y dejo atrás
Las cenizas grises
Las que fui coleccionando
Las que tú me diste

[Coro]
Lejos de tu sombra, lejos de tu voz
Me parto en pedazos, pero busco el sol
Un pasito a la vez, un pasito otra vez
Aunque duela, ya ves

[Verso 2]
Aunque yo
Llegue cansada
Abriré mis alas y expondré mi pecho
Y escucharás mis latidos
Aunque yo ya estaré muy lejos

[Pre-Coro]
Y dejo atrás
Las cenizas grises
Las que fui coleccionando
Las que tú me diste

[Coro]
Lejos de tu sombra, lejos de tu voz
Me parto en pedazos, pero busco el sol
Un pasito a la vez, un pasito otra vez
Aunque duela, ya ves

[Instrumental]

[Puente]
Cierro mis ojos y el aire pesa
Un río sin agua que igual me atraviesa
El pecho cansado, buscando y buscando
Mi alma que se entrega y se desvela

[Coro]
Lejos de tu sombra, lejos de tu voz
Me parto en pedazos, pero busco el sol
Un pasito a la vez, un pasito otra vez
Aunque duela, ya ves`,
    credits: {
      writtenBy: "Maria Lunares",
      mix: "Maria Lunares",
      mastering: "Cryo Mix",
      cover: "Molly Yllom",
    },
    links: {
      bandcamp: "https://marialunares.bandcamp.com/track/lejos",
      soundcloud: "https://soundcloud.com/marialunares/lejos",
      youtube: "https://youtu.be/np_QGVpW8iA",
    },
    checkoutUrl:
      "https://marialunares.lemonsqueezy.com/checkout/buy/4c1fe1ee-6a83-4c14-8da2-9d80939ab2e5",
    externalUrl: "https://hypeddit.com/7cfw0z",
    soundcloudTrackUrl: "https://soundcloud.com/marialunares/lejos",
    hasPage: true,
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
      mastering: "Cryo Mix",
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
    slug: "de-noche",
    title: "De Noche",
    year: 2025,
    cover: "/images/covers/ml-de-noche-coverart.webp",
    descriptionEs:
      "De Noche es la historia de ML, un ser que cae a la Tierra y busca su luz interior en un mundo oscuro que no conoce. Cuatro pistas de trip-hop, electrónica y sonidos espaciales que recorren la dualidad entre esa oscuridad de adentro y la luz de la Luna que la guía.",
    descriptionEn:
      "De Noche is the story of ML, a being who falls to Earth and searches for her inner light in a dark world she doesn't know. Four tracks of trip-hop, electronica and spatial sounds tracing the duality between that darkness within and the light of the Moon that guides her.",
    tracks: [
      {
        title: "Asfalto",
        soundcloudTrackUrl: "https://soundcloud.com/marialunares/01-asfalto-de-noche",
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
        soundcloudTrackUrl: "https://soundcloud.com/marialunares/02-andando-de-noche",
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
        soundcloudTrackUrl: "https://soundcloud.com/marialunares/humo-de-noche",
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
        soundcloudTrackUrl: "https://soundcloud.com/marialunares/04-fantasmas-de-noche",
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
    credits: {
      writtenBy: "Maria Lunares",
      mix: "Romnie Abreu",
      mastering: "Romnie Abreu",
      cover: "Isis Ramírez & Ricardo Torres",
    },
    links: {
      bandcamp: "https://marialunares.bandcamp.com/album/de-noche",
      soundcloud: "https://soundcloud.com/marialunares/sets/de-noche",
      youtube:
        "https://www.youtube.com/watch?v=4rwvryIMs4o&list=PLTqHMTT-k-sF36fA0-edzL7zwMXYQh4pS",
    },
    checkoutUrl:
      "https://marialunares.lemonsqueezy.com/checkout/buy/496b0382-2660-4001-854a-cacf3fa1a3dd",
    externalUrl: "https://hypeddit.com/l3psaf",
    hasPage: true,
  },
  {
    slug: "sol-trips",
    title: "Sol: Trips",
    year: 2023,
    cover: "/images/covers/ml-sol-trips-coverart.webp",
    descriptionEs:
      "La misma canción atravesada por cinco cabezas distintas. Arialdo AP, Maria Lunares, Mkni, Romnie y Ben Garcia remezclan Sol y la llevan de lo lento a lo agresivo y lo experimental, sin repetirse.",
    descriptionEn:
      "The same song run through five different heads. Arialdo AP, Maria Lunares, Mkni, Romnie and Ben Garcia remix Sol, taking it from slow to aggressive and experimental, never repeating themselves.",
    tracks: [
      { title: "Sol (A Trip x Arialdo AP)" },
      { title: "Sol (A Trip x Maria Lunares)" },
      { title: "Sol (A Trip x Mkni)" },
      { title: "Sol (A Trip x Romnie)" },
      { title: "Sol (A Trip x Ben Garcia)" },
    ],
    credits: {
      writtenBy: "Maria Lunares",
      mix: "Romnie Abreu",
      mastering: "Romnie Abreu",
      cover: "Molly Yllom",
    },
    checkoutUrl:
      "https://marialunares.lemonsqueezy.com/checkout/buy/373bbd6d-b912-46e5-b26e-2837209614a5",
    externalUrl: "https://hypeddit.com/jz5sqo",
    hasPage: true,
  },
  {
    // TODO: falta el año de publicación y los enlaces por plataforma.
    slug: "sol",
    title: "Sol",
    cover: "/images/covers/ml-sol-coverart.webp",
    descriptionEs:
      "Amor sin ironía. Sol es la admiración por alguien que calienta como el sol y quema igual, y el asombro de haberse encontrado por una casualidad que nadie esperaba.",
    descriptionEn:
      "Love without irony. Sol is about admiring someone who warms you like the sun and burns just the same, and the wonder of having met by a chance nobody saw coming.",
    lyrics: `[Intro]
(Instrumental)

[Verso 1]
Eres como el Sol
Que calienta la Luna
Y en las noches más frías
Me abrigas tú

[Verso 2]
Eres como el Sol
Radiante pero quema
Tan lejos y aún puedo
Sentirte en mi piel

[Coro]
Y yo quiero saber si tú entiendes cómo fue esto
Explícame cómo respiro este aire tan denso
El aire que se vuelve ligero cuando tú no estás
Explícamelo, que no lo entiendo

[Verso 3]
Eres como el Sol
Y yo un simple mortal
Y si me acerco mucho
Puedo estallar

[Verso 4]
Eres como el Sol
Pura vitamina
Y te juro que la ciencia dice
Que mi piel te necesita

[Coro]
Y yo quiero saber si tú entiendes cómo fue esto
Explícame cómo respiro este aire tan denso
El aire que se vuelve ligero cuando tú no estás
Explícamelo, que no lo entiendo

[Puente]
Nah nah nah nah
Que no lo entiendo
Nah nah nah nah
Que no lo entiendo

[Interludio]
(Instrumental)

[Outro]
(Instrumental)`,
    credits: {
      writtenBy: "Maria Lunares",
      mix: "Romnie Abreu",
      mastering: "Romnie Abreu",
      cover: "Molly Yllom",
    },
    checkoutUrl:
      "https://marialunares.lemonsqueezy.com/checkout/buy/8b9cf9a2-0aac-469d-bd11-5db3b92ba840",
    externalUrl: "https://hypeddit.com/uz51hf",
    hasPage: true,
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
