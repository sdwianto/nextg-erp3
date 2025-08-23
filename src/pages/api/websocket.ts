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
      // ERP-optimized Socket.IO server configuration
      const serverConfig = {
        path: process.env.NODE_ENV === 'production' ? '/api/websocket' : '/socket.io/',
        addTrailingSlash: false,
        serveClient: false,
        cors: {
          origin: process.env.NODE_ENV === 'production' 
            ? ['https://nextg-erp3.vercel.app', 'https://*.vercel.app']
            : ['http://localhost:3002', 'http://localhost:3000'],
          methods: ['GET', 'POST', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'X-Client-Type', 'X-ERP-Version'],
          credentials: true
        },
        transports: ['polling' as any],
        allowEIO3: true,
        pingTimeout: 60000,
        pingInterval: 25000,
        connectTimeout: 45000,
        maxHttpBufferSize: 1e6, // 1MB for ERP data
        allowRequest: (req: any, callback: any) => {
          // ERP-specific request validation
          const erpVersion = req.headers['x-erp-version'];
          if (erpVersion === '1.1') {
            callback(null, true);
          } else {
            callback(null, true); // Allow legacy clients
          }
        }
      };

      io = new SocketIOServer(httpServer, serverConfig);

      // ERP-optimized WebSocket event handlers
      io.on('connection', (socket) => {
        // eslint-disable-next-line no-console
        console.log('🔌 ERP Client connected:', socket.id);

        // ERP-specific room management
        socket.on('join-dashboard', () => {
          socket.join('dashboard');
          // eslint-disable-next-line no-console
          console.log('📊 ERP: Client joined dashboard room');
        });

        socket.on('join-equipment-tracking', (equipmentId: string) => {
          socket.join(`equipment-${equipmentId}`);
          // eslint-disable-next-line no-console
          console.log('🔧 ERP: Client joined equipment tracking:', equipmentId);
        });

        socket.on('join-inventory', () => {
          socket.join('inventory');
          // eslint-disable-next-line no-console
          console.log('📦 ERP: Client joined inventory room');
        });

        socket.on('join-procurement', () => {
          socket.join('procurement');
          // eslint-disable-next-line no-console
          console.log('🛒 ERP: Client joined procurement room');
        });

        socket.on('join-finance', () => {
          socket.join('finance');
          // eslint-disable-next-line no-console
          console.log('💰 ERP: Client joined finance room');
        });

        socket.on('disconnect', (reason) => {
          // eslint-disable-next-line no-console
          console.log('🔌 ERP Client disconnected:', socket.id, 'Reason:', reason);
        });

        // ERP-specific error handling
        socket.on('error', (error) => {
          // eslint-disable-next-line no-console
          console.log('❌ ERP Socket error:', error);
        });
      });

      // ERP-optimized periodic dashboard updates
      setInterval(async () => {
        try {
          // Get real-time ERP dashboard data
          const dashboardData = {
            timestamp: new Date().toISOString(),
            inventory: {
              totalItems: Math.floor(Math.random() * 1000) + 500, // Simulated data
              lowStock: Math.floor(Math.random() * 50) + 10,
              outOfStock: Math.floor(Math.random() * 20) + 5,
              value: Math.floor(Math.random() * 100000) + 50000
            },
            rental: {
              activeRentals: Math.floor(Math.random() * 100) + 20,
              pendingReturns: Math.floor(Math.random() * 30) + 5,
              maintenanceDue: Math.floor(Math.random() * 15) + 3,
              revenue: Math.floor(Math.random() * 50000) + 10000
            },
            finance: {
              monthlyRevenue: Math.floor(Math.random() * 200000) + 50000,
              pendingPayments: Math.floor(Math.random() * 50000) + 10000,
              expenses: Math.floor(Math.random() * 100000) + 20000,
              profit: Math.floor(Math.random() * 100000) + 30000
            },
            hr: {
              totalEmployees: Math.floor(Math.random() * 200) + 50,
              onLeave: Math.floor(Math.random() * 20) + 5,
              newHires: Math.floor(Math.random() * 10) + 2,
              attendance: Math.floor(Math.random() * 95) + 85
            },
            maintenance: {
              totalEquipment: Math.floor(Math.random() * 500) + 100,
              scheduledMaintenance: Math.floor(Math.random() * 50) + 10,
              overdueMaintenance: Math.floor(Math.random() * 20) + 5,
              inProgress: Math.floor(Math.random() * 30) + 5,
              completedThisMonth: Math.floor(Math.random() * 100) + 20,
              totalCost: Math.floor(Math.random() * 50000) + 10000
            },
            alerts: [
              {
                id: `alert-${Date.now()}`,
                type: 'warning' as const,
                title: 'Low Stock Alert',
                message: 'Some items are running low on stock',
                timestamp: new Date()
              }
            ]
          };
          
          // Broadcast to ERP dashboard room
          if (io) {
            io.to('dashboard').emit('dashboard-update', dashboardData);
            // eslint-disable-next-line no-console
            console.log('📊 ERP: Dashboard update sent to', io.sockets.sockets.size, 'clients');
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('❌ ERP: Error sending dashboard update:', error);
        }
      }, 15000); // Update every 15 seconds for better ERP responsiveness

      httpServer.io = io;
    } else if (httpServer?.io) {
      io = httpServer.io;
    }
  }

  return io;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Debug logging for conditional path
  // eslint-disable-next-line no-console
  console.log('🔌 API Request:', {
    method: req.method,
    url: req.url,
    environment: process.env.NODE_ENV,
    expectedPath: process.env.NODE_ENV === 'production' ? '/api/websocket' : '/socket.io/'
  });

  // Handle CORS preflight - conditional based on environment
  if (req.method === 'OPTIONS') {
    const allowedOrigin = process.env.NODE_ENV === 'production' 
      ? 'https://nextg-erp3.vercel.app' 
      : 'http://localhost:3002';
      
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Client-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(200).end();
    return;
  }

  // Handle Socket.IO protocol requests - conditional based on environment
  const isSocketIORequest = process.env.NODE_ENV === 'production' 
    ? req.url?.includes('/api/websocket')
    : req.url?.includes('/socket.io/');
    
  if (isSocketIORequest) {
    try {
      // Initialize WebSocket
      const socketIO = initWebSocket(req, res);
      
      const allowedOrigin = process.env.NODE_ENV === 'production' 
        ? 'https://nextg-erp3.vercel.app' 
        : 'http://localhost:3002';
        
      res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      
      res.json({
        success: true,
        message: 'WebSocket server ready',
        socketId: socketIO?.engine?.clientsCount || 0,
        status: 'active',
        environment: process.env.NODE_ENV,
        url: req.url
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to initialize WebSocket server',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
    return;
  }

  // Handle general GET requests for WebSocket status
  if (req.method === 'GET' && !isSocketIORequest) {
    try {
      // Initialize WebSocket
      const socketIO = initWebSocket(req, res);
      
      const allowedOrigin = process.env.NODE_ENV === 'production' 
        ? 'https://nextg-erp3.vercel.app' 
        : 'http://localhost:3002';
        
      res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      
      res.json({
        success: true,
        message: 'WebSocket server ready',
        socketId: socketIO?.engine?.clientsCount || 0,
        status: 'active',
        environment: process.env.NODE_ENV,
        path: process.env.NODE_ENV === 'production' ? '/api/websocket' : '/socket.io/'
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to initialize WebSocket server',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  } else if (req.method !== 'OPTIONS' && !isSocketIORequest) {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// Export for type safety
export { initWebSocket };
