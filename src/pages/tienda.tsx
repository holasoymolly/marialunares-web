import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import ProductoCard from "../components/productocard";
import ModalProducto from "../components/modalproducto";
import Carrito from "../components/carrito";
import { ShoppingCartIcon as ShoppingCartIconSolid } from "@heroicons/react/solid"; // Ícono relleno

interface Producto {
  id: string;
  title: string;
  images: { src: string }[];
  price: number;
  options?: { name: string; values: string[] }[];
}

interface Pedido {
  producto: Producto;
  size: string;
  color: string;
  quantity: number;
}

export default function Tienda() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalProducto, setModalProducto] = useState<Producto | null>(null);
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [carrito, setCarrito] = useState<Pedido[]>([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get("/api/printify/products");
        const productosConDetalles = response.data.data.map((producto: Producto) => ({
          ...producto,
          price: 30, // Precio manual
          options: [
            { name: "Tamaño", values: ["S", "M", "L", "XL"] },
            { name: "Color", values: ["Blanco", "Negro", "Rojo"] },
          ],
        }));
        setProductos(productosConDetalles);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const onActualizarCantidad = (index: number, cantidad: number) => {
    setCarrito((prevCarrito) => {
      const nuevoCarrito = [...prevCarrito];
      nuevoCarrito[index].quantity = cantidad;
      return nuevoCarrito;
    });
  };

  return (
    <>
      <Head>
        <title>Tienda - Maria Lunares</title>
      </Head>
      <div className="min-h-screen bg-black text-white flex flex-col items-center">
        {/* Título responsive con márgenes dinámicos */}
        <h1 className="text-5xl sm:text-7xl lg:text-9xl font-extrabold mt-60 sm:mt-16 lg:mt-60 text-center">
          TIENDA
        </h1>

        <div className="relative mb-10">
          <button
            className="relative flex items-center text-white"
            onClick={() => setMostrarCarrito(!mostrarCarrito)}
          >
            <ShoppingCartIconSolid className="h-8 w-8" />
            {carrito.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {carrito.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
            {productos.map((producto) => (
              <ProductoCard
                key={producto.id}
                producto={producto}
                onComprar={() => setModalProducto(producto)}
              />
            ))}
          </div>
        )}
        <ModalProducto
          producto={modalProducto}
          pedido={pedido}
          setPedido={(nuevoPedido) =>
            setPedido({
              ...nuevoPedido,
              producto: modalProducto as Producto,
            })
          }
          onClose={() => setModalProducto(null)}
          onAddToCart={() => {
            if (modalProducto && pedido) {
              setCarrito([...carrito, pedido]);
              setModalProducto(null);
              setPedido(null);
            }
          }}
        />
        {mostrarCarrito && (
          <Carrito
            carrito={carrito}
            onEliminar={(index) => setCarrito(carrito.filter((_, i) => i !== index))}
            onActualizarCantidad={onActualizarCantidad}
            onCerrar={() => setMostrarCarrito(false)}
          />
        )}
      </div>
    </>
  );
}