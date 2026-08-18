import type { ApiErrorResponse, CreateQrResponse, QrDetailsResponse } from "../../shared/api-types";

export type ApiResult<T> = { ok: true; data: T } | { ok: false; message: string };

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_URL: "Ce lien n'est pas une URL valide.",
  INVALID_TOKEN: "Lien de modification invalide ou expiré.",
  NOT_FOUND: "Ce QR code n'existe pas.",
  KV_NOT_CONFIGURED: "Le service n'est pas encore configuré. Réessayez plus tard.",
  METHOD_NOT_ALLOWED: "Requête invalide.",
};

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<ApiResult<T>> {
  let response: Response;
  try {
    response = await fetch(input, init);
  } catch {
    return { ok: false, message: "Impossible de contacter le serveur." };
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return { ok: false, message: "Réponse invalide du serveur." };
  }

  if (!response.ok) {
    const errorCode = (body as ApiErrorResponse)?.error;
    return { ok: false, message: ERROR_MESSAGES[errorCode] ?? "Une erreur est survenue." };
  }

  return { ok: true, data: body as T };
}

export function createDynamicQr(url: string): Promise<ApiResult<CreateQrResponse>> {
  return request<CreateQrResponse>("/api/create", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url }),
  });
}

export function fetchQrDetails(id: string, token: string): Promise<ApiResult<QrDetailsResponse>> {
  return request<QrDetailsResponse>(`/api/qr/${id}?token=${encodeURIComponent(token)}`);
}

export function updateQrDestination(id: string, token: string, url: string): Promise<ApiResult<QrDetailsResponse>> {
  return request<QrDetailsResponse>(`/api/qr/${id}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ token, url }),
  });
}
