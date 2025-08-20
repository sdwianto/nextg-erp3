import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      const startDate = new Date(input.startDate);
      const endDate = new Date(input.endDate);

      const transactions = await prisma.financialTransaction.findMany({
        where: {
          transactionDate: {
            gte: startDate,
            lte: endDate,
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
        const amount = transaction.amount / 100; // Convert from cents
        if (['SALE', 'RENTAL_INCOME', 'OTHER_INCOME'].includes(transaction.transactionType)) {
          summary.totalRevenue += amount;
        } else {
          summary.totalExpenses += amount;
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
        const totalValue = totalQuantity * (product.price || 0);
        report.totalValue += totalValue;

        if (totalQuantity <= (product.minStockLevel || 0)) {
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
      const startDate = new Date(input.startDate);
      const endDate = new Date(input.endDate);

      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
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
          sum + (item.quantity * (item.unitPrice || 0)), 0);
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
  // P1 ADVANCED BI FEATURES
  // ========================================

  // Configurable BI Dashboards
  getConfigurableDashboard: publicProcedure
    .input(z.object({
      dashboardId: z.string(),
      filters: z.record(z.any()).optional(),
      dateRange: z.object({
        startDate: z.date(),
        endDate: z.date(),
      }).optional(),
    }))
    .query(async ({ input }) => {
      try {
        // Mock dashboard configuration - in real implementation, this would come from database
        const dashboardConfigs = {
          'inventory-dashboard': {
            title: 'Inventory Analytics Dashboard',
            widgets: [
              { type: 'stock-valuation', title: 'Stock Valuation', size: 'large' },
              { type: 'reorder-alerts', title: 'Reorder Alerts', size: 'medium' },
              { type: 'movement-analytics', title: 'Stock Movement', size: 'large' },
              { type: 'supplier-performance', title: 'Supplier Performance', size: 'medium' },
            ],
          },
          'procurement-dashboard': {
            title: 'Procurement Analytics Dashboard',
            widgets: [
              { type: 'purchase-trends', title: 'Purchase Trends', size: 'large' },
              { type: 'supplier-metrics', title: 'Supplier Metrics', size: 'medium' },
              { type: 'cost-analysis', title: 'Cost Analysis', size: 'large' },
              { type: 'quality-metrics', title: 'Quality Metrics', size: 'medium' },
            ],
          },
          'financial-dashboard': {
            title: 'Financial Analytics Dashboard',
            widgets: [
              { type: 'revenue-trends', title: 'Revenue Trends', size: 'large' },
              { type: 'cost-breakdown', title: 'Cost Breakdown', size: 'medium' },
              { type: 'profit-margins', title: 'Profit Margins', size: 'large' },
              { type: 'cash-flow', title: 'Cash Flow', size: 'medium' },
            ],
          },
        };

        const config = dashboardConfigs[input.dashboardId as keyof typeof dashboardConfigs];
        if (!config) {
          throw new Error('Dashboard configuration not found');
        }

        // Generate widget data based on configuration
        const widgetData = await Promise.all(
          config.widgets.map(async (widget) => {
            switch (widget.type) {
              case 'stock-valuation':
                return {
                  type: widget.type,
                  title: widget.title,
                  size: widget.size,
                  data: await generateStockValuationData(input.filters),
                };
              case 'reorder-alerts':
                return {
                  type: widget.type,
                  title: widget.title,
                  size: widget.size,
                  data: await generateReorderAlertsData(input.filters),
                };
              case 'movement-analytics':
                return {
                  type: widget.type,
                  title: widget.title,
                  size: widget.size,
                  data: await generateMovementAnalyticsData(input.dateRange),
                };
              case 'supplier-performance':
                return {
                  type: widget.type,
                  title: widget.title,
                  size: widget.size,
                  data: await generateSupplierPerformanceData(),
                };
              default:
                return {
                  type: widget.type,
                  title: widget.title,
                  size: widget.size,
                  data: { message: 'Widget data not implemented' },
                };
            }
          })
        );

        return {
          success: true,
          data: {
            dashboard: config,
            widgets: widgetData,
            filters: input.filters,
            dateRange: input.dateRange,
          },
        };
      } catch (error) {
        console.error('Error generating configurable dashboard:', error);
        throw new Error('Failed to generate dashboard');
      }
    }),

  // Drill-down Capabilities
  getDrillDownData: publicProcedure
    .input(z.object({
      reportType: z.enum(['inventory', 'procurement', 'financial', 'hr']),
      dimension: z.string(),
      value: z.string(),
      level: z.number().default(1),
      filters: z.record(z.any()).optional(),
    }))
    .query(async ({ input }) => {
      try {
        let drillDownData;

        switch (input.reportType) {
          case 'inventory':
            drillDownData = await getInventoryDrillDown(input.dimension, input.value, input.level, input.filters);
            break;
          case 'procurement':
            drillDownData = await getProcurementDrillDown(input.dimension, input.value, input.level, input.filters);
            break;
          case 'financial':
            drillDownData = await getFinancialDrillDown(input.dimension, input.value, input.level, input.filters);
            break;
          case 'hr':
            drillDownData = await getHRDrillDown(input.dimension, input.value, input.level, input.filters);
            break;
          default:
            throw new Error('Invalid report type');
        }

        return {
          success: true,
          data: {
            reportType: input.reportType,
            dimension: input.dimension,
            value: input.value,
            level: input.level,
            drillDownData,
          },
        };
      } catch (error) {
        console.error('Error generating drill-down data:', error);
        throw new Error('Failed to generate drill-down data');
      }
    }),

  // Advanced Report Templates
  getAdvancedReportTemplates: publicProcedure
    .query(async () => {
      try {
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
      } catch (error) {
        console.error('Error fetching report templates:', error);
        throw new Error('Failed to fetch report templates');
      }
    }),

  // Generate Advanced Report
  generateAdvancedReport: publicProcedure
    .input(z.object({
      templateId: z.string(),
      parameters: z.record(z.any()),
      outputFormat: z.enum(['pdf', 'excel', 'csv', 'powerpoint']),
      includeCharts: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      try {
        // Mock report generation - in real implementation, this would generate actual reports
        const reportData = await generateReportData(input.templateId, input.parameters);
        
        const report = {
          id: `report-${Date.now()}`,
          templateId: input.templateId,
          parameters: input.parameters,
          outputFormat: input.outputFormat,
          generatedAt: new Date(),
          status: 'completed',
          downloadUrl: `/api/reports/download/${Date.now()}.${input.outputFormat}`,
          data: reportData,
        };

        return {
          success: true,
          data: report,
        };
      } catch (error) {
        console.error('Error generating advanced report:', error);
        throw new Error('Failed to generate report');
      }
    }),

  // Scheduled Report Distribution
  getScheduledReports: publicProcedure
    .query(async () => {
      try {
        // Mock scheduled reports - in real implementation, this would come from database
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
      } catch (error) {
        console.error('Error fetching scheduled reports:', error);
        throw new Error('Failed to fetch scheduled reports');
      }
    }),

  // Create Scheduled Report
  createScheduledReport: publicProcedure
    .input(z.object({
      name: z.string(),
      templateId: z.string(),
      schedule: z.enum(['daily', 'weekly', 'monthly']),
      time: z.string(),
      dayOfWeek: z.number().optional(),
      dayOfMonth: z.number().optional(),
      recipients: z.array(z.string()),
      parameters: z.record(z.any()).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Mock creation - in real implementation, this would save to database
        const scheduledReport = {
          id: `scheduled-${Date.now()}`,
          ...input,
          isActive: true,
          createdAt: new Date(),
          lastRun: null,
          nextRun: calculateNextRun(input.schedule, input.time, input.dayOfWeek, input.dayOfMonth),
        };

        return {
          success: true,
          data: scheduledReport,
        };
      } catch (error) {
        console.error('Error creating scheduled report:', error);
        throw new Error('Failed to create scheduled report');
      }
    }),

  // Operational KPIs
  getOperationalKPIs: publicProcedure
    .input(z.object({
      dateRange: z.object({
        startDate: z.date(),
        endDate: z.date(),
      }).optional(),
      department: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
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
      } catch (error) {
        console.error('Error fetching operational KPIs:', error);
        throw new Error('Failed to fetch operational KPIs');
      }
    }),

  // ========================================
  // P1 JDE-STYLE ADVANCED BI FEATURES
  // ========================================

  // JDE-Style Business Intelligence Dashboard
  getJDEStyleDashboard: publicProcedure
    .input(z.object({
      dashboardType: z.enum(['inventory', 'procurement', 'financial', 'operations', 'hr']),
      dateRange: z.object({
        startDate: z.date(),
        endDate: z.date(),
      }).optional(),
      filters: z.record(z.any()).optional(),
      includePredictive: z.boolean().default(true),
    }))
    .query(async ({ input }) => {
      try {
        let dashboardData;

        switch (input.dashboardType) {
          case 'inventory':
            dashboardData = await generateInventoryDashboard(input.dateRange, input.filters, input.includePredictive);
            break;
          case 'procurement':
            dashboardData = await generateProcurementDashboard(input.dateRange, input.filters, input.includePredictive);
            break;
          case 'financial':
            dashboardData = await generateFinancialDashboard(input.dateRange, input.filters, input.includePredictive);
            break;
          case 'operations':
            dashboardData = await generateOperationsDashboard(input.dateRange, input.filters, input.includePredictive);
            break;
          case 'hr':
            dashboardData = await generateHRDashboard(input.dateRange, input.filters, input.includePredictive);
            break;
          default:
            throw new Error('Invalid dashboard type');
        }

        return {
          success: true,
          data: {
            dashboardType: input.dashboardType,
            generatedAt: new Date(),
            dateRange: input.dateRange,
            filters: input.filters,
            ...dashboardData,
          },
        };
      } catch (error) {
        console.error('Error generating JDE-style dashboard:', error);
        throw new Error('Failed to generate dashboard');
      }
    }),

  // JDE-Style Drill-down Analysis
  getJDEDrillDownAnalysis: publicProcedure
    .input(z.object({
      analysisType: z.enum(['inventory', 'procurement', 'financial', 'operations']),
      dimension: z.string(),
      value: z.string(),
      drillLevel: z.number().default(1),
      dateRange: z.object({
        startDate: z.date(),
        endDate: z.date(),
      }).optional(),
      includeTrends: z.boolean().default(true),
    }))
    .query(async ({ input }) => {
      try {
        let drillDownData;

        switch (input.analysisType) {
          case 'inventory':
            drillDownData = await generateInventoryDrillDown(input.dimension, input.value, input.drillLevel, input.dateRange, input.includeTrends);
            break;
          case 'procurement':
            drillDownData = await generateProcurementDrillDown(input.dimension, input.value, input.drillLevel, input.dateRange, input.includeTrends);
            break;
          case 'financial':
            drillDownData = await generateFinancialDrillDown(input.dimension, input.value, input.drillLevel, input.dateRange, input.includeTrends);
            break;
          case 'operations':
            drillDownData = await generateOperationsDrillDown(input.dimension, input.value, input.drillLevel, input.dateRange, input.includeTrends);
            break;
          default:
            throw new Error('Invalid analysis type');
        }

        return {
          success: true,
          data: {
            analysisType: input.analysisType,
            dimension: input.dimension,
            value: input.value,
            drillLevel: input.drillLevel,
            dateRange: input.dateRange,
            includeTrends: input.includeTrends,
            ...drillDownData,
          },
        };
      } catch (error) {
        console.error('Error generating JDE drill-down analysis:', error);
        throw new Error('Failed to generate drill-down analysis');
      }
    }),

  // JDE-Style Predictive Analytics
  getJDEPredictiveAnalytics: publicProcedure
    .input(z.object({
      predictionType: z.enum(['inventory', 'maintenance', 'demand', 'financial']),
      horizon: z.number().default(30), // days
      confidence: z.number().default(0.95),
      includeScenarios: z.boolean().default(true),
    }))
    .query(async ({ input }) => {
      try {
        let predictiveData;

        switch (input.predictionType) {
          case 'inventory':
            predictiveData = await generateInventoryPredictions(input.horizon, input.confidence, input.includeScenarios);
            break;
          case 'maintenance':
            predictiveData = await generateMaintenancePredictions(input.horizon, input.confidence, input.includeScenarios);
            break;
          case 'demand':
            predictiveData = await generateDemandPredictions(input.horizon, input.confidence, input.includeScenarios);
            break;
          case 'financial':
            predictiveData = await generateFinancialPredictions(input.horizon, input.confidence, input.includeScenarios);
            break;
          default:
            throw new Error('Invalid prediction type');
        }

        return {
          success: true,
          data: {
            predictionType: input.predictionType,
            horizon: input.horizon,
            confidence: input.confidence,
            includeScenarios: input.includeScenarios,
            generatedAt: new Date(),
            ...predictiveData,
          },
        };
      } catch (error) {
        console.error('Error generating JDE predictive analytics:', error);
        throw new Error('Failed to generate predictive analytics');
      }
    }),

  // JDE-Style Advanced Report Templates
  getJDEAdvancedReportTemplates: publicProcedure
    .query(async () => {
      try {
        const templates = [
          {
            id: 'jde-inventory-valuation',
            name: 'JDE Inventory Valuation Report',
            description: 'Comprehensive inventory valuation with multi-dimensional analysis',
            category: 'inventory',
            jdeCompliance: true,
            parameters: [
              { name: 'valuationMethod', type: 'select', options: ['FIFO', 'LIFO', 'AVERAGE', 'STANDARD'], required: true },
              { name: 'warehouse', type: 'multiselect', required: false },
              { name: 'category', type: 'multiselect', required: false },
              { name: 'includeInactive', type: 'boolean', required: false },
              { name: 'dateRange', type: 'daterange', required: true },
            ],
            outputFormats: ['pdf', 'excel', 'csv', 'powerpoint'],
            features: ['multi-dimensional', 'drill-down', 'predictive', 'real-time'],
          },
          {
            id: 'jde-procurement-performance',
            name: 'JDE Procurement Performance Report',
            description: 'Supplier performance and procurement analytics with JDE standards',
            category: 'procurement',
            jdeCompliance: true,
            parameters: [
              { name: 'supplier', type: 'multiselect', required: false },
              { name: 'dateRange', type: 'daterange', required: true },
              { name: 'performanceMetrics', type: 'multiselect', options: ['onTimeDelivery', 'quality', 'cost', 'response'], required: false },
              { name: 'includePredictive', type: 'boolean', required: false },
            ],
            outputFormats: ['pdf', 'excel', 'csv'],
            features: ['supplier-scoring', 'trend-analysis', 'predictive', 'benchmarking'],
          },
          {
            id: 'jde-financial-dashboard',
            name: 'JDE Financial Dashboard Report',
            description: 'Comprehensive financial analytics with multi-currency support',
            category: 'financial',
            jdeCompliance: true,
            parameters: [
              { name: 'dateRange', type: 'daterange', required: true },
              { name: 'currency', type: 'select', options: ['USD', 'IDR', 'EUR', 'ALL'], required: false },
              { name: 'department', type: 'multiselect', required: false },
              { name: 'includeCharts', type: 'boolean', required: false },
              { name: 'includePredictive', type: 'boolean', required: false },
            ],
            outputFormats: ['pdf', 'excel', 'powerpoint'],
            features: ['multi-currency', 'real-time', 'predictive', 'drill-down'],
          },
          {
            id: 'jde-operations-kpi',
            name: 'JDE Operations KPI Report',
            description: 'Operational KPIs with JDE-style performance metrics',
            category: 'operations',
            jdeCompliance: true,
            parameters: [
              { name: 'dateRange', type: 'daterange', required: true },
              { name: 'kpiType', type: 'multiselect', options: ['efficiency', 'productivity', 'quality', 'safety'], required: false },
              { name: 'department', type: 'multiselect', required: false },
              { name: 'includeBenchmarks', type: 'boolean', required: false },
            ],
            outputFormats: ['pdf', 'excel', 'csv'],
            features: ['kpi-tracking', 'benchmarking', 'trend-analysis', 'alerts'],
          },
        ];

        return {
          success: true,
          data: {
            templates,
            categories: [...new Set(templates.map(t => t.category))],
            jdeCompliantTemplates: templates.filter(t => t.jdeCompliance),
            outputFormats: ['pdf', 'excel', 'csv', 'powerpoint'],
            features: ['multi-dimensional', 'drill-down', 'predictive', 'real-time', 'multi-currency'],
          },
        };
      } catch (error) {
        console.error('Error fetching JDE advanced report templates:', error);
        throw new Error('Failed to fetch report templates');
      }
    }),

  // JDE-Style Scheduled Report Management
  getJDEScheduledReports: publicProcedure
    .query(async () => {
      try {
        const scheduledReports = [
          {
            id: '1',
            name: 'Daily JDE Inventory Summary',
            templateId: 'jde-inventory-valuation',
            schedule: 'daily',
            time: '09:00',
            recipients: ['inventory@company.com', 'manager@company.com'],
            isActive: true,
            jdeCompliance: true,
            lastRun: new Date('2024-01-20T09:00:00Z'),
            nextRun: new Date('2024-01-21T09:00:00Z'),
            parameters: {
              valuationMethod: 'AVERAGE',
              includeInactive: false,
              dateRange: { startDate: new Date(), endDate: new Date() },
            },
          },
          {
            id: '2',
            name: 'Weekly JDE Procurement Performance',
            templateId: 'jde-procurement-performance',
            schedule: 'weekly',
            dayOfWeek: 'monday',
            time: '08:00',
            recipients: ['procurement@company.com'],
            isActive: true,
            jdeCompliance: true,
            lastRun: new Date('2024-01-15T08:00:00Z'),
            nextRun: new Date('2024-01-22T08:00:00Z'),
            parameters: {
              performanceMetrics: ['onTimeDelivery', 'quality', 'cost'],
              includePredictive: true,
            },
          },
          {
            id: '3',
            name: 'Monthly JDE Financial Dashboard',
            templateId: 'jde-financial-dashboard',
            schedule: 'monthly',
            dayOfMonth: 1,
            time: '10:00',
            recipients: ['finance@company.com', 'ceo@company.com'],
            isActive: true,
            jdeCompliance: true,
            lastRun: new Date('2024-01-01T10:00:00Z'),
            nextRun: new Date('2024-02-01T10:00:00Z'),
            parameters: {
              currency: 'ALL',
              includeCharts: true,
              includePredictive: true,
            },
          },
        ];

        return {
          success: true,
          data: {
            scheduledReports,
            summary: {
              total: scheduledReports.length,
              active: scheduledReports.filter(r => r.isActive).length,
              jdeCompliant: scheduledReports.filter(r => r.jdeCompliance).length,
              daily: scheduledReports.filter(r => r.schedule === 'daily').length,
              weekly: scheduledReports.filter(r => r.schedule === 'weekly').length,
              monthly: scheduledReports.filter(r => r.schedule === 'monthly').length,
            },
          },
        };
      } catch (error) {
        console.error('Error fetching JDE scheduled reports:', error);
        throw new Error('Failed to fetch scheduled reports');
      }
    }),
});

// Helper functions for report generation
async function generateStockValuationData(_filters: any) {
  // Mock data generation
  return {
    totalValue: 1250000,
    costValue: 980000,
    profitMargin: 270000,
    topProducts: [
      { name: 'Product A', value: 150000, quantity: 500 },
      { name: 'Product B', value: 120000, quantity: 300 },
      { name: 'Product C', value: 95000, quantity: 250 },
    ],
  };
}

async function generateReorderAlertsData(_filters: any) {
  return {
    totalAlerts: 15,
    critical: 3,
    high: 7,
    medium: 5,
    estimatedCost: 45000,
  };
}

async function generateMovementAnalyticsData(_dateRange: any) {
  return {
    totalMovements: 1250,
    inMovements: 680,
    outMovements: 570,
    dailyTrend: [
      { date: '2024-01-15', in: 45, out: 38 },
      { date: '2024-01-16', in: 52, out: 41 },
      { date: '2024-01-17', in: 38, out: 35 },
    ],
  };
}

async function generateSupplierPerformanceData() {
  return {
    totalSuppliers: 25,
    averageRating: 4.2,
    topSuppliers: [
      { name: 'Supplier A', rating: 4.8, onTimeDelivery: 95 },
      { name: 'Supplier B', rating: 4.6, onTimeDelivery: 92 },
      { name: 'Supplier C', rating: 4.4, onTimeDelivery: 89 },
    ],
  };
}

async function getInventoryDrillDown(dimension: string, value: string, level: number, _filters: any) {
  return {
    dimension,
    value,
    level,
    data: [
      { category: 'Electronics', value: 250000, quantity: 1250 },
      { category: 'Machinery', value: 180000, quantity: 45 },
      { category: 'Tools', value: 95000, quantity: 890 },
    ],
  };
}

async function getProcurementDrillDown(dimension: string, value: string, level: number, _filters: any) {
  return {
    dimension,
    value,
    level,
    data: [
      { supplier: 'Supplier A', orders: 25, value: 125000 },
      { supplier: 'Supplier B', orders: 18, value: 89000 },
      { supplier: 'Supplier C', orders: 12, value: 67000 },
    ],
  };
}

async function getFinancialDrillDown(dimension: string, value: string, level: number, _filters: any) {
  return {
    dimension,
    value,
    level,
    data: [
      { department: 'Sales', revenue: 450000, cost: 320000 },
      { department: 'Operations', revenue: 280000, cost: 210000 },
      { department: 'Support', revenue: 180000, cost: 150000 },
    ],
  };
}

async function getHRDrillDown(dimension: string, value: string, level: number, _filters: any) {
  return {
    dimension,
    value,
    level,
    data: [
      { department: 'Engineering', employees: 45, satisfaction: 4.3 },
      { department: 'Sales', employees: 32, satisfaction: 4.1 },
      { department: 'Support', employees: 28, satisfaction: 4.0 },
    ],
  };
}

async function generateReportData(templateId: string, _parameters: any) {
  // Mock report data generation based on template
  switch (templateId) {
    case 'inventory-valuation-report':
      return {
        title: 'Inventory Valuation Report',
        generatedAt: new Date(),
        summary: {
          totalValue: 1250000,
          totalItems: 2500,
          averageValue: 500,
        },
        details: [
          { category: 'Electronics', value: 450000, items: 900 },
          { category: 'Machinery', value: 380000, items: 45 },
          { category: 'Tools', value: 420000, items: 1555 },
        ],
      };
    case 'procurement-performance-report':
      return {
        title: 'Procurement Performance Report',
        generatedAt: new Date(),
        summary: {
          totalOrders: 125,
          totalValue: 890000,
          averageOrderValue: 7120,
        },
        details: [
          { supplier: 'Supplier A', orders: 45, value: 320000 },
          { supplier: 'Supplier B', orders: 38, value: 280000 },
          { supplier: 'Supplier C', orders: 42, value: 290000 },
        ],
      };
    default:
      return {
        title: 'Report',
        generatedAt: new Date(),
        summary: {},
        details: [],
      };
  }
}

function calculateNextRun(schedule: string, time: string, dayOfWeek?: number, dayOfMonth?: number) {
  const now = new Date();
  const [hours, minutes] = time.split(':').map(Number);
  const hoursNum = hours ?? 0;
  const minutesNum = minutes ?? 0;
  
  switch (schedule) {
    case 'daily':
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(hoursNum, minutesNum, 0, 0);
      return tomorrow;
    case 'weekly':
      const nextWeek = new Date(now);
      const daysUntilNext = (dayOfWeek ?? 1) - now.getDay();
      nextWeek.setDate(nextWeek.getDate() + (daysUntilNext + 7) % 7);
      nextWeek.setHours(hoursNum, minutesNum, 0, 0);
      return nextWeek;
    case 'monthly':
      const nextMonth = new Date(now);
      nextMonth.setDate(dayOfMonth ?? 1);
      nextMonth.setHours(hoursNum, minutesNum, 0, 0);
      if (nextMonth <= now) {
        nextMonth.setMonth(nextMonth.getMonth() + 1);
      }
      return nextMonth;
    default:
      return now;
  }
}
