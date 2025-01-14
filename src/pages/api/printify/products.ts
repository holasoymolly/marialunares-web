import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

// Define las interfaces para los productos y variantes
interface Variant {
  id: string;
  price: number;
}

interface Product {
  id: string;
  title: string;
  images: { src: string }[];
  variants: Variant[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("API Key:", process.env.PRINTIFY_API_KEY); // Verifica si la API Key se está leyendo

    // Especificamos el tipo de respuesta esperado de la API
    const response = await axios.get<{ data: Product[] }>(
      "https://api.printify.com/v1/shops/19620020/products.json",
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
        },
      }
    );

    // Aquí puedes mapear los productos con precios manuales si es necesario
    const productosPrincipales = response.data.data.map((producto: Product) => ({
      id: producto.id,
      title: producto.title,
      images: producto.images,
      price: 30.0, // Asignar manualmente el precio retail
    }));

    res.status(200).json(productosPrincipales); // Devuelve los datos como JSON
  } catch (error) {
    console.error(
      "Error al obtener productos de Printify:",
      (error as any).response?.data || (error as Error).message
    );
    res.status(500).json({
      message: "Error al obtener productos desde Printify",
      error: (error as any).response?.data || (error as Error).message,
    });
  }
}