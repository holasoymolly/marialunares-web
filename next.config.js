/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bilingüe: español por defecto, inglés bajo /en
  i18n: {
    locales: ["es", "en"],
    defaultLocale: "es",
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
