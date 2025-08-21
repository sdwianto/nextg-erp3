import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

import {
  TrendingUp,
  BarChart3,
  Activity,
  Brain,
  Target,
  AlertTriangle,
  Download,
  RefreshCw,
  Eye,
  Settings,
  Database,
  Zap,
  CheckCircle,
  XCircle,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  FileText
} from 'lucide-react';

const EnhancedBIDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');


  // Mock data for BI Dashboard
  const biOverview = {
    totalModules: 8,
    activeModules: 7,
    dataSources: 12,
    realTimeConnections: 8,
    lastSync: '2 minutes ago',
    systemHealth: 95,
    performanceScore: 88,
    dataQuality: 92
  };

  const modules = [
    { id: 1, name: 'Inventory', status: 'active', performance: 94, dataQuality: 96, lastUpdate: '1 min ago' },
    { id: 2, name: 'Finance', status: 'active', performance: 89, dataQuality: 93, lastUpdate: '2 min ago' },
    { id: 3, name: 'Procurement', status: 'active', performance: 91, dataQuality: 88, lastUpdate: '3 min ago' },
    { id: 4, name: 'HRMS', status: 'active', performance: 87, dataQuality: 95, lastUpdate: '1 min ago' },
    { id: 5, name: 'CRM', status: 'active', performance: 92, dataQuality: 90, lastUpdate: '2 min ago' },
    { id: 6, name: 'Production', status: 'maintenance', performance: 78, dataQuality: 85, lastUpdate: '5 min ago' },
    { id: 7, name: 'Sales', status: 'active', performance: 90, dataQuality: 89, lastUpdate: '1 min ago' },
    { id: 8, name: 'Reports', status: 'active', performance: 95, dataQuality: 94, lastUpdate: '30 sec ago' }
  ];

  const predictions = [
    { id: 1, type: 'Inventory', prediction: 'Stock shortage in 3 days', confidence: 87, impact: 'high', action: 'Increase order quantity' },
    { id: 2, type: 'Sales', prediction: 'Revenue increase 15%', confidence: 92, impact: 'positive', action: 'Prepare for demand' },
    { id: 3, type: 'Finance', prediction: 'Cash flow issue', confidence: 78, impact: 'medium', action: 'Review expenses' },
    { id: 4, type: 'Production', prediction: 'Equipment failure', confidence: 85, impact: 'high', action: 'Schedule maintenance' }
  ];

  const trends = [
    { id: 1, metric: 'Data Processing Speed', current: 2.3, previous: 2.8, change: -17.9, unit: 'ms' },
    { id: 2, metric: 'Query Response Time', current: 150, previous: 180, change: 16.7, unit: 'ms' },
    { id: 3, metric: 'Data Accuracy', current: 98.5, previous: 97.2, change: 1.3, unit: '%' },
    { id: 4, metric: 'System Uptime', current: 99.9, previous: 99.7, change: 0.2, unit: '%' }
  ];

  const kpis = [
    { id: 1, name: 'Data Processing Efficiency', value: 94.2, target: 95, unit: '%', trend: 'up' },
    { id: 2, name: 'Query Performance', value: 2.1, target: 2.0, unit: 's', trend: 'down' },
    { id: 3, name: 'Data Quality Score', value: 96.8, target: 98, unit: '%', trend: 'up' },
    { id: 4, name: 'Real-time Sync Rate', value: 99.2, target: 99.5, unit: '%', trend: 'up' },
    { id: 5, name: 'Prediction Accuracy', value: 89.5, target: 92, unit: '%', trend: 'up' },
    { id: 6, name: 'System Response Time', value: 180, target: 150, unit: 'ms', trend: 'down' }
  ];

  const alerts = [
    { id: 1, type: 'warning', message: 'Data sync delay detected', module: 'Production', time: '5 min ago' },
    { id: 2, type: 'info', message: 'New prediction model deployed', module: 'Sales', time: '10 min ago' },
    { id: 3, type: 'error', message: 'Database connection timeout', module: 'Finance', time: '15 min ago' },
    { id: 4, type: 'success', message: 'Data quality improved', module: 'Inventory', time: '20 min ago' }
  ];

  const reports = [
    { id: 1, name: 'Executive Summary', type: 'daily', lastRun: '2 hours ago', status: 'completed' },
    { id: 2, name: 'Performance Analytics', type: 'weekly', lastRun: '1 day ago', status: 'completed' },
    { id: 3, name: 'Predictive Insights', type: 'daily', lastRun: '6 hours ago', status: 'running' },
    { id: 4, name: 'Data Quality Report', type: 'monthly', lastRun: '3 days ago', status: 'scheduled' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Intelligence Dashboard</h1>
          <p className="text-gray-600">AI-powered insights and predictive analytics</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{biOverview.systemHealth}%</div>
            <Progress value={biOverview.systemHealth} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Excellent performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Modules</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{biOverview.activeModules}/{biOverview.totalModules}</div>
            <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Quality</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{biOverview.dataQuality}%</div>
            <Progress value={biOverview.dataQuality} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">High accuracy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Real-time Connections</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{biOverview.realTimeConnections}</div>
            <p className="text-xs text-muted-foreground mt-1">Live data streams</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Module Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Module Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {modules.slice(0, 4).map((module) => (
                  <div key={module.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(module.status)}`} />
                      <span className="font-medium">{module.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">{module.performance}%</span>
                      <Progress value={module.performance} className="w-20" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Recent AI Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {predictions.slice(0, 3).map((prediction) => (
                  <div key={prediction.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{prediction.type}</span>
                      <Badge variant={prediction.impact === 'high' ? 'destructive' : 'secondary'}>
                        {prediction.confidence}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{prediction.prediction}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* System Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>System Performance Metrics</CardTitle>
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

        {/* Modules Tab */}
        <TabsContent value="modules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Module Performance & Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modules.map((module) => (
                  <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(module.status)}`} />
                      <div>
                        <h3 className="font-medium">{module.name}</h3>
                        <p className="text-sm text-gray-600">Last update: {module.lastUpdate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm font-medium">Performance</div>
                        <div className="text-lg font-bold">{module.performance}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">Data Quality</div>
                        <div className="text-lg font-bold">{module.dataQuality}%</div>
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

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI-Powered Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions.map((prediction) => (
                  <div key={prediction.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{prediction.type}</Badge>
                        <Badge variant={prediction.impact === 'high' ? 'destructive' : prediction.impact === 'positive' ? 'default' : 'secondary'}>
                          {prediction.impact}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{prediction.confidence}% confidence</div>
                      </div>
                    </div>
                    <p className="font-medium mb-2">{prediction.prediction}</p>
                    <p className="text-sm text-gray-600">Recommended action: {prediction.action}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trends.map((trend) => (
                  <div key={trend.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{trend.metric}</h3>
                      <p className="text-sm text-gray-600">Previous: {trend.previous}{trend.unit}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{trend.current}{trend.unit}</div>
                      <div className="flex items-center">
                        {trend.change > 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ml-1 ${trend.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {trend.change > 0 ? '+' : ''}{trend.change}%
                        </span>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  System Alerts
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
                          <Badge variant="outline" className="text-xs">{alert.module}</Badge>
                          <span className="text-xs text-gray-600">{alert.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scheduled Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Scheduled Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-sm text-gray-600">{report.type} • {report.lastRun}</p>
                      </div>
                      <Badge variant={report.status === 'completed' ? 'default' : report.status === 'running' ? 'secondary' : 'outline'}>
                        {report.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedBIDashboard;
