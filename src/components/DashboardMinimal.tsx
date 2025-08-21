import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import { api } from '@/utils/api';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Users
} from 'lucide-react';

const DashboardMinimal: React.FC = () => {
  const router = useRouter();
  const [stats, setStats] = React.useState({
    procurement: {
      totalRequests: 0,
      pendingRequests: 0,
      approvedRequests: 0,
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalSuppliers: 0,
      activeSuppliers: 0,
      totalProducts: 0,
      lowStockProducts: 0
    }
  });
  const [loading, setLoading] = React.useState(true);

  // Use tRPC queries for procurement data only
  const procurementData = api.procurement.getDashboardData.useQuery();
  const purchaseRequests = api.procurement.getPurchaseRequests.useQuery();
  const purchaseOrders = api.procurement.getPurchaseOrders.useQuery();
  const suppliers = api.procurement.getSuppliers.useQuery();

  // Update stats when data is available
  React.useEffect(() => {
    if (procurementData.data && purchaseRequests.data && purchaseOrders.data && suppliers.data) {
      const prData = purchaseRequests.data;
      const poData = purchaseOrders.data;
      const supData = suppliers.data;

      setStats({
        procurement: {
          totalRequests: prData?.pagination?.total || 0,
          pendingRequests: prData?.data?.filter((pr: { status: string; }) => pr.status === 'PENDING').length || 0,
          approvedRequests: prData?.data?.filter((pr: { status: string; }) => pr.status === 'APPROVED').length || 0,
          totalOrders: poData?.pagination?.total || 0,
          pendingOrders: poData?.data?.filter((po: { status: string; }) => po.status === 'SUBMITTED').length || 0,
          completedOrders: poData?.data?.filter((po: { status: string; }) => po.status === 'ORDERED').length || 0,
          totalSuppliers: supData?.pagination?.total || 0,
          activeSuppliers: supData?.data?.filter((sup: { isActive: boolean; }) => sup.isActive).length || 0,
          totalProducts: 0, // Will be calculated from procurement data
          lowStockProducts: 0 // Will be calculated from procurement data
        }
      });
      setLoading(false);
    }
  }, [procurementData.data, purchaseRequests.data, purchaseOrders.data, suppliers.data]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">NextGen ERP</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
            <div className="mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Procurement Management Overview
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Minimal Mode
            </Badge>
            <Button onClick={() => router.push('/procurement')}>
              <Plus className="mr-2 h-4 w-4" />
              New Purchase Request
            </Button>
          </div>
        </div>

        {/* Procurement Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.procurement.totalRequests}</div>
              <p className="text-xs text-muted-foreground">
                Purchase requests created
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.procurement.pendingRequests}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.procurement.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                Purchase orders created
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.procurement.activeSuppliers}</div>
              <p className="text-xs text-muted-foreground">
                Out of {stats.procurement.totalSuppliers} total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Status Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Approved Requests</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {stats.procurement.approvedRequests}
              </div>
              <p className="text-sm text-muted-foreground">
                Ready for purchase order creation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span>Pending Orders</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {stats.procurement.pendingOrders}
              </div>
              <p className="text-sm text-muted-foreground">
                Awaiting supplier confirmation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Completed Orders</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {stats.procurement.completedOrders}
              </div>
              <p className="text-sm text-muted-foreground">
                Successfully ordered
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
            <div className="grid gap-4 md:grid-cols-3">
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => router.push('/procurement')}
              >
                <ShoppingCart className="h-6 w-6 mb-2" />
                <span>Purchase Requests</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => router.push('/procurement?tab=orders')}
              >
                <Package className="h-6 w-6 mb-2" />
                <span>Purchase Orders</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => router.push('/procurement?tab=suppliers')}
              >
                <Users className="h-6 w-6 mb-2" />
                <span>Supplier Management</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Build Mode</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Minimal
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Modules</span>
                <span className="text-sm text-muted-foreground">Dashboard, Procurement</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database Connection</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Connected
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardMinimal;
