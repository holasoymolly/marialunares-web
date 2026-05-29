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

      {/* Contenido dinámico */}
      <main className="relative z-10 flex justify-center items-center min-h-screen">
        {/* Aquí puedes añadir contenido específico del index si lo necesitas */}
      </main>
    </div>
  );
}