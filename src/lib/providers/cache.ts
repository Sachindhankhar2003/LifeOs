export interface CachedResource<T> {
  data: T;
  timestamp: number;
  source: string;
}

const memoryCache = new Map<string, CachedResource<any>>();
const DEFAULT_TTL = 1000 * 60 * 60; // 1 hour

export function getCached<T>(key: string, ttl: number = DEFAULT_TTL): CachedResource<T> | null {
  const cached = memoryCache.get(key);
  if (!cached) return null;

  if (Date.now() - cached.timestamp > ttl) {
    memoryCache.delete(key);
    return null; // Expired
  }

  return cached as CachedResource<T>;
}

export function setCached<T>(key: string, data: T, source: string): void {
  memoryCache.set(key, {
    data,
    timestamp: Date.now(),
    source,
  });
}

// For testing purposes
export function clearCache(): void {
  memoryCache.clear();
}

