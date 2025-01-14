import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await axios.get(
      "https://api.printify.com/v1/shops/19620020/products.json",
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`, // Asegúrate de que esta clave exista
        },
      }
    );

    res.status(200).json(response.data); // Devuelve los datos como JSON
  } catch (error) {
    console.error("Error al obtener productos de Printify:", error);
    res.status(500).json({ message: "Error al obtener productos desde Printify" });
  }
}