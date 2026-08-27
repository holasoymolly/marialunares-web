import Head from "next/head";
import { useRouter } from "next/router";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/i18n/translations";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://marialunares.com").replace(/\/$/, "");
const OG_IMAGE = "/og-image.jpg";

interface SeoProps {
  title: string;
  description: string;
  /**
   * Ruta canónica por idioma, solo para las páginas cuyo slug cambia entre
   * ES y EN (hoy únicamente /sobre ↔ /about). Sin esta prop se usa la ruta
   * actual, que es lo correcto para el resto del sitio: /musica, /fotos y
   * /contacto conservan el slug español en inglés.
   */
  paths?: Partial<Record<Locale, string>>;
}

export default function Seo({ title, description, paths }: SeoProps) {
  const router = useRouter();
  const path = router.asPath.split("?")[0].split("#")[0];
  const locale = (router.locale as Locale) ?? DEFAULT_LOCALE;

  // Construye la URL absoluta de una ruta para un locale dado.
  const urlFor = (target: Locale): string => {
    const raw = paths?.[target] ?? path;
    const clean = raw === "/" ? "" : raw;
    const prefix = target === DEFAULT_LOCALE ? "" : `/${target}`;
    return `${SITE_URL}${prefix}${clean}`;
  };

  const canonical = urlFor(locale);
  const ogImage = `${SITE_URL}${OG_IMAGE}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Alternativas de idioma */}
      {LOCALES.map((l) => (
        <link key={l} rel="alternate" hrefLang={l} href={urlFor(l)} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={urlFor(DEFAULT_LOCALE)} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="María Lunares" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={locale === "es" ? "es_ES" : "en_US"} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
}
