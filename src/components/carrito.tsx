import { useState } from "react";
import FormularioEnvio from "../components/formularioenvio";
import ResumenPedido from "../components/resumenpedido";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/outline";

interface Pedido {
  producto: { title: string; price: number; images: { src: string }[] };
  size: string;
  color: string;
  quantity: number;
}

interface CarritoProps {
  carrito: Pedido[];
  onEliminar: (index: number) => void;
  onActualizarCantidad: (index: number, cantidad: number) => void;
  onCerrar: () => void;
}

export default function Carrito({
  carrito,
  onEliminar,
  onActualizarCantidad,
  onCerrar,
}: CarritoProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [formularioEnvio, setFormularioEnvio] = useState({
    nombre: "",
    apellido: "",
    direccion1: "",
    direccion2: "",
    codigoPostal: "",
    ciudadEstado: "",
    pais: "",
    telefono: "",
    email: "",
  });

  const calcularTotal = () =>
    carrito.reduce((total, item) => total + item.producto.price * item.quantity, 0);

  const validarFormulario = () => {
    return Object.values(formularioEnvio).every((campo) => campo.trim() !== "");
  };

  const procederCompra = () => {
    if (validarFormulario()) {
      setMostrarFormulario(false);
      setMostrarResumen(true); // Abre el resumen del pedido
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  return (
    <div className="fixed top-0 right-0 w-1/3 h-full bg-white text-black z-50 shadow-lg p-4 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Carrito</h2>
      <button className="absolute top-2 right-4 text-2xl font-bold text-black" onClick={onCerrar}>
        ×
      </button>
      {carrito.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        carrito.map((item, index) => (
          <div key={index} className="mb-4 flex items-start">
            <Image
              src={item.producto.images[0]?.src || "/images/placeholder.jpg"}
              alt={item.producto.title}
              width={64}
              height={64}
              className="object-cover rounded-lg mr-4"
            />
            <div className="flex-grow">
              <h3 className="text-xl font-bold">{item.producto.title}</h3>
              <p>Tamaño: {item.size}</p>
              <p>Color: {item.color}</p>
              <div className="flex items-center space-x-2">
                <label htmlFor={`cantidad-${index}`} className="text-sm">
                  Cantidad:
                </label>
                <select
                  id={`cantidad-${index}`}
                  value={item.quantity}
                  onChange={(e) =>
                    onActualizarCantidad(index, parseInt(e.target.value, 10))
                  }
                  className="p-1 border rounded"
                >
                  {[...Array(10).keys()].map((num) => (
                    <option key={num} value={num + 1}>
                      {num + 1}
                    </option>
                  ))}
                </select>
              </div>
              <p>Precio: ${(item.producto.price * item.quantity).toFixed(2)}</p>
            </div>
            <button
              className="text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => onEliminar(index)}
            >
              <TrashIcon className="h-6 w-6" />
            </button>
          </div>
        ))
      )}
      <div className="mt-4">
        <h3 className="text-xl font-bold">Total: ${calcularTotal().toFixed(2)}</h3>
        <button
          className="px-8 py-2 bg-black text-white font-bold rounded-full mt-4"
          onClick={() => setMostrarFormulario(true)}
        >
          Proceder
        </button>
      </div>
      {mostrarFormulario && (
        <FormularioEnvio
          formulario={formularioEnvio}
          setFormulario={setFormularioEnvio}
          onConfirmar={procederCompra}
          onCancelar={() => setMostrarFormulario(false)}
        />
      )}
      {mostrarResumen && (
        <ResumenPedido
          carrito={carrito}
          informacionEnvio={formularioEnvio}
          onCancelar={() => setMostrarResumen(false)}
        />
      )}
    </div>
  );
}