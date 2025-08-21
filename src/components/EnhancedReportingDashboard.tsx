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
  BarChart3,
  Activity,
  Eye,
  Download,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  DollarSign,
  Users,
  Target as TargetIcon,
  Brain,
  Lightbulb,
  FileText
} from 'lucide-react';

const EnhancedReportingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for JDE BI Dashboard
  const mockBIData = {
    overview: {
      totalRevenue: 12500000,
      totalExpenses: 8500000,
      netProfit: 4000000,
      profitMargin: 32.0,
      activeProjects: 45,
      customerSatisfaction: 4.6,
      marketShare: 18.5,
      employeeProductivity: 87.3,
    },
    modules: [
      {
        id: 'inventory',
        name: 'Inventory Management',
        status: 'excellent',
        score: 94.2,
        revenue: 3200000,
        efficiency: 96.8,
        trends: [92, 93, 94, 94.2],
        insights: [
          'Stock turnover improved by 15%',
          'Carrying costs reduced by 8%',
          'Fill rate maintained at 98%'
        ],
      },
      {
        id: 'procurement',
        name: 'Procurement',
        status: 'good',
        score: 88.7,
        revenue: 2800000,
        efficiency: 92.1,
        trends: [85, 86, 87, 88.7],
        insights: [
          'Supplier performance improved',
          'Cost savings target exceeded',
          'Contract compliance at 95%'
        ],
      },
      {
        id: 'finance',
        name: 'Financial Management',
        status: 'excellent',
        score: 96.5,
        revenue: 4500000,
        efficiency: 98.2,
        trends: [94, 95, 96, 96.5],
        insights: [
          'Cash flow positive for 6 months',
          'ROI improved by 12%',
          'Multi-currency operations stable'
        ],
      },
      {
        id: 'hrms',
        name: 'HR Management',
        status: 'good',
        score: 91.3,
        revenue: 2000000,
        efficiency: 89.7,
        trends: [88, 89, 90, 91.3],
        insights: [
          'Employee satisfaction increased',
          'Turnover rate below industry avg',
          'Training completion at 94%'
        ],
      },
    ],
    predictions: [
      {
        id: 'pred-1',
        category: 'Revenue',
        prediction: 'Revenue growth of 15% in Q2',
        confidence: 87,
        factors: ['Market expansion', 'New product launch', 'Improved efficiency'],
        impact: 'high',
        timeframe: 'Q2 2024',
      },
      {
        id: 'pred-2',
        category: 'Costs',
        prediction: 'Operational costs to decrease by 8%',
        confidence: 92,
        factors: ['Automation implementation', 'Process optimization', 'Supplier negotiations'],
        impact: 'medium',
        timeframe: 'Q2 2024',
      },
      {
        id: 'pred-3',
        category: 'Market',
        prediction: 'Market share to reach 20% by year-end',
        confidence: 78,
        factors: ['Competitive positioning', 'Customer retention', 'Product innovation'],
        impact: 'high',
        timeframe: 'Q4 2024',
      },
    ],
    trends: {
      revenue: [9800000, 10500000, 11800000, 12500000],
      expenses: [7200000, 7500000, 8000000, 8500000],
      profit: [2600000, 3000000, 3800000, 4000000],
      efficiency: [82.5, 84.1, 86.3, 87.3],
      months: ['Oct', 'Nov', 'Dec', 'Jan'],
    },
    kpis: {
      revenueGrowth: 15.2,
      profitGrowth: 25.8,
      costReduction: 8.5,
      efficiencyImprovement: 5.8,
      customerSatisfaction: 4.6,
      marketShare: 18.5,
      employeeProductivity: 87.3,
      systemUptime: 99.8,
    },
    alerts: [
      { type: 'success', message: 'All modules performing above targets', value: '100%' },
      { type: 'info', message: '3 predictive insights available', value: 3 },
      { type: 'warning', message: 'Market analysis due for update', value: '2 days' },
    ],
    reports: [
      {
        id: 'report-1',
        name: 'Executive Dashboard',
        type: 'comprehensive',
        frequency: 'daily',
        lastGenerated: '2024-01-20',
        nextGeneration: '2024-01-21',
        recipients: ['CEO', 'CFO', 'COO'],
        status: 'active',
      },
      {
        id: 'report-2',
        name: 'Financial Performance',
        type: 'financial',
        frequency: 'weekly',
        lastGenerated: '2024-01-15',
        nextGeneration: '2024-01-22',
        recipients: ['Finance Team'],
        status: 'active',
      },
      {
        id: 'report-3',
        name: 'Operational Metrics',
        type: 'operational',
        frequency: 'daily',
        lastGenerated: '2024-01-20',
        nextGeneration: '2024-01-21',
        recipients: ['Operations Team'],
        status: 'active',
      },
    ],
  };

  const data = mockBIData;

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent': return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Excellent</Badge>;
      case 'good': return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Good</Badge>;
      case 'fair': return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Fair</Badge>;
      case 'poor': return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Poor</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">JDE Business Intelligence</h1>
          <p className="text-muted-foreground">
            Advanced analytics and predictive insights with Oracle JD Edwards EnterpriseOne
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Analytics
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.overview.totalRevenue)}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getTrendIcon(data.kpis.revenueGrowth)}
              <span>{data.kpis.revenueGrowth}% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.overview.netProfit)}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getTrendIcon(data.kpis.profitGrowth)}
              <span>{data.kpis.profitGrowth}% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.profitMargin}%</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Above industry avg (25%)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Efficiency</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.employeeProductivity}%</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span>+{data.kpis.efficiencyImprovement}% improvement</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* System Performance */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  System Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Financial Performance</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Revenue</span>
                          <span className="font-medium">{formatCurrency(data.overview.totalRevenue)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Expenses</span>
                          <span className="font-medium">{formatCurrency(data.overview.totalExpenses)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                          <span>Net Profit</span>
                          <span className="text-green-600">{formatCurrency(data.overview.netProfit)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Operational Metrics</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Active Projects</span>
                          <span className="font-medium">{data.overview.activeProjects}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Customer Satisfaction</span>
                          <span className="font-medium">{data.overview.customerSatisfaction}/5</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Market Share</span>
                          <span className="font-medium">{data.overview.marketShare}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>System Uptime</span>
                          <span className="font-medium">{data.kpis.systemUptime}%</span>
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
                  BI Alerts
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

        {/* Modules Tab */}
        <TabsContent value="modules" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.modules.map((module) => (
              <Card key={module.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded">
                        <BarChart3 className="h-4 w-4" />
                      </div>
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                      {getStatusBadge(module.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Performance Score</span>
                        <div className={`text-xl font-bold ${getStatusColor(module.status)}`}>
                          {module.score}%
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Revenue</span>
                        <div className="text-xl font-bold">{formatCurrency(module.revenue)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Efficiency</span>
                        <div className="text-xl font-bold">{module.efficiency}%</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">Key Insights</div>
                      <div className="space-y-1">
                        {module.insights.map((insight, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span>{insight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Powered Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.predictions.map((prediction) => (
                  <div key={prediction.id} className="flex items-start gap-4 p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded">
                      <Lightbulb className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{prediction.category}</h4>
                        <Badge className={`text-xs ${getImpactColor(prediction.impact)}`}>
                          {prediction.impact} impact
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {prediction.confidence}% confidence
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{prediction.prediction}</p>
                      
                      <div className="space-y-2">
                        <div className="text-xs font-medium">Key Factors:</div>
                        <div className="flex flex-wrap gap-1">
                          {prediction.factors.map((factor, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Timeframe: {prediction.timeframe}
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

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Automated Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{report.name}</h4>
                        <Badge variant="outline" className="text-xs">{report.type}</Badge>
                        <Badge variant={report.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {report.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Frequency:</span>
                          <span className="ml-2 font-medium">{report.frequency}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Generated:</span>
                          <span className="ml-2 font-medium">{report.lastGenerated}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Next Generation:</span>
                          <span className="ml-2 font-medium">{report.nextGeneration}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Recipients:</span>
                          <span className="ml-2 font-medium">{report.recipients.length}</span>
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

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Revenue Growth */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{data.kpis.revenueGrowth}%</div>
                <p className="text-xs text-muted-foreground">
                  vs last period
                </p>
              </CardContent>
            </Card>

            {/* Profit Growth */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profit Growth</CardTitle>
                <TargetIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{data.kpis.profitGrowth}%</div>
                <p className="text-xs text-muted-foreground">
                  vs last period
                </p>
              </CardContent>
            </Card>

            {/* Cost Reduction */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost Reduction</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{data.kpis.costReduction}%</div>
                <p className="text-xs text-muted-foreground">
                  Operational efficiency
                </p>
              </CardContent>
            </Card>

            {/* Customer Satisfaction */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.kpis.customerSatisfaction}/5</div>
                <p className="text-xs text-muted-foreground">
                  Average rating
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Detailed Business KPIs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Market Share</span>
                      <span className="font-medium">{data.kpis.marketShare}%</span>
                    </div>
                    <Progress value={data.kpis.marketShare * 2} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Employee Productivity</span>
                      <span className="font-medium">{data.kpis.employeeProductivity}%</span>
                    </div>
                    <Progress value={data.kpis.employeeProductivity} className="h-2" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Efficiency Improvement</span>
                      <span className="font-medium">{data.kpis.efficiencyImprovement}%</span>
                    </div>
                    <Progress value={data.kpis.efficiencyImprovement * 10} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>System Uptime</span>
                      <span className="font-medium">{data.kpis.systemUptime}%</span>
                    </div>
                    <Progress value={data.kpis.systemUptime} className="h-2" />
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

export default EnhancedReportingDashboard;
