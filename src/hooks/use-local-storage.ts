import { useState, useEffect, useCallback, useRef } from 'react';

interface UseLocalStorageOptions<T> {
  defaultValue?: T;
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  onError?: (error: Error) => void;
}

export function useLocalStorage<T>(
  key: string,
  options: UseLocalStorageOptions<T> = {}
): [T | undefined, (value: T) => void, () => void] {
  const {
    defaultValue,
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    onError = (error: Error) => {
      // Silently handle errors to avoid console spam
    }
  } = options;

  const [storedValue, setStoredValue] = useState<T | undefined>(() => {
    try {
      if (typeof window === 'undefined') {
        return defaultValue;
      }

      const item = window.localStorage.getItem(key);
      return item ? deserializer(item) : defaultValue;
    } catch (error) {
      onError(error as Error);
      return defaultValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, serializer(value));
      }
    } catch (error) {
      onError(error as Error);
    }
  }, [key, serializer, onError]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(undefined);
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      onError(error as Error);
    }
  }, [key, onError]);

  // Listen for changes in other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(deserializer(e.newValue));
        } catch (error) {
          onError(error as Error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, deserializer, onError]);

  return [storedValue, setValue, removeValue];
}

// Optimized localStorage manager for large data
export class LocalStorageManager {
  private static instance: LocalStorageManager;
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private maxSize = 50; // Maximum number of cached items

  static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  set(key: string, data: any, ttlSeconds: number = 3600): void {
    try {
      // Cleanup old items if cache is full
      if (this.cache.size >= this.maxSize) {
        this.cleanup();
      }

      const item = {
        data,
        timestamp: Date.now(),
        ttl: ttlSeconds * 1000
      };

      this.cache.set(key, item);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(item));
      }
    } catch (error) {
      // console.error('Error setting localStorage item:', error);
    }
  }

  get(key: string): any | null {
    try {
      // Check cache first
      const cached = this.cache.get(key);
      if (cached && (Date.now() - cached.timestamp) < cached.ttl) {
        return cached.data;
      }

      // Check localStorage
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          if ((Date.now() - parsed.timestamp) < parsed.ttl) {
            this.cache.set(key, parsed);
            return parsed.data;
          } else {
            // Remove expired item
            this.remove(key);
          }
        }
      }

      return null;
    } catch (error) {
      // console.error('Error getting localStorage item:', error);
      return null;
    }
  }

  remove(key: string): void {
    try {
      this.cache.delete(key);
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      // console.error('Error removing localStorage item:', error);
    }
  }

  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((item, key) => {
      if ((now - item.timestamp) > item.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      this.remove(key);
    });
  }

  clear(): void {
    try {
      this.cache.clear();
      
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
      }
    } catch (error) {
      // console.error('Error clearing localStorage:', error);
    }
  }
}

// Hook for using the optimized localStorage manager
export function useOptimizedLocalStorage<T>(
  key: string,
  defaultValue?: T,
  ttlSeconds: number = 3600
): [T | undefined, (value: T) => void, () => void] {
  const manager = LocalStorageManager.getInstance();
  const [value, setValue] = useState<T | undefined>(() => {
    const stored = manager.get(key);
    return stored !== null ? stored : defaultValue;
  });

  const setStoredValue = useCallback((newValue: T) => {
    setValue(newValue);
    manager.set(key, newValue, ttlSeconds);
  }, [key, ttlSeconds, manager]);

  const removeStoredValue = useCallback(() => {
    setValue(undefined);
    manager.remove(key);
  }, [key, manager]);

  return [value, setStoredValue, removeStoredValue];
}
