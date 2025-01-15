import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { country, state, zip } = req.body;

  if (!process.env.PRINTIFY_API_KEY) {
    return res.status(500).json({ message: "Falta PRINTIFY_API_KEY en la configuración del servidor." });
  }

  try {
    const response = await axios.post(
      "https://api.printify.com/v1/shops/19620020/shipping.json",
      { address: { country, state, zip } },
      { headers: { Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}` } }
    );

    if (!response.data) {
      return res.status(500).json({ message: "No se encontraron tarifas de envío." });
    }

    res.status(200).json({ shippingRates: response.data });
  } catch (error) {
    console.error("Error al obtener tarifas de envío desde Printify:", error);
    res.status(500).json({ message: "Error al calcular tarifas de envío." });
  }
}