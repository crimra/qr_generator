export interface CreateQrResponse {
  id: string;
  redirectUrl: string;
  editUrl: string;
  token: string;
}

export interface QrDetailsResponse {
  id: string;
  destinationUrl: string;
  createdAt: number;
  updatedAt: number;
}

export type ApiErrorCode =
  | "INVALID_URL"
  | "INVALID_TOKEN"
  | "NOT_FOUND"
  | "KV_NOT_CONFIGURED"
  | "METHOD_NOT_ALLOWED";

export interface ApiErrorResponse {
  error: ApiErrorCode;
  message?: string;
}
