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
  /**
   * Autoría de la canción. Opcional para las versiones de canciones ajenas:
   * ahí el autor original ya va nombrado en la descripción, y no se pone un
   * compositor que no esté verificado.
   */
  writtenBy?: string;
  mix: string;
  /** Rol aparte de la mezcla, aunque a menudo lo firme la misma persona. */
  mastering?: string;
  /** Quien hizo la portada (creación, edición y diseño). */
  cover: string;
  /** Autor de la foto de la portada, si la portada parte de una foto ajena. */
  coverPhoto?: string;
}

/**
 * Una pista dentro de un EP o álbum. Un sencillo no las usa: pone su letra
 * directamente en `lyrics`.
 */
export interface Track {
  title: string;
  /**
   * ISRC de esta grabación. El código de registrante `DO-A1R` es propio (lo
   * emitió SODINPRO), así que los asignamos nosotras: DO-A1R-<año de
   * asignación>-<designación de 5 cifras>. La designación no se reutiliza jamás.
   */
  isrc?: string;
  /**
   * Duración en segundos. SODINPRO exige llevarla en el registro de cada ISRC,
   * así que vive aquí y no en una hoja aparte que se desincroniza.
   */
  durationSeconds?: number;
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
  /**
   * Cita textual; la plantilla le pone las comillas. Es opcional: una emisión
   * de radio puede no dejar ninguna frase citable.
   */
  quote?: string;
  /** Quien firma la reseña, o quien programó la canción al aire. */
  author: string;
  /** Medio o emisora. */
  outlet: string;
  /** Programa dentro de la emisora, si lo tiene. */
  show?: string;
  /** Fecha en ISO (YYYY-MM-DD). La plantilla la formatea según el idioma. */
  date?: string;
  /** Enlace al original: la reseña publicada, el clip de la emisión. */
  url?: string;
  /**
   * Una emisión de radio no es una reseña: se presenta como el hecho de que la
   * canción sonó («Sonó en KEXP…») y la cita, si la hay, va debajo.
   */
  broadcast?: boolean;
}

