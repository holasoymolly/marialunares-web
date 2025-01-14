import { NextApiRequest, NextApiResponse } from "next";

const PRINTIFY_API_KEY = "ML_SHOP_FULL_ACCESS";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { carrito, informacionEnvio }: { 
    carrito: Array<{ 
      producto: { id: string }; 
      quantity: number 
    }>; 
    informacionEnvio: { 
      nombre: string; 
      direccion: string; 
      ciudad: string; 
      codigoPostal: string; 
      telefono: string 
    } 
  } = req.body;

  try {
    const lineItems = carrito.map((item) => ({
      product_id: item.producto.id,
      quantity: item.quantity,
      blueprint_id: 123, // Reemplaza con tu blueprint_id
      variant_id: 456, // Reemplaza con tu variant_id
    }));

    const printifyPedido = {
      label: "Pedido desde tu tienda",
      line_items: lineItems,
      shipping_address: {
        first_name: informacionEnvio.nombre.split(" ")[0],
        last_name: informacionEnvio.nombre.split(" ").slice(1).join(" "),
        address1: informacionEnvio.direccion,
        city: informacionEnvio.ciudad,
        zip: informacionEnvio.codigoPostal,
        phone: informacionEnvio.telefono,
        country: "DO",
      },
    };

    const response = await fetch("https://api.printify.com/v1/orders.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PRINTIFY_API_KEY}`,
      },
      body: JSON.stringify(printifyPedido),
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).json({ message: "Pedido enviado a Printify", data });
    } else {
      console.error("Error al crear el pedido en Printify:", data);
      res.status(500).json({ message: "Error al enviar el pedido a Printify", error: data });
    }
  } catch (error) {
    console.error("Error al procesar el pedido:", error);
    res.status(500).json({ message: "Hubo un error al procesar el pedido." });
  }
}