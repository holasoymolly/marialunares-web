import Image from "next/image";
import Link from "next/link";
import Seo from "@/components/Seo";
import { useTranslations } from "@/i18n/useTranslations";
import { releaseHref, releases, hasOwnPage, type Release } from "@/data/releases";

// Grid de portadas generada desde src/data/releases.ts.
// Cada portada enlaza a su página propia (/musica/<slug>) si está lista,
// o al smart link externo mientras no lo esté.
export default function Musica() {
  const { t } = useTranslations();

  return (
    <>
      <Seo title={t.meta.musica.title} description={t.meta.musica.description} />

      <div className="min-h-[100dvh] w-full bg-black text-white">
        <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-6 pb-52 pt-44 sm:px-10 sm:pt-40 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-20 lg:px-16">
          <h1 className="musica-title font-bold leading-[0.85] tracking-tight">
            MÚ
            <br />
            SI
            <br />
            CA
          </h1>

          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3">
            {releases.map((release, index) => (
              <li key={release.slug} className={index === 0 ? "col-span-2" : ""}>
                <ReleaseCard release={release} priority={index === 0} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        .musica-title {
          font-size: 4rem;
        }

        @media (min-width: 769px) {
          .musica-title {
            font-size: 6rem;
          }
        }

        @media (min-width: 1025px) {
          .musica-title {
            font-size: 8rem;
          }
        }
      `}</style>
    </>
  );
}

interface ReleaseCardProps {
  release: Release;
  priority: boolean;
}

function ReleaseCard({ release, priority }: ReleaseCardProps) {
  const { t } = useTranslations();
  const href = releaseHref(release);
  const internal = hasOwnPage(release);

  const cover = (
    <>
      <div className="overflow-hidden rounded-lg">
        <Image
          src={release.cover}
          alt={`${t.release.coverAltPrefix} ${release.title}`}
          width={1000}
          height={1000}
          sizes={priority ? "(max-width: 1024px) 92vw, 40vw" : "(max-width: 1024px) 45vw, 20vw"}
          priority={priority}
          className="h-auto w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <span className="text-sm transition duration-300 group-hover:font-bold">{release.title}</span>
        {release.year && <span className="text-xs opacity-50">{release.year}</span>}
      </div>
    </>
  );

  const className =
    "group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

  // Sin destino todavía: la portada se muestra, pero no enlaza a ningún sitio.
  if (!href) return <div className="group block">{cover}</div>;

  if (internal) {
    return (
      <Link href={href} className={className}>
        {cover}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${release.title} (${t.release.externalHint})`}
      className={className}
    >
      {cover}
    </a>
  );
}
