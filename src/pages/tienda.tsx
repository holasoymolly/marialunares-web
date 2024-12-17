import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import Image from "next/image";

// Define la interfaz Producto
interface Producto {
  id: string;
  title: string;
  images: { src: string }[];
  variants: { price: number }[];
  hosted_button_id?: string; // Agregamos la propiedad para el PayPal button ID
}

export default function Tienda() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // IDs únicos para PayPal
  const hostedButtonIds: Record<string, string> = {
    "Alien Tee": "U9VJKDT49VP6A",
    "Melting Logo Tee": "58QGK7G4PD5Z8",
    "Raíces Tee": "FQ7KSVYUVVVR6",
    "Sol Tee": "LUL52QCDGTYTJ",
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get("/api/printify/products");

        const productosConBotones = response.data.data.map((producto: Producto) => ({
          ...producto,
          hosted_button_id: hostedButtonIds[producto.title] || "BUTTON_ID_POR_DEFECTO",
        }));

        setProductos(productosConBotones);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [hostedButtonIds]); // Se añade hostedButtonIds como dependencia

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      {/* Hero / Banner */}
      <div className="w-screen mx-0 px-0 mb-8">
        <Swiper modules={[Autoplay]} spaceBetween={0} slidesPerView={1} autoplay={{ delay: 3000 }}>
          {productos.slice(0, 5).map((producto) => (
            <SwiperSlide key={producto.id} style={{ height: "600px" }}>
              <Image
                src={producto.images[0]?.src}
                alt={producto.title}
                layout="fill"
                objectFit="cover"
                className="opacity-50"
              />
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-center">
                <h2 className="text-3xl font-bold">{producto.title}</h2>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Título */}
      <h1 className="text-6xl font-extrabold my-8 text-center">TIENDA</h1>

      {/* Estado de carga */}
      {loading ? (
        <p className="text-xl text-white">Cargando productos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {productos.map((producto) => (
            <div key={producto.id} className="text-center">
              <Image
                src={producto.images[0]?.src || "/images/placeholder.jpg"}
                alt={producto.title}
                width={256}
                height={256}
                className="mx-auto mb-4 object-cover rounded-lg shadow-lg"
              />
              <h2 className="text-2xl font-semibold mb-2">{producto.title}</h2>
              <p className="text-lg mb-4">
                ${producto.variants[0]?.price ? (producto.variants[0].price / 100).toFixed(2) : "N/A"} USD
              </p>

              {/* Botón de compra */}
              <form
                action="https://www.paypal.com/cgi-bin/webscr"
                method="post"
                target="_blank"
              >
                <input type="hidden" name="cmd" value="_s-xclick" />
                <input
                  type="hidden"
                  name="hosted_button_id"
                  value={producto.hosted_button_id}
                />
                <button
                  type="submit"
                  className="px-8 py-2 bg-white text-black font-bold rounded-full hover:scale-105 transition duration-300"
                >
                  Comprar Ahora
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}