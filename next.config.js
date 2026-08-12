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
    ];
  },
  async redirects() {
    return [
      {
        source: "/tienda",
        destination: "https://marialunares.printful.me/",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
