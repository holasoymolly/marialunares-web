import { ReactNode } from "react";
import Link from "next/link"; // Importa Link desde next/link
import { Icon } from "@iconify/react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-transparent">
      {/* Logo */}
      <div className="fixed top-8 left-8 z-20">
        <Link href="/" aria-label="Logo Maria Lunares">
          <div
            className="block bg-logo logo-hover"
            style={{
              width: "100px",
              height: "100px",
            }}
          ></div>
        </Link>
      </div>

      {/* Menú lateral */}
      <div className="fixed right-8 top-8 flex flex-col items-end gap-4 text-sm sm:text-lg z-20">
        <Link href="/musica" className="transition duration-300 hover:font-bold cursor-pointer">
          Música
        </Link>
        <Link href="/videos" className="transition duration-300 hover:font-bold cursor-pointer">
          Videos
        </Link>
        <Link href="/fotos" className="transition duration-300 hover:font-bold cursor-pointer">
          Fotos
        </Link>
        <a
          href="https://marialunares.threadless.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition duration-300 hover:font-bold"
        >
          Tienda
        </a>
        <Link href="/contacto" className="transition duration-300 hover:font-bold cursor-pointer">
          Contacto
        </Link>
      </div>

      {/* Botón Newsletter */}
      <div className="fixed bottom-8 left-8 z-20">
        <a
          href="https://forms.gle/aZYqhXwWFcDcjwbQ8"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="px-5 py-1 border border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition duration-300">
            Newsletter
          </button>
        </a>
      </div>

      {/* Redes sociales */}
      <div className="fixed bottom-8 right-8 flex gap-4 z-20">
        <a
          href="https://www.instagram.com/_marialunares"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition duration-300"
        >
          <Icon icon="mdi:instagram" className="text-white text-xl" />
        </a>
        <a
          href="https://www.tiktok.com/@_marialunares"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition duration-300"
        >
          <Icon icon="ic:baseline-tiktok" className="text-white text-xl" />
        </a>
        <a
          href="https://www.youtube.com/@_marialunares"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition duration-300"
        >
          <Icon icon="mdi:youtube" className="text-white text-xl" />
        </a>
        <a
          href="https://open.spotify.com/artist/5xO6MugYgEkawkhupiuzbj?si=pWh4yvPfRXivm4QOCqPh1Q"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition duration-300"
        >
          <Icon icon="mdi:spotify" className="text-white text-xl" />
        </a>
        <a
          href="https://soundcloud.com/marialunares"
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