import type { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Script from "next/script";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Seo from "@/components/Seo";
import SoundCloudFacade from "@/components/SoundCloudFacade";
import { useNewsletter } from "@/components/NewsletterProvider";
import { useTranslations } from "@/i18n/useTranslations";
import { LOCALES } from "@/i18n/translations";
import { getRelease, hasOwnPage, releases, type Release } from "@/data/releases";

// lemon.js abre el checkout en un overlay sin salir de la página.
// createLemonSqueezy() vuelve a registrar el botón cuando se navega de una
// página de release a otra sin recargar.
declare global {
  interface Window {
    createLemonSqueezy?: () => void;
  }
}

interface ReleasePageProps {
  release: Release;
}

// Etiqueta de sección (Escuchar, Letra, Créditos, Enlaces).
function SectionLabel({ children }: { children: string }) {
  return <h2 className="mb-5 text-xs uppercase tracking-[0.2em] opacity-60">{children}</h2>;
}

// Letra en texto plano. Las marcas de estructura ([Verso 1], [Coro]…) se
// atenúan; las líneas en blanco se conservan como separación.
function Lyrics({ text }: { text: string }) {
  return (
    <div className="max-w-[46ch] text-base leading-[1.9]">
      {text.split("\n").map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <span key={i} aria-hidden="true" className="block h-5" />;
        const isMarker = trimmed.startsWith("[");
        return (
          <span
            key={i}
            className={isMarker ? "mt-3 block text-xs uppercase tracking-[0.18em] opacity-50" : "block"}
          >
            {line}
          </span>
        );
      })}
    </div>
  );
}

