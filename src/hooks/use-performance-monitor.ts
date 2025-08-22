import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  mountTime: number;
  updateCount: number;
  averageRenderTime: number;
  memoryUsage?: number;
  networkRequests?: number;
}

interface PerformanceOptions {
  enabled?: boolean;
  logToConsole?: boolean;
  threshold?: number;
  componentName?: string;
}

export const usePerformanceMonitor = (
  options: PerformanceOptions = {}
) => {
  const {
    enabled = process.env.NODE_ENV === 'development',
    logToConsole = false,
    threshold = 16, // 60fps threshold
    componentName = 'Unknown'
  } = options;

  const metricsRef = useRef<PerformanceMetrics>({
    renderTime: 0,
    mountTime: 0,
    updateCount: 0,
    averageRenderTime: 0
  });

  const startTimeRef = useRef<number>(0);
  const mountTimeRef = useRef<number>(0);

  const startMeasure = useCallback(() => {
    if (!enabled) return;
    startTimeRef.current = performance.now();
  }, [enabled]);

  const endMeasure = useCallback(() => {
    if (!enabled) return;
    
    const endTime = performance.now();
    const renderTime = endTime - startTimeRef.current;
    
    const metrics = metricsRef.current;
    metrics.renderTime = renderTime;
    metrics.updateCount++;
    metrics.averageRenderTime = 
      (metrics.averageRenderTime * (metrics.updateCount - 1) + renderTime) / metrics.updateCount;

    // Track memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
    }

    if (logToConsole) {
      const status = renderTime > threshold ? '⚠️' : '✅';
      // console.log(
      //   `${status} ${componentName} render: ${renderTime.toFixed(2)}ms ` +
      //   `(avg: ${metrics.averageRenderTime.toFixed(2)}ms, updates: ${metrics.updateCount})`
      // );
    }

    // Report slow renders
    if (renderTime > threshold * 2) {
      // console.warn(`🐌 Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
  }, [enabled, logToConsole, threshold]);

  useEffect(() => {
    if (!enabled) return;
    
    mountTimeRef.current = performance.now();
    metricsRef.current.mountTime = mountTimeRef.current;
    
    return () => {
      const totalMountTime = performance.now() - mountTimeRef.current;
      if (logToConsole) {
        // console.log(
        //   `📊 ${componentName} total mount time: ${totalMountTime.toFixed(2)}ms`
        // );
      }
    };
  }, [enabled, componentName, logToConsole]);

  useEffect(() => {
    startMeasure();
    return () => endMeasure();
  });

  return {
    metrics: metricsRef.current,
    startMeasure,
    endMeasure,
    isSlow: metricsRef.current.averageRenderTime > threshold
  };
};

// Network performance monitoring
export const useNetworkMonitor = () => {
  const networkMetricsRef = useRef({
    totalRequests: 0,
    averageResponseTime: 0,
    slowRequests: 0,
    failedRequests: 0
  });

  const startRequest = useCallback(() => {
    const startTime = performance.now();
    networkMetricsRef.current.totalRequests++;
    return startTime;
  }, []);

  const endRequest = useCallback((startTime: number, success: boolean = true) => {
    const responseTime = performance.now() - startTime;
    const metrics = networkMetricsRef.current;
    
    metrics.averageResponseTime = 
      (metrics.averageResponseTime * (metrics.totalRequests - 1) + responseTime) / metrics.totalRequests;

    if (responseTime > 1000) { // 1 second threshold
      metrics.slowRequests++;
    }

    if (!success) {
      metrics.failedRequests++;
    }
  }, []);

  return {
    metrics: networkMetricsRef.current,
    startRequest,
    endRequest
  };
};

// Memory usage monitoring
export const useMemoryMonitor = () => {
  const memoryMetricsRef = useRef({
    currentUsage: 0,
    peakUsage: 0,
    averageUsage: 0,
    measurements: 0
  });

  const measureMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const currentUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
      
      const metrics = memoryMetricsRef.current;
      metrics.currentUsage = currentUsage;
      metrics.peakUsage = Math.max(metrics.peakUsage, currentUsage);
      metrics.measurements++;
      metrics.averageUsage = 
        (metrics.averageUsage * (metrics.measurements - 1) + currentUsage) / metrics.measurements;

      return currentUsage;
    }
    return 0;
  }, []);

  useEffect(() => {
    const interval = setInterval(measureMemory, 5000); // Measure every 5 seconds
    return () => clearInterval(interval);
  }, [measureMemory]);

  return {
    metrics: memoryMetricsRef.current,
    measureMemory
  };
};
