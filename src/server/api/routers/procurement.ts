// src/server/api/routers/procurement.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { InventoryTransactionType, AssetType, DepreciationMethod, ProcurementSourceType } from "@prisma/client";
import type { PurchaseOrderStatus } from "@prisma/client";
import { prisma } from "@/server/db";

// Enhanced input validation schemas with JDE compliance
const createPurchaseRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  requiredDate: z.date(),
  estimatedBudget: z.number().min(0, "Budget must be positive"),
  department: z.string().optional(),
  costCenter: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().min(1, "Product is required"),
    quantity: z.number().min(1, "Quantity must be positive"),
    unitPrice: z.number().min(0, "Unit price must be positive").optional(),
    specifications: z.string().optional(),
    urgency: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
  })),
});

const createPurchaseOrderSchema = z.object({
  supplierId: z.string().min(1, "Supplier is required"),
  purchaseRequestId: z.string().optional(), // Link to purchase request
  orderDate: z.date(),
  expectedDelivery: z.date(),
  paymentTerms: z.string().optional(),
  deliveryTerms: z.string().optional(),
  currency: z.string().default("USD"),
  exchangeRate: z.number().min(0).default(1),
  items: z.array(z.object({
    productId: z.string().min(1, "Product is required"),
    quantity: z.number().min(1, "Quantity must be positive"),
    unitPrice: z.number().min(0, "Unit price must be positive"),
    isAsset: z.boolean().default(false),
    specifications: z.string().optional(),
  })),
  notes: z.string().optional(),
});

const createGoodsReceiptSchema = z.object({
  purchaseOrderId: z.string().min(1, "Purchase Order is required"),
  warehouseId: z.string().min(1, "Warehouse is required"),
  receiptDate: z.date(),
  qualityCheckStatus: z.enum(["PENDING", "PASSED", "FAILED", "IN_PROGRESS"]).default("PENDING"),
  gpsCoordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  items: z.array(z.object({
    purchaseOrderItemId: z.string().min(1, "Purchase Order Item is required"),
    productId: z.string().min(1, "Product is required"),
    quantityReceived: z.number().min(1, "Quantity received must be positive"),
    quantityAccepted: z.number().min(0, "Quantity accepted must be positive"),
    quantityRejected: z.number().min(0, "Quantity rejected must be positive"),
    unitCost: z.number().min(0, "Unit cost must be positive"),
  })),
  notes: z.string().optional(),
});

