interface CacheItem<T> {
  value: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheOptions {
  maxSize: number;
  ttl: number; // Time to live in milliseconds
  cleanupInterval: number; // Cleanup interval in milliseconds
}

class AdvancedCache<T> {
  private cache = new Map<string, CacheItem<T>>();
  private options: CacheOptions;
  private cleanupTimer?: ReturnType<typeof setTimeout>;

  constructor(options: Partial<CacheOptions> = {}) {
    this.options = {
      maxSize: 100,
      ttl: 5 * 60 * 1000, // 5 minutes
      cleanupInterval: 60 * 1000, // 1 minute
      ...options
    };

    this.startCleanup();
  }

  set(key: string, value: T): void {
    const now = Date.now();
    
    // Remove oldest items if cache is full
    if (this.cache.size >= this.options.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      value,
      timestamp: now,
      accessCount: 1,
      lastAccessed: now
    });
  }

  get(key: string): T | undefined {
    const item = this.cache.get(key);
    if (!item) return undefined;

    const now = Date.now();
    
    // Check if item has expired
    if (now - item.timestamp > this.options.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    // Update access statistics
    item.accessCount++;
    item.lastAccessed = now;

    return item.value;
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    averageAccessCount: number;
  } {
    const items = Array.from(this.cache.values());
    const totalAccessCount = items.reduce((sum, item) => sum + item.accessCount, 0);
    
    return {
      size: this.cache.size,
      maxSize: this.options.maxSize,
      hitRate: items.length > 0 ? totalAccessCount / items.length : 0,
      averageAccessCount: items.length > 0 ? totalAccessCount / items.length : 0
    };
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < oldestTime) {
        oldestTime = item.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.options.cleanupInterval);
  }

  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.options.ttl) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.cache.delete(key));
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clear();
  }
}

// Pre-configured cache instances
export const apiCache = new AdvancedCache<any>({
  maxSize: 200,
  ttl: 10 * 60 * 1000, // 10 minutes
  cleanupInterval: 2 * 60 * 1000 // 2 minutes
});

export const uiCache = new AdvancedCache<any>({
  maxSize: 50,
  ttl: 30 * 60 * 1000, // 30 minutes
  cleanupInterval: 5 * 60 * 1000 // 5 minutes
});

export { AdvancedCache };
