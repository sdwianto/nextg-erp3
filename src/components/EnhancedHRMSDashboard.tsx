'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  Clock, 
  Calendar,
  Shield,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  BarChart3,
  Activity,
  Phone,
  Mail,
  UserPlus
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  status: 'active' | 'inactive' | 'on_leave';
  shift: 'day' | 'night' | 'rotating';
  location: string;
  phone: string;
  email: string;
  hireDate: string;
  certifications: Certification[];
  safetyTraining: SafetyTraining[];
  performance: PerformanceMetrics;
}

interface Certification {
  id: string;
  name: string;
  type: 'equipment' | 'safety' | 'professional';
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'expiring_soon';
  equipment?: string;
}

interface SafetyTraining {
  id: string;
  name: string;
  type: 'mandatory' | 'refresher' | 'specialized';
  completedDate: string;
  nextDueDate: string;
  status: 'completed' | 'overdue' | 'upcoming';
  score?: number;
}

interface PerformanceMetrics {
  attendance: number;
  safetyIncidents: number;
  productivity: number;
  trainingCompletion: number;
  overallRating: number;
}

interface ShiftSchedule {
  id: string;
  shiftType: 'day' | 'night' | 'rotating';
  startTime: string;
  endTime: string;
  employeeCount: number;
  department: string;
  location: string;
}

