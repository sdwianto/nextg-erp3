'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Shield, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Calendar,
  MapPin,
  RefreshCw,
  Plus,
  Eye,
  Settings,
  Award,
  BookOpen,
  Heart,
  Zap,
  Truck,
  HardHat,
  Activity,
  Target
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  shift: string;
  status: 'active' | 'on_leave' | 'training' | 'suspended';
  safetyScore: number;
  certifications: string[];
  lastMedicalCheck: string;
  nextMedicalCheck: string;
  location: string;
  fatigueLevel: 'low' | 'medium' | 'high';
}

interface SafetyTraining {
  id: string;
  name: string;
  type: 'mandatory' | 'refresher' | 'specialized';
  duration: number;
  completionRate: number;
  dueDate: string;
  status: 'completed' | 'in_progress' | 'overdue' | 'not_started';
  employees: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface EquipmentCertification {
  id: string;
  equipment: string;
  employee: string;
  certificationType: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'expiring_soon';
  renewalRequired: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface ShiftSchedule {
  id: string;
  shift: string;
  startTime: string;
  endTime: string;
  employees: number;
  maxCapacity: number;
  currentLocation: string;
  fatigueLevel: 'low' | 'medium' | 'high';
  safetyIncidents: number;
  status: 'active' | 'completed' | 'upcoming';
}

interface ComplianceAlert {
  id: string;
  type: 'safety' | 'certification' | 'medical' | 'training';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  affectedEmployees: number;
  dueDate: string;
  status: 'active' | 'acknowledged' | 'resolved';
  actionRequired: string;
}

interface PerformanceMetric {
  id: string;
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

export default function EnhancedHRMSDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [safetyTrainings, setSafetyTrainings] = useState<SafetyTraining[]>([]);
  const [equipmentCertifications, setEquipmentCertifications] = useState<EquipmentCertification[]>([]);
  const [shiftSchedules, setShiftSchedules] = useState<ShiftSchedule[]>([]);
  const [complianceAlerts, setComplianceAlerts] = useState<ComplianceAlert[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Mock data for demonstration
  useEffect(() => {
    const mockEmployees: Employee[] = [
      {
        id: '1',
        name: 'John Smith',
        position: 'Excavator Operator',
        department: 'Mining Operations',
        shift: 'Day Shift (6AM-6PM)',
        status: 'active',
        safetyScore: 95,
        certifications: ['Excavator License', 'Safety Training', 'First Aid'],
        lastMedicalCheck: '2024-01-15',
        nextMedicalCheck: '2024-07-15',
        location: 'Mine Site A',
        fatigueLevel: 'low'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        position: 'Safety Officer',
        department: 'Safety & Compliance',
        shift: 'Night Shift (6PM-6AM)',
        status: 'active',
        safetyScore: 98,
        certifications: ['Safety Officer', 'Incident Investigation', 'Emergency Response'],
        lastMedicalCheck: '2024-02-01',
        nextMedicalCheck: '2024-08-01',
        location: 'Mine Site B',
        fatigueLevel: 'medium'
      },
      {
        id: '3',
        name: 'Mike Chen',
        position: 'Bulldozer Operator',
        department: 'Mining Operations',
        shift: 'Day Shift (6AM-6PM)',
        status: 'training',
        safetyScore: 87,
        certifications: ['Bulldozer License'],
        lastMedicalCheck: '2024-01-20',
        nextMedicalCheck: '2024-07-20',
        location: 'Mine Site A',
        fatigueLevel: 'low'
      },
      {
        id: '4',
        name: 'Lisa Wang',
        position: 'Crane Operator',
        department: 'Mining Operations',
        shift: 'Night Shift (6PM-6AM)',
        status: 'active',
        safetyScore: 92,
        certifications: ['Crane License', 'Safety Training'],
        lastMedicalCheck: '2023-12-10',
        nextMedicalCheck: '2024-06-10',
        location: 'Mine Site C',
        fatigueLevel: 'high'
      }
    ];

    const mockSafetyTrainings: SafetyTraining[] = [
      {
        id: '1',
        name: 'Mining Safety Fundamentals',
        type: 'mandatory',
        duration: 8,
        completionRate: 95,
        dueDate: '2024-04-30',
        status: 'in_progress',
        employees: 45,
        priority: 'high'
      },
      {
        id: '2',
        name: 'Heavy Equipment Operation Safety',
        type: 'refresher',
        duration: 4,
        completionRate: 78,
        dueDate: '2024-03-15',
        status: 'overdue',
        employees: 32,
        priority: 'critical'
      },
      {
        id: '3',
        name: 'Emergency Response Procedures',
        type: 'specialized',
        duration: 6,
        completionRate: 100,
        dueDate: '2024-05-15',
        status: 'completed',
        employees: 28,
        priority: 'medium'
      }
    ];

    const mockEquipmentCertifications: EquipmentCertification[] = [
      {
        id: '1',
        equipment: 'Excavator PC200',
        employee: 'John Smith',
        certificationType: 'Heavy Equipment License',
        issueDate: '2023-01-15',
        expiryDate: '2025-01-15',
        status: 'valid',
        renewalRequired: false,
        priority: 'low'
      },
      {
        id: '2',
        equipment: 'Bulldozer D6T',
        employee: 'Mike Chen',
        certificationType: 'Heavy Equipment License',
        issueDate: '2023-06-20',
        expiryDate: '2024-06-20',
        status: 'expiring_soon',
        renewalRequired: true,
        priority: 'high'
      },
      {
        id: '3',
        equipment: 'Crane 50T',
        employee: 'Lisa Wang',
        certificationType: 'Crane Operator License',
        issueDate: '2022-12-01',
        expiryDate: '2024-12-01',
        status: 'valid',
        renewalRequired: false,
        priority: 'low'
      }
    ];

    const mockShiftSchedules: ShiftSchedule[] = [
      {
        id: '1',
        shift: 'Day Shift',
        startTime: '06:00',
        endTime: '18:00',
        employees: 25,
        maxCapacity: 30,
        currentLocation: 'Mine Site A',
        fatigueLevel: 'low',
        safetyIncidents: 0,
        status: 'active'
      },
      {
        id: '2',
        shift: 'Night Shift',
        startTime: '18:00',
        endTime: '06:00',
        employees: 22,
        maxCapacity: 30,
        currentLocation: 'Mine Site B',
        fatigueLevel: 'medium',
        safetyIncidents: 1,
        status: 'active'
      },
      {
        id: '3',
        shift: 'Swing Shift',
        startTime: '14:00',
        endTime: '02:00',
        employees: 18,
        maxCapacity: 25,
        currentLocation: 'Mine Site C',
        fatigueLevel: 'high',
        safetyIncidents: 2,
        status: 'active'
      }
    ];

    const mockComplianceAlerts: ComplianceAlert[] = [
      {
        id: '1',
        type: 'certification',
        severity: 'high',
        message: 'Bulldozer certification expiring in 30 days',
        affectedEmployees: 1,
        dueDate: '2024-06-20',
        status: 'active',
        actionRequired: 'Schedule renewal training'
      },
      {
        id: '2',
        type: 'medical',
        severity: 'medium',
        message: 'Medical checkup overdue for 5 employees',
        affectedEmployees: 5,
        dueDate: '2024-03-01',
        status: 'active',
        actionRequired: 'Schedule medical appointments'
      },
      {
        id: '3',
        type: 'training',
        severity: 'critical',
        message: 'Safety training overdue for 12 employees',
        affectedEmployees: 12,
        dueDate: '2024-03-15',
        status: 'active',
        actionRequired: 'Immediate training session required'
      }
    ];

    const mockPerformanceMetrics: PerformanceMetric[] = [
      {
        id: '1',
        name: 'Safety Score',
        currentValue: 94,
        targetValue: 95,
        unit: '%',
        trend: 'up',
        status: 'good'
      },
      {
        id: '2',
        name: 'Training Completion',
        currentValue: 87,
        targetValue: 90,
        unit: '%',
        trend: 'up',
        status: 'warning'
      },
      {
        id: '3',
        name: 'Certification Compliance',
        currentValue: 96,
        targetValue: 100,
        unit: '%',
        trend: 'stable',
        status: 'good'
      },
      {
        id: '4',
        name: 'Fatigue Management',
        currentValue: 78,
        targetValue: 85,
        unit: '%',
        trend: 'down',
        status: 'warning'
      }
    ];

    setEmployees(mockEmployees);
    setSafetyTrainings(mockSafetyTrainings);
    setEquipmentCertifications(mockEquipmentCertifications);
    setShiftSchedules(mockShiftSchedules);
    setComplianceAlerts(mockComplianceAlerts);
    setPerformanceMetrics(mockPerformanceMetrics);
    setIsLoading(false);
  }, []);

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'on_leave': return 'bg-yellow-500';
      case 'training': return 'bg-blue-500';
      case 'suspended': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'low': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getFatigueColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 transform rotate-180" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">👥 Enhanced HRMS Management</h1>
          <p className="text-muted-foreground">Mining-specific safety & 24/7 shift management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {performanceMetrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.currentValue}{metric.unit}</div>
              <div className="flex items-center space-x-2 text-xs">
                {getTrendIcon(metric.trend)}
                <span className="text-muted-foreground">
                  Target: {metric.targetValue}{metric.unit}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">HR Overview</TabsTrigger>
          <TabsTrigger value="safety">Safety Management</TabsTrigger>
          <TabsTrigger value="shifts">24/7 Shift Management</TabsTrigger>
          <TabsTrigger value="certifications">Equipment Certifications</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Alerts</TabsTrigger>
        </TabsList>

        {/* HR Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Employee Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  👥 Employee Status Overview
                  <Badge variant="secondary" className="ml-2">{employees.length} Total</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employees.map((employee) => (
                    <div key={employee.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {employee.position} • {employee.department}
                          </div>
                        </div>
                        <Badge className={getStatusColor(employee.status)}>
                          {employee.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Shift:</span>
                          <div className="font-medium">{employee.shift}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Location:</span>
                          <div className="font-medium">{employee.location}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Safety Score:</span>
                          <div className="font-medium">{employee.safetyScore}/100</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Fatigue Level:</span>
                          <div className={`font-medium ${getFatigueColor(employee.fatigueLevel)}`}>
                            {employee.fatigueLevel.toUpperCase()}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Settings className="h-3 w-3 mr-1" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Safety Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  🛡️ Safety Performance Dashboard
                  <Shield className="h-4 w-4 ml-2" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600">94/100</div>
                    <div className="text-sm text-muted-foreground">Overall Safety Score</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Training Compliance</span>
                        <span>87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Certification Status</span>
                        <span>96%</span>
                      </div>
                      <Progress value={96} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Fatigue Management</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="font-bold text-green-600">0</div>
                      <div className="text-muted-foreground">Safety Incidents</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="font-bold text-blue-600">45</div>
                      <div className="text-muted-foreground">Active Certifications</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Safety Management Tab */}
        <TabsContent value="safety" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                🛡️ Safety Training Management
                <BookOpen className="h-4 w-4 ml-2" />
                <Badge variant="secondary" className="ml-2">Active Programs</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {safetyTrainings.map((training) => (
                  <div key={training.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{training.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          {training.type.toUpperCase()} • {training.duration} hours
                        </div>
                      </div>
                      <Badge className={getSeverityColor(training.priority)}>
                        {training.priority.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completion Rate:</span>
                        <span className="font-medium">{training.completionRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Employees Enrolled:</span>
                        <span className="font-medium">{training.employees}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Due Date:</span>
                        <span className="font-medium">{training.dueDate}</span>
                      </div>
                    </div>
                    
                    <Progress 
                      value={training.completionRate} 
                      className="h-2"
                    />
                    
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Schedule Training
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 24/7 Shift Management Tab */}
        <TabsContent value="shifts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                ⏰ 24/7 Shift Management
                <Clock className="h-4 w-4 ml-2" />
                <Badge variant="secondary" className="ml-2">Real-time Monitoring</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shiftSchedules.map((shift) => (
                  <div key={shift.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{shift.shift}</h3>
                        <div className="text-sm text-muted-foreground">
                          {shift.startTime} - {shift.endTime}
                        </div>
                      </div>
                      <Badge className={shift.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}>
                        {shift.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Employees:</span>
                        <span className="font-medium">{shift.employees}/{shift.maxCapacity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span className="font-medium">{shift.currentLocation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fatigue Level:</span>
                        <span className={`font-medium ${getFatigueColor(shift.fatigueLevel)}`}>
                          {shift.fatigueLevel.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Safety Incidents:</span>
                        <span className="font-medium">{shift.safetyIncidents}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="h-3 w-3 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Equipment Certifications Tab */}
        <TabsContent value="certifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                🚛 Equipment Certification Management
                <Truck className="h-4 w-4 ml-2" />
                <Badge variant="secondary" className="ml-2">Heavy Equipment</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equipmentCertifications.map((cert) => (
                  <div key={cert.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{cert.equipment}</h3>
                        <div className="text-sm text-muted-foreground">
                          {cert.employee} • {cert.certificationType}
                        </div>
                      </div>
                      <Badge className={cert.status === 'valid' ? 'bg-green-600' : cert.status === 'expired' ? 'bg-red-600' : 'bg-yellow-600'}>
                        {cert.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Issue Date:</span>
                        <span className="font-medium">{cert.issueDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expiry Date:</span>
                        <span className="font-medium">{cert.expiryDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Renewal Required:</span>
                        <span className="font-medium">{cert.renewalRequired ? 'Yes' : 'No'}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Award className="h-3 w-3 mr-1" />
                        Renew Certification
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Alerts Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                ⚠️ Compliance Alerts & Notifications
                <AlertTriangle className="h-4 w-4 ml-2" />
                <Badge variant="destructive" className="ml-2">
                  {complianceAlerts.filter(a => a.status === 'active').length} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceAlerts.map((alert) => (
                  <div key={alert.id} className={`border rounded-lg p-4 space-y-3 ${
                    alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
                    alert.severity === 'high' ? 'border-orange-500 bg-orange-50' :
                    alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4" />
                        <div>
                          <div className="font-semibold">{alert.message}</div>
                          <div className="text-sm text-muted-foreground">
                            {alert.type.toUpperCase()} • {alert.affectedEmployees} employees affected
                          </div>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Due Date:</span> {alert.dueDate}
                      </div>
                      <div>
                        <span className="font-medium">Action Required:</span> {alert.actionRequired}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Zap className="h-3 w-3 mr-1" />
                        Take Action
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3 mr-1" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        Last updated: {lastUpdated.toLocaleString()} | Real-time HR monitoring active
      </div>
    </div>
  );
}
