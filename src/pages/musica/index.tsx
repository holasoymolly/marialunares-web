import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Seo from "@/components/Seo";
import { useTranslations } from "@/i18n/useTranslations";
import { releaseHref, releases, hasOwnPage, type Release } from "@/data/releases";

// Galería de portadas: la composición es la original (título en bleed +
// portada principal grande y el resto en una rejilla de dos columnas), pero
// las portadas salen de src/data/releases.ts.
function Musica() {
  const { t } = useTranslations();
  const [main, ...rest] = releases;

  return (
    <>
      <Seo title={t.meta.musica.title} description={t.meta.musica.description} />
      <div className="relative w-screen h-screen bg-black text-white">
        {/* Título */}
        <h1 className="text-9xl font-bold absolute desktop-title">
          MÚ<br />SI<br />CA
        </h1>

        {/* Galería de imágenes */}
        <div className="absolute gallery-container">
          {/* Imagen principal */}
          <div className="mb-5 gallery-main">
            <CoverLink release={main}>
              <Image
                src={main.cover}
                alt={`${t.release.coverAltPrefix} ${main.title}`}
                width={384}
                height={384}
                sizes="(max-width: 768px) 60vw, 384px"
                priority
                className="object-cover rounded-lg transition duration-300 hover:scale-105"
              />
            </CoverLink>
          </div>

          {/* Imágenes secundarias */}
          <div className="grid grid-cols-2 gap-2 gallery-grid">
            {rest.map((release) => (
              <CoverLink key={release.slug} release={release}>
                <Image
                  src={release.cover}
                  alt={`${t.release.coverAltPrefix} ${release.title}`}
                  width={192}
                  height={192}
                  sizes="(max-width: 768px) 30vw, 192px"
                  className="object-cover rounded-lg transition duration-300 hover:scale-105"
                />
              </CoverLink>
            ))}
          </div>
        </div>
      </div>

      {/* Estilos */}
      <style jsx>{`
        /* Desktop Styling */
        @media (min-width: 1025px) {
          .desktop-title {
            top: 35vh;
            left: 35vw;
            transform: translate(-50%, -50%);
            z-index: 10;
          }

          .gallery-container {
            top: 55vh;
            left: 56vw;
            transform: translate(-50%, -50%);
          }

          .gallery-main {
            width: 384px;
          }

          .gallery-grid {
            width: 384px;
          }
        }

        /* Tablet Styling */
        @media (min-width: 769px) and (max-width: 1024px) {
          .desktop-title {
            top: 40vh;
            left: 33vw;
            font-size: 6rem;
            transform: translate(-50%, -50%);
            z-index: 10;
          }

          .gallery-container {
            top: 58vh;
            left: 68vw;
            transform: translate(-50%, -50%);
            width: 60vw;
          }

          .gallery-main {
            width: 60%;
          }

          .gallery-grid {
            width: 60%;
            gap: 1.5rem;
          }
        }

        /* Mobile Styling */
        @media (max-width: 768px) {
          .desktop-title {
            top: 30vh;
            left: 20vw;
            font-size: 4rem;
            transform: translate(0, 0);
            z-index: 10;
          }

          .gallery-container {
            top: 58vh;
            left: 55vw;
            transform: translate(-50%, -50%);
            width: 40vw;
          }

          .gallery-main {
            width: 100%;
          }

          .gallery-grid {
            width: 100%;
            gap: 1rem;
          }
        }
      `}</style>
    </>
  );
}

// Enlaza a la página propia del release si está lista; si no, al smart link
// externo. Sin destino, la portada se muestra sin enlace.
function CoverLink({ release, children }: { release: Release; children: ReactNode }) {
  const { t } = useTranslations();
  const href = releaseHref(release);

  if (!href) return <>{children}</>;

  if (hasOwnPage(release)) {
    return (
      <Link href={href} aria-label={release.title}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${release.title} (${t.release.externalHint})`}
    >
      {children}
    </a>
  );
}

export default Musica;
