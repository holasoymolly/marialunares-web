/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bilingüe: español por defecto, inglés bajo /en
  i18n: {
    locales: ["es", "en"],
    defaultLocale: "es",
  },
  // El dominio de preview sirve el mismo contenido que producción: si Google lo
  // indexa, compite consigo mismo. Vercel solo pone `noindex` automático en las
  // URLs *.vercel.app, no en un dominio propio, así que se añade aquí.
  async headers() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "preview.marialunares.com" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      // /promo/* es el material para radio y prensa: la página de cada canción
      // y sus archivos de audio. La URL se manda a mano por correo y no debe
      // salir en Google. Va por cabecera y no por <meta robots> porque una
      // etiqueta HTML no protege un .wav. Se refuerza con Disallow en
      // public/robots.txt.
      //
      // Hacen falta LAS DOS entradas, comprobado a mano el 22-09-2026:
      //   · sin `locale: false`, Next prefija la fuente con el locale interno
      //     y cubre las páginas /promo/* y /en/promo/*;
      //   · con `locale: false`, cubre los archivos de public/promo/, que no
      //     pasan por el enrutado de i18n.
      // Con una sola de las dos, la mitad se queda sin cabecera. Y ojo:
      // `/:locale(en)?/promo/...` tampoco sirve — el grupo opcional no casa
      // con la ruta sin prefijo.
      { source: "/promo/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      {
        source: "/promo/:path*",
        locale: false,
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/tienda",
        destination: "https://marialunares.printful.me/",
        permanent: false,
      },
      // La página de identidad se sirve en inglés como /en/about. Se redirige
      // /en/sobre para no dejar dos URLs con el mismo contenido indexable.
      {
        source: "/en/sobre",
        destination: "/en/about",
        locale: false,
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // El archivo es src/pages/sobre.tsx; en inglés su URL pública es /about.
      {
        source: "/en/about",
        destination: "/en/sobre",
        locale: false,
      },
    ];
  },
};

module.exports = nextConfig;
