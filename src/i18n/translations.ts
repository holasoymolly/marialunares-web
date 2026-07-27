// Diccionario bilingüe (ES/EN). El sitio es pequeño, así que usamos objetos
// planos en lugar de una librería de i18n.

export type Locale = "es" | "en";

export const LOCALES: Locale[] = ["es", "en"];
export const DEFAULT_LOCALE: Locale = "es";

type Dict = {
  nav: { musica: string; videos: string; fotos: string; tienda: string; contacto: string; newsletter: string };
  player: { play: string; label: string };
  langToggle: { label: string; toEs: string; toEn: string };
  meta: Record<"home" | "musica" | "videos" | "fotos" | "contacto", { title: string; description: string }>;
  contacto: { heading: string };
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
    credits: string;
    links: string;
    writtenBy: string;
    mix: string;
    coverArt: string;
    coverAltPrefix: string;
    reissue: string;
    externalHint: string;
  };
};

export const translations: Record<Locale, Dict> = {
  es: {
    nav: { musica: "Música", videos: "Videos", fotos: "Fotos", tienda: "Tienda", contacto: "Contacto", newsletter: "Newsletter" },
    player: { play: "Reproducir música", label: "Reproductor de música de fondo" },
    langToggle: { label: "Idioma", toEs: "ES", toEn: "EN" },
    meta: {
      home: {
        title: "María Lunares",
        description: "Sitio oficial de María Lunares: música, videos, fotos y tienda.",
      },
      musica: {
        title: "Música — María Lunares",
        description: "Escucha la música de María Lunares: álbumes y sencillos disponibles en todas las plataformas.",
      },
      videos: {
        title: "Videos — María Lunares",
        description: "Videos musicales y presentaciones en vivo de María Lunares.",
      },
      fotos: {
        title: "Fotos — María Lunares",
        description: "Galería de fotos de María Lunares.",
      },
      contacto: {
        title: "Contacto — María Lunares",
        description: "Ponte en contacto con María Lunares para colaboraciones y prensa.",
      },
    },
    contacto: { heading: "CONTACTO" },
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
      credits: "Créditos",
      links: "Enlaces",
      writtenBy: "Escrito por",
      mix: "Mezcla",
      coverArt: "Portada",
      coverAltPrefix: "Portada de",
      reissue: "nueva versión",
      externalHint: "se abre en una pestaña nueva",
    },
  },
  en: {
    nav: { musica: "Music", videos: "Videos", fotos: "Photos", tienda: "Shop", contacto: "Contact", newsletter: "Newsletter" },
    player: { play: "Play music", label: "Background music player" },
    langToggle: { label: "Language", toEs: "ES", toEn: "EN" },
    meta: {
      home: {
        title: "María Lunares",
        description: "Official site of María Lunares: music, videos, photos and shop.",
      },
      musica: {
        title: "Music — María Lunares",
        description: "Listen to María Lunares: albums and singles available on all platforms.",
      },
      videos: {
        title: "Videos — María Lunares",
        description: "Music videos and live performances by María Lunares.",
      },
      fotos: {
        title: "Photos — María Lunares",
        description: "Photo gallery of María Lunares.",
      },
      contacto: {
        title: "Contact — María Lunares",
        description: "Get in touch with María Lunares for collaborations and press.",
      },
    },
    contacto: { heading: "CONTACT" },
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
      credits: "Credits",
      links: "Links",
      writtenBy: "Written by",
      mix: "Mix",
      coverArt: "Cover art",
      coverAltPrefix: "Cover art for",
      reissue: "new version",
      externalHint: "opens in a new tab",
    },
  },
};
