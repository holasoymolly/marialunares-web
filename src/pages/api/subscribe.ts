import type { NextApiRequest, NextApiResponse } from "next";

// Alta en la newsletter contra Kit (antes ConvertKit), API v4.
//
// La API key vive SOLO aquí (server-side): nunca se expone al cliente ni
// llega al bundle. El navegador solo habla con /api/subscribe.
//
// Variables de entorno necesarias (Vercel + .env.local):
//   KIT_API_KEY   API key v4 de Kit
//   KIT_FORM_ID   ID del formulario de Kit al que se suscribe la gente

const KIT_ENDPOINT = "https://api.kit.com/v4/forms";
const TIMEOUT_MS = 10_000;

type SubscribeResponse = { ok: true } | { error: string };

// Validación deliberadamente simple: la confirmación real la hace el doble
// opt-in de Kit, aquí solo se filtran errores de tecleo evidentes.
function isValidEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubscribeResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body;
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "invalid_email" });
  }

  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;

  if (!apiKey || !formId) {
    console.error("[subscribe] Faltan KIT_API_KEY o KIT_FORM_ID en el entorno.");
    return res.status(500).json({ error: "not_configured" });
  }

  try {
    const kitRes = await fetch(`${KIT_ENDPOINT}/${formId}/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Kit-Api-Key": apiKey,
      },
      body: JSON.stringify({ email_address: email }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (kitRes.ok) {
      return res.status(200).json({ ok: true });
    }

    const detail = await kitRes.text();

    // Kit devuelve 422 cuando el correo ya está en la lista. Para quien se
    // suscribe eso no es un error: ya está dentro.
    if (kitRes.status === 422 && /already|exists|taken|subscribed/i.test(detail)) {
      return res.status(200).json({ ok: true });
    }

    if (kitRes.status === 401 || kitRes.status === 403) {
      console.error(
        "[subscribe] Kit rechazó las credenciales. Revisa KIT_API_KEY, o usa la API legacy " +
          "de ConvertKit v3 (POST https://api.convertkit.com/v3/forms/{form_id}/subscribe con " +
          `api_key) si la cuenta aún no está en v4. Respuesta: ${detail}`
      );
      return res.status(502).json({ error: "kit_error" });
    }

    console.error(`[subscribe] Kit respondió ${kitRes.status}: ${detail}`);
    return res.status(502).json({ error: "kit_error" });
  } catch (error) {
    console.error("[subscribe] No se pudo contactar con Kit:", error);
    return res.status(502).json({ error: "network_error" });
  }
}

function safeParse(raw: string): { email?: unknown } | null {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
