import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "@/server/db";

// Input validation schemas
const createEquipmentSchema = z.object({
  name: z.string().min(1, "Equipment name is required"),
  code: z.string().min(1, "Equipment code is required"),
  categoryId: z.string().min(1, "Category is required"),
  model: z.string().optional(),
  manufacturer: z.string().optional(),
  yearManufactured: z.number().optional(),
  serialNumber: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(["AVAILABLE", "IN_USE", "MAINTENANCE", "REPAIR", "RETIRED", "LOST"]).default("AVAILABLE"),
  purchaseDate: z.string().optional(),
  purchasePrice: z.number().optional(),
  currentValue: z.number().optional(),
  description: z.string().optional(),
  specifications: z.record(z.any()).optional(),
});

const createMaintenanceRecordSchema = z.object({
  equipmentId: z.string().min(1, "Equipment is required"),
  userId: z.string().min(1, "User is required"),
  maintenanceType: z.enum(["PREVENTIVE", "CORRECTIVE", "EMERGENCY", "INSPECTION"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  scheduledDate: z.string().optional(),
  completedDate: z.string().optional(),
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).default("SCHEDULED"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  estimatedCost: z.number().optional(),
  actualCost: z.number().optional(),
  technician: z.string().optional(),
  parts: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const rentalMaintenanceRouter = createTRPCRouter({
  // ========================================
  // EQUIPMENT MANAGEMENT
  // ========================================

  // Get all equipment
  getEquipment: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      search: z.string().optional(),
      status: z.string().optional(),
      type: z.string().optional(),
      location: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const { page, limit, search, status, type, location } = input;
      const _skip = (page - 1) * limit;

      const where = {
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { code: { contains: search, mode: "insensitive" as const } },
            { model: { contains: search, mode: "insensitive" as const } },
            { manufacturer: { contains: search, mode: "insensitive" as const } },
          ],
        }),
        ...(status && { status: status as "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "REPAIR" | "RETIRED" | "LOST" }),
        ...(type && { type }),
        ...(location && { location: { contains: location, mode: "insensitive" as const } }),
      };

      const [equipment, total] = await Promise.all([
        prisma.equipment.findMany({
          where,
          include: {
            category: true,
            maintenanceRecords: {
              take: 5,
              orderBy: { createdAt: "desc" },
            },
            _count: {
              select: {
                maintenanceRecords: true,
                rentalOrderItems: true,
              },
            },
          },
          skip: _skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.equipment.count({ where }),
      ]);

      return {
        equipment,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  // Get equipment by ID
  getEquipmentById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const equipment = await prisma.equipment.findUnique({
        where: { id: input.id },
        include: {
          category: true,
          maintenanceRecords: {
            orderBy: { createdAt: "desc" },
          },
          rentalOrderItems: {
            include: {
              rentalOrder: true,
            },
          },
        },
      });

      if (!equipment) {
        throw new Error("Equipment not found");
      }

      return equipment;
    }),

  // Create equipment
  createEquipment: protectedProcedure
    .input(createEquipmentSchema)
    .mutation(async ({ input, ctx }) => {
      const equipment = await prisma.equipment.create({
        data: {
          ...input,
          createdBy: ctx.user.id,
        },
        include: {
          category: true,
        },
      });

      return equipment;
    }),

  // Update equipment
  updateEquipment: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: createEquipmentSchema.partial(),
    }))
    .mutation(async ({ input, ctx }) => {
      const equipment = await prisma.equipment.update({
        where: { id: input.id },
        data: {
          ...input.data,
          updatedBy: ctx.user.id,
        },
        include: {
          category: true,
        },
      });

      return equipment;
    }),

  // Delete equipment
  deleteEquipment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.equipment.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // ========================================
  // MAINTENANCE MANAGEMENT
  // ========================================

  // Get all maintenance records
  getMaintenanceRecords: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      equipmentId: z.string().optional(),
      status: z.string().optional(),
      type: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const { page, limit, equipmentId, status, type } = input;
      const _skip = (page - 1) * limit;

      const where = {
        ...(equipmentId && { equipmentId }),
        ...(status && { status: status as "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" }),
        ...(type && { maintenanceType: type as "PREVENTIVE" | "CORRECTIVE" | "EMERGENCY" | "INSPECTION" }),
      };

      const [records, total] = await Promise.all([
        prisma.maintenanceRecord.findMany({
          where,
          include: {
            equipment: { select: { name: true, code: true } },
            user: { select: { firstName: true, lastName: true } },
          },
          skip: _skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.maintenanceRecord.count({ where }),
      ]);

      return {
        records,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  // Create maintenance record
  createMaintenanceRecord: protectedProcedure
    .input(createMaintenanceRecordSchema)
    .mutation(async ({ input }) => {
      const record = await prisma.maintenanceRecord.create({
        data: {
          ...input,
          scheduledDate: input.scheduledDate ? new Date(input.scheduledDate) : null,
          completedDate: input.completedDate ? new Date(input.completedDate) : null,
        },
        include: {
          equipment: { select: { name: true, code: true } },
          user: { select: { firstName: true, lastName: true } },
        },
      });

      return record;
    }),

  // Update maintenance record
  updateMaintenanceRecord: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: createMaintenanceRecordSchema.partial(),
    }))
    .mutation(async ({ input }) => {
      const record = await prisma.maintenanceRecord.update({
        where: { id: input.id },
        data: {
          ...input.data,
          scheduledDate: input.data.scheduledDate ? new Date(input.data.scheduledDate) : undefined,
          completedDate: input.data.completedDate ? new Date(input.data.completedDate) : undefined,
        },
        include: {
          equipment: { select: { name: true, code: true } },
          user: { select: { firstName: true, lastName: true } },
        },
      });

      return record;
    }),

  // ========================================
  // DASHBOARD & ANALYTICS
  // ========================================

  // Get rental maintenance dashboard data
  getDashboardData: publicProcedure
    .query(async () => {
      const [
        totalEquipment,
        availableEquipment,
        inUseEquipment,
        maintenanceEquipment,
        totalMaintenanceRecords,
        pendingMaintenanceRecords,
        completedMaintenanceRecords,
      ] = await Promise.all([
        prisma.equipment.count(),
        prisma.equipment.count({ where: { status: "AVAILABLE" } }),
        prisma.equipment.count({ where: { status: "IN_USE" } }),
        prisma.equipment.count({ where: { status: "MAINTENANCE" } }),
        prisma.maintenanceRecord.count(),
        prisma.maintenanceRecord.count({ where: { status: { in: ["SCHEDULED", "IN_PROGRESS"] } } }),
        prisma.maintenanceRecord.count({ where: { status: "COMPLETED" } }),
      ]);

      // Get recent activities
      const recentMaintenance = await prisma.maintenanceRecord.findMany({
        take: 5,
        include: {
          equipment: { select: { name: true, code: true } },
          user: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      const recentEquipment = await prisma.equipment.findMany({
        take: 5,
        include: {
          category: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return {
        summary: {
          totalEquipment,
          availableEquipment,
          inUseEquipment,
          maintenanceEquipment,
          totalMaintenanceRecords,
          pendingMaintenanceRecords,
          completedMaintenanceRecords,
        },
        recentActivities: {
          maintenance: recentMaintenance,
          equipment: recentEquipment,
        },
      };
    }),

  // Get predictive maintenance alerts
  getPredictiveMaintenance: publicProcedure
    .query(async () => {
      // Get equipment that needs maintenance soon (within 30 days)
      const equipmentNeedingMaintenance = await prisma.equipment.findMany({
        where: {
          OR: [
            {
              maintenanceRecords: {
                some: {
                  scheduledDate: {
                    gte: new Date(),
                    lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                  },
                  status: { in: ["SCHEDULED", "IN_PROGRESS"] },
                },
              },
            },
            {
              status: "MAINTENANCE",
            },
          ],
        },
        include: {
          category: true,
          maintenanceRecords: {
            where: {
              status: { in: ["SCHEDULED", "IN_PROGRESS"] },
            },
            orderBy: { scheduledDate: "asc" },
            take: 1,
          },
        },
        take: 10,
      });

      const predictiveAlerts = equipmentNeedingMaintenance.map((equipment) => {
        const nextMaintenance = equipment.maintenanceRecords[0];
        const daysUntilMaintenance = nextMaintenance?.scheduledDate 
          ? Math.ceil((new Date(nextMaintenance.scheduledDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          : 0;

        return {
          id: equipment.id,
          equipmentName: equipment.name,
          equipmentCode: equipment.code,
          maintenanceType: nextMaintenance?.maintenanceType ?? "PREVENTIVE",
          predictedDate: nextMaintenance?.scheduledDate?.toISOString().split('T')[0] ?? new Date().toISOString().split('T')[0],
          confidence: Math.max(85, 100 - daysUntilMaintenance * 2), // Higher confidence for closer dates
          priority: daysUntilMaintenance <= 7 ? "HIGH" : daysUntilMaintenance <= 14 ? "MEDIUM" : "LOW",
          estimatedCost: nextMaintenance?.estimatedCost ?? 1000,
        };
      });

      return predictiveAlerts;
    }),
});
