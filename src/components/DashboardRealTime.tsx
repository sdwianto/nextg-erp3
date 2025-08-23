import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Package, 
  Truck, 
  DollarSign, 
  WifiOff,
  Wifi
} from 'lucide-react';
import { api } from '@/utils/api';
import { useRealtime } from '@/hooks/use-realtime';

interface DashboardMetrics {
  totalProducts: number;
  lowStockItems: number;
  activeOrders: number;
  totalRevenue: number;
  activeEquipment: number;
  pendingApprovals: number;
}

export const DashboardRealTime: React.FC = () => {
  // Real-time connection status
  const { isConnected } = useRealtime();

  // Fetch procurement data
  const { data: procurementData, isLoading: procurementLoading } = api.procurement.getDashboardData.useQuery(undefined, {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
    staleTime: 0,
  });

  // Fetch inventory data for products
  const { data: inventoryData, isLoading: inventoryLoading } = api.inventory.getProducts.useQuery({ page: 1, limit: 100 });

  const metrics: DashboardMetrics = {
    totalProducts: inventoryData?.pagination?.total || 0,
    lowStockItems: 0, // TODO: Calculate from inventory data
    activeOrders: procurementData?.stats?.purchaseOrders || 0,
    totalRevenue: procurementData?.stats?.totalSpend || 0,
    activeEquipment: 0, // TODO: Calculate from rental/maintenance data
    pendingApprovals: procurementData?.stats?.pendingApprovals || 0,
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-orange-500" />
            )}
            {process.env.NODE_ENV === 'production' ? 'Production Mode' : 'Development Mode'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-muted-foreground">Pending Sync</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-muted-foreground">Synced</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">0</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">0</div>
              <div className="text-sm text-muted-foreground">Conflicts</div>
            </div>
          </div>
          {!isConnected && (
            <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                {process.env.NODE_ENV === 'production' 
                  ? 'Real-time features are connecting...' 
                  : 'Real-time features are disabled in development mode. Set NEXT_PUBLIC_SOCKET_URL to enable WebSocket connections.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {inventoryLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{metrics.totalProducts.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.lowStockItems} items low on stock
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {procurementLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{metrics.activeOrders}</div>
                                 <div className="text-xs text-muted-foreground space-y-1">
                   <div className="flex justify-between">
                     <span>Total Pending:</span>
                     <span className="font-medium">{metrics.pendingApprovals}</span>
                   </div>
                   {procurementData?.stats?.pendingPRApprovals !== undefined && (
                     <div className={`flex justify-between transition-all duration-300 ${
                       procurementData.stats.pendingPRApprovals > 0 
                         ? 'bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 px-2 py-1 rounded-md border border-orange-200 dark:border-orange-700 animate-pulse' 
                         : ''
                     }`}>
                       <span className={`transition-colors duration-300 ${
                         procurementData.stats.pendingPRApprovals > 0 
                           ? 'text-orange-700 dark:text-orange-300 font-semibold' 
                           : ''
                       }`}>
                         PR Approval:
                       </span>
                       <span className={`font-medium transition-all duration-300 ${
                         procurementData.stats.pendingPRApprovals > 0 
                           ? 'text-orange-600 dark:text-orange-400 animate-bounce shadow-lg bg-orange-600/10 px-2 py-0.5 rounded-full' 
                           : ''
                       }`}>
                         {procurementData.stats.pendingPRApprovals}
                       </span>
                     </div>
                   )}
                   {procurementData?.stats?.pendingPOApprovals !== undefined && (
                     <div className={`flex justify-between transition-all duration-300 ${
                       procurementData.stats.pendingPOApprovals > 0 
                         ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 px-2 py-1 rounded-md border border-blue-200 dark:border-blue-700 animate-pulse' 
                         : ''
                     }`}>
                       <span className={`transition-colors duration-300 ${
                         procurementData.stats.pendingPOApprovals > 0 
                           ? 'text-blue-700 dark:text-blue-300 font-semibold' 
                           : ''
                       }`}>
                         PO Approval:
                       </span>
                       <span className={`font-medium transition-all duration-300 ${
                         procurementData.stats.pendingPOApprovals > 0 
                           ? 'text-blue-600 dark:text-blue-400 animate-bounce shadow-lg bg-blue-600/10 px-2 py-0.5 rounded-full' 
                           : ''
                       }`}>
                         {procurementData.stats.pendingPOApprovals}
                       </span>
                     </div>
                   )}
                   {procurementData?.stats?.rejectedPOs !== undefined && procurementData.stats.rejectedPOs > 0 && (
                     <div className="flex justify-between text-red-600">
                       <span>Rejected:</span>
                       <span className="font-medium">{procurementData.stats.rejectedPOs}</span>
                     </div>
                   )}
                 </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {procurementLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  ${metrics.totalRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Procurement Spend</div>
                  {procurementData?.stats?.spendChangePercent !== undefined && (
                    <div className="flex justify-between">
                      <span>Change:</span>
                      <span className={`font-medium ${procurementData.stats.spendChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {procurementData.stats.spendChangePercent > 0 ? '+' : ''}{procurementData.stats.spendChangePercent}%
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Equipment</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeEquipment}</div>
            <p className="text-xs text-muted-foreground">
              Available for rental
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                v1.1
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              NextGen ERP v1.1 - Enhanced Rental & Maintenance
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 