import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import BackgroundMusic from "./BackgroundMusic";
import { useNewsletter } from "./NewsletterProvider";
import { useTranslations } from "@/i18n/useTranslations";
import { LOCALES, type Locale } from "@/i18n/translations";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { t, locale } = useTranslations();
  const { openNewsletter } = useNewsletter();

  // Cambia de idioma manteniendo la misma ruta.
  const switchTo = (next: Locale) => {
    if (next !== locale) {
      router.push(router.asPath, router.asPath, { locale: next });
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-transparent">
      {/* Logo */}
      <div className="fixed top-8 left-8 z-20">
        <Link href="/" aria-label="María Lunares — inicio">
          <div className="block bg-logo logo-hover" style={{ width: "100px", height: "100px" }}></div>
        </Link>
      </div>

      {/* Menú lateral */}
      <nav
        aria-label={t.nav.musica}
        className="fixed right-8 top-8 flex flex-col items-end gap-4 text-sm sm:text-lg z-20"
      >
        <Link href="/musica" className="transition duration-300 hover:font-bold cursor-pointer">
          {t.nav.musica}
        </Link>
        <Link href="/videos" className="transition duration-300 hover:font-bold cursor-pointer">
          {t.nav.videos}
        </Link>
        <Link href="/fotos" className="transition duration-300 hover:font-bold cursor-pointer">
          {t.nav.fotos}
        </Link>
        <a
          href="https://marialunares.printful.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition duration-300 hover:font-bold cursor-pointer"
        >
          {t.nav.tienda}
        </a>
        <Link href="/contacto" className="transition duration-300 hover:font-bold cursor-pointer">
          {t.nav.contacto}
        </Link>

        {/* Selector de idioma */}
        <div className="flex gap-2 text-xs mt-1" role="group" aria-label={t.langToggle.label}>
          {LOCALES.map((l) => (
            <button
              key={l}
              onClick={() => switchTo(l)}
              aria-pressed={locale === l}
              className={`uppercase transition duration-300 ${
                locale === l ? "font-bold underline" : "opacity-60 hover:opacity-100"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </nav>

      {/* Botón Newsletter: abre el formulario nativo (antes iba a un Google Form) */}
      <div className="fixed bottom-8 left-8 z-20">
        <button
          type="button"
          onClick={openNewsletter}
          className="px-5 py-1 border border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition duration-300"
        >
          {t.nav.newsletter}
        </button>
      </div>

      {/* Reproductor de música de fondo */}
      <BackgroundMusic />

      {/* Redes sociales */}
      <div className="fixed bottom-8 right-8 flex gap-4 z-20">
        <a
          href="https://www.instagram.com/_marialunares"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="hover:scale-110 transition duration-300"
        >
          <Icon icon="mdi:instagram" className="text-white text-xl" />
        </a>
        <a
          href="https://www.tiktok.com/@_marialunares"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
          className="hover:scale-110 transition duration-300"
        >
          <Icon icon="ic:baseline-tiktok" className="text-white text-xl" />
        </a>
        <a
          href="https://www.youtube.com/@_marialunares"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
          className="hover:scale-110 transition duration-300"
        >
          <Icon icon="mdi:youtube" className="text-white text-xl" />
        </a>
        <a
          href="https://soundcloud.com/marialunares"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="SoundCloud"
          className="hover:scale-110 transition duration-300"
        >
          <Icon icon="mdi:soundcloud" className="text-white text-xl" />
        </a>
      </div>

      {/* Contenido dinámico */}
      <main className="relative z-10">{children}</main>
    </div>
  );
}
