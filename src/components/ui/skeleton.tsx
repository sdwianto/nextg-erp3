import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
  height?: string;
  width?: string;
  circular?: boolean;
  animated?: boolean;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, lines = 1, height = "h-4", width = "w-full", circular = false, animated = true, ...props }, ref) => {
    if (lines === 1) {
      return (
        <div
          ref={ref}
          className={cn(
            "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md",
            circular ? "rounded-full" : "",
            height,
            width,
            animated && "animate-pulse",
            className
          )}
          style={{
            backgroundSize: animated ? '200% 100%' : '100% 100%',
            animation: animated ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
          }}
          {...props}
        />
      );
    }

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md",
              height,
              index === lines - 1 && lines > 1 ? "w-3/4" : width,
              animated && "animate-pulse"
            )}
            style={{
              backgroundSize: animated ? '200% 100%' : '100% 100%',
              animation: animated ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
              animationDelay: animated ? `${index * 0.1}s` : '0s'
            }}
          />
        ))}
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";

// Enhanced specialized skeleton components
const CardSkeleton = ({ className, animated = true, ...props }: React.HTMLAttributes<HTMLDivElement> & { animated?: boolean }) => (
  <div className={cn("border rounded-lg p-6 space-y-4 bg-white dark:bg-gray-800", className)} {...props}>
    <div className="flex items-center justify-between">
      <Skeleton height="h-6" width="w-3/4" animated={animated} />
      <Skeleton height="h-8" width="w-16" circular animated={animated} />
    </div>
    <Skeleton lines={3} animated={animated} />
    <div className="flex justify-between">
      <Skeleton height="h-8" width="w-20" animated={animated} />
      <Skeleton height="h-8" width="w-16" animated={animated} />
    </div>
  </div>
);

const TableSkeleton = ({
  rows = 5,
  columns = 4,
  className,
  animated = true,
  ...props
}: {
  rows?: number;
  columns?: number;
  animated?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("w-full", className)} {...props}>
    {/* Header */}
    <div className="flex space-x-4 mb-4">
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} height="h-6" width="flex-1" animated={animated} />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4 mb-3">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton 
            key={colIndex} 
            height="h-4" 
            width="flex-1" 
            animated={animated}
            style={{ animationDelay: `${(rowIndex + colIndex) * 0.05}s` }}
          />
        ))}
      </div>
    ))}
  </div>
);

const StatCardSkeleton = ({ className, animated = true, ...props }: React.HTMLAttributes<HTMLDivElement> & { animated?: boolean }) => (
  <div className={cn("border rounded-lg p-6 bg-white dark:bg-gray-800", className)} {...props}>
    <div className="flex items-center justify-between mb-4">
      <Skeleton height="h-5" width="w-24" animated={animated} />
      <Skeleton height="h-5" width="w-5" circular animated={animated} />
    </div>
    <Skeleton height="h-8" width="w-16" className="mb-2" animated={animated} />
    <Skeleton height="h-4" width="w-20" animated={animated} />
  </div>
);

const ChartSkeleton = ({ className, animated = true, ...props }: React.HTMLAttributes<HTMLDivElement> & { animated?: boolean }) => (
  <div className={cn("border rounded-lg p-6 bg-white dark:bg-gray-800", className)} {...props}>
    <Skeleton height="h-6" width="w-32" className="mb-4" animated={animated} />
    <div className="relative">
      <Skeleton height="h-40" animated={animated} />
      {/* Chart bars overlay */}
      <div className="absolute inset-0 flex items-end justify-around px-4 pb-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="w-8 bg-gradient-to-t from-blue-500/20 to-purple-500/20 rounded-t"
            style={{
              height: `${Math.random() * 60 + 20}%`,
              animationDelay: `${index * 0.1}s`
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

const DashboardGridSkeleton = ({ className, animated = true, ...props }: React.HTMLAttributes<HTMLDivElement> & { animated?: boolean }) => (
  <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)} {...props}>
    {Array.from({ length: 8 }).map((_, index) => (
      <StatCardSkeleton key={index} animated={animated} />
    ))}
  </div>
);

const SidebarSkeleton = ({ className, animated = true, ...props }: React.HTMLAttributes<HTMLDivElement> & { animated?: boolean }) => (
  <div className={cn("space-y-4", className)} {...props}>
    {/* Logo */}
    <div className="flex items-center space-x-3 p-4">
      <Skeleton height="h-8" width="w-8" circular animated={animated} />
      <Skeleton height="h-6" width="w-24" animated={animated} />
    </div>
    {/* Menu items */}
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3 p-4">
        <Skeleton height="h-5" width="w-5" animated={animated} />
        <Skeleton height="h-4" width="w-20" animated={animated} />
      </div>
    ))}
  </div>
);

export { 
  Skeleton, 
  CardSkeleton, 
  TableSkeleton, 
  StatCardSkeleton, 
  ChartSkeleton,
  DashboardGridSkeleton,
  SidebarSkeleton
};