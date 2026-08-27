// Diccionario bilingüe (ES/EN). El sitio es pequeño, así que usamos objetos
// planos en lugar de una librería de i18n.

export type Locale = "es" | "en";

export const LOCALES: Locale[] = ["es", "en"];
export const DEFAULT_LOCALE: Locale = "es";

type Dict = {
  nav: {
    sobre: string;
    musica: string;
    videos: string;
    fotos: string;
    tienda: string;
    contacto: string;
    newsletter: string;
  };
  // Identidad del proyecto: género y frase de lugar. Vive aparte de `meta`
  // porque se muestra en pantalla (home y /sobre), no solo en las etiquetas.
  //
  // Regla de copy: "neo-bolero" nunca va solo. Siempre acompañado de
  // trip-hop, electrónica, sonidos espaciales o experimental, para que no se
  // lea como bolero tradicional. Del bolero viene la lírica, no la
  // instrumentación.
  brand: { descriptorShort: string; descriptorLong: string; place: string };
  player: { play: string; label: string };
  langToggle: { label: string; toEs: string; toEn: string };
  meta: Record<
    "home" | "sobre" | "musica" | "videos" | "fotos" | "contacto",
    { title: string; description: string }
  >;
  contacto: { heading: string };
  // Página /sobre (en inglés, /about). El orden de los bloques es el de la
  // página: apertura, qué es el proyecto, el alter ego, la historia y el cierre.
  sobre: {
    eyebrow: string;
    whatLabel: string;
    what: string;
    mlLabel: string;
    ml: string;
    projectLabel: string;
    project: string;
    directLabel: string;
    direct: string;
  };
  // Formulario de newsletter (modal del Layout y CTA de las páginas de release).
  newsletter: {
    heading: string;
    emailLabel: string;
    placeholder: string;
    button: string;
    loading: string;
    success: string;
    error: string;
    close: string;
  };
  // Etiquetas de la plantilla de release. El contenido de cada canción
  // (descripción, letra, créditos, enlaces) vive en src/data/releases.ts.
  release: {
    back: string;
    listen: string;
    playPreview: string;
    previewLabel: string;
    download: string;
    comingSoon: string;
    lyrics: string;
    tracks: string;
    press: string;
    credits: string;
    links: string;
    writtenBy: string;
    mix: string;
    mastering: string;
    coverArt: string;
    coverAltPrefix: string;
    reissue: string;
    externalHint: string;
  };
};

