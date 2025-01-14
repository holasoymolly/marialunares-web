import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

// Define una interfaz para el tipo de producto
interface Producto {
  id: string;
  title: string;
  images: { src: string }[];
  price: number;
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

    // Filtrar y mapear los productos con los precios manuales
    const productosConPrecios: Producto[] = response.data.data.map((producto: any) => ({
      id: producto.id,
      title: producto.title,
      images: producto.images,
      price: 30.0, // Precio manual
    }));

    res.status(200).json(productosConPrecios);
  } catch (error: any) {
    console.error("Error fetching products:", error.response?.data || error.message);
    res.status(500).json({ message: "Error fetching products", error });
  }
}