import Seo from "@/components/Seo";
import { useTranslations } from "@/i18n/useTranslations";

export default function Contacto() {
  const { t } = useTranslations();
  const email = "estoesmarialunares@gmail.com";
  return (
    <>
      <Seo title={t.meta.contacto.title} description={t.meta.contacto.description} />
      <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center">
        {/* Contenido principal */}
        <main className="text-center">
          <h1 className="text-9xl font-extrabold mb-4 title">{t.contacto.heading}</h1>
          <a href={`mailto:${email}`} className="text-lg underline-offset-4 hover:underline">
            {email}
          </a>
        </main>
      </div>

      {/* Estilos */}
      <style jsx>{`
        .title {
          font-size: 9rem;
        }

        /* Estilos para dispositivos móviles */
        @media (max-width: 768px) {
          .title {
            font-size: 4rem;
          }
        }
      `}</style>
    </>
  );
}
