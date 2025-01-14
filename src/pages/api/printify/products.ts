import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

// Define los precios manualmente
const preciosManuales: Record<string, number> = {
  "Alien Tee": 30,
  "Melting Logo Tee": 30,
  "Raíces Tee": 30,
  "Sol Tee": 30,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await axios.get(
      "https://api.printify.com/v1/shops/19620020/products.json",
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
        },
      }
    );

    // Filtrar y mapear los productos con los precios manuales
    const productosConPrecios = response.data.data.map((producto: any) => ({
      id: producto.id,
      title: producto.title,
      images: producto.images,
      price: preciosManuales[producto.title] || 0, // Asigna el precio manual o 0 si no existe
    }));

    res.status(200).json(productosConPrecios);
  } catch (error: any) {
    console.error("Error fetching products:", error.response?.data || error.message);
    res.status(500).json({ message: "Error fetching products", error });
  }
}