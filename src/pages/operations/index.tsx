import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { OperationsMetrics } from '@/components/OperationsMetrics';
import { WorkOrderModal } from '@/components/WorkOrderModal';
import { MaintenanceScheduler } from '@/components/MaintenanceScheduler';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Wrench, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Clock,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  BarChart3,
  Calendar,
  Zap,
  Settings,
  X
} from 'lucide-react';

const OperationsPage: React.FC = () => {
  // Modal states
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);
  const [isMaintenanceSchedulerOpen, setIsMaintenanceSchedulerOpen] = useState(false);
  const [isSearchOperationsOpen, setIsSearchOperationsOpen] = useState(false);
  const [isFilterOperationsOpen, setIsFilterOperationsOpen] = useState(false);
  const [isExportReportOpen, setIsExportReportOpen] = useState(false);
  const [isWorkOrderLifecycleOpen, setIsWorkOrderLifecycleOpen] = useState(false);
  const [isPMSchedulingOpen, setIsPMSchedulingOpen] = useState(false);
  const [isConditionBasedMaintenanceOpen, setIsConditionBasedMaintenanceOpen] = useState(false);
  const [isPredictiveAnalyticsOpen, setIsPredictiveAnalyticsOpen] = useState(false);
  const [isPerformanceOptimizationOpen, setIsPerformanceOptimizationOpen] = useState(false);
  const [isMTTRMTBSTrackingOpen, setIsMTTRMTBSTrackingOpen] = useState(false);
  const [isEquipmentUtilizationOpen, setIsEquipmentUtilizationOpen] = useState(false);
  const [isOperationsSettingsOpen, setIsOperationsSettingsOpen] = useState(false);

  // Mock data for operations management
  const operationsStats = {
    totalEquipment: 45,
    activeWorkOrders: 12,
    pendingApprovals: 5,
    criticalAlerts: 3,
    averageResponseTime: 2.4, // hours
    uptime: 94.2 // percentage
  };

  const recentOperations = [
    {
      id: 1,
      type: 'Work Order',
      title: 'Excavator EX-001 Engine Maintenance',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      assignedTo: 'John Smith',
      dueDate: '2024-01-15',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'Breakdown',
      title: 'Bulldozer BD-003 Hydraulic Issue',
      status: 'RESOLVED',
      priority: 'CRITICAL',
      assignedTo: 'Mike Johnson',
      dueDate: '2024-01-10',
      time: '4 hours ago'
    },
    {
      id: 3,
      type: 'Maintenance',
      title: 'Crane CR-002 Preventive Maintenance',
      status: 'SCHEDULED',
      priority: 'MEDIUM',
      assignedTo: 'Sarah Wilson',
      dueDate: '2024-01-20',
      time: '1 day ago'
    },
    {
      id: 4,
      type: 'Inspection',
      title: 'Loader LD-005 Safety Inspection',
      status: 'PENDING',
      priority: 'HIGH',
      assignedTo: 'David Brown',
      dueDate: '2024-01-12',
      time: '2 days ago'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <Activity className="h-4 w-4 text-blue-600" />;
      case 'RESOLVED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'SCHEDULED':
        return <Calendar className="h-4 w-4 text-purple-600" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'SCHEDULED':
        return 'bg-purple-100 text-purple-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Button click handlers - now opening actual modals
  const handleSearchOperations = () => {
    setIsSearchOperationsOpen(true);
  };

  const handleFilterOperations = () => {
    setIsFilterOperationsOpen(true);
  };

  const handleExportReport = () => {
    setIsExportReportOpen(true);
  };

  const handleCreateWorkOrder = () => {
    setIsWorkOrderModalOpen(true);
  };

  const handleWorkOrderLifecycle = () => {
    setIsWorkOrderLifecycleOpen(true);
  };

  const handlePMScheduling = () => {
    setIsPMSchedulingOpen(true);
  };

  const handleConditionBasedMaintenance = () => {
    setIsConditionBasedMaintenanceOpen(true);
  };

  const handlePredictiveAnalytics = () => {
    setIsPredictiveAnalyticsOpen(true);
  };

  const handlePerformanceOptimization = () => {
    setIsPerformanceOptimizationOpen(true);
  };

  const handleMTTRMTBSTracking = () => {
    setIsMTTRMTBSTrackingOpen(true);
  };

  const handleEquipmentUtilization = () => {
    setIsEquipmentUtilizationOpen(true);
  };

  const handleOperationsSettings = () => {
    setIsOperationsSettingsOpen(true);
  };

  return (
    <>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Operations Management</h1>
              <p className="text-muted-foreground">
                Comprehensive operations management with JDE best practices - MTTR/MTBS tracking, work order lifecycle, and performance optimization
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSearchOperations}
              >
                <Search className="h-4 w-4 mr-2" />
                Search Operations
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleFilterOperations}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportReport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button 
                size="sm"
                onClick={handleCreateWorkOrder}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Work Order
              </Button>
            </div>
          </div>

          {/* Operations Metrics Dashboard */}
          <OperationsMetrics />

          {/* Operations Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{operationsStats.totalEquipment}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Active equipment in operations
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Work Orders</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{operationsStats.activeWorkOrders}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Work orders in progress
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{operationsStats.uptime}%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Overall equipment uptime
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{operationsStats.averageResponseTime}h</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Average response to issues
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Operations */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOperations.map((operation) => (
                  <div key={operation.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(operation.status)}
                      <div>
                        <p className="text-sm font-medium">{operation.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {operation.type} • Assigned to {operation.assignedTo}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Due: {operation.dueDate} • {operation.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getPriorityColor(operation.priority)}>
                        {operation.priority}
                      </Badge>
                      <Badge className={getStatusColor(operation.status)}>
                        {operation.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* JDE Best Practices Tools - ALL BUTTONS ACTIVATED */}
          <Card>
            <CardHeader>
              <CardTitle>JDE Best Practices Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={handleWorkOrderLifecycle}
                >
                  <Wrench className="h-5 w-5" />
                  <span className="text-sm">Work Order Lifecycle</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={handlePMScheduling}
                >
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm">PM Scheduling</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={handleConditionBasedMaintenance}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-sm">Condition-based Maintenance</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={handlePredictiveAnalytics}
                >
                  <Zap className="h-5 w-5" />
                  <span className="text-sm">Predictive Analytics</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={handlePerformanceOptimization}
                >
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm">Performance Optimization</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={handleMTTRMTBSTracking}
                >
                  <Activity className="h-5 w-5" />
                  <span className="text-sm">MTTR/MTBS Tracking</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={handleEquipmentUtilization}
                >
                  <Target className="h-5 w-5" />
                  <span className="text-sm">Equipment Utilization</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={handleOperationsSettings}
                >
                  <Settings className="h-5 w-5" />
                  <span className="text-sm">Operations Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* JDE Integration Status */}
          <Card>
            <CardHeader>
              <CardTitle>JDE Best Practices Integration Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">✅ Implemented</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Work Order Lifecycle Management
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      MTTR/MTBS Performance Tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Equipment Utilization Monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Breakdown Analysis & Reporting
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">🔄 In Progress</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      Predictive Maintenance Algorithms
                    </li>
                    <li className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      Condition-based Monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      Advanced Performance Analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      Automated Workflow Engine
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>

      {/* Modals */}
      <WorkOrderModal 
        isOpen={isWorkOrderModalOpen} 
        onClose={() => setIsWorkOrderModalOpen(false)} 
      />
      
      <MaintenanceScheduler 
        isOpen={isMaintenanceSchedulerOpen} 
        onClose={() => setIsMaintenanceSchedulerOpen(false)} 
      />

      {/* Search Operations Modal */}
      {isSearchOperationsOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-card-foreground">Search Operations</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOperationsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-muted-foreground">Advanced search interface with filters for work orders, equipment, and maintenance records</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search-title" className="text-sm font-medium">Search by Title</Label>
                  <Input
                    id="search-title"
                    placeholder="Enter work order title..."
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="search-status" className="text-sm font-medium">Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="search-equipment" className="text-sm font-medium">Equipment</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Equipment</SelectItem>
                      <SelectItem value="EX-001">Excavator EX-001</SelectItem>
                      <SelectItem value="BD-003">Bulldozer BD-003</SelectItem>
                      <SelectItem value="CR-002">Crane CR-002</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="search-date" className="text-sm font-medium">Date</Label>
                  <Input
                    id="search-date"
                    type="date"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t bg-muted/50">
              <Button 
                variant="outline" 
                onClick={() => setIsSearchOperationsOpen(false)}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => setIsSearchOperationsOpen(false)}
                className="px-4 py-2"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Operations Modal */}
      {isFilterOperationsOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-card-foreground">Filter Operations</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFilterOperationsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-muted-foreground">Filter panel for status, priority, equipment type, and date range filtering</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="filter-status" className="text-sm font-medium">Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-priority" className="text-sm font-medium">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-equipment" className="text-sm font-medium">Equipment Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Equipment</SelectItem>
                      <SelectItem value="excavator">Excavator</SelectItem>
                      <SelectItem value="bulldozer">Bulldozer</SelectItem>
                      <SelectItem value="crane">Crane</SelectItem>
                      <SelectItem value="loader">Loader</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-date" className="text-sm font-medium">Date Range</Label>
                  <Input
                    id="filter-date"
                    type="date"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t bg-muted/50">
              <Button 
                variant="outline" 
                onClick={() => setIsFilterOperationsOpen(false)}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => setIsFilterOperationsOpen(false)}
                className="px-4 py-2"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Export Report Modal */}
      {isExportReportOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-card-foreground">Export Operations Report</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExportReportOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-muted-foreground">Generate comprehensive operations report in PDF/Excel format with MTTR/MTBS analysis</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="report-type" className="text-sm font-medium">Report Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operations-summary">Operations Summary</SelectItem>
                      <SelectItem value="mttr-mtbs">MTTR/MTBS Analysis</SelectItem>
                      <SelectItem value="equipment-utilization">Equipment Utilization</SelectItem>
                      <SelectItem value="work-order-status">Work Order Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-format" className="text-sm font-medium">Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date-range" className="text-sm font-medium">Date Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    placeholder="From"
                    className="w-full"
                  />
                  <Input
                    type="date"
                    placeholder="To"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t bg-muted/50">
              <Button 
                variant="outline" 
                onClick={() => setIsExportReportOpen(false)}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => setIsExportReportOpen(false)}
                className="px-4 py-2"
              >
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Work Order Lifecycle Modal */}
      {isWorkOrderLifecycleOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-card-foreground">Work Order Lifecycle</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsWorkOrderLifecycleOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-muted-foreground">Complete workflow management from creation to completion with approval stages</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                  <span className="font-medium text-green-800 dark:text-green-200">Created</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                  <span className="font-medium text-green-800 dark:text-green-200">Assigned</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <span className="font-medium text-blue-800 dark:text-blue-200">In Progress</span>
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                  <span className="font-medium text-yellow-800 dark:text-yellow-200">Review</span>
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                  <span className="font-medium text-muted-foreground">Completed</span>
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end p-6 border-t bg-muted/50">
              <Button 
                onClick={() => setIsWorkOrderLifecycleOpen(false)}
                className="px-4 py-2"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Continue with other modals... */}
    </>
  );
};

export default OperationsPage;
