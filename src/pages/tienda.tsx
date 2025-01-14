import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import Image from "next/image";
import Head from "next/head";

interface Producto {
  id: string;
  title: string;
  images: { src: string }[];
  price: number;
  hosted_button_id?: string;
}

export default function Tienda() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get("/api/printify/products");

        // Detalles de productos con sus hosted_button_id
        const productoDetalles: Record<string, { hosted_button_id: string }> = {
          "Alien Tee": { hosted_button_id: "U9VJKDT49VP6A" },
          "Melting Logo Tee": { hosted_button_id: "58QGK7G4PD5Z8" },
          "Raíces Tee": { hosted_button_id: "FQ7KSVYUVVVR6" },
          "Sol Tee": { hosted_button_id: "LUL52QCDGTYTJ" },
        };

        // Agregar hosted_button_id a los productos obtenidos
        const productosConDetalles = response.data.map((producto: Producto) => ({
          ...producto,
          hosted_button_id: productoDetalles[producto.title as keyof typeof productoDetalles]?.hosted_button_id || "BUTTON_ID_POR_DEFECTO",
        }));

        setProductos(productosConDetalles);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []); // Dependencias vacías para que se ejecute solo una vez

  return (
    <>
      <Head>
        <title>Tienda - Maria Lunares</title>
        <meta name="description" content="Explora y compra los productos exclusivos de Maria Lunares." />
      </Head>
      <div className="min-h-screen bg-black text-white flex flex-col items-center">
        <h1 className="text-9xl font-extrabold my-20 text-center">TIENDA</h1>

        {loading ? (
          <p className="text-xl text-white">Cargando...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
            {productos.map((producto) => (
              <div key={producto.id} className="text-center">
                <Image
                  src={producto.images[0]?.src || "/images/placeholder.jpg"}
                  alt={producto.title}
                  width={200}
                  height={200}
                  className="mx-auto mb-4 mt-20 object-cover rounded-lg"
                />
                <h2 className="text-2xl font-semibold mb-2">{producto.title}</h2>
                <p className="text-lg mb-4">${producto.price.toFixed(2)} USD</p>
                <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                  <input type="hidden" name="cmd" value="_s-xclick" />
                  <input type="hidden" name="hosted_button_id" value={producto.hosted_button_id} />
                  <button type="submit" className="px-8 py-2 bg-white text-black font-bold rounded-full">
                    Comprar
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}