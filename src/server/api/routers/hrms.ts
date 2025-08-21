import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { prisma } from "@/server/db";


// Input validation schemas,
  const createEmployeeSchema = z.object({
  employeeNumber: z.string().min(1, "Employee number is required"),
  userId: z.string().min(1, "User is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.date().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).optional(),
  departmentId: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
  hireDate: z.date(),
  terminationDate: z.date().optional(),
  employmentStatus: z.enum(["ACTIVE", "INACTIVE", "TERMINATED", "ON_LEAVE"]).default("ACTIVE"),
  baseSalary: z.number().min(0, "Base salary must be positive"),
  allowances: z.number().min(0, "Allowances must be positive").default(0),
  taxNumber: z.string().optional(),
  bankAccount: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
});

const createLeaveRequestSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  leaveType: z.enum(["ANNUAL_LEAVE", "SICK_LEAVE", "PERSONAL_LEAVE", "MATERNITY_LEAVE", "PATERNITY_LEAVE", "UNPAID_LEAVE"]),
  startDate: z.date(),
  endDate: z.date(),
  totalDays: z.number().min(1, "Total days must be at least 1"),
  reason: z.string().min(1, "Reason is required"),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]).default("PENDING"),
  approvedBy: z.string().optional(),
  approvedAt: z.date().optional(),
  rejectionReason: z.string().optional(),
});

const createPayrollSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  payPeriod: z.string().min(1, "Pay period is required"),
  baseSalary: z.number().min(0, "Base salary must be positive"),
  allowances: z.number().min(0, "Allowances must be positive").default(0),
  overtimePay: z.number().min(0, "Overtime pay must be positive").default(0),
  deductions: z.number().min(0, "Deductions must be positive").default(0),
  netSalary: z.number().min(0, "Net salary must be positive"),
  paymentDate: z.date().optional(),
  paymentMethod: z.string().optional(),
  status: z.enum(["PENDING", "PROCESSED", "PAID", "CANCELLED"]).default("PENDING"),
});

