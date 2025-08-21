import { createTRPCRouter } from './trpc';
import { procurementRouter } from './routers/procurement';

// Minimal router with only essential modules
export const appRouter = createTRPCRouter({
  procurement: procurementRouter,
  // Dashboard data can be handled through procurement router
  // or create a minimal dashboard router if needed
});

export type AppRouter = typeof appRouter;
