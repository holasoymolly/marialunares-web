import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { country, state } = req.body;

  if (!process.env.PRINTIFY_API_KEY) {
    return res.status(500).json({ message: "Falta PRINTIFY_API_KEY en la configuración del servidor." });
  }

  try {
    const response = await axios.post(
      "https://api.printify.com/v1/shops/19620020/taxes.json",
      { country, state },
      { headers: { Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}` } }
    );

    if (!response.data) {
      return res.status(500).json({ message: "No se encontraron datos de impuestos." });
    }

    res.status(200).json({ taxes: response.data });
  } catch (error) {
    console.error("Error al obtener impuestos desde Printify:", error);
    res.status(500).json({ message: "Error al calcular impuestos." });
  }
}