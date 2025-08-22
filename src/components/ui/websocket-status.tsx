import React from 'react';
import { Badge } from './badge';
import { Alert, AlertDescription } from './alert';
import { Wifi, WifiOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface WebSocketStatusProps {
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  retryCount: number;
  lastError: string | null;
  isConnected: boolean;
}

export const WebSocketStatus: React.FC<WebSocketStatusProps> = ({
  connectionStatus,
  retryCount,
  lastError,
  isConnected
}) => {
  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          label: 'Connected',
          variant: 'default' as const,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'connecting':
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          label: 'Connecting...',
          variant: 'secondary' as const,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'disconnected':
        return {
          icon: <WifiOff className="h-4 w-4" />,
          label: 'Disconnected',
          variant: 'outline' as const,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          label: 'Connection Error',
          variant: 'destructive' as const,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: <Wifi className="h-4 w-4" />,
          label: 'Unknown',
          variant: 'outline' as const,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge variant={statusConfig.variant} className="flex items-center gap-1">
          {statusConfig.icon}
          {statusConfig.label}
        </Badge>
        {retryCount > 0 && (
          <span className="text-xs text-muted-foreground">
            (Retry {retryCount}/5)
          </span>
        )}
      </div>
      
      {lastError && connectionStatus === 'error' && (
        <Alert className={`${statusConfig.bgColor} ${statusConfig.borderColor}`}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className={statusConfig.color}>
            {lastError}
          </AlertDescription>
        </Alert>
      )}
      
      {connectionStatus === 'disconnected' && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <WifiOff className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Real-time updates are disabled. Some features may not work optimally.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
