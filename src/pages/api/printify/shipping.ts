import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { country, state, zip } = req.body; // Datos de envío

  if (!process.env.PRINTIFY_API_KEY) {
    console.error("Falta PRINTIFY_API_KEY en la configuración del servidor.");
    return res.status(500).json({
      message: "Error en la configuración del servidor: falta PRINTIFY_API_KEY.",
    });
  }

  try {
    const response = await axios.post(
      "https://api.printify.com/v1/shops/19620020/shipping.json",
      {
        address: {
          country,
          state,
          zip,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
        },
      }
    );

    if (!response.data) {
      console.error("No se encontraron tarifas de envío en la respuesta.");
      return res.status(500).json({ message: "No se encontraron tarifas de envío." });
    }

    res.status(200).json({ shippingRates: response.data });
  } catch (error) {
    console.error("Error al calcular tarifas de envío:", error);
    res.status(500).json({
      message: "Error al calcular tarifas de envío.",
      error: (error as Error).message, // Captura el mensaje detallado del error.
    });
  }
}