import { Server as SocketIOServer, type ServerOptions } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import { prisma } from './db';

import { getWebSocketConfig } from '../env';

export const initializeWebSocket = (httpServer: HTTPServer) => {
  const config = getWebSocketConfig();
  const io = new SocketIOServer(httpServer, config as Partial<ServerOptions>); 

  // Handle connections
  io.on('connection', (socket) => {
    // console.log('Client connected:', socket.id);

    // Join dashboard room
    socket.on('join-dashboard', async () => {
      socket.join('dashboard');
      // console.log('Client joined dashboard room');
    });

    // Join equipment tracking room
    socket.on('join-equipment-tracking', async (equipmentId: string) => {
      socket.join(`equipment-${equipmentId}`);
      // console.log(`Client joined equipment tracking room: ${equipmentId}`);
    });

    // Join inventory room
    socket.on('join-inventory', async () => {
      socket.join('inventory');
      // console.log('Client joined inventory room');
    });

    // Handle equipment status updates
    socket.on('equipment-status-update', async (data) => {
      try {
        // Update equipment status in database
        await prisma.equipment.update({
          where: { id: data.equipmentId },
          data: {
            status: data.status,
            location: data.location,
            totalOperatingHours: data.operatingHours,
            lastMaintenanceDate: data.lastMaintenanceDate,
            nextMaintenanceDate: data.nextMaintenanceDate,
          }
        });

        // Broadcast to all clients tracking this equipment
        io.to(`equipment-${data.equipmentId}`).emit('equipment-status', data);
        
        // Send alert if maintenance is due
        if (data.maintenanceDue) {
          io.to('dashboard').emit('alert', {
            id: `maintenance-${data.equipmentId}`,
            type: 'warning',
            title: 'Maintenance Due',
            message: `Equipment ${data.equipmentName} requires maintenance`,
            timestamp: new Date(),
            equipmentId: data.equipmentId
          });
        }
      } catch {
        // console.error('Error updating equipment status:', error);
      }
    });

    // Handle inventory updates
    socket.on('inventory-update', async (data) => {
      try {
        // Update inventory in database
        await prisma.inventoryItem.update({
          where: { id: data.inventoryId },
          data: {
            quantity: data.quantity,
            availableQuantity: data.availableQuantity,
          }
        });

        // Broadcast to inventory room
        io.to('inventory').emit('inventory-update', data);

        // Send low stock alert
        if (data.lowStock) {
          io.to('dashboard').emit('alert', {
            id: `low-stock-${data.productId}`,
            type: 'warning',
            title: 'Low Stock Alert',
            message: `Product ${data.productName} is running low on stock`,
            timestamp: new Date(),
            productId: data.productId
          });
        }
      } catch {
        // console.error('Error updating inventory:', error);
      }
    });

    // Handle safety alerts
    socket.on('safety-alert', (data) => {
      io.to('dashboard').emit('alert', {
        id: `safety-${Date.now()}`,
        type: 'error',
        title: 'Safety Alert',
        message: data.message,
        timestamp: new Date(),
        location: data.location,
        severity: data.severity
      });
    });

    // Handle GPS location updates
    socket.on('gps-update', async (data) => {
      try {
        // Update equipment location
        await prisma.equipment.update({
          where: { id: data.equipmentId },
          data: {
            location: `${data.latitude},${data.longitude}`,
          }
        });

        // Broadcast location update
        io.to(`equipment-${data.equipmentId}`).emit('gps-update', data);
      } catch {
        // console.error('Error updating GPS location:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      // console.log('Client disconnected:', socket.id);
    });
  });

  // Periodic dashboard updates
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
};

// Function to get real-time dashboard data
async function getDashboardData() {
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
}
