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
    // Skip WebSocket connection during SSR
    if (typeof window === 'undefined') {
      return;
    }

    // Initialize WebSocket connection with consistent port configuration
    const websocketUrl = getWebSocketUrl();
    
    // Clean up any existing connection first
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // Only attempt connection if websocketUrl is valid
    if (!websocketUrl || websocketUrl === 'undefined' || websocketUrl === 'null' || websocketUrl === '') {
      setConnectionStatus('error');
      setLastError('WebSocket URL not configured');
      return;
    }

    // Debug logging for all environments
    // eslint-disable-next-line no-console
    console.log('🔌 Environment:', process.env.NODE_ENV);
    // eslint-disable-next-line no-console
    console.log('🔌 WebSocket URL:', websocketUrl);
    // eslint-disable-next-line no-console
    console.log('🔌 WebSocket Path:', process.env.NODE_ENV === 'production' ? '/api/websocket' : '/socket.io/');
    // eslint-disable-next-line no-console
    console.log('🔌 Full WebSocket URL:', `${websocketUrl}${process.env.NODE_ENV === 'production' ? '/api/websocket' : '/socket.io/'}`);
    // SOLUSI: Add more detailed logging for production
    if (process.env.NODE_ENV === 'production') {
      // eslint-disable-next-line no-console
      console.log('🔌 Production Debug:', {
        windowLocation: typeof window !== 'undefined' ? window.location.href : 'undefined',
        windowOrigin: typeof window !== 'undefined' ? window.location.origin : 'undefined',
        websocketUrl,
        expectedPath: '/api/websocket'
      });
    }

    setConnectionStatus('connecting');

    // SOLUSI: Debug connection dengan logging
    // console.log('🔌 Attempting WebSocket connection to:', websocketUrl);
    
    // console.log('🔌 Attempting WebSocket connection to:', websocketUrl);
    
    // ERP-optimized Socket.IO configuration
    const socketConfig = {
      path: process.env.NODE_ENV === 'production' ? '/api/websocket' : '/socket.io/',
      transports: ['polling'],
      autoConnect: true,
      timeout: 15000, // Increased for ERP operations
      reconnection: true,
      reconnectionAttempts: 10, // More attempts for ERP reliability
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      maxReconnectionAttempts: 10,
      withCredentials: false,
      forceNew: true,
      // SOLUSI: Add cache-busting untuk mencegah truncation
      query: {
        _t: Date.now(), // Cache busting
        _v: '1.1' // Version identifier
      }
    };

    // SOLUSI: Validate URL sebelum koneksi
    const finalWebSocketUrl = websocketUrl;
    if (process.env.NODE_ENV === 'production') {
      // eslint-disable-next-line no-console
      console.log('🔌 Final WebSocket URL:', finalWebSocketUrl);
      // eslint-disable-next-line no-console
      console.log('🔌 Expected Path:', '/api/websocket');
      // eslint-disable-next-line no-console
      console.log('🔌 Full URL should be:', `${finalWebSocketUrl}/api/websocket`);
      
      // SOLUSI: Detect truncated URL dan fix
      if (finalWebSocketUrl && finalWebSocketUrl.includes('websock_')) {
        // eslint-disable-next-line no-console
        console.error('❌ DETECTED TRUNCATED URL:', finalWebSocketUrl);
        // eslint-disable-next-line no-console
        console.log('🔧 Attempting to fix truncated URL...');
        
        // Force reload untuk clear cache
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }, 2000);
        return;
      }
    }

    const newSocket = io(finalWebSocketUrl, socketConfig);

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
      // eslint-disable-next-line no-console
      console.log('❌ WebSocket connection error:', error.message);
      // eslint-disable-next-line no-console
      console.log('❌ Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n')[0]
      });
      
      setIsConnected(false);
      setConnectionStatus('error');
      setRetryCount(prev => prev + 1);
      setLastError(`Connection failed: ${error.message}`);
      
      // SOLUSI: Improved error handling for production
      if (process.env.NODE_ENV === 'production') {
        // eslint-disable-next-line no-console
        console.log('🔧 Production Error Analysis:', {
          errorType: error.name,
          errorMessage: error.message,
          currentUrl: typeof window !== 'undefined' ? window.location.href : 'undefined',
          websocketUrl,
          retryCount: retryCountRef.current
        });
      }
      
      // ERP-specific error handling
      if (error.message.includes('xhr poll error') || error.message.includes('400') || error.message.includes('websock')) {
        // eslint-disable-next-line no-console
        console.log('🔧 ERP: Detected path/configuration issue, attempting recovery...');
        
        // Force reconnection with different configuration
        setTimeout(() => {
          if (socketRef.current && !socketRef.current.connected) {
            socketRef.current.disconnect();
            setTimeout(() => {
              socketRef.current?.connect();
            }, 1000);
          }
        }, 3000);
      } else {
        // Standard reconnection
        setTimeout(() => {
          if (socketRef.current && !socketRef.current.connected) {
            socketRef.current.connect();
          }
        }, 2000);
      }
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
