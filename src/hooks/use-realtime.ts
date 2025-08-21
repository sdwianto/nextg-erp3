import { useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { getWebSocketUrl } from '../utils/client-config';

interface RealtimeData {
  inventory: {
    totalItems: number;
    lowStock: number;
    outOfStock: number;
    value: number;
  };
  rental: {
    activeRentals: number;
    pendingReturns: number;
    maintenanceDue: number;
    revenue: number;
  };
  finance: {
    monthlyRevenue: number;
    pendingPayments: number;
    expenses: number;
    profit: number;
  };
  hr: {
    totalEmployees: number;
    onLeave: number;
    newHires: number;
    attendance: number;
  };
  maintenance: {
    totalEquipment: number;
    scheduledMaintenance: number;
    overdueMaintenance: number;
    inProgress: number;
    completedThisMonth: number;
    totalCost: number;
  };
  alerts: Array<{
    id: string;
    type: 'warning' | 'error' | 'info' | 'success';
    title: string;
    message: string;
    timestamp: Date;
  }>;
}

export const useRealtime = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [data, setData] = useState<RealtimeData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Skip WebSocket connection in production (Vercel doesn't support WebSocket)
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    // Initialize WebSocket connection with consistent port configuration
    const websocketUrl = getWebSocketUrl();
    
    // Prevent multiple connections
    if (socket) {
      return;
    }

    // Only attempt connection if websocketUrl is valid
    if (!websocketUrl || websocketUrl === 'undefined' || websocketUrl === 'null') {
      // WebSocket URL not configured, skipping real-time connection
      return;
    }

    const newSocket = io(websocketUrl, {
      transports: ['polling', 'websocket'], // Start with polling first
      autoConnect: true,
      timeout: 5000, // Reduced timeout
      reconnection: false, // Disable reconnection to prevent spam
      forceNew: true,
      withCredentials: true
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('connect_error', () => {
      // WebSocket connection failed
      setIsConnected(false);
    });

    newSocket.on('dashboard-update', (newData: RealtimeData) => {
      setData(newData);
    });

    newSocket.on('alert', () => {
      // Handle real-time alerts
    });

    newSocket.on('equipment-status', () => {
      // Handle equipment status updates
    });

    newSocket.on('inventory-update', () => {
      // Handle inventory updates
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [socket]);

  const emitEvent = (event: string, data: Record<string, unknown>) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  };

  return {
    data,
    isConnected,
    emitEvent,
    socket,
  };
};
