import { Redis } from "@upstash/redis";

const fallback = new Map();
const devCache = {
  exists: async (key: string) => fallback.has(key),
  get: async (key: string) => fallback.get(key),
  set: async (key: string, value: any) => fallback.set(key, value),
};

const cache = import.meta.env.REDIS_TOKEN
  ? new Redis({
      url: import.meta.env.REDIS_URL,
      token: import.meta.env.REDIS_TOKEN,
    })
  : devCache;

export function cached<T extends Array<any>, R>(
  prefix: string,
  fn: (...args: T) => R
) {
  return async function (...args: T) {
    const key = prefix + args.join(",");
    const hasKey = await cache.exists(key);

    if (hasKey) {
      return cache.get(key) as R;
    }

    const result = await fn(...args);

    cache.set(key, result, { ex: 3600 });

    return result;
  };
}
