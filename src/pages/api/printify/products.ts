import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.PRINTIFY_API_KEY) {
    console.error("La clave de acceso completo (PRINTIFY_API_KEY) no está configurada.");
    return res
      .status(500)
      .json({ message: "Error en la configuración del servidor: falta PRINTIFY_API_KEY." });
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

    if (!response.data) {
      console.error("La respuesta de Printify no contiene datos.");
      return res
        .status(500)
        .json({ message: "Error: No se encontraron datos en la respuesta de Printify." });
    }

    res.status(200).json(response.data);
  } catch (error: unknown) {
    console.error("Error al obtener productos de Printify:", (error as Error).message);

    res.status(500).json({
      message: "Error al obtener productos desde Printify.",
    });
  }
}