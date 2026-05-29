import Head from "next/head";
import { useRouter } from "next/router";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/translations";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://marialunares.com").replace(/\/$/, "");
const OG_IMAGE = "/og-image.jpg";

interface SeoProps {
  title: string;
  description: string;
}

// Construye la URL absoluta de una ruta para un locale dado.
function urlFor(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path;
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${clean}`;
}

export default function Seo({ title, description }: SeoProps) {
  const router = useRouter();
  const path = router.asPath.split("?")[0].split("#")[0];
  const locale = (router.locale as Locale) ?? DEFAULT_LOCALE;
  const canonical = urlFor(locale, path);
  const ogImage = `${SITE_URL}${OG_IMAGE}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Alternativas de idioma */}
      <link rel="alternate" hrefLang="es" href={urlFor("es", path)} />
      <link rel="alternate" hrefLang="en" href={urlFor("en", path)} />
      <link rel="alternate" hrefLang="x-default" href={urlFor("es", path)} />

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
