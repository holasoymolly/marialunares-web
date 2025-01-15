import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import ProductoCard from "../components/productocard";
import ModalProducto from "../components/modalproducto";
import Carrito from "../components/carrito";
import { ShoppingCartIcon as ShoppingCartIconSolid } from "@heroicons/react/solid";

interface Producto {
  id: string;
  title: string;
  images: { src: string }[];
  price: number; // Puedes usar una propiedad para definir el precio base
  tallas: string[];
  colores: string[];
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
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [taxes, setTaxes] = useState<number | null>(null);

  // Función para obtener los productos desde la API
  const fetchProductos = async () => {
    try {
      const response = await axios.get("/api/printify/products");
      const productosConDetalles = response.data.products.map((producto: Producto) => ({
        id: producto.id,
        title: producto.title,
        images: producto.images,
        price: 30, // Precio manual o ajustable
        tallas: producto.tallas,
        colores: producto.colores,
      }));
      setProductos(productosConDetalles);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para calcular costos de envío según la dirección del cliente
  const fetchShippingRates = async (country: string, state: string, zip: string) => {
    try {
      const response = await axios.post("/api/printify/shipping", { country, state, zip });
      setShippingCost(response.data.shippingRates?.[0]?.price || 0); // Seleccionar la tarifa de envío principal
    } catch (error) {
      console.error("Error al obtener tarifas de envío:", error);
    }
  };

  // Función para calcular impuestos según la dirección del cliente
  const fetchTaxes = async (country: string, state: string) => {
    try {
      const response = await axios.post("/api/printify/taxes", { country, state });
      setTaxes(response.data.taxes?.total || 0); // Total de impuestos
    } catch (error) {
      console.error("Error al calcular impuestos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const calcularTotal = () => {
    const subtotal = carrito.reduce((total, item) => total + item.producto.price * item.quantity, 0);
    return subtotal + (shippingCost || 0) + (taxes || 0);
  };

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
        <h1 className="text-6xl lg:text-9xl font-extrabold mt-20 lg:mt-60 text-center">TIENDA</h1>

        {/* Botón para abrir carrito */}
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

        {/* Mostrar productos */}
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

        {/* Modal para producto seleccionado */}
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

        {/* Carrito */}
        {mostrarCarrito && (
          <Carrito
            carrito={carrito}
            onEliminar={(index) => setCarrito(carrito.filter((_, i) => i !== index))}
            onActualizarCantidad={onActualizarCantidad}
            onCerrar={() => setMostrarCarrito(false)}
          />
        )}

        {/* Mostrar total */}
        <div className="mt-10 text-xl font-bold">
          <p>Total: ${calcularTotal().toFixed(2)}</p>
        </div>
      </div>
    </>
  );
}