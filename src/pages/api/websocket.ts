import type { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";

export const config = { api: { bodyParser: false } };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // SOLUSI B: Konfigurasi Socket.IO yang eksplisit & tahan-bundler
  // @ts-ignore - augment
  if (!res.socket.server.io) {
    // @ts-ignore
    const io = new IOServer(res.socket.server, {
      path: "/api/websocket",
      transports: ["websocket", "polling"],
      cors: { 
        origin: process.env.NODE_ENV === 'production' 
          ? ['https://nextg-erp3.vercel.app', 'https://*.vercel.app']
          : ['http://localhost:3002', 'http://localhost:3000'],
        methods: ["GET", "POST", "OPTIONS"],
        credentials: true
      },
      allowEIO3: true,
      pingTimeout: 60000,
      pingInterval: 25000,
      connectTimeout: 45000,
      maxHttpBufferSize: 1e6,
    });

    // Log URL request untuk memastikan path tidak pernah terpotong
    // @ts-ignore
    io.engine.on("connection", (raw) => {
      // @ts-ignore
      // eslint-disable-next-line no-console
                // console.log("WS incoming:", raw?.request?.url);
    });

    io.on("connection", (socket) => {
      // eslint-disable-next-line no-console
              // console.log("🔌 ERP Client connected:", socket.id);

      // ERP-specific room management
      socket.on('join-dashboard', () => {
        socket.join('dashboard');
        // eslint-disable-next-line no-console
                  // console.log('📊 ERP: Client joined dashboard room');
      });

      socket.on('join-equipment-tracking', (equipmentId: string) => {
        socket.join(`equipment-${equipmentId}`);
        // eslint-disable-next-line no-console
                  // console.log('🔧 ERP: Client joined equipment tracking:', equipmentId);
      });

      socket.on('join-inventory', () => {
        socket.join('inventory');
        // eslint-disable-next-line no-console
                  // console.log('📦 ERP: Client joined inventory room');
      });

      socket.on('join-procurement', () => {
        socket.join('procurement');
        // eslint-disable-next-line no-console
                  // console.log('🛒 ERP: Client joined procurement room');
      });

      socket.on('join-finance', () => {
        socket.join('finance');
        // eslint-disable-next-line no-console
                  // console.log('💰 ERP: Client joined finance room');
      });

      socket.on('disconnect', (reason) => {
        // eslint-disable-next-line no-console
        // console.log('🔌 ERP Client disconnected:', socket.id, 'Reason:', reason);
      });

      socket.on('error', (error) => {
        // eslint-disable-next-line no-console
        // console.log('❌ ERP Socket error:', error);
      });

      // contoh event
      socket.emit("server:hello", { ts: Date.now() });
      socket.on("client:pong", () => {});
    });

    // ERP-optimized periodic dashboard updates
    setInterval(async () => {
      try {
        const dashboardData = {
          timestamp: new Date().toISOString(),
          inventory: {
            totalItems: Math.floor(Math.random() * 1000) + 500,
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
        
        if (io) {
          io.to('dashboard').emit('dashboard-update', dashboardData);
          // eslint-disable-next-line no-console
          // console.log('📊 ERP: Dashboard update sent to', io.sockets.sockets.size, 'clients');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('❌ ERP: Error sending dashboard update:', error);
      }
    }, 15000);

    // @ts-ignore
    res.socket.server.io = io;
  }
  
  res.end();
}
