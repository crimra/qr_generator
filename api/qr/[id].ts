import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isKvConfigured, kv } from "../../lib/kv.js";
import { qrKey, type QrRecord } from "../../lib/qr-store.js";
import { verifyToken } from "../../lib/token.js";
import { normalizeAndValidateUrl } from "../../lib/validate-url.js";
import type { ApiErrorResponse, QrDetailsResponse } from "../../shared/api-types.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "PUT") {
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" } satisfies ApiErrorResponse);
  }

  if (!isKvConfigured() || !kv) {
    return res.status(503).json({ error: "KV_NOT_CONFIGURED" } satisfies ApiErrorResponse);
  }

  const id = typeof req.query.id === "string" ? req.query.id : "";
  if (!id) {
    return res.status(404).json({ error: "NOT_FOUND" } satisfies ApiErrorResponse);
  }

  const record = await kv.get<QrRecord>(qrKey(id));
  if (!record) {
    return res.status(404).json({ error: "NOT_FOUND" } satisfies ApiErrorResponse);
  }

  if (req.method === "GET") {
    const token = typeof req.query.token === "string" ? req.query.token : undefined;
    if (!verifyToken(token, record.tokenHash)) {
      return res.status(401).json({ error: "INVALID_TOKEN" } satisfies ApiErrorResponse);
    }
    const response: QrDetailsResponse = {
      id,
      destinationUrl: record.destinationUrl,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
    return res.status(200).json(response);
  }

  // PUT
  const token = typeof req.body?.token === "string" ? req.body.token : undefined;
  if (!verifyToken(token, record.tokenHash)) {
    return res.status(401).json({ error: "INVALID_TOKEN" } satisfies ApiErrorResponse);
  }

  const rawUrl = typeof req.body?.url === "string" ? req.body.url : "";
  const destinationUrl = normalizeAndValidateUrl(rawUrl);
  if (!destinationUrl) {
    return res.status(400).json({ error: "INVALID_URL" } satisfies ApiErrorResponse);
  }

  const updated: QrRecord = {
    ...record,
    destinationUrl,
    updatedAt: Date.now(),
  };
  await kv.set(qrKey(id), updated);

  const response: QrDetailsResponse = {
    id,
    destinationUrl: updated.destinationUrl,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
  return res.status(200).json(response);
}
