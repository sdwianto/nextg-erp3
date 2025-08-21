'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown,
  Users,
  UserPlus,
  Calendar,
  Eye,
  Download,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  FileText,
  Building,
  BarChart3,
  GraduationCap,
  Heart,
  Activity
} from 'lucide-react';

const EnhancedHRMSDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for JDE HRMS Dashboard
  const mockHRMSData = {
    overview: {
      totalEmployees: 245,
      activeEmployees: 238,
      newHires: 12,
      terminations: 3,
      onLeave: 8,
      remoteWorkers: 45,
      totalDepartments: 8,
      avgTenure: 3.2,
    },
    departments: [
      {
        id: 'dept-1',
        name: 'Operations',
        employees: 45,
        headcount: 45,
        budget: 2800000,
        avgSalary: 62000,
        turnover: 8.5,
        satisfaction: 4.2,
        productivity: 87.3,
      },
      {
        id: 'dept-2',
        name: 'Sales',
        employees: 38,
        headcount: 38,
        budget: 2200000,
        avgSalary: 58000,
        turnover: 12.1,
        satisfaction: 3.8,
        productivity: 92.1,
      },
      {
        id: 'dept-3',
        name: 'IT',
        employees: 32,
        headcount: 32,
        budget: 1800000,
        avgSalary: 75000,
        turnover: 6.2,
        satisfaction: 4.5,
        productivity: 89.7,
      },
      {
        id: 'dept-4',
        name: 'Marketing',
        employees: 25,
        headcount: 25,
        budget: 1200000,
        avgSalary: 55000,
        turnover: 15.2,
        satisfaction: 3.9,
        productivity: 85.4,
      },
    ],
    employees: [
      {
        id: 'emp-1',
        name: 'John Smith',
        department: 'Operations',
        position: 'Senior Manager',
        hireDate: '2021-03-15',
        salary: 75000,
        performance: 4.2,
        status: 'active',
        lastReview: '2024-01-10',
        nextReview: '2024-04-10',
      },
      {
        id: 'emp-2',
        name: 'Sarah Johnson',
        department: 'Sales',
        position: 'Account Executive',
        hireDate: '2022-08-22',
        salary: 65000,
        performance: 4.5,
        status: 'active',
        lastReview: '2024-01-15',
        nextReview: '2024-04-15',
      },
      {
        id: 'emp-3',
        name: 'Michael Chen',
        department: 'IT',
        position: 'Software Engineer',
        hireDate: '2023-01-10',
        salary: 85000,
        performance: 4.1,
        status: 'active',
        lastReview: '2024-01-20',
        nextReview: '2024-04-20',
      },
    ],
    trends: {
      headcount: [220, 225, 235, 245],
      turnover: [12.5, 11.8, 10.2, 8.5],
      satisfaction: [3.8, 3.9, 4.1, 4.2],
      productivity: [82.5, 84.1, 86.3, 87.3],
      months: ['Oct', 'Nov', 'Dec', 'Jan'],
    },
    kpis: {
      employeeSatisfaction: 4.2,
      turnoverRate: 8.5,
      productivity: 87.3,
      trainingCompletion: 94.1,
      absenteeism: 3.2,
      timeToHire: 18.5,
      costPerHire: 8500,
      retentionRate: 91.5,
    },
    alerts: [
      { type: 'warning', message: '5 employees due for performance review', value: 5 },
      { type: 'success', message: 'Employee satisfaction above target', value: 4.2 },
      { type: 'info', message: '12 new hires this month', value: 12 },
    ],
    workflows: [
      {
        id: 'workflow-1',
        name: 'Automated Onboarding',
        status: 'active',
        efficiency: 95.2,
        avgTime: '3.2 days',
        description: 'Streamlined employee onboarding process',
        icon: <UserPlus className="h-4 w-4" />,
      },
      {
        id: 'workflow-2',
        name: 'Performance Management',
        status: 'active',
        efficiency: 88.7,
        avgTime: 'Real-time',
        description: 'Continuous performance tracking and feedback',
        icon: <Target className="h-4 w-4" />,
      },
      {
        id: 'workflow-3',
        name: 'Leave Management',
        status: 'active',
        efficiency: 92.1,
        avgTime: '1.5 days',
        description: 'Automated leave request and approval system',
        icon: <Calendar className="h-4 w-4" />,
      },
      {
        id: 'workflow-4',
        name: 'Training & Development',
        status: 'pending',
        efficiency: 0,
        avgTime: 'Pending',
        description: 'Learning management system integration',
        icon: <GraduationCap className="h-4 w-4" />,
      },
    ],
  };

  const data = mockHRMSData;

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  const getTrendIcon = (value: number) => {
    return value >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'info': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 4.0) return 'text-green-600';
    if (score >= 3.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (score: number) => {
    if (score >= 4.0) return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Excellent</Badge>;
    if (score >= 3.0) return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Needs Improvement</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">JDE HRMS Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive human resource management with Oracle JD Edwards standards
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Employee
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalEmployees}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getTrendIcon(12)}
              <span>+12 this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employee Satisfaction</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpis.employeeSatisfaction}/5</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Above target (4.0)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpis.turnoverRate}%</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Below industry avg (12%)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.kpis.productivity}%</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span>+2.1% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* HR Summary */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  HR Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Employee Status</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Active Employees</span>
                          <span className="font-medium text-green-600">{data.overview.activeEmployees}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>On Leave</span>
                          <span className="font-medium text-yellow-600">{data.overview.onLeave}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Remote Workers</span>
                          <span className="font-medium text-blue-600">{data.overview.remoteWorkers}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>New Hires</span>
                          <span className="font-medium text-purple-600">{data.overview.newHires}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Key Metrics</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Average Tenure</span>
                          <span className="font-medium">{data.overview.avgTenure} years</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Training Completion</span>
                          <span className="font-medium">{data.kpis.trainingCompletion}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Absenteeism Rate</span>
                          <span className="font-medium">{data.kpis.absenteeism}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Retention Rate</span>
                          <span className="font-medium">{data.kpis.retentionRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  HR Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.alerts.map((alert, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="text-sm font-medium">{alert.message}</div>
                        <div className="text-xs text-muted-foreground">
                          Value: {alert.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Department Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.departments.map((dept) => (
                  <div key={dept.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{dept.name}</h4>
                        <Badge variant="outline" className="text-xs">{dept.employees} employees</Badge>
                        {getPerformanceBadge(dept.satisfaction)}
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Budget:</span>
                          <span className="ml-2 font-medium">{formatCurrency(dept.budget)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Avg Salary:</span>
                          <span className="ml-2 font-medium">{formatCurrency(dept.avgSalary)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Turnover:</span>
                          <span className={`ml-2 font-medium ${dept.turnover > 10 ? 'text-red-600' : 'text-green-600'}`}>
                            {dept.turnover}%
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Productivity:</span>
                          <span className="ml-2 font-medium">{dept.productivity}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employees Tab */}
        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Employee Directory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.employees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{employee.name}</h4>
                        <Badge variant="outline" className="text-xs">{employee.department}</Badge>
                        <Badge variant="outline" className="text-xs">{employee.position}</Badge>
                        {getPerformanceBadge(employee.performance)}
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Hire Date:</span>
                          <span className="ml-2 font-medium">{employee.hireDate}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Salary:</span>
                          <span className="ml-2 font-medium">{formatCurrency(employee.salary)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Performance:</span>
                          <span className={`ml-2 font-medium ${getPerformanceColor(employee.performance)}`}>
                            {employee.performance}/5
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Next Review:</span>
                          <span className="ml-2 font-medium">{employee.nextReview}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflows Tab */}
        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                HR Workflows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.workflows.map((workflow) => (
                  <div key={workflow.id} className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded">
                        {workflow.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{workflow.name}</h4>
                          <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {workflow.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{workflow.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Efficiency</span>
                            <span className="font-medium">{workflow.efficiency}%</span>
                          </div>
                          <Progress value={workflow.efficiency} className="h-2" />
                          
                          <div className="flex justify-between text-sm">
                            <span>Average Time</span>
                            <span className="font-medium">{workflow.avgTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Employee Satisfaction */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Employee Satisfaction</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.kpis.employeeSatisfaction}/5</div>
                <p className="text-xs text-muted-foreground">
                  vs target (4.0)
                </p>
              </CardContent>
            </Card>

            {/* Turnover Rate */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.kpis.turnoverRate}%</div>
                <p className="text-xs text-muted-foreground">
                  vs industry avg (12%)
                </p>
              </CardContent>
            </Card>

            {/* Time to Hire */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time to Hire</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.kpis.timeToHire} days</div>
                <p className="text-xs text-muted-foreground">
                  Average hiring time
                </p>
              </CardContent>
            </Card>

            {/* Training Completion */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Training Completion</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.kpis.trainingCompletion}%</div>
                <p className="text-xs text-muted-foreground">
                  Required training completed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Detailed HR KPIs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Productivity Score</span>
                      <span className="font-medium">{data.kpis.productivity}%</span>
                    </div>
                    <Progress value={data.kpis.productivity} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Retention Rate</span>
                      <span className="font-medium">{data.kpis.retentionRate}%</span>
                    </div>
                    <Progress value={data.kpis.retentionRate} className="h-2" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Absenteeism Rate</span>
                      <span className="font-medium">{data.kpis.absenteeism}%</span>
                    </div>
                    <Progress value={data.kpis.absenteeism * 10} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cost per Hire</span>
                      <span className="font-medium">{formatCurrency(data.kpis.costPerHire)}</span>
                    </div>
                    <Progress value={data.kpis.costPerHire / 100} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedHRMSDashboard;
