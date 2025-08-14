import { createTRPCRouter } from './trpc';
import { rentalMaintenanceRouter } from './routers/rentalMaintenance';

export const appRouter = createTRPCRouter({
  rentalMaintenance: rentalMaintenanceRouter,
});

export type AppRouter = typeof appRouter;
