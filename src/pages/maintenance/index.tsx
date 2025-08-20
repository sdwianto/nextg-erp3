import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Wrench, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Plus,
  Search,
  Filter,
  Calendar,
  Settings,
  FileText,
  DollarSign,
  MapPin,
  User,
  HardHat,
  Shield,
  TrendingUp,
  BarChart3,
  Activity,
  Download,
  Database,
  Gauge,
  Target,
  Zap
} from 'lucide-react';
import { api } from '@/utils/api';

interface MaintenanceRecord {
  id: number;
  equipmentName: string;
  equipmentCode: string;
  maintenanceType: string;
  description: string;
  scheduledDate: string;
  status: string;
  assignedTechnician: string;
  estimatedCost: number;
  priority: string;
  progressDetails?: string;
  actualCost?: number;
  completionDate?: string;
  location?: string;
  equipmentType?: string;
  operatingHours?: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
}

const MaintenancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [progressDetails, setProgressDetails] = useState('');
  const [actualCost, setActualCost] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state for adding new maintenance
  const [newMaintenance, setNewMaintenance] = useState({
    equipment: '',
    maintenanceType: '',
    description: '',
    scheduledDate: '',
    priority: '',
    assignedTechnician: '',
    estimatedCost: ''
  });

  // API calls
  const { data: dashboardData, isLoading: dashboardLoading } = api.rentalMaintenance.getDashboardData.useQuery();
  const { data: equipmentData, isLoading: equipmentLoading } = api.rentalMaintenance.getEquipment.useQuery({
    page: 1,
    limit: 50
  });
  const { data: predictiveData } = api.rentalMaintenance.getPredictiveMaintenance.useQuery();

  // Mock data for demonstration
  const maintenanceData = {
    totalEquipment: dashboardData?.summary?.totalEquipment ?? 0,
    scheduledMaintenance: dashboardData?.summary?.pendingMaintenanceRecords ?? 0,
    completedMaintenance: dashboardData?.summary?.completedMaintenanceRecords ?? 0,
    overdueMaintenance: 0,
    totalCost: 0,
    inProgress: dashboardData?.summary?.maintenanceEquipment ?? 0
  };

  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);

  const handleRecordClick = (record: MaintenanceRecord) => {
    setSelectedRecord(record);
    setIsDetailDialogOpen(true);
  };

  const handleStartWork = (recordId: number) => {
    setMaintenanceRecords(prev => prev.map(record => 
      record.id === recordId 
        ? { ...record, status: 'IN_PROGRESS' }
        : record
    ));
  };

  const handleUpdateProgress = (record: MaintenanceRecord) => {
    setSelectedRecord(record);
    setProgressDetails(record.progressDetails ?? '');
    setActualCost(record.actualCost?.toString() ?? '');
    setIsProgressDialogOpen(true);
  };

  const handleCompleteMaintenance = (recordId: number) => {
    setMaintenanceRecords(prev => prev.map(record => 
      record.id === recordId 
        ? { 
            ...record, 
            status: 'COMPLETED',
            completionDate: new Date().toISOString().split('T')[0],
            actualCost: parseFloat(actualCost) || record.estimatedCost
          }
        : record
    ));
    setIsProgressDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'OVERDUE': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (dashboardLoading || equipmentLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section with Search */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Maintenance Management</h1>
              <p className="text-muted-foreground">
                Comprehensive equipment maintenance and predictive maintenance management
              </p>
            </div>
          </div>
          
          {/* Search and Action Header */}
          <div className="flex items-center gap-4 p-4 bg-card border rounded-lg">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search operations, equipment, or maintenance records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Dialog open={isAddMaintenanceOpen} onOpenChange={setIsAddMaintenanceOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Work Order
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Schedule New Maintenance</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="equipment">Equipment</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select equipment" />
                        </SelectTrigger>
                        <SelectContent>
                          {equipmentData?.equipment?.map((equipment: { id: string; name: string; code: string }) => (
                            <SelectItem key={equipment.id} value={equipment.id}>
                              {equipment.name} - {equipment.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="maintenanceType">Maintenance Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="preventive">Preventive Maintenance</SelectItem>
                          <SelectItem value="corrective">Corrective Maintenance</SelectItem>
                          <SelectItem value="emergency">Emergency Maintenance</SelectItem>
                          <SelectItem value="predictive">Predictive Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter maintenance description..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="scheduledDate">Scheduled Date</Label>
                      <Input
                        id="scheduledDate"
                        type="date"
                      />
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="assignedTechnician">Assigned Technician</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select technician" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tech1">John Smith</SelectItem>
                          <SelectItem value="tech2">Mike Johnson</SelectItem>
                          <SelectItem value="tech3">David Wilson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="estimatedCost">Estimated Cost</Label>
                      <Input
                        id="estimatedCost"
                        type="number"
                        placeholder="Enter estimated cost"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddMaintenanceOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="default" onClick={() => setIsAddMaintenanceOpen(false)}>
                    Schedule Maintenance
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Section 1: Maintenance Overview - Critical Parameters */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Maintenance Overview</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <Card className="border-l-4 border-l-red-500 dark:border-l-red-400">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{maintenanceData.totalEquipment}</div>
                <p className="text-xs text-muted-foreground">
                  Equipment under maintenance
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500 dark:border-l-blue-400">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{maintenanceData.scheduledMaintenance}</div>
                <p className="text-xs text-muted-foreground">
                  Upcoming maintenance
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-yellow-500 dark:border-l-yellow-400">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{maintenanceData.inProgress}</div>
                <p className="text-xs text-muted-foreground">
                  Currently being maintained
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500 dark:border-l-green-400">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{maintenanceData.completedMaintenance}</div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-600 dark:border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{maintenanceData.overdueMaintenance}</div>
                <p className="text-xs text-muted-foreground">
                  Requires attention
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500 dark:border-l-purple-400">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(maintenanceData.totalCost)}</div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section 2: Maintenance Activities - RFQ Priority 3 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Maintenance Activities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-500 dark:hover:border-blue-400">
              <CardContent className="p-6 text-center">
                <Wrench className="h-12 w-12 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-lg mb-2">Work Order Management</h3>
                <p className="text-sm text-muted-foreground">Full lifecycle with workflow</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-green-500 dark:hover:border-green-400">
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-green-600 dark:text-green-400" />
                <h3 className="font-semibold text-lg mb-2">Maintenance Scheduling</h3>
                <p className="text-sm text-muted-foreground">Preventive maintenance scheduling</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-purple-500 dark:hover:border-purple-400">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold text-lg mb-2">Parts Consumption</h3>
                <p className="text-sm text-muted-foreground">Track parts from inventory to repairs</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-orange-500 dark:hover:border-orange-400">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 text-orange-600 dark:text-orange-400" />
                <h3 className="font-semibold text-lg mb-2">Predictive Analytics</h3>
                <p className="text-sm text-muted-foreground">AI-powered maintenance insights</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-indigo-500 dark:hover:border-indigo-400">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 mx-auto mb-3 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold text-lg mb-2">Work Order Lifecycle</h3>
                <p className="text-sm text-muted-foreground">Track work order progress</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-yellow-500 dark:hover:border-yellow-400">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-yellow-600 dark:text-yellow-400" />
                <h3 className="font-semibold text-lg mb-2">Condition-based Maintenance</h3>
                <p className="text-sm text-muted-foreground">Monitor equipment condition</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-teal-500 dark:hover:border-teal-400">
              <CardContent className="p-6 text-center">
                <User className="h-12 w-12 mx-auto mb-3 text-teal-600 dark:text-teal-400" />
                <h3 className="font-semibold text-lg mb-2">Breakdown Analysis</h3>
                <p className="text-sm text-muted-foreground">Analyze equipment failures</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-red-500 dark:hover:border-red-400">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 mx-auto mb-3 text-red-600 dark:text-red-400" />
                <h3 className="font-semibold text-lg mb-2">Safety Protocols</h3>
                <p className="text-sm text-muted-foreground">Manage safety and compliance</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section 3: Settings & Configuration */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Settings & Configuration</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Database className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h3 className="font-semibold">Equipment Master</h3>
                    <p className="text-sm text-muted-foreground">Manage equipment database and specifications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Gauge className="h-8 w-8 text-green-600 dark:text-green-400" />
                  <div>
                    <h3 className="font-semibold">Performance Reports</h3>
                    <p className="text-sm text-muted-foreground">Generate and view maintenance reports</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  <div>
                    <h3 className="font-semibold">Analytics Dashboard</h3>
                    <p className="text-sm text-muted-foreground">Advanced analytics and insights</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Settings className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                  <div>
                    <h3 className="font-semibold">Operations Settings</h3>
                    <p className="text-sm text-muted-foreground">Configure maintenance operations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Zap className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <h3 className="font-semibold">Automation Rules</h3>
                    <p className="text-sm text-muted-foreground">Set up automated maintenance triggers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <h3 className="font-semibold">Documentation</h3>
                    <p className="text-sm text-muted-foreground">Maintenance procedures and manuals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Maintenance Details</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Equipment</Label>
                  <p className="text-sm font-medium">{selectedRecord.equipmentName}</p>
                </div>
                <div>
                  <Label>Equipment Code</Label>
                  <p className="text-sm font-medium">{selectedRecord.equipmentCode}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Maintenance Type</Label>
                  <p className="text-sm font-medium">{selectedRecord.maintenanceType}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedRecord.status)}>
                    {selectedRecord.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <p className="text-sm">{selectedRecord.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Scheduled Date</Label>
                  <p className="text-sm font-medium">{selectedRecord.scheduledDate}</p>
                </div>
                <div>
                  <Label>Assigned Technician</Label>
                  <p className="text-sm font-medium">{selectedRecord.assignedTechnician}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                  Close
                </Button>
                {selectedRecord.status === 'SCHEDULED' && (
                  <Button variant="default" onClick={() => handleStartWork(selectedRecord.id)}>
                    Start Work
                  </Button>
                )}
                {selectedRecord.status === 'IN_PROGRESS' && (
                  <Button variant="default" onClick={() => handleUpdateProgress(selectedRecord)}>
                    Update Progress
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Progress Dialog */}
      <Dialog open={isProgressDialogOpen} onOpenChange={setIsProgressDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Maintenance Progress</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="progressDetails">Progress Details</Label>
              <Textarea
                id="progressDetails"
                value={progressDetails}
                onChange={(e) => setProgressDetails(e.target.value)}
                placeholder="Enter progress details..."
              />
            </div>
            <div>
              <Label htmlFor="actualCost">Actual Cost</Label>
              <Input
                id="actualCost"
                type="number"
                value={actualCost}
                onChange={(e) => setActualCost(e.target.value)}
                placeholder="Enter actual cost"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsProgressDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={() => selectedRecord && handleCompleteMaintenance(selectedRecord.id)}>
                Complete Maintenance
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MaintenancePage;
