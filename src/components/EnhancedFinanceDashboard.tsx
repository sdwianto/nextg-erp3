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
  DollarSign,
  BarChart3,
  LineChart,
  Building,
  Eye,
  Download,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap
} from 'lucide-react';

const EnhancedFinanceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Mock data for JDE Finance Dashboard
  const mockFinancialData = {
    overview: {
      totalRevenue: 2450000,
      totalExpenses: 1850000,
      netProfit: 600000,
      profitMargin: 24.5,
      cashFlow: 450000,
      accountsReceivable: 320000,
      accountsPayable: 180000,
      workingCapital: 140000,
    },
    currencies: {
      USD: { rate: 1, symbol: '$' },
      IDR: { rate: 15500, symbol: 'Rp' },
      EUR: { rate: 0.85, symbol: '€' },
      CNY: { rate: 6.45, symbol: '¥' },
    },
    departments: [
      { name: 'Operations', revenue: 1200000, expenses: 800000, profit: 400000 },
      { name: 'Sales', revenue: 800000, expenses: 500000, profit: 300000 },
      { name: 'Marketing', revenue: 300000, expenses: 350000, profit: -50000 },
      { name: 'IT', revenue: 150000, expenses: 200000, profit: -50000 },
    ],
    trends: {
      revenue: [2100000, 2200000, 2350000, 2450000],
      expenses: [1700000, 1750000, 1800000, 1850000],
      profit: [400000, 450000, 550000, 600000],
      months: ['Jan', 'Feb', 'Mar', 'Apr'],
    },
    kpis: {
      revenueGrowth: 12.5,
      expenseGrowth: 8.8,
      profitGrowth: 25.0,
      cashConversion: 85.2,
      debtToEquity: 0.35,
      returnOnAssets: 18.5,
      returnOnEquity: 24.1,
      currentRatio: 2.1,
    },
    alerts: [
      { type: 'warning', message: 'Accounts receivable aging over 30 days', value: 15 },
      { type: 'success', message: 'Profit margin above target', value: 24.5 },
      { type: 'info', message: 'Cash flow positive for 3 months', value: 3 },
    ],
  };

  const data = mockFinancialData;

  const formatCurrency = (amount: number, currency = 'USD') => {
    const currencyData = data.currencies[currency as keyof typeof data.currencies];
    const convertedAmount = amount * currencyData.rate;
    return `${currencyData.symbol}${convertedAmount.toLocaleString()}`;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">JDE Financial Analytics</h1>
          <p className="text-muted-foreground">
            Multi-currency financial performance tracking with Oracle JD Edwards standards
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Transaction
          </Button>
        </div>
      </div>

      {/* Currency Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Display Currency:</span>
              <div className="flex gap-2">
                {Object.keys(data.currencies).map((currency) => (
                  <Button
                    key={currency}
                    variant={selectedCurrency === currency ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCurrency(currency)}
                  >
                    {currency}
                  </Button>
                ))}
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              Last updated: {new Date().toLocaleTimeString()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.overview.totalRevenue, selectedCurrency)}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getTrendIcon(data.kpis.revenueGrowth)}
              <span>{data.kpis.revenueGrowth}% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.overview.netProfit, selectedCurrency)}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getTrendIcon(data.kpis.profitGrowth)}
              <span>{data.kpis.profitGrowth}% from last month</span>
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
              <span>Above target (20%)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.overview.cashFlow, selectedCurrency)}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Positive for 3 months</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Financial Summary */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Revenue vs Expenses</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Revenue</span>
                          <span className="font-medium">{formatCurrency(data.overview.totalRevenue, selectedCurrency)}</span>
                        </div>
                        <Progress value={100} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span>Expenses</span>
                          <span className="font-medium">{formatCurrency(data.overview.totalExpenses, selectedCurrency)}</span>
                        </div>
                        <Progress value={(data.overview.totalExpenses / data.overview.totalRevenue) * 100} className="h-2" />
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Working Capital</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Accounts Receivable</span>
                          <span className="font-medium">{formatCurrency(data.overview.accountsReceivable, selectedCurrency)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Accounts Payable</span>
                          <span className="font-medium">{formatCurrency(data.overview.accountsPayable, selectedCurrency)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                          <span>Working Capital</span>
                          <span className="text-green-600">{formatCurrency(data.overview.workingCapital, selectedCurrency)}</span>
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
                  Financial Alerts
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
                {data.departments.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{dept.name}</h4>
                        <Badge variant={dept.profit >= 0 ? "default" : "destructive"} className="text-xs">
                          {dept.profit >= 0 ? 'Profitable' : 'Loss'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Revenue:</span>
                          <span className="ml-2 font-medium">{formatCurrency(dept.revenue, selectedCurrency)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expenses:</span>
                          <span className="ml-2 font-medium">{formatCurrency(dept.expenses, selectedCurrency)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Profit:</span>
                          <span className={`ml-2 font-medium ${dept.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(dept.profit, selectedCurrency)}
                          </span>
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

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Monthly Revenue</span>
                    <Badge variant="outline">{data.kpis.revenueGrowth}% growth</Badge>
                  </div>
                  <div className="space-y-2">
                    {data.trends.revenue.map((value, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{data.trends.months[index]}</span>
                        <span className="font-medium">{formatCurrency(value, selectedCurrency)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profit Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Profit Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Monthly Profit</span>
                    <Badge variant="outline" className="text-green-600">{data.kpis.profitGrowth}% growth</Badge>
                  </div>
                  <div className="space-y-2">
                    {data.trends.profit.map((value, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{data.trends.months[index]}</span>
                        <span className="font-medium text-green-600">{formatCurrency(value, selectedCurrency)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* KPIs Tab */}
        <TabsContent value="kpis" className="space-y-4">
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

            {/* Cash Conversion */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cash Conversion</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.kpis.cashConversion}%</div>
                <p className="text-xs text-muted-foreground">
                  Cycle efficiency
                </p>
              </CardContent>
            </Card>

            {/* Return on Assets */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ROA</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.kpis.returnOnAssets}%</div>
                <p className="text-xs text-muted-foreground">
                  Return on assets
                </p>
              </CardContent>
            </Card>

            {/* Current Ratio */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Ratio</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.kpis.currentRatio}</div>
                <p className="text-xs text-muted-foreground">
                  Liquidity ratio
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed KPIs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Detailed Financial KPIs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Debt to Equity Ratio</span>
                      <span className="font-medium">{data.kpis.debtToEquity}</span>
                    </div>
                    <Progress value={data.kpis.debtToEquity * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Return on Equity</span>
                      <span className="font-medium">{data.kpis.returnOnEquity}%</span>
                    </div>
                    <Progress value={data.kpis.returnOnEquity} className="h-2" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Expense Growth</span>
                      <span className="font-medium">{data.kpis.expenseGrowth}%</span>
                    </div>
                    <Progress value={data.kpis.expenseGrowth} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Profit Growth</span>
                      <span className="font-medium">{data.kpis.profitGrowth}%</span>
                    </div>
                    <Progress value={data.kpis.profitGrowth} className="h-2" />
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

export default EnhancedFinanceDashboard;
