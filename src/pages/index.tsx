import Seo from "@/components/Seo";
import { useTranslations } from "@/i18n/useTranslations";

export default function Home() {
  const { t } = useTranslations();
  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-transparent">
      <Seo title={t.meta.home.title} description={t.meta.home.description} />
      {/* Video de fondo */}
      <video
        src="/videos/home-background.mp4"
        poster="/images/home-poster.webp"
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover -z-20"
      />

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black bg-opacity-50 -z-10"></div>

      {/* Nombre, género y frase de lugar */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="home-enter flex flex-col items-center text-center">
          <h1 className="home-title font-bold tracking-tight">María Lunares</h1>
          <p className="mt-6 max-w-[26ch] text-sm uppercase tracking-[0.2em] opacity-90 sm:max-w-none sm:text-base">
            {t.brand.descriptorShort}
          </p>
          <p className="mt-5 max-w-[30ch] text-base opacity-70 sm:text-lg">{t.brand.place}</p>
        </div>
      </main>

      {/* Estilos */}
      <style jsx>{`
        .home-title {
          font-size: clamp(2.75rem, 9vw, 7rem);
          line-height: 1;
        }

        /* Entrada suave al cargar; se anula con prefers-reduced-motion (globals.css). */
        .home-enter {
          animation: home-fade-up 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes home-fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
