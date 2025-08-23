import { useEffect, useState } from 'react';
import socket from '@/lib/socket';

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

export const useRealtime = () => {
  const [data, setData] = useState<RealtimeData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    // Skip WebSocket connection during SSR
    if (typeof window === 'undefined') {
      return;
    }

    // SOLUSI C: Hygiene kode - menggunakan socket yang sudah dikonfigurasi
    const handleConnect = () => {
      setIsConnected(true);
      setConnectionStatus('connected');
      setLastError(null);
      // eslint-disable-next-line no-console
      // console.log('✅ WebSocket connected successfully');
    };

    const handleDisconnect = (reason: string) => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
      setLastError(`Disconnected: ${reason}`);
      // eslint-disable-next-line no-console
      // console.log('❌ WebSocket disconnected:', reason);
    };

    const handleConnectError = (error: Error) => {
      setIsConnected(false);
      setConnectionStatus('error');
      setLastError(`Connection failed: ${error.message}`);
      // eslint-disable-next-line no-console
      console.error('❌ WebSocket connection error:', error.message);
    };

    const handleDashboardUpdate = (newData: RealtimeData) => {
      setData(newData);
      // eslint-disable-next-line no-console
      // console.log('📊 Dashboard data updated:', newData);
    };

    // Join dashboard room
    if (socket.connected) {
      socket.emit('join-dashboard');
    }

    // Event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('dashboard-update', handleDashboardUpdate);

    // Cleanup
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('dashboard-update', handleDashboardUpdate);
    };
  }, []);

  const emitEvent = (event: string, data: Record<string, unknown>) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  };

  return {
    data,
    isConnected,
    connectionStatus,
    lastError,
    emitEvent,
    socket,
  };
};
