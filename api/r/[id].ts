import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isKvConfigured, kv } from "../../lib/kv.js";
import { qrKey, type QrRecord } from "../../lib/qr-store.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }

  if (!isKvConfigured() || !kv) {
    return res.status(503).send("Service indisponible.");
  }

  const id = typeof req.query.id === "string" ? req.query.id : "";
  const record = id ? await kv.get<QrRecord>(qrKey(id)) : null;

  if (!record) {
    return res.status(404).send("QR code introuvable ou expiré.");
  }

  res.writeHead(302, { Location: record.destinationUrl });
  return res.end();
}