const EnhancedHRMSDashboard: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedShift, setSelectedShift] = useState('all');
  const employees: Employee[] = [
    {
      id: '1',
      name: 'John Smith',
      position: 'Excavator Operator',
      department: 'Operations',
      status: 'active',
      shift: 'day',
      location: 'Mine Site A',
      phone: '+675 7123 4567',
      email: 'john.smith@camine.com',
      hireDate: '2022-03-15',
      certifications: [
        {
          id: '1',
          name: 'Heavy Equipment Operator',
          type: 'equipment',
          issueDate: '2022-04-01',
          expiryDate: '2025-04-01',
          status: 'valid',
          equipment: 'Excavator PC200'
        },
        {
          id: '2',
          name: 'Safety First Aid',
          type: 'safety',
          issueDate: '2023-01-15',
          expiryDate: '2024-01-15',
          status: 'expired'
        }
      ],
      safetyTraining: [
        {
          id: '1',
          name: 'Mine Safety Awareness',
          type: 'mandatory',
          completedDate: '2023-12-01',
          nextDueDate: '2024-12-01',
          status: 'completed',
          score: 95
        },
        {
          id: '2',
          name: 'Emergency Response',
          type: 'refresher',
          completedDate: '2023-06-15',
          nextDueDate: '2024-06-15',
          status: 'completed',
          score: 88
        }
      ],
      performance: {
        attendance: 98,
        safetyIncidents: 0,
        productivity: 92,
        trainingCompletion: 100,
        overallRating: 95
      }
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      position: 'Safety Officer',
      department: 'Safety',
      status: 'active',
      shift: 'day',
      location: 'Mine Site A',
      phone: '+675 7123 4568',
      email: 'sarah.johnson@camine.com',
      hireDate: '2021-08-20',
      certifications: [
        {
          id: '3',
          name: 'Safety Management',
          type: 'professional',
          issueDate: '2021-09-01',
          expiryDate: '2026-09-01',
          status: 'valid'
        }
      ],
      safetyTraining: [
        {
          id: '3',
          name: 'Advanced Safety Management',
          type: 'specialized',
          completedDate: '2023-11-15',
          nextDueDate: '2024-11-15',
          status: 'completed',
          score: 98
        }
      ],
      performance: {
        attendance: 100,
        safetyIncidents: 0,
        productivity: 95,
        trainingCompletion: 100,
        overallRating: 98
      }
    },
    {
      id: '3',
      name: 'Mike Wilson',
      position: 'Maintenance Technician',
      department: 'Maintenance',
      status: 'active',
      shift: 'night',
      location: 'Mine Site B',
      phone: '+675 7123 4569',
      email: 'mike.wilson@camine.com',
      hireDate: '2023-01-10',
      certifications: [
        {
          id: '4',
          name: 'Equipment Maintenance',
          type: 'equipment',
          issueDate: '2023-02-01',
          expiryDate: '2026-02-01',
          status: 'valid',
          equipment: 'Heavy Equipment'
        }
      ],
      safetyTraining: [
        {
          id: '4',
          name: 'Mine Safety Awareness',
          type: 'mandatory',
          completedDate: '2023-01-20',
          nextDueDate: '2024-01-20',
          status: 'completed',
          score: 92
        },
        {
          id: '5',
          name: 'Hazardous Materials',
          type: 'refresher',
          completedDate: '2023-07-10',
          nextDueDate: '2024-07-10',
          status: 'upcoming'
        }
      ],
      performance: {
        attendance: 96,
        safetyIncidents: 1,
        productivity: 88,
        trainingCompletion: 85,
        overallRating: 87
      }
    }
  ];

  const shiftSchedules: ShiftSchedule[] = [
    {
      id: '1',
      shiftType: 'day',
      startTime: '06:00',
      endTime: '18:00',
      employeeCount: 45,
      department: 'Operations',
      location: 'Mine Site A'
    },
    {
      id: '2',
      shiftType: 'night',
      startTime: '18:00',
      endTime: '06:00',
      employeeCount: 38,
      department: 'Operations',
      location: 'Mine Site A'
    },
    {
      id: '3',
      shiftType: 'day',
      startTime: '07:00',
      endTime: '19:00',
      employeeCount: 22,
      department: 'Maintenance',
      location: 'Mine Site B'
    }
  ];

  const hrMetrics = [
    {
      label: 'Total Employees',
      value: '156',
      change: 8.5,
      trend: 'up' as const,
      icon: <Users className="h-4 w-4 text-blue-600" />
    },
    {
      label: 'Active Certifications',
      value: '89%',
      change: 2.1,
      trend: 'up' as const,
      icon: <Award className="h-4 w-4 text-green-600" />
    },
    {
      label: 'Safety Training',
      value: '94%',
      change: -1.2,
      trend: 'down' as const,
      icon: <Shield className="h-4 w-4 text-orange-600" />
    },
    {
      label: 'Shift Coverage',
      value: '98%',
      change: 0.5,
      trend: 'up' as const,
      icon: <Clock className="h-4 w-4 text-purple-600" />
    }
  ];

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4" />;
      case 'down': return <TrendingDown className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'on_leave':
        return <Badge className="bg-yellow-100 text-yellow-800">On Leave</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCertificationStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-green-100 text-green-800">Valid</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      case 'expiring_soon':
        return <Badge className="bg-yellow-100 text-yellow-800">Expiring Soon</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTrainingStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const departmentMatch = selectedDepartment === 'all' || employee.department === selectedDepartment;
    const shiftMatch = selectedShift === 'all' || employee.shift === selectedShift;
    return departmentMatch && shiftMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enhanced HRMS Dashboard</h1>
          <p className="text-gray-600">Mining-specific HR management with safety & certification tracking</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            All Systems Operational
          </Badge>
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {hrMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.label}
              </CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className={`flex items-center text-sm ${getTrendColor(metric.trend)}`}>
                {getTrendIcon(metric.trend)}
                <span className="ml-1">
                  {metric.change > 0 ? '+' : ''}{metric.change}% from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="safety">Safety Training</TabsTrigger>
          <TabsTrigger value="shifts">Shift Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Workforce Health Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Workforce Health Score
                </CardTitle>
                <CardDescription>Overall workforce performance indicator</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">92/100</div>
                  <Progress value={92} className="mb-4" />
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-green-600">Excellent</div>
                      <div className="text-gray-500">Safety Record</div>
                    </div>
                    <div>
                      <div className="font-semibold text-blue-600">Good</div>
                      <div className="text-gray-500">Certifications</div>
                    </div>
                    <div>
                      <div className="font-semibold text-orange-600">Fair</div>
                      <div className="text-gray-500">Training</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent HR Activities
                </CardTitle>
                <CardDescription>Latest workforce activities and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: 'Certification', action: 'Renewed', employee: 'John Smith', time: '2 hours ago' },
                    { type: 'Safety Training', action: 'Completed', employee: 'Sarah Johnson', time: '4 hours ago' },
                    { type: 'Shift Change', action: 'Scheduled', employee: 'Mike Wilson', time: '6 hours ago' },
                    { type: 'Performance Review', action: 'Completed', employee: 'Lisa Brown', time: '8 hours ago' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <div>
                          <div className="font-medium">{activity.type}: {activity.action}</div>
                          <div className="text-sm text-gray-500">{activity.employee} • {activity.time}</div>
                        </div>
                      </div>
                      <Badge variant="outline">HR</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Employees Tab */}
        <TabsContent value="employees" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Employee Management
              </CardTitle>
              <CardDescription>Comprehensive employee information and performance tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Department</label>
                    <select 
                      className="w-full mt-1 p-2 border rounded-md"
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                      <option value="all">All Departments</option>
                      <option value="Operations">Operations</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Safety">Safety</option>
                      <option value="Administration">Administration</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium">Shift</label>
                    <select 
                      className="w-full mt-1 p-2 border rounded-md"
                      value={selectedShift}
                      onChange={(e) => setSelectedShift(e.target.value)}
                    >
                      <option value="all">All Shifts</option>
                      <option value="day">Day Shift</option>
                      <option value="night">Night Shift</option>
                      <option value="rotating">Rotating</option>
                    </select>
                  </div>
                </div>

                {/* Employee List */}
                <div className="space-y-4">
                  {filteredEmployees.map((employee) => (
                    <div key={employee.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-lg">{employee.name}</div>
                            <div className="text-sm text-gray-600">{employee.position} • {employee.department}</div>
                            <div className="text-sm text-gray-500">{employee.location}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(employee.status)}
                          <Badge variant="outline" className="capitalize">{employee.shift} Shift</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <div className="text-lg font-bold text-blue-600">{employee.performance.attendance}%</div>
                          <div className="text-sm text-gray-600">Attendance</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <div className="text-lg font-bold text-green-600">{employee.performance.safetyIncidents}</div>
                          <div className="text-sm text-gray-600">Safety Incidents</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <div className="text-lg font-bold text-purple-600">{employee.performance.productivity}%</div>
                          <div className="text-sm text-gray-600">Productivity</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <div className="text-lg font-bold text-orange-600">{employee.performance.overallRating}%</div>
                          <div className="text-sm text-gray-600">Overall Rating</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {employee.phone}
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {employee.email}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Hired: {new Date(employee.hireDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Equipment & Safety Certifications
              </CardTitle>
              <CardDescription>Track employee certifications and equipment qualifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="border rounded-lg p-4">
                    <div className="font-semibold mb-3">{employee.name} - {employee.position}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {employee.certifications.map((cert) => (
                        <div key={cert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">{cert.name}</div>
                            <div className="text-sm text-gray-600">
                              {cert.type === 'equipment' && cert.equipment ? `Equipment: ${cert.equipment}` : cert.type}
                            </div>
                            <div className="text-sm text-gray-500">
                              Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                            </div>
                          </div>
                          {getCertificationStatusBadge(cert.status)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Safety Training Tab */}
        <TabsContent value="safety" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Safety Training & Compliance
              </CardTitle>
              <CardDescription>Monitor safety training completion and compliance status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="border rounded-lg p-4">
                    <div className="font-semibold mb-3">{employee.name} - {employee.position}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {employee.safetyTraining.map((training) => (
                        <div key={training.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">{training.name}</div>
                            <div className="text-sm text-gray-600 capitalize">{training.type} Training</div>
                            <div className="text-sm text-gray-500">
                              Next Due: {new Date(training.nextDueDate).toLocaleDateString()}
                            </div>
                            {training.score && (
                              <div className="text-sm text-gray-500">Score: {training.score}%</div>
                            )}
                          </div>
                          {getTrainingStatusBadge(training.status)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shift Management Tab */}
        <TabsContent value="shifts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                24/7 Shift Management
              </CardTitle>
              <CardDescription>Manage round-the-clock mining operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shiftSchedules.map((shift) => (
                  <div key={shift.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          shift.shiftType === 'day' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <div>
                          <div className="font-semibold capitalize">{shift.shiftType} Shift</div>
                          <div className="text-sm text-gray-600">{shift.department} • {shift.location}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{shift.employeeCount} Employees</div>
                        <div className="text-sm text-gray-600">
                          {shift.startTime} - {shift.endTime}
                        </div>
                      </div>
                    </div>
                    <Progress value={(shift.employeeCount / 50) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Workforce Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Workforce Analytics
                </CardTitle>
                <CardDescription>Employee performance and retention metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">156</div>
                    <div className="text-sm text-gray-600">Total Employees</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-lg font-bold text-green-600">94%</div>
                      <div className="text-sm text-gray-600">Retention Rate</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-lg font-bold text-blue-600">87%</div>
                      <div className="text-sm text-gray-600">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Safety Metrics
                </CardTitle>
                <CardDescription>Safety performance and incident tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">365</div>
                    <div className="text-sm text-gray-600">Days Without Major Incident</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-lg font-bold text-green-600">98%</div>
                      <div className="text-sm text-gray-600">Safety Compliance</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded">
                      <div className="text-lg font-bold text-orange-600">3</div>
                      <div className="text-sm text-gray-600">Minor Incidents</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedHRMSDashboard;
