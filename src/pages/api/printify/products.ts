import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

// Define las interfaces para productos y errores
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
    console.log("API Key:", process.env.PRINTIFY_API_KEY);

    const response = await axios.get<{ data: Product[] }>(
      "https://api.printify.com/v1/shops/19620020/products.json",
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
        },
      }
    );

    const productosPrincipales = response.data.data.map((producto: Product) => ({
      id: producto.id,
      title: producto.title,
      images: producto.images,
      price: 30.0,
    }));

    res.status(200).json(productosPrincipales);
  } catch (error) {
    console.error(
      "Error al obtener productos:",
      (error as any)?.response?.data || (error as Error)?.message
    );
    res.status(500).json({
      message: "Error al obtener productos desde Printify",
      error: (error as any)?.response?.data || (error as Error)?.message,
    });
  }
}