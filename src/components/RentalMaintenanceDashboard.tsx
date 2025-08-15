// src/components/RentalMaintenanceDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Wrench, 
  Truck, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Activity
} from 'lucide-react';
// import { api } from '@/utils/api';

interface DashboardStats {
  totalEquipment: number;
  activeEquipment: number;
  underMaintenance: number;
  totalRentals: number;
  activeRentals: number;
  pendingReturns: number;
  maintenanceDue: number;
  revenue: number;
  utilization: number;
}

interface PredictiveMaintenance {
  id: string;
  equipmentName: string;
  equipmentCode: string;
  maintenanceType: string;
  predictedDate: string;
  confidence: number;
  priority: string;
  estimatedCost: number;
}

export const RentalMaintenanceDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [predictiveMaintenance, setPredictiveMaintenance] = useState<PredictiveMaintenance[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for now - will be replaced with API calls
  const mockStats: DashboardStats = {
    totalEquipment: 45,
    activeEquipment: 38,
    underMaintenance: 7,
    totalRentals: 18,
    activeRentals: 15,
    pendingReturns: 3,
    maintenanceDue: 5,
    revenue: 450000,
    utilization: 84.4
  };

  const mockPredictiveMaintenance: PredictiveMaintenance[] = [
    {
      id: '1',
      equipmentName: 'Loader LD-005',
      equipmentCode: 'LD-005',
      maintenanceType: 'PREVENTIVE',
      predictedDate: '2024-01-20',
      confidence: 85,
      priority: 'HIGH',
      estimatedCost: 2500
    },
    {
      id: '2',
      equipmentName: 'Bulldozer BD-003',
      equipmentCode: 'BD-003',
      maintenanceType: 'CORRECTIVE',
      predictedDate: '2024-01-25',
      confidence: 92,
      priority: 'CRITICAL',
      estimatedCost: 5000
    },
    {
      id: '3',
      equipmentName: 'Crane CR-002',
      equipmentCode: 'CR-002',
      maintenanceType: 'INSPECTION',
      predictedDate: '2024-01-30',
      confidence: 78,
      priority: 'MEDIUM',
      estimatedCost: 800
    }
  ];

  useEffect(() => {
    // Load mock data
    const loadData = async () => {
      try {
        setStats(mockStats);
        setPredictiveMaintenance(mockPredictiveMaintenance);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    void loadData();
  }, [mockStats, mockPredictiveMaintenance]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_use': return <Activity className="h-4 w-4 text-blue-600" />;
      case 'maintenance': return <Wrench className="h-4 w-4 text-orange-600" />;
      case 'repair': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
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
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Equipment Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEquipment ?? 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats?.activeEquipment ?? 0} active, {stats?.underMaintenance ?? 0} under maintenance
            </div>
            <Progress 
              value={stats?.utilization ?? 0} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        {/* Maintenance Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.underMaintenance ?? 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats?.maintenanceDue ?? 0} due, {stats?.underMaintenance ?? 0} in progress
            </div>
            {stats?.maintenanceDue && stats.maintenanceDue > 0 && (
              <Badge variant="destructive" className="mt-2">
                {stats.maintenanceDue} Due
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Rental Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats?.revenue ?? 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats?.activeRentals ?? 0} active rentals
            </div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Due */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Due</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.maintenanceDue ?? 0}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Equipment requiring maintenance
            </div>
            <Progress 
              value={stats?.maintenanceDue ? 
                Math.min((stats.maintenanceDue / 10) * 100, 100) : 0
              } 
              className="mt-2" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Predictive Maintenance Alerts */}
      {predictiveMaintenance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Predictive Maintenance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {predictiveMaintenance.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <div className="font-medium">{item.equipmentName}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.equipmentCode} • {item.maintenanceType}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {item.confidence}% confidence
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Due: {item.predictedDate}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Schedule
                    </Button>
                  </div>
                </div>
              ))}
              {predictiveMaintenance.length > 5 && (
                <div className="text-center pt-2">
                  <Button variant="ghost" size="sm">
                    View all {predictiveMaintenance.length} alerts
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Equipment Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Equipment Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats && Object.entries({
                'Active': stats.activeEquipment,
                'Under Maintenance': stats.underMaintenance,
                'Maintenance Due': stats.maintenanceDue,
                'Total Equipment': stats.totalEquipment
              }).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status.toLowerCase().replace(' ', '_'))}
                    <span className="text-sm font-medium">{status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(count / stats.totalEquipment) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button className="h-20 flex flex-col gap-2" variant="outline">
                <Wrench className="h-5 w-5" />
                <span className="text-sm">Schedule Maintenance</span>
              </Button>
              <Button className="h-20 flex flex-col gap-2" variant="outline">
                <Truck className="h-5 w-5" />
                <span className="text-sm">Create Rental</span>
              </Button>
              <Button className="h-20 flex flex-col gap-2" variant="outline">
                <Users className="h-5 w-5" />
                <span className="text-sm">Assign Technician</span>
              </Button>
              <Button className="h-20 flex flex-col gap-2" variant="outline">
                <Activity className="h-5 w-5" />
                <span className="text-sm">View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Maintenance completed</div>
                <div className="text-xs text-muted-foreground">
                  Excavator PC200 - Preventive maintenance completed by John Smith
                </div>
              </div>
              <div className="text-xs text-muted-foreground">2 hours ago</div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Rental started</div>
                <div className="text-xs text-muted-foreground">
                  Bulldozer D6 rented to Highlands Construction for 7 days
                </div>
              </div>
              <div className="text-xs text-muted-foreground">4 hours ago</div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Maintenance scheduled</div>
                <div className="text-xs text-muted-foreground">
                  Crane 50T scheduled for preventive maintenance on March 15
                </div>
              </div>
              <div className="text-xs text-muted-foreground">6 hours ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
