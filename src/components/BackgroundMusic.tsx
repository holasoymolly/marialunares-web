import { useState } from "react";
import { Icon } from "@iconify/react";
import { useTranslations } from "@/i18n/useTranslations";

export default function BackgroundMusic() {
  const { t } = useTranslations();
  const [open, setOpen] = useState(false);

  // Álbum "De Noche" en SoundCloud.
  const albumUrl = "https://api.soundcloud.com/playlists/1922801791";
  const playerSrc = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
    albumUrl
  )}&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;

  return (
    <div className="fixed bottom-32 right-8 z-30">
      {open ? (
        // El iframe (y su autoplay) solo se cargan tras la interacción del usuario.
        <iframe
          title={t.player.label}
          width="300"
          height="166"
          scrolling="no"
          allow="autoplay"
          src={playerSrc}
          style={{ borderRadius: "8px", border: "none" }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t.player.play}
          className="flex items-center gap-2 rounded-full border border-white/70 bg-black/40 px-4 py-2 text-sm text-white backdrop-blur transition duration-300 hover:bg-white hover:text-black"
        >
          <Icon icon="mdi:play" className="text-lg" />
          {t.player.play}
        </button>
      )}
    </div>
  );
}
