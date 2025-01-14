import { PayPalButtons } from "@paypal/react-paypal-js";
import Image from "next/image";

interface ResumenPedidoProps {
  carrito: {
    producto: { title: string; price: number; images: { src: string }[] };
    size: string;
    color: string;
    quantity: number;
  }[];
  informacionEnvio: {
    nombre: string;
    direccion: string;
    ciudad: string;
    codigoPostal: string;
    telefono: string;
  };
  onCancelar: () => void;
}

export default function ResumenPedido({
  carrito,
  informacionEnvio,
  onCancelar,
}: ResumenPedidoProps) {
  const calcularTotal = () =>
    carrito.reduce((total, item) => total + item.producto.price * item.quantity, 0);

  const enviarPedidoPrintify = async () => {
    const response = await fetch("/api/crear-pedido-printify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ carrito, informacionEnvio }),
    });

    if (response.ok) {
      alert("Pedido enviado a Printify con éxito.");
    } else {
      alert("Hubo un error al enviar el pedido a Printify.");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Resumen del Pedido</h2>

        <h3 className="text-lg font-semibold mb-2">Productos:</h3>
        <ul className="mb-4 space-y-4">
          {carrito.map((item, index) => (
            <li key={index} className="flex items-center space-x-4">
              <Image
                src={item.producto.images[0]?.src || "/images/placeholder.jpg"}
                alt={item.producto.title}
                width={50}
                height={50}
                className="object-cover rounded-lg"
              />
              <div>
                <h4 className="font-bold">{item.producto.title}</h4>
                <p>
                  {item.quantity}x ({item.size}, {item.color}) - $
                  {(item.producto.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-semibold mb-2">Información de Envío:</h3>
        <p>Nombre: {informacionEnvio.nombre}</p>
        <p>Dirección: {informacionEnvio.direccion}</p>
        <p>Ciudad: {informacionEnvio.ciudad}</p>
        <p>Código Postal: {informacionEnvio.codigoPostal}</p>
        <p>Teléfono: {informacionEnvio.telefono}</p>

        <div className="mt-4">
          <h3 className="text-xl font-bold">Total: ${calcularTotal().toFixed(2)}</h3>
        </div>

        <div className="flex justify-end space-x-4 mt-4">
          <button
            className="px-4 py-2 bg-gray-300 text-black font-bold rounded-full"
            onClick={onCancelar}
          >
            Volver
          </button>
          <PayPalButtons
            createOrder={(data, actions) => {
              return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                  {
                    amount: {
                      currency_code: "USD",
                      value: calcularTotal().toFixed(2),
                    },
                  },
                ],
              });
            }}
            onApprove={(data, actions) => {
              if (actions?.order) {
                return actions.order.capture().then(() => {
                  enviarPedidoPrintify();
                });
              } else {
                console.error("Error: 'actions.order' es undefined");
                alert("Hubo un problema al procesar tu pago.");
                return Promise.reject();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}