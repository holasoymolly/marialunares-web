import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

// Define la interfaz para los productos obtenidos de Printify
interface PrintifyProduct {
  id: string;
  title: string;
  images: { src: string }[];
  price: number; // Añade cualquier propiedad necesaria específica aquí
}

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

    // Mapea los productos con precios manuales si es necesario
    const productosPrincipales: PrintifyProduct[] = response.data.data.map((producto: any) => ({
      id: producto.id,
      title: producto.title,
      images: producto.images,
      price: 30.0, // Asignar manualmente el precio retail aquí
    }));

    res.status(200).json(productosPrincipales); // Devuelve los datos como JSON
  } catch (error: any) {
    console.error("Error al obtener productos de Printify:", error.response?.data || error.message);
    res.status(500).json({
      message: "Error al obtener productos desde Printify",
      error: error.response?.data || error.message,
    });
  }
}