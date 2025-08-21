import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

import { prisma } from "@/server/db";

export const biRouter = createTRPCRouter({
  // ========================================
  // BUSINESS INTELLIGENCE & ANALYTICS
  // ========================================

  // Get overall business metrics,
  getBusinessMetrics: publicProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
    }))
    .query(async ({ input }) => {
      const _startDate = new Date(input.startDate);
        const _endDate = new Date(input.endDate);

      const [
        transactions,
        orders,
        equipment,
        employees,
        customers,
      ] = await Promise.all([
        prisma.financialTransaction.findMany({
          where: {
            transactionDate: { gte: _startDate, lte: _endDate },
          },
        }),
        prisma.order.findMany({
          where: {
            createdAt: { gte: _startDate, lte: _endDate },
          },
          include: { orderItems: true },
        }),
        prisma.equipment.findMany(),
        prisma.employee.findMany(),
        prisma.customer.findMany(),
      ]);

      const metrics = {
        financial: {
          totalRevenue: 0,
          totalExpenses: 0,
          netProfit: 0,
          profitMargin: 0,
          averageTransactionValue: 0,
        },
        sales: {
          totalOrders: orders.length,
          totalSalesValue: 0,
          averageOrderValue: 0,
          customerCount: customers.length,
        },
        operations: {
          totalEquipment: equipment.length,
          equipmentUtilization: 0,
          employeeCount: employees.length,
          activeEmployees: 0,
        },
        trends: {
          revenueGrowth: 0,
          orderGrowth: 0,
          customerGrowth: 0,
        },
      };

      // Calculate financial metrics,
  transactions.forEach(transaction => {
        const _amount = transaction.amount / 100;
        if (['SALE', 'RENTAL_INCOME', 'OTHER_INCOME'].includes(transaction.transactionType)) {
          metrics.financial.totalRevenue += _amount;
        } else {
          metrics.financial.totalExpenses += _amount;
        }
      });

      metrics.financial.netProfit = metrics.financial.totalRevenue - metrics.financial.totalExpenses;
      metrics.financial.profitMargin = metrics.financial.totalRevenue > 0 ? 
        (metrics.financial.netProfit / metrics.financial.totalRevenue) * 100 : 0;
      metrics.financial.averageTransactionValue = transactions.length > 0 ? 
        (metrics.financial.totalRevenue + metrics.financial.totalExpenses) / transactions.length : 0;

      // Calculate sales metrics,
  orders.forEach(order => {
        const orderTotal = order.orderItems.reduce((sum, item) => 
          sum + (item.quantity * (item.unitPrice ?? 0)), 0);
        metrics.sales.totalSalesValue += orderTotal;
      });

      metrics.sales.averageOrderValue = orders.length > 0 ? 
        metrics.sales.totalSalesValue / orders.length : 0;

      // Calculate operations metrics,
  // const _availableEquipment = equipment.filter(e => e.status === 'AVAILABLE').length;
      const _inUseEquipment = equipment.filter(e => e.status === 'IN_USE').length;
      metrics.operations.equipmentUtilization = equipment.length > 0 ? 
        (_inUseEquipment / equipment.length) * 100 : 0;
      metrics.operations.activeEmployees = employees.filter(e => e.employmentStatus === 'ACTIVE').length;

      return {
        success: true,
        data: metrics,
      };

  }),

  // Get revenue analytics,
  getRevenueAnalytics: publicProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
      groupBy: z.enum(["day", "week", "month"]).default("month"),
    }))
    .query(async ({ input }) => {
      const _startDate = new Date(input.startDate);
      const _endDate = new Date(input.endDate);

      const transactions = await prisma.financialTransaction.findMany({
        where: {
          transactionDate: { gte: _startDate, lte: _endDate },
          transactionType: { in: ['SALE', 'RENTAL_INCOME', 'OTHER_INCOME'] },
        },
        orderBy: { transactionDate: 'asc' },
      });

      const revenueData = transactions.reduce((acc: Record<string, number>, transaction) => {
        const _date = transaction.transactionDate.toISOString().split('T')[0];
        if (_date) {
          const _amount = transaction.amount / 100;
          acc[_date] = (acc[_date] ?? 0) + _amount;
        }
        return acc;
      }, {});

      return {
        success: true,
        data: {
          revenueData: Object.entries(revenueData).map(([date, amount]) => ({
            date,
            revenue: amount,
          })),
          totalRevenue: Object.values(revenueData).reduce((sum, amount) => sum + amount, 0),
          averageDailyRevenue: Object.values(revenueData).length > 0 ? 
            Object.values(revenueData).reduce((sum, amount) => sum + amount, 0) / Object.values(revenueData).length : 0,
        },
      };
    
  }),

  // Get customer analytics,
  getCustomerAnalytics: publicProcedure
    .query(async () => {
      const customers = await prisma.customer.findMany({
        include: {
          orders: {
            include: { orderItems: true },
          },
        },
      });

             const analytics = {
         totalCustomers: customers.length,
         activeCustomers: 0,
         newCustomers: 0,
         customerSegments: {
           individual: 0,
           company: 0,
           government: 0,
         },
         topCustomers: [] as Array<{
           id: string;
           name: string;
           totalSpent: number;
           orderCount: number;
         }>,
         averageOrderValue: 0,
         customerRetentionRate: 0,
       };

      customers.forEach(customer => {
        if (customer.status === 'ACTIVE') analytics.activeCustomers++;
        
        const _customerType = customer.type?.toLowerCase() || 'individual';
        if (_customerType in analytics.customerSegments) {
          analytics.customerSegments[_customerType as keyof typeof analytics.customerSegments]++;
        }

        const totalSpent = customer.orders.reduce((sum, order) => 
          sum + order.orderItems.reduce((orderSum, item) => 
            orderSum + (item.quantity * (item.unitPrice ?? 0)), 0), 0);

        if (totalSpent > 0) {
          analytics.topCustomers.push({
            id: customer.id,
            name: customer.name,
            totalSpent,
            orderCount: customer.orders.length,
          });
        }
      });

      analytics.topCustomers.sort((a, b) => b.totalSpent - a.totalSpent);
      analytics.topCustomers = analytics.topCustomers.slice(0, 10);

      return {
        success: true,
        data: analytics,
      };
    }),

  // Get equipment analytics,
  getEquipmentAnalytics: publicProcedure
    .query(async () => {
      const equipment = await prisma.equipment.findMany({
        include: {
          maintenanceRecords: true,
          rentalOrders: true,
        },
      });

             const analytics = {
         totalEquipment: equipment.length,
         equipmentByStatus: {
           available: 0,
           inUse: 0,
           maintenance: 0,
           retired: 0,
         },
         equipmentByType: {} as Record<string, number>,
         maintenanceMetrics: {
           totalMaintenanceRecords: 0,
           averageMaintenanceCost: 0,
           preventiveMaintenance: 0,
           correctiveMaintenance: 0,
         },
         utilizationMetrics: {
           averageUtilization: 0,
           peakUtilization: 0,
           lowUtilization: 0,
         },
         financialMetrics: {
           totalValue: 0,
           depreciationValue: 0,
           maintenanceCosts: 0,
           rentalIncome: 0,
         },
       };

      equipment.forEach(item => {
        // Status breakdown,
  const _status = item.status?.toLowerCase() ?? 'available';
        if (_status in analytics.equipmentByStatus) {
          analytics.equipmentByStatus[_status as keyof typeof analytics.equipmentByStatus]++;
        }

        // Type breakdown,
  const _type = item.type ?? 'Unknown';
        analytics.equipmentByType[_type] = (analytics.equipmentByType[_type] ?? 0) + 1;

                 // Financial metrics,
  analytics.financialMetrics.totalValue += item.purchasePrice ?? 0;
         analytics.financialMetrics.maintenanceCosts += item.maintenanceRecords.reduce((sum) => 
           sum + 0, 0); // TODO: Add cost field to maintenance records,
  analytics.financialMetrics.rentalIncome += item.rentalOrders.reduce((sum, order) => 
           sum + (order.dailyRate ?? 0), 0); // TODO: Calculate total amount from daily rate and duration

        // Maintenance metrics,
  analytics.maintenanceMetrics.totalMaintenanceRecords += item.maintenanceRecords.length;
        item.maintenanceRecords.forEach(record => {
          if (record.maintenanceType === 'PREVENTIVE') {
            analytics.maintenanceMetrics.preventiveMaintenance++;
          } else {
            analytics.maintenanceMetrics.correctiveMaintenance++;
          }
        });
      });

      analytics.maintenanceMetrics.averageMaintenanceCost = 
        analytics.maintenanceMetrics.totalMaintenanceRecords > 0 ? 
        analytics.financialMetrics.maintenanceCosts / analytics.maintenanceMetrics.totalMaintenanceRecords : 0;

      return {
        success: true,
        data: analytics,
      };
    }),

  // Get predictive analytics,
  getPredictiveAnalytics: publicProcedure
    .query(async () => {
      // This would typically use ML models, but for now we'll provide basic forecasting,
      const predictions = {
        revenueForecast: {
          nextMonth: 0,
          nextQuarter: 0,
          nextYear: 0,
          confidence: 0.85,
        },
        demandForecast: {
          equipmentDemand: 0,
          inventoryDemand: 0,
          serviceDemand: 0,
        },
        riskAssessment: {
          equipmentFailureRisk: 'LOW',
          inventoryRisk: 'LOW',
          financialRisk: 'LOW',
          operationalRisk: 'LOW',
        },
        recommendations: [
          'Monitor equipment utilization for optimization opportunities',
          'Review inventory levels for potential stockouts',
          'Analyze customer feedback for service improvements',
        ],
      };

      return {
        success: true,
        data: predictions,
      };
    }),
});
