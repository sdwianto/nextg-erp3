/* eslint-disable @typescript-eslint/no-explicit-any */
 
 
 
 
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "@/server/db";

// Input validation schemas
const createOperationSchema = z.object({
  name: z.string().min(1, "Operation name is required"),
  code: z.string().min(1, "Operation code is required"),
  type: z.enum(["MINING", "PROCESSING", "LOGISTICS", "MAINTENANCE", "SAFETY", "ENVIRONMENTAL"]),
  description: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).default("ACTIVE"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  estimatedDuration: z.number().optional(),
  actualDuration: z.number().optional(),
  budget: z.number().optional(),
  actualCost: z.number().optional(),
  manager: z.string().optional(),
  team: z.array(z.string()).optional(),
  equipment: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  risks: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

const createTaskSchema = z.object({
  operationId: z.string().min(1, "Operation is required"),
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  type: z.enum(["DAILY", "WEEKLY", "MONTHLY", "SPECIAL", "EMERGENCY"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED", "ON_HOLD"]).default("PENDING"),
  assignedTo: z.string().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  completedDate: z.string().optional(),
  estimatedHours: z.number().optional(),
  actualHours: z.number().optional(),
  dependencies: z.array(z.string()).optional(),
  checklist: z.array(z.object({
    item: z.string(),
    completed: z.boolean().default(false),
  })).optional(),
  notes: z.string().optional(),
});

const createPerformanceMetricSchema = z.object({
  operationId: z.string().min(1, "Operation is required"),
  metricType: z.enum(["PRODUCTION", "EFFICIENCY", "SAFETY", "QUALITY", "COST", "TIME"]),
  name: z.string().min(1, "Metric name is required"),
  value: z.number(),
  unit: z.string().optional(),
  target: z.number().optional(),
  date: z.string().min(1, "Date is required"),
  period: z.enum(["HOURLY", "DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"]).default("DAILY"),
  notes: z.string().optional(),
});

const createIncidentSchema = z.object({
  operationId: z.string().min(1, "Operation is required"),
  title: z.string().min(1, "Incident title is required"),
  description: z.string().optional(),
  type: z.enum(["SAFETY", "ENVIRONMENTAL", "EQUIPMENT", "PROCESS", "SECURITY", "OTHER"]),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  status: z.enum(["REPORTED", "INVESTIGATING", "RESOLVING", "RESOLVED", "CLOSED"]).default("REPORTED"),
  reportedBy: z.string().optional(),
  reportedDate: z.string().min(1, "Reported date is required"),
  location: z.string().optional(),
  affectedEquipment: z.array(z.string()).optional(),
  affectedPersonnel: z.array(z.string()).optional(),
  immediateActions: z.string().optional(),
  rootCause: z.string().optional(),
  correctiveActions: z.string().optional(),
  preventiveActions: z.string().optional(),
  investigationDate: z.string().optional(),
  resolvedDate: z.string().optional(),
  notes: z.string().optional(),
});

export const operationsRouter = createTRPCRouter({
  // Get all operations
  getOperations: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      search: z.string().optional(),
      status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
      type: z.enum(["MINING", "PROCESSING", "LOGISTICS", "MAINTENANCE", "SAFETY", "ENVIRONMENTAL"]).optional(),
      priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
    }))
    .query(async ({ input }) => {
      const { page, limit, search, status, type, priority } = input;
      const _skip = (page - 1) * limit;

      const where = {
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" as any } },
            { code: { contains: search, mode: "insensitive" as any } },
            { description: { contains: search, mode: "insensitive" as any } },
          ],
        }),
        ...(status && { status }),
        ...(type && { type }),
        ...(priority && { priority }),
      };

      const [operations, total] = await Promise.all([
        prisma.operation.findMany({
          where,
          include: {
            tasks: {
              where: { status: { in: ["PENDING", "IN_PROGRESS"] } },
              take: 5,
              orderBy: { dueDate: "asc" },
            },
            performanceMetrics: {
              take: 10,
              orderBy: { date: "desc" },
            },
            incidents: {
              where: { status: { in: ["REPORTED", "INVESTIGATING", "RESOLVING"] } },
              take: 5,
              orderBy: { reportedDate: "desc" },
            },
            _count: {
              select: {
                tasks: true,
                performanceMetrics: true,
                incidents: true,
              },
            },
          },
          skip: _skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.operation.count({ where }),
      ]);

      return {
        operations,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  // Get operations dashboard data
  getDashboardData: publicProcedure
    .query(async () => {
      const [
        totalOperations,
        activeOperations,
        completedTasks,
        pendingTasks,
        criticalIncidents,
        resolvedIncidents,
        totalMetrics,
      ] = await Promise.all([
        prisma.operation.count(),
        prisma.operation.count({ where: { status: "ACTIVE" } }),
        prisma.task.count({ where: { status: "COMPLETED" } }),
        prisma.task.count({ where: { status: { in: ["PENDING", "IN_PROGRESS"] } } }),
        prisma.incident.count({ where: { severity: "CRITICAL", status: { in: ["REPORTED", "INVESTIGATING", "RESOLVING"] } } }),
        prisma.incident.count({ where: { status: "RESOLVED" } }),
        prisma.performanceMetric.count(),
      ]);

      // Get recent activities
      const recentTasks = await prisma.task.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          operation: { select: { name: true, code: true } },
        },
      });

      const recentIncidents = await prisma.incident.findMany({
        take: 5,
        orderBy: { reportedDate: "desc" },
        include: {
          operation: { select: { name: true, code: true } },
        },
      });

      // Get performance trends
      const performanceTrends = await prisma.performanceMetric.findMany({
        take: 10,
        orderBy: { date: "desc" },
        include: {
          operation: { select: { name: true, code: true } },
        },
      });

      return {
        summary: {
          totalOperations,
          activeOperations,
          completedTasks,
          pendingTasks,
          criticalIncidents,
          resolvedIncidents,
          totalMetrics,
        },
        recentActivities: {
          tasks: recentTasks,
          incidents: recentIncidents,
        },
        performanceTrends,
      };
    }),

  // Get single operation
  getOperation: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;

      const operation = await prisma.operation.findUnique({
        where: { id },
        include: {
          tasks: {
            orderBy: { dueDate: "asc" },
          },
          performanceMetrics: {
            orderBy: { date: "desc" },
          },
          incidents: {
            orderBy: { reportedDate: "desc" },
          },
        },
      });

      if (!operation) {
        throw new Error("Operation not found");
      }

      return operation;
    }),

  // Create operation
  createOperation: protectedProcedure
    .input(createOperationSchema)
    .mutation(async ({ input, ctx }) => {
      // Check if operation code already exists
      const existingOperation = await prisma.operation.findFirst({
        where: { code: input.code },
      });

      if (existingOperation) {
        throw new Error("Operation with this code already exists");
      }

      const operation = await prisma.operation.create({
        data: {
          ...input,
          startDate: input.startDate ? new Date(input.startDate) : null,
          endDate: input.endDate ? new Date(input.endDate) : null,
          createdBy: ctx.user.id,
        },
      });

      // Log audit trail
      await prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: "CREATE",
          entityType: "Operation",
          entityId: operation.id,
          newValues: JSON.parse(JSON.stringify({
            ...operation,
            actualCost: operation.actualCost ? Number(operation.actualCost) : null,
            budget: operation.budget ? Number(operation.budget) : null,
          })),
        },
      });

      return operation;
    }),

  // Update operation
  updateOperation: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: createOperationSchema.partial(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, data } = input;

      const existingOperation = await prisma.operation.findUnique({
        where: { id },
      });

      if (!existingOperation) {
        throw new Error("Operation not found");
      }

      const operation = await prisma.operation.update({
        where: { id },
        data: {
          ...data,
          startDate: data.startDate ? new Date(data.startDate) : undefined,
          endDate: data.endDate ? new Date(data.endDate) : undefined,
          updatedBy: ctx.user.id,
        },
      });

      // Log audit trail
      await prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: "UPDATE",
          entityType: "Operation",
          entityId: operation.id,
          oldValues: JSON.parse(JSON.stringify({
            ...existingOperation,
            actualCost: existingOperation.actualCost ? Number(existingOperation.actualCost) : null,
            budget: existingOperation.budget ? Number(existingOperation.budget) : null,
          })),
          newValues: JSON.parse(JSON.stringify({
            ...operation,
            actualCost: operation.actualCost ? Number(operation.actualCost) : null,
            budget: operation.budget ? Number(operation.budget) : null,
          })),
        },
      });

      return operation;
    }),

  // Get all tasks
  getTasks: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED", "ON_HOLD"]).optional(),
      priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
      type: z.enum(["DAILY", "WEEKLY", "MONTHLY", "SPECIAL", "EMERGENCY"]).optional(),
      assignedTo: z.string().optional(),
      operationId: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const { page, limit, status, priority, type, assignedTo, operationId } = input;
      const skip = (page - 1) * limit;

      const where = {
        ...(status && { status }),
        ...(priority && { priority }),
        ...(type && { type }),
        ...(assignedTo && { assignedTo }),
        ...(operationId && { operationId }),
      };

      const [tasks, total] = await Promise.all([
        prisma.task.findMany({
          where,
          include: {
            operation: {
              select: { name: true, code: true },
            },
          },
          skip,
          take: limit,
          orderBy: { dueDate: "asc" },
        }),
        prisma.task.count({ where }),
      ]);

      return {
        tasks,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  // Create task
  createTask: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ input, ctx }) => {
      const operation = await prisma.operation.findUnique({
        where: { id: input.operationId },
      });

      if (!operation) {
        throw new Error("Operation not found");
      }

      const task = await prisma.task.create({
        data: {
          ...input,
          startDate: input.startDate ? new Date(input.startDate) : null,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
          completedDate: input.completedDate ? new Date(input.completedDate) : null,
          createdBy: ctx.user.id,
        },
        include: {
          operation: {
            select: { name: true, code: true },
          },
        },
      });

      // Log audit trail
      await prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: "CREATE",
          entityType: "Task",
          entityId: task.id,
          newValues: task,
        },
      });

      return task;
    }),

  // Update task status
  updateTaskStatus: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED", "ON_HOLD"]),
      actualHours: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, status, actualHours } = input;

      const task = await prisma.task.findUnique({
        where: { id },
      });

      if (!task) {
        throw new Error("Task not found");
      }

      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          status,
          actualHours,
          completedDate: status === "COMPLETED" ? new Date() : null,
          updatedBy: ctx.user.id,
        },
        include: {
          operation: {
            select: { name: true, code: true },
          },
        },
      });

      // Log audit trail
      await prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: "UPDATE",
          entityType: "Task",
          entityId: task.id,
          oldValues: task,
          newValues: updatedTask,
        },
      });

      return updatedTask;
    }),

  // Get performance metrics
  getMetrics: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      operationId: z.string().optional(),
      metricType: z.enum(["PRODUCTION", "EFFICIENCY", "SAFETY", "QUALITY", "COST", "TIME"]).optional(),
      period: z.enum(["HOURLY", "DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"]).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const { page, limit, operationId, metricType, period, startDate, endDate } = input;
      const skip = (page - 1) * limit;

      const where = {
        ...(operationId && { operationId }),
        ...(metricType && { metricType }),
        ...(period && { period }),
        ...(startDate && endDate && {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
      };

      const [metrics, total] = await Promise.all([
        prisma.performanceMetric.findMany({
          where,
          include: {
            operation: {
              select: { name: true, code: true },
            },
          },
          skip,
          take: limit,
          orderBy: { date: "desc" },
        }),
        prisma.performanceMetric.count({ where }),
      ]);

      return {
        metrics,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  // Create performance metric
  createMetric: protectedProcedure
    .input(createPerformanceMetricSchema)
    .mutation(async ({ input, ctx }) => {
      const operation = await prisma.operation.findUnique({
        where: { id: input.operationId },
      });

      if (!operation) {
        throw new Error("Operation not found");
      }

      const metric = await prisma.performanceMetric.create({
        data: {
          ...input,
          date: new Date(input.date),
          createdBy: ctx.user.id,
        },
        include: {
          operation: {
            select: { name: true, code: true },
          },
        },
      });

      // Log audit trail
      await prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: "CREATE",
          entityType: "PerformanceMetric",
          entityId: metric.id,
          newValues: metric,
        },
      });

      return metric;
    }),

  // Get all incidents
  getIncidents: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      status: z.enum(["REPORTED", "INVESTIGATING", "RESOLVING", "RESOLVED", "CLOSED"]).optional(),
      severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
      type: z.enum(["SAFETY", "ENVIRONMENTAL", "EQUIPMENT", "PROCESS", "SECURITY", "OTHER"]).optional(),
      operationId: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const { page, limit, status, severity, type, operationId } = input;
      const skip = (page - 1) * limit;

      const where = {
        ...(status && { status }),
        ...(severity && { severity }),
        ...(type && { type }),
        ...(operationId && { operationId }),
      };

      const [incidents, total] = await Promise.all([
        prisma.incident.findMany({
          where,
          include: {
            operation: {
              select: { name: true, code: true },
            },
          },
          skip,
          take: limit,
          orderBy: { reportedDate: "desc" },
        }),
        prisma.incident.count({ where }),
      ]);

      return {
        incidents,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  // Create incident
  createIncident: protectedProcedure
    .input(createIncidentSchema)
    .mutation(async ({ input, ctx }) => {
      const operation = await prisma.operation.findUnique({
        where: { id: input.operationId },
      });

      if (!operation) {
        throw new Error("Operation not found");
      }

      const incident = await prisma.incident.create({
        data: {
          ...input,
          reportedDate: new Date(input.reportedDate),
          investigationDate: input.investigationDate ? new Date(input.investigationDate) : null,
          resolvedDate: input.resolvedDate ? new Date(input.resolvedDate) : null,
          createdBy: ctx.user.id,
        },
        include: {
          operation: {
            select: { name: true, code: true },
          },
        },
      });

      // Log audit trail
      await prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: "CREATE",
          entityType: "Incident",
          entityId: incident.id,
          newValues: incident,
        },
      });

      return incident;
    }),

  // Update incident status
  updateIncidentStatus: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(["REPORTED", "INVESTIGATING", "RESOLVING", "RESOLVED", "CLOSED"]),
      rootCause: z.string().optional(),
      correctiveActions: z.string().optional(),
      preventiveActions: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, status, rootCause, correctiveActions, preventiveActions } = input;

      const incident = await prisma.incident.findUnique({
        where: { id },
      });

      if (!incident) {
        throw new Error("Incident not found");
      }

      const updatedIncident = await prisma.incident.update({
        where: { id },
        data: {
          status,
          rootCause,
          correctiveActions,
          preventiveActions,
          resolvedDate: status === "RESOLVED" ? new Date() : null,
          updatedBy: ctx.user.id,
        },
        include: {
          operation: {
            select: { name: true, code: true },
          },
        },
      });

      // Log audit trail
      await prisma.auditLog.create({
        data: {
          userId: ctx.user.id,
          action: "UPDATE",
          entityType: "Incident",
          entityId: incident.id,
          oldValues: incident,
          newValues: updatedIncident,
        },
      });

      return updatedIncident;
    }),
});
