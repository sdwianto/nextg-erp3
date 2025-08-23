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
            ? ['https://nextg-erp3.vercel.app', 'https://*.vercel.app']
            : ['http://localhost:3002', 'http://localhost:3000'],
          methods: ['GET', 'POST', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'X-Client-Type'],
          credentials: true
        },
        transports: ['polling'],
        allowEIO3: true,
        pingTimeout: 60000,
        pingInterval: 25000
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
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' 
      ? 'https://nextg-erp3.vercel.app' 
      : 'http://localhost:3002');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Client-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      // Initialize WebSocket
      const socketIO = initWebSocket(req, res);
      
      res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' 
        ? 'https://nextg-erp3.vercel.app' 
        : 'http://localhost:3002');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      
      res.json({
        success: true,
        message: 'WebSocket server ready',
        socketId: socketIO?.engine?.clientsCount || 0,
        status: 'active',
        environment: process.env.NODE_ENV
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to initialize WebSocket server',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// Export for type safety
export { initWebSocket };
