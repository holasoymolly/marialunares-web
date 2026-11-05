import type { GetStaticProps } from "next";
import Image from "next/image";
import Seo from "@/components/Seo";
import SoundCloudFacade from "@/components/SoundCloudFacade";
import { useTranslations } from "@/i18n/useTranslations";
import { getRelease, type Release } from "@/data/releases";

// Página para supervisores musicales: tres canciones a un clic y el contacto.
// Como el resto de /promo, no sale en el sitemap ni en el menú, y lleva noindex
// por cabecera. No debe llegar a producción hasta que existan los instrumentales
// y Cinthya confirme los derechos (ver 06-apoyos-y-fondos/sync-pipeline.md).

const SLUGS = ["lejos", "sabes-correr", "sol"];
const EMAIL = "estoesmarialunares@gmail.com";

interface SyncPageProps {
  releases: Release[];
}

export default function SyncPage({ releases }: SyncPageProps) {
  const { t } = useTranslations();
  return (
    <>
      <Seo title={t.sync.title} description={t.sync.description} />
      <main className="min-h-screen bg-black px-4 pb-24 pt-28 text-white">
        <div className="mx-auto flex max-w-2xl flex-col gap-12">
          <header className="flex flex-col gap-5">
            <p className="text-xs uppercase tracking-[0.2em] opacity-60">{t.sync.label}</p>
            <h1 className="text-5xl font-black leading-none tracking-tight md:text-7xl">{t.sync.heading}</h1>
            <p className="text-lg">{t.sync.intro}</p>
            <p className="text-lg opacity-70">{t.sync.rights}</p>
          </header>
          {releases.map((release) => (
            <section key={release.slug} className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Image src={release.cover} alt="" width={72} height={72} className="h-[72px] w-[72px] object-cover" />
                <div>
                  <h2 className="text-2xl font-black">{release.title}</h2>
                  <p className="text-sm opacity-60">
                    {release.year}
                    {release.isrc ? ` · ISRC ${release.isrc}` : ""}
                  </p>
                </div>
              </div>
              {(release.soundcloudTrackUrl ?? release.links?.soundcloud) && (
                <SoundCloudFacade
                  trackUrl={(release.soundcloudTrackUrl ?? release.links?.soundcloud) as string}
                  title={release.title}
                />
              )}
            </section>
          ))}
          <p className="text-lg">
            {t.sync.contact}:{" "}
            <a href={`mailto:${EMAIL}`} className="underline underline-offset-4">
              {EMAIL}
            </a>
          </p>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<SyncPageProps> = async () => {
  const releases = SLUGS.map((slug) => getRelease(slug)).filter((r): r is Release => Boolean(r));
  return { props: { releases: JSON.parse(JSON.stringify(releases)) } };
};
