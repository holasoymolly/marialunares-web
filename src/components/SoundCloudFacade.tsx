import { useState } from "react";
import { Icon } from "@iconify/react";
import { useTranslations } from "@/i18n/useTranslations";

interface SoundCloudFacadeProps {
  /** URL pública de la pista, p. ej. https://soundcloud.com/marialunares/sabescorrer */
  trackUrl: string;
  /** Título de la canción, solo para etiquetas accesibles. */
  title: string;
}

// "Facade" ligero, mismo criterio que YouTubeFacade y BackgroundMusic:
// el iframe de SoundCloud (y su autoplay) solo se monta tras el clic del
// usuario, así la página no carga un embed pesado en la primera pintura.
export default function SoundCloudFacade({ trackUrl, title }: SoundCloudFacadeProps) {
  const { t } = useTranslations();
  const [active, setActive] = useState(false);

  if (active) {
    const src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
      trackUrl
    )}&color=%23ff5500&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;

    return (
      <iframe
        title={`${t.release.previewLabel}: ${title}`}
        width="100%"
        height="166"
        scrolling="no"
        allow="autoplay"
        src={src}
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
      {t.release.playPreview}
    </button>
  );
}
