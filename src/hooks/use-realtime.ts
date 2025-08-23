import { useEffect, useState } from 'react';
// import socket from '@/lib/socket'; // DISABLED WEBSOCKET

interface RealtimeData {
  timestamp: string;
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
    type: 'warning' | 'error' | 'info';
    title: string;
    message: string;
    timestamp: Date;
  }>;
}

// Mock data for development without WebSocket
const mockRealtimeData: RealtimeData = {
  timestamp: new Date().toISOString(),
  inventory: {
    totalItems: 1250,
    lowStock: 45,
    outOfStock: 12,
    value: 1250000,
  },
  rental: {
    activeRentals: 89,
    pendingReturns: 23,
    maintenanceDue: 15,
    revenue: 450000,
  },
  finance: {
    monthlyRevenue: 850000,
    pendingPayments: 125000,
    expenses: 320000,
    profit: 530000,
  },
  hr: {
    totalEmployees: 156,
    onLeave: 8,
    newHires: 3,
    attendance: 145,
  },
  maintenance: {
    totalEquipment: 89,
    scheduledMaintenance: 12,
    overdueMaintenance: 3,
    inProgress: 7,
    completedThisMonth: 25,
    totalCost: 75000,
  },
  alerts: [
    {
      id: '1',
      type: 'warning',
      title: 'Low Stock Alert',
      message: '5 items are running low on stock',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'info',
      title: 'Maintenance Scheduled',
      message: 'Equipment maintenance scheduled for tomorrow',
      timestamp: new Date(),
    },
  ],
};

export const useRealtime = () => {
  const [data, setData] = useState<RealtimeData | null>(null);
  const [isConnected, setIsConnected] = useState(true); // Always connected in mock mode
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connected');
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined') {
      return;
    }

    // DISABLED WEBSOCKET - Use mock data instead
    // WebSocket disabled - using mock data for development
    
    // Set mock data immediately
    setData(mockRealtimeData);
    setIsConnected(true);
    setConnectionStatus('connected');
    setLastError(null);

    // Simulate periodic updates (optional)
    const interval = setInterval(() => {
      const updatedData = {
        ...mockRealtimeData,
        timestamp: new Date().toISOString(),
        inventory: {
          ...mockRealtimeData.inventory,
          totalItems: mockRealtimeData.inventory.totalItems + Math.floor(Math.random() * 10) - 5,
        },
      };
      setData(updatedData);
    }, 30000); // Update every 30 seconds

    return () => {
      clearInterval(interval);
    };

    // ORIGINAL WEBSOCKET CODE (DISABLED)
    /*
    const handleConnect = () => {
      setIsConnected(true);
      setConnectionStatus('connected');
      setLastError(null);
    };

    const handleDisconnect = (reason: string) => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
      setLastError(`Disconnected: ${reason}`);
    };

    const handleConnectError = (error: Error) => {
      setIsConnected(false);
      setConnectionStatus('error');
      setLastError(`Connection failed: ${error.message}`);
      console.error('❌ WebSocket connection error:', error.message);
    };

    const handleDashboardUpdate = (newData: RealtimeData) => {
      setData(newData);
    };

    if (socket.connected) {
      socket.emit('join-dashboard');
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('dashboard-update', handleDashboardUpdate);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('dashboard-update', handleDashboardUpdate);
    };
    */
  }, []);

  const emitEvent = (event: string, data: Record<string, unknown>) => {
    // DISABLED WEBSOCKET - Just log the event
    // Mock event emitted: ${event}
    // if (socket && isConnected) {
    //   socket.emit(event, data);
    // }
  };

  return {
    data,
    isConnected,
    connectionStatus,
    lastError,
    emitEvent,
    socket: null, // Return null instead of socket
  };
};
