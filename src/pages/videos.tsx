import Head from 'next/head';
import Layout from '@/components/layout';

function Videos() {
  const youtubeVideos = [
    { url: 'https://www.youtube.com/embed/fbITjrEfzQY?si=dCeKC8hkvo6pwv-i', title: 'Video 1' },
    { url: 'https://www.youtube.com/embed/vlHOD7OEPow?si=DBEjAPeng3BNlFsJ', title: 'Video 2' },
    { url: 'https://www.youtube.com/embed/o-nTgMCuISE?si=d4_bJgWwkj_wuQ2r', title: 'Video 3' },
    { url: 'https://www.youtube.com/embed/G1wMt_1MMrY?si=0UUYBZpebbLE6iYy', title: 'Video 4' },
    { url: 'https://www.youtube.com/embed/4X5MzKsqRCs?si=JThMJLDJ0sJ2uxr2', title: 'Video 5' },
  ];

  return (
    <Layout>
      <Head>
        <title>Videos - Maria Lunares</title>
      </Head>
      <div 
        className="relative w-screen min-h-screen bg-black text-white"
        style={{
          paddingTop: '28rem', // Baja todo el contenido
        }}
      >
        {/* Título */}
        <h1 
          className="text-9xl font-bold absolute"
          style={{
            top: '20vh', // Ajusta la posición del título
            left: '3vw',
            margin: 0,
            transform: 'translate(0, 0)',
          }}
        >
          VIDEOS
        </h1>

        {/* Galería de videos */}
        <div className="flex flex-col gap-8 video-container">
          {youtubeVideos.map((video, index) => (
            <div key={index} className="w-screen h-auto relative">
              <iframe
                src={video.url}
                title={video.title}
                className="w-full h-[calc(150vh/3)] transition duration-300"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  borderRadius: '0.5rem',
                }}
              ></iframe>
            </div>
          ))}
        </div>
      </div>

      {/* Estilos */}
      <style jsx>{`
        body {
          margin: 0;
          padding: 0;
        }
        h1 {
          color: white;
          font-size: 9rem;
        }
        iframe {
          border: none;
        }
        @media (max-width: 768px) {
          h1 {
            font-size: 4rem;
            top: 10vh;
            left: 5vw;
          }
          iframe {
            height: 25vh; /* Ajusta la altura proporcional en móviles */
          }
          .video-container {
            margin-top: -5rem; /* Sube todos los videos en móviles */
          }
        }
      `}</style>
    </Layout>
  );
}

export default Videos;