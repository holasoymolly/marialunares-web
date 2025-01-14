import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

// Define la interfaz para los productos
interface Producto {
  id: string;
  title: string;
  images: { src: string }[];
  variants: { price: number }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("API Key:", process.env.PRINTIFY_API_KEY); // Verifica si la API Key se está leyendo

    const response = await axios.get(
      "https://api.printify.com/v1/shops/19620020/products.json",
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
        },
      }
    );

    // Mapeamos los datos al formato esperado
    const productos: Producto[] = response.data.data.map((producto: any) => ({
      id: producto.id,
      title: producto.title,
      images: producto.images.map((image: any) => ({ src: image.src })),
      variants: producto.variants.map((variant: any) => ({
        price: variant.price,
      })),
    }));

    res.status(200).json(productos); // Devuelve los productos procesados
  } catch (error: any) {
    console.error("Error fetching products:", error.response?.data || error.message);
    res.status(500).json({ message: "Error fetching products", error });
  }
}