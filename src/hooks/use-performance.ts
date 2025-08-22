import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  mountTime: number;
  updateCount: number;
  averageRenderTime: number;
}

interface UsePerformanceOptions {
  enabled?: boolean;
  logToConsole?: boolean;
  threshold?: number; // Warning threshold in milliseconds
}

export const usePerformance = (
  componentName: string,
  options: UsePerformanceOptions = {}
) => {
  const {
    enabled = process.env.NODE_ENV === 'development',
    logToConsole = false,
    threshold = 16 // 60fps threshold
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

    if (logToConsole) {
      const status = renderTime > threshold ? '⚠️' : '✅';
      // console.log(
      //   `${status} ${componentName} render: ${renderTime.toFixed(2)}ms ` +
      //   `(avg: ${metrics.averageRenderTime.toFixed(2)}ms, updates: ${metrics.updateCount})`
      // );
    }

    // Report to performance monitoring service in production
    if (process.env.NODE_ENV === 'production' && renderTime > threshold * 2) {
      // Send to analytics/monitoring service
      // reportPerformanceIssue(componentName, renderTime, metrics);
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

// Performance monitoring for API calls
export const useApiPerformance = (apiName: string) => {
  const startTimeRef = useRef<number>(0);
  const metricsRef = useRef({
    totalCalls: 0,
    totalTime: 0,
    averageTime: 0,
    slowestCall: 0
  });

  const startApiCall = useCallback(() => {
    startTimeRef.current = performance.now();
  }, []);

  const endApiCall = useCallback((success: boolean = true) => {
    const endTime = performance.now();
    const callTime = endTime - startTimeRef.current;
    
    const metrics = metricsRef.current;
    metrics.totalCalls++;
    metrics.totalTime += callTime;
    metrics.averageTime = metrics.totalTime / metrics.totalCalls;
    metrics.slowestCall = Math.max(metrics.slowestCall, callTime);

    if (process.env.NODE_ENV === 'development') {
      const status = success ? '✅' : '❌';
      // console.log(
      //   `${status} ${apiName} API call: ${callTime.toFixed(2)}ms ` +
      //   `(avg: ${metrics.averageTime.toFixed(2)}ms, total: ${metrics.totalCalls})`
      // );
    }

    // Report slow API calls
    if (callTime > 1000) { // 1 second threshold
      // console.warn(`🐌 Slow API call detected: ${apiName} took ${callTime.toFixed(2)}ms`);
    }
  }, []);

  return {
    metrics: metricsRef.current,
    startApiCall,
    endApiCall
  };
};
