import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Database, 
  Server, 
  Activity,
  Wifi,
  WifiOff
} from 'lucide-react';

interface SystemStatus {
  status: 'healthy' | 'degraded' | 'error';
  timestamp: string;
  services: {
    database: {
      status: 'connected' | 'disconnected' | 'unknown';
      latency: number;
      message: string;
    };
    api: {
      status: 'operational' | 'error';
      message: string;
    };
  };
  version: string;
  environment: string;
}

const SystemStatusMonitor: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkSystemHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setSystemStatus(data);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
      setSystemStatus({
        status: 'error',
        timestamp: new Date().toISOString(),
        services: {
          database: {
            status: 'unknown',
            latency: 0,
            message: 'Unable to check database status'
          },
          api: {
            status: 'error',
            message: 'API health check failed'
          }
        },
        version: 'unknown',
        environment: 'unknown'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSystemHealth();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkSystemHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'operational':
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disconnected':
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'operational':
      case 'healthy':
        return 'bg-green-500';
      case 'disconnected':
      case 'error':
        return 'bg-red-500';
      case 'degraded':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'connected':
      case 'operational':
      case 'healthy':
        return 'default';
      case 'disconnected':
      case 'error':
        return 'destructive';
      case 'degraded':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (!systemStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Checking system status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            System Status
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getStatusBadgeVariant(systemStatus.status)}>
              {systemStatus.status.toUpperCase()}
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkSystemHealth}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(systemStatus.status)}
              <div>
                <h4 className="font-medium">Overall System</h4>
                <p className="text-sm text-muted-foreground">
                  {systemStatus.status === 'healthy' ? 'All systems operational' : 
                   systemStatus.status === 'degraded' ? 'Some services degraded' : 
                   'System experiencing issues'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                {lastCheck?.toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Database Status */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              {systemStatus.services.database.status === 'connected' ? 
                <Database className="h-4 w-4 text-green-500" /> : 
                <WifiOff className="h-4 w-4 text-red-500" />
              }
              <div>
                <h4 className="font-medium">Database</h4>
                <p className="text-sm text-muted-foreground">
                  {systemStatus.services.database.message}
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant={getStatusBadgeVariant(systemStatus.services.database.status)}>
                {systemStatus.services.database.status}
              </Badge>
              {systemStatus.services.database.latency > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  {systemStatus.services.database.latency}ms
                </div>
              )}
            </div>
          </div>

          {/* API Status */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              {systemStatus.services.api.status === 'operational' ? 
                <Server className="h-4 w-4 text-green-500" /> : 
                <XCircle className="h-4 w-4 text-red-500" />
              }
              <div>
                <h4 className="font-medium">API Service</h4>
                <p className="text-sm text-muted-foreground">
                  {systemStatus.services.api.message}
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant={getStatusBadgeVariant(systemStatus.services.api.status)}>
                {systemStatus.services.api.status}
              </Badge>
            </div>
          </div>

          {/* System Info */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <div className="text-sm font-medium">Version</div>
              <div className="text-sm text-muted-foreground">{systemStatus.version}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Environment</div>
              <div className="text-sm text-muted-foreground capitalize">{systemStatus.environment}</div>
            </div>
          </div>

          {/* Performance Metrics */}
          {systemStatus.services.database.latency > 0 && (
            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm mb-2">
                <span>Database Response Time</span>
                <span>{systemStatus.services.database.latency}ms</span>
              </div>
              <Progress 
                value={Math.min(systemStatus.services.database.latency / 100, 100)} 
                className="h-2"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {systemStatus.services.database.latency < 50 ? 'Excellent' :
                 systemStatus.services.database.latency < 100 ? 'Good' :
                 systemStatus.services.database.latency < 200 ? 'Fair' : 'Poor'} performance
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatusMonitor;
