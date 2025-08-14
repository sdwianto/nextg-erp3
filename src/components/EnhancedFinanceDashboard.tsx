'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  BarChart3,
  PieChart,
  LineChart,
  Calculator,
  Shield,
  RefreshCw,
  Plus,
  Eye,
  Settings,
  Globe,
  Clock,
  Target,
  Zap
} from 'lucide-react';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
  lastUpdated: string;
}

interface FinancialMetric {
  id: string;
  name: string;
  currentValue: number;
  previousValue: number;
  currency: string;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  status: 'pending' | 'completed' | 'failed';
  autoCategorized: boolean;
}

interface Budget {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  currency: string;
  period: string;
  variance: number;
  status: 'under' | 'over' | 'on-track';
}

interface RiskAlert {
  id: string;
  type: 'cash_flow' | 'budget_overrun' | 'currency_risk' | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  impact: string;
  recommendation: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

export default function EnhancedFinanceDashboard() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [metrics, setMetrics] = useState<FinancialMetric[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Mock data for demonstration
  useEffect(() => {
    const mockCurrencies: Currency[] = [
      { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0, lastUpdated: new Date().toISOString() },
      { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', rate: 15500, lastUpdated: new Date().toISOString() },
      { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.52, lastUpdated: new Date().toISOString() },
      { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92, lastUpdated: new Date().toISOString() },
      { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.23, lastUpdated: new Date().toISOString() }
    ];

    const mockMetrics: FinancialMetric[] = [
      {
        id: '1',
        name: 'Total Revenue',
        currentValue: 2500000,
        previousValue: 2200000,
        currency: 'USD',
        change: 300000,
        changePercent: 13.6,
        trend: 'up',
        status: 'good'
      },
      {
        id: '2',
        name: 'Operating Expenses',
        currentValue: 1800000,
        previousValue: 1650000,
        currency: 'USD',
        change: 150000,
        changePercent: 9.1,
        trend: 'up',
        status: 'warning'
      },
      {
        id: '3',
        name: 'Net Profit',
        currentValue: 700000,
        previousValue: 550000,
        currency: 'USD',
        change: 150000,
        changePercent: 27.3,
        trend: 'up',
        status: 'good'
      },
      {
        id: '4',
        name: 'Cash Flow',
        currentValue: 450000,
        previousValue: 380000,
        currency: 'USD',
        change: 70000,
        changePercent: 18.4,
        trend: 'up',
        status: 'good'
      }
    ];

    const mockTransactions: Transaction[] = [
      {
        id: '1',
        date: new Date().toISOString(),
        description: 'Equipment Purchase - Excavator Parts',
        amount: 25000,
        currency: 'USD',
        type: 'expense',
        category: 'Equipment & Maintenance',
        status: 'completed',
        autoCategorized: true
      },
      {
        id: '2',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        description: 'Mining Revenue - Gold Production',
        amount: 180000,
        currency: 'USD',
        type: 'income',
        category: 'Mining Operations',
        status: 'completed',
        autoCategorized: true
      },
      {
        id: '3',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Fuel Supply - Diesel',
        amount: 45000,
        currency: 'USD',
        type: 'expense',
        category: 'Fuel & Energy',
        status: 'pending',
        autoCategorized: true
      }
    ];

    const mockBudgets: Budget[] = [
      {
        id: '1',
        category: 'Equipment & Maintenance',
        allocated: 500000,
        spent: 320000,
        remaining: 180000,
        currency: 'USD',
        period: 'Q1 2024',
        variance: -64000,
        status: 'under'
      },
      {
        id: '2',
        category: 'Fuel & Energy',
        allocated: 300000,
        spent: 280000,
        remaining: 20000,
        currency: 'USD',
        period: 'Q1 2024',
        variance: -20000,
        status: 'on-track'
      },
      {
        id: '3',
        category: 'Labor & HR',
        allocated: 800000,
        spent: 750000,
        remaining: 50000,
        currency: 'USD',
        period: 'Q1 2024',
        variance: -50000,
        status: 'under'
      }
    ];

    const mockRiskAlerts: RiskAlert[] = [
      {
        id: '1',
        type: 'currency_risk',
        severity: 'high',
        message: 'IDR depreciation detected - 5% drop in 24h',
        impact: 'Potential $25,000 loss on IDR-denominated assets',
        recommendation: 'Consider hedging strategies or USD conversion',
        status: 'active'
      },
      {
        id: '2',
        type: 'budget_overrun',
        severity: 'medium',
        message: 'Fuel budget approaching limit - 93% utilized',
        impact: 'Risk of exceeding Q1 fuel budget by $15,000',
        recommendation: 'Review fuel consumption patterns and optimize usage',
        status: 'active'
      },
      {
        id: '3',
        type: 'cash_flow',
        severity: 'low',
        message: 'Cash flow projection shows minor shortfall in Q2',
        impact: 'Potential $50,000 shortfall in operational cash flow',
        recommendation: 'Monitor receivables and consider short-term financing',
        status: 'acknowledged'
      }
    ];

    setCurrencies(mockCurrencies);
    setMetrics(mockMetrics);
    setTransactions(mockTransactions);
    setBudgets(mockBudgets);
    setRiskAlerts(mockRiskAlerts);
    setIsLoading(false);
  }, []);

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
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

  const formatCurrency = (amount: number, currency: string) => {
    const currencyInfo = currencies.find(c => c.code === currency);
    if (!currencyInfo) return `${amount}`;
    
    return `${currencyInfo.symbol}${amount.toLocaleString()}`;
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
          <h1 className="text-3xl font-bold">💰 Enhanced Financial Management</h1>
          <p className="text-muted-foreground">Multi-currency support with predictive analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Transaction
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metric.currentValue, metric.currency)}</div>
              <div className="flex items-center space-x-2 text-xs">
                {getTrendIcon(metric.trend)}
                <span className={metric.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {metric.changePercent >= 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%
                </span>
                <span className="text-muted-foreground">
                  vs {formatCurrency(metric.previousValue, metric.currency)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Financial Overview</TabsTrigger>
          <TabsTrigger value="currencies">Multi-Currency</TabsTrigger>
          <TabsTrigger value="analytics">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="budgets">Budget Management</TabsTrigger>
          <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
        </TabsList>

        {/* Financial Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  📊 Recent Transactions
                  <Badge variant="secondary" className="ml-2">Auto-categorized</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {transaction.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {transaction.autoCategorized ? '🤖 Auto-categorized' : '👤 Manual'}
                        </span>
                        <Badge className={transaction.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Financial Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  🏥 Financial Health Score
                  <Shield className="h-4 w-4 ml-2" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600">85/100</div>
                    <div className="text-sm text-muted-foreground">Excellent Financial Health</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Cash Flow Ratio</span>
                        <span>1.8x</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Debt-to-Equity</span>
                        <span>0.4x</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Profit Margin</span>
                        <span>28%</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Multi-Currency Tab */}
        <TabsContent value="currencies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                🌍 Multi-Currency Management
                <Globe className="h-4 w-4 ml-2" />
                <Badge variant="secondary" className="ml-2">Real-time Rates</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currencies.map((currency) => (
                  <div key={currency.code} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{currency.name}</div>
                        <div className="text-sm text-muted-foreground">{currency.code}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{currency.symbol}</div>
                        <div className="text-xs text-muted-foreground">Exchange Rate</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>USD Rate:</span>
                        <span className="font-medium">{currency.rate.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Last Updated:</span>
                        <span className="font-medium">
                          {new Date(currency.lastUpdated).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="h-3 w-3 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictive Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Revenue Forecasting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  📈 Revenue Forecasting
                  <TrendingUp className="h-4 w-4 ml-2" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Q2 2024 Projection</span>
                      <Badge className="bg-green-600">+15%</Badge>
                    </div>
                    <div className="text-2xl font-bold">$2,875,000</div>
                    <div className="text-sm text-muted-foreground">
                      Based on current trends and market analysis
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Confidence Level:</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Key Factors:</span>
                      <span className="font-medium">Gold prices, Production capacity</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Risk Factors:</span>
                      <span className="font-medium">Currency fluctuations, Market volatility</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cash Flow Projection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  💰 Cash Flow Projection
                  <LineChart className="h-4 w-4 ml-2" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">30-Day Projection</span>
                      <Badge className="bg-green-600">Positive</Badge>
                    </div>
                    <div className="text-2xl font-bold">$520,000</div>
                    <div className="text-sm text-muted-foreground">
                      Expected net cash flow
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Inflows:</span>
                      <span className="font-medium text-green-600">$750,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Outflows:</span>
                      <span className="font-medium text-red-600">$230,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Buffer:</span>
                      <span className="font-medium">$180,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Budget Management Tab */}
        <TabsContent value="budgets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                📋 Budget Management & Variance Analysis
                <Target className="h-4 w-4 ml-2" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgets.map((budget) => (
                  <div key={budget.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{budget.category}</h3>
                        <p className="text-sm text-muted-foreground">{budget.period}</p>
                      </div>
                      <Badge className={budget.status === 'under' ? 'bg-green-600' : budget.status === 'over' ? 'bg-red-600' : 'bg-yellow-600'}>
                        {budget.status === 'under' ? 'Under Budget' : budget.status === 'over' ? 'Over Budget' : 'On Track'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Allocated:</span>
                        <span className="font-medium">{formatCurrency(budget.allocated, budget.currency)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Spent:</span>
                        <span className="font-medium">{formatCurrency(budget.spent, budget.currency)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Remaining:</span>
                        <span className="font-medium">{formatCurrency(budget.remaining, budget.currency)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Variance:</span>
                        <span className={`font-medium ${budget.variance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {budget.variance < 0 ? '+' : ''}{formatCurrency(Math.abs(budget.variance), budget.currency)}
                        </span>
                      </div>
                    </div>
                    
                    <Progress 
                      value={(budget.spent / budget.allocated) * 100} 
                      className="h-2"
                    />
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="h-3 w-3 mr-1" />
                        Adjust Budget
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Assessment Tab */}
        <TabsContent value="risks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                ⚠️ Risk Assessment & Alerts
                <AlertTriangle className="h-4 w-4 ml-2" />
                <Badge variant="destructive" className="ml-2">
                  {riskAlerts.filter(a => a.status === 'active').length} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskAlerts.map((alert) => (
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
                          <div className="text-sm text-muted-foreground">{alert.type.replace('_', ' ').toUpperCase()}</div>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Impact:</span> {alert.impact}
                      </div>
                      <div>
                        <span className="font-medium">Recommendation:</span> {alert.recommendation}
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
        Last updated: {lastUpdated.toLocaleString()} | Real-time financial monitoring active
      </div>
    </div>
  );
}
