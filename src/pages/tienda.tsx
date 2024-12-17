import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import Image from "next/image";

// Define la interfaz Producto
interface Producto {
  id: string;
  title: string;
  images: { src: string }[];
  variants: { price: number }[];
  hosted_button_id?: string; // Agregamos la propiedad para el PayPal button ID
  custom_price?: string; // Agregamos un precio personalizado
}

export default function Tienda() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  // IDs únicos para PayPal y precios personalizados
  const productoDetalles: Record<string, { hosted_button_id: string; custom_price: string }> = {
    "Alien Tee": { hosted_button_id: "U9VJKDT49VP6A", custom_price: "25.00" },
    "Melting Logo Tee": { hosted_button_id: "58QGK7G4PD5Z8", custom_price: "25.00" },
    "Raíces Tee": { hosted_button_id: "FQ7KSVYUVVVR6", custom_price: "25.00" },
    "Sol Tee": { hosted_button_id: "LUL52QCDGTYTJ", custom_price: "25.00" },
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get("/api/printify/products");

        // Agregar IDs de PayPal y precios personalizados
        const productosConDetalles = response.data.data.map((producto: Producto) => ({
          ...producto,
          hosted_button_id: productoDetalles[producto.title]?.hosted_button_id || "BUTTON_ID_POR_DEFECTO",
          custom_price: productoDetalles[producto.title]?.custom_price || "N/A",
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
  }, []);

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
                className="mx-auto mb-4 object-cover rounded-lg shadow-lg cursor-pointer"
                onClick={() => setProductoSeleccionado(producto)} // Abre el modal con la galería
              />
              <h2 className="text-2xl font-semibold mb-2">{producto.title}</h2>
              <p className="text-lg mb-4">${producto.custom_price} USD</p>

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

      {/* Modal de galería de imágenes */}
      {productoSeleccionado && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg p-6 max-w-4xl relative">
            <button
              className="absolute top-2 right-4 text-2xl font-bold text-black"
              onClick={() => setProductoSeleccionado(null)}
            >
              ×
            </button>

            <h2 className="text-3xl font-bold mb-4">{productoSeleccionado.title}</h2>

            {/* Carrusel de imágenes */}
            <Swiper
  modules={[Navigation, Autoplay]}
  navigation
  spaceBetween={10}
  slidesPerView={1}
  className="custom-swiper" // Añade esta clase personalizada
>
  {productoSeleccionado.images.map((img, index) => (
    <SwiperSlide key={index}>
      <Image
        src={img.src}
        alt={`Imagen ${index + 1}`}
        width={600}
        height={600}
        className="rounded-lg mx-auto"
      />
    </SwiperSlide>
  ))}
</Swiper>
          </div>
        </div>
      )}
    </div>
  );
}