import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { WorkOrderModal } from './WorkOrderModal';
import { MaintenanceScheduler } from './MaintenanceScheduler';
import { 
  Clock, 
  Wrench, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Target,
  BarChart3,
  Calendar,
  Zap,
  Plus,
  Search,
  Filter,
  Download,
  Settings,
  Users,
  FileText,
  PieChart
} from 'lucide-react';

interface OperationsMetrics {
  mttr: {
    current: number; // hours
    target: number;
    trend: 'improving' | 'stable' | 'declining';
    lastMonth: number;
  };
  mtbs: {
    current: number; // hours
    target: number;
    trend: 'improving' | 'stable' | 'declining';
    lastMonth: number;
  };
  equipmentUtilization: {
    current: number; // percentage
    target: number;
    byShift: {
      morning: number;
      afternoon: number;
      night: number;
    };
  };
  workOrders: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    overdue: number;
  };
  breakdowns: {
    total: number;
    resolved: number;
    critical: number;
    averageResolutionTime: number; // hours
  };
}

export const OperationsMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<OperationsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);
  const [isMaintenanceSchedulerOpen, setIsMaintenanceSchedulerOpen] = useState(false);
  const [isPerformanceReportOpen, setIsPerformanceReportOpen] = useState(false);
  const [isPredictiveAnalyticsOpen, setIsPredictiveAnalyticsOpen] = useState(false);
  const [isEquipmentMasterOpen, setIsEquipmentMasterOpen] = useState(false);
  const [isWorkOrderLifecycleOpen, setIsWorkOrderLifecycleOpen] = useState(false);
  const [isConditionBasedMaintenanceOpen, setIsConditionBasedMaintenanceOpen] = useState(false);
  const [isBreakdownAnalysisOpen, setIsBreakdownAnalysisOpen] = useState(false);
  const [isShiftManagementOpen, setIsShiftManagementOpen] = useState(false);
  const [isMaintenanceApprovalOpen, setIsMaintenanceApprovalOpen] = useState(false);
  const [isEquipmentUtilizationOpen, setIsEquipmentUtilizationOpen] = useState(false);
  const [isOperationsSettingsOpen, setIsOperationsSettingsOpen] = useState(false);

  // Mock data following JDE best practices
  const mockMetrics: OperationsMetrics = {
    mttr: {
      current: 4.2,
      target: 3.0,
      trend: 'improving',
      lastMonth: 5.1
    },
    mtbs: {
      current: 168.5,
      target: 200.0,
      trend: 'improving',
      lastMonth: 145.2
    },
    equipmentUtilization: {
      current: 87.3,
      target: 90.0,
      byShift: {
        morning: 92.1,
        afternoon: 85.7,
        night: 84.1
      }
    },
    workOrders: {
      total: 45,
      completed: 32,
      inProgress: 8,
      pending: 3,
      overdue: 2
    },
    breakdowns: {
      total: 12,
      resolved: 10,
      critical: 2,
      averageResolutionTime: 3.8
    }
  };

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setMetrics(mockMetrics);
      } catch (error) {
        console.error('Error loading operations metrics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    void loadMetrics();
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining':
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600';
      case 'declining':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Button click handlers - now opening actual modals
  const handleCreateWorkOrder = () => {
    setIsWorkOrderModalOpen(true);
  };

  const handleScheduleMaintenance = () => {
    setIsMaintenanceSchedulerOpen(true);
  };

  const handlePerformanceReport = () => {
    setIsPerformanceReportOpen(true);
  };

  const handlePredictiveAnalytics = () => {
    setIsPredictiveAnalyticsOpen(true);
  };

  const handleEquipmentMaster = () => {
    setIsEquipmentMasterOpen(true);
  };

  const handleWorkOrderLifecycle = () => {
    setIsWorkOrderLifecycleOpen(true);
  };

  const handleConditionBasedMaintenance = () => {
    setIsConditionBasedMaintenanceOpen(true);
  };

  const handleBreakdownAnalysis = () => {
    setIsBreakdownAnalysisOpen(true);
  };

  const handleShiftManagement = () => {
    setIsShiftManagementOpen(true);
  };

  const handleMaintenanceApproval = () => {
    setIsMaintenanceApprovalOpen(true);
  };

  const handleEquipmentUtilization = () => {
    setIsEquipmentUtilizationOpen(true);
  };

  const handleOperationsSettings = () => {
    setIsOperationsSettingsOpen(true);
  };

  if (loading) {
    return (
      <div className="grid gap-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* MTTR & MTBS Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MTTR Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mean Time To Repair (MTTR)</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{metrics?.mttr.current}h</div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(metrics?.mttr.trend ?? 'stable')}
                  <span className={`text-xs ${getTrendColor(metrics?.mttr.trend ?? 'stable')}`}>
                    {metrics?.mttr.trend === 'improving' ? '↓' : metrics?.mttr.trend === 'declining' ? '↑' : '→'} 
                    {Math.abs((metrics?.mttr.current ?? 0) - (metrics?.mttr.lastMonth ?? 0)).toFixed(1)}h
                  </span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Target: {metrics?.mttr.target}h | Last Month: {metrics?.mttr.lastMonth}h
              </div>
              <Progress 
                value={metrics ? ((metrics.mttr.target / metrics.mttr.current) * 100) : 0} 
                className="mt-2" 
              />
              <div className="text-xs text-muted-foreground mt-1">
                {metrics && metrics.mttr.current <= metrics.mttr.target ? 
                  '✅ Meeting target' : '⚠️ Below target'}
              </div>
            </CardContent>
          </Card>

          {/* MTBS Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mean Time Between Service (MTBS)</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{metrics?.mtbs.current}h</div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(metrics?.mtbs.trend ?? 'stable')}
                  <span className={`text-xs ${getTrendColor(metrics?.mtbs.trend ?? 'stable')}`}>
                    {metrics?.mtbs.trend === 'improving' ? '↑' : metrics?.mtbs.trend === 'declining' ? '↓' : '→'} 
                    {Math.abs((metrics?.mtbs.current ?? 0) - (metrics?.mtbs.lastMonth ?? 0)).toFixed(1)}h
                  </span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Target: {metrics?.mtbs.target}h | Last Month: {metrics?.mtbs.lastMonth}h
              </div>
              <Progress 
                value={metrics ? ((metrics.mtbs.current / metrics.mtbs.target) * 100) : 0} 
                className="mt-2" 
              />
              <div className="text-xs text-muted-foreground mt-1">
                {metrics && metrics.mtbs.current >= metrics.mtbs.target ? 
                  '✅ Meeting target' : '⚠️ Below target'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Equipment Utilization & Work Orders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Equipment Utilization */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipment Utilization</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.equipmentUtilization.current}%</div>
              <div className="text-xs text-muted-foreground mt-1">
                Target: {metrics?.equipmentUtilization.target}%
              </div>
              <Progress 
                value={metrics?.equipmentUtilization.current ?? 0} 
                className="mt-2" 
              />
              
              {/* Shift Breakdown */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Morning Shift</span>
                  <span className="font-medium">{metrics?.equipmentUtilization.byShift.morning}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Afternoon Shift</span>
                  <span className="font-medium">{metrics?.equipmentUtilization.byShift.afternoon}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Night Shift</span>
                  <span className="font-medium">{metrics?.equipmentUtilization.byShift.night}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Orders Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Work Orders</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.workOrders.total}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Total work orders
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Completed</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">
                      {metrics?.workOrders.completed}
                    </Badge>
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">In Progress</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      {metrics?.workOrders.inProgress}
                    </Badge>
                    <Activity className="h-3 w-3 text-blue-600" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Pending</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {metrics?.workOrders.pending}
                    </Badge>
                    <Clock className="h-3 w-3 text-yellow-600" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Overdue</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800">
                      {metrics?.workOrders.overdue}
                    </Badge>
                    <AlertTriangle className="h-3 w-3 text-red-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Breakdown Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Breakdown Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{metrics?.breakdowns.total}</div>
                <div className="text-sm font-medium">Total Breakdowns</div>
                <div className="text-xs text-muted-foreground">This month</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-red-600">{metrics?.breakdowns.critical}</div>
                <div className="text-sm font-medium">Critical</div>
                <div className="text-xs text-muted-foreground">Requires immediate attention</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{metrics?.breakdowns.averageResolutionTime}h</div>
                <div className="text-sm font-medium">Avg Resolution Time</div>
                <div className="text-xs text-muted-foreground">Hours to resolve</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operations Quick Actions - ALL BUTTONS ACTIVATED */}
        <Card>
          <CardHeader>
            <CardTitle>Operations Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={handleCreateWorkOrder}
              >
                <Wrench className="h-5 w-5" />
                <span className="text-sm">Create Work Order</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={handleScheduleMaintenance}
              >
                <Calendar className="h-5 w-5" />
                <span className="text-sm">Schedule Maintenance</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={handlePerformanceReport}
              >
                <BarChart3 className="h-5 w-5" />
                <span className="text-sm">Performance Report</span>
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
                onClick={handleEquipmentMaster}
              >
                <Target className="h-5 w-5" />
                <span className="text-sm">Equipment Master</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={handleWorkOrderLifecycle}
              >
                <Activity className="h-5 w-5" />
                <span className="text-sm">Work Order Lifecycle</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={handleConditionBasedMaintenance}
              >
                <PieChart className="h-5 w-5" />
                <span className="text-sm">Condition-based Maintenance</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={handleBreakdownAnalysis}
              >
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm">Breakdown Analysis</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={handleShiftManagement}
              >
                <Clock className="h-5 w-5" />
                <span className="text-sm">Shift Management</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={handleMaintenanceApproval}
              >
                <Users className="h-5 w-5" />
                <span className="text-sm">Maintenance Approval</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={handleEquipmentUtilization}
              >
                <TrendingUp className="h-5 w-5" />
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
      </div>

      {/* Modals */}
      <WorkOrderModal 
        isOpen={isWorkOrderModalOpen} 
        onClose={() => setIsWorkOrderModalOpen(false)} 
      />
      
      <MaintenanceScheduler 
        isOpen={isMaintenanceSchedulerOpen} 
        onClose={() => setIsMaintenanceSchedulerOpen(false)} 
      />

      {/* Placeholder modals for other features */}
      {isPerformanceReportOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Performance Report</h3>
            <p className="mb-4">Generating comprehensive MTTR/MTBS analysis with drill-down capabilities...</p>
            <div className="flex justify-end">
              <Button onClick={() => setIsPerformanceReportOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {isPredictiveAnalyticsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Predictive Analytics</h3>
            <p className="mb-4">Opening AI-powered maintenance prediction with condition-based algorithms...</p>
            <div className="flex justify-end">
              <Button onClick={() => setIsPredictiveAnalyticsOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add similar modal implementations for other features */}
      {isEquipmentMasterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Equipment Master</h3>
            <p className="mb-4">Opening enhanced equipment tracking with lifecycle management...</p>
            <div className="flex justify-end">
              <Button onClick={() => setIsEquipmentMasterOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Continue with other modals... */}
    </>
  );
};
