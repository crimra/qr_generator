import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isKvConfigured, kv } from "../lib/kv.js";
import { qrKey, type QrRecord } from "../lib/qr-store.js";
import { generateId, generateToken, hashToken } from "../lib/token.js";
import { normalizeAndValidateUrl } from "../lib/validate-url.js";
import type { ApiErrorResponse, CreateQrResponse } from "../shared/api-types.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" } satisfies ApiErrorResponse);
  }

  if (!isKvConfigured() || !kv) {
    return res.status(503).json({ error: "KV_NOT_CONFIGURED" } satisfies ApiErrorResponse);
  }

  const rawUrl = typeof req.body?.url === "string" ? req.body.url : "";
  const destinationUrl = normalizeAndValidateUrl(rawUrl);
  if (!destinationUrl) {
    return res.status(400).json({ error: "INVALID_URL" } satisfies ApiErrorResponse);
  }

  let id = generateId();
  for (let attempt = 0; attempt < 3 && (await kv.exists(qrKey(id))); attempt++) {
    id = generateId();
  }

  const token = generateToken();
  const now = Date.now();
  const record: QrRecord = {
    destinationUrl,
    tokenHash: hashToken(token),
    createdAt: now,
    updatedAt: now,
  };

  await kv.set(qrKey(id), record);

  const host = req.headers.host;
  const proto = req.headers["x-forwarded-proto"] ?? "https";
  const origin = `${proto}://${host}`;

  const response: CreateQrResponse = {
    id,
    redirectUrl: `${origin}/r/${id}`,
    editUrl: `${origin}/edit/${id}?token=${token}`,
    token,
  };

  return res.status(201).json(response);
}
