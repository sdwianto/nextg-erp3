import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "@/server/db";

export const salesRouter = createTRPCRouter({
  // Get all orders with pagination and filtering,
  getOrders: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      status: z.enum(["DRAFT", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]).optional(),
      customerId: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }).optional().default({}))
    .query(async ({ input }) => {
      const { page, limit, status, customerId, startDate, endDate } = input;
      const _skip = (page - 1) * limit;

      const where: Record<string, unknown> = {};
      if (status) where.status = status;
      if (customerId) where.customerId = customerId;
      if (startDate ?? endDate) {
        where.createdAt = {};
        if (startDate) (where.createdAt as Record<string, unknown>).gte = new Date(startDate);
        if (endDate) (where.createdAt as Record<string, unknown>).lte = new Date(endDate);
      }

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: {
            customer: true,
            orderItems: {
              include: {
                product: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip: _skip,
          take: limit,
        }),
        prisma.order.count({ where }),
      ]);

      return {
        orders,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }),

  // Get single order by ID,
  getOrderById: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await prisma.order.findUnique({
        where: { id: input },
        include: {
          customer: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });
    }),

  // Create new order,
  createOrder: protectedProcedure
    .input(z.object({
      customerId: z.string(),
      orderItems: z.array(z.object({
        productId: z.string(),
        quantity: z.number().positive(),
        unitPrice: z.number().positive(),
      })),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { customerId, orderItems, notes } = input;

      // Calculate totals
      const subtotal = orderItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      const tax = subtotal * 0.1; // 10% tax
      const grandTotal = subtotal + tax;

      // Create order with items,
  const order = await prisma.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}`,
          customerId,
          orderDate: new Date(),
          subtotal,
          tax,
          grandTotal,
          status: "DRAFT",
          notes,
          createdBy: ctx.user.id,
          orderItems: {
            create: orderItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.quantity * item.unitPrice,
            })),
          },
        },
        include: {
          customer: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      // Update product stock,
  for (const item of orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            currentStock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    }),

  // Update order status,
  updateOrderStatus: protectedProcedure
    .input(z.object({
      orderId: z.string(),
      status: z.enum(["DRAFT", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]),
    }))
    .mutation(async ({ input }) => {
      return await prisma.order.update({
        where: { id: input.orderId },
        data: { status: input.status },
        include: {
          customer: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });
    }),

  // Get sales dashboard data,
  getDashboardData: publicProcedure
    .query(async () => {
      const [
        totalOrders,
        totalRevenue,
        pendingOrders,
        deliveredOrders,
        monthlyRevenue,
        topProducts,
        recentOrders,
      ] = await Promise.all([
        // Total orders,
  prisma.order.count(),
        
        // Total revenue,
  prisma.order.aggregate({
          where: { status: "DELIVERED" },
          _sum: { grandTotal: true },
        }),
        
        // Pending orders,
  prisma.order.count({
          where: { status: { in: ["DRAFT", "CONFIRMED", "PROCESSING"] } },
        }),
        
        // Delivered orders,
  prisma.order.count({
          where: { status: "DELIVERED" },
        }),
        
        // Monthly revenue (last 6 months) - simplified for now,
  Promise.resolve([]),
        
        // Top selling products,
  prisma.orderItem.groupBy({
          by: ["productId"],
          _sum: { quantity: true, totalPrice: true },
          orderBy: { _sum: { quantity: "desc" } },
          take: 5,
        }),
        
        // Recent orders,
  prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            customer: true,
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        }),
      ]);

      // Get product details for top products,
  const topProductsWithDetails = await Promise.all(
        topProducts.map(async (item) => {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
          });
          return {
            product,
            totalQuantity: item._sum.quantity ?? 0,
            totalRevenue: item._sum.totalPrice ?? 0,
          };
        })
      );

      return {
        summary: {
          totalOrders,
          totalRevenue: totalRevenue._sum.grandTotal ?? 0,
          pendingOrders,
          deliveredOrders,
          conversionRate: totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0,
        },
        monthlyRevenue: monthlyRevenue,
        topProducts: topProductsWithDetails,
        recentOrders,
      };
    }),

  // Get customers for sales,
  getCustomers: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      search: z.string().optional(),
    }).optional().default({}))
    .query(async ({ input }) => {
      const { page, limit, search } = input;
      const _skip = (page - 1) * limit;

      const where: Record<string, unknown> = {};
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ];
      }

      const [customers, total] = await Promise.all([
        prisma.customer.findMany({
          where,
          include: {
            _count: {
              select: { orders: true },
            },
          },
          orderBy: { createdAt: "desc" },
          skip: _skip,
          take: limit,
        }),
        prisma.customer.count({ where }),
      ]);

      return {
        customers,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }),

  // Get products for sales,
  getProductsForSales: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      search: z.string().optional(),
      categoryId: z.string().optional(),
      inStock: z.boolean().optional(),
    }).optional().default({}))
    .query(async ({ input }) => {
      const { page, limit, search, categoryId, inStock } = input;
      const _skip = (page - 1) * limit;

      const where: Record<string, unknown> = {};
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
        ];
      }
      if (categoryId) where.categoryId = categoryId;
      if (inStock !== undefined) {
        if (inStock) {
          where.currentStock = { gt: 0 };
        } else {
          where.currentStock = { lte: 0 };
        }
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            category: true,
          },
          orderBy: { name: "asc" },
          skip: _skip,
          take: limit,
        }),
        prisma.product.count({ where }),
      ]);

      return {
        products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }),
});
