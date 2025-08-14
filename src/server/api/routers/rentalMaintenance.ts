// src/server/api/routers/rentalMaintenance.ts
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { rentalMaintenanceService } from '@/services/RentalMaintenanceService';

export const rentalMaintenanceRouter = createTRPCRouter({
  // Equipment Management
  getAllEquipment: protectedProcedure
    .query(async () => {
      return await rentalMaintenanceService.getAllEquipment();
    }),

  getEquipmentById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await rentalMaintenanceService.getEquipmentById(input.id);
    }),

  createEquipment: protectedProcedure
    .input(z.object({
      name: z.string(),
      code: z.string(),
      categoryId: z.string(),
      status: z.string(),
      location: z.string(),
      purchasePrice: z.number().optional(),
      manufacturer: z.string().optional(),
      model: z.string().optional(),
      serialNumber: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await rentalMaintenanceService.createEquipment(input);
    }),

  updateEquipment: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: z.object({
        name: z.string().optional(),
        code: z.string().optional(),
        status: z.string().optional(),
        location: z.string().optional(),
        purchasePrice: z.number().optional(),
        manufacturer: z.string().optional(),
        model: z.string().optional(),
        serialNumber: z.string().optional(),
      })
    }))
    .mutation(async ({ input }) => {
      return await rentalMaintenanceService.updateEquipment(input.id, input.data);
    }),

  getEquipmentByStatus: protectedProcedure
    .input(z.object({ status: z.string() }))
    .query(async ({ input }) => {
      return await rentalMaintenanceService.getEquipmentByStatus(input.status);
    }),

  // Maintenance Management
  createMaintenanceRecord: protectedProcedure
    .input(z.object({
      equipmentId: z.string(),
      maintenanceType: z.string(),
      description: z.string(),
      startDate: z.date(),
      assignedTechnician: z.string(),
      priority: z.string(),
      estimatedCost: z.number().optional(),
      requiredParts: z.any().optional(),
    }))
    .mutation(async ({ input }) => {
      return await rentalMaintenanceService.createMaintenanceRecord(input);
    }),

  updateMaintenanceStatus: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.string(),
      endDate: z.date().optional(),
      actualCost: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      return await rentalMaintenanceService.updateMaintenanceStatus(
        input.id, 
        input.status, 
        input.endDate, 
        input.actualCost
      );
    }),

  getMaintenanceByStatus: protectedProcedure
    .input(z.object({ status: z.string() }))
    .query(async ({ input }) => {
      return await rentalMaintenanceService.getMaintenanceByStatus(input.status);
    }),

  createMaintenanceSchedule: protectedProcedure
    .input(z.object({
      equipmentId: z.string(),
      maintenanceType: z.string(),
      frequency: z.string(),
      interval: z.number(),
      nextMaintenance: z.date(),
      requiredParts: z.any().optional(),
      estimatedCost: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      return await rentalMaintenanceService.createMaintenanceSchedule(input);
    }),

  getMaintenanceSchedule: protectedProcedure
    .input(z.object({ equipmentId: z.string() }))
    .query(async ({ input }) => {
      return await rentalMaintenanceService.getMaintenanceSchedule(input.equipmentId);
    }),

  // Rental Management
  createRentalOrder: protectedProcedure
    .input(z.object({
      customerId: z.string(),
      startDate: z.date(),
      endDate: z.date(),
      items: z.array(z.object({
        equipmentId: z.string(),
        dailyRate: z.number(),
        quantity: z.number(),
      })),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await rentalMaintenanceService.createRentalOrder(input);
    }),

  updateRentalStatus: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await rentalMaintenanceService.updateRentalStatus(input.id, input.status);
    }),

  // Integration Methods
  reserveEquipmentForMaintenance: protectedProcedure
    .input(z.object({
      equipmentId: z.string(),
      maintenanceId: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await rentalMaintenanceService.reserveEquipmentForMaintenance(
        input.equipmentId, 
        input.maintenanceId
      );
    }),

  completeMaintenance: protectedProcedure
    .input(z.object({
      equipmentId: z.string(),
      maintenanceId: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await rentalMaintenanceService.completeMaintenance(
        input.equipmentId, 
        input.maintenanceId
      );
    }),

  checkMaintenanceDue: protectedProcedure
    .query(async () => {
      return await rentalMaintenanceService.checkMaintenanceDue();
    }),

  getEquipmentUtilization: protectedProcedure
    .input(z.object({
      equipmentId: z.string(),
      startDate: z.date(),
      endDate: z.date(),
    }))
    .query(async ({ input }) => {
      return await rentalMaintenanceService.getEquipmentUtilization(
        input.equipmentId,
        input.startDate,
        input.endDate
      );
    }),

  // Analytics
  getMaintenanceAnalytics: protectedProcedure
    .query(async () => {
      return await rentalMaintenanceService.getMaintenanceAnalytics();
    }),

  getRentalAnalytics: protectedProcedure
    .query(async () => {
      return await rentalMaintenanceService.getRentalAnalytics();
    }),

  // JD Edwards Integration Features
  getPredictiveMaintenance: protectedProcedure
    .input(z.object({
      equipmentId: z.string().optional(),
      daysAhead: z.number().default(30),
    }))
    .query(async ({ input }) => {
      // This would integrate with JD Edwards predictive maintenance algorithms
      const equipment = input.equipmentId 
        ? [await rentalMaintenanceService.getEquipmentById(input.equipmentId)]
        : await rentalMaintenanceService.getAllEquipment();

      const predictiveSchedule = equipment
        .filter(eq => eq && eq.maintenanceSchedule)
        .map(eq => {
          const schedule = eq!.maintenanceSchedule;
          const nextMaintenance = new Date(schedule.nextMaintenance);
          const daysUntilMaintenance = Math.ceil(
            (nextMaintenance.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );

          return {
            equipmentId: eq!.id,
            equipmentName: eq!.name,
            equipmentCode: eq!.code,
            nextMaintenanceDate: nextMaintenance,
            daysUntilMaintenance,
            maintenanceType: schedule.maintenanceType,
            estimatedCost: schedule.estimatedCost,
            requiredParts: schedule.requiredParts,
            priority: daysUntilMaintenance <= 7 ? 'HIGH' : 
                     daysUntilMaintenance <= 14 ? 'MEDIUM' : 'LOW',
            isDueSoon: daysUntilMaintenance <= input.daysAhead
          };
        })
        .filter(item => item.isDueSoon)
        .sort((a, b) => a.daysUntilMaintenance - b.daysUntilMaintenance);

      return predictiveSchedule;
    }),

  getEquipmentLifecycleAnalytics: protectedProcedure
    .input(z.object({
      equipmentId: z.string(),
      period: z.enum(['week', 'month', 'quarter', 'year']).default('month'),
    }))
    .query(async ({ input }) => {
      const equipment = await rentalMaintenanceService.getEquipmentById(input.equipmentId);
      if (!equipment) throw new Error('Equipment not found');

      const endDate = new Date();
      const startDate = new Date();
      
      switch (input.period) {
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(endDate.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      const utilization = await rentalMaintenanceService.getEquipmentUtilization(
        input.equipmentId,
        startDate,
        endDate
      );

      const maintenanceCost = equipment.maintenanceRecords
        .filter(record => 
          record.startDate >= startDate && 
          record.startDate <= endDate &&
          record.status === 'COMPLETED'
        )
        .reduce((sum, record) => sum + (record.cost || 0), 0);

      const downtimeDays = equipment.maintenanceRecords
        .filter(record => 
          record.startDate >= startDate && 
          record.startDate <= endDate &&
          record.status === 'COMPLETED'
        )
        .reduce((sum, record) => {
          if (record.startDate && record.endDate) {
            const days = Math.ceil(
              (record.endDate.getTime() - record.startDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            return sum + days;
          }
          return sum;
        }, 0);

      return {
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        equipmentCode: equipment.code,
        period: input.period,
        utilization: Math.round(utilization * 100) / 100,
        maintenanceCost,
        downtimeDays,
        totalOperatingHours: equipment.totalOperatingHours,
        lastMaintenanceDate: equipment.lastMaintenanceDate,
        nextMaintenanceDate: equipment.nextMaintenanceDate,
        status: equipment.status,
        location: equipment.location,
        assetValue: equipment.asset?.currentValue || 0,
        roi: equipment.asset ? 
          ((utilization * 100) / (equipment.asset.currentValue / 1000)) : 0 // Simplified ROI calculation
      };
    }),

  // Real-time Monitoring
  getEquipmentStatus: protectedProcedure
    .query(async () => {
      const equipment = await rentalMaintenanceService.getAllEquipment();
      
      return {
        total: equipment.length,
        available: equipment.filter(eq => eq.status === 'AVAILABLE').length,
        inUse: equipment.filter(eq => eq.status === 'IN_USE').length,
        maintenance: equipment.filter(eq => eq.status === 'MAINTENANCE').length,
        repair: equipment.filter(eq => eq.status === 'REPAIR').length,
        retired: equipment.filter(eq => eq.status === 'RETIRED').length,
        overdueMaintenance: equipment.filter(eq => 
          eq.nextMaintenanceDate && eq.nextMaintenanceDate < new Date()
        ).length
      };
    }),

  // Automated Workflows
  triggerAutomatedMaintenance: protectedProcedure
    .input(z.object({
      equipmentId: z.string(),
      maintenanceType: z.string().default('PREVENTIVE'),
      priority: z.string().default('MEDIUM'),
    }))
    .mutation(async ({ input, ctx }) => {
      // This implements JD Edwards-style automated workflow
      const equipment = await rentalMaintenanceService.getEquipmentById(input.equipmentId);
      if (!equipment) throw new Error('Equipment not found');

      // Create maintenance record
      const maintenanceRecord = await rentalMaintenanceService.createMaintenanceRecord({
        equipmentId: input.equipmentId,
        maintenanceType: input.maintenanceType,
        description: `Automated ${input.maintenanceType.toLowerCase()} maintenance triggered`,
        startDate: new Date(),
        assignedTechnician: ctx.userId, // Assign to current user or system
        priority: input.priority,
        estimatedCost: 0, // Will be updated when maintenance is scheduled
      });

      // Reserve equipment for maintenance
      await rentalMaintenanceService.reserveEquipmentForMaintenance(
        input.equipmentId,
        maintenanceRecord.id
      );

      // Update equipment status
      await rentalMaintenanceService.updateEquipment(input.equipmentId, {
        status: 'MAINTENANCE'
      });

      return {
        success: true,
        maintenanceRecord,
        message: 'Automated maintenance workflow triggered successfully'
      };
    }),
});