export const procurementRouter = createTRPCRouter({
  // ========================================
  // DASHBOARD DATA
  // ========================================

  getDashboardData: publicProcedure
    .query(async () => {
      try {
        // Get counts with JDE-style metrics - more specific and accurate
        const [
          activePurchaseRequestsCount, // Only count active PRs (not processed)
          activePurchaseOrdersCount,   // Only count active POs
          goodsReceiptsCount,
          suppliersCount,
          totalSpend,
          pendingPRApprovals,
          pendingPOApprovals,
          rejectedPRsCount,            // Count rejected PRs
          rejectedPOsCount,            // Count rejected POs
          totalPurchaseRequestsCount   // Total count for reference
        ] = await Promise.all([
          // Count PRs that don't have Purchase Orders yet
          prisma.purchaseRequest.count({
            where: {
              // Exclude PRs that have associated Purchase Orders
              NOT: {
                purchaseOrders: {
                  some: {}
                }
              }
            }
          }),
          // Count active POs (excluding completed/cancelled)
          prisma.purchaseOrder.count({
            where: { 
              status: { 
                in: ["DRAFT", "SUBMITTED", "APPROVED", "ORDERED", "PARTIALLY_RECEIVED"] 
              } 
            }
          }),
          prisma.goodsReceipt.count(),
          prisma.supplier.count({ where: { isActive: true } }),
          prisma.purchaseOrder.aggregate({
            _sum: { grandTotal: true },
            where: { status: { in: ["APPROVED", "ORDERED", "PARTIALLY_RECEIVED", "RECEIVED"] } }
          }),
          // Pending approvals - PRs waiting for approval
          prisma.purchaseRequest.count({ 
            where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } } 
          }),
          // Pending approvals - POs waiting for approval
          prisma.purchaseOrder.count({ 
            where: { status: "SUBMITTED" } 
          }),
          // Rejected PRs count
          prisma.purchaseRequest.count({ 
            where: { status: "REJECTED" } 
          }),
          // Rejected POs count
          prisma.purchaseOrder.count({ 
            where: { status: "REJECTED" as PurchaseOrderStatus } 
          }),
          // Total PR count for comparison
          prisma.purchaseRequest.count()
        ]);

        // Get recent Purchase Orders first
        const recentPurchaseOrders = await prisma.purchaseOrder.findMany({
          take: 5,
          where: {
            status: { 
              in: ["DRAFT", "SUBMITTED", "APPROVED", "ORDERED", "PARTIALLY_RECEIVED"] 
            }
          },
          orderBy: { orderDate: 'desc' },
          include: {
            supplier: true,
            items: {
              include: {
                product: true,
              },
            },
          },
        });

        // Get recent activities - PRs that don't have Purchase Orders yet
        const recentPurchaseRequests = await prisma.purchaseRequest.findMany({
          take: 10, // Get more to filter out ones with POs
          orderBy: { requestDate: 'desc' },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });

        // Filter out PRs that already have Purchase Orders
        const prsWithoutPOs = recentPurchaseRequests.filter(pr => {
          // Check if this PR has any associated Purchase Orders
          return !recentPurchaseOrders.some(po => po.purchaseRequestId === pr.id);
        }).slice(0, 5); // Take only first 5 after filtering

        // Get supplier performance metrics (JDE-style)
        const supplierPerformance = await prisma.supplier.findMany({
          take: 5,
          orderBy: { name: 'asc' },
          select: {
            id: true,
            name: true,
            code: true,
            contactPerson: true,
            email: true,
            phone: true,
            isActive: true,
            _count: {
              select: {
                purchaseOrders: true
              }
            }
          },
        });

        // Calculate month-over-month changes for better insights
        const currentMonth = new Date();
        const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        const thisMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

        const [
          thisMonthPRCount,
          lastMonthPRCount,
          thisMonthPOCount,
          lastMonthPOCount,
          thisMonthSpend,
          lastMonthSpend
        ] = await Promise.all([
          prisma.purchaseRequest.count({
            where: { 
              requestDate: { gte: thisMonthStart }
            }
          }),
          prisma.purchaseRequest.count({
            where: { 
              requestDate: { gte: lastMonth, lt: thisMonthStart }
            }
          }),
          prisma.purchaseOrder.count({
            where: { 
              orderDate: { gte: thisMonthStart },
              status: { in: ["DRAFT", "SUBMITTED", "APPROVED", "ORDERED", "PARTIALLY_RECEIVED"] }
            }
          }),
          prisma.purchaseOrder.count({
            where: { 
              orderDate: { gte: lastMonth, lt: thisMonthStart },
              status: { in: ["DRAFT", "SUBMITTED", "APPROVED", "ORDERED", "PARTIALLY_RECEIVED"] }
            }
          }),
          prisma.purchaseOrder.aggregate({
            _sum: { grandTotal: true },
            where: { 
              orderDate: { gte: thisMonthStart },
              status: { in: ["APPROVED", "ORDERED", "PARTIALLY_RECEIVED", "RECEIVED"] }
            }
          }),
          prisma.purchaseOrder.aggregate({
            _sum: { grandTotal: true },
            where: { 
              orderDate: { gte: lastMonth, lt: thisMonthStart },
              status: { in: ["APPROVED", "ORDERED", "PARTIALLY_RECEIVED", "RECEIVED"] }
            }
          })
        ]);

        // Calculate percentage changes
        const prChange = lastMonthPRCount > 0 ? Math.round(((thisMonthPRCount - lastMonthPRCount) / lastMonthPRCount) * 100) : 0;
        const poChange = lastMonthPOCount > 0 ? Math.round(((thisMonthPOCount - lastMonthPOCount) / lastMonthPOCount) * 100) : 0;
        const lastMonthSpendValue = Number(lastMonthSpend._sum?.grandTotal ?? 0);
        const thisMonthSpendValue = Number(thisMonthSpend._sum?.grandTotal ?? 0);
        const spendChange = lastMonthSpendValue > 0 ? 
          Math.round(((thisMonthSpendValue - lastMonthSpendValue) / lastMonthSpendValue) * 100) : 0;

        // Ensure all values are properly converted to numbers and handle null/undefined
        const totalSpendValue = totalSpend._sum?.grandTotal ? Number(totalSpend._sum.grandTotal) : 0;

        return {
          stats: {
            purchaseRequests: activePurchaseRequestsCount ?? 0,     // Active PRs only
            purchaseOrders: activePurchaseOrdersCount ?? 0,         // Active POs only
            goodsReceipts: goodsReceiptsCount ?? 0,
            suppliers: suppliersCount ?? 0,                         // Active suppliers only
            totalSpend: totalSpendValue,                            // Ensure it's 0 after reset
            pendingPRApprovals: pendingPRApprovals ?? 0,            // PRs waiting for approval
            pendingPOApprovals: pendingPOApprovals ?? 0,            // POs waiting for approval
            pendingApprovals: (pendingPRApprovals ?? 0) + (pendingPOApprovals ?? 0), // Total pending approvals
            rejectedPRs: rejectedPRsCount ?? 0,                     // Rejected PRs count
            rejectedPOs: rejectedPOsCount ?? 0,                     // Rejected POs count
            totalPurchaseRequests: totalPurchaseRequestsCount ?? 0, // Total for reference
            // Month-over-month changes
            prChangePercent: prChange ?? 0,
            poChangePercent: poChange ?? 0,
            spendChangePercent: spendChange ?? 0,
            thisMonthPRs: thisMonthPRCount ?? 0,
            thisMonthPOs: thisMonthPOCount ?? 0,
            thisMonthSpend: thisMonthSpendValue                     // Ensure it's 0 after reset
          },
          recentPurchaseRequests: prsWithoutPOs || [],
          recentPurchaseOrders: recentPurchaseOrders || [],
          supplierPerformance: supplierPerformance || [],
        };
      } catch {
        throw new Error('Failed to fetch procurement dashboard data');
      }
    }),

  // ========================================
  // PURCHASE REQUESTS (JDE Implementation)
  // ========================================

  getPurchaseRequests: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      status: z.enum(["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "CANCELLED"]).optional(),
      priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
      department: z.string().optional(),
    }).optional().default({}))
    .query(async ({ input }) => {
      try {
        const skip = (input.page - 1) * input.limit;

        const where = {
          ...(input.status && { status: input.status }),
          ...(input.priority && { priority: input.priority }),
          ...(input.department && { department: { contains: input.department } }),
        };

        const [purchaseRequests, total] = await Promise.all([
          prisma.purchaseRequest.findMany({
            where,
            skip,
            take: input.limit,
            orderBy: { requestDate: 'desc' },
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          }),
          prisma.purchaseRequest.count({ where }),
        ]);

        return {
          data: purchaseRequests,
          pagination: {
            page: input.page,
            limit: input.limit,
            total,
            totalPages: Math.ceil(total / input.limit),
          },
        };
      } catch {
        throw new Error('Failed to fetch purchase requests');
      }
    }),

  createPurchaseRequest: protectedProcedure
    .input(createPurchaseRequestSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // First, validate that all products exist or create them if they don't exist
        const productIds = input.items.map(item => item.productId);
        const existingProducts = await prisma.product.findMany({
          where: { id: { in: productIds } }
        });

        // Create missing products with default data
        const existingIds = existingProducts.map(p => p.id);
        const missingIds = productIds.filter(id => !existingIds.includes(id));
        
        if (missingIds.length > 0) {
          // First, ensure we have a default category
          const defaultCategory = await prisma.category.upsert({
            where: { code: 'GEN' },
            update: {},
            create: {
              name: 'General',
              code: 'GEN',
              description: 'General category for auto-generated products'
            }
          });

          // Create missing products with correct field names
          for (const id of missingIds) {
            await prisma.product.upsert({
              where: { id: id },
              update: {},
              create: {
                id: id,
                name: `Product ${id}`,
                code: `PROD-${id}`,
                description: `Auto-generated product for ${id}`,
                sku: `SKU-${id}`,
                price: 0,
                costPrice: 0,
                minStockLevel: 0,
                maxStockLevel: 1000,
                currentStock: 0,
                unitOfMeasure: 'PCS',
                categoryId: defaultCategory.id,
                isActive: true,
                createdBy: ctx.user.id
              }
            });
          }
        }

        // Create purchase request with validated products
        const purchaseRequest = await prisma.purchaseRequest.create({
          data: {
            ...input,
            prNumber: `PR-${Date.now()}`,
            requestedBy: ctx.user.id,
            createdBy: ctx.user.id,
            items: {
              create: input.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.unitPrice ? item.quantity * item.unitPrice : null,
                specifications: item.specifications,
                urgency: item.urgency,
              })),
            },
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });

        return purchaseRequest;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('Failed to create purchase request');
      }
    }),

  updatePurchaseRequest: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: createPurchaseRequestSchema.partial(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const purchaseRequest = await prisma.purchaseRequest.update({
          where: { id: input.id },
          data: {
            title: input.data.title,
            description: input.data.description,
            priority: input.data.priority,
            requiredDate: input.data.requiredDate,
            estimatedBudget: input.data.estimatedBudget,
            department: input.data.department,
            costCenter: input.data.costCenter,
            updatedBy: ctx.user.id,
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });

        return purchaseRequest;
      } catch {
        throw new Error('Failed to update purchase request');
      }
    }),

  approvePurchaseRequest: protectedProcedure
    .input(z.object({
      id: z.string(),
      approvedBy: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        const purchaseRequest = await prisma.purchaseRequest.update({
          where: { id: input.id },
          data: {
            status: "APPROVED",
            approvedBy: input.approvedBy,
          },
        });

        return purchaseRequest;
      } catch {
        throw new Error('Failed to approve purchase request');
      }
    }),

  submitPurchaseRequest: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        const purchaseRequest = await prisma.purchaseRequest.update({
          where: { id: input.id },
          data: {
            status: "SUBMITTED",
          },
        });

        return purchaseRequest;
      } catch {
        throw new Error('Failed to submit purchase request');
      }
    }),

  // ========================================
  // PURCHASE ORDERS (Enhanced)
  // ========================================

  getPurchaseOrders: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      status: z.enum(["DRAFT", "SUBMITTED", "APPROVED", "ORDERED", "PARTIALLY_RECEIVED", "RECEIVED", "CANCELLED"]).optional(),
      supplier: z.string().optional(),
      purchaseRequestId: z.string().optional(),
    }).optional().default({}))
    .query(async ({ input }) => {
      try {
        const skip = (input.page - 1) * input.limit;

        const where = {
          ...(input.status && { status: input.status }),
          ...(input.supplier && { supplier: { name: { contains: input.supplier } } }),
          ...(input.purchaseRequestId && { purchaseRequestId: input.purchaseRequestId }),
        };

        const [purchaseOrders, total] = await Promise.all([
          prisma.purchaseOrder.findMany({
            where,
            skip,
            take: input.limit,
            orderBy: { orderDate: 'desc' },
            include: {
              supplier: true,
              purchaseRequest: true,
              items: {
                include: {
                  product: true,
                },
              },
            },
          }),
          prisma.purchaseOrder.count({ where }),
        ]);

        return {
          data: purchaseOrders,
          pagination: {
            page: input.page,
            limit: input.limit,
            total,
            totalPages: Math.ceil(total / input.limit),
          },
        };
      } catch {
        throw new Error('Failed to fetch purchase orders');
      }
    }),

  createPurchaseOrder: publicProcedure
    .input(createPurchaseOrderSchema)
    .mutation(async ({ input }) => {
      try {

        
        // Create the purchase order
        const purchaseOrder = await prisma.purchaseOrder.create({
          data: {
            ...input,
            poNumber: `PO-${Date.now()}`,
            status: 'DRAFT',
            grandTotal: input.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
            createdBy: 'system', // Temporary for testing
            items: {
              create: input.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.quantity * item.unitPrice,
                isAsset: item.isAsset,
                specifications: item.specifications,
              })),
            },
          },
          include: {
            supplier: true,
            purchaseRequest: true,
            items: {
              include: {
                product: true,
              },
            },
          },
        });

        // Update the related purchase request status to "APPROVED" when PO is created
        if (input.purchaseRequestId) {
          await prisma.purchaseRequest.update({
            where: { id: input.purchaseRequestId },
            data: { status: 'APPROVED' }
          });
        }

        return purchaseOrder;
      } catch (error) {
        throw new Error(`Failed to create purchase order: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  updatePurchaseOrder: publicProcedure
    .input(z.object({
      id: z.string().min(1, "Purchase Order ID is required"),
      supplierId: z.string().min(1, "Supplier is required"),
      purchaseRequestId: z.string().optional(),
      orderDate: z.date(),
      expectedDelivery: z.date(),
      paymentTerms: z.string().optional(),
      deliveryTerms: z.string().optional(),
      currency: z.string().default("USD"),
      exchangeRate: z.number().min(0).default(1),
      items: z.array(z.object({
        productId: z.string().min(1, "Product is required"),
        quantity: z.number().min(1, "Quantity must be positive"),
        unitPrice: z.number().min(0, "Unit price must be positive"),
        isAsset: z.boolean().default(false),
        specifications: z.string().optional(),
      })),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {

        
        // Get current PO to check status
        const currentPO = await prisma.purchaseOrder.findUnique({
          where: { id: input.id },
          select: { status: true }
        });

        // Determine new status based on current status and workflow
        let newStatus = currentPO?.status ?? 'DRAFT';
        if (currentPO?.status === 'DRAFT') {
          newStatus = 'SUBMITTED'; // Move to next step in workflow
        } else if (currentPO?.status === 'SUBMITTED') {
          newStatus = 'APPROVED'; // Move to next step in workflow
        } else if (currentPO?.status === 'APPROVED') {
          newStatus = 'ORDERED'; // Send to Supplier - Move to next step in workflow
        }
        // Keep current status if already ORDERED or further

        // Update the purchase order
        const purchaseOrder = await prisma.purchaseOrder.update({
          where: { id: input.id },
          data: {
            supplierId: input.supplierId,
            purchaseRequestId: input.purchaseRequestId,
            orderDate: input.orderDate,
            expectedDelivery: input.expectedDelivery,
            paymentTerms: input.paymentTerms,
            deliveryTerms: input.deliveryTerms,
            currency: input.currency,
            exchangeRate: input.exchangeRate,
            notes: input.notes,
            status: newStatus, // Update status according to workflow
            grandTotal: input.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
            // Update items by deleting existing and creating new ones
            items: {
              deleteMany: {}, // Delete all existing items
              create: input.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.quantity * item.unitPrice,
                isAsset: item.isAsset,
                specifications: item.specifications,
              })),
            },
          },
          include: {
            supplier: true,
            purchaseRequest: true,
            items: {
              include: {
                product: true,
              },
            },
          },
        });

        return purchaseOrder;
      } catch (error) {
        throw new Error(`Failed to update purchase order: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  // Reject Purchase Order
  rejectPurchaseOrder: publicProcedure
    .input(z.object({
      id: z.string().min(1, "Purchase Order ID is required"),
      rejectionReason: z.string().min(1, "Rejection reason is required"),
    }))
    .mutation(async ({ input }) => {
      try {

        
        const purchaseOrder = await prisma.purchaseOrder.update({
          where: { id: input.id },
          data: {
            status: 'REJECTED' as PurchaseOrderStatus,
            rejectedBy: 'system', // In real app, this would be ctx.user.id
            rejectedDate: new Date(),
            rejectionReason: input.rejectionReason,
          },
          include: {
            supplier: true,
            purchaseRequest: true,
            items: {
              include: {
                product: true,
              },
            },
          },
        });

        return purchaseOrder;
      } catch (error) {
        throw new Error(`Failed to reject purchase order: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  // ========================================
  // GOODS RECEIPTS
  // ========================================

  getGoodsReceipts: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      qualityCheckStatus: z.enum(["PENDING", "PASSED", "FAILED", "IN_PROGRESS"]).optional(),
      warehouse: z.string().optional(),
    }).optional().default({}))
    .query(async ({ input }) => {
      try {
        const skip = (input.page - 1) * input.limit;

        const where = {
          ...(input.qualityCheckStatus && { qualityCheckStatus: input.qualityCheckStatus }),
          ...(input.warehouse && { warehouse: { name: { contains: input.warehouse } } }),
        };

        const [goodsReceipts, total] = await Promise.all([
          prisma.goodsReceipt.findMany({
            where,
            skip,
            take: input.limit,
            orderBy: { receiptDate: 'desc' },
            include: {
              purchaseOrder: {
                include: {
                  supplier: true,
                },
              },
              warehouse: true,
              items: {
                include: {
                  product: true,
                },
              },
            },
          }),
          prisma.goodsReceipt.count({ where }),
        ]);

        return {
          data: goodsReceipts,
          pagination: {
            page: input.page,
            limit: input.limit,
            total,
            totalPages: Math.ceil(total / input.limit),
          },
        };
      } catch {
        throw new Error('Failed to fetch goods receipts');
      }
    }),

  createGoodsReceipt: protectedProcedure
    .input(createGoodsReceiptSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await prisma.$transaction(async (tx) => {
          const goodsReceipt = await tx.goodsReceipt.create({
          data: {
            ...input,
            grNumber: `GR-${Date.now()}`,
            createdBy: ctx.user.id,
            items: {
                create: input.items.map((item) => ({
                  purchaseOrderItemId: item.purchaseOrderItemId,
                  productId: item.productId,
                  quantityReceived: item.quantityReceived,
                  quantityAccepted: item.quantityAccepted,
                  quantityRejected: item.quantityRejected,
                  unitCost: item.unitCost,
                  totalCost: Math.round(item.quantityReceived * item.unitCost),
              })),
            },
          },
          include: {
            purchaseOrder: {
              include: {
                supplier: true,
              },
            },
            warehouse: true,
            items: {
              include: {
                product: true,
                  purchaseOrderItem: true,
              },
            },
          },
        });

          // Update inventory and PO item receipt quantities
          for (const item of input.items) {
            // Upsert inventory item per product & warehouse
            await tx.inventoryItem.upsert({
              where: {
                productId_warehouseId: {
                  productId: item.productId,
                  warehouseId: input.warehouseId,
                },
              },
              create: {
                productId: item.productId,
                warehouseId: input.warehouseId,
                quantity: item.quantityAccepted,
                availableQuantity: item.quantityAccepted,
                reservedQuantity: 0,
              },
              update: {
                quantity: { increment: item.quantityAccepted },
                availableQuantity: { increment: item.quantityAccepted },
              },
            });

            // Create inventory transaction (IN)
            await tx.inventoryTransaction.create({
              data: {
                productId: item.productId,
                warehouseId: input.warehouseId,
                userId: ctx.user.id,
                transactionType: InventoryTransactionType.IN,
                quantity: item.quantityAccepted,
                referenceType: "GoodsReceipt",
                referenceId: goodsReceipt.id,
                notes: `GR ${goodsReceipt.grNumber}`,
              },
            });

            // Update received quantity on PO item
            await tx.purchaseOrderItem.update({
              where: { id: item.purchaseOrderItemId },
              data: { receivedQuantity: { increment: item.quantityAccepted } },
            });

            // If PO item is flagged as asset, create minimal Asset records
            const poItem = await tx.purchaseOrderItem.findUnique({
              where: { id: item.purchaseOrderItemId },
              include: { product: true },
            });
            if (poItem?.isAsset && item.quantityAccepted > 0) {
              for (let i = 0; i < item.quantityAccepted; i += 1) {
                await tx.asset.create({
                  data: {
                    assetNumber: `AS-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                    name: poItem.product.name,
                    description: `Auto-created from GR ${goodsReceipt.grNumber}`,
                    assetType: AssetType.TOOLS,
                    categoryId: poItem.product.categoryId,
                    purchaseCost: Math.round(item.unitCost),
                    currentValue: Math.round(item.unitCost),
                    depreciationRate: 0,
                    salvageValue: 0,
                    usefulLife: 60,
                    depreciationMethod: DepreciationMethod.STRAIGHT_LINE,
                    acquisitionDate: new Date(),
                    goodsReceiptId: goodsReceipt.id,
                    sourceDocument: goodsReceipt.grNumber,
                    sourceType: ProcurementSourceType.PROCUREMENT,
                    createdBy: ctx.user.id,
                  },
                });
              }
            }
          }

          // Update Purchase Order status based on receipt progress
          const po = await tx.purchaseOrder.findUnique({
            where: { id: input.purchaseOrderId },
            include: { items: true },
          });
          if (po) {
            const allReceived = po.items.every((it) => it.receivedQuantity >= it.quantity);
            const anyReceived = po.items.some((it) => it.receivedQuantity > 0);
            await tx.purchaseOrder.update({
              where: { id: po.id },
              data: {
                status: allReceived ? "RECEIVED" : anyReceived ? "PARTIALLY_RECEIVED" : po.status,
              },
            });
          }

        return goodsReceipt;
        });

        return result;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error creating goods receipt:', error);
        throw new Error('Failed to create goods receipt');
      }
    }),

  // ========================================
  // PRODUCTS
  // ========================================

  getNextSku: publicProcedure
    .mutation(async () => {
      try {
        // Get the last product with NGS- prefix
        const lastProduct = await prisma.product.findFirst({
          orderBy: { sku: 'desc' },
          where: { sku: { startsWith: 'NGS-' } }
        });

        let nextSkuNumber = 1;
        if (lastProduct && lastProduct.sku) {
          const lastNumber = parseInt(lastProduct.sku.replace('NGS-', ''));
          if (!isNaN(lastNumber)) {
            nextSkuNumber = lastNumber + 1;
          }
        }

        const nextSku = `NGS-${nextSkuNumber.toString().padStart(3, '0')}`;
        return nextSku;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error getting next SKU:', error);
        return 'NGS-001';
      }
    }),

  getNextSupplierCode: publicProcedure
    .mutation(async () => {
      try {
        // Get the last supplier with NGSP- prefix
        const lastSupplier = await prisma.supplier.findFirst({
          orderBy: { code: 'desc' },
          where: { code: { startsWith: 'NGSP-' } }
        });

        let nextCodeNumber = 1;
        if (lastSupplier && lastSupplier.code) {
          const lastNumber = parseInt(lastSupplier.code.replace('NGSP-', ''));
          if (!isNaN(lastNumber)) {
            nextCodeNumber = lastNumber + 1;
          }
        }

        const nextCode = `NGSP-${nextCodeNumber.toString().padStart(3, '0')}`;
        return nextCode;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error getting next supplier code:', error);
        return 'NGSP-001';
      }
    }),

  getProducts: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(50),
      search: z.string().optional(),
      category: z.string().optional(),
    }).optional().default({}))
    .query(async ({ input }) => {
      try {
        const skip = (input.page - 1) * input.limit;

        const where = {
          isActive: true,
          ...(input.search && { 
            OR: [
              { name: { contains: input.search } },
              { code: { contains: input.search } },
              { sku: { contains: input.search } },
            ]
          }),
          ...(input.category && { categoryId: input.category }),
        };

        const [products, total] = await Promise.all([
          prisma.product.findMany({
            where,
            skip,
            take: input.limit,
            orderBy: { name: 'asc' },
            include: {
              category: true,
            },
          }),
          prisma.product.count({ where }),
        ]);

        return {
          data: products,
          pagination: {
            page: input.page,
            limit: input.limit,
            total,
            totalPages: Math.ceil(total / input.limit),
          },
        };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products');
      }
    }),



  createSupplier: publicProcedure
    .input(z.object({
      name: z.string().min(1, "Supplier name is required"),
      code: z.string().min(1, "Supplier code is required"),
      email: z.string().email("Invalid email format").optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      contactPerson: z.string().optional(),
      taxNumber: z.string().optional(),
      paymentTerms: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Check if supplier code already exists
        const existingSupplier = await prisma.supplier.findFirst({
          where: { code: input.code }
        });

        if (existingSupplier) {
          throw new Error('Supplier code already exists');
        }

        const supplier = await prisma.supplier.create({
          data: {
            ...input,
            isActive: true,
          },
        });

        return supplier;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error creating supplier:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to create supplier');
      }
    }),

  createProduct: protectedProcedure
    .input(z.object({
      name: z.string().min(1, "Product name is required"),
      code: z.string().min(1, "Product code is required"),
      description: z.string().optional(),
      categoryId: z.string().optional(),
      price: z.number().min(0, "Price must be positive"),
      costPrice: z.number().min(0, "Cost price must be positive"),
      minStockLevel: z.number().min(0, "Min stock level must be positive"),
      maxStockLevel: z.number().min(0, "Max stock level must be positive"),
      unitOfMeasure: z.string().default("PCS"),
      isService: z.boolean().default(false),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        // First, ensure we have a default category if none provided
        let categoryId = input.categoryId;
        if (!categoryId) {
          const defaultCategory = await prisma.category.upsert({
            where: { code: 'GEN' },
            update: {},
            create: {
              name: 'General',
              code: 'GEN',
              description: 'General category for products'
            }
          });
          categoryId = defaultCategory.id;
        }

        // Get the next SKU number
        const lastProduct = await prisma.product.findFirst({
          orderBy: { sku: 'desc' },
          where: { sku: { startsWith: 'NGS-' } }
        });

        let nextSkuNumber = 1;
        if (lastProduct && lastProduct.sku) {
          const lastNumber = parseInt(lastProduct.sku.replace('NGS-', ''));
          if (!isNaN(lastNumber)) {
            nextSkuNumber = lastNumber + 1;
          }
        }

        const sku = `NGS-${nextSkuNumber.toString().padStart(3, '0')}`;

        // Create the product
        const product = await prisma.product.create({
          data: {
            ...input,
            sku,
            categoryId,
            createdBy: ctx.user.id,
          },
          include: {
            category: true,
          },
        });

        return product;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error creating product:', error);
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('Failed to create product');
      }
    }),

  // ========================================
  // SUPPLIER MANAGEMENT (final, unified)
  // ========================================

  getSuppliers: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      search: z.string().optional(),
    }).optional().default({}))
    .query(async ({ input }) => {
      try {
        const skip = (input.page - 1) * input.limit;

        const where = {
          ...(input?.search && {
            OR: [
              { name: { contains: input.search } },
              { code: { contains: input.search } },
            ],
          }),
        };

        const [suppliers, total] = await Promise.all([
          prisma.supplier.findMany({
            where,
            skip,
            take: input.limit,
            orderBy: { name: 'asc' },
            include: {
              // hanya PO berstatus ORDERED untuk ditampilkan di card
              purchaseOrders: {
                where: { status: 'ORDERED' },
                orderBy: { orderDate: 'desc' },
                include: {
                  items: {
                    include: { product: true },
                  },
                },
              },
              _count: {
                select: {
                  purchaseOrders: { where: { status: 'ORDERED' } },
                },
              },
            },
          }),
          prisma.supplier.count({ where }),
        ]);

        return {
          data: suppliers,
          pagination: {
            page: input.page,
            limit: input.limit,
            total,
            totalPages: Math.ceil(total / input.limit),
          },
        };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching suppliers:', error);
        throw new Error('Failed to fetch suppliers');
      }
    }),

  // ========================================
  // WORKFLOW SUMMARY
  // ========================================

  getWorkflowSummary: publicProcedure
    .query(async () => {
      try {
        const [
          totalPOs,
          pendingReceipts,
          assetsCreated,
          totalValue,
        ] = await Promise.all([
          prisma.purchaseOrder.count(),
          prisma.goodsReceipt.count({ where: { qualityCheckStatus: 'PENDING' } }),
          prisma.purchaseOrderItem.count({ where: { isAsset: true } }),
          prisma.purchaseOrder.aggregate({
            _sum: { grandTotal: true },
          }),
        ]);

        return {
          totalPOs,
          pendingReceipts,
          assetsCreated,
          totalValue: totalValue._sum.grandTotal ?? 0,
        };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching workflow summary:', error);
        throw new Error('Failed to fetch workflow summary');
      }
    }),

  // ========================================
  // INTEGRATION FLOW TRACKING
  // ========================================

  getIntegrationFlow: publicProcedure
    .input(z.object({
      purchaseOrderId: z.string().optional(),
      goodsReceiptId: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        if (input.purchaseOrderId) {
          const po = await prisma.purchaseOrder.findUnique({
            where: { id: input.purchaseOrderId },
            include: {
              supplier: true,
              purchaseRequest: true,
              items: {
                include: {
                  product: true,
                  asset: true,
                },
              },
              goodsReceipts: {
                include: {
                  items: {
                    include: {
                      product: true,
                    },
                  },
                },
              },
            },
          });

          if (!po) {
            throw new Error('Purchase Order not found');
          }

          // Get related inventory transactions
          const inventoryTransactions = await prisma.inventoryTransaction.findMany({
            where: {
              referenceType: 'GoodsReceipt',
              referenceId: { in: po.goodsReceipts.map(gr => gr.id) },
            },
            include: {
              product: true,
              warehouse: true,
            },
          });

          // Get related assets
          const assets = await prisma.asset.findMany({
            where: {
              goodsReceiptId: { in: po.goodsReceipts.map(gr => gr.id) },
            },
          });

          return {
            purchaseOrder: po,
            inventoryTransactions,
            assets,
            flowStatus: {
              poStatus: po.status,
              totalItems: po.items.length,
              receivedItems: po.items.filter(item => item.receivedQuantity > 0).length,
              assetsCreated: assets.length,
              inventoryUpdated: inventoryTransactions.length,
            },
          };
        }

        if (input.goodsReceiptId) {
          const gr = await prisma.goodsReceipt.findUnique({
            where: { id: input.goodsReceiptId },
            include: {
              purchaseOrder: {
                include: {
                  supplier: true,
                  items: true,
                },
              },
              warehouse: true,
              items: {
                include: {
                  product: true,
                  purchaseOrderItem: true,
                },
              },
              assets: true,
            },
          });

          if (!gr) {
            throw new Error('Goods Receipt not found');
          }

          // Get related inventory transactions
          const inventoryTransactions = await prisma.inventoryTransaction.findMany({
            where: {
              referenceType: 'GoodsReceipt',
              referenceId: gr.id,
            },
            include: {
              product: true,
              warehouse: true,
            },
          });

          return {
            goodsReceipt: gr,
            inventoryTransactions,
            flowStatus: {
              grStatus: gr.qualityCheckStatus,
              totalItems: gr.items.length,
              acceptedItems: gr.items.filter(item => item.quantityAccepted > 0).length,
              assetsCreated: gr.assets.length,
              inventoryUpdated: inventoryTransactions.length,
            },
          };
        }

        throw new Error('Either purchaseOrderId or goodsReceiptId must be provided');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching integration flow:', error);
        throw new Error('Failed to fetch integration flow');
      }
    }),
});
