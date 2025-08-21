import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { TrendingUpIcon, TrendingDownIcon, BarChart3Icon, LineChartIcon, TargetIcon, AlertTriangleIcon, Users, DollarSign, Activity, RefreshCw, Download, Settings } from 'lucide-react';
import { BrainIcon } from 'lucide-react';

const AdvancedAnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('predictive');

  // Mock data for advanced analytics
  const predictiveInsights = {
    equipmentFailures: [
      { equipmentId: 'EQ001', failureProbability: 0.85, predictedDate: '2024-03-15', confidence: 92 },
      { equipmentId: 'EQ002', failureProbability: 0.72, predictedDate: '2024-03-22', confidence: 88 },
      { equipmentId: 'EQ003', failureProbability: 0.45, predictedDate: '2024-04-05', confidence: 75 },
    ],
    demandForecast: [
      { itemId: 'SP001', predictedDemand: 150, currentStock: 25, reorderDate: '2024-03-10' },
      { itemId: 'SP002', predictedDemand: 85, currentStock: 40, reorderDate: '2024-03-25' },
      { itemId: 'SP003', predictedDemand: 200, currentStock: 15, reorderDate: '2024-03-05' },
    ],
    revenueProjection: [
      { month: 'Jan 2024', projected: 250000000, actual: 245000000, variance: 2.0 },
      { month: 'Feb 2024', projected: 280000000, actual: 275000000, variance: 1.8 },
      { month: 'Mar 2024', projected: 320000000, actual: null, variance: null },
    ],
  };

  const businessIntelligence = {
    kpis: {
      equipmentUtilization: 78.5,
      maintenanceEfficiency: 92.3,
      inventoryTurnover: 4.2,
      customerSatisfaction: 8.7,
      revenueGrowth: 12.5,
      costReduction: 8.3,
    },
    trends: [
      { metric: 'Equipment Utilization', trend: 'up', value: 78.5, change: 5.2 },
      { metric: 'Maintenance Efficiency', trend: 'up', value: 92.3, change: 3.1 },
      { metric: 'Inventory Turnover', trend: 'down', value: 4.2, change: -0.8 },
      { metric: 'Customer Satisfaction', trend: 'up', value: 8.7, change: 0.3 },
    ],
    anomalies: [
      { type: 'high_utilization', equipmentId: 'EQ001', severity: 'medium', description: 'Equipment utilization above 90% for 3 consecutive days' },
      { type: 'low_stock', itemId: 'SP003', severity: 'high', description: 'Critical spare part stock below safety level' },
      { type: 'maintenance_delay', workOrderId: 'WO001', severity: 'low', description: 'Preventive maintenance delayed by 2 days' },
    ],
  };

  const performanceMetrics = {
    operational: {
      uptime: 96.8,
      responseTime: 2.3,
      throughput: 85.2,
      quality: 98.5,
    },
    financial: {
      roi: 18.5,
      profitMargin: 22.3,
      cashFlow: 15.7,
      assetTurnover: 2.1,
    },
    customer: {
      satisfaction: 8.7,
      retention: 94.2,
      acquisition: 12.5,
      lifetime: 3.2,
    },
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? <TrendingUpIcon className="h-4 w-4 text-green-500" /> : <TrendingDownIcon className="h-4 w-4 text-red-500" />;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Predictive Insights & Business Intelligence
          </p>
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
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predictive Accuracy</CardTitle>
            <BrainIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              AI model accuracy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">
              Year over year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Reduction</CardTitle>
            <TrendingDownIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-8.3%</div>
            <p className="text-xs text-muted-foreground">
              Operational costs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <TargetIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.7/10</div>
            <p className="text-xs text-muted-foreground">
              Average rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="intelligence">Business Intelligence</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="predictive" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Equipment Failure Prediction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangleIcon className="h-5 w-5 mr-2" />
                  Equipment Failure Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictiveInsights.equipmentFailures.map((failure, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${failure.failureProbability > 0.7 ? 'bg-red-500' : failure.failureProbability > 0.5 ? 'bg-yellow-500' : 'bg-green-500'}`} />
                        <div>
                          <h4 className="font-medium">{failure.equipmentId}</h4>
                          <p className="text-sm text-muted-foreground">
                            Predicted: {failure.predictedDate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatPercentage(failure.failureProbability * 100)}</div>
                        <div className="text-sm text-muted-foreground">
                          {failure.confidence}% confidence
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Demand Forecasting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3Icon className="h-5 w-5 mr-2" />
                  Demand Forecasting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictiveInsights.demandForecast.map((forecast, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{forecast.itemId}</h4>
                        <p className="text-sm text-muted-foreground">
                          Current Stock: {forecast.currentStock}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{forecast.predictedDemand}</div>
                        <div className="text-sm text-muted-foreground">
                          Reorder: {forecast.reorderDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Projection */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChartIcon className="h-5 w-5 mr-2" />
                  Revenue Projection vs Actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictiveInsights.revenueProjection.map((projection, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{projection.month}</h4>
                        <p className="text-sm text-muted-foreground">
                          Projected: {formatCurrency(projection.projected)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {projection.actual ? formatCurrency(projection.actual) : 'Pending'}
                        </div>
                        {projection.variance && (
                          <div className={`text-sm ${projection.variance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {projection.variance > 0 ? '+' : ''}{projection.variance}% variance
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* KPI Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TargetIcon className="h-5 w-5 mr-2" />
                  Key Performance Indicators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {formatPercentage(businessIntelligence.kpis.equipmentUtilization)}
                      </div>
                      <div className="text-sm text-blue-600">Equipment Utilization</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {formatPercentage(businessIntelligence.kpis.maintenanceEfficiency)}
                      </div>
                      <div className="text-sm text-green-600">Maintenance Efficiency</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">
                        {businessIntelligence.kpis.inventoryTurnover}
                      </div>
                      <div className="text-sm text-purple-600">Inventory Turnover</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">
                        {businessIntelligence.kpis.customerSatisfaction}/10
                      </div>
                      <div className="text-sm text-orange-600">Customer Satisfaction</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trend Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUpIcon className="h-5 w-5 mr-2" />
                  Trend Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {businessIntelligence.trends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getTrendIcon(trend.trend)}
                        <div>
                          <h4 className="font-medium">{trend.metric}</h4>
                          <p className="text-sm text-muted-foreground">
                            Current: {trend.value}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${trend.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {trend.change > 0 ? '+' : ''}{trend.change}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Change
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Operational Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Operational Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uptime</span>
                      <span>{formatPercentage(performanceMetrics.operational.uptime)}</span>
                    </div>
                    <Progress value={performanceMetrics.operational.uptime} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Response Time</span>
                      <span>{performanceMetrics.operational.responseTime}s</span>
                    </div>
                    <Progress value={performanceMetrics.operational.responseTime * 10} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Throughput</span>
                      <span>{formatPercentage(performanceMetrics.operational.throughput)}</span>
                    </div>
                    <Progress value={performanceMetrics.operational.throughput} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Quality</span>
                      <span>{formatPercentage(performanceMetrics.operational.quality)}</span>
                    </div>
                    <Progress value={performanceMetrics.operational.quality} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Financial Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>ROI</span>
                      <span>{formatPercentage(performanceMetrics.financial.roi)}</span>
                    </div>
                    <Progress value={performanceMetrics.financial.roi * 2} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Profit Margin</span>
                      <span>{formatPercentage(performanceMetrics.financial.profitMargin)}</span>
                    </div>
                    <Progress value={performanceMetrics.financial.profitMargin * 2} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cash Flow</span>
                      <span>{formatPercentage(performanceMetrics.financial.cashFlow)}</span>
                    </div>
                    <Progress value={performanceMetrics.financial.cashFlow * 2} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Asset Turnover</span>
                      <span>{performanceMetrics.financial.assetTurnover}x</span>
                    </div>
                    <Progress value={performanceMetrics.financial.assetTurnover * 20} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Customer Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Satisfaction</span>
                      <span>{performanceMetrics.customer.satisfaction}/10</span>
                    </div>
                    <Progress value={performanceMetrics.customer.satisfaction * 10} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Retention</span>
                      <span>{formatPercentage(performanceMetrics.customer.retention)}</span>
                    </div>
                    <Progress value={performanceMetrics.customer.retention} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Acquisition</span>
                      <span>{formatPercentage(performanceMetrics.customer.acquisition)}</span>
                    </div>
                    <Progress value={performanceMetrics.customer.acquisition * 2} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Lifetime Value</span>
                      <span>{performanceMetrics.customer.lifetime} years</span>
                    </div>
                    <Progress value={performanceMetrics.customer.lifetime * 20} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangleIcon className="h-5 w-5 mr-2" />
                Anomaly Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businessIntelligence.anomalies.map((anomaly, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full mt-2 ${getSeverityColor(anomaly.severity)}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium capitalize">{anomaly.type.replace('_', ' ')}</h4>
                        <Badge variant={anomaly.severity === 'high' ? 'destructive' : anomaly.severity === 'medium' ? 'secondary' : 'outline'}>
                          {anomaly.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {anomaly.description}
                      </p>
                      <div className="text-sm text-blue-600 mt-2">
                        ID: {anomaly.equipmentId || anomaly.itemId || anomaly.workOrderId}
                      </div>
                    </div>
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

export default AdvancedAnalyticsDashboard;
