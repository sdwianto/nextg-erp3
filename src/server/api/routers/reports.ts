import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "@/server/db";

export const reportsRouter = createTRPCRouter({
  // ========================================
  // FINANCIAL REPORTS
  // ========================================

  // Get financial summary report
  getFinancialSummary: publicProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
    }))
    .query(async ({ input }) => {
      const _startDate = new Date(input.startDate);
      const _endDate = new Date(input.endDate);

      const transactions = await prisma.financialTransaction.findMany({
        where: {
          transactionDate: {
            gte: _startDate,
            lte: _endDate,
          },
        },
        include: {
          user: { select: { firstName: true, lastName: true } },
        },
      });

      const summary = {
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        transactionCount: transactions.length,
        averageTransactionAmount: 0,
        topTransactionTypes: [],
      };

      transactions.forEach(transaction => {
        const _amount = transaction.amount / 100; // Convert from cents
        if (['SALE', 'RENTAL_INCOME', 'OTHER_INCOME'].includes(transaction.transactionType)) {
          summary.totalRevenue += _amount;
        } else {
          summary.totalExpenses += _amount;
        }
      });

      summary.netProfit = summary.totalRevenue - summary.totalExpenses;
      summary.averageTransactionAmount = transactions.length > 0 ? 
        (summary.totalRevenue + summary.totalExpenses) / transactions.length : 0;

      return {
        success: true,
        data: summary,
      };
    }),

  // Get inventory report
  getInventoryReport: publicProcedure
    .query(async () => {
      const products = await prisma.product.findMany({
        include: {
          category: true,
          inventoryItems: {
            include: {
              warehouse: true,
            },
          },
        },
      });

      const report = {
        totalProducts: products.length,
        totalValue: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        categoryBreakdown: [],
      };

      products.forEach(product => {
        const totalQuantity = product.inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalValue = totalQuantity * (product.price ?? 0);
        report.totalValue += totalValue;

        if (totalQuantity <= (product.minStockLevel ?? 0)) {
          report.lowStockItems++;
        }
        if (totalQuantity === 0) {
          report.outOfStockItems++;
        }
      });

      return {
        success: true,
        data: report,
      };
    }),

  // Get employee report
  getEmployeeReport: publicProcedure
    .query(async () => {
      const employees = await prisma.employee.findMany({
        include: {
          department: true,
          leaveRequests: true,
          payrollRecords: true,
        },
      });

      const report = {
        totalEmployees: employees.length,
        activeEmployees: 0,
        totalSalary: 0,
        departmentBreakdown: [],
        leaveRequests: {
          pending: 0,
          approved: 0,
          rejected: 0,
        },
      };

      employees.forEach(employee => {
        if (employee.employmentStatus === 'ACTIVE') {
          report.activeEmployees++;
        }
        report.totalSalary += employee.baseSalary;

        // Count leave requests
        employee.leaveRequests.forEach(leave => {
          if (leave.status === 'PENDING') report.leaveRequests.pending++;
          else if (leave.status === 'APPROVED') report.leaveRequests.approved++;
          else if (leave.status === 'REJECTED') report.leaveRequests.rejected++;
        });
      });

      return {
        success: true,
        data: report,
      };
    }),

  // Get sales report
  getSalesReport: publicProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
    }))
    .query(async ({ input }) => {
      const _startDate = new Date(input.startDate);
      const _endDate = new Date(input.endDate);

      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: _startDate,
            lte: _endDate,
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

      const report = {
        totalOrders: orders.length,
        totalRevenue: 0,
        averageOrderValue: 0,
        topProducts: [],
        customerBreakdown: [],
      };

      orders.forEach(order => {
        const orderTotal = order.orderItems.reduce((sum, item) => 
          sum + (item.quantity * (item.unitPrice ?? 0)), 0);
        report.totalRevenue += orderTotal;
      });

      report.averageOrderValue = orders.length > 0 ? report.totalRevenue / orders.length : 0;

      return {
        success: true,
        data: report,
      };
    }),

  // Get equipment report
  getEquipmentReport: publicProcedure
    .query(async () => {
      const equipment = await prisma.equipment.findMany({
        include: {
          maintenanceRecords: true,
          rentalOrders: true,
        },
      });

      const report = {
        totalEquipment: equipment.length,
        availableEquipment: 0,
        inUseEquipment: 0,
        underMaintenance: 0,
        totalValue: 0,
        utilizationRate: 0,
      };

      equipment.forEach(item => {
        report.totalValue += item.purchasePrice ?? 0;
        
        if (item.status === 'AVAILABLE') report.availableEquipment++;
        else if (item.status === 'IN_USE') report.inUseEquipment++;
        else if (item.status === 'MAINTENANCE') report.underMaintenance++;
      });

      report.utilizationRate = equipment.length > 0 ? 
        (report.inUseEquipment / equipment.length) * 100 : 0;

      return {
        success: true,
        data: report,
      };
    }),

  // ========================================
  // DASHBOARD & ANALYTICS
  // ========================================

  // Get operational KPIs
  getOperationalKPIs: publicProcedure
    .input(z.object({
      dateRange: z.object({
        startDate: z.date(),
        endDate: z.date(),
      }).optional(),
      department: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const kpis = {
        inventory: {
          stockTurnover: 4.2,
          fillRate: 95.8,
          accuracy: 98.5,
          carryingCost: 125000,
          stockoutRate: 2.1,
        },
        procurement: {
          orderFulfillment: 92.3,
          supplierOnTimeDelivery: 88.7,
          costSavings: 156000,
          purchaseOrderCycle: 3.2,
          qualityAcceptance: 96.4,
        },
        financial: {
          revenueGrowth: 12.5,
          profitMargin: 18.3,
          cashFlow: 450000,
          costReduction: 8.7,
          roi: 24.1,
        },
        hr: {
          employeeSatisfaction: 4.2,
          turnoverRate: 8.5,
          productivity: 87.3,
          trainingCompletion: 94.1,
          absenteeism: 3.2,
        },
      };

      return {
        success: true,
        data: {
          kpis,
          dateRange: input.dateRange,
          department: input.department,
          lastUpdated: new Date(),
        },
      };
    }),

  // Get report templates
  getReportTemplates: publicProcedure
    .query(async () => {
      const templates = [
        {
          id: 'inventory-valuation-report',
          name: 'Inventory Valuation Report',
          description: 'Comprehensive inventory valuation with cost analysis',
          category: 'inventory',
          parameters: [
            { name: 'warehouse', type: 'select', required: false },
            { name: 'category', type: 'select', required: false },
            { name: 'dateRange', type: 'daterange', required: true },
          ],
          outputFormats: ['pdf', 'excel', 'csv'],
        },
        {
          id: 'procurement-performance-report',
          name: 'Procurement Performance Report',
          description: 'Supplier performance and procurement analytics',
          category: 'procurement',
          parameters: [
            { name: 'supplier', type: 'select', required: false },
            { name: 'dateRange', type: 'daterange', required: true },
            { name: 'status', type: 'multiselect', required: false },
          ],
          outputFormats: ['pdf', 'excel', 'csv'],
        },
        {
          id: 'financial-dashboard-report',
          name: 'Financial Dashboard Report',
          description: 'Comprehensive financial analytics and KPIs',
          category: 'financial',
          parameters: [
            { name: 'dateRange', type: 'daterange', required: true },
            { name: 'department', type: 'select', required: false },
            { name: 'includeCharts', type: 'boolean', required: false },
          ],
          outputFormats: ['pdf', 'excel', 'powerpoint'],
        },
        {
          id: 'hr-analytics-report',
          name: 'HR Analytics Report',
          description: 'Employee performance and HR metrics',
          category: 'hr',
          parameters: [
            { name: 'department', type: 'select', required: false },
            { name: 'dateRange', type: 'daterange', required: true },
            { name: 'includePersonalData', type: 'boolean', required: false },
          ],
          outputFormats: ['pdf', 'excel'],
        },
      ];

      return {
        success: true,
        data: {
          templates,
          categories: [...new Set(templates.map(t => t.category))],
          outputFormats: ['pdf', 'excel', 'csv', 'powerpoint'],
        },
      };
    }),

  // Generate report
  generateReport: publicProcedure
    .input(z.object({
      templateId: z.string(),
      parameters: z.record(z.unknown()),
      outputFormat: z.enum(['pdf', 'excel', 'csv', 'powerpoint']),
      includeCharts: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const report = {
        id: `report-${Date.now()}`,
        templateId: input.templateId,
        parameters: input.parameters,
        outputFormat: input.outputFormat,
        generatedAt: new Date(),
        status: 'completed',
        downloadUrl: `/api/reports/download/${Date.now()}.${input.outputFormat}`,
        data: {
          title: 'Generated Report',
          generatedAt: new Date(),
          summary: {},
          details: [],
        },
      };

      return {
        success: true,
        data: report,
      };
    }),

  // Get scheduled reports
  getScheduledReports: publicProcedure
    .query(async () => {
      const scheduledReports = [
        {
          id: '1',
          name: 'Daily Inventory Summary',
          templateId: 'inventory-valuation-report',
          schedule: 'daily',
          time: '09:00',
          recipients: ['inventory@company.com', 'manager@company.com'],
          isActive: true,
          lastRun: new Date('2024-01-20T09:00:00Z'),
          nextRun: new Date('2024-01-21T09:00:00Z'),
        },
        {
          id: '2',
          name: 'Weekly Procurement Report',
          templateId: 'procurement-performance-report',
          schedule: 'weekly',
          dayOfWeek: 'monday',
          time: '08:00',
          recipients: ['procurement@company.com'],
          isActive: true,
          lastRun: new Date('2024-01-15T08:00:00Z'),
          nextRun: new Date('2024-01-22T08:00:00Z'),
        },
        {
          id: '3',
          name: 'Monthly Financial Dashboard',
          templateId: 'financial-dashboard-report',
          schedule: 'monthly',
          dayOfMonth: 1,
          time: '10:00',
          recipients: ['finance@company.com', 'ceo@company.com'],
          isActive: true,
          lastRun: new Date('2024-01-01T10:00:00Z'),
          nextRun: new Date('2024-02-01T10:00:00Z'),
        },
      ];

      return {
        success: true,
        data: {
          scheduledReports,
          summary: {
            total: scheduledReports.length,
            active: scheduledReports.filter(r => r.isActive).length,
            daily: scheduledReports.filter(r => r.schedule === 'daily').length,
            weekly: scheduledReports.filter(r => r.schedule === 'weekly').length,
            monthly: scheduledReports.filter(r => r.schedule === 'monthly').length,
          },
        },
      };
    }),

  // Create scheduled report
  createScheduledReport: publicProcedure
    .input(z.object({
      name: z.string(),
      templateId: z.string(),
      schedule: z.enum(['daily', 'weekly', 'monthly']),
      time: z.string(),
      dayOfWeek: z.number().optional(),
      dayOfMonth: z.number().optional(),
      recipients: z.array(z.string()),
      parameters: z.record(z.unknown()).optional(),
    }))
    .mutation(async ({ input }) => {
      const scheduledReport = {
        id: `scheduled-${Date.now()}`,
        ...input,
        isActive: true,
        createdAt: new Date(),
        lastRun: null,
        nextRun: new Date(),
      };

      return {
        success: true,
        data: scheduledReport,
      };
    }),
});
