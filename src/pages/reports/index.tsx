import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/utils/api';
import { 
  TrendingUp, 
  Download,
  FileText,
  BarChart3,
  DollarSign,
  Package,
  Building,
  Users,
  Calendar,
  Eye,
  Plus
} from 'lucide-react';

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('jde-dashboards');

  // API Queries for JDE Reports - using mock data for now
  const jdeTemplates = { data: null };
  const scheduledReports = { data: null };
  const operationalKPIs = { data: null };

  // Mock data for development
  const mockJDETemplates = [
    {
      id: 'jde-inventory-valuation',
      name: 'JDE Inventory Valuation Report',
      description: 'Comprehensive inventory valuation with multi-dimensional analysis',
      category: 'inventory',
      jdeCompliance: true,
      features: ['multi-dimensional', 'drill-down', 'predictive', 'real-time'],
      outputFormats: ['pdf', 'excel', 'csv', 'powerpoint'],
    },
    {
      id: 'jde-procurement-performance',
      name: 'JDE Procurement Performance Report',
      description: 'Supplier performance and procurement analytics with JDE standards',
      category: 'procurement',
      jdeCompliance: true,
      features: ['supplier-scoring', 'trend-analysis', 'predictive', 'benchmarking'],
      outputFormats: ['pdf', 'excel', 'csv'],
    },
    {
      id: 'jde-financial-dashboard',
      name: 'JDE Financial Dashboard Report',
      description: 'Comprehensive financial analytics with multi-currency support',
      category: 'financial',
      jdeCompliance: true,
      features: ['multi-currency', 'real-time', 'predictive', 'drill-down'],
      outputFormats: ['pdf', 'excel', 'powerpoint'],
    },
  ];

  const mockOperationalKPIs = {
    inventory: {
      stockTurnover: 4.2,
      fillRate: 95.8,
      accuracy: 98.5,
    },
    procurement: {
      orderFulfillment: 92.3,
      supplierOnTimeDelivery: 88.7,
      costSavings: 156000,
    },
    financial: {
      revenueGrowth: 12.5,
      profitMargin: 18.3,
      cashFlow: 450000,
    },
  };

  // Use real API data or fallback to mock data
  const templates = jdeTemplates?.data?.templates || mockJDETemplates;
  const kpis = operationalKPIs?.data?.kpis || mockOperationalKPIs;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'inventory': return <Package className="h-5 w-5" />;
      case 'procurement': return <Building className="h-5 w-5" />;
      case 'financial': return <DollarSign className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">JDE-Style Business Intelligence</h1>
            <p className="text-muted-foreground">
              Advanced reporting and analytics with Oracle JD Edwards EnterpriseOne best practices
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">JDE Templates</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.length}</div>
              <p className="text-xs text-muted-foreground">
                {templates.filter(t => t.jdeCompliance).length} JDE compliant
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Report Categories</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(templates.map(t => t.category)).size}</div>
              <p className="text-xs text-muted-foreground">
                Multi-dimensional analysis
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Generated</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2h ago</div>
              <p className="text-xs text-muted-foreground">
                JDE Inventory Report
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Reports</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Scheduled reports
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jde-dashboards">JDE Dashboards</TabsTrigger>
            <TabsTrigger value="report-templates">Report Templates</TabsTrigger>
            <TabsTrigger value="operational-kpis">Operational KPIs</TabsTrigger>
          </TabsList>

          {/* JDE Dashboards Tab */}
          <TabsContent value="jde-dashboards" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Inventory Dashboard */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-500 dark:hover:border-blue-400">
                <CardContent className="p-6 text-center">
                  <Package className="h-12 w-12 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold mb-2">Inventory Analytics</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Multi-dimensional inventory analysis with JDE standards
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Stock Turnover:</span>
                      <span className="font-medium">{kpis.inventory.stockTurnover}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Fill Rate:</span>
                      <span className="font-medium">{kpis.inventory.fillRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Accuracy:</span>
                      <span className="font-medium">{kpis.inventory.accuracy}%</span>
                    </div>
                  </div>
                  <Button variant="default" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Dashboard
                  </Button>
                </CardContent>
              </Card>

              {/* Procurement Dashboard */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-green-500 dark:hover:border-green-400">
                <CardContent className="p-6 text-center">
                  <Building className="h-12 w-12 mx-auto mb-3 text-green-600 dark:text-green-400" />
                  <h3 className="font-semibold mb-2">Procurement Analytics</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supplier performance and procurement insights
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Order Fulfillment:</span>
                      <span className="font-medium">{kpis.procurement.orderFulfillment}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>On-time Delivery:</span>
                      <span className="font-medium">{kpis.procurement.supplierOnTimeDelivery}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cost Savings:</span>
                      <span className="font-medium">${kpis.procurement.costSavings.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button variant="default" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Dashboard
                  </Button>
                </CardContent>
              </Card>

              {/* Financial Dashboard */}
              <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-purple-500 dark:hover:border-purple-400">
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-12 w-12 mx-auto mb-3 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-semibold mb-2">Financial Analytics</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Multi-currency financial performance tracking
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Revenue Growth:</span>
                      <span className="font-medium">{kpis.financial.revenueGrowth}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Profit Margin:</span>
                      <span className="font-medium">{kpis.financial.profitMargin}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cash Flow:</span>
                      <span className="font-medium">${kpis.financial.cashFlow.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button variant="default" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Dashboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Report Templates Tab */}
          <TabsContent value="report-templates" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(template.category)}
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        {template.jdeCompliance && (
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            JDE Compliant
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Features */}
                      <div>
                        <div className="text-sm font-medium mb-2">Features</div>
                        <div className="flex flex-wrap gap-2">
                          {template.features.map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature.replace('-', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Output Formats */}
                      <div>
                        <div className="text-sm font-medium mb-2">Output Formats</div>
                        <div className="flex flex-wrap gap-2">
                          {template.outputFormats.map((format) => (
                            <Badge key={format} variant="secondary" className="text-xs">
                              {format.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="default" size="sm" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Generate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Operational KPIs Tab */}
          <TabsContent value="operational-kpis" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Inventory KPIs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Inventory KPIs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Stock Turnover</span>
                        <span className="font-medium">{kpis.inventory.stockTurnover}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${kpis.inventory.stockTurnover * 10}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Fill Rate</span>
                        <span className="font-medium">{kpis.inventory.fillRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${kpis.inventory.fillRate}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Accuracy</span>
                        <span className="font-medium">{kpis.inventory.accuracy}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${kpis.inventory.accuracy}%` }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Procurement KPIs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Procurement KPIs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Order Fulfillment</span>
                        <span className="font-medium">{kpis.procurement.orderFulfillment}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${kpis.procurement.orderFulfillment}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>On-time Delivery</span>
                        <span className="font-medium">{kpis.procurement.supplierOnTimeDelivery}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${kpis.procurement.supplierOnTimeDelivery}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Cost Savings</span>
                        <span className="font-medium">${kpis.procurement.costSavings.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial KPIs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Financial KPIs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Revenue Growth</span>
                        <span className="font-medium">{kpis.financial.revenueGrowth}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${kpis.financial.revenueGrowth * 2}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Profit Margin</span>
                        <span className="font-medium">{kpis.financial.profitMargin}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${kpis.financial.profitMargin * 2}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Cash Flow</span>
                        <span className="font-medium">${kpis.financial.cashFlow.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage; 