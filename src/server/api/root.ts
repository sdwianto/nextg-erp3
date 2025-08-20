import { createTRPCRouter } from './trpc';
import { rentalMaintenanceRouter } from './routers/rentalMaintenance';
import { inventoryRouter } from './routers/inventory';
import { financeRouter } from './routers/finance';
import { crmRouter } from './routers/crm';
import { hrmsRouter } from './routers/hrms';
import { operationsRouter } from './routers/operations';
import { salesRouter } from './routers/sales';
import { productionRouter } from './routers/production';
import { reportsRouter } from './routers/reports';
import { biRouter } from './routers/bi';
import { procurementRouter } from './routers/procurement';
import { integrationRouter } from './routers/integration';

export const appRouter = createTRPCRouter({
  rentalMaintenance: rentalMaintenanceRouter,
  inventory: inventoryRouter,
  finance: financeRouter,
  crm: crmRouter,
  hrms: hrmsRouter,
  operations: operationsRouter,
  sales: salesRouter,
  production: productionRouter,
  reports: reportsRouter,
  bi: biRouter,
  procurement: procurementRouter,
  integration: integrationRouter,
});

export type AppRouter = typeof appRouter;
