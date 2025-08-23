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
    return process.env.NEXT_PUBLIC_WS_URL || (typeof window !== 'undefined' ? window.location.origin : '');
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
