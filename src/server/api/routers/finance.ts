import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Input validation schemas
const createAccountSchema = z.object({
  accountNumber: z.string().min(1, "Account number is required"),
  name: z.string().min(1, "Account name is required"),
  type: z.enum(["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"]),
  parentAccountId: z.string().optional(),
  isActive: z.boolean().default(true),
});

const createTransactionSchema = z.object({
  transactionNumber: z.string().min(1, "Transaction number is required"),
  userId: z.string().min(1, "User is required"),
  transactionType: z.enum(["SALE", "PURCHASE", "RENTAL_INCOME", "MAINTENANCE_EXPENSE", "SALARY_EXPENSE", "UTILITY_EXPENSE", "OTHER_INCOME", "OTHER_EXPENSE"]),
  amount: z.number().min(0.01, "Amount must be positive"),
  currency: z.string().default("IDR"),
  debitAccount: z.string().optional(),
  creditAccount: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  transactionDate: z.date(),
});

export const financeRouter = createTRPCRouter({
  // ========================================
  // ACCOUNT MANAGEMENT
  // ========================================

  // Get all accounts
  getAccounts: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(50),
      search: z.string().optional(),
      type: z.enum(["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"]).optional(),
      isActive: z.boolean().optional(),
    }))
    .query(async ({ input }) => {
      const skip = (input.page - 1) * input.limit;

      const where = {
        ...(input.search && {
          OR: [
            { accountNumber: { contains: input.search, mode: "insensitive" as const } },
            { name: { contains: input.search, mode: "insensitive" as const } },
          ],
        }),
        ...(input.type && { type: input.type }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      };

      const [accounts, total] = await Promise.all([
        prisma.account.findMany({
          where,
          include: {
            parentAccount: true,
            childAccounts: true,
          },
          skip,
          take: input.limit,
          orderBy: { accountNumber: "asc" },
        }),
        prisma.account.count({ where }),
      ]);

      return {
        success: true,
        data: accounts,
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          totalPages: Math.ceil(total / input.limit),
        },
      };
    }),

  // Get account by ID
  getAccountById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const account = await prisma.account.findUnique({
        where: { id: input.id },
        include: {
          parentAccount: true,
          childAccounts: true,
        },
      });

      if (!account) {
        throw new Error("Account not found");
      }

      return { success: true, data: account };
    }),

  // Create account
  createAccount: protectedProcedure
    .input(createAccountSchema)
    .mutation(async ({ input }) => {
      const account = await prisma.account.create({
        data: input,
        include: {
          parentAccount: true,
          childAccounts: true,
        },
      });

      return { success: true, data: account };
    }),

  // Update account
  updateAccount: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: createAccountSchema.partial(),
    }))
    .mutation(async ({ input }) => {
      const account = await prisma.account.update({
        where: { id: input.id },
        data: input.data,
        include: {
          parentAccount: true,
          childAccounts: true,
        },
      });

      return { success: true, data: account };
    }),

  // ========================================
  // TRANSACTION MANAGEMENT
  // ========================================

  // Get transactions
  getTransactions: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      transactionType: z.enum(["SALE", "PURCHASE", "RENTAL_INCOME", "MAINTENANCE_EXPENSE", "SALARY_EXPENSE", "UTILITY_EXPENSE", "OTHER_INCOME", "OTHER_EXPENSE"]).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const skip = (input.page - 1) * input.limit;

      const where = {
        ...(input.transactionType && { transactionType: input.transactionType }),
        ...(input.startDate && input.endDate && {
          transactionDate: {
            gte: new Date(input.startDate),
            lte: new Date(input.endDate),
          },
        }),
      };

      const [transactions, total] = await Promise.all([
        prisma.financialTransaction.findMany({
          where,
          include: {
            user: { select: { firstName: true, lastName: true } },
          },
          skip,
          take: input.limit,
          orderBy: { transactionDate: "desc" },
        }),
        prisma.financialTransaction.count({ where }),
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

  // Create transaction
  createTransaction: protectedProcedure
    .input(createTransactionSchema)
    .mutation(async ({ input }) => {
      const transaction = await prisma.financialTransaction.create({
        data: {
          ...input,
          amount: Math.round(input.amount * 100), // Convert to cents
        },
        include: {
          user: { select: { firstName: true, lastName: true } },
        },
      });

      return { success: true, data: transaction };
    }),

  // ========================================
  // DASHBOARD & ANALYTICS
  // ========================================

  // Get finance dashboard data
  getDashboardData: publicProcedure
    .query(async () => {
      const [
        totalAccounts,
        totalTransactions,
        recentTransactions,
        accountBalances,
      ] = await Promise.all([
        prisma.account.count(),
        prisma.financialTransaction.count(),
        prisma.financialTransaction.findMany({
          take: 10,
          include: {
            user: { select: { firstName: true, lastName: true } },
          },
          orderBy: { transactionDate: "desc" },
        }),
        prisma.account.findMany({
          where: { isActive: true },
          select: {
            id: true,
            accountNumber: true,
            name: true,
            type: true,
            balance: true,
          },
        }),
      ]);

      return {
        success: true,
        data: {
          totalAccounts,
          totalTransactions,
          recentTransactions,
          accountBalances: accountBalances.map(account => ({
            ...account,
            balance: account.balance / 100, // Convert from cents
          })),
        },
      };
    }),

  // Get financial analytics
  getFinancialAnalytics: publicProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
      type: z.enum(["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"]).optional(),
    }))
    .query(async ({ input }) => {
      const startDate = new Date(input.startDate);
      const endDate = new Date(input.endDate);

      const where = {
        transactionDate: {
          gte: startDate,
          lte: endDate,
        },
      };

      const transactions = await prisma.financialTransaction.findMany({
        where,
        orderBy: { transactionDate: "asc" },
      });

             // Group by date and transaction type
       const dailyData = transactions.reduce((acc: Record<string, Record<string, number>>, transaction) => {
         const date = transaction.transactionDate.toISOString().split('T')[0];
         if (date) {
           acc[date] ??= { 
             date: 0, 
             SALE: 0, 
             PURCHASE: 0, 
             RENTAL_INCOME: 0, 
             MAINTENANCE_EXPENSE: 0,
             SALARY_EXPENSE: 0,
             UTILITY_EXPENSE: 0,
             OTHER_INCOME: 0,
             OTHER_EXPENSE: 0
           };
           
           const amount = transaction.amount / 100; // Convert from cents
           acc[date][transaction.transactionType] += amount;
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
