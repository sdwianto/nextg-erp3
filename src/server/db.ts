import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error', 'warn'], // Reduced logging to avoid spam
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Add connection error handling with retry logic
let connectionAttempts = 0;
const maxConnectionAttempts = 3;

const connectWithRetry = async () => {
  try {
    await prisma.$connect();
    // Database connected successfully
    connectionAttempts = 0; // Reset on success
  } catch (error) {
    connectionAttempts++;
    // Database connection failed (attempt ${connectionAttempts}/${maxConnectionAttempts}): ${error}
    
    if (connectionAttempts < maxConnectionAttempts) {
      // Retrying connection in 5 seconds...
      setTimeout(connectWithRetry, 5000);
    } else {
      // Max connection attempts reached. Database connection failed.
    }
  }
};

// Initial connection
connectWithRetry();

// Graceful shutdown
process.on('beforeExit', async () => {
  try {
    await prisma.$disconnect();
    // Database disconnected gracefully
  } catch (error) {
    // Error disconnecting database: ${error}
  }
});

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await prisma.$disconnect();
    // Database disconnected on SIGINT
    process.exit(0);
  } catch (error) {
    // Error disconnecting database on SIGINT: ${error}
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  try {
    await prisma.$disconnect();
    // Database disconnected on SIGTERM
    process.exit(0);
  } catch (error) {
    // Error disconnecting database on SIGTERM: ${error}
    process.exit(1);
  }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
