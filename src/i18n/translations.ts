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
  },
};
