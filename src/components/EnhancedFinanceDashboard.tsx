'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  PiggyBank, 
  BarChart3,
  AlertTriangle,
  CheckCircle,
  FileText,
  Calculator,
  Target,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';

interface FinancialMetric {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

interface CashFlowData {
  period: string;
  income: number;
  expenses: number;
  netCash: number;
}

interface BudgetData {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentage: number;
}

const EnhancedFinanceDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const cashFlowData: CashFlowData[] = [
    { period: 'Jan', income: 1250000, expenses: 980000, netCash: 270000 },
    { period: 'Feb', income: 1320000, expenses: 1050000, netCash: 270000 },
    { period: 'Mar', income: 1180000, expenses: 920000, netCash: 260000 },
    { period: 'Apr', income: 1450000, expenses: 1100000, netCash: 350000 },
    { period: 'May', income: 1380000, expenses: 1020000, netCash: 360000 },
    { period: 'Jun', income: 1520000, expenses: 1150000, netCash: 370000 }
  ];

  const budgetData: BudgetData[] = [
    { category: 'Equipment & Maintenance', allocated: 500000, spent: 420000, remaining: 80000, percentage: 84 },
    { category: 'Personnel & Payroll', allocated: 800000, spent: 780000, remaining: 20000, percentage: 97.5 },
    { category: 'Operations & Logistics', allocated: 300000, spent: 280000, remaining: 20000, percentage: 93.3 },
    { category: 'Marketing & Sales', allocated: 200000, spent: 150000, remaining: 50000, percentage: 75 },
    { category: 'Administrative', allocated: 150000, spent: 120000, remaining: 30000, percentage: 80 }
  ];

  const financialMetrics: FinancialMetric[] = [
    {
      label: 'Total Revenue',
      value: 'Rp 8.2M',
      change: 12.5,
      trend: 'up',
      icon: <TrendingUp className="h-4 w-4 text-green-600" />
    },
    {
      label: 'Net Profit',
      value: 'Rp 1.8M',
      change: 8.3,
      trend: 'up',
      icon: <DollarSign className="h-4 w-4 text-blue-600" />
    },
    {
      label: 'Cash Flow',
      value: 'Rp 2.1M',
      change: -2.1,
      trend: 'down',
      icon: <CreditCard className="h-4 w-4 text-orange-600" />
    },
    {
      label: 'Budget Utilization',
      value: '87.2%',
      change: 3.4,
      trend: 'up',
      icon: <PiggyBank className="h-4 w-4 text-purple-600" />
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Finance Dashboard</h1>
          <p className="text-gray-600">Real-time financial monitoring & predictive analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            All Systems Operational
          </Badge>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialMetrics.map((metric, index) => (
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="budget">Budget Management</TabsTrigger>
          <TabsTrigger value="analytics">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Financial Health Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Financial Health Score
                </CardTitle>
                <CardDescription>Overall financial performance indicator</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">87/100</div>
                  <Progress value={87} className="mb-4" />
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-green-600">Excellent</div>
                      <div className="text-gray-500">Cash Flow</div>
                    </div>
                    <div>
                      <div className="font-semibold text-blue-600">Good</div>
                      <div className="text-gray-500">Profitability</div>
                    </div>
                    <div>
                      <div className="font-semibold text-orange-600">Fair</div>
                      <div className="text-gray-500">Efficiency</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Transactions
                </CardTitle>
                <CardDescription>Latest financial activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: 'Income', amount: 'Rp 450,000', description: 'Equipment Rental', time: '2 hours ago' },
                    { type: 'Expense', amount: 'Rp 125,000', description: 'Maintenance Parts', time: '4 hours ago' },
                    { type: 'Income', amount: 'Rp 320,000', description: 'Service Contract', time: '6 hours ago' },
                    { type: 'Expense', amount: 'Rp 85,000', description: 'Fuel Purchase', time: '8 hours ago' },
                  ].map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${transaction.type === 'Income' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-gray-500">{transaction.time}</div>
                        </div>
                      </div>
                      <div className={`font-semibold ${transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cash Flow Tab */}
        <TabsContent value="cashflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 mr-2" />
                Cash Flow Analysis
              </CardTitle>
              <CardDescription>Monthly cash flow trends and projections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Period Selector */}
                <div className="flex space-x-2">
                  {['week', 'month', 'quarter', 'year'].map((period) => (
                    <Button
                      key={period}
                      variant={selectedPeriod === period ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPeriod(period)}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </Button>
                  ))}
                </div>

                {/* Cash Flow Chart */}
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Interactive Cash Flow Chart</p>
                    <p className="text-sm text-gray-400">Shows income vs expenses over time</p>
                  </div>
                </div>

                {/* Cash Flow Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">Rp 8.2M</div>
                    <div className="text-sm text-gray-600">Total Income</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">Rp 6.4M</div>
                    <div className="text-sm text-gray-600">Total Expenses</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">Rp 1.8M</div>
                    <div className="text-sm text-gray-600">Net Cash Flow</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budget Management Tab */}
        <TabsContent value="budget" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Budget Management
              </CardTitle>
              <CardDescription>Track budget allocation and spending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetData.map((budget, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{budget.category}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          Rp {budget.spent.toLocaleString()} / Rp {budget.allocated.toLocaleString()}
                        </span>
                        <Badge variant={budget.percentage > 90 ? 'destructive' : budget.percentage > 75 ? 'default' : 'secondary'}>
                          {budget.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={budget.percentage} className="h-2" />
                    <div className="text-sm text-gray-500">
                      Remaining: Rp {budget.remaining.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictive Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Forecast */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Revenue Forecast
                </CardTitle>
                <CardDescription>AI-powered revenue predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">Rp 9.8M</div>
                    <div className="text-sm text-gray-600">Predicted Revenue (Next Month)</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Confidence Level</span>
                      <span className="font-semibold">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div className="text-xs text-gray-500">
                    Based on historical data, market trends, and seasonal patterns
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Risk Assessment
                </CardTitle>
                <CardDescription>Financial risk indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { risk: 'Cash Flow Risk', level: 'Low', color: 'green' },
                    { risk: 'Market Volatility', level: 'Medium', color: 'yellow' },
                    { risk: 'Credit Risk', level: 'Low', color: 'green' },
                    { risk: 'Operational Risk', level: 'Medium', color: 'yellow' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{item.risk}</span>
                      <Badge variant={item.color === 'green' ? 'secondary' : 'default'}>
                        {item.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Automated Workflows
              </CardTitle>
              <CardDescription>AI-powered financial automation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    name: 'Auto-Journaling', 
                    status: 'Active', 
                    description: 'Automatically categorizes transactions',
                    icon: <FileText className="h-4 w-4" />
                  },
                  { 
                    name: 'Invoice Processing', 
                    status: 'Active', 
                    description: 'AI-powered invoice recognition and processing',
                    icon: <Calculator className="h-4 w-4" />
                  },
                  { 
                    name: 'Expense Approval', 
                    status: 'Pending', 
                    description: 'Automated expense approval workflows',
                    icon: <CheckCircle className="h-4 w-4" />
                  },
                  { 
                    name: 'Budget Alerts', 
                    status: 'Active', 
                    description: 'Real-time budget threshold notifications',
                    icon: <AlertTriangle className="h-4 w-4" />
                  },
                ].map((workflow, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="p-2 bg-blue-100 rounded">
                      {workflow.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{workflow.name}</div>
                      <div className="text-sm text-gray-500">{workflow.description}</div>
                    </div>
                    <Badge variant={workflow.status === 'Active' ? 'default' : 'secondary'}>
                      {workflow.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedFinanceDashboard;
