import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verifica si la variable de entorno está configurada
  if (!process.env.ML_SHOP_FULL_ACCESS) {
    console.error("La clave de acceso completo (ML_SHOP_FULL_ACCESS) no está configurada.");
    return res
      .status(500)
      .json({ message: "Error en la configuración del servidor: falta ML_SHOP_FULL_ACCESS." });
  }

  try {
    const response = await axios.get(
      "https://api.printify.com/v1/shops/19620020/products.json",
      {
        headers: {
          Authorization: `Bearer ${process.env.ML_SHOP_FULL_ACCESS}`, // Clave de acceso
        },
      }
    );

    // Valida que la respuesta tenga datos
    if (!response.data) {
      console.error("La respuesta de Printify no contiene datos.");
      return res.status(500).json({ message: "Error: No se encontraron datos en la respuesta de Printify." });
    }

    res.status(200).json(response.data); // Devuelve los datos como JSON
  } catch (error: any) {
    // Manejo detallado de errores
    console.error("Error al obtener productos de Printify:", error.message || error);

    res.status(500).json({
      message: "Error al obtener productos desde Printify.",
      details: error.response?.data || "Error desconocido.",
    });
  }
}