export interface Release {
  /** Identificador en la URL: /musica/<slug>. */
  slug: string;
  title: string;
  /** Año de publicación original. Opcional mientras no esté confirmado. */
  year?: number;
  /** Año de la nueva versión, si la canción se reeditó. */
  reissueYear?: number;
  /**
   * ISRC del sencillo. Un EP o álbum no lo usa: el ISRC identifica una
   * grabación, no un lanzamiento, así que ahí cada pista lleva el suyo en
   * `tracks`.
   */
  isrc?: string;
  /**
   * Duración en segundos. SODINPRO exige llevarla en el registro de cada ISRC,
   * así que vive aquí y no en una hoja aparte que se desincroniza.
   */
  durationSeconds?: number;
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
  /**
   * Precio en dólares, el mismo que cobra Lemon Squeezy. Se enseña en el botón
   * para que nadie llegue al checkout sin saber lo que cuesta. Si se cambia el
   * precio en Lemon Squeezy, hay que cambiarlo aquí: no se lee de su API.
   */
  priceUsd?: number;
  /** Pista de SoundCloud para el adelanto embebido de la página. */
  soundcloudTrackUrl?: string;
  /**
   * ID numérico del disco en Bandcamp (sin la «a» delante). Para lo que no está
   * en SoundCloud, como los demos: la página monta el reproductor de Bandcamp
   * con la lista de pistas. Se ve en el HTML de la página del disco, en
   * `data-tralbum` → `id`, o en Tools → Track/Album Codes.
   */
  bandcampAlbumId?: string;
  /**
   * Solo para escuchar: la página no ofrece compra ni «Próximamente». Para las
   * versiones de canciones de otros autores, que no se venden sin su licencia.
   */
  listenOnly?: boolean;
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
    isrc: "DO-A1R-26-00012",
    durationSeconds: 291,
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
    // Primera emisión de la campaña de radio de septiembre. Alex Marrero no
    // dijo nada citable al aire, así que va solo el hecho. Sin enlace: el
    // episodio deja de estar a demanda hacia el 11 de octubre y «Escuchar el
    // clip» quedaría apuntando a una playlist sin audio. Fuente verificada:
    // kutx.org/episodes/horizontes-9-27-26/
    press: {
      author: "Alex Marrero",
      outlet: "KUTX",
      show: "Horizontes",
      date: "2026-09-27",
      broadcast: true,
    },
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
    priceUsd: 1.5,
    externalUrl: "https://hypeddit.com/7cfw0z",
    soundcloudTrackUrl: "https://soundcloud.com/marialunares/lejos",
    hasPage: true,
  },
  {
    slug: "sabes-correr",
    title: "Sabes Correr",
    year: 2017,
    isrc: "DO-A1R-26-00001",
    durationSeconds: 270,
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
      writtenBy: "Maria Lunares",
      mix: "Cryo Mix",
      mastering: "Cryo Mix",
      cover: "Molly Yllom",
    },
    links: {
      bandcamp: "https://marialunares.bandcamp.com/track/sabes-correr",
      soundcloud: "https://soundcloud.com/marialunares/sabescorrer",
      youtube: "https://youtu.be/Ql-CUR6wggk",
    },
    soundcloudTrackUrl: "https://soundcloud.com/marialunares/sabescorrer",
    // Estreno en El Sonido (KEXP). Se cita un extracto de lo que dijo Albina
    // Cabrera al aire, no la presentación entera; los puntos suspensivos marcan
    // lo que se omite. Se conserva tal cual se dijo, en inglés y español
    // mezclados, también en la versión inglesa de la página.
    press: {
      quote:
        "Dominican shoegaze?! That sounds like something that I would love… So I really want to introduce the next artist for the first time here en el aire del Sonido.",
      author: "Albina Cabrera",
      outlet: "KEXP",
      show: "El Sonido",
      date: "2026-09-07",
      broadcast: true,
    },
    checkoutUrl: "https://marialunares.lemonsqueezy.com/checkout/buy/3d3adc09-ffe6-4384-be81-2b0d4d5d0bd5",
    priceUsd: 1.5,
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
        isrc: "DO-A1R-26-00008",
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
        isrc: "DO-A1R-26-00009",
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
        isrc: "DO-A1R-26-00010",
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
        isrc: "DO-A1R-26-00011",
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
    priceUsd: 6.0,
    externalUrl: "https://hypeddit.com/l3psaf",
    hasPage: true,
  },
  {
    slug: "jueves",
    title: "Jueves (A trip x Maria Lunares)",
    year: 2023,
    cover: "/images/covers/ml-jueves-coverart.webp",
    descriptionEs:
      "Versión de «Jueves», de El Trío de Omar Rodríguez López, pasada por Maria Lunares.",
    descriptionEn:
      "A rework of “Jueves” by El Trío de Omar Rodríguez López, run through Maria Lunares.",
    credits: {
      mix: "Surya Cabral",
      mastering: "Surya Cabral",
      cover: "Molly Yllom",
    },
    links: {
      bandcamp:
        "https://marialunares.bandcamp.com/track/el-tr-o-de-omar-rodr-guez-l-pez-jueves-a-trip-x-maria-lunares",
      soundcloud:
        "https://soundcloud.com/marialunares/el-trio-de-omar-rodriguez-lopez-jueves-a-trip-x-maria-lunares",
      youtube: "https://youtu.be/l_ovXctOwb4",
    },
    soundcloudTrackUrl:
      "https://soundcloud.com/marialunares/el-trio-de-omar-rodriguez-lopez-jueves-a-trip-x-maria-lunares",
    // Versión de una canción ajena: se escucha, no se vende.
    listenOnly: true,
    hasPage: true,
  },
  {
    slug: "salsa-pa-tu-lechon",
    title: "Salsa pa' tu Lechón (A trip x Maria Lunares)",
    year: 2023,
    cover: "/images/covers/ml-salsa-pa-tu-lechon-coverart.webp",
    descriptionEs:
      "Versión de «Salsa pa' tu lechón», de Johnny Ventura, pasada por Maria Lunares. En colaboración con Guarevel.",
    descriptionEn:
      "A rework of “Salsa pa' tu lechón” by Johnny Ventura, run through Maria Lunares. In collaboration with Guarevel.",
    credits: {
      mix: "Maria Lunares",
      mastering: "Maria Lunares",
      cover: "Molly Yllom",
    },
    links: {
      bandcamp:
        "https://marialunares.bandcamp.com/track/johnny-ventura-salsa-pa-tu-lech-n-a-trip-x-maria-lunares",
      soundcloud:
        "https://soundcloud.com/marialunares/johnny-ventura-salsa-pa-tu-lechon-a-trip-x-maria-lunares",
      youtube: "https://youtu.be/G1wMt_1MMrY",
    },
    soundcloudTrackUrl:
      "https://soundcloud.com/marialunares/johnny-ventura-salsa-pa-tu-lechon-a-trip-x-maria-lunares",
    listenOnly: true,
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
      { title: "Sol (A Trip x Arialdo AP)", isrc: "DO-A1R-26-00002" },
      { title: "Sol (A Trip x Maria Lunares)", isrc: "DO-A1R-26-00003" },
      { title: "Sol (A Trip x Mkni)", isrc: "DO-A1R-26-00004" },
      { title: "Sol (A Trip x Romnie)", isrc: "DO-A1R-26-00005" },
      { title: "Sol (A Trip x Ben Garcia)", isrc: "DO-A1R-26-00006" },
    ],
    credits: {
      writtenBy: "Maria Lunares",
      mix: "Romnie Abreu",
      mastering: "Romnie Abreu",
      cover: "Molly Yllom",
    },
    links: {
      bandcamp: "https://marialunares.bandcamp.com/album/sol-trips",
      soundcloud: "https://soundcloud.com/marialunares/sets/sol-trips",
      youtube:
        "https://www.youtube.com/watch?v=G2AeCMqODLA&list=PLTqHMTT-k-sGb8LX0yqbJMfN_2bjH8M4U",
    },
    // El reproductor acepta una lista de SoundCloud igual que una pista suelta.
    soundcloudTrackUrl: "https://soundcloud.com/marialunares/sets/sol-trips",
    checkoutUrl:
      "https://marialunares.lemonsqueezy.com/checkout/buy/373bbd6d-b912-46e5-b26e-2837209614a5",
    priceUsd: 7.5,
    externalUrl: "https://hypeddit.com/jz5sqo",
    hasPage: true,
  },
  {
    slug: "sol",
    title: "Sol",
    year: 2024,
    // ISRC previo, asignado por la distribuidora en 2024. No se reemplaza.
    isrc: "QZ-K6J-23-30648",
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
    links: {
      bandcamp: "https://marialunares.bandcamp.com/track/sol",
      soundcloud: "https://soundcloud.com/marialunares/sol",
      youtube: "https://youtu.be/SXA7ElJeK60",
    },
    soundcloudTrackUrl: "https://soundcloud.com/marialunares/sol",
    checkoutUrl:
      "https://marialunares.lemonsqueezy.com/checkout/buy/8b9cf9a2-0aac-469d-bd11-5db3b92ba840",
    priceUsd: 1.5,
    externalUrl: "https://hypeddit.com/uz51hf",
    hasPage: true,
  },
  {
    slug: "sabes",
    title: "Sabes",
    year: 2021,
    // ISRC previo, asignado por la distribuidora. No se reemplaza.
    isrc: "QZ-ES8-21-96511",
    durationSeconds: 358,
    cover: "/images/covers/ml-sabes-coverart.webp",
    descriptionEs:
      "Un sueño. Alguien se ahoga en la orilla, alguien lo lleva otra vez al mar, y al final no se sabe quién salvó a quién.",
    descriptionEn:
      "A dream. Someone drowning at the shore, someone carrying them back to the sea, and in the end nobody knows who saved whom.",
    lyrics: `Te encontré en la orilla del mar
Agonizando y yo queriéndote salvar
Me dijiste "no puedo respirar,
Llévame otra vez al mar"

Tú sabes, tú sabes bien
Tú sabes a canela y miel
Y tú sabes cómo envolverme

Y yo te llevé y no miré atrás
¿Tú sabes cuánto tiempo tuve que esperar?
Para ser yo quien no pueda respirar
Me terminaste salvando tú, ¿quién lo iba a imaginar?

Tú sabes, tú sabes bien
Tú sabes a canela y miel
Y tú sabes cómo envolverme`,
    credits: {
      writtenBy: "Maria Lunares",
      mix: "Maria Lunares",
      mastering: "Maria Lunares",
      cover: "Molly Yllom",
    },
    links: {
      bandcamp: "https://marialunares.bandcamp.com/track/sabes",
      soundcloud: "https://soundcloud.com/marialunares/sabes",
      youtube: "https://youtu.be/fFe3-0NHnVg",
    },
    soundcloudTrackUrl: "https://soundcloud.com/marialunares/sabes",
    checkoutUrl:
      "https://marialunares.lemonsqueezy.com/checkout/buy/d3f13b02-6aa8-4053-ada4-9d50dfcb50d3",
    priceUsd: 1.5,
    hasPage: true,
  },
  {
    slug: "luna",
    title: "Luna",
    year: 2020,
    cover: "/images/covers/ml-luna-coverart.webp",
    descriptionEs:
      "Dos fases de la misma canción: llena y cuarto menguante.",
    descriptionEn:
      "Two phases of the same song: full and waning.",
    tracks: [
      {
        title: "Luna (Llena)",
        isrc: "QZ-HNB-20-67146",
        durationSeconds: 353,
        soundcloudTrackUrl: "https://soundcloud.com/marialunares/luna-llena",
        lyrics: `Déjame ver
Cómo se ve

Déjame ver
Cómo se ve tu piel
Bajo la luna

Sé que no te puedo bajar del cielo las estrellas
Pero déjame probar tus labios debajo de ellas`,
      },
      {
        title: "Luna (Cuarto Menguante)",
        isrc: "QZ-HNB-20-67148",
        durationSeconds: 353,
        soundcloudTrackUrl: "https://soundcloud.com/marialunares/luna-cuarto-menguante",
      },
    ],
    credits: {
      writtenBy: "Maria Lunares",
      mix: "Maria Lunares",
      mastering: "Maria Lunares",
      cover: "Molly Yllom",
      coverPhoto: "Amaury Díaz",
    },
    links: {
      bandcamp: "https://marialunares.bandcamp.com/album/luna",
      youtube: "https://youtu.be/PV50x6TTWKA",
    },
    checkoutUrl:
      "https://marialunares.lemonsqueezy.com/checkout/buy/f12d21f6-22ff-4bde-bd6b-a8d2ca0f2a9a",
    priceUsd: 1.5,
    hasPage: true,
  },
  {
    slug: "sombra",
    title: "Sombra",
    year: 2020,
    // ISRC previo, asignado por la distribuidora. No se reemplaza.
    isrc: "QZ-HN8-20-10707",
    durationSeconds: 533,
    cover: "/images/covers/ml-sombra-coverart.webp",
    descriptionEs:
      "Nadar otra vez contra la corriente del mismo río. Y una calma que cuelga del alma como una sombra.",
    descriptionEn:
      "Swimming against the same river's current, one more time. And a calm that hangs from the soul like a shadow.",
    lyrics: `¿Cuántas veces voy a nadar
Contra la corriente de este río?
¿Cuántas piedras más voy a lanzar
Al vacío de este río?

Llevo una calma
Como una sombra
Que cuelga de mi alma`,
    credits: {
      writtenBy: "Maria Lunares",
      mix: "Cino",
      mastering: "Cino",
      cover: "Molly Yllom",
    },
    links: {
      bandcamp: "https://marialunares.bandcamp.com/track/sombra",
      soundcloud: "https://soundcloud.com/marialunares/sombra",
      youtube: "https://youtu.be/MZ3GH9DKR6c",
    },
    soundcloudTrackUrl: "https://soundcloud.com/marialunares/sombra",
    checkoutUrl:
      "https://marialunares.lemonsqueezy.com/checkout/buy/84f5d79f-43df-47aa-8a3b-9d1590b7a51e",
    priceUsd: 1.5,
    hasPage: true,
  },
  {
    slug: "raices",
    title: "Raíces",
    year: 2020,
    // ISRC previo, asignado por la distribuidora. No se reemplaza.
    isrc: "QZ-HN4-20-97705",
    durationSeconds: 347,
    cover: "/images/covers/ml-raices-coverart.webp",
    descriptionEs:
      "Un punto azul en medio de un abismo. Raíces es venir de dos ramas profundas y que igual todos digan que pareces de otro lugar.",
    descriptionEn:
      "A blue dot in the middle of an abyss. Raíces is about coming from two deep roots and still having everyone say you look like you're from somewhere else.",
    lyrics: `Vivo en un punto azul
En medio de un abismo
Donde desde hace mucho tiempo
Y hasta el día de hoy
Hay partes de mí

Flotando
Rozando
Explotando
Con partes de ti

Nací del resultado de
Dos raíces, dos ramas profundas
Y aunque me considere un espejo
Todos dicen que
Parezco de otro lugar

Flotando
Rozando
Explotando
Con partes de ti

Siento que soy las raíces
También siento que soy el abismo
Que fui hace mucho tiempo
Y aun soy hoy

Que soy de donde soy
Y de donde no vengo
También soy
También soy`,
    credits: {
      writtenBy: "Maria Lunares",
      mix: "Cino",
      mastering: "Cino",
      cover: "Molly Yllom",
    },
    links: {
      bandcamp: "https://marialunares.bandcamp.com/track/ra-ces",
      soundcloud: "https://soundcloud.com/marialunares/raices",
      youtube: "https://youtu.be/o-nTgMCuISE",
    },
    soundcloudTrackUrl: "https://soundcloud.com/marialunares/raices",
    checkoutUrl:
      "https://marialunares.lemonsqueezy.com/checkout/buy/2e3cfe12-4c0a-4b09-a530-147ab0f4e429",
    priceUsd: 1.5,
    hasPage: true,
  },
  {
    slug: "maria-lunares-demos",
    title: "Maria Lunares (Demos)",
    year: 2016,
    cover: "/images/covers/ml-maria-lunares-demos-coverart.webp",
    // La descripción y la dedicatoria son las de Bandcamp, escritas por ella.
    descriptionEs:
      "Compilado de canciones creadas entre 2010 y 2016. A todo el que me ha motivado a publicar esta maña mía de expresarme a través de las ondas sonoras: gracias.",
    descriptionEn:
      "Songs made between 2010 and 2016. To everyone who pushed me to put out this habit of mine of speaking through sound waves: thank you.",
    tracks: [
      {
        title: "Va y viene",
        isrc: "DO-A1R-26-00013",
        durationSeconds: 337,
        lyrics: `Siento que la vida se me va
Poco a poco tú también

No sé porqué la vida se me va
Poco a poco te quedas

Impregnada, mi memoria
Mi memoria de ti
Congelada tu inocencia
Tu decadencia en mí`,
      },
      {
        title: "Lágrimas",
        isrc: "DO-A1R-26-00014",
        durationSeconds: 305,
        lyrics: `Tan fuerte
Tan frágil
Tan tú y yo

¿Por qué?`,
      },
      {
        title: "El Camino",
        isrc: "DO-A1R-26-00015",
        durationSeconds: 315,
        lyrics: `El camino es muy largo
El camino es muy corto
Eliges cosas en el camino
Y cosas te eligen en el camino

Luna, ¿dónde vas?
Luna, ¿dónde me llevas?
Luna

El camino no importa
Lo que importa: son los pasos
Las respuestas no importan
Lo que importa: son las preguntas

Luna, ¿dónde vas?
Luna, ¿dónde me llevas?
Luna`,
      },
      {
        title: "La Villana",
        isrc: "DO-A1R-26-00016",
        durationSeconds: 305,
        lyrics: `Contigo no sé por dónde empezar
Y contigo no sé por dónde terminar

En esta y otras historias
Yo siempre soy la villana
Y no importa lo que yo haga
Soy mala, mala, muy mala

Y es que me es tan fácil
Morir así, así, así
Pero me es tan difícil
Mantenerme así, así

Y tú, y tú, tú no me crees
Que yo soy frágil, que soy sensible
Pero está bien, huye, huye porque yo sé

Que en esta y otras historias
Yo siempre soy la villana
Y no importa lo que yo haga
Soy mala, mala, muy mala

Quién iba a decir
Que iba a morir tan fácil
Y quién iba a predecir
Que iba a ser tan fugaz, así, así`,
      },
      {
        title: "Eres",
        isrc: "DO-A1R-26-00017",
        durationSeconds: 309,
        lyrics: `Un simple trazo sonoro
Sale de mi alma enmudecida
Y se enreda entre tu ser
Y lo que queda, cenizas de mi ser

Me has llevado a que ya no siento nada
Y en medio de esta oscuridad me encuentro en ti

Y es que te has convertido en la metáfora
Que roza mis palabras y me desvanece
Y es que eres la realidad que me hace dormitar
En fantasías de esta vida misma

La sombra de tu luz
Me basta para sobrevivir en tu existencia
Y tratas de postrar
Ante tu corazón mi resistencia

Es un grado en el que ya no siento nada
Mientras mi mente cae hacia la gravedad vital

Y es que te has convertido en la metáfora
Que roza mis palabras y me desvanece
Y es que eres la realidad que me hace dormitar
En fantasías de esta vida misma`,
      },
      {
        title: "Invisible",
        isrc: "DO-A1R-26-00018",
        durationSeconds: 293,
        lyrics: `No sé
No sé
Si me ves

O si soy invisible`,
      },
      {
        title: "Una ola me abrazó",
        isrc: "DO-A1R-26-00019",
        durationSeconds: 363,
      },
    ],
    credits: {
      writtenBy: "Maria Lunares",
      mix: "Maria Lunares",
      mastering: "Maria Lunares",
      cover: "Molly Yllom",
    },
    links: {
      bandcamp: "https://marialunares.bandcamp.com/album/maria-lunares-demos",
      youtube: "https://youtu.be/9m13VLbqEWQ",
    },
    // No están en SoundCloud: se escuchan con el reproductor de Bandcamp.
    bandcampAlbumId: "761046385",
    checkoutUrl:
      "https://marialunares.lemonsqueezy.com/checkout/buy/ba1c25e1-d6ba-42e6-bb1e-66f09ccac6b1",
    priceUsd: 7,
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
