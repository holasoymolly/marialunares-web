import { ReactNode } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-transparent">
      {/* Logo */}
      <div className="absolute top-8 left-8 z-20">
        <a href="/" className="group block">
          <Image
            src="/images/ml-logo-blanco.webp"
            alt="Maria Lunares Logo"
            width={100}
            height={35}
            className="group-hover:hidden"
          />
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
      <div className="absolute right-8 top-8 flex flex-col items-end gap-4 text-sm sm:text-lg z-20">
        <a href="#" className="transition duration-300 hover:font-bold">Store</a>
        <a href="#" className="transition duration-300 hover:font-bold">Tour</a>
        <a href="#" className="transition duration-300 hover:font-bold">Photos</a>
        <a href="#" className="transition duration-300 hover:font-bold">Contact</a>
      </div>

      {/* Botón Newsletter */}
      <div className="absolute bottom-8 left-8 z-20">
        <a href="https://example.com" target="_blank" rel="noopener noreferrer">
          <button className="px-5 py-1 border border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition duration-300">
            Newsletter
          </button>
        </a>
      </div>

      {/* Redes sociales */}
      <div className="absolute bottom-8 right-8 flex gap-4 z-20">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition duration-300"
        >
          <Icon icon="mdi:instagram" className="text-white text-xl" />
        </a>
        <a
          href="https://www.tiktok.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition duration-300"
        >
          <Icon icon="ic:baseline-tiktok" className="text-white text-xl" />
        </a>
        <a
          href="https://www.youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition duration-300"
        >
          <Icon icon="mdi:youtube" className="text-white text-xl" />
        </a>
        <a
          href="https://www.spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition duration-300"
        >
          <Icon icon="mdi:spotify" className="text-white text-xl" />
        </a>
        <a
          href="https://www.soundcloud.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition duration-300"
        >
          <Icon icon="mdi:soundcloud" className="text-white text-xl" />
        </a>
      </div>

      {/* Contenido dinámico */}
      <main className="relative z-10">{children}</main>
    </div>
  );
}