export const hrmsRouter = createTRPCRouter({
  // ========================================
  // EMPLOYEE MANAGEMENT
  // ========================================

  // Get all employees,
  getEmployees: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      search: z.string().optional(),
      departmentId: z.string().optional(),
      status: z.enum(["ACTIVE", "INACTIVE", "TERMINATED", "ON_LEAVE"]).optional(),
    }))
    .query(async ({ input }) => {
      const _skip = (input.page - 1) * input.limit;

      const where = {
        ...(input.search && {
          OR: [
            { firstName: { contains: input.search, mode: "insensitive" as const 
          } },
            { lastName: { contains: input.search, mode: "insensitive" as const } },
            { employeeNumber: { contains: input.search, mode: "insensitive" as const } },
            { email: { contains: input.search, mode: "insensitive" as const } },
          ],
        }),
        ...(input.departmentId && { departmentId: input.departmentId }),
        ...(input.status && { employmentStatus: input.status }),
      };

      const [employees, total] = await Promise.all([
        prisma.employee.findMany({
          where,
          include: {
            department: { select: { name: true, code: true } },
            user: { select: { firstName: true, lastName: true } },
            _count: {
              select: {
                leaveRequests: true,
                payrollRecords: true,
              },
            },
          },
          skip: _skip,
          take: input.limit,
          orderBy: { hireDate: "desc" },
        }),
        prisma.employee.count({ where }),
      ]);

      return {
        success: true,
        data: employees,
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          totalPages: Math.ceil(total / input.limit),
        },
      };
    }),

  // Get employee by ID,
  getEmployeeById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const employee = await prisma.employee.findUnique({
        where: { id: input.id },
        include: {
          department: { select: { name: true, code: true } },
          user: { select: { firstName: true, lastName: true } },
          leaveRequests: {
            orderBy: { startDate: "desc" },
            take: 10,
          },
          payrollRecords: {
            orderBy: { paymentDate: "desc" },
            take: 10,
          },
        },
      });

      if (!employee) {
        throw new Error("Employee not found");
      }

      return { success: true, data: employee };
    }),

  // Create employee,
  createEmployee: protectedProcedure
    .input(createEmployeeSchema)
    .mutation(async ({ input }) => {
      const employee = await prisma.employee.create({
        data: {
          ...input,
          baseSalary: Math.round(input.baseSalary * 100), // Convert to cents
          allowances: Math.round(input.allowances * 100), // Convert to cents
        },
        include: {
          department: { select: { name: true, code: true } },
          user: { select: { firstName: true, lastName: true } },
        },
      });

      return { success: true, data: employee };
    }),

  // Update employee,
  updateEmployee: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: createEmployeeSchema.partial(),
    }))
    .mutation(async ({ input }) => {
      const _updateData = { ...input.data };
      
      // Convert monetary values to cents if provided
      if (_updateData.baseSalary !== undefined) {
        _updateData.baseSalary = Math.round(_updateData.baseSalary * 100);
      }
      if (_updateData.allowances !== undefined) {
        _updateData.allowances = Math.round(_updateData.allowances * 100);
      }

      const employee = await prisma.employee.update({
        where: { id: input.id },
        data: _updateData,
        include: {
          department: { select: { name: true, code: true } },
          user: { select: { firstName: true, lastName: true } },
        },
      });

      return { success: true, data: employee };
    }),

  // ========================================
  // LEAVE MANAGEMENT
  // ========================================

  // Get leave requests,
  getLeaveRequests: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      employeeId: z.string().optional(),
      status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]).optional(),
      leaveType: z.enum(["ANNUAL_LEAVE", "SICK_LEAVE", "PERSONAL_LEAVE", "MATERNITY_LEAVE", "PATERNITY_LEAVE", "UNPAID_LEAVE"]).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const _skip = (input.page - 1) * input.limit;

      const where = {
        ...(input.employeeId && { employeeId: input.employeeId 
        }),
        ...(input.status && { status: input.status }),
        ...(input.leaveType && { leaveType: input.leaveType }),
        ...(input.startDate && input.endDate && {
          startDate: {
            gte: new Date(input.startDate),
            lte: new Date(input.endDate),
          },
        }),
      };

      const [leaveRequests, total] = await Promise.all([
        prisma.leaveRequest.findMany({
          where,
          include: {
            employee: { 
              select: { 
                firstName: true, 
                lastName: true, 
                employeeNumber: true,
                user: { select: { firstName: true, lastName: true } }
              } 
            },
          },
          skip: _skip,
          take: input.limit,
          orderBy: { startDate: "desc" },
        }),
        prisma.leaveRequest.count({ where }),
      ]);

      return {
        success: true,
        data: leaveRequests,
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          totalPages: Math.ceil(total / input.limit),
        },
      };
    }),

  // Create leave request,
  createLeaveRequest: protectedProcedure
    .input(createLeaveRequestSchema)
    .mutation(async ({ input }) => {
      const leaveRequest = await prisma.leaveRequest.create({
        data: input,
        include: {
          employee: { 
            select: { 
              firstName: true, 
              lastName: true, 
              employeeNumber: true,
              user: { select: { firstName: true, lastName: true } }
            } 
          },
        },
      });

      return { success: true, data: leaveRequest };
    }),

  // Update leave request,
  updateLeaveRequest: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: createLeaveRequestSchema.partial(),
    }))
    .mutation(async ({ input }) => {
      const leaveRequest = await prisma.leaveRequest.update({
        where: { id: input.id },
        data: input.data,
        include: {
          employee: { 
            select: { 
              firstName: true, 
              lastName: true, 
              employeeNumber: true,
              user: { select: { firstName: true, lastName: true } }
            } 
          },
        },
      });

      return { success: true, data: leaveRequest };
    }),

  // ========================================
  // PAYROLL MANAGEMENT
  // ========================================

  // Get payroll records,
  getPayrollRecords: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      employeeId: z.string().optional(),
      payPeriod: z.string().optional(),
      status: z.enum(["PENDING", "PROCESSED", "PAID", "CANCELLED"]).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const _skip = (input.page - 1) * input.limit;

      const where = {
        ...(input.employeeId && { employeeId: input.employeeId }),
        ...(input.payPeriod && { payPeriod: input.payPeriod }),
        ...(input.status && { status: input.status }),
        ...(input.startDate && input.endDate && {
          paymentDate: {
            gte: new Date(input.startDate),
            lte: new Date(input.endDate),
          },
        }),
      };

      const [payrollRecords, total] = await Promise.all([
        prisma.payrollRecord.findMany({
          where,
          include: {
            employee: { 
              select: { 
                firstName: true, 
                lastName: true, 
                employeeNumber: true,
                user: { select: { firstName: true, lastName: true } }
              } 
            },
          },
          skip: _skip,
          take: input.limit,
          orderBy: { paymentDate: "desc" },
        }),
        prisma.payrollRecord.count({ where }),
      ]);

      return {
        success: true,
        data: payrollRecords,
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          totalPages: Math.ceil(total / input.limit),
        },
      };
    }),

  // Create payroll record,
  createPayrollRecord: protectedProcedure
    .input(createPayrollSchema)
    .mutation(async ({ input }) => {
      const payrollRecord = await prisma.payrollRecord.create({
        data: {
          ...input,
          baseSalary: Math.round(input.baseSalary * 100),
          allowances: Math.round(input.allowances * 100),
          overtimePay: Math.round(input.overtimePay * 100),
          deductions: Math.round(input.deductions * 100),
          netSalary: Math.round(input.netSalary * 100),
        },
        include: {
          employee: { 
            select: { 
              firstName: true, 
              lastName: true, 
              employeeNumber: true,
              user: { select: { firstName: true, lastName: true } }
            } 
          },
        },
      });

      return { success: true, data: payrollRecord };
    }),

  // Update payroll record,
  updatePayrollRecord: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: createPayrollSchema.partial(),
    }))
    .mutation(async ({ input }) => {
      const _updateData = { ...input.data };
      
      // Convert monetary values to cents if provided
      if (_updateData.baseSalary !== undefined) {
        _updateData.baseSalary = Math.round(_updateData.baseSalary * 100);
      }
      if (_updateData.allowances !== undefined) {
        _updateData.allowances = Math.round(_updateData.allowances * 100);
      }
      if (_updateData.overtimePay !== undefined) {
        _updateData.overtimePay = Math.round(_updateData.overtimePay * 100);
      }
      if (_updateData.deductions !== undefined) {
        _updateData.deductions = Math.round(_updateData.deductions * 100);
      }
      if (_updateData.netSalary !== undefined) {
        _updateData.netSalary = Math.round(_updateData.netSalary * 100);
      }

      const payrollRecord = await prisma.payrollRecord.update({
        where: { id: input.id },
        data: _updateData,
        include: {
          employee: { 
            select: { 
              firstName: true, 
              lastName: true, 
              employeeNumber: true,
              user: { select: { firstName: true, lastName: true } }
            } 
          },
        },
      });

      return { success: true, data: payrollRecord };
    }),

  // ========================================
  // DEPARTMENT MANAGEMENT
  // ========================================

  // Get departments,
  getDepartments: publicProcedure
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

      const [departments, total] = await Promise.all([
        prisma.department.findMany({
          where,
          include: {
            _count: {
              select: { employees: true },
            },
          },
          skip: _skip,
          take: input.limit,
          orderBy: { name: "asc" },
        }),
        prisma.department.count({ where }),
      ]);

      return {
        success: true,
        data: departments,
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          totalPages: Math.ceil(total / input.limit),
        },
      };
    }),

  // ========================================
  // DASHBOARD & ANALYTICS
  // ========================================

  // Get HRMS dashboard data,
  getDashboardData: publicProcedure
    .query(async () => {
      try {
        const [
          totalEmployees,
          totalDepartments,
          activeEmployees,
          onLeaveEmployees,
          recentHires,
          recentLeaveRequests,
          recentPayrollRecords,
          departmentStats,
        ] = await Promise.all([
        prisma.employee.count(),
        prisma.department.count(),
        prisma.employee.count({ where: { employmentStatus: "ACTIVE" } }),
        prisma.employee.count({ where: { employmentStatus: "ON_LEAVE" } }),
        prisma.employee.findMany({
          take: 5,
          where: { employmentStatus: "ACTIVE" },
          orderBy: { hireDate: "desc" },
          select: { 
            id: true, 
            firstName: true, 
            lastName: true, 
            employeeNumber: true, 
            hireDate: true, 
            department: { select: { name: true } } 
          },
        }),
        prisma.leaveRequest.findMany({
          take: 5,
          orderBy: { startDate: "desc" },
          include: {
            employee: { 
              select: { 
                firstName: true, 
                lastName: true, 
                employeeNumber: true,
                user: { select: { firstName: true, lastName: true } }
              } 
            },
          },
        }),
        prisma.payrollRecord.findMany({
          take: 5,
          orderBy: { paymentDate: "desc" },
          include: {
            employee: { 
              select: { 
                firstName: true, 
                lastName: true, 
                employeeNumber: true,
                user: { select: { firstName: true, lastName: true } }
              } 
            },
          },
        }),
        prisma.department.findMany({
          include: {
            _count: {
              select: { employees: true },
            },
          },
        }),
      ]);

        return {
          success: true,
          data: {
            totalEmployees,
            totalDepartments,
            activeEmployees,
            onLeaveEmployees,
            recentHires,
            recentLeaveRequests,
            recentPayrollRecords,
            departmentStats: departmentStats.map(dept => ({
              id: dept.id,
              name: dept.name,
              code: dept.code,
              employeeCount: dept._count.employees,
            })),
          },
        };
      } catch {
        // Return mock data if database connection fails
        return {
          success: true,
          data: {
            totalEmployees: 0,
            totalDepartments: 0,
            activeEmployees: 0,
            onLeaveEmployees: 0,
            recentHires: [],
            recentLeaveRequests: [],
            recentPayrollRecords: [],
            departmentStats: [],
          },
        };
      }
    }),

  // Get HRMS analytics,
  getHRMSAnalytics: publicProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
      type: z.enum(["HIRES", "LEAVES", "PAYROLL"]).optional(),
    }))
    .query(async ({ input }) => {
      const _startDate = new Date(input.startDate);
      const _endDate = new Date(input.endDate);

      const where = {
        hireDate: {
          gte: _startDate,
          lte: _endDate,
        },
      };

      const [hires, leaves, payroll] = await Promise.all([
        prisma.employee.findMany({
          where,
          select: { hireDate: true, department: { select: { name: true } } },
        }),
        prisma.leaveRequest.findMany({
          where: {
            startDate: {
              gte: _startDate,
              lte: _endDate,
            },
          },
          select: { startDate: true, leaveType: true, status: true },
        }),
        prisma.payrollRecord.findMany({
          where: {
            paymentDate: {
              gte: _startDate,
              lte: _endDate,
            },
          },
          select: { paymentDate: true, netSalary: true, status: true },
        }),
      ]);

      // Group by date
      const dailyData = {
        hires: hires.reduce((acc: Record<string, unknown>, hire) => {
          const _date = hire.hireDate.toISOString().split('T')[0];
          if (_date) {
            acc[_date] = acc[_date] ?? { date: _date, count: 0 };
            const record = acc[_date] as Record<string, number>;
            if (record) {
              record.count = (record.count ?? 0) + 1;
            }
          }
          return acc;
        }, {}),
        leaves: leaves.reduce((acc: Record<string, unknown>, leave) => {
          const _date = leave.startDate.toISOString().split('T')[0];
          if (_date) {
            acc[_date] = acc[_date] ?? { date: _date, ANNUAL_LEAVE: 0, SICK_LEAVE: 0, PERSONAL_LEAVE: 0, MATERNITY_LEAVE: 0, PATERNITY_LEAVE: 0, UNPAID_LEAVE: 0 };
            const record = acc[_date] as Record<string, number>;
            if (record && leave.leaveType) {
                record[leave.leaveType as keyof typeof record] = (record[leave.leaveType as keyof typeof record] ?? 0) + 1;
            }
          }
          return acc;
        }, {}),
        payroll: payroll.reduce((acc: Record<string, unknown>, record) => {
          const _date = record.paymentDate?.toISOString().split('T')[0];
          if (_date) {
            acc[_date] = acc[_date] ?? { date: _date, totalPay: 0, count: 0 };
            const recordData = acc[_date] as Record<string, number>;
            if (recordData) {
              recordData.totalPay = (recordData.totalPay ?? 0) + (record.netSalary / 100); // Convert from cents
              recordData.count = (recordData.count ?? 0) + 1;
            }
          }
          return acc;
        }, {}),
      };

      return {
        success: true,
        data: {
          dailyData: {
            hires: Object.values(dailyData.hires),
            leaves: Object.values(dailyData.leaves),
            payroll: Object.values(dailyData.payroll),
          },
          totals: {
            hires: hires.length,
            leaves: leaves.length,
            payroll: payroll.length,
          },
        },
      };
    }),
});
