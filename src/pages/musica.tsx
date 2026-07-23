import Image from "next/image";
import Seo from "@/components/Seo";
import { useTranslations } from "@/i18n/useTranslations";

function Musica() {
  const { t } = useTranslations();
  const imageLinks = [
    { url: 'https://hypeddit.com/wdp8t4', imgSrc: '/images/ml-sabescorrer-coverart.webp' },
    { url: 'https://hypeddit.com/7cfw0z', imgSrc: '/images/lejos.webp' },
    { url: 'https://hypeddit.com/l3psaf', imgSrc: '/images/ml_coverart_denoche.webp' },
    { url: 'https://hypeddit.com/jz5sqo', imgSrc: '/images/ml-sol-trips-coverart.webp' },
    { url: 'https://hypeddit.com/uz51hf', imgSrc: '/images/ml-sol-coverart.webp' }
  ];

  return (
    <>
      <Seo title={t.meta.musica.title} description={t.meta.musica.description} />
      <div className="relative w-screen h-screen bg-black text-white">
        {/* Título */}
        <h1 className="text-9xl font-bold absolute desktop-title">
          MÚ<br />SI<br />CA
        </h1>

        {/* Galería de imágenes */}
        <div className="absolute gallery-container">
          {/* Imagen principal */}
          <div className="mb-5 gallery-main">
            <a href={imageLinks[0].url} target="_blank" rel="noopener noreferrer">
              <Image
                src={imageLinks[0].imgSrc}
                alt="Portada del álbum De Noche"
                width={384}
                height={384}
                sizes="(max-width: 768px) 60vw, 384px"
                priority
                className="object-cover rounded-lg transition duration-300 hover:scale-105"
              />
            </a>
          </div>

          {/* Imágenes secundarias */}
          <div className="grid grid-cols-2 gap-2 gallery-grid">
            {imageLinks.slice(1).map((item, index) => (
              <a key={index} href={item.url} target="_blank" rel="noopener noreferrer">
                <Image
                  src={item.imgSrc}
                  alt={`Portada ${index + 2}`}
                  width={192}
                  height={192}
                  sizes="(max-width: 768px) 30vw, 192px"
                  className="object-cover rounded-lg transition duration-300 hover:scale-105"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Estilos */}
      <style jsx>{`
        /* Desktop Styling */
        @media (min-width: 1025px) {
          .desktop-title {
            top: 35vh;
            left: 35vw;
            transform: translate(-50%, -50%);
            z-index: 10;
          }

          .gallery-container {
            top: 55vh;
            left: 56vw;
            transform: translate(-50%, -50%);
          }

          .gallery-main {
            width: 384px;
          }

          .gallery-grid {
            width: 384px;
          }
        }

        /* Tablet Styling */
        @media (min-width: 769px) and (max-width: 1024px) {
          .desktop-title {
            top: 40vh;
            left: 33vw;
            font-size: 6rem;
            transform: translate(-50%, -50%);
            z-index: 10;
          }

          .gallery-container {
            top: 58vh;
            left: 68vw;
            transform: translate(-50%, -50%);
            width: 60vw;
          }

          .gallery-main {
            width: 60%;
          }

          .gallery-grid {
            width: 60%;
            gap: 1.5rem;
          }
        }

        /* Mobile Styling */
        @media (max-width: 768px) {
          .desktop-title {
            top: 30vh;
            left: 20vw;
            font-size: 4rem;
            transform: translate(0, 0);
            z-index: 10;
          }

          .gallery-container {
            top: 58vh;
            left: 55vw;
            transform: translate(-50%, -50%);
            width: 40vw;
          }

          .gallery-main {
            width: 100%;
          }

          .gallery-grid {
            width: 100%;
            gap: 1rem;
          }
        }
      `}</style>
    </>
  );
}

export default Musica;