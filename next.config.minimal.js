/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  webpack: (config, { isServer }) => {
    // Optimize bundle size by excluding unused modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Tree shaking for unused components
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
    };

    return config;
  },
  // Disable unused features
  images: {
    unoptimized: true, // For faster builds
  },
  // Only include necessary pages
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/dashboard',
      },
    ];
  },
  // Environment variables for minimal build
  env: {
    BUILD_MODE: 'minimal',
    ENABLE_PROCUREMENT: 'true',
    ENABLE_DASHBOARD: 'true',
    ENABLE_OTHER_MODULES: 'false',
  },
};

module.exports = nextConfig;
