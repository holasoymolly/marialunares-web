import Head from 'next/head';

function Musica() {
  const imageLinks = [
    { url: 'https://open.spotify.com/album/1p4NjRE0zZ2VU5liuQ3hXP?si=tO6qU349Sp6KJIk1ESpr-A', imgSrc: 'images/ml-sol-trips-coverart.webp' },
    { url: 'https://open.spotify.com/track/6GKHVLuwE5rwx2f02WX1Cw?si=f34fc1905c6b4fe6', imgSrc: 'images/ml-sol-coverart.webp' },
    { url: 'https://open.spotify.com/track/5S0mbj3MTfEtIyS81vEW3Y?si=17599c4ecfe74663', imgSrc: 'images/ml-sabes-coverart.webp' },
    { url: 'https://open.spotify.com/album/0VGd8TOS3VEt6SORY72aAW?si=nq_euPY4QxibjGXMIyYVUg', imgSrc: 'images/ml-luna-coverart.webp' },
    { url: 'https://open.spotify.com/track/3oanYh0xtkJtAXkz8mynbd?si=ca1eb88ba5f94571', imgSrc: 'images/ml-sombra-coverart.webp' }
  ];

  return (
    <>
      <Head>
        <title>Música - Maria Lunares</title>
      </Head>
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
              <img 
                src={imageLinks[0].imgSrc} 
                alt="Main Image"
                className="w-full h-auto object-cover rounded-lg transition duration-300 hover:scale-105"
              />
            </a>
          </div>

          {/* Imágenes secundarias */}
          <div className="grid grid-cols-2 gap-2 gallery-grid">
            {imageLinks.slice(1).map((item, index) => (
              <a key={index} href={item.url} target="_blank" rel="noopener noreferrer">
                <img 
                  src={item.imgSrc} 
                  alt={`Image ${index + 2}`}
                  className="w-full h-auto object-cover rounded-lg transition duration-300 hover:scale-105"
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
            top: 40vh; /* Ajusta posición vertical en tablets */
            left: 33vw; /* Ajusta posición horizontal en tablets */
            font-size: 6rem; /* Tamaño de fuente más grande en tablets */
            transform: translate(-50%, -50%);
            z-index: 10;
          }

          .gallery-container {
            top: 58vh; /* Ajusta posición vertical en tablets */
            left: 68vw; /* Centra horizontalmente en tablets */
            transform: translate(-50%, -50%);
            width: 60vw; /* Ajusta el ancho en tablets */
          }

          .gallery-main {
            width: 60%; /* Ajusta el ancho en tablets */
          }

          .gallery-grid {
            width: 60%; /* Ajusta el ancho en tablets */
            gap: 1.5rem; /* Espaciado entre elementos */
          }
        }

        /* Mobile Styling */
        @media (max-width: 768px) {
          .desktop-title {
            top: 40vh;
            left: 20vw;
            font-size: 4rem;
            transform: translate(0, 0); /* Ajuste para evitar conflictos */
            z-index: 10;
          }

          .gallery-container {
            top: 38vh;
            left: 55vw;
            transform: translate(-50%, -50%);
            width: 40vw;
          }

          .gallery-main {
            width: 100%; /* Ajusta el ancho en móviles */
          }

          .gallery-grid {
            width: 100%; /* Ajusta el ancho en móviles */
            gap: 1rem;
          }
        }
      `}</style>
    </>
  );
}

export default Musica;