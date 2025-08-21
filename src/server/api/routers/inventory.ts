import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "@/server/db";

// Input validation schemas
const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  code: z.string().min(1, "Product code is required"),
  description: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  costPrice: z.number().min(0, "Cost price must be positive"),
  imageUrl: z.string().url().optional(),
  minStockLevel: z.number().min(0, "Min stock level must be positive"),
  maxStockLevel: z.number().min(0).optional(),
  unitOfMeasure: z.string().default("PCS"),
  categoryId: z.string().min(1, "Category is required"),
  isService: z.boolean().default(false),
});

const _updateProductSchema = createProductSchema.partial();

const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  code: z.string().min(1, "Category code is required"),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

const createWarehouseSchema = z.object({
  name: z.string().min(1, "Warehouse name is required"),
  code: z.string().min(1, "Warehouse code is required"),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

const inventoryTransactionSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  warehouseId: z.string().min(1, "Warehouse is required"),
  quantity: z.number().min(1, "Quantity must be positive"),
  transactionType: z.enum(["IN", "OUT", "ADJUSTMENT", "TRANSFER"]),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

// GRN (Goods Received Note) Schema
const createGRNSchema = z.object({
  purchaseOrderId: z.string().min(1, "Purchase Order is required"),
  warehouseId: z.string().min(1, "Warehouse is required"),
  receiptDate: z.date(),
  items: z.array(z.object({
    productId: z.string().min(1, "Product is required"),
    quantityReceived: z.number().min(1, "Quantity must be positive"),
    quantityAccepted: z.number().min(0, "Quantity accepted must be positive"),
    quantityRejected: z.number().min(0, "Quantity rejected must be positive"),
    unitCost: z.number().min(0, "Unit cost must be positive"),
    notes: z.string().optional(),
  })),
  qualityCheckStatus: z.enum(["PENDING", "PASSED", "FAILED"]).default("PENDING"),
  notes: z.string().optional(),
});

// GI (Goods Issue) Schema
const createGISchema = z.object({
  warehouseId: z.string().min(1, "Warehouse is required"),
  issueDate: z.date(),
  items: z.array(z.object({
    productId: z.string().min(1, "Product is required"),
    quantity: z.number().min(1, "Quantity must be positive"),
    referenceType: z.string().optional(), // "MAINTENANCE", "SALES", "TRANSFER", etc.
    referenceId: z.string().optional(),
    notes: z.string().optional(),
  })),
  notes: z.string().optional(),
});

export const inventoryRouter = createTRPCRouter({
  // ========================================
  // PRODUCT MANAGEMENT
  // ========================================

  // Get all products with pagination and filters
  getProducts: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      search: z.string().optional(),
      categoryId: z.string().optional(),
      isActive: z.boolean().optional(),
    }).optional().default({}))
    .query(async ({ input }) => {
      const _skip = (input.page - 1) * input.limit;

      const where = {
        ...(input.search && {
          OR: [
            { name: { contains: input.search, mode: "insensitive" as const } },
            { code: { contains: input.search, mode: "insensitive" as const } },
            { sku: { contains: input.search, mode: "insensitive" as const } },
          ],
        }),
        ...(input.categoryId && { categoryId: input.categoryId }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      };

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            category: true,
            inventoryItems: {
              include: {
                warehouse: true,
              },
            },
          },
          skip: _skip,
          take: input.limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.product.count({ where }),
      ]);

      return {
        success: true,
        data: products,
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          totalPages: Math.ceil(total / input.limit),
        },
      };
    }),

  // Get product by ID
  getProductById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const product = await prisma.product.findUnique({
        where: { id: input.id },
        include: {
          category: true,
          inventoryItems: {
            include: {
              warehouse: true,
            },
          },
        },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      return { success: true, data: product };
    }),

  // Create new product
  createProduct: protectedProcedure
    .input(createProductSchema)
    .mutation(async ({ input }) => {
      const product = await prisma.product.create({
        data: {
          ...input,
          price: Math.round(input.price * 100), // Convert to cents
          costPrice: Math.round(input.costPrice * 100), // Convert to cents
        },
        include: {
          category: true,
        },
      });

      return { success: true, data: product };
    }),

  // Update product
  updateProduct: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: _updateProductSchema,
    }))
    .mutation(async ({ input }) => {
      const _updateData = { ...input.data };
      
      // Convert prices to cents if provided
      if (_updateData.price !== undefined) {
        _updateData.price = Math.round(_updateData.price * 100);
      }
      if (_updateData.costPrice !== undefined) {
        _updateData.costPrice = Math.round(_updateData.costPrice * 100);
      }

      const product = await prisma.product.update({
        where: { id: input.id },
        data: _updateData,
        include: {
          category: true,
        },
      });

      return { success: true, data: product };
    }),

  // Delete product
  deleteProduct: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.product.delete({
        where: { id: input.id },
      });

      return { success: true, message: "Product deleted successfully" };
    }),

  // ========================================
  // CATEGORY MANAGEMENT
  // ========================================

  // Get all categories
  getCategories: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(50),
      search: z.string().optional(),
      parentId: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const _skip = (input.page - 1) * input.limit;

      const where = {
        ...(input.search && {
          OR: [
            { name: { contains: input.search, mode: "insensitive" as const } },
            { code: { contains: input.search, mode: "insensitive" as const } },
          ],
        }),
        ...(input.parentId && { parentId: input.parentId }),
      };

      const [categories, total] = await Promise.all([
        prisma.category.findMany({
          where,
          include: {
            parent: true,
            children: true,
            _count: {
              select: { products: true },
            },
          },
          skip: _skip,
          take: input.limit,
          orderBy: { name: "asc" },
        }),
        prisma.category.count({ where }),
      ]);

      return {
        success: true,
        data: categories,
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          totalPages: Math.ceil(total / input.limit),
        },
      };
    }),

  // Create category
  createCategory: protectedProcedure
    .input(createCategorySchema)
    .mutation(async ({ input }) => {
      const category = await prisma.category.create({
        data: input,
        include: {
          parent: true,
          children: true,
        },
      });

      return { success: true, data: category };
    }),

  // ========================================
  // WAREHOUSE MANAGEMENT
  // ========================================

  // Get all warehouses
  getWarehouses: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(50),
      search: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const _skip = (input.page - 1) * input.limit;

      const where = {
        ...(input.search && {
          OR: [
            { name: { contains: input.search, mode: "insensitive" as const } },
            { code: { contains: input.search, mode: "insensitive" as const } },
          ],
        }),
      };

      const [warehouses, total] = await Promise.all([
        prisma.warehouse.findMany({
          where,
          include: {
            _count: {
              select: { inventoryItems: true },
            },
          },
          skip: _skip,
          take: input.limit,
          orderBy: { name: "asc" },
        }),
        prisma.warehouse.count({ where }),
      ]);

      return {
        success: true,
        data: warehouses,
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          totalPages: Math.ceil(total / input.limit),
        },
      };
    }),

  // Create warehouse
  createWarehouse: protectedProcedure
    .input(createWarehouseSchema)
    .mutation(async ({ input }) => {
      const warehouse = await prisma.warehouse.create({
        data: input,
      });

      return { success: true, data: warehouse };
    }),

  // ========================================
  // INVENTORY TRANSACTIONS
  // ========================================

  // Get inventory transactions
  getInventoryTransactions: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      productId: z.string().optional(),
      warehouseId: z.string().optional(),
      transactionType: z.enum(["IN", "OUT", "ADJUSTMENT", "TRANSFER"]).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const _skip = (input.page - 1) * input.limit;

      const where = {
        ...(input.productId && { productId: input.productId }),
        ...(input.warehouseId && { warehouseId: input.warehouseId }),
        ...(input.transactionType && { transactionType: input.transactionType }),
        ...(input.startDate && input.endDate && {
          createdAt: {
            gte: new Date(input.startDate),
            lte: new Date(input.endDate),
          },
        }),
      };

      const [transactions, total] = await Promise.all([
        prisma.inventoryTransaction.findMany({
          where,
          include: {
            product: { select: { name: true, sku: true } },
            warehouse: { select: { name: true } },
            user: { select: { firstName: true, lastName: true } },
          },
          skip: _skip,
          take: input.limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.inventoryTransaction.count({ where }),
      ]);

      return {
        success: true,
        data: transactions,
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          totalPages: Math.ceil(total / input.limit),
        },
      };
    }),

  // ========================================
  // GRN (GOODS RECEIVED NOTE) MANAGEMENT
  // ========================================

  // Create GRN (Goods Received Note)
  createGRN: protectedProcedure
    .input(createGRNSchema)
    .mutation(async ({ input, ctx }) => {
      const _userId = ctx.user.id;
      
      const result = await prisma.$transaction(async (tx) => {
        // Create GRN record
        const grn = await tx.inventoryTransaction.create({
          data: {
            productId: input.items[0]?.productId ?? "", // For now, using first item
            warehouseId: input.warehouseId,
            userId: _userId,
            transactionType: "IN",
            quantity: input.items.reduce((sum, item) => sum + item.quantityAccepted, 0),
            referenceType: "GRN",
            referenceId: `GRN-${Date.now()}`,
            notes: `GRN from PO: ${input.purchaseOrderId}. ${input.notes ?? ""}`,
          },
          include: {
            product: { select: { name: true, sku: true } },
            warehouse: { select: { name: true } },
          },
        });

        // Update inventory for each item
        for (const item of input.items) {
          const inventoryItem = await tx.inventoryItem.findUnique({
            where: {
              productId_warehouseId: {
                productId: item.productId,
                warehouseId: input.warehouseId,
              },
            },
          });

          if (inventoryItem) {
            await tx.inventoryItem.update({
              where: { id: inventoryItem.id },
              data: {
                quantity: inventoryItem.quantity + item.quantityAccepted,
                availableQuantity: (inventoryItem.quantity + item.quantityAccepted) - inventoryItem.reservedQuantity,
              },
            });
          } else {
            await tx.inventoryItem.create({
              data: {
                productId: item.productId,
                warehouseId: input.warehouseId,
                quantity: item.quantityAccepted,
                availableQuantity: item.quantityAccepted,
              },
            });
          }
        }

        return grn;
      });

      return { success: true, data: result };
    }),

  // Get GRN history
  getGRNHistory: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      warehouseId: z.string().optional(),
      dateRange: z.object({
        start: z.date(),
        end: z.date(),
      }).optional(),
    }))
    .query(async ({ input }) => {
      const _skip = (input.page - 1) * input.limit;

      const where = {
        transactionType: "IN" as const,
        referenceType: "GRN",
        ...(input.warehouseId && { warehouseId: input.warehouseId }),
        ...(input.dateRange && {
          createdAt: {
            gte: input.dateRange.start,
            lte: input.dateRange.end,
          },
        }),
      };

      const [transactions, total] = await Promise.all([
        prisma.inventoryTransaction.findMany({
          where,
          include: {
            product: { select: { name: true, sku: true } },
            warehouse: { select: { name: true } },
            user: { select: { firstName: true, lastName: true } },
          },
          skip: _skip,
          take: input.limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.inventoryTransaction.count({ where }),
      ]);

      return {
        success: true,
        data: transactions,
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          totalPages: Math.ceil(total / input.limit),
        },
      };
    }),

  // ========================================
  // GI (GOODS ISSUE) MANAGEMENT
  // ========================================

  // Create GI (Goods Issue)
  createGI: protectedProcedure
    .input(createGISchema)
    .mutation(async ({ input, ctx }) => {
      const _userId = ctx.user.id;
      
      const result = await prisma.$transaction(async (tx) => {
        const _transactions = [];

        // Create GI transactions for each item
        for (const item of input.items) {
          // Check stock availability
          const inventoryItem = await tx.inventoryItem.findUnique({
            where: {
              productId_warehouseId: {
                productId: item.productId,
                warehouseId: input.warehouseId,
              },
            },
          });

          if (!inventoryItem || inventoryItem.availableQuantity < item.quantity) {
            throw new Error(`Insufficient stock for product ${item.productId}`);
          }

          // Create GI transaction
          const giTransaction = await tx.inventoryTransaction.create({
            data: {
              productId: item.productId,
              warehouseId: input.warehouseId,
              userId: _userId,
              transactionType: "OUT",
              quantity: item.quantity,
              referenceType: item.referenceType ?? "GI",
              referenceId: item.referenceId ?? `GI-${Date.now()}`,
              notes: item.notes ?? `Goods Issue. ${input.notes ?? ""}`,
            },
            include: {
              product: { select: { name: true, sku: true } },
              warehouse: { select: { name: true } },
            },
          });

          // Update inventory
          await tx.inventoryItem.update({
            where: { id: inventoryItem.id },
            data: {
              quantity: inventoryItem.quantity - item.quantity,
              availableQuantity: (inventoryItem.quantity - item.quantity) - inventoryItem.reservedQuantity,
            },
          });

          _transactions.push(giTransaction);
        }

        return _transactions;
      });

      return { success: true, data: result };
    }),

  // Get GI history
  getGIHistory: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      warehouseId: z.string().optional(),
      referenceType: z.string().optional(),
      dateRange: z.object({
        start: z.date(),
        end: z.date(),
      }).optional(),
    }))
    .query(async ({ input }) => {
      const _skip = (input.page - 1) * input.limit;

      const where = {
        transactionType: "OUT" as const,
        ...(input.warehouseId && { warehouseId: input.warehouseId }),
        ...(input.referenceType && { referenceType: input.referenceType }),
        ...(input.dateRange && {
          createdAt: {
            gte: input.dateRange.start,
            lte: input.dateRange.end,
          },
        }),
      };

      const [transactions, total] = await Promise.all([
        prisma.inventoryTransaction.findMany({
          where,
          include: {
            product: { select: { name: true, sku: true } },
            warehouse: { select: { name: true } },
            user: { select: { firstName: true, lastName: true } },
          },
          skip: _skip,
          take: input.limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.inventoryTransaction.count({ where }),
      ]);

      return {
        success: true,
        data: transactions,
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          totalPages: Math.ceil(total / input.limit),
        },
      };
    }),

  // ========================================
  // INVENTORY TRANSACTIONS
  // ========================================

  // Create inventory transaction
  createInventoryTransaction: protectedProcedure
    .input(inventoryTransactionSchema)
    .mutation(async ({ input, ctx }) => {
      const _userId = ctx.user.id;
      
      const transaction = await prisma.inventoryTransaction.create({
        data: {
          ...input,
          userId: _userId,
        },
        include: {
          product: { select: { name: true, sku: true } },
          warehouse: { select: { name: true } },
        },
      });

      // Update inventory item
      const inventoryItem = await prisma.inventoryItem.findUnique({
        where: {
          productId_warehouseId: {
            productId: input.productId,
            warehouseId: input.warehouseId,
          },
        },
      });

      if (inventoryItem) {
        let newQuantity = inventoryItem.quantity;
        if (input.transactionType === "IN") {
          newQuantity += input.quantity;
        } else if (input.transactionType === "OUT") {
          newQuantity -= input.quantity;
        } else if (input.transactionType === "ADJUSTMENT") {
          newQuantity = input.quantity;
        }

        await prisma.inventoryItem.update({
          where: { id: inventoryItem.id },
          data: {
            quantity: newQuantity,
            availableQuantity: newQuantity - inventoryItem.reservedQuantity,
          },
        });
      } else if (input.transactionType === "IN") {
        // Create new inventory item for first IN transaction
        await prisma.inventoryItem.create({
          data: {
            productId: input.productId,
            warehouseId: input.warehouseId,
            quantity: input.quantity,
            availableQuantity: input.quantity,
          },
        });
      }

      return { success: true, data: transaction };
    }),

  // ========================================
  // DASHBOARD & ANALYTICS
  // ========================================

  // Get inventory dashboard data
  getDashboardData: publicProcedure
    .query(async () => {
      const [
        totalProducts,
        totalCategories,
        totalWarehouses,
        lowStockItems,
        recentTransactions,
        topProducts,
      ] = await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.warehouse.count(),
        prisma.inventoryItem.count({
          where: {
            quantity: { lte: 10 }, // Low stock threshold
          },
        }),
        prisma.inventoryTransaction.findMany({
          take: 10,
          include: {
            product: { select: { name: true, sku: true } },
            warehouse: { select: { name: true } },
            user: { select: { firstName: true, lastName: true } },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.inventoryItem.findMany({
          take: 10,
          include: {
            product: { select: { name: true, sku: true } },
            warehouse: { select: { name: true } },
          },
          orderBy: { quantity: "desc" },
        }),
      ]);

      return {
        success: true,
        data: {
          totalProducts,
          totalCategories,
          totalWarehouses,
          lowStockItems,
          recentTransactions,
          topProducts,
        },
      };
    }),

  // Get stock movement analytics
  getStockMovementAnalytics: publicProcedure
    .input(z.object({
      days: z.number().default(30),
      productId: z.string().optional(),
      warehouseId: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const _startDate = new Date();
      _startDate.setDate(_startDate.getDate() - input.days);

      const where = {
        createdAt: { gte: _startDate },
        ...(input.productId && { productId: input.productId }),
        ...(input.warehouseId && { warehouseId: input.warehouseId }),
      };

      const transactions = await prisma.inventoryTransaction.findMany({
        where,
        include: {
          product: { select: { name: true } },
          warehouse: { select: { name: true } },
        },
        orderBy: { createdAt: "asc" },
      });

      // Group by date and transaction type
      const dailyData = transactions.reduce((acc: Record<string, unknown>, transaction) => {
        const _date = transaction.createdAt.toISOString().split('T')[0];
        if (_date) {
          acc[_date] = acc[_date] ?? { date: _date, IN: 0, OUT: 0, ADJUSTMENT: 0, TRANSFER: 0 };
          if (transaction.transactionType) {
            (acc[_date] as Record<string, unknown>)[transaction.transactionType] = 
              ((acc[_date] as Record<string, unknown>)[transaction.transactionType] as number ?? 0) + transaction.quantity;
          }
        }
        return acc;
      }, {});

      return {
        success: true,
        data: {
          dailyData: Object.values(dailyData),
          totalTransactions: transactions.length,
        },
      };
    }),
});
