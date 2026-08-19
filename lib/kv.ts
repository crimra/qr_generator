import { createClient } from "redis";

const redisUrl = process.env.KV_REDIS_URL ?? process.env.KV_URL ?? process.env.REDIS_URL;

export function isKvConfigured(): boolean {
  return Boolean(redisUrl);
}

async function connectClient() {
  const client = createClient({ url: redisUrl! });
  client.on("error", (err) => console.error("Redis client error", err));
  await client.connect();
  return client;
}

let clientPromise: ReturnType<typeof connectClient> | null = null;

async function getClient() {
  if (!redisUrl) throw new Error("Redis is not configured");
  if (!clientPromise) {
    clientPromise = connectClient();
  }
  const client = await clientPromise;
  if (!client.isOpen) await client.connect();
  return client;
}

export const kv = isKvConfigured()
  ? {
      async get<T>(key: string): Promise<T | null> {
        const client = await getClient();
        const raw = (await client.get(key)) as string | null;
        return raw ? (JSON.parse(raw) as T) : null;
      },
      async set(key: string, value: unknown): Promise<void> {
        const client = await getClient();
        await client.set(key, JSON.stringify(value));
      },
      async exists(key: string): Promise<boolean> {
        const client = await getClient();
        return (await client.exists(key)) === 1;
      },
      async incr(key: string): Promise<number> {
        const client = await getClient();
        return client.incr(key);
      },
    }
  : null;
