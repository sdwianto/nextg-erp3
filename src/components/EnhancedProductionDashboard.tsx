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
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Target,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Gauge,
  Wrench,
  Clock,
  Calendar,
  Zap,
  Thermometer,
  Droplets,
  Gauge as GaugeIcon,
  AlertTriangle as AlertTriangleIcon,
  CheckCircle2,
  XCircle as XCircleIcon,
  MoreHorizontal,
  Download,
  RefreshCw,
  Settings as SettingsIcon,
  FileText,
  Tag,
  Award,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Factory,
  Package,
  Truck,
  Users,
  DollarSign,
  Database,
  Activity as ActivityIcon,
  BarChart3 as BarChart3Icon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Gauge as GaugeIcon2,
  Wrench as WrenchIcon,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  Zap as ZapIcon,
  Thermometer as ThermometerIcon,
  Droplets as DropletsIcon,
  Gauge as GaugeIcon3,
  AlertTriangle as AlertTriangleIcon2,
  CheckCircle2 as CheckCircle2Icon,
  XCircle as XCircleIcon2,
  MoreHorizontal as MoreHorizontalIcon,
  Download as DownloadIcon,
  RefreshCw as RefreshCwIcon,
  Settings as SettingsIcon2,
  FileText as FileTextIcon,
  Tag as TagIcon,
  Award as AwardIcon,
  TrendingUp as TrendingUpIcon2,
  TrendingDown as TrendingDownIcon2,
  Factory as FactoryIcon,
  Package as PackageIcon,
  Truck as TruckIcon,
  Users as UsersIcon,
  DollarSign as DollarSignIcon,
  Database as DatabaseIcon
} from 'lucide-react';

const EnhancedProductionDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  // Mock data for Production Dashboard
  const productionOverview = {
    totalLines: 8,
    activeLines: 7,
    totalOutput: 15420,
    targetOutput: 16000,
    efficiency: 96.4,
    qualityScore: 98.2,
    uptime: 94.8,
    energyConsumption: 1250
  };

  const productionLines = [
    { id: 1, name: 'Line A - Assembly', status: 'active', efficiency: 97.2, output: 2100, target: 2000, quality: 99.1, uptime: 96.5 },
    { id: 2, name: 'Line B - Packaging', status: 'active', efficiency: 95.8, output: 1850, target: 1900, quality: 98.5, uptime: 94.2 },
    { id: 3, name: 'Line C - Testing', status: 'maintenance', efficiency: 0, output: 0, target: 1800, quality: 0, uptime: 0 },
    { id: 4, name: 'Line D - Assembly', status: 'active', efficiency: 96.9, output: 1950, target: 2000, quality: 98.8, uptime: 95.8 },
    { id: 5, name: 'Line E - Packaging', status: 'active', efficiency: 94.5, output: 1750, target: 1800, quality: 97.9, uptime: 93.1 },
    { id: 6, name: 'Line F - Testing', status: 'active', efficiency: 98.1, output: 2200, target: 2200, quality: 99.3, uptime: 97.2 },
    { id: 7, name: 'Line G - Assembly', status: 'active', efficiency: 95.2, output: 1900, target: 2000, quality: 98.1, uptime: 94.5 },
    { id: 8, name: 'Line H - Packaging', status: 'active', efficiency: 96.7, output: 1670, target: 1700, quality: 98.7, uptime: 95.1 }
  ];

  const qualityControl = [
    { id: 1, line: 'Line A', testType: 'Visual Inspection', passed: 208, failed: 2, rate: 99.0, status: 'passed' },
    { id: 2, line: 'Line B', testType: 'Functional Test', passed: 185, failed: 3, rate: 98.4, status: 'passed' },
    { id: 3, line: 'Line C', testType: 'Performance Test', passed: 0, failed: 0, rate: 0, status: 'maintenance' },
    { id: 4, line: 'Line D', testType: 'Safety Test', passed: 194, failed: 1, rate: 99.5, status: 'passed' },
    { id: 5, line: 'Line E', testType: 'Durability Test', passed: 173, failed: 4, rate: 97.7, status: 'warning' }
  ];

  const maintenance = [
    { id: 1, equipment: 'Conveyor Belt A', type: 'Preventive', status: 'scheduled', date: '2024-02-15', duration: '4 hours', assigned: 'John Smith' },
    { id: 2, equipment: 'Robot Arm B', type: 'Corrective', status: 'in-progress', date: '2024-02-14', duration: '6 hours', assigned: 'Mike Johnson' },
    { id: 3, equipment: 'Testing Machine C', type: 'Preventive', status: 'completed', date: '2024-02-13', duration: '3 hours', assigned: 'Sarah Wilson' },
    { id: 4, equipment: 'Packaging Unit D', type: 'Emergency', status: 'scheduled', date: '2024-02-16', duration: '8 hours', assigned: 'David Brown' }
  ];

  const sensors = [
    { id: 1, name: 'Temperature Sensor A', location: 'Line A', value: 24.5, unit: '°C', status: 'normal', threshold: 30 },
    { id: 2, name: 'Pressure Sensor B', location: 'Line B', value: 2.8, unit: 'bar', status: 'warning', threshold: 3.0 },
    { id: 3, name: 'Humidity Sensor C', location: 'Line C', value: 45.2, unit: '%', status: 'normal', threshold: 60 },
    { id: 4, name: 'Vibration Sensor D', location: 'Line D', value: 0.15, unit: 'mm/s', status: 'normal', threshold: 0.5 },
    { id: 5, name: 'Flow Sensor E', location: 'Line E', value: 12.8, unit: 'L/min', status: 'normal', threshold: 15 }
  ];

  const trends = [
    { id: 1, metric: 'Production Efficiency', current: 96.4, previous: 94.8, change: 1.7, unit: '%' },
    { id: 2, metric: 'Quality Score', current: 98.2, previous: 97.5, change: 0.7, unit: '%' },
    { id: 3, metric: 'Energy Consumption', current: 1250, previous: 1320, change: -5.3, unit: 'kWh' },
    { id: 4, metric: 'Uptime', current: 94.8, previous: 93.2, change: 1.7, unit: '%' }
  ];

  const kpis = [
    { id: 1, name: 'Overall Equipment Effectiveness', value: 91.2, target: 95, unit: '%', trend: 'up' },
    { id: 2, name: 'Mean Time Between Failures', value: 120, target: 150, unit: 'hours', trend: 'down' },
    { id: 3, name: 'Mean Time To Repair', value: 2.5, target: 2.0, unit: 'hours', trend: 'down' },
    { id: 4, name: 'First Pass Yield', value: 96.8, target: 98, unit: '%', trend: 'up' },
    { id: 5, name: 'Production Cycle Time', value: 45, target: 40, unit: 'minutes', trend: 'down' },
    { id: 6, name: 'Inventory Turnover', value: 12.5, target: 15, unit: 'times', trend: 'up' }
  ];

  const alerts = [
    { id: 1, type: 'warning', message: 'Pressure sensor reading above threshold', equipment: 'Line B', time: '30 min ago' },
    { id: 2, type: 'info', message: 'Preventive maintenance completed', equipment: 'Line C', time: '2 hours ago' },
    { id: 3, type: 'error', message: 'Quality test failure rate increased', equipment: 'Line E', time: '1 hour ago' },
    { id: 4, type: 'success', message: 'Production target exceeded', equipment: 'Line A', time: '4 hours ago' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'info': return <Eye className="h-4 w-4 text-blue-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSensorStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Production Management</h1>
          <p className="text-gray-600">Real-time production monitoring and control</p>
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
            <CardTitle className="text-sm font-medium">Production Efficiency</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionOverview.efficiency}%</div>
            <Progress value={productionOverview.efficiency} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Target: 95%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Output</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionOverview.totalOutput.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Target: {productionOverview.targetOutput.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionOverview.qualityScore}%</div>
            <Progress value={productionOverview.qualityScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Excellent quality</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productionOverview.uptime}%</div>
            <Progress value={productionOverview.uptime} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">High availability</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lines">Production Lines</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="sensors">Sensors</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Production Lines Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Factory className="h-5 w-5 mr-2" />
                  Production Lines Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {productionLines.slice(0, 4).map((line) => (
                  <div key={line.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(line.status)}`} />
                      <span className="font-medium">{line.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">{line.efficiency}%</span>
                      <Progress value={line.efficiency} className="w-20" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Quality Tests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Recent Quality Tests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {qualityControl.slice(0, 4).map((test) => (
                  <div key={test.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{test.line}</p>
                      <p className="text-xs text-gray-600">{test.testType}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{test.rate}%</div>
                      <Badge variant={test.status === 'passed' ? 'default' : test.status === 'warning' ? 'secondary' : 'outline'}>
                        {test.status}
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
              <CardTitle>Production Performance Trends</CardTitle>
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

        {/* Production Lines Tab */}
        <TabsContent value="lines" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Production Lines Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productionLines.map((line) => (
                  <div key={line.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(line.status)}`} />
                      <div>
                        <h3 className="font-medium">{line.name}</h3>
                        <p className="text-sm text-gray-600">Status: {line.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm font-medium">Efficiency</div>
                        <div className="text-lg font-bold">{line.efficiency}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">Output</div>
                        <div className="text-lg font-bold">{line.output}/{line.target}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">Quality</div>
                        <div className="text-lg font-bold">{line.quality}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">Uptime</div>
                        <div className="text-lg font-bold">{line.uptime}%</div>
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

        {/* Quality Control Tab */}
        <TabsContent value="quality" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quality Control Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualityControl.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(test.status)}`} />
                      <div>
                        <h3 className="font-medium">{test.line}</h3>
                        <p className="text-sm text-gray-600">{test.testType}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm font-medium">Passed</div>
                        <div className="text-lg font-bold text-green-600">{test.passed}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">Failed</div>
                        <div className="text-lg font-bold text-red-600">{test.failed}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">Success Rate</div>
                        <div className="text-lg font-bold">{test.rate}%</div>
                      </div>
                      <Badge variant={test.status === 'passed' ? 'default' : test.status === 'warning' ? 'secondary' : 'outline'}>
                        {test.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenance.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(task.status)}`} />
                      <div>
                        <h3 className="font-medium">{task.equipment}</h3>
                        <p className="text-sm text-gray-600">{task.type} • {task.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm font-medium">Date</div>
                        <div className="text-lg font-bold">{task.date}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">Assigned</div>
                        <div className="text-lg font-bold">{task.assigned}</div>
                      </div>
                      <Badge variant={task.status === 'completed' ? 'default' : task.status === 'in-progress' ? 'secondary' : 'outline'}>
                        {task.status}
                      </Badge>
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

        {/* Sensors Tab */}
        <TabsContent value="sensors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Sensor Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sensors.map((sensor) => (
                  <div key={sensor.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(sensor.status)}`} />
                      <div>
                        <h3 className="font-medium">{sensor.name}</h3>
                        <p className="text-sm text-gray-600">{sensor.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm font-medium">Current Value</div>
                        <div className={`text-lg font-bold ${getSensorStatusColor(sensor.status)}`}>
                          {sensor.value} {sensor.unit}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">Threshold</div>
                        <div className="text-lg font-bold">{sensor.threshold} {sensor.unit}</div>
                      </div>
                      <Badge variant={sensor.status === 'normal' ? 'default' : sensor.status === 'warning' ? 'secondary' : 'destructive'}>
                        {sensor.status}
                      </Badge>
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
                Production Alerts & Notifications
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
                        <Badge variant="outline" className="text-xs">{alert.equipment}</Badge>
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

export default EnhancedProductionDashboard;
