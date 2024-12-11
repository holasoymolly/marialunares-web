import Image from "next/image";
import { Icon } from "@iconify/react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Video de fondo */}
      <video
        src="/videos/website-background.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      {/* Contenido principal */}
      <div className="relative flex flex-col justify-between min-h-screen px-8">
        {/* Logo en la esquina */}
        <div className="pt-8">
          <a
            href="/"
            className="group inline-block" // Cambia "block" a "inline-block" para ajustar el tamaño
            style={{ width: 100, height: 35 }} // Fija el tamaño del contenedor
          >
            {/* Imagen normal */}
            <Image
              src="/images/ml-logo-blanco.webp"
              alt="Maria Lunares Logo"
              width={100}
              height={35}
              className="group-hover:hidden"
            />
            {/* Imagen al hacer hover */}
            <Image
              src="/images/ml-logo-blanco-negativo.webp"
              alt="Maria Lunares Logo Hover"
              width={100}
              height={35}
              className="hidden group-hover:block"
            />
          </a>
        </div>

        {/* Menú lateral */}
        <div className="absolute right-8 top-8 flex flex-col items-end gap-4 text-sm sm:text-lg">
        <a href="#" className="transition duration-300 hover:font-bold">Store</a>
        <a href="#" className="transition duration-300 hover:font-bold">Tour</a>
        <a href="#" className="transition duration-300 hover:font-bold">Photos</a>
        <a href="#" className="transition duration-300 hover:font-bold">Contact</a>
        </div>

        {/* Botón Newsletter en la esquina inferior izquierda */}
        <div className="absolute bottom-8 left-8">
          <a
            href="https://example.com" // Cambia este enlace al destino externo que desees
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="px-5 py-1 border border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition duration-300">
              Newsletter
            </button>
          </a>
        </div>

        {/* Íconos de redes sociales en una fila */}
        <div className="absolute bottom-8 right-8 flex gap-4">
          {/* Instagram */}
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition duration-300"
          >
            <Icon icon="mdi:instagram" className="text-white text-xl" />
          </a>
          {/* TikTok */}
          <a
            href="https://www.tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition duration-300"
          >
            <Icon icon="ic:baseline-tiktok" className="text-white text-xl" />
          </a>
          {/* YouTube */}
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition duration-300"
          >
            <Icon icon="mdi:youtube" className="text-white text-xl" />
          </a>
          {/* Spotify */}
          <a
            href="https://www.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition duration-300"
          >
            <Icon icon="mdi:spotify" className="text-white text-xl" />
          </a>
          {/* SoundCloud */}
          <a
            href="https://www.soundcloud.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition duration-300"
          >
            <Icon icon="mdi:soundcloud" className="text-white text-xl" />
          </a>
        </div>
      </div>
    </div>
  );
}