import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  Target,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  Edit,
  Download,
  RefreshCw,
  Settings,
  FileText,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  Minus,
  AlertTriangle,
  Star,
  Calendar,
  Clock,
  MapPin,
  Building,
  ShoppingCart,
  CreditCard,
  Truck,
  Award,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  DollarSign as DollarSignIcon,
  Users as UsersIcon,
  Package as PackageIcon,
  Target as TargetIcon,
  Activity as ActivityIcon,
  BarChart3 as BarChart3Icon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Eye as EyeIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  RefreshCw as RefreshCwIcon,
  Settings as SettingsIcon,
  FileText as FileTextIcon,
  Plus as PlusIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  ArrowUpRight as ArrowUpRightIcon,
  ArrowDownRight as ArrowDownRightIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  Minus as MinusIcon,
  AlertTriangle as AlertTriangleIcon,
  Star as StarIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  MapPin as MapPinIcon,
  Building as BuildingIcon,
  ShoppingCart as ShoppingCartIcon,
  CreditCard as CreditCardIcon,
  Truck as TruckIcon,
  Award as AwardIcon
} from 'lucide-react';

const EnhancedSalesDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  // Mock data for Sales Dashboard
  const salesOverview = {
    totalRevenue: 2847500,
    targetRevenue: 3000000,
    totalOrders: 1247,
    avgOrderValue: 2285,
    conversionRate: 23.5,
    customerSatisfaction: 4.6,
    growthRate: 15.8,
    repeatCustomers: 892
  };

  const salesPerformance = [
    { id: 1, region: 'Jakarta', revenue: 850000, target: 900000, orders: 425, growth: 12.5, customers: 320 },
    { id: 2, region: 'Surabaya', revenue: 650000, target: 700000, orders: 325, growth: 18.2, customers: 245 },
    { id: 3, region: 'Bandung', revenue: 450000, target: 500000, orders: 225, growth: 8.7, customers: 180 },
    { id: 4, region: 'Medan', revenue: 350000, target: 400000, orders: 175, growth: 22.1, customers: 140 },
    { id: 5, region: 'Semarang', revenue: 250000, target: 300000, orders: 125, growth: 15.3, customers: 95 },
    { id: 6, region: 'Makassar', revenue: 200000, target: 200000, orders: 100, growth: 25.8, customers: 75 }
  ];

  const topProducts = [
    { id: 1, name: 'Product A - Premium', revenue: 450000, units: 225, growth: 18.5, margin: 35 },
    { id: 2, name: 'Product B - Standard', revenue: 380000, units: 380, growth: 12.3, margin: 28 },
    { id: 3, name: 'Product C - Basic', revenue: 320000, units: 640, growth: 8.7, margin: 22 },
    { id: 4, name: 'Product D - Pro', revenue: 280000, units: 140, growth: 25.2, margin: 42 },
    { id: 5, name: 'Product E - Lite', revenue: 220000, units: 440, growth: 15.8, margin: 20 }
  ];

  const recentOrders = [
    { id: 1, customer: 'PT Maju Bersama', amount: 125000, status: 'completed', date: '2 hours ago', region: 'Jakarta' },
    { id: 2, customer: 'CV Sukses Mandiri', amount: 85000, status: 'processing', date: '4 hours ago', region: 'Surabaya' },
    { id: 3, customer: 'UD Makmur Jaya', amount: 65000, status: 'shipped', date: '6 hours ago', region: 'Bandung' },
    { id: 4, customer: 'PT Global Solutions', amount: 95000, status: 'completed', date: '1 day ago', region: 'Jakarta' },
    { id: 5, customer: 'CV Berkah Abadi', amount: 75000, status: 'pending', date: '1 day ago', region: 'Medan' }
  ];

  const trends = [
    { id: 1, metric: 'Revenue Growth', current: 15.8, previous: 12.3, change: 28.5, unit: '%' },
    { id: 2, metric: 'Order Volume', current: 1247, previous: 1089, change: 14.5, unit: '' },
    { id: 3, metric: 'Avg Order Value', current: 2285, previous: 2150, change: 6.3, unit: 'USD' },
    { id: 4, metric: 'Customer Satisfaction', current: 4.6, previous: 4.4, change: 4.5, unit: '/5' }
  ];

  const kpis = [
    { id: 1, name: 'Sales Conversion Rate', value: 23.5, target: 25, unit: '%', trend: 'up' },
    { id: 2, name: 'Customer Acquisition Cost', value: 450, target: 400, unit: 'USD', trend: 'down' },
    { id: 3, name: 'Customer Lifetime Value', value: 8500, target: 9000, unit: 'USD', trend: 'up' },
    { id: 4, name: 'Sales Cycle Length', value: 28, target: 25, unit: 'days', trend: 'down' },
    { id: 5, name: 'Win Rate', value: 68, target: 70, unit: '%', trend: 'up' },
    { id: 6, name: 'Repeat Purchase Rate', value: 72, target: 75, unit: '%', trend: 'up' }
  ];

  const alerts = [
    { id: 1, type: 'warning', message: 'Sales target behind schedule in Bandung region', region: 'Bandung', time: '2 hours ago' },
    { id: 2, type: 'info', message: 'New high-value customer acquired', customer: 'PT Maju Bersama', time: '4 hours ago' },
    { id: 3, type: 'error', message: 'Payment processing issue detected', order: 'ORD-2024-001', time: '6 hours ago' },
    { id: 4, type: 'success', message: 'Monthly target exceeded in Jakarta', region: 'Jakarta', time: '1 day ago' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-yellow-500';
      case 'shipped': return 'bg-blue-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info': return <Eye className="h-4 w-4 text-blue-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Performance</h1>
          <p className="text-gray-600">Track sales performance and revenue analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(salesOverview.totalRevenue)}</div>
            <Progress value={(salesOverview.totalRevenue / salesOverview.targetRevenue) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Target: {formatCurrency(salesOverview.targetRevenue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesOverview.totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: {formatCurrency(salesOverview.avgOrderValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesOverview.conversionRate}%</div>
            <Progress value={salesOverview.conversionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Lead to customer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesOverview.growthRate}%</div>
            <div className="flex items-center mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-500 ml-1">vs last month</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Revenue growth</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Regional Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Regional Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {salesPerformance.slice(0, 4).map((region) => (
                  <div key={region.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="font-medium">{region.region}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">{formatCurrency(region.revenue)}</span>
                      <div className="flex items-center">
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-500 ml-1">{region.growth}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentOrders.slice(0, 4).map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{order.customer}</p>
                      <p className="text-xs text-gray-600">{order.region} • {order.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{formatCurrency(order.amount)}</div>
                      <Badge variant={order.status === 'completed' ? 'default' : order.status === 'processing' ? 'secondary' : 'outline'}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {trends.map((trend) => (
                  <div key={trend.id} className="text-center">
                    <div className="text-2xl font-bold">{trend.current}{trend.unit}</div>
                    <div className="flex items-center justify-center mt-1">
                      {trend.change > 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm ml-1 ${trend.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {Math.abs(trend.change)}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{trend.metric}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regions Tab */}
        <TabsContent value="regions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Sales Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesPerformance.map((region) => (
                  <div key={region.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                      <div>
                        <h3 className="font-medium">{region.region}</h3>
                        <p className="text-sm text-gray-600">{region.customers} customers</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm font-medium">Revenue</div>
                        <div className="text-lg font-bold">{formatCurrency(region.revenue)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">Orders</div>
                        <div className="text-lg font-bold">{region.orders}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">Growth</div>
                        <div className="text-lg font-bold text-green-600">+{region.growth}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">Target</div>
                        <div className="text-lg font-bold">{formatCurrency(region.target)}</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-4 h-4 rounded-full bg-green-500" />
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.units} units sold</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm font-medium">Revenue</div>
                        <div className="text-lg font-bold">{formatCurrency(product.revenue)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">Growth</div>
                        <div className="text-lg font-bold text-green-600">+{product.growth}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">Margin</div>
                        <div className="text-lg font-bold">{product.margin}%</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input placeholder="Search orders..." className="max-w-sm" />
            </div>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(order.status)}`} />
                      <div>
                        <h3 className="font-medium">{order.customer}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{order.region}</Badge>
                          <span className="text-xs text-gray-600">{order.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm font-medium">Amount</div>
                        <div className="text-lg font-bold">{formatCurrency(order.amount)}</div>
                      </div>
                      <Badge variant={order.status === 'completed' ? 'default' : order.status === 'processing' ? 'secondary' : 'outline'}>
                        {order.status}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* KPIs Tab */}
        <TabsContent value="kpis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Key Performance Indicators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {kpis.map((kpi) => (
                  <div key={kpi.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{kpi.name}</h3>
                      <Badge variant={kpi.trend === 'up' ? 'default' : 'secondary'}>
                        {kpi.trend === 'up' ? 'Improving' : 'Declining'}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold mb-2">{kpi.value}{kpi.unit}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Target: {kpi.target}{kpi.unit}</span>
                      <Progress value={(kpi.value / kpi.target) * 100} className="w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Sales Alerts & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {alert.region || alert.customer || alert.order}
                        </Badge>
                        <span className="text-xs text-gray-600">{alert.time}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedSalesDashboard;
