/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */

// src/server/api/routers/rentalMaintenance.ts
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const rentalMaintenanceRouter = createTRPCRouter({
  test: publicProcedure
    .query(() => {
      return { message: 'Rental maintenance router is working' };
    }),

  getAllEquipment: publicProcedure
    .query(() => {
      return [
        { id: '1', name: 'Excavator', status: 'AVAILABLE' },
        { id: '2', name: 'Bulldozer', status: 'IN_USE' }
      ];
    }),

  getEquipmentById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }: { input: any }) => {
      return { id: input.id, name: 'Equipment ' + input.id, status: 'AVAILABLE' };
    }),

  createEquipment: publicProcedure
    .input(z.object({
      name: z.string(),
      code: z.string(),
      status: z.string(),
      location: z.string(),
    }))
    .mutation(({ input }: { input: any }) => {
      return { id: 'new-id', ...input };
    }),

  createMaintenanceRecord: publicProcedure
    .input(z.object({
      equipmentId: z.string(),
      maintenanceType: z.string(),
      description: z.string(),
      startDate: z.date(),
      assignedTechnician: z.string(),
      priority: z.string(),
    }))
    .mutation(({ input }: { input: any }) => {
      return { id: 'maintenance-id', ...input };
    }),

  getMaintenanceAnalytics: publicProcedure
    .query(() => {
      return {
        totalEquipment: 10,
        underMaintenance: 3,
        available: 7
      };
    }),

  getRentalAnalytics: publicProcedure
    .query(() => {
      return {
        totalRentals: 15,
        activeRentals: 8,
        revenue: 50000
      };
    }),
});
