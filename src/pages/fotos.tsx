import Image from "next/image";
import { useEffect, useState } from "react";
import Seo from "@/components/Seo";
import { useTranslations } from "@/i18n/useTranslations";

type Photo = { url: string; title: string };

// Desordena una copia del array (no muta el original) con Fisher–Yates.
function shuffleArray(array: Photo[]): Photo[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function Fotos() {
  const { t } = useTranslations();
  // Lista de imágenes (orden estable para el render del servidor)
  const baseImages: Photo[] = [
    { url: "/images/fotos/sev/sev_1605.jpg", title: "Photo 1" },
    { url: "/images/fotos/sev/sev_1647.jpg", title: "Photo 2" },
    { url: "/images/fotos/sev/sev_1651.jpg", title: "Photo 3" },
    { url: "/images/fotos/sev/sev_1668.jpg", title: "Photo 4" },
    { url: "/images/fotos/sev/sev_1730.jpg", title: "Photo 5" },
    { url: "/images/fotos/sev/sev1785.jpg", title: "Photo 6" },
    { url: "/images/fotos/retratos/img_9620.jpg", title: "Photo 7" },
    { url: "/images/fotos/retratos/img_9641.jpg", title: "Photo 8" },
    { url: "/images/fotos/retratos/img_9644.jpg", title: "Photo 9" },
    { url: "/images/fotos/retratos/img_9645.jpg", title: "Photo 10" },
    { url: "/images/fotos/retratos/img_9676.jpg", title: "Photo 11" },
    { url: "/images/fotos/retratos/img_9680.jpg", title: "Photo 12" },
    { url: "/images/fotos/raices-bts/raices-bts-3.jpg", title: "Photo 13" },
    { url: "/images/fotos/raices-bts/raices-bts-4.jpg", title: "Photo 14" },
    { url: "/images/fotos/raices-bts/raices-bts-6.jpg", title: "Photo 15" },
    { url: "/images/fotos/raices-bts/raices-bts-9.jpg", title: "Photo 16" },
    { url: "/images/fotos/raices-bts/raices-bts-20.jpg", title: "Photo 17" },
    { url: "/images/fotos/raices-bts/raices-bts-22.jpg", title: "Photo 18" },
    { url: "/images/fotos/raices-bts/raices-bts-28.jpg", title: "Photo 19" },
    { url: "/images/fotos/raices-bts/raices-bts-31.jpg", title: "Photo 20" },
    { url: "/images/fotos/raices-bts/raices-bts-39.jpg", title: "Photo 21" },
    { url: "/images/fotos/raices-bts/raices-bts-54.jpg", title: "Photo 22" },
    { url: "/images/fotos/raices-bts/raices-bts-57.jpg", title: "Photo 23" },
    { url: "/images/fotos/sev/sev_1479.webp", title: "Photo 24" },
    { url: "/images/fotos/sev/sev_1483.webp", title: "Photo 25" },
    { url: "/images/fotos/sev/sev_1494.webp", title: "Photo 26" },
    { url: "/images/fotos/sev/sev_1515.webp", title: "Photo 27" },
    { url: "/images/fotos/sev/sev_1535.webp", title: "Photo 28" },
  ];

  // Render inicial determinista (servidor y cliente coinciden → sin hydration
  // mismatch). Tras montar, barajamos una vez en el cliente para dar variedad.
  const [images, setImages] = useState<Photo[]>(baseImages);
  useEffect(() => {
    setImages(shuffleArray(baseImages));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Seo title={t.meta.fotos.title} description={t.meta.fotos.description} />
      <div className="relative w-screen min-h-screen bg-black text-white">
        {/* Título */}
        <h1
          className="text-9xl font-bold absolute title"
          style={{
            top: "-14vh",
            left: "-25vw",
            margin: 0,
            transform: "translate(0, 0)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            width: "150vw",
          }}
        >
          {Array(7).fill(t.nav.fotos.toUpperCase()).join(" ")}
        </h1>

        {/* Galería de imágenes */}
        <div className="masonry-gallery" style={{ marginTop: "35vh" }}>
          {images.map((image, index) => (
            <div key={image.url} className="gallery-item">
              <Image
                src={image.url}
                alt={image.title}
                width={300}
                height={450}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index < 2}
                loading={index < 2 ? "eager" : "lazy"}
                className="w-full h-auto rounded-lg transition duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Estilos */}
      <style jsx>{`
        .masonry-gallery {
          column-count: 2; /* Se mantiene en dos columnas */
          column-gap: 16px;
        }
        .gallery-item {
          break-inside: avoid;
          margin-bottom: 16px; /* Espaciado entre elementos */
        }
        @media (max-width: 768px) {
          .title {
            top: -9vh !important; /* Ajusta la posición en móviles */
            font-size: 4rem;
          }
          .masonry-gallery {
            column-count: 1; /* Una columna en móviles */
            column-gap: 8px;
          }
          .gallery-item {
            margin-bottom: 8px;
          }
        }
      `}</style>
    </>
  );
}

export default Fotos;