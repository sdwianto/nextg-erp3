import React, { memo, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Skeleton } from './skeleton';

// Optimized Card Component with memoization
export const OptimizedCard = memo<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}>(({ title, value, subtitle, icon, trend, className }) => {
  const formattedValue = useMemo(() => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value;
  }, [value]);

  const trendColor = useMemo(() => {
    if (!trend) return '';
    return trend.isPositive ? 'text-green-600' : 'text-red-600';
  }, [trend]);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
        {trend && (
          <div className={`text-xs ${trendColor}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </CardContent>
    </Card>
  );
});

OptimizedCard.displayName = 'OptimizedCard';

// Optimized Badge Component
export const OptimizedBadge = memo<{
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  children: React.ReactNode;
  className?: string;
}>(({ variant = 'default', children, className }) => {
  return (
    <Badge variant={variant} className={className}>
      {children}
    </Badge>
  );
});

OptimizedBadge.displayName = 'OptimizedBadge';

// Optimized Skeleton Component
export const OptimizedSkeleton = memo<{
  className?: string;
  count?: number;
}>(({ className, count = 1 }) => {
  const skeletons = useMemo(() => {
    return Array.from({ length: count }, (_, i) => (
      <Skeleton key={i} className={className} />
    ));
  }, [count, className]);

  return <>{skeletons}</>;
});

OptimizedSkeleton.displayName = 'OptimizedSkeleton';

// Optimized Loading State Component
export const OptimizedLoadingState = memo<{
  message?: string;
  className?: string;
}>(({ message = 'Loading...', className }) => {
  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <span className="text-sm text-muted-foreground">{message}</span>
      </div>
    </div>
  );
});

OptimizedLoadingState.displayName = 'OptimizedLoadingState';

// Optimized Error State Component
export const OptimizedErrorState = memo<{
  message?: string;
  onRetry?: () => void;
  className?: string;
}>(({ message = 'Something went wrong', onRetry, className }) => {
  const handleRetry = useCallback(() => {
    if (onRetry) {
      onRetry();
    }
  }, [onRetry]);

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">{message}</p>
        {onRetry && (
          <button
            onClick={handleRetry}
            className="text-xs text-primary hover:underline"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
});

OptimizedErrorState.displayName = 'OptimizedErrorState';

// Optimized Empty State Component
export const OptimizedEmptyState = memo<{
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}>(({ title, description, icon, action, className }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground text-center mb-4">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
});

OptimizedEmptyState.displayName = 'OptimizedEmptyState';
