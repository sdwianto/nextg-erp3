import React from 'react';
import { cn } from '@/lib/utils';

interface ModernLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'pulse' | 'wave' | 'dots' | 'spinner';
  className?: string;
}

const ModernLoader: React.FC<ModernLoaderProps> = ({ 
  size = 'md', 
  variant = 'default',
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  if (variant === 'pulse') {
    return (
      <div className={cn("flex space-x-2", className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse",
              sizeClasses[size]
            )}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1.4s'
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'wave') {
    return (
      <div className={cn("flex space-x-1", className)}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-1 bg-gradient-to-t from-blue-500 to-purple-600 rounded-full animate-pulse"
            style={{
              height: `${(i + 1) * 8}px`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.8s'
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn("flex space-x-2", className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'spinner') {
    return (
      <div className={cn("relative flex items-center justify-center", className)}>
        <div
          className={cn(
            "border-4 border-gray-200 border-t-gradient-to-r border-t-blue-500 border-t-purple-600 rounded-full animate-spin",
            sizeClasses[size]
          )}
        />
        <div
          className={cn(
            "absolute border-4 border-transparent border-t-gradient-to-r border-t-purple-600 border-t-pink-600 rounded-full animate-spin",
            sizeClasses[size]
          )}
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        />
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-spin",
          sizeClasses[size]
        )}
        style={{
          backgroundSize: '200% 200%',
          animation: 'spin 2s linear infinite, gradient 3s ease infinite'
        }}
      />
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default ModernLoader;
