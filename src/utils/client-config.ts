// Client-side configuration utilities
// Safe to use in browser environment

export const getClientPorts = () => {
  return {
    frontend: 3002,
    backend: 3001,
    websocket: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001',
    api: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api',
    frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3002',
  };
};

export const getWebSocketUrl = () => {
  // Production: Use same domain as frontend for WebSocket
  if (process.env.NODE_ENV === 'production') {
    // For Vercel, use the same domain as the frontend
    if (typeof window !== 'undefined') {
      // Ensure we have a proper URL without trailing slash
      const origin = window.location.origin;
      const cleanOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
      
      // SOLUSI: Validate URL untuk mencegah truncation
      if (!cleanOrigin || cleanOrigin === 'undefined' || cleanOrigin === 'null') {
        // eslint-disable-next-line no-console
        console.error('❌ Invalid WebSocket URL:', cleanOrigin);
        return '';
      }
      
      // eslint-disable-next-line no-console
      console.log('🔌 Generated WebSocket URL:', cleanOrigin);
      return cleanOrigin;
    }
    return '';
  }
  
  // Development: Use separate backend server
  return process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
};

export const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';
};

export const getFrontendUrl = () => {
  return process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3002';
};