// Plantilla común a todas las canciones. El contenido viene de
// src/data/releases.ts; aquí solo se decide qué se muestra y cómo.
export default function ReleasePage({ release }: ReleasePageProps) {
  const { t, locale } = useTranslations();
  const { openNewsletter } = useNewsletter();

  const description = locale === "en" ? release.descriptionEn : release.descriptionEs;

  // El overlay de Lemon Squeezy necesita `embed=1` en la URL y la clase
  // `lemonsqueezy-button` en el enlace. Si el script no carga (o no hay JS),
  // el mismo href abre el checkout en una pestaña nueva: nunca se queda muerto.
  const checkoutHref = release.checkoutUrl
    ? `${release.checkoutUrl}${release.checkoutUrl.includes("?") ? "&" : "?"}embed=1`
    : null;
  const links = release.links ?? {};
  const platformLinks = [
    { key: "bandcamp", href: links.bandcamp, icon: "mdi:bandcamp", label: "Bandcamp" },
    { key: "soundcloud", href: links.soundcloud, icon: "mdi:soundcloud", label: "SoundCloud" },
    { key: "youtube", href: links.youtube, icon: "mdi:youtube", label: "YouTube" },
  ].filter((link) => Boolean(link.href));

  // "2017 · nueva versión 2026"
  const yearLine = [release.year, release.reissueYear ? `${t.release.reissue} ${release.reissueYear}` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <Seo
        title={`${release.title} — Maria Lunares`}
        description={description || t.meta.musica.description}
      />

      <div className="min-h-[100dvh] w-full bg-black text-white">
        {/* El menú fijo mide 268px en móvil y 316px desde `sm`. Por debajo de `lg`
            el texto ocupa todo el ancho y pasaría por debajo. Ver docs/DESIGN.md. */}
        <article className="release-enter mx-auto w-full max-w-[1400px] px-6 pb-52 pt-72 sm:px-10 sm:pt-80 lg:px-16 lg:pt-40">
          <Link
            href="/musica"
            className="inline-flex items-center gap-2 text-sm opacity-70 transition duration-300 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <Icon icon="mdi:arrow-left" aria-hidden="true" />
            {t.release.back}
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-20">
            {/* Portada */}
            <div className="w-full max-w-[26rem] overflow-hidden rounded-lg">
              <Image
                src={release.cover}
                alt={`${t.release.coverAltPrefix} ${release.title}`}
                width={1000}
                height={1000}
                sizes="(max-width: 1023px) 92vw, 26rem"
                priority
                className="h-auto w-full object-cover"
              />
            </div>

            {/* Contenido */}
            <div className="flex max-w-[46rem] flex-col gap-14">
              <header>
                <h1 className="release-title font-bold tracking-tight">{release.title}</h1>
                {yearLine && <p className="mt-4 text-sm opacity-60">{yearLine}</p>}
              </header>

              {description && (
                <p className="max-w-[52ch] text-lg leading-relaxed opacity-90">{description}</p>
              )}

              {/* Descarga / compra */}
              <div className="flex flex-wrap items-center gap-4">
                {checkoutHref ? (
                  <a
                    href={checkoutHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lemonsqueezy-button inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition duration-300 hover:bg-white/85 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    <Icon icon="mdi:tray-arrow-down" className="text-lg" aria-hidden="true" />
                    {t.release.download}
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex cursor-not-allowed items-center gap-2 whitespace-nowrap rounded-full border border-white/40 px-6 py-2.5 text-sm text-white/50"
                  >
                    <Icon icon="mdi:tray-arrow-down" className="text-lg" aria-hidden="true" />
                    {t.release.comingSoon}
                  </button>
                )}
              </div>

              {checkoutHref && (
                <Script
                  src="https://assets.lemonsqueezy.com/lemon.js"
                  strategy="afterInteractive"
                  onLoad={() => window.createLemonSqueezy?.()}
                />
              )}

              {/* Adelanto: el embed solo se monta tras el clic */}
              {release.soundcloudTrackUrl && (
                <section>
                  <SectionLabel>{t.release.listen}</SectionLabel>
                  <SoundCloudFacade trackUrl={release.soundcloudTrackUrl} title={release.title} />
                </section>
              )}

              {release.lyrics && (
                <section>
                  <SectionLabel>{t.release.lyrics}</SectionLabel>
                  <Lyrics text={release.lyrics} />
                </section>
              )}

              {/* EP o álbum: cada pista con su nota y su letra. */}
              {release.tracks && release.tracks.length > 0 && (
                <section>
                  <SectionLabel>{t.release.tracks}</SectionLabel>
                  <ol className="flex flex-col gap-14">
                    {release.tracks.map((track, i) => {
                      const note = locale === "en" ? track.noteEn : track.noteEs;
                      return (
                        <li key={track.title}>
                          <h3 className="flex items-baseline gap-3 text-xl font-bold tracking-tight">
                            <span className="text-sm font-normal tabular-nums opacity-40">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            {track.title}
                          </h3>

                          {note && (
                            <p className="mt-3 max-w-[52ch] text-sm leading-relaxed opacity-70">
                              {note}
                            </p>
                          )}

                          {track.soundcloudTrackUrl && (
                            <div className="mt-5">
                              <SoundCloudFacade
                                trackUrl={track.soundcloudTrackUrl}
                                title={track.title}
                              />
                            </div>
                          )}

                          {track.lyrics && (
                            <div className="mt-5">
                              <Lyrics text={track.lyrics} />
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </section>
              )}

              {/* Prensa: se cita un extracto con atribución, no la reseña entera. */}
              {release.press && (
                <section>
                  <SectionLabel>{t.release.press}</SectionLabel>
                  <blockquote className="max-w-[46ch] border-l border-white/25 pl-5">
                    <p className="text-lg leading-relaxed">“{release.press.quote}”</p>
                    <footer className="mt-3 text-sm opacity-60">
                      {release.press.url ? (
                        <a
                          href={release.press.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-4 transition duration-300 hover:opacity-100"
                        >
                          {release.press.author} · {release.press.outlet}
                        </a>
                      ) : (
                        <>
                          {release.press.author} · {release.press.outlet}
                        </>
                      )}
                    </footer>
                  </blockquote>
                </section>
              )}

              {release.credits && (
                <section>
                  <SectionLabel>{t.release.credits}</SectionLabel>
                  <dl className="grid gap-3 text-sm sm:grid-cols-[9rem_minmax(0,1fr)]">
                    <dt className="opacity-50">{t.release.writtenBy}</dt>
                    <dd>{release.credits.writtenBy}</dd>
                    <dt className="opacity-50">{t.release.mix}</dt>
                    <dd>{release.credits.mix}</dd>
                    {release.credits.mastering && (
                      <>
                        <dt className="opacity-50">{t.release.mastering}</dt>
                        <dd>{release.credits.mastering}</dd>
                      </>
                    )}
                    <dt className="opacity-50">{t.release.coverArt}</dt>
                    <dd>{release.credits.cover}</dd>
                  </dl>
                </section>
              )}

              {platformLinks.length > 0 && (
                <section>
                  <SectionLabel>{t.release.links}</SectionLabel>
                  <ul className="flex flex-wrap gap-3">
                    {platformLinks.map((link) => (
                      <li key={link.key}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${link.label} (${t.release.externalHint})`}
                          className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 text-sm transition duration-300 hover:border-white hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                        >
                          <Icon icon={link.icon} className="text-lg" aria-hidden="true" />
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Newsletter: abre el mismo modal que el botón del Layout */}
              <section className="border-t border-white/15 pt-10">
                <h2 className="max-w-[20ch] text-2xl font-bold leading-tight sm:text-3xl">
                  {t.newsletter.heading}
                </h2>
                <button
                  type="button"
                  onClick={openNewsletter}
                  className="mt-5 inline-flex whitespace-nowrap rounded-full border border-white px-6 py-2 text-sm font-semibold transition duration-300 hover:bg-white hover:text-black active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  {t.nav.newsletter}
                </button>
              </section>
            </div>
          </div>
        </article>
      </div>

      <style jsx>{`
        .release-title {
          font-size: clamp(2.75rem, 7vw, 5rem);
          line-height: 1.02;
        }

        /* Entrada suave al cargar; se anula con prefers-reduced-motion (globals.css). */
        .release-enter {
          animation: release-fade-up 500ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes release-fade-up {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  // Solo se generan las canciones marcadas con hasPage, y una por idioma:
  // sin el locale explícito Next solo prerenderiza el idioma por defecto y
  // /en/musica/<slug> respondería 404.
  const slugs = releases.filter(hasOwnPage).map((release) => release.slug);
  const activeLocales = locales ?? LOCALES;

  return {
    paths: activeLocales.flatMap((locale) => slugs.map((slug) => ({ params: { slug }, locale }))),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<ReleasePageProps> = async ({ params }) => {
  const release = getRelease(String(params?.slug));
  if (!release || !hasOwnPage(release)) return { notFound: true };
  return { props: { release } };
};
