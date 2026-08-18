import { Redis } from "@upstash/redis";

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export function isKvConfigured(): boolean {
  return Boolean(url && token);
}

export const kv = url && token ? new Redis({ url, token }) : null;
