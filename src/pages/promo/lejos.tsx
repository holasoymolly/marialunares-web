import { statSync } from "node:fs";
import path from "node:path";
import type { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Seo from "@/components/Seo";
import { useTranslations } from "@/i18n/useTranslations";
import { getRelease, type Release } from "@/data/releases";

// Página de promo para radio y prensa.
//
// Existe por una razón concreta: las autorespuestas de KEXP y KCRW (22-09-2026)
// exigen un ENLACE DE DESCARGA DIRECTO — "no attachments", "music submitted
// without a direct download link will likely not be reviewed". Un código de
// Bandcamp obliga a canjear, así que no cuenta. Esta página es ese enlace.
//
// NO es un release: no entra en src/data/releases.ts (el sitemap se genera
// desde ahí y acabaría indexada). No está enlazada desde ningún sitio; la URL
// se manda a mano en el correo. El noindex se aplica por cabecera en
// next.config.js y por robots.txt, no con una etiqueta meta, porque hay que
// cubrir también los archivos de audio de /promo/.
//
// Los archivos viven en public/promo/ con nombres legibles: ese nombre es lo
// que ve quien archiva la canción en la emisora.

const WAV = "/promo/Maria Lunares - Lejos.wav";
const MP3 = "/promo/Maria Lunares - Lejos.mp3";

interface PromoPageProps {
  release: Release;
  credential: {
    outlet: string;
    show: string | null;
    author: string;
    url: string | null;
  } | null;
  sizes: { wav: string; mp3: string };
}

function SectionLabel({ children }: { children: string }) {
  return <h2 className="mb-5 text-xs uppercase tracking-[0.2em] opacity-60">{children}</h2>;
}

// "4:50"
function formatDuration(seconds?: number) {
  if (!seconds) return null;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function PromoPage({ release, credential, sizes }: PromoPageProps) {
  const { t, locale } = useTranslations();

  const description = locale === "en" ? release.descriptionEn : release.descriptionEs;
  const duration = formatDuration(release.durationSeconds);

  const downloads = [
    { href: WAV, label: t.promo.downloadWav, size: sizes.wav, icon: "mdi:waveform" },
    { href: MP3, label: t.promo.downloadMp3, size: sizes.mp3, icon: "mdi:music-note" },
  ];

  // Ficha técnica. Cada fila es lo que pidió KEXP en su autorespuesta:
  // pronunciación, pronombres, fecha, sello, ISRC y aviso de FCC.
  const details: Array<[string, string]> = [
    [t.promo.titleLabel, release.title],
    [t.promo.artist, "Maria Lunares"],
    ...(release.isrc ? ([[t.promo.isrc, release.isrc]] as Array<[string, string]>) : []),
    ...(duration ? ([[t.promo.duration, duration]] as Array<[string, string]>) : []),
    ...(release.year ? ([[t.promo.year, String(release.year)]] as Array<[string, string]>) : []),
    [t.promo.label, t.promo.labelValue],
    [t.promo.genre, t.brand.descriptorLong],
    [t.promo.pronunciation, t.promo.pronunciationValue],
    [t.promo.pronouns, t.promo.pronounsValue],
    [t.promo.fcc, t.promo.fccValue],
  ];

  return (
    <>
      <Seo
        title={`${release.title} — ${t.promo.eyebrow} — Maria Lunares`}
        description={description || t.meta.musica.description}
      />

      <div className="min-h-[100dvh] w-full bg-black text-white">
        <article className="release-enter mx-auto w-full max-w-[1400px] px-6 pb-52 pt-72 sm:px-10 sm:pt-80 lg:px-16 lg:pt-40">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-20">
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

            <div className="flex max-w-[46rem] flex-col gap-14">
              <header>
                <p className="text-xs uppercase tracking-[0.2em] opacity-60">{t.promo.eyebrow}</p>
                <h1 className="release-title mt-4 font-bold tracking-tight">{release.title}</h1>
                <p className="mt-4 text-sm opacity-60">
                  Maria Lunares{release.year ? ` · ${release.year}` : ""}
                </p>
              </header>

              {/* Lo primero que se ve es la descarga: es a lo que vienen. */}
              <section>
                <SectionLabel>{t.promo.download}</SectionLabel>
                <p className="mb-6 max-w-[52ch] text-base leading-relaxed opacity-80">
                  {t.promo.intro}
                </p>
                <ul className="flex flex-wrap gap-3">
                  {downloads.map((file) => (
                    <li key={file.href}>
                      <a
                        href={file.href}
                        download
                        className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition duration-300 hover:bg-white/85 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                      >
                        <Icon icon={file.icon} className="text-lg" aria-hidden="true" />
                        {file.label}
                        <span className="font-normal opacity-60">{file.size}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>

              {description && (
                <section>
                  <SectionLabel>{t.promo.about}</SectionLabel>
                  <p className="max-w-[52ch] text-lg leading-relaxed opacity-90">{description}</p>
                  <p className="mt-4 max-w-[52ch] text-base leading-relaxed opacity-60">
                    {t.brand.place}
                  </p>
                </section>
              )}

              {/* El aval: la emisión de KEXP. Vive en el release de Sabes Correr,
                  no en el de Lejos, así que se lee de allí. */}
              {credential && (
                <section>
                  <SectionLabel>{t.release.press}</SectionLabel>
                  <div className="max-w-[46ch] border-l border-white/25 pl-5">
                    <p className="text-lg leading-relaxed">
                      “Sabes Correr” — {t.release.broadcastOn} {credential.outlet}
                      {credential.show ? ` (${credential.show})` : ""}, {t.release.broadcastBy}{" "}
                      {credential.author}
                    </p>
                    {credential.url && (
                      <p className="mt-3 text-sm opacity-60">
                        <a
                          href={credential.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${t.release.broadcastClip} (${t.release.externalHint})`}
                          className="underline underline-offset-4 transition duration-300 hover:opacity-100"
                        >
                          {t.release.broadcastClip}
                        </a>
                      </p>
                    )}
                  </div>
                </section>
              )}

              <section>
                <SectionLabel>{t.promo.details}</SectionLabel>
                <dl className="grid gap-3 text-sm sm:grid-cols-[10rem_minmax(0,1fr)]">
                  {details.map(([term, value]) => (
                    <div key={term} className="contents">
                      <dt className="opacity-50">{term}</dt>
                      <dd className="max-w-[52ch]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              {release.credits && (
                <section>
                  <SectionLabel>{t.release.credits}</SectionLabel>
                  <dl className="grid gap-3 text-sm sm:grid-cols-[10rem_minmax(0,1fr)]">
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

              {/* Hoja de letra: KEXP la pide explícitamente. */}
              {release.lyrics && (
                <section>
                  <SectionLabel>{t.release.lyrics}</SectionLabel>
                  <div className="max-w-[46ch] text-base leading-[1.9]">
                    {release.lyrics.split("\n").map((line, i) => {
                      const trimmed = line.trim();
                      if (!trimmed) return <span key={i} aria-hidden="true" className="block h-5" />;
                      const isMarker = trimmed.startsWith("[");
                      return (
                        <span
                          key={i}
                          className={
                            isMarker
                              ? "mt-3 block text-xs uppercase tracking-[0.18em] opacity-50"
                              : "block"
                          }
                        >
                          {line}
                        </span>
                      );
                    })}
                  </div>
                </section>
              )}

              <section className="border-t border-white/15 pt-10 text-sm">
                <p>
                  <Link
                    href={`/musica/${release.slug}`}
                    className="underline underline-offset-4 opacity-70 transition duration-300 hover:opacity-100"
                  >
                    {t.promo.publicPage}
                  </Link>
                </p>
                <p className="mt-3 opacity-60">
                  {t.promo.contact}:{" "}
                  <a
                    href="mailto:hola@marialunares.com"
                    className="underline underline-offset-4 transition duration-300 hover:opacity-100"
                  >
                    hola@marialunares.com
                  </a>
                </p>
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

// El peso de cada archivo se lee en build, no se escribe a mano: si algún día
// se regenera el máster, la página no queda mintiendo.
function fileSize(publicPath: string) {
  const bytes = statSync(path.join(process.cwd(), "public", publicPath)).size;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export const getStaticProps: GetStaticProps<PromoPageProps> = async () => {
  const release = getRelease("lejos");
  if (!release) return { notFound: true };

  // El aval de radio es la emisión de KEXP, que está en el release de
  // "Sabes Correr". Si algún día se mueve o se borra, la sección desaparece
  // sola en vez de romper el build.
  const kexp = getRelease("sabes-correr")?.press;
  const credential =
    kexp?.broadcast === true
      ? {
          outlet: kexp.outlet,
          show: kexp.show ?? null,
          author: kexp.author,
          // getStaticProps serializa a JSON: `undefined` revienta el build.
          url: kexp.url ?? null,
        }
      : null;

  return {
    props: {
      release,
      credential: credential ?? null,
      sizes: { wav: fileSize(WAV), mp3: fileSize(MP3) },
    },
  };
};
