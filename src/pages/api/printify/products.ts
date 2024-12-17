import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await axios.get("https://api.printify.com/v1/shops/19620020/products.json", {
      headers: {
        Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
}