export const translations: Record<Locale, Dict> = {
  es: {
    nav: {
      sobre: "Sobre",
      musica: "Música",
      videos: "Videos",
      fotos: "Fotos",
      tienda: "Tienda",
      contacto: "Contacto",
      newsletter: "Newsletter",
    },
    brand: {
      descriptorShort: "Neo-bolero espacial, trip-hop y electrónica",
      descriptorLong: "Neo-bolero, trip-hop, electrónica y sonidos espaciales",
      place: "Aterricé en el Caribe, pero no soy de aquí…",
    },
    player: { play: "Reproducir música", label: "Reproductor de música de fondo" },
    langToggle: { label: "Idioma", toEs: "ES", toEn: "EN" },
    meta: {
      home: {
        title: "Maria Lunares — Neo-bolero espacial, trip-hop y electrónica",
        description:
          "Maria Lunares — neo-bolero espacial: trip-hop, guitarras y sonidos espaciales. Escucha, descarga y compra directo.",
      },
      sobre: {
        title: "Sobre — Maria Lunares",
        description:
          "Maria Lunares es el proyecto musical de Cinthya (Molly) Paulino: neo-bolero espacial, la lírica del bolero escrita sobre trip-hop, electrónica y sonidos espaciales.",
      },
      musica: {
        title: "Música — Maria Lunares",
        description:
          "Escucha la música de Maria Lunares: neo-bolero espacial con trip-hop, guitarras con reverb y sonidos espaciales. Descarga y compra directo.",
      },
      videos: {
        title: "Videos — Maria Lunares",
        description:
          "Videos musicales de Maria Lunares: neo-bolero espacial, trip-hop, electrónica y sonidos espaciales.",
      },
      fotos: {
        title: "Fotos — Maria Lunares",
        description:
          "Galería de fotos de Maria Lunares, proyecto de neo-bolero espacial, trip-hop y electrónica.",
      },
      contacto: {
        title: "Contacto — Maria Lunares",
        description:
          "Ponte en contacto con Maria Lunares para colaboraciones y prensa. Neo-bolero espacial, trip-hop y electrónica.",
      },
    },
    contacto: { heading: "CONTACTO" },
    sobre: {
      eyebrow: "Sobre",
      whatLabel: "Qué es",
      what:
        "Maria Lunares es el proyecto musical de Cinthya (Molly) Paulino. Neo-bolero espacial: la lírica del bolero; el desamor, la melancolía sin vergüenza, la entrega total, en la línea de La Lupe; escrita sobre trip-hop, electrónica, guitarras con reverb y sonidos espaciales. Del bolero viene la escritura, no la instrumentación: la herida de siempre, contada con mis sonidos de adentro.",
      mlLabel: "ML",
      ml:
        "ML es quien canta. Una entidad andrógina y oscura que llegó tarde a un mundo que no acaba de entender, y que observa la experiencia humana: el cuerpo, el amor, la culpa, la belleza; como quien mira algo por primera vez. No vine a encajar. Vine a mirar, y a contarte lo que vi.",
      projectLabel: "El proyecto",
      project:
        "Nació en 2008 como una exploración autodidacta e intuitiva, y desde entonces ha transitado el indie pop, la electrónica, el trip-hop y las texturas shoegaze. Hoy el centro es la canción: escribir, componer, interpretar, y cuidar el universo visual tanto como el sonido.",
      directLabel: "Directo",
      direct:
        "Esta web es la casa. Aquí se escucha, se descarga y se compra directo, sin intermediarios ni algoritmos.",
    },
    newsletter: {
      heading: "Suscríbete a mi newsletter",
      emailLabel: "Correo electrónico",
      placeholder: "Tu correo",
      button: "Suscribirme",
      loading: "Enviando…",
      success: "Listo, ya estás dentro.",
      error: "Algo falló. Intenta de nuevo.",
      close: "Cerrar",
    },
    release: {
      back: "Volver a Música",
      listen: "Escuchar",
      playPreview: "Escuchar un adelanto",
      previewLabel: "Reproductor de SoundCloud",
      download: "Descargar",
      comingSoon: "Próximamente",
      lyrics: "Letra",
      tracks: "Pistas",
      press: "Prensa",
      credits: "Créditos",
      links: "Enlaces",
      writtenBy: "Escrito por",
      mix: "Mezcla",
      mastering: "Masterización",
      coverArt: "Portada",
      coverAltPrefix: "Portada de",
      reissue: "Remastered",
      externalHint: "se abre en una pestaña nueva",
    },
  },
  en: {
    nav: {
      sobre: "About",
      musica: "Music",
      videos: "Videos",
      fotos: "Photos",
      tienda: "Shop",
      contacto: "Contact",
      newsletter: "Newsletter",
    },
    brand: {
      descriptorShort: "Spatial neo-bolero, trip-hop and electronica",
      descriptorLong: "Neo-bolero, trip-hop, electronica and spatial sounds",
      place: "I landed in the Caribbean, but I'm not from here…",
    },
    player: { play: "Play music", label: "Background music player" },
    langToggle: { label: "Language", toEs: "ES", toEn: "EN" },
    meta: {
      home: {
        title: "Maria Lunares — Spatial neo-bolero, trip-hop and electronica",
        description:
          "Maria Lunares — spatial neo-bolero: trip-hop, guitars and spatial sounds. Listen, download and buy directly.",
      },
      sobre: {
        title: "About — Maria Lunares",
        description:
          "Maria Lunares is the music project of Cinthya (Molly) Paulino: spatial neo-bolero, the lyrics of the bolero written over trip-hop, electronica and spatial sounds.",
      },
      musica: {
        title: "Music — Maria Lunares",
        description:
          "Listen to Maria Lunares: spatial neo-bolero with trip-hop, reverb-drenched guitars and spatial sounds. Download and buy directly.",
      },
      videos: {
        title: "Videos — Maria Lunares",
        description:
          "Music videos by Maria Lunares: spatial neo-bolero, trip-hop, electronica and spatial sounds.",
      },
      fotos: {
        title: "Photos — Maria Lunares",
        description:
          "Photo gallery of Maria Lunares, a spatial neo-bolero, trip-hop and electronica project.",
      },
      contacto: {
        title: "Contact — Maria Lunares",
        description:
          "Get in touch with Maria Lunares for collaborations and press. Spatial neo-bolero, trip-hop and electronica.",
      },
    },
    contacto: { heading: "CONTACT" },
    sobre: {
      eyebrow: "About",
      whatLabel: "What it is",
      what:
        "Maria Lunares is the music project of Cinthya (Molly) Paulino. Spatial neo-bolero: the lyrics of the bolero; heartbreak, unashamed melancholy, total surrender, in the vein of La Lupe; written over trip-hop, electronica, reverb-drenched guitars and spatial sounds. The bolero is in the writing, not the instrumentation: the same old wound, told with my sounds.",
      mlLabel: "ML",
      ml:
        "ML is the one who sings. An androgynous, dark entity who arrived late to a world she still doesn't quite understand, watching human experience: the body, love, guilt, beauty; like someone seeing it for the first time. I didn't come to fit in. I came to look, and to tell you what I saw.",
      projectLabel: "The project",
      project:
        "It began in 2008 as a self-taught, intuitive exploration, moving through indie pop, electronica, trip-hop and shoegaze textures. Today the song is at the center: writing, composing, performing, and caring for the visual universe as much as the sound.",
      directLabel: "Direct",
      direct:
        "This site is the house. Here you listen, download and buy directly, no middlemen, no algorithms.",
    },
    newsletter: {
      heading: "Subscribe to my newsletter",
      emailLabel: "Email address",
      placeholder: "Your email",
      button: "Subscribe",
      loading: "Sending…",
      success: "Done. You're in.",
      error: "Something failed. Try again.",
      close: "Close",
    },
    release: {
      back: "Back to Music",
      listen: "Listen",
      playPreview: "Play a preview",
      previewLabel: "SoundCloud player",
      download: "Download",
      comingSoon: "Coming soon",
      lyrics: "Lyrics",
      tracks: "Tracks",
      press: "Press",
      credits: "Credits",
      links: "Links",
      writtenBy: "Written by",
      mix: "Mix",
      mastering: "Mastering",
      coverArt: "Cover art",
      coverAltPrefix: "Cover art for",
      reissue: "Remastered",
      externalHint: "opens in a new tab",
    },
  },
};
