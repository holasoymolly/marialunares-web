import { NextApiRequest, NextApiResponse } from "next";

const PRINTIFY_API_KEY = "TU_API_KEY_DE_PRINTIFY";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { carrito, informacionEnvio } = req.body;

  try {
    // Mapeamos los datos del carrito al formato requerido por Printify
    const lineItems = carrito.map((item: any) => ({
      product_id: item.producto.id, // ID del producto en Printify
      quantity: item.quantity,
      blueprint_id: 123, // Debes obtener el blueprint_id específico para tu producto
      variant_id: 456, // Variante específica según talla/color
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
        country: "DO", // Código de país (República Dominicana)
      },
    };

    // Hacemos la solicitud a Printify
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