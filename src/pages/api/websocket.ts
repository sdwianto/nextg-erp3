import type { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

// WebSocket server instance
let io: SocketIOServer | null = null;

// Initialize WebSocket server for Vercel
const initWebSocket = (req: NextApiRequest, res: NextApiResponse) => {
  if (!io) {
    // Get the HTTP server from Next.js
    const httpServer = (res.socket as any)?.server;
    
    if (httpServer && !httpServer.io) {
      io = new SocketIOServer(httpServer, {
        path: '/api/websocket',
        addTrailingSlash: false,
        cors: {
          origin: process.env.NODE_ENV === 'production' 
            ? [process.env.NEXT_PUBLIC_FRONTEND_URL || '*']
            : ['http://localhost:3002', 'http://localhost:3000'],
          methods: ['GET', 'POST'],
          credentials: true
        },
        transports: ['polling', 'websocket']
      });

      // WebSocket event handlers
      io.on('connection', (socket) => {
        // console.log('Client connected:', socket.id);

        socket.on('join-dashboard', () => {
          socket.join('dashboard');
        });

        socket.on('join-equipment-tracking', (equipmentId: string) => {
          socket.join(`equipment-${equipmentId}`);
        });

        socket.on('join-inventory', () => {
          socket.join('inventory');
        });

        socket.on('disconnect', () => {
          // console.log('Client disconnected:', socket.id);
        });
      });

      // Periodic dashboard updates
      setInterval(async () => {
        try {
          // Get real-time dashboard data
          const dashboardData = {
            inventory: {
              totalItems: 0,
              lowStock: 0,
              outOfStock: 0,
              value: 0
            },
            rental: {
              activeRentals: 0,
              pendingReturns: 0,
              maintenanceDue: 0,
              revenue: 0
            },
            finance: {
              monthlyRevenue: 0,
              pendingPayments: 0,
              expenses: 0,
              profit: 0
            },
            hr: {
              totalEmployees: 0,
              onLeave: 0,
              newHires: 0,
              attendance: 0
            },
            maintenance: {
              totalEquipment: 0,
              scheduledMaintenance: 0,
              overdueMaintenance: 0,
              inProgress: 0,
              completedThisMonth: 0,
              totalCost: 0
            }
          };
          
          // Broadcast to dashboard room
          if (io) {
            io.to('dashboard').emit('dashboard-update', dashboardData);
          }
        } catch (error) {
          // console.error('Error sending dashboard update:', error);
        }
      }, 30000); // Update every 30 seconds

      httpServer.io = io;
    } else if (httpServer?.io) {
      io = httpServer.io;
    }
  }

  return io;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Initialize WebSocket
    const socketIO = initWebSocket(req, res);
    
    res.json({
      success: true,
      message: 'WebSocket server ready',
      socketId: socketIO?.engine?.clientsCount || 0,
      status: 'active'
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// Export for type safety
export { initWebSocket };
