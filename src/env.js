import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET: z.string().optional(),
    NEXTAUTH_URL: z.string().optional(),
    DATABASE_URL: z.string().url().optional(),
    // Add port configuration
    FRONTEND_PORT: z.string().default("3002"),
    BACKEND_PORT: z.string().default("3001"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // Add client-side port configuration
    NEXT_PUBLIC_FRONTEND_URL: z.string().url().optional(),
    NEXT_PUBLIC_BACKEND_URL: z.string().url().optional(),
    NEXT_PUBLIC_WS_URL: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we have to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    // Port configuration
    FRONTEND_PORT: process.env.FRONTEND_PORT,
    BACKEND_PORT: process.env.BACKEND_PORT,
    // Client-side URLs
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});

// Helper functions for consistent port management
export const getPorts = () => {
  const frontendPort = parseInt(env.FRONTEND_PORT);
  const backendPort = parseInt(env.BACKEND_PORT);
  
  return {
    frontend: frontendPort,
    backend: backendPort,
    // Auto-calculate WebSocket URL based on backend port
    websocket: `ws://localhost:${backendPort}`,
    // Auto-calculate API URLs
    api: `http://localhost:${backendPort}`,
    frontendUrl: `http://localhost:${frontendPort}`,
  };
};
