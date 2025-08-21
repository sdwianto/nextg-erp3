import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { prisma } from "@/server/db";


// Input validation schemas,
  const createCustomerSchema = z.object({
  customerNumber: z.string().min(1, "Customer number is required"),
  name: z.string().min(1, "Customer name is required"),
  type: z.enum(["INDIVIDUAL", "COMPANY", "GOVERNMENT"]).default("INDIVIDUAL"),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().default("Indonesia"),
  companyName: z.string().optional(),
  taxNumber: z.string().optional(),
  industry: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "PROSPECT", "LEAD"]).default("ACTIVE"),
  source: z.string().optional(),
  notes: z.string().optional(),
  creditLimit: z.number().min(0).default(0),
});

const createContactSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  userId: z.string().min(1, "User is required"),
  contactType: z.enum(["PHONE_CALL", "EMAIL", "MEETING", "VISIT", "OTHER"]),
  contactDate: z.date(),
  summary: z.string().min(1, "Summary is required"),
  details: z.string().optional(),
  followUpDate: z.date().optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).default("OPEN"),
});

export const crmRouter = createTRPCRouter({
  // ========================================
  // CUSTOMER MANAGEMENT
  // ========================================

  // Get all customers,
  getCustomers: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      search: z.string().optional(),
      status: z.enum(["ACTIVE", "INACTIVE", "PROSPECT", "LEAD"]).optional(),
      industry: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const _skip = (input.page - 1) * input.limit;

      const where = {
        ...(input.search && {
          OR: [
            { name: { contains: input.search, mode: "insensitive" as const } },
            { email: { contains: input.search, mode: "insensitive" as const } },
            { companyName: { contains: input.search, mode: "insensitive" as const } },
          ],
        }),
        ...(input.status && { status: input.status }),
        ...(input.industry && { industry: input.industry }),
      };

      const [customers, total] = await Promise.all([
        prisma.customer.findMany({
          where,
          include: {
            contacts: true,
            orders: true,
            _count: {
              select: {
                contacts: true,
                orders: true,
              },
            },
          },
          skip: _skip,
          take: input.limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.customer.count({ where }),
      ]);

      return {
        success: true,
        data: customers,
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          totalPages: Math.ceil(total / input.limit),
        },
      };
    }),

  // Get customer by ID,
  getCustomerById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const customer = await prisma.customer.findUnique({
        where: { id: input.id },
        include: {
          contacts: {
            include: {
              user: { select: { firstName: true, lastName: true } },
            },
            orderBy: { contactDate: "desc" },
          },
          orders: {
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      });

      if (!customer) {
        throw new Error("Customer not found");
      }

      return { success: true, data: customer };
    }),

  // Create customer,
  createCustomer: protectedProcedure
    .input(createCustomerSchema)
    .mutation(async ({ input }) => {
      const customer = await prisma.customer.create({
        data: input,
        include: {
          contacts: true,
          orders: true,
        },
      });

      return { success: true, data: customer };
    }),

  // Update customer,
  updateCustomer: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: createCustomerSchema.partial(),
    }))
    .mutation(async ({ input }) => {
      const customer = await prisma.customer.update({
        where: { id: input.id },
        data: input.data,
        include: {
          contacts: true,
          orders: true,
        },
      });

      return { success: true, data: customer };
    }),

  // ========================================
  // CONTACT MANAGEMENT
  // ========================================

  // Get contacts for a customer,
  getCustomerContacts: publicProcedure
    .input(z.object({
      customerId: z.string(),
    }))
    .query(async ({ input }) => {
      const contacts = await prisma.customerContact.findMany({
        where: { customerId: input.customerId },
        include: {
          user: { select: { firstName: true, lastName: true } },
        },
        orderBy: { contactDate: "desc" },
      });

      return { success: true, data: contacts };
    }),

  // Create contact,
  createContact: protectedProcedure
    .input(createContactSchema)
    .mutation(async ({ input }) => {
      const contact = await prisma.customerContact.create({
        data: input,
        include: {
          user: { select: { firstName: true, lastName: true } },
        },
      });

      return { success: true, data: contact };
    }),

  // Update contact,
  updateContact: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: createContactSchema.partial(),
    }))
    .mutation(async ({ input }) => {
      const contact = await prisma.customerContact.update({
        where: { id: input.id },
        data: input.data,
        include: {
          user: { select: { firstName: true, lastName: true } },
        },
      });

      return { success: true, data: contact };
    }),

  // ========================================
  // DASHBOARD & ANALYTICS
  // ========================================

  // Get CRM dashboard data,
  getDashboardData: publicProcedure
    .query(async () => {
      const [
        totalCustomers,
        recentCustomers,
        recentContacts,
        customerStats,
      ] = await Promise.all([
        prisma.customer.count(),
        prisma.customer.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: { id: true, name: true, email: true, status: true, createdAt: true },
        }),
        prisma.customerContact.findMany({
          take: 5,
          include: {
            customer: { select: { name: true } },
            user: { select: { firstName: true, lastName: true } },
          },
          orderBy: { contactDate: "desc" },
        }),
        prisma.customer.groupBy({
          by: ["status"],
          _count: { id: true },
        }),
      ]);

      return {
        success: true,
        data: {
          totalCustomers,
          recentCustomers,
          recentContacts,
          customerStats: customerStats.map(stat => ({
            status: stat.status,
            count: stat._count.id,
          })),
        },
      };
    }),

  // Get CRM analytics,
  getCRMAnalytics: publicProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
    }))
    .query(async ({ input }) => {
      const _startDate = new Date(input.startDate);
      const _endDate = new Date(input.endDate);

      const where = {
        createdAt: {
          gte: _startDate,
          lte: _endDate,
        },
      };

      const [customers, contacts] = await Promise.all([
        prisma.customer.findMany({
          where,
          select: { createdAt: true, status: true },
        }),
        prisma.customerContact.findMany({
          where: {
            contactDate: {
              gte: _startDate,
              lte: _endDate,
            },
          },
          select: { contactDate: true, contactType: true, status: true },
        }),
      ]);

      // Group by date,
  const dailyData = {
        customers: customers.reduce((acc: Record<string, unknown>, customer) => {
          const _date = customer.createdAt.toISOString().split('T')[0];
          if (_date) {
            acc[_date] = acc[_date] ?? { date: _date, ACTIVE: 0, INACTIVE: 0, PROSPECT: 0, LEAD: 0 };
            const record = acc[_date] as Record<string, number>;
            if (record && customer.status) {
              record[customer.status as keyof typeof record] = (record[customer.status as keyof typeof record] ?? 0) + 1;
            }
          }
          return acc;
        }, {}),
        contacts: contacts.reduce((acc: Record<string, unknown>, contact) => {
          const _date = contact.contactDate.toISOString().split('T')[0];
          if (_date) {
            acc[_date] = acc[_date] ?? { date: _date, PHONE_CALL: 0, EMAIL: 0, MEETING: 0, VISIT: 0, OTHER: 0 };
            const record = acc[_date] as Record<string, number>;
            if (record && contact.contactType) {
              record[contact.contactType as keyof typeof record] = (record[contact.contactType as keyof typeof record] ?? 0) + 1  ;
            }
          }
          return acc; 
        }, {}),
      };

      return {
        success: true,
        data: {
          dailyData: {
            customers: Object.values(dailyData.customers),
            contacts: Object.values(dailyData.contacts),
          },
          totals: {
            customers: customers.length,
            contacts: contacts.length,
          },
        },
      };
    }),
});
