import Seo from "@/components/Seo";
import YouTubeFacade from "@/components/YouTubeFacade";
import { useTranslations } from "@/i18n/useTranslations";

function Videos() {
  const { t } = useTranslations();
  const youtubeVideos = [
    { id: "1h6RfRX4BL8", title: "Video 1" },
    { id: "fbITjrEfzQY", title: "Video 2" },
    { id: "SXA7ElJeK60", title: "Video 3" },
    { id: "o-nTgMCuISE", title: "Video 4" },
    { id: "G1wMt_1MMrY", title: "Video 5" },
    { id: "4X5MzKsqRCs", title: "Video 6" },
  ];

  return (
    <>
      <Seo title={t.meta.videos.title} description={t.meta.videos.description} />
      <div
        className="relative w-screen min-h-screen bg-black text-white"
        style={{ paddingTop: "28rem" }}
      >
        {/* Título */}
        <h1
          className="text-9xl font-bold absolute"
          style={{ top: "20vh", left: "3vw", margin: 0 }}
        >
          {t.nav.videos.toUpperCase()}
        </h1>

        {/* Galería de videos */}
        <div className="flex flex-col gap-8 video-container">
          {youtubeVideos.map((video) => (
            <div key={video.id} className="w-screen relative">
              <YouTubeFacade
                id={video.id}
                title={video.title}
                className="w-full h-[calc(150vh/3)] transition duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Estilos */}
      <style jsx>{`
        h1 {
          color: white;
          font-size: 9rem;
        }
        @media (max-width: 768px) {
          h1 {
            font-size: 4rem;
            top: 10vh;
            left: 5vw;
          }
          .video-container {
            margin-top: -5rem;
          }
        }
      `}</style>
    </>
  );
}

export default Videos;
