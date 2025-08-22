import React from 'react';
import ModernLoader from './modern-loader';

interface DashboardLoaderProps {
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'minimal' | 'fullscreen';
}

const DashboardLoader: React.FC<DashboardLoaderProps> = ({
  title = "NextGen ERP Dashboard v1.1",
  subtitle = "Loading real-time data...",
  variant = 'default'
}) => {
  if (variant === 'minimal') {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                 <div className="text-center space-y-6">
           <div className="relative flex items-center justify-center">
             <div className="w-16 h-16 flex items-center justify-center">
               <ModernLoader size="lg" variant="spinner" />
             </div>
             <div className="absolute w-16 h-16 flex items-center justify-center">
               <div className="w-full h-full border-2 border-green-400/30 rounded-full animate-ping" />
             </div>
           </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
            <p className="text-gray-400 text-sm">{subtitle}</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'fullscreen') {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-purple-500/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pink-500/5 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Main content */}
        <div className="text-center space-y-8 relative z-10">
          {/* Logo/Icon */}
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="absolute inset-0 w-20 h-20 mx-auto mb-6">
              <div className="w-full h-full border-2 border-green-400/50 rounded-2xl animate-ping" />
            </div>
          </div>

          {/* Title and subtitle */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white tracking-tight">{title}</h1>
            <p className="text-gray-400 text-lg">{subtitle}</p>
          </div>

          {/* Loading animation */}
          <div className="flex justify-center space-x-4">
            <ModernLoader variant="wave" />
          </div>

          {/* Progress bar */}
          <div className="w-64 mx-auto">
            <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Database Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <span>Loading Modules</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              <span>Initializing UI</span>
            </div>
          </div>
        </div>

        {/* Border effect */}
        <div className="absolute inset-0 border-2 border-green-400/30 rounded-lg m-4 pointer-events-none" />
      </div>
    );
  }

  // Default variant
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="text-center space-y-6">
                 {/* Animated logo */}
         <div className="relative flex items-center justify-center">
           <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
             </svg>
           </div>
           <div className="absolute w-16 h-16 flex items-center justify-center">
             <div className="w-full h-full border-2 border-green-400/40 rounded-xl animate-ping" />
           </div>
         </div>

        {/* Title and subtitle */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          <p className="text-gray-400">{subtitle}</p>
        </div>

        {/* Loading animation */}
        <div className="flex justify-center">
          <ModernLoader variant="dots" />
        </div>

        {/* Progress indicator */}
        <div className="w-48 mx-auto">
          <div className="bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full animate-pulse" style={{ width: '75%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLoader;
