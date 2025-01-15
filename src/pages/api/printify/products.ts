import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.PRINTIFY_API_KEY) {
    console.error("La clave de acceso completo (PRINTIFY_API_KEY) no está configurada.");
    return res.status(500).json({ message: "Error: falta PRINTIFY_API_KEY." });
  }

  try {
    const response = await axios.get(
      "https://api.printify.com/v1/shops/19620020/products.json",
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
        },
      }
    );

    if (!response.data?.data) {
      console.error("No se encontraron productos.");
      return res.status(500).json({ message: "No se encontraron productos." });
    }

    const products = response.data.data.map((producto: any) => ({
      id: producto.id,
      title: producto.title,
      images: producto.images.map((image: any) => ({ src: image.src })),
      tallas:
        producto.options?.find((option: any) => option.name.toLowerCase() === "size")
          ?.values || [],
      colores:
        producto.options?.find((option: any) => option.name.toLowerCase() === "color")
          ?.values || [],
    }));

    res.status(200).json({ products });
  } catch (error: unknown) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener productos." });
  }
}