import Image from "next/image";
import { useEffect, useState } from "react";
import Seo from "@/components/Seo";
import { useTranslations } from "@/i18n/useTranslations";
import { photos, type Photo } from "@/data/photos";

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
  const { t, locale } = useTranslations();

  // El orden base es estable para que servidor y cliente rendericen igual.
  const baseImages = photos;
  const altFor = (photo: Photo) => (locale === "en" ? photo.altEn : photo.altEs);

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
            <div key={image.src} className="gallery-item">
              <Image
                src={image.src}
                alt={altFor(image)}
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