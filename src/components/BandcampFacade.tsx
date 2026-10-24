import { useState } from "react";
import { Icon } from "@iconify/react";
import { useTranslations } from "@/i18n/useTranslations";

interface BandcampFacadeProps {
  /** ID numérico del disco en Bandcamp (ver `bandcampAlbumId` en releases.ts). */
  albumId: string;
  /** Número de pistas: el reproductor crece con la lista. */
  trackCount: number;
  /** Título del disco, solo para etiquetas accesibles. */
  title: string;
}

// Mismo criterio que SoundCloudFacade: el iframe de Bandcamp solo se monta tras
// el clic. Se usa para lo que no está en SoundCloud (los demos), con la lista
// de pistas visible para que se pueda elegir qué escuchar.
export default function BandcampFacade({ albumId, trackCount, title }: BandcampFacadeProps) {
  const { t } = useTranslations();
  const [active, setActive] = useState(false);

  if (active) {
    // ~165 px de cabecera y reproductor + 33 px por pista en el tamaño "large"
    // sin portada. Con menos, la última pista queda detrás de una barra de scroll.
    const height = 165 + trackCount * 33;
    const src =
      `https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=large/bgcol=000000/` +
      `linkcol=ffffff/artwork=none/tracklist=true/transparent=true/`;

    return (
      <iframe
        title={`${t.release.bandcampPlayerLabel}: ${title}`}
        width="100%"
        height={height}
        src={src}
        seamless
        style={{ border: "none", borderRadius: "0.5rem", maxWidth: "34rem" }}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      className="group inline-flex items-center gap-2 rounded-full border border-white/70 px-5 py-2 text-sm transition duration-300 hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
    >
      <Icon icon="mdi:play" className="text-lg" aria-hidden="true" />
      {t.release.playAlbum}
    </button>
  );
}
