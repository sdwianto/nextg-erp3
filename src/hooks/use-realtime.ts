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
    // Initialize WebSocket connection with consistent port configuration
    const websocketUrl = getWebSocketUrl();
    
    // Prevent multiple connections
    if (socket) {
      return;
    }

    const newSocket = io(websocketUrl, {
      transports: ['polling', 'websocket'], // Start with polling first
      autoConnect: true,
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      forceNew: true,
      withCredentials: true
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error: any) => {
      console.log('WebSocket connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('dashboard-update', (newData: RealtimeData) => {
      console.log('Received real-time dashboard update:', newData);
      setData(newData);
    });

    newSocket.on('alert', (alert: any) => {
      console.log('Received real-time alert:', alert);
      // Handle real-time alerts
    });

    newSocket.on('equipment-status', (equipmentData: any) => {
      console.log('Received equipment status update:', equipmentData);
      // Handle equipment status updates
    });

    newSocket.on('inventory-update', (inventoryData: any) => {
      console.log('Received inventory update:', inventoryData);
      // Handle inventory updates
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [socket]);

  const emitEvent = (event: string, data: any) => {
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
