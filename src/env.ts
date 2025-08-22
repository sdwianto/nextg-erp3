import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Centralized port configuration
const PORT_CONFIG = {
  FRONTEND: 3002,
  BACKEND: 3001,
  WEBSOCKET: 3001, // Same as backend
} as const;

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    DATABASE_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(1).optional(),
    NEXTAUTH_URL: z.string().url().optional(),
    CLERK_SECRET_KEY: z.string().min(1).optional(),
    CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),
    CLERK_WEBHOOK_SECRET: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1).optional(),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1).optional(),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().min(1).optional(),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().min(1).optional(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
  },
});

// Centralized port management
export const getPorts = () => {
  const isDev = process.env.NODE_ENV === "development";
  
  return {
    frontend: isDev ? PORT_CONFIG.FRONTEND : 3000,
    backend: isDev ? PORT_CONFIG.BACKEND : 3001,
    websocket: isDev ? PORT_CONFIG.WEBSOCKET : 3001,
  };
};

// URL generators
export const getUrls = () => {
  const ports = getPorts();
  const isDev = process.env.NODE_ENV === "development";
  const host = isDev ? "localhost" : process.env.VERCEL_URL || "localhost";
  
  return {
    frontend: `http://${host}:${ports.frontend}`,
    backend: `http://${host}:${ports.backend}`,
    websocket: `ws://${host}:${ports.websocket}`,
    api: `http://${host}:${ports.backend}/api`,
  };
};

// CORS configuration
export const getCorsConfig = () => {
  const urls = getUrls();
  const isDev = process.env.NODE_ENV === "development";
  
  return {
    origin: isDev 
      ? [
          urls.frontend,
          "http://localhost:3000",
          "http://localhost:3001", 
          "http://localhost:3002",
          process.env.NEXT_PUBLIC_FRONTEND_URL ?? urls.frontend
        ]
      : [urls.frontend],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-Client-Type"],
  };
};

// WebSocket configuration
export const getWebSocketConfig = () => {
  const corsConfig = getCorsConfig();
  
  return {
    cors: corsConfig,
    transports: ['polling', 'websocket'] as string[],
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
  };
};

// Client-side configuration
export const getClientConfig = () => {
  const urls = getUrls();
  
  return {
    apiUrl: urls.api,
    websocketUrl: urls.websocket,
    frontendUrl: urls.frontend,
  };
};
