// src/components/RentalMaintenanceDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { api } from '@/utils/api';
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

// API base URL - Using Next.js API routes to avoid CORS issues
const API_BASE_URL = '';

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

// All data now comes from API - no more mock data

export const RentalMaintenanceDashboard: React.FC = () => {
  const [predictiveMaintenance, setPredictiveMaintenance] = useState<PredictiveMaintenance[]>([]);
  
  // Use tRPC query
  const { data: dashboardData, isLoading: loading } = api.rentalMaintenance.getDashboardData.useQuery();
  
  // Transform tRPC data to match our interface
  const stats: DashboardStats | null = dashboardData?.summary ? {
    totalEquipment: dashboardData.summary.totalEquipment ?? 0,
    activeEquipment: dashboardData.summary.availableEquipment ?? 0,
    underMaintenance: dashboardData.summary.maintenanceEquipment ?? 0,
    totalRentals: dashboardData.summary.totalMaintenanceRecords ?? 0,
    activeRentals: dashboardData.summary.inUseEquipment ?? 0,
    pendingReturns: dashboardData.summary.pendingMaintenanceRecords ?? 0,
    maintenanceDue: dashboardData.summary.pendingMaintenanceRecords ?? 0,
    revenue: 0, // Not available in current API
    utilization: (dashboardData.summary.totalEquipment ?? 0) > 0 
      ? Math.round(((dashboardData.summary.inUseEquipment ?? 0) / (dashboardData.summary.totalEquipment ?? 1)) * 100) 
      : 0
  } : null;

  // Use tRPC query for predictive maintenance
  const { data: predictiveData } = api.rentalMaintenance.getPredictiveMaintenance.useQuery();
  
  // Set predictive maintenance data from API
  useEffect(() => {
    if (predictiveData && Array.isArray(predictiveData)) {
      const mappedData = predictiveData.map(item => ({
        id: item.id,
        equipmentName: item.equipmentName,
        equipmentCode: item.equipmentCode,
        maintenanceType: item.maintenanceType,
        predictedDate: item.predictedDate || new Date().toISOString().split('T')[0],
        confidence: item.confidence,
        priority: item.priority,
        estimatedCost: item.estimatedCost
      })) as PredictiveMaintenance[];
      setPredictiveMaintenance(mappedData);
    } else {
      // If predictiveData is not an array, set empty array
      setPredictiveMaintenance([]);
    }
  }, [predictiveData]);

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
              +0% from last month
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
            <div className="text-center text-muted-foreground py-8">
              No recent activity
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
