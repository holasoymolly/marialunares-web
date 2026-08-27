import type { GetServerSideProps } from "next";
import { hasOwnPage, releases } from "@/data/releases";

// Sitemap generado desde el código: las rutas fijas más una entrada por cada
// release con página propia. Así, añadir una canción a src/data/releases.ts
// la mete en el sitemap sin tocar nada más.
//
// Sustituye al antiguo public/sitemap.xml (la URL pública sigue siendo
// /sitemap.xml, que es la que apunta public/robots.txt).

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://marialunares.com").replace(/\/$/, "");

// Casi todas las rutas conservan el slug español en inglés (/en/musica,
// /en/fotos). La excepción es /sobre, que en inglés se sirve como /about.
interface Route {
  es: string;
  en: string;
}

const STATIC_ROUTES: Route[] = [
  { es: "/", en: "/" },
  { es: "/sobre", en: "/about" },
  { es: "/musica", en: "/musica" },
  { es: "/videos", en: "/videos" },
  { es: "/fotos", en: "/fotos" },
  { es: "/contacto", en: "/contacto" },
];

function url(route: Route): string {
  const es = `${SITE_URL}${route.es === "/" ? "" : route.es}`;
  const en = `${SITE_URL}/en${route.en === "/" ? "" : route.en}`;
  return `  <url>
    <loc>${es}</loc>
    <xhtml:link rel="alternate" hreflang="es" href="${es}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${es}"/>
  </url>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const routes: Route[] = [
    ...STATIC_ROUTES,
    ...releases.filter(hasOwnPage).map((release) => ({
      es: `/musica/${release.slug}`,
      en: `/musica/${release.slug}`,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${routes.map(url).join("\n")}
</urlset>
`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
  res.write(xml);
  res.end();

  return { props: {} };
};

// La respuesta se escribe en getServerSideProps; este componente nunca se renderiza.
export default function Sitemap() {
  return null;
}
