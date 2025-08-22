import { useEffect, useState, useRef } from 'react';
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
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const statusRef = useRef(connectionStatus);
  const retryCountRef = useRef(retryCount);

  useEffect(() => {

    // Initialize WebSocket connection with consistent port configuration
    const websocketUrl = getWebSocketUrl();
    
    // Clean up any existing connection first
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // Only attempt connection if websocketUrl is valid
    if (!websocketUrl || websocketUrl === 'undefined' || websocketUrl === 'null') {
      setConnectionStatus('error');
      setLastError('WebSocket URL not configured');
      return;
    }

    setConnectionStatus('connecting');

    // SOLUSI: Debug connection dengan logging
    // console.log('🔌 Attempting WebSocket connection to:', websocketUrl);
    
    // console.log('🔌 Attempting WebSocket connection to:', websocketUrl);
    
    const newSocket = io(websocketUrl, {
      transports: ['polling'],
      autoConnect: true, // Let Socket.IO handle connection
      timeout: 5000,
      reconnection: true, // Enable reconnection
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      withCredentials: false,
      forceNew: true
    });

    // Listen to ALL events for debugging
    newSocket.onAny((eventName, ...args) => {
      // Debug: temporarily uncomment for troubleshooting
      if (eventName === 'connect' || eventName === 'connect_error' || eventName === 'connecting') {
        // console.log(`🔍 Socket event: ${eventName}`, args);
      }
    });

    newSocket.on('connecting', () => {
      // console.log('🔄 WebSocket connecting...');
      setConnectionStatus('connecting');
      statusRef.current = 'connecting';
    });

    // Try multiple connection events
    newSocket.on('connect', () => {
      // console.log('✅ WebSocket connected successfully, ID:', newSocket.id);
      setIsConnected(true);
      setConnectionStatus('connected');
      statusRef.current = 'connected';
      setRetryCount(0);
      retryCountRef.current = 0;
      setLastError(null);
      clearTimeout(connectionTimeout);
    });

    newSocket.on('open', () => {
      // console.log('✅ WebSocket opened successfully');
      setIsConnected(true);
      setConnectionStatus('connected');
      setRetryCount(0);
      setLastError(null);
      clearTimeout(connectionTimeout);
    });

    newSocket.on('disconnect', (reason) => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
      setLastError(`Disconnected: ${reason}`);
    });

    newSocket.on('connect_error', (error) => {
      // console.log('❌ WebSocket connection error:', error.message);
      setIsConnected(false);
      setConnectionStatus('error');
      setRetryCount(prev => prev + 1);
      setLastError(`Connection failed: ${error.message}`);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      setIsConnected(true);
      setConnectionStatus('connected');
      setRetryCount(0);
      setLastError(null);
    });

    newSocket.on('reconnect_error', (error) => {
      setConnectionStatus('error');
      setLastError(`Reconnection failed: ${error.message}`);
    });

    newSocket.on('reconnect_failed', () => {
      setConnectionStatus('error');
      setLastError('Max reconnection attempts reached');
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

    // Manual ping/pong to check connection
    newSocket.on('ping', () => {
      newSocket.emit('pong');
    });

    newSocket.on('pong', () => {
      // Connection is alive
      if (statusRef.current !== 'connected') {
        setIsConnected(true);
        setConnectionStatus('connected');
        statusRef.current = 'connected';
        setRetryCount(0);
        retryCountRef.current = 0;
        setLastError(null);
      }
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Timeout manual untuk menghindari stuck connecting
    // Force timeout and manual reconnect
    const connectionTimeout = setTimeout(() => {
      if (statusRef.current === 'connecting') {
        // console.log('⏰ Connection timeout, forcing reconnect...');
        newSocket.disconnect();
        newSocket.connect();
        setRetryCount(prev => {
          retryCountRef.current = prev + 1;
          return prev + 1;
        });
        
        if (retryCountRef.current >= 2) {
          setConnectionStatus('error');
          setLastError('Connection timeout after retries');
        }
      }
    }, 3000);

               return () => {
             clearTimeout(connectionTimeout);
             if (newSocket) {
               newSocket.disconnect();
             }
           };
  }, []); // Remove socket dependency to prevent infinite re-renders

  const emitEvent = (event: string, data: Record<string, unknown>) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  };

  return {
    data,
    isConnected,
    connectionStatus,
    retryCount,
    lastError,
    emitEvent,
    socket,
  };
};
