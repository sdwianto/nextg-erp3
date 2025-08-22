// src/utils/cache.ts
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number; accessCount: number }>();
  private maxSize = 1000; // Maximum number of cache entries
  private accessPattern = new Map<string, number>(); // Track access patterns for LRU

  // Public method to get cache item for prefetching
  getCacheItem(key: string) {
    return this.cache.get(key);
  }

  set(key: string, data: any, ttlSeconds: number = 300): void {
    // If cache is full, remove least recently used items
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
      accessCount: 0
    });
    this.accessPattern.set(key, Date.now());
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      this.accessPattern.delete(key);
      return null;
    }

    // Update access pattern for LRU
    item.accessCount++;
    this.accessPattern.set(key, Date.now());

    return item.data;
  }

  private evictLRU(): void {
    // Remove 20% of oldest accessed items
    const entriesToRemove = Math.floor(this.maxSize * 0.2);
    const sortedByAccess = Array.from(this.accessPattern.entries())
      .sort(([,a], [,b]) => a - b)
      .slice(0, entriesToRemove);

    sortedByAccess.forEach(([key]) => {
      this.cache.delete(key);
      this.accessPattern.delete(key);
    });
  }

  clear(): void {
    this.cache.clear();
    this.accessPattern.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Memory cleanup method
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((item, key) => {
      if (now - item.timestamp > item.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.accessPattern.delete(key);
    });
  }
}

export const memoryCache = new MemoryCache();

// Periodic cleanup to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    memoryCache.cleanup();
  }, 5 * 60 * 1000); // Cleanup every 5 minutes
}

export function withCache<T>(
  key: string, 
  fn: () => Promise<T>, 
  ttlSeconds: number = 300
): Promise<T> {
  return new Promise((resolve, reject) => {
    // Check cache first
    const cached = memoryCache.get(key);
    if (cached !== null) {
      resolve(cached);
      return;
    }

    // Execute function and cache result - OPTIMIZED with better error handling
    fn()
      .then((result) => {
        memoryCache.set(key, result, ttlSeconds);
        resolve(result);
      })
      .catch((error) => {
        // Don't cache errors, but still reject
        reject(error);
      });
  });
}

// Enhanced cache with prefetching capability
export function withPrefetchCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttlSeconds: number = 300,
  prefetchThreshold: number = 0.8 // Prefetch when 80% of TTL is reached
): Promise<T> {
  return new Promise((resolve, reject) => {
    const cached = memoryCache.get(key);
    if (cached !== null) {
      // Check if we should prefetch
      const item = memoryCache.getCacheItem(key);
      if (item && (Date.now() - item.timestamp) > (item.ttl * prefetchThreshold)) {
        // Prefetch in background
        fn().then((result) => {
          memoryCache.set(key, result, ttlSeconds);
        }).catch(() => {
          // Silently fail prefetch
        });
      }
      resolve(cached);
      return;
    }

    fn()
      .then((result) => {
        memoryCache.set(key, result, ttlSeconds);
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Cache keys
export const CACHE_KEYS = {
  PROCUREMENT_DASHBOARD: 'procurement:dashboard',
  PROCUREMENT_REQUESTS: 'procurement:requests',
  PROCUREMENT_ORDERS: 'procurement:orders',
  PROCUREMENT_SUPPLIERS: 'procurement:suppliers',
  DASHBOARD_STATS: 'dashboard:stats'
} as const;
