import { randomBytes, createHash, timingSafeEqual } from "node:crypto";
import { nanoid } from "nanoid";

export const generateId = () => nanoid(10);
export const generateToken = () => randomBytes(24).toString("base64url");
export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export function verifyToken(token: string | undefined, storedHash: string): boolean {
  if (!token) return false;
  const candidate = Buffer.from(hashToken(token), "hex");
  const stored = Buffer.from(storedHash, "hex");
  return candidate.length === stored.length && timingSafeEqual(candidate, stored);
}
