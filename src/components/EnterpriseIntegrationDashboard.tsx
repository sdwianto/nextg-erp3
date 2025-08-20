import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { api } from '@/utils/api';
import {
  TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Target, AlertTriangle, Download, RefreshCw, Eye, Settings, Database, Zap, Users, DollarSign, Package, Building, Calendar, Clock, CheckCircle, XCircle, Minus, ArrowUpRight, ArrowDownRight, LineChart, Scatter, Gauge, Filter, Search, Plus, MoreHorizontal, FileText, Link, ArrowRight, ArrowLeft, RotateCcw, Shield, Database as DatabaseIcon, Activity as ActivityIcon, BarChart3 as BarChart3Icon, PieChart as PieChartIcon, LineChart as LineChartIcon, Gauge as GaugeIcon, AlertTriangle as AlertTriangleIcon, CheckCircle as CheckCircleIcon, XCircle as XCircleIcon, Minus as MinusIcon, ArrowUpRight as ArrowUpRightIcon, ArrowDownRight as ArrowDownRightIcon, TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon, Download as DownloadIcon, RefreshCw as RefreshCwIcon, Eye as EyeIcon, Settings as SettingsIcon, FileText as FileTextIcon, Plus as PlusIcon, Search as SearchIcon, Filter as FilterIcon, MoreHorizontal as MoreHorizontalIcon, Link as LinkIcon, ArrowRight as ArrowRightIcon, ArrowLeft as ArrowLeftIcon, RotateCcw as RotateCcwIcon, Shield as ShieldIcon
} from 'lucide-react';

const EnterpriseIntegrationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEntity, setSelectedEntity] = useState('EQ001');
  const [selectedModule, setSelectedModule] = useState('asset');

  // API Queries
  const { data: masterData } = api.integration.getMasterData.useQuery({
    entityType: 'equipment_master',
    search: '',
  });

  const { data: integratedData } = api.integration.getIntegratedData.useQuery({
    module: selectedModule as any,
    entityId: selectedEntity,
    includeRelated: true,
  });

  const { data: realTimeSync } = api.integration.getRealTimeSync.useQuery({
    modules: ['procurement', 'inventory', 'maintenance', 'asset', 'rental'],
  });

  const { data: consistencyReport } = api.integration.checkDataConsistency.useQuery({
    modules: ['procurement', 'inventory', 'maintenance', 'asset', 'rental'],
    entityType: 'equipment',
  });

  // Mock data for demonstration
  const integrationOverview = {
    totalEntities: 150,
    activeWorkflows: 25,
    dataConsistency: 96.7,
    realTimeSync: true,
    modules: {
      procurement: { status: 'active', records: 45 },
      inventory: { status: 'active', records: 120 },
      maintenance: { status: 'active', records: 35 },
      asset: { status: 'active', records: 28 },
      rental: { status: 'active', records: 18 },
    },
  };

  const workflowStatus = [
    { id: 1, name: 'Purchase Requisition → PO', status: 'active', count: 8 },
    { id: 2, name: 'PO → Inventory Receipt', status: 'active', count: 12 },
    { id: 3, name: 'Maintenance Request → Work Order', status: 'active', count: 15 },
    { id: 4, name: 'Work Order → Parts Consumption', status: 'active', count: 22 },
    { id: 5, name: 'Equipment Transfer → Asset Update', status: 'active', count: 5 },
    { id: 6, name: 'Rental Contract → Billing', status: 'active', count: 18 },
  ];

  const dataFlowMetrics = [
    { module: 'Procurement', inbound: 45, outbound: 38, efficiency: 84.4 },
    { module: 'Inventory', inbound: 38, outbound: 42, efficiency: 110.5 },
    { module: 'Maintenance', inbound: 42, outbound: 35, efficiency: 83.3 },
    { module: 'Asset', inbound: 35, outbound: 28, efficiency: 80.0 },
    { module: 'Rental', inbound: 28, outbound: 25, efficiency: 89.3 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangleIcon className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircleIcon className="h-4 w-4 text-red-500" />;
      case 'success': return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'info': return <EyeIcon className="h-4 w-4 text-blue-500" />;
      default: return <MinusIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enterprise Integration Dashboard</h1>
          <p className="text-muted-foreground">
            JDE-Style Master Data Management & Cross-Module Integration
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entities</CardTitle>
            <DatabaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrationOverview.totalEntities}</div>
            <p className="text-xs text-muted-foreground">
              Master data records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrationOverview.activeWorkflows}</div>
            <p className="text-xs text-muted-foreground">
              Cross-module processes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Consistency</CardTitle>
            <ShieldIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrationOverview.dataConsistency}%</div>
            <p className="text-xs text-muted-foreground">
              Across all modules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Real-time Sync</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrationOverview.realTimeSync ? (
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
              ) : (
                <XCircleIcon className="h-6 w-6 text-red-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Live data synchronization
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Integration Overview</TabsTrigger>
          <TabsTrigger value="workflows">Workflow Status</TabsTrigger>
          <TabsTrigger value="dataflow">Data Flow Analysis</TabsTrigger>
          <TabsTrigger value="consistency">Data Consistency</TabsTrigger>
          <TabsTrigger value="realtime">Real-time Sync</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Module Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DatabaseIcon className="h-5 w-5 mr-2" />
                  Module Integration Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(integrationOverview.modules).map(([module, data]) => (
                  <div key={module} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(data.status)}`} />
                      <span className="font-medium capitalize">{module}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{data.records} records</span>
                      <Badge variant="secondary">{data.status}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Integration Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3Icon className="h-5 w-5 mr-2" />
                  Integration Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Data Synchronization</span>
                    <span>98.5%</span>
                  </div>
                  <Progress value={98.5} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Workflow Efficiency</span>
                    <span>94.2%</span>
                  </div>
                  <Progress value={94.2} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Error Rate</span>
                    <span>1.3%</span>
                  </div>
                  <Progress value={1.3} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ActivityIcon className="h-5 w-5 mr-2" />
                Cross-Module Workflow Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflowStatus.map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(workflow.status)}`} />
                      <div>
                        <h4 className="font-medium">{workflow.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {workflow.count} active instances
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{workflow.status}</Badge>
                      <Button variant="ghost" size="sm">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dataflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowRightIcon className="h-5 w-5 mr-2" />
                Data Flow Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataFlowMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{metric.module}</h4>
                        <p className="text-sm text-muted-foreground">
                          In: {metric.inbound} | Out: {metric.outbound}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">{metric.efficiency}%</div>
                        <div className="text-sm text-muted-foreground">Efficiency</div>
                      </div>
                      <Progress value={metric.efficiency} className="w-20 h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consistency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldIcon className="h-5 w-5 mr-2" />
                Data Consistency Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              {consistencyReport?.data && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {consistencyReport.data.results.consistentRecords}
                      </div>
                      <div className="text-sm text-green-600">Consistent Records</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {consistencyReport.data.results.inconsistentRecords}
                      </div>
                      <div className="text-sm text-red-600">Inconsistent Records</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {consistencyReport.data.results.consistencyRate}%
                      </div>
                      <div className="text-sm text-blue-600">Consistency Rate</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Data Issues</h4>
                    <div className="space-y-2">
                      {consistencyReport.data.results.issues.map((issue) => (
                        <div key={issue.issueId} className="flex items-start space-x-3 p-3 border rounded-lg">
                          {getAlertIcon(issue.severity === 'high' ? 'error' : issue.severity === 'medium' ? 'warning' : 'info')}
                          <div className="flex-1">
                            <div className="font-medium">{issue.description}</div>
                            <div className="text-sm text-muted-foreground">
                              Module: {issue.module} | Entity: {issue.entityId}
                            </div>
                            <div className="text-sm text-blue-600 mt-1">
                              {issue.suggestedAction}
                            </div>
                          </div>
                          <Badge variant={issue.severity === 'high' ? 'destructive' : issue.severity === 'medium' ? 'secondary' : 'outline'}>
                            {issue.severity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Real-time Synchronization Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {realTimeSync?.data && (
                <div className="space-y-4">
                  {Object.entries(realTimeSync.data).map(([module, data]: [string, any]) => (
                    <div key={module} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                        <div>
                          <h4 className="font-medium capitalize">{module}</h4>
                          <p className="text-sm text-muted-foreground">
                            Last update: {data.lastUpdate?.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {module === 'procurement' && `${data.newPurchaseOrders} new POs`}
                          {module === 'inventory' && `${data.lowStockItems} low stock items`}
                          {module === 'maintenance' && `${data.scheduledWorkOrders} scheduled WOs`}
                          {module === 'asset' && `${data.equipmentAvailability}% availability`}
                          {module === 'rental' && `${data.activeRentals} active rentals`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {module === 'rental' && formatCurrency(data.revenueToday)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnterpriseIntegrationDashboard;
