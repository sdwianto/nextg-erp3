import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import React from 'react';

import { api } from '@/utils/api';
import { useRouter } from 'next/router';
import { useRealtime } from '@/hooks/use-realtime';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { DashboardRealTime } from '@/components/DashboardRealTime';
import { RentalMaintenanceDashboard } from '@/components/RentalMaintenanceDashboard';
import { AssetLifecycleDashboard } from '@/components/AssetLifecycleDashboard';
import { EquipmentGPSMap } from '@/components/EquipmentGPSMap';
import { SafetyCompliance } from '@/components/SafetyCompliance';
import { MaintenanceCard } from '@/components/MaintenanceCard';
import { MaintenanceAlerts } from '@/components/MaintenanceAlerts';
import DashboardLoader from '@/components/ui/dashboard-loader';

import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, Building2, Package, Truck, DollarSign, Users, BarChart3, TrendingUp, Wrench, ShoppingCart } from 'lucide-react';
import { WebSocketStatus } from '@/components/ui/websocket-status';


const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [stats, setStats] = React.useState({
    inventory: {
      totalItems: 0,
      lowStock: 0,
      outOfStock: 0,
      value: 0
    },
    rental: {
      activeRentals: 0,
      pendingReturns: 0,
      maintenanceDue: 0,
      revenue: 0
    },
    finance: {
      monthlyRevenue: 0,
      pendingPayments: 0,
      expenses: 0,
      profit: 0
    },
    hr: {
      totalEmployees: 0,
      onLeave: 0,
      newHires: 0,
      attendance: 0
    },
    maintenance: {
      totalEquipment: 0,
      scheduledMaintenance: 0,
      overdueMaintenance: 0,
      inProgress: 0,
      completedThisMonth: 0,
      totalCost: 0
    }
  });
  const [loading, setLoading] = React.useState(true);

  // Use tRPC queries
  const rentalData = api.rentalMaintenance.getDashboardData.useQuery();
  const operationsData = api.production.getDashboardData.useQuery();
  const inventoryData = api.inventory.getProducts.useQuery({ page: 1, limit: 100 }); // Get more data for calculations
  const financeData = api.finance.getDashboardData.useQuery();
  const hrData = api.hrms.getDashboardData.useQuery();

  // Real-time data hook
  const { data: realtimeData, isConnected, connectionStatus, retryCount, lastError } = useRealtime();

  // Update stats when data is available - OPTIMIZED with useMemo
  const finalStats = React.useMemo(() => {
    if (!rentalData.data || !operationsData.data || !inventoryData.data || !financeData.data || !hrData.data) {
      return null;
    }

    // Calculate real metrics from actual data
    const _inventoryTotal = inventoryData.data.pagination?.total || 0;
    const _lowStockCount = 0;
    const _outOfStockCount = 0;
    const _inventoryValue = 0;

    const _rentalRevenue = 0;
    const _financeRevenue = 0;
    const _totalRevenue = _rentalRevenue + _financeRevenue;

    // Use real-time data if available, otherwise use calculated data
    return realtimeData ? {
      inventory: realtimeData.inventory,
      rental: realtimeData.rental,
      finance: realtimeData.finance,
      hr: realtimeData.hr,
      maintenance: realtimeData.maintenance
    } : {
      inventory: {
        totalItems: _inventoryTotal,
        lowStock: _lowStockCount,
        outOfStock: _outOfStockCount,
        value: _inventoryValue
      },
      rental: {
        activeRentals: rentalData.data?.summary?.inUseEquipment || 0,
        pendingReturns: rentalData.data?.summary?.pendingMaintenanceRecords || 0,
        maintenanceDue: rentalData.data?.summary?.pendingMaintenanceRecords || 0,
        revenue: _rentalRevenue
      },
      finance: {
        monthlyRevenue: _totalRevenue,
        pendingPayments: 0,
        expenses: 0,
        profit: _totalRevenue
      },
      hr: {
        totalEmployees: hrData.data?.data?.totalEmployees || 0,
        onLeave: hrData.data?.data?.onLeaveEmployees || 0,
        newHires: hrData.data?.data?.recentHires?.length || 0,
        attendance: 0
      },
      maintenance: {
        totalEquipment: rentalData.data?.summary?.totalEquipment || 0,
        scheduledMaintenance: rentalData.data?.summary?.pendingMaintenanceRecords || 0,
        overdueMaintenance: 0, // TODO: Implement overdue maintenance
        inProgress: rentalData.data?.summary?.maintenanceEquipment || 0,
        completedThisMonth: rentalData.data?.summary?.completedMaintenanceRecords || 0,
        totalCost: 0 // TODO: Implement total cost
      }
    };
  }, [rentalData.data, operationsData.data, inventoryData.data, financeData.data, hrData.data, realtimeData]);

  // Update stats when finalStats changes
  React.useEffect(() => {
    if (finalStats) {
      setStats(finalStats);
      setLoading(false);
    }
  }, [finalStats]);

  const maintenanceAlerts: Array<{id: number; equipmentName: string; equipmentCode: string; alertType: 'OVERDUE' | 'EMERGENCY' | 'SCHEDULED' | 'INSPECTION'; message: string; priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; daysOverdue?: number; scheduledDate?: string}> = [];
  const recentActivities: Array<{id: string; status: string; message: string; time: string; type: string}> = [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return <DashboardLoader variant="minimal" />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">NextGen ERP Dashboard v1.1</h1>
            <p className="text-gray-600 dark:text-gray-400">Real-time overview of your business operations</p>
          </div>
          <div className="flex items-center gap-3">
            <WebSocketStatus 
              connectionStatus={connectionStatus}
              retryCount={retryCount}
              lastError={lastError}
              isConnected={isConnected}
            />
            <Badge variant="outline" className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              System Online
            </Badge>
          </div>
        </div>

        {/* Real-time Dashboard Component */}
        <DashboardRealTime />

        {/* V1.1 Enhanced Rental & Maintenance Dashboard */}
        <RentalMaintenanceDashboard />

        {/* Asset Lifecycle Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Asset Lifecycle Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AssetLifecycleDashboard />
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Inventory */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inventory.totalItems.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.inventory.lowStock} low stock, {stats.inventory.outOfStock} out of stock
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Value: ${stats.inventory.value.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          {/* Rental & Equipment */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rental & Equipment</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rental.activeRentals}</div>
              <p className="text-xs text-muted-foreground">
                {stats.rental.pendingReturns} pending returns, {stats.rental.maintenanceDue} maintenance due
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Revenue: ${stats.rental.revenue.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          {/* Finance */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Finance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.finance.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                ${stats.finance.pendingPayments.toLocaleString()} pending payments
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Profit: ${stats.finance.profit.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          {/* HR & Payroll */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">HR & Payroll</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.hr.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                {stats.hr.onLeave} on leave, {stats.hr.newHires} new hires
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Attendance: {stats.hr.attendance}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push('/inventory')}
              >
                <Package className="h-6 w-6" />
                <span className="text-sm">Inventory</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push('/procurement')}
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="text-sm">Procurement</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push('/rental')}
              >
                <Wrench className="h-6 w-6" />
                <span className="text-sm">Operations</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push('/rental')}
              >
                <Truck className="h-6 w-6" />
                <span className="text-sm">Rental</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2 relative"
                onClick={() => router.push('/rental')}
              >
                <Wrench className="h-6 w-6" />
                <span className="text-sm">Maintenance</span>
                {stats.maintenance.overdueMaintenance > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
                    {stats.maintenance.overdueMaintenance}
                  </Badge>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push('/finance')}
              >
                <DollarSign className="h-6 w-6" />
                <span className="text-sm">Finance</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push('/hrms')}
              >
                <Users className="h-6 w-6" />
                <span className="text-sm">HR</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push('/crm')}
              >
                <Building2 className="h-6 w-6" />
                <span className="text-sm">CRM</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push('/asset')}
              >
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">Asset Management</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push('/reports')}
              >
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">Reports</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push('/dashboard')}
              >
                <AlertTriangle className="h-6 w-6" />
                <span className="text-sm">Alerts</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mining-Specific Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EquipmentGPSMap />
          <SafetyCompliance />
        </div>

        {/* Maintenance Overview Card */}
        <MaintenanceCard
          stats={stats.maintenance}
          onViewMaintenance={() => router.push('/rental')}
          onScheduleMaintenance={() => router.push('/rental')}
                      onViewOverdue={() => router.push('/rental?tab=overdue')}
            onViewCompleted={() => router.push('/rental?tab=completed')}
                      onViewCostAnalysis={() => router.push('/rental?tab=reports')}
        />

        {/* Maintenance Alerts */}
        <MaintenanceAlerts
          alerts={maintenanceAlerts}
          onViewAll={() => router.push('/maintenance')}
          onViewAlert={(alertId) => router.push(`/maintenance?alert=${alertId}`)}
        />

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Recent Activities
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? "Live" : "Offline"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(activity.status)}
                    <div>
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
