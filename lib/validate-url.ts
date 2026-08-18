function isPlausibleHostname(hostname: string): boolean {
  return hostname === "localhost" || hostname.includes(".") || hostname.startsWith("[");
}

export function normalizeAndValidateUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    if (!isPlausibleHostname(parsed.hostname)) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}
