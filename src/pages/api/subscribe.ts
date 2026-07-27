import type { NextApiRequest, NextApiResponse } from "next";

// Alta en la newsletter contra Kit (antes ConvertKit), API v4.
//
// La API key vive SOLO aquí (server-side): nunca se expone al cliente ni
// llega al bundle. El navegador solo habla con /api/subscribe.
//
// Variables de entorno necesarias (Vercel + .env.local):
//   KIT_API_KEY   API key v4 de Kit
//   KIT_FORM_ID   ID del formulario de Kit al que se suscribe la gente
//                 (listables con GET https://api.kit.com/v4/forms)

const KIT_API = "https://api.kit.com/v4";
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

  const post = (path: string) =>
    fetch(`${KIT_API}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Kit-Api-Key": apiKey,
      },
      body: JSON.stringify({ email_address: email }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

  try {
    // Paso 1: dar de alta el suscriptor en la cuenta.
    // Kit v4 lo exige antes del paso 2: añadir al formulario un correo que
    // todavía no existe responde 404, no 422.
    const created = await post("/subscribers");
    if (!created.ok) {
      const detail = await created.text();
      // 422 = el correo ya estaba en la cuenta. No es un error: seguimos.
      const alreadyExists =
        created.status === 422 && /already|exists|taken|subscribed/i.test(detail);
      if (!alreadyExists) {
        return fail(res, created.status, detail, "creando el suscriptor");
      }
    }

    // Paso 2: asociarlo al formulario, que es lo que dispara la secuencia
    // de bienvenida y la confirmación configuradas en Kit.
    const added = await post(`/forms/${formId}/subscribers`);
    if (added.ok) {
      return res.status(200).json({ ok: true });
    }

    const detail = await added.text();
    if (added.status === 422 && /already|exists|taken|subscribed/i.test(detail)) {
      return res.status(200).json({ ok: true });
    }

    return fail(res, added.status, detail, `añadiendo al formulario ${formId}`);
  } catch (error) {
    console.error("[subscribe] No se pudo contactar con Kit:", error);
    return res.status(502).json({ error: "network_error" });
  }
}

// Registra el detalle real en el servidor y devuelve un error genérico al
// cliente: los mensajes de Kit no deben llegar al navegador.
function fail(
  res: NextApiResponse<SubscribeResponse>,
  status: number,
  detail: string,
  step: string
) {
  if (status === 401 || status === 403) {
    console.error(
      `[subscribe] Kit rechazó las credenciales ${step}. Revisa KIT_API_KEY, o usa la API ` +
        "legacy de ConvertKit v3 (POST https://api.convertkit.com/v3/forms/{form_id}/subscribe " +
        `con api_key) si la cuenta aún no está en v4. Respuesta: ${detail}`
    );
  } else if (status === 404) {
    console.error(
      `[subscribe] Kit devolvió 404 ${step}. Comprueba que KIT_FORM_ID existe en la cuenta ` +
        `(GET https://api.kit.com/v4/forms). Respuesta: ${detail}`
    );
  } else {
    console.error(`[subscribe] Kit respondió ${status} ${step}: ${detail}`);
  }

  return res.status(502).json({ error: "kit_error" });
}

function safeParse(raw: string): { email?: unknown } | null {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
