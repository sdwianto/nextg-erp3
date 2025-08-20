// Client-side configuration utilities
// Safe to use in browser environment
import { getClientConfig } from '../env';

export const getClientPorts = () => {
  const config = getClientConfig();
  return {
    frontend: 3002,
    backend: 3001,
    websocket: config.websocketUrl,
    api: config.apiUrl,
    frontendUrl: config.frontendUrl,
  };
};

export const getWebSocketUrl = () => {
  const config = getClientConfig();
  return process.env.NEXT_PUBLIC_WS_URL ?? config.websocketUrl;
};

export const getApiUrl = () => {
  const config = getClientConfig();
  return process.env.NEXT_PUBLIC_BACKEND_URL ?? config.apiUrl;
};

export const getFrontendUrl = () => {
  const config = getClientConfig();
  return process.env.NEXT_PUBLIC_FRONTEND_URL ?? config.frontendUrl;
};
