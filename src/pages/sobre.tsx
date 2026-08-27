import Link from "next/link";
import { Icon } from "@iconify/react";
import Seo from "@/components/Seo";
import { useNewsletter } from "@/components/NewsletterProvider";
import { useTranslations } from "@/i18n/useTranslations";

// Etiqueta de sección: mismo tratamiento que en /musica/[slug] para que las
// dos páginas de texto largo se lean como una sola familia. Aquí el espaciado
// lo pone el `gap` de la rejilla, así que la etiqueta no lleva margen propio.
function SectionLabel({ children }: { children: string }) {
  return <h2 className="text-xs uppercase tracking-[0.2em] opacity-60">{children}</h2>;
}

// Página de identidad del proyecto. Todo el copy viene de
// src/i18n/translations.ts (bloques `sobre` y `brand`).
export default function Sobre() {
  const { t } = useTranslations();
  const { openNewsletter } = useNewsletter();

  // El titular se parte justo después de la coma para que las dos mitades de
  // la frase caigan en líneas distintas. La coma existe en los dos idiomas; si
  // en alguno faltara, la frase se renderiza en una sola línea.
  const comma = t.brand.place.indexOf(",");
  const placeLines =
    comma === -1
      ? [t.brand.place]
      : [t.brand.place.slice(0, comma + 1), t.brand.place.slice(comma + 1).trim()];

  const blocks = [
    { key: "what", label: t.sobre.whatLabel, text: t.sobre.what },
    { key: "ml", label: t.sobre.mlLabel, text: t.sobre.ml },
    { key: "project", label: t.sobre.projectLabel, text: t.sobre.project },
  ];

  return (
    <>
      <Seo
        title={t.meta.sobre.title}
        description={t.meta.sobre.description}
        paths={{ es: "/sobre", en: "/about" }}
      />

      <div className="min-h-[100dvh] w-full bg-black text-white">
        {/* El menú fijo mide 268px de alto en móvil y 316px desde `sm`. Por
            debajo de `lg` el texto ocupa todo el ancho y pasaría por debajo de
            él, así que el contenido arranca más abajo hasta que hay sitio. */}
        <article className="sobre-enter mx-auto w-full max-w-[1400px] px-6 pb-52 pt-72 sm:px-10 sm:pt-80 lg:px-16 lg:pt-40">
          {/* Apertura: la frase de lugar es el titular de la página */}
          <header>
            <p className="text-xs uppercase tracking-[0.2em] opacity-60">{t.sobre.eyebrow}</p>
            {/* El límite va en em (no en ch sobre el contenedor) para que
                escale con el tamaño del propio titular. */}
            <h1 className="sobre-title mt-6 max-w-[14em] font-bold tracking-tight">
              {placeLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-8 max-w-[42ch] text-sm uppercase tracking-[0.18em] opacity-70">
              {t.brand.descriptorLong}
            </p>
          </header>

          {/* Bloques de texto: etiqueta y párrafo en dos columnas a partir de lg */}
          <div className="mt-24 flex flex-col gap-16 lg:gap-20">
            {blocks.map((block) => (
              <section
                key={block.key}
                className="grid gap-5 lg:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] lg:gap-x-20"
              >
                <SectionLabel>{block.label}</SectionLabel>
                <p className="max-w-[58ch] text-lg leading-relaxed opacity-90">{block.text}</p>
              </section>
            ))}
          </div>

          {/* Cierre y llamadas a la acción */}
          <section className="mt-28 max-w-[46rem] border-t border-white/15 pt-14">
            <div className="mb-6">
              <SectionLabel>{t.sobre.directLabel}</SectionLabel>
            </div>
            <p className="max-w-[46ch] text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              {t.sobre.direct}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={openNewsletter}
                className="inline-flex whitespace-nowrap rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition duration-300 hover:bg-white/85 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {t.nav.newsletter}
              </button>

              <Link
                href="/musica"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/40 px-6 py-2.5 text-sm transition duration-300 hover:border-white hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {t.nav.musica}
                <Icon icon="mdi:arrow-right" aria-hidden="true" />
              </Link>
            </div>
          </section>
        </article>
      </div>

      {/* Estilos */}
      <style jsx>{`
        .sobre-title {
          font-size: clamp(2.5rem, 6.5vw, 4.75rem);
          line-height: 1.05;
        }

        /* Entrada suave al cargar; se anula con prefers-reduced-motion (globals.css). */
        .sobre-enter {
          animation: sobre-fade-up 500ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes sobre-fade-up {
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
