function isPlausibleHostname(hostname: string): boolean {
  return hostname === "localhost" || hostname.includes(".") || hostname.startsWith("[");
}

export function isValidDestinationUrl(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed) return false;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
    return isPlausibleHostname(parsed.hostname);
  } catch {
    return false;
  }
}
