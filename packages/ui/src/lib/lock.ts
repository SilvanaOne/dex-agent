import { Redis } from "ioredis";
import { nanoid } from "nanoid";

const RATE_LIMIT_KV_URL = process.env.RATE_LIMIT_KV_URL;
if (!RATE_LIMIT_KV_URL) {
  throw new Error("RATE_LIMIT_KV_URL not set");
}

const redis = new Redis(RATE_LIMIT_KV_URL, {
  enableOfflineQueue: true,
  reconnectOnError: function (err) {
    console.error("Redis reconnectOnError:", { err });
    return true;
  },
  retryStrategy: function (times) {
    const delay = Math.min(times * 50, 2000);
    console.log(`Redis retry attempt ${times} after ${delay}ms`);
    return delay;
  },
});

export async function acquireLock(key: string, ttl = 30000): Promise<string> {
  const lockValue = nanoid();
  const result = await redis.call(
    "SET",
    key,
    lockValue,
    "NX",
    "PX",
    ttl.toString()
  );
  if (result === "OK") {
    return lockValue;
  }
  throw new Error("Could not acquire lock");
}

export async function releaseLock(key: string, lockValue: string) {
  const releaseScript = `
    if redis.call("GET", KEYS[1]) == ARGV[1] then
      return redis.call("DEL", KEYS[1])
    else
      return 0
    end
  `;
  await redis.eval(releaseScript, 1, key, lockValue);
}
