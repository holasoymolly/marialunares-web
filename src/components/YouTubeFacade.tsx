import { useState } from "react";

interface YouTubeFacadeProps {
  id: string;
  title: string;
  className?: string;
}

// "Facade" ligero: muestra la miniatura de YouTube y solo carga el iframe
// (cientos de KB de JS del reproductor) cuando el usuario pulsa play.
export default function YouTubeFacade({ id, title, className }: YouTubeFacadeProps) {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
        title={title}
        className={className}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ border: "none", borderRadius: "0.5rem" }}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      aria-label={`Reproducir: ${title}`}
      className={`group relative block w-full cursor-pointer overflow-hidden ${className ?? ""}`}
      style={{ border: "none", borderRadius: "0.5rem", padding: 0 }}
    >
      <img
        src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
        alt={title}
        loading="lazy"
        className="h-full w-full object-cover"
        // Si el video no tiene miniatura en alta (1280×720), caemos a hqdefault.
        onError={(e) => {
          const img = e.currentTarget;
          if (!img.src.endsWith("hqdefault.jpg")) {
            img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
          }
        }}
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/10">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600/90 transition group-hover:scale-110">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="white" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
