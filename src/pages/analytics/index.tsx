import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/utils/api';
import { BarChart3, PieChart, LineChart, Activity, DollarSign, Package, Filter, Download, RefreshCw, TrendingUp, TrendingDown, Eye, Target, Zap } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const [dateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
    endDate: new Date().toISOString().split('T')[0]!,
  });

  // tRPC API calls
  const { data: businessMetrics } = api.bi.getBusinessMetrics.useQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const { data: customerAnalytics } = api.bi.getCustomerAnalytics.useQuery();

  // Derived data from API with proper null checks
  const analyticsData = {
    totalRevenue: businessMetrics?.data?.financial?.totalRevenue || 0,
    totalOrders: businessMetrics?.data?.sales?.totalOrders || 0,
    totalCustomers: businessMetrics?.data?.sales?.customerCount || 0,
    averageOrderValue: businessMetrics?.data?.sales?.averageOrderValue || 0,
    conversionRate: 0, // Not available in current API
    revenueMetrics: [
      { name: 'Total Revenue', value: businessMetrics?.data?.financial?.totalRevenue || 0, change: 0, trend: 'neutral' },
      { name: 'Monthly Growth', value: 0, change: 0, trend: 'neutral' },
      { name: 'Revenue per Customer', value: businessMetrics?.data?.financial?.totalRevenue && businessMetrics?.data?.sales?.customerCount ? 
        businessMetrics.data.financial.totalRevenue / businessMetrics.data.sales.customerCount : 0, change: 0, trend: 'neutral' },
      { name: 'Average Order Value', value: businessMetrics?.data?.sales?.averageOrderValue || 0, change: 0, trend: 'neutral' },
    ],
    monthlyData: [
      { month: 'Jan', revenue: 0, orders: 0, customers: 0 },
      { month: 'Feb', revenue: 0, orders: 0, customers: 0 },
      { month: 'Mar', revenue: 0, orders: 0, customers: 0 },
      { month: 'Apr', revenue: 0, orders: 0, customers: 0 },
      { month: 'May', revenue: 0, orders: 0, customers: 0 },
      { month: 'Jun', revenue: 0, orders: 0, customers: 0 }
    ],
    customerSegments: [
      { name: 'Individual', count: customerAnalytics?.data?.customerSegments?.individual || 0, revenue: 0, percentage: 0 },
      { name: 'Company', count: customerAnalytics?.data?.customerSegments?.company || 0, revenue: 0, percentage: 0 },
      { name: 'Government', count: customerAnalytics?.data?.customerSegments?.government || 0, revenue: 0, percentage: 0 },
      { name: 'Others', count: 0, revenue: 0, percentage: 0 },
    ],
    performanceMetrics: [
      { metric: 'Equipment Utilization', value: `${businessMetrics?.data?.operations?.equipmentUtilization?.toFixed(1) || 0}%`, change: 0 },
      { metric: 'Active Employees', value: `${businessMetrics?.data?.operations?.activeEmployees || 0}`, change: 0 },
      { metric: 'Profit Margin', value: `${businessMetrics?.data?.financial?.profitMargin?.toFixed(1) || 0}%`, change: 0 },
    ],
    topProducts: [
      { name: 'Equipment Rental', sales: businessMetrics?.data?.financial?.totalRevenue || 0, units: 0, margin: 0 },
      { name: 'Maintenance Services', sales: 0, units: 0, margin: 0 },
      { name: 'Spare Parts', sales: 0, units: 0, margin: 0, revenue: 0, percentage: 0 },
    ],
  };

  const _getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const _getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Data Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive data analysis and performance metrics</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full sm:w-auto"
              onClick={() => {
                // console.log('Opening analytics filter...');
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full sm:w-auto"
              onClick={() => {
                // console.log('Exporting analytics data...');
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full sm:w-auto"
              onClick={() => {
                // console.log('Refreshing analytics data...');
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
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
              <div className="text-2xl font-bold">${(analyticsData.totalRevenue || 0).toLocaleString()}</div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+{analyticsData.revenueMetrics[0]?.change ?? 0}%</span>
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(analyticsData.totalOrders || 0).toLocaleString()}</div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+{analyticsData.revenueMetrics[1]?.change ?? 0}%</span>
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(analyticsData.averageOrderValue || 0).toLocaleString()}</div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+0%</span>
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.conversionRate}%</div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+0%</span>
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsData.revenueMetrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {typeof metric.value === 'number' ? (metric.value || 0).toLocaleString() : metric.value}
                </div>
                <div className={`flex items-center text-sm ${_getTrendColor(metric.trend)}`}>
                  {_getTrendIcon(metric.trend)}
                  <span className="ml-1">{metric.change > 0 ? '+' : ''}{metric.change}%</span>
                  <span className="text-muted-foreground ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Performance Trends (6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.monthlyData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.month}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        Revenue: ${(item.revenue || 0).toLocaleString()}
                      </span>
                      <span className="text-sm text-blue-600">
                        Orders: {item.orders}
                      </span>
                      <span className="text-sm text-green-600">
                        Customers: {item.customers}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Segments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Customer Segments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.customerSegments.map((segment, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${
                        index === 0 ? 'bg-blue-500' : 
                        index === 1 ? 'bg-green-500' : 
                        index === 2 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm font-medium">{segment.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{segment.percentage}%</div>
                      <div className="text-xs text-muted-foreground">
                        ${(segment.revenue || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Behavior */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Customer Behavior Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analyticsData.performanceMetrics.map((behavior, index) => (
                <div key={index} className="text-center p-3 border rounded-md">
                  <div className="text-2xl font-bold text-blue-600">{behavior.value}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{behavior.metric}</div>
                  <div className="text-sm text-green-600">
                    +{behavior.change}% vs last month
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Product Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Top Performing Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {product.units} units sold
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${(product.sales || 0).toLocaleString()}</div>
                      <div className="text-sm text-green-600">
                        {product.margin}% margin
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Product Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Revenue by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topProducts.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${
                        index === 0 ? 'bg-blue-500' : 
                        index === 1 ? 'bg-green-500' : 
                        index === 2 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{category.percentage}%</div>
                      <div className="text-xs text-muted-foreground">
                        ${(category.revenue || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Key Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Revenue Growth</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Revenue growth analysis will be available once data is populated in the system.
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Customer Retention</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Customer retention metrics will be calculated from actual customer data once available.
                </p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Inventory Optimization</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Inventory turnover analysis will be available once inventory data is populated.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage; 