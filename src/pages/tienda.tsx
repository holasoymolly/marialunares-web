import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";

// Define la interfaz Producto
interface Producto {
  id: string;
  title: string;
  images: { src: string }[];
  variants: { price: number }[];
}

export default function Tienda() {
  const [productos, setProductos] = useState<Producto[]>([]);

  // Imágenes locales del banner
  const imagenesBanner = [
    { src: "/images/alien-banner.webp", alt: "Alien Tee" },
    { src: "/images/melting-banner.webp", alt: "Melting Logo Tee" },
    { src: "/images/raices-banner.webp", alt: "Raíces Tee" },
    { src: "/images/sol-banner.webp", alt: "Sol Tee" },
  ];

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get("/api/printify/products");
        setProductos(response.data.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      {/* Hero / Banner */}
      <div className="w-screen mx-0 px-0 mb-8">
        <Swiper spaceBetween={0} slidesPerView={1} autoplay={{ delay: 3000 }}>
          {imagenesBanner.map((imagen, index) => (
            <SwiperSlide
              key={index}
              className="relative w-screen"
              style={{ height: "400px" }}
            >
              <Image
                src={imagen.src}
                alt={imagen.alt}
                layout="fill" // Hace que la imagen cubra todo el contenedor
                objectFit="cover"
                className="opacity-50"
              />
              <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center">
                <h2 className="text-3xl font-bold">{imagen.alt}</h2>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Título */}
      <h1 className="text-6xl font-extrabold my-8 text-center">TIENDA</h1>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
        {productos.map((producto: Producto) => (
          <div key={producto.id} className="text-center">
            <Image
              src={producto.images[0]?.src}
              alt={producto.title}
              width={256}
              height={256}
              className="mx-auto mb-4 object-cover rounded-lg shadow-lg"
            />
            <h2 className="text-2xl font-semibold mb-2">{producto.title}</h2>
            <p className="text-lg mb-4">${producto.variants[0]?.price / 100} USD</p>

            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
              <input type="hidden" name="cmd" value="_s-xclick" />
              <input type="hidden" name="hosted_button_id" value="BUTTON_ID_POR_DEFECTO" />
              <button
                type="submit"
                className="px-8 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition duration-300"
              >
                Comprar Ahora
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}