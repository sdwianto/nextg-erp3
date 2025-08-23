import type { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';
// import { prisma } from './db'; // DISABLED DATABASE CONNECTION

export function initializeWebSocket(httpServer: HTTPServer) {
  // DISABLED WEBSOCKET SERVER FOR DEVELOPMENT
  // WebSocket server disabled for development
  return null;

  // ORIGINAL WEBSOCKET CODE (DISABLED)
  /*
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3002",
      methods: ["GET", "POST"],
      credentials: true
    },
    path: process.env.NEXT_PUBLIC_WS_PATH || "/api/websocket"
  });

  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    socket.on('join-dashboard', () => {
      socket.join('dashboard');
      console.log('📊 Client joined dashboard room:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
    });
  });

  // Send dashboard updates every 30 seconds
  setInterval(async () => {
    try {
      // Get real-time dashboard data
      const dashboardData = await getDashboardData();
      
      // Broadcast to dashboard room
      io.to('dashboard').emit('dashboard-update', dashboardData);
    } catch {
      // console.error('Error sending dashboard update:', error);
    }
  }, 30000); // Update every 30 seconds

  return io;
  */
}

// Function to get real-time dashboard data (DISABLED)
async function getDashboardData() {
  // DISABLED DATABASE QUERIES FOR DEVELOPMENT
  // Dashboard data queries disabled for development
  return null;

  // ORIGINAL DATABASE QUERIES (DISABLED)
  /*
  try {
    // Get inventory data
    const inventoryCount = await prisma.product.count();
    const lowStockProducts = await prisma.product.findMany({
      where: {
        currentStock: {
          lte: prisma.product.fields.minStockLevel
        }
      }
    });
    const outOfStockProducts = await prisma.product.findMany({
      where: { currentStock: 0 }
    });

    // Get equipment data
    const equipmentCount = await prisma.equipment.count();
    const inUseEquipment = await prisma.equipment.count({
      where: { status: 'IN_USE' }
    });
    const maintenanceDue = await prisma.maintenanceRecord.count({
      where: {
        status: 'SCHEDULED',
        scheduledDate: {
          lte: new Date()
        }
      }
    });

    // Get financial data
    const totalRevenue = await prisma.financialTransaction.aggregate({
      where: {
        transactionType: 'SALE',
        transactionDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: { amount: true }
    });

    // Get HR data
    const employeeCount = await prisma.employee.count({
      where: { employmentStatus: 'ACTIVE' }
    });

    return {
      inventory: {
        totalItems: inventoryCount,
        lowStock: lowStockProducts.length,
        outOfStock: outOfStockProducts.length,
        value: 0 // TODO: Calculate inventory value
      },
      rental: {
        activeRentals: inUseEquipment,
        pendingReturns: 0, // TODO: Calculate pending returns
        maintenanceDue: maintenanceDue,
        revenue: totalRevenue._sum.amount ?? 0
      },
      finance: {
        monthlyRevenue: totalRevenue._sum.amount ?? 0,
        pendingPayments: 0, // TODO: Calculate pending payments
        expenses: 0, // TODO: Calculate expenses
        profit: 0 // TODO: Calculate profit
      },
      hr: {
        totalEmployees: employeeCount,
        onLeave: 0, // TODO: Calculate on leave
        newHires: 0, // TODO: Calculate new hires
        attendance: 0 // TODO: Calculate attendance
      },
      maintenance: {
        totalEquipment: equipmentCount,
        scheduledMaintenance: maintenanceDue,
        overdueMaintenance: 0, // TODO: Calculate overdue
        inProgress: 0, // TODO: Calculate in progress
        completedThisMonth: 0, // TODO: Calculate completed
        totalCost: 0 // TODO: Calculate total cost
      }
    };
  } catch {
    // console.error('Error getting dashboard data:', error);
    return null;
  }
  */
}
