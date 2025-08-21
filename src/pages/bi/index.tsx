import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart,
  LineChart,
  Activity,
  DollarSign,
  Users,
  Package,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

const BusinessIntelligencePage: React.FC = () => {
  // Mock data for BI dashboard
  const biData = {
    revenue: {
      current: 0,
      previous: 0,
      change: 0,
      trend: 'neutral'
    },
    profit: {
      current: 0,
      previous: 0,
      change: 0,
      trend: 'neutral'
    },
    orders: {
      current: 0,
      previous: 0,
      change: 0,
      trend: 'neutral'
    },
    customers: {
      current: 0,
      previous: 0,
      change: 0,
      trend: 'neutral'
    },
    monthlyData: [
      { month: 'Jan', revenue: 0, profit: 0 },
      { month: 'Feb', revenue: 0, profit: 0 },
      { month: 'Mar', revenue: 0, profit: 0 },
      { month: 'Apr', revenue: 0, profit: 0 },
      { month: 'May', revenue: 0, profit: 0 },
      { month: 'Jun', revenue: 0, profit: 0 }
    ],
    topProducts: [
      { name: 'Excavator Spare Parts', sales: 0, units: 0 },
      { name: 'Hydraulic Systems', sales: 0, units: 0 },
      { name: 'Electrical Parts', sales: 0, units: 0 }
    ],
    customerSegments: [
      { segment: 'Mining Companies', value: 0, color: '#3B82F6' },
      { segment: 'Construction', value: 0, color: '#10B981' },
      { segment: 'Manufacturing', value: 0, color: '#F59E0B' }
    ]
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Intelligence</h1>
            <p className="text-gray-600 dark:text-gray-400">Advanced analytics and insights for strategic decision making</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full sm:w-auto"
              onClick={() => {
                // console.log('Opening BI filter...');
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
                // console.log('Exporting BI data...');
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
                // console.log('Refreshing BI data...');
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(biData.revenue.current || 0).toLocaleString()}</div>
              <div className={`flex items-center text-sm ${_getTrendColor(biData.revenue.trend)}`}>
                {_getTrendIcon(biData.revenue.trend)}
                <span className="ml-1">+{biData.revenue.change}%</span>
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(biData.profit.current || 0).toLocaleString()}</div>
              <div className={`flex items-center text-sm ${_getTrendColor(biData.profit.trend)}`}>
                {_getTrendIcon(biData.profit.trend)}
                <span className="ml-1">+{biData.profit.change}%</span>
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(biData.customers.current || 0).toLocaleString()}</div>
              <div className={`flex items-center text-sm ${_getTrendColor(biData.customers.trend)}`}>
                {_getTrendIcon(biData.customers.trend)}
                <span className="ml-1">+{biData.customers.change}%</span>
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
              <div className="text-2xl font-bold">{(biData.orders.current || 0).toLocaleString()}</div>
              <div className={`flex items-center text-sm ${_getTrendColor(biData.orders.trend)}`}>
                {_getTrendIcon(biData.orders.trend)}
                <span className="ml-1">+{biData.orders.change}%</span>
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Revenue Trend (6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {biData.monthlyData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.month}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        Revenue: ${item.revenue.toLocaleString()}
                      </span>
                      <span className="text-sm text-green-600">
                        Profit: ${item.profit.toLocaleString()}
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
                {biData.customerSegments.map((segment, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: segment.color }}
                      ></div>
                      <span className="text-sm font-medium">{segment.segment}</span>
                    </div>
                    <span className="text-sm font-bold">{segment.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Performing Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Product</th>
                    <th className="text-right py-3 px-4 font-medium">Sales</th>
                    <th className="text-right py-3 px-4 font-medium">Units Sold</th>
                    <th className="text-right py-3 px-4 font-medium">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {biData.topProducts.map((product, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4 font-medium">{product.name}</td>
                      <td className="py-3 px-4 text-right">${product.sales.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">{product.units}</td>
                      <td className="py-3 px-4 text-right">
                        <Badge variant="secondary">
                          {index === 0 ? 'Top' : index === 1 ? 'High' : 'Good'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Insights Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200">Revenue Growth</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Revenue increased by 27.6% compared to last month, driven by strong sales in mining equipment.
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200">Customer Acquisition</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  New customer acquisition rate is 5.9%, with mining companies being the primary segment.
                </p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Product Performance</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Excavator spare parts continue to be the top-selling product category.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium">Expand Mining Segment</h4>
                  <p className="text-sm text-muted-foreground">
                    Focus on expanding product offerings for mining companies.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium">Inventory Optimization</h4>
                  <p className="text-sm text-muted-foreground">
                    Increase stock levels for top-performing products.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium">Customer Retention</h4>
                  <p className="text-sm text-muted-foreground">
                    Implement loyalty programs for existing customers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BusinessIntelligencePage; 