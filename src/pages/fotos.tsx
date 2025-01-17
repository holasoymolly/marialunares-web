import Head from "next/head";
import Image from "next/image";

// Función para desordenar las imágenes de manera aleatoria
function shuffleArray(array: { url: string; title: string }[]): { url: string; title: string }[] {
  return array.sort(() => Math.random() - 0.5);
}

function Fotos() {
  // Lista de imágenes
  const images = shuffleArray([
    { url: "/images/sev_1605.jpg", title: "Photo 1" },
    { url: "/images/sev_1647.jpg", title: "Photo 2" },
    { url: "/images/sev_1651.jpg", title: "Photo 3" },
    { url: "/images/sev_1668.jpg", title: "Photo 4" },
    { url: "/images/sev_1730.jpg", title: "Photo 5" },
    { url: "/images/sev1785.jpg", title: "Photo 6" },
    { url: "/images/img_9620.jpg", title: "Photo 7" },
    { url: "/images/img_9641.jpg", title: "Photo 8" },
    { url: "/images/img_9644.jpg", title: "Photo 9" },
    { url: "/images/img_9645.jpg", title: "Photo 10" },
    { url: "/images/img_9676.jpg", title: "Photo 11" },
    { url: "/images/img_9680.jpg", title: "Photo 12" },
    { url: "/images/raices-bts-3.jpg", title: "Photo 13" },
    { url: "/images/raices-bts-4.jpg", title: "Photo 14" },
    { url: "/images/raices-bts-6.jpg", title: "Photo 15" },
    { url: "/images/raices-bts-9.jpg", title: "Photo 16" },
    { url: "/images/raices-bts-20.jpg", title: "Photo 17" },
    { url: "/images/raices-bts-22.jpg", title: "Photo 18" },
    { url: "/images/raices-bts-28.jpg", title: "Photo 19" },
    { url: "/images/raices-bts-31.jpg", title: "Photo 20" },
    { url: "/images/raices-bts-39.jpg", title: "Photo 21" },
    { url: "/images/raices-bts-54.jpg", title: "Photo 22" },
    { url: "/images/raices-bts-57.jpg", title: "Photo 23" },
  ]);

  return (
    <>
      <Head>
        <title>Fotos - Maria Lunares</title>
      </Head>
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
          FOTOS FOTOS FOTOS FOTOS FOTOS FOTOS FOTOS
        </h1>

        {/* Galería de imágenes */}
        <div className="masonry-gallery" style={{ marginTop: "35vh" }}>
          {images.map((image, index) => (
            <div key={index} className="gallery-item">
              <Image
                src={image.url}
                alt={image.title}
                layout="responsive"
                width={300}
                height={450}
                className="rounded-lg transition duration-300"
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