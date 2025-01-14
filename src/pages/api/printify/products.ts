import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

interface Producto {
  id: string;
  title: string;
  images: { src: string }[];
  price: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await axios.get<{ data: Producto[] }>(
      "https://api.printify.com/v1/shops/19620020/products.json",
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener productos", error });
  }
}