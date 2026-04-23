import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const url = new URL(redisUrl);

// Real Redis instance
const realRedis = new Redis({
  host: url.hostname,
  port: url.port ? parseInt(url.port) : 6379,
  username: url.username || undefined,
  password: url.password || undefined,
  maxRetriesPerRequest: 1, 
  lazyConnect: true,
  enableOfflineQueue: false,
  connectTimeout: 1000,
});

// Persist memory store across hot reloads in development
if (!(global as any).otpMemoryStore) {
  (global as any).otpMemoryStore = new Map<string, string>();
}
const memoryStore: Map<string, string> = (global as any).otpMemoryStore;

const mockRedis = {
  get: async (key: string) => {
    const val = memoryStore.get(key) || null;
    console.log(`[Redis Mock] GET ${key} -> ${val}`);
    return val;
  },
  set: async (key: string, value: string, mode?: string, duration?: number) => {
    console.log(`[Redis Mock] SET ${key} = ${value} (${mode} ${duration})`);
    memoryStore.set(key, value);
    if (mode === "EX" && duration) {
      setTimeout(() => {
        memoryStore.delete(key);
        console.log(`[Redis Mock] EXPIRED ${key}`);
      }, duration * 1000);
    }
    return "OK";
  },
  del: async (key: string) => {
    console.log(`[Redis Mock] DEL ${key}`);
    memoryStore.delete(key);
    return 1;
  },
  on: (event: string, callback: any) => realRedis.on(event, callback),
  status: "mock",
};

export const redis: any = new Proxy(realRedis, {
  get(target, prop) {
    if (target.status !== "ready") {
      if (prop === "get" || prop === "set" || prop === "del") {
        return (mockRedis as any)[prop];
      }
    }
    return (target as any)[prop];
  }
});

realRedis.on("error", (err) => {
  // Suppress repeated logs
});
