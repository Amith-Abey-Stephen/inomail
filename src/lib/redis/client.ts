import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
let realRedis: any;

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
  on: (event: string, callback: any) => {
    console.log(`[Redis Mock] ON ${event}`);
  },
  status: "mock",
};

// Initialize Redis only if not in build phase or if explicitly allowed
const isBuild = process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'production' && !process.env.REDIS_URL;

if (!isBuild) {
  const url = new URL(redisUrl);
  realRedis = new Redis({
    host: url.hostname,
    port: url.port ? parseInt(url.port) : 6379,
    username: url.username || undefined,
    password: url.password || undefined,
    maxRetriesPerRequest: 1, 
    lazyConnect: true,
    enableOfflineQueue: false,
    connectTimeout: 1000,
  });

  realRedis.on("error", (err: any) => {
    // console.error("Redis Error:", err.message);
  });
}

export const redis: any = new Proxy(realRedis || mockRedis, {
  get(target, prop) {
    // If Redis is not initialized or not ready, use mock for data operations
    if (!realRedis || realRedis.status !== "ready") {
      if (prop === "get" || prop === "set" || prop === "del") {
        return (mockRedis as any)[prop];
      }
      if (prop === "on") return mockRedis.on;
      if (prop === "status") return realRedis ? realRedis.status : "mock";
    }
    return (target as any)[prop];
  }
});
