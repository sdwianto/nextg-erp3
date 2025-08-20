'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/utils/api';

import { 
  Package, 
  TrendingUp, 
  AlertTriangle,
  MapPin, 
  FileText, 
  Users, 
  CheckCircle,
  Plus,
  Eye,
  Download,
  Filter,
  Search,
  ShoppingCart,
  Truck,
  Building,
  DollarSign,
  Calendar,
  User
} from 'lucide-react';

export const EnhancedInventoryDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dialog states
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isExportReportModalOpen, setIsExportReportModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isCreateGRNModalOpen, setIsCreateGRNModalOpen] = useState(false);
  const [isCreateGIModalOpen, setIsCreateGIModalOpen] = useState(false);
  const [isCreateTransferModalOpen, setIsCreateTransferModalOpen] = useState(false);
  const [isViewItemModalOpen, setIsViewItemModalOpen] = useState(false);
  const [isCreatePOModalOpen, setIsCreatePOModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    productName: string;
    sku: string;
    quantity: number;
    category: string;
    warehouse: string;
    costPrice: number;
    price: number;
    costValue: number;
  } | null>(null);

  // Integration with Procurement Data
  const [procurementInventoryItems, setProcurementInventoryItems] = useState<{
    id: string;
    productName: string;
    sku: string;
    quantity: number;
    category: string;
    warehouse: string;
    costPrice: number;
    price: number;
    costValue: number;
    source: string;
    sourceDocument: string;
    receivedDate: string;
    status: string;
  }[]>([]);

  // Load procurement inventory items from localStorage
  React.useEffect(() => {
    const storedItems = localStorage.getItem('inventoryItems');
    if (storedItems) {
      try {
        const items = JSON.parse(storedItems) as {
          id: string;
          productName: string;
          sku: string;
          quantity: number;
          category: string;
          warehouse: string;
          costPrice: number;
          price: number;
          costValue: number;
          source: string;
          sourceDocument: string;
          receivedDate: string;
          status: string;
        }[];
        setProcurementInventoryItems(items);
      } catch (error) {
        console.error('Error parsing inventory items from localStorage:', error);
      }
    }
  }, []);

  // API Queries for P1 Enhanced Features
  const { data: dashboardData, isLoading: dashboardLoading } = api.inventory.getDashboardData.useQuery();
  const { data: stockValuation } = api.inventory.getRealTimeStockValuation.useQuery({});
  const { data: reorderAlerts } = api.inventory.getReorderAlerts.useQuery({ threshold: 10 });
  const { data: locationTracking } = api.inventory.getLocationTracking.useQuery({});
  const { data: supplierPerformance } = api.inventory.getSupplierPerformance.useQuery();
  const { data: qualityInspection } = api.inventory.getQualityInspection.useQuery({});

  // JDE-Style Enhanced Features
  const { data: enhancedStockValuation } = api.inventory.getEnhancedStockValuation.useQuery({
    valuationMethod: 'AVERAGE',
    includeInactive: false,
  });

  const { data: masterData } = api.inventory.getMasterData.useQuery({
    entityType: 'product',
    search: '',
  });

  // Mock data for development (fallback)
  const mockStats = {
    totalProducts: 1250 + procurementInventoryItems.length,
    totalCategories: 45,
    totalWarehouses: 8,
    lowStockItems: 23,
  };

  // Enhanced mock data with JDE features
  const mockEnhancedStockValuation = {
    data: {
      totalCostValue: 38940,
      totalMarketValue: 52000,
      profitMargin: 13060,
      profitMarginPercentage: 33.5,
      valuationMethod: 'AVERAGE',
      categoryBreakdown: [
        {
          name: 'Machinery',
          quantity: 15,
          costValue: 37500,
          marketValue: 48000,
          profitMargin: 10500,
          profitMarginPercentage: 28.0,
          items: 1,
        },
        {
          name: 'Safety',
          quantity: 8,
          costValue: 1440,
          marketValue: 2000,
          profitMargin: 560,
          profitMarginPercentage: 38.9,
          items: 1,
        },
      ],
      warehouseBreakdown: [
        {
          name: 'Main Warehouse',
          quantity: 15,
          costValue: 37500,
          marketValue: 48000,
          profitMargin: 10500,
          profitMarginPercentage: 28.0,
          items: 1,
        },
        {
          name: 'Secondary Warehouse',
          quantity: 8,
          costValue: 1440,
          marketValue: 2000,
          profitMargin: 560,
          profitMarginPercentage: 38.9,
          items: 1,
        },
      ],
      summary: {
        totalItems: 2,
        activeItems: 2,
        inactiveItems: 0,
        averageItemValue: 19470,
        averageQuantity: 11.5,
      },
    },
  };

  // Additional mock data for missing variables
  const mockInventoryItems = [];
  const mockReorderAlerts = [];
  const mockReorderAlertsData = { data: { totalAlerts: 5, criticalAlerts: 2 } };
  const mockSupplierPerformance = { data: [] };
  const mockQualityInspection = { data: [] };

  // Combine mock inventory items with procurement items
  const allInventoryItems = [
    ...mockInventoryItems,
    ...procurementInventoryItems
  ];

  // Use real API data or fallback to enhanced mock data
  const stats = mockStats;
  const inventoryItems = allInventoryItems;
  const alerts = mockReorderAlerts;
  const finalStockValuation = enhancedStockValuation || mockEnhancedStockValuation;
  const finalReorderAlerts = reorderAlerts || mockReorderAlertsData;
  const finalSupplierPerformance = supplierPerformance || mockSupplierPerformance;
  const finalQualityInspection = qualityInspection || mockQualityInspection;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  if (dashboardLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading inventory data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enhanced Inventory Management</h1>
          <p className="text-muted-foreground">
            Real-time stock valuation, reorder alerts, location tracking, and supplier performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsExportReportModalOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="default" size="sm" onClick={() => setIsAddItemModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active inventory items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${finalStockValuation?.data?.totalMarketValue?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">Current market value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reorder Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{finalReorderAlerts?.data?.totalAlerts || 0}</div>
            <p className="text-xs text-muted-foreground">
              {finalReorderAlerts?.data?.criticalAlerts || 0} critical
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warehouses</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWarehouses}</div>
            <p className="text-xs text-muted-foreground">Active locations</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="reorder-alerts">Reorder Alerts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Enhanced Stock Valuation Summary with JDE Features */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  JDE-Style Stock Valuation Summary
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {stockValuation?.data?.valuationMethod || 'AVERAGE'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${stockValuation?.data?.totalCostValue?.toLocaleString() || '0'}
                    </div>
                    <div className="text-sm text-muted-foreground">Cost Value</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${stockValuation?.data?.profitMargin?.toLocaleString() || '0'}
                    </div>
                    <div className="text-sm text-muted-foreground">Profit Margin</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Profit Margin %</span>
                    <span className="font-medium">
                      {stockValuation?.data?.profitMarginPercentage?.toFixed(1) || '0'}%
                    </span>
                  </div>
                  <Progress 
                    value={stockValuation?.data?.profitMarginPercentage || 0} 
                    className="h-2 bg-gray-100 dark:bg-gray-800" 
                  />
                </div>
                
                {/* JDE-Style Summary Metrics */}
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-lg font-bold">{stockValuation?.data?.summary?.totalItems || 0}</div>
                    <div className="text-xs text-muted-foreground">Total Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{stockValuation?.data?.summary?.activeItems || 0}</div>
                    <div className="text-xs text-muted-foreground">Active Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">${stockValuation?.data?.summary?.averageItemValue?.toLocaleString() || '0'}</div>
                    <div className="text-xs text-muted-foreground">Avg Item Value</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  JDE Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => setIsCreateGRNModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create GRN
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setIsExportReportModalOpen(true)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate JDE Report
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setIsSearchModalOpen(true)}>
                  <Search className="h-4 w-4 mr-2" />
                  Master Data Search
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setIsFilterModalOpen(true)}>
                  <Filter className="h-4 w-4 mr-2" />
                  Apply JDE Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* JDE-Style Category and Warehouse Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Category Breakdown
                  <Badge variant="secondary">{stockValuation?.data?.categoryBreakdown?.length || 0}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stockValuation?.data?.categoryBreakdown?.slice(0, 5).map((category: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">{category.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {category.quantity} units • {category.items} items
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">
                          ${category.costValue?.toLocaleString() || '0'}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400">
                          +{category.profitMarginPercentage?.toFixed(1) || '0'}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Warehouse Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Warehouse Breakdown
                  <Badge variant="secondary">{stockValuation?.data?.warehouseBreakdown?.length || 0}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stockValuation?.data?.warehouseBreakdown?.slice(0, 5).map((warehouse: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">{warehouse.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {warehouse.quantity} units • {warehouse.items} items
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">
                          ${warehouse.costValue?.toLocaleString() || '0'}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400">
                          +{warehouse.profitMarginPercentage?.toFixed(1) || '0'}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          {/* Procurement Integration Section */}
          {procurementInventoryItems.length > 0 && (
            <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Items from Procurement
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {procurementInventoryItems.length}
                  </Badge>
              </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Inventory items created through procurement workflow
                </p>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                  {procurementInventoryItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border border-blue-200 dark:border-blue-800 rounded-lg hover:shadow-md transition-shadow hover:border-blue-500 dark:hover:border-blue-400 bg-blue-50 dark:bg-blue-950/20">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{item.productName}</h4>
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                            Procurement
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.sku} - {item.warehouse}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          Source: {item.sourceDocument} • Received: {item.receivedDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium text-sm">{item.quantity} units</div>
                          <div className="text-xs text-muted-foreground">
                            ${item.costValue?.toLocaleString() || '0'}
                        </div>
                      </div>
                        <Button size="sm" variant="outline" onClick={() => {
                           setSelectedItem(item);
                           setIsViewItemModalOpen(true);
                         }}>
                           <Eye className="h-3 w-3" />
                         </Button>
                    </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                All Inventory Items
                <Badge variant="secondary">{inventoryItems.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inventoryItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:shadow-md transition-shadow hover:border-blue-500 dark:hover:border-blue-400">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{item.productName}</h4>
                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                        {(item).source === 'Procurement' && (
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                            Procurement
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{item.sku} - {item.warehouse}</p>
                      {'source' in item && (item).source === 'Procurement' && (
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          Source: {(item).sourceDocument} • Received: {(item).receivedDate}
                            </p>
                          )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                        <div className="font-medium text-sm">{item.quantity} units</div>
                        <div className="text-xs text-muted-foreground">
                          ${item.costValue?.toLocaleString() || '0'}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => {
                         setSelectedItem(item);
                         setIsViewItemModalOpen(true);
                       }}>
                         <Eye className="h-3 w-3" />
                       </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reorder-alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Reorder Alerts
                <Badge variant="secondary">{alerts.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:shadow-md transition-shadow hover:border-blue-500 dark:hover:border-blue-400">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{alert.productName}</h4>
                        <Badge className={getUrgencyColor(alert.urgency)}>
                          {alert.urgency.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Current: {alert.currentStock} | Min: {alert.minStockLevel} | Reorder: {alert.reorderQuantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium text-sm">
                          ${alert.estimatedCost?.toLocaleString() || '0'}
                        </div>
                        <div className="text-xs text-muted-foreground">Estimated Cost</div>
                      </div>
                      <Button size="sm" variant="default" onClick={() => setIsCreatePOModalOpen(true)}>
                        <Plus className="h-3 w-3" />
                </Button>
                    </div>
                  </div>
                ))}
              </div>
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Supplier Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Supplier Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {supplierPerformance?.data?.suppliers?.slice(0, 3).map((supplier: { id: string; name: string; rating: string; onTimeDelivery: number }) => (
                    <div key={supplier.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">{supplier.name}</h4>
                        <p className="text-xs text-muted-foreground">Rating: {supplier.rating}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">{supplier.onTimeDelivery}%</div>
                        <div className="text-xs text-muted-foreground">On-time Delivery</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quality Inspection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Quality Inspection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {qualityInspection?.data?.inspections?.slice(0, 3).map((inspection: { id: string; grNumber: string; supplier: string; qualityStatus: string }) => (
                    <div key={inspection.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">{inspection.grNumber}</h4>
                        <p className="text-xs text-muted-foreground">{inspection.supplier}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={
                          inspection.qualityStatus === 'passed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          inspection.qualityStatus === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }>
                          {inspection.qualityStatus.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-500 dark:hover:border-blue-400" onClick={() => setIsCreateGRNModalOpen(true)}>
              <CardContent className="p-6 text-center">
                <Package className="h-12 w-12 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold mb-2">Goods Received Note (GRN)</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Process incoming goods and update inventory
                </p>
                <Button variant="default" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  setIsCreateGRNModalOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create GRN
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-green-500 dark:hover:border-green-400" onClick={() => setIsCreateGIModalOpen(true)}>
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 mx-auto mb-3 text-green-600 dark:text-green-400" />
                <h3 className="font-semibold mb-2">Goods Issue (GI)</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Issue goods for production or sales
                </p>
                <Button variant="default" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  setIsCreateGIModalOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create GI
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-purple-500 dark:hover:border-purple-400" onClick={() => setIsCreateTransferModalOpen(true)}>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold mb-2">Stock Transfer</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Transfer stock between warehouses
                </p>
                <Button variant="default" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  setIsCreateTransferModalOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Transfer
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog Modals */}
       
      {/* Add Item Modal */}
      <Dialog open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Inventory Item
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input id="productName" placeholder="Enter product name" />
              </div>
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" placeholder="Enter SKU" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="machinery">Machinery</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="tools">Tools</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="warehouse">Warehouse</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Warehouse</SelectItem>
                    <SelectItem value="secondary">Secondary Warehouse</SelectItem>
                    <SelectItem value="regional">Regional Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="quantity">Initial Quantity</Label>
                <Input id="quantity" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="costPrice">Cost Price</Label>
                <Input id="costPrice" type="number" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="sellingPrice">Selling Price</Label>
                <Input id="sellingPrice" type="number" placeholder="0.00" />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter product description" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddItemModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={() => {
                // TODO: Implement add item functionality
                setIsAddItemModalOpen(false);
              }}>
                Add Item
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Report Modal */}
      <Dialog open={isExportReportModalOpen} onOpenChange={setIsExportReportModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Inventory Report
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reportType">Report Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stock-levels">Stock Levels</SelectItem>
                    <SelectItem value="valuation">Stock Valuation</SelectItem>
                    <SelectItem value="movements">Stock Movements</SelectItem>
                    <SelectItem value="alerts">Reorder Alerts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="format">Format</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsExportReportModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={() => {
                // TODO: Implement export functionality
                setIsExportReportModalOpen(false);
              }}>
                Export Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Search Items Modal */}
      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Inventory Items
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="searchQuery">Search Query</Label>
              <Input id="searchQuery" placeholder="Search by name, SKU, or description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="searchCategory">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="machinery">Machinery</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="tools">Tools</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="searchWarehouse">Warehouse</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All warehouses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Warehouses</SelectItem>
                    <SelectItem value="main">Main Warehouse</SelectItem>
                    <SelectItem value="secondary">Secondary Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsSearchModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={() => {
                // TODO: Implement search functionality
                setIsSearchModalOpen(false);
              }}>
                Search
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Filter Modal */}
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Apply Filters
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stockLevel">Stock Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="low-stock">Low Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="valueRange">Value Range</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All values" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Values</SelectItem>
                    <SelectItem value="low">Low Value (&lt;$100)</SelectItem>
                    <SelectItem value="medium">Medium Value ($100-$1000)</SelectItem>
                    <SelectItem value="high">High Value (&gt;$1000)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minQuantity">Min Quantity</Label>
                <Input id="minQuantity" type="number" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="maxQuantity">Max Quantity</Label>
                <Input id="maxQuantity" type="number" placeholder="1000" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsFilterModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={() => {
                // TODO: Implement filter functionality
                setIsFilterModalOpen(false);
              }}>
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create GRN Modal */}
      <Dialog open={isCreateGRNModalOpen} onOpenChange={setIsCreateGRNModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Create Goods Received Note (GRN)
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="techcorp">TechCorp Industries</SelectItem>
                    <SelectItem value="safetyfirst">SafetyFirst Ltd</SelectItem>
                    <SelectItem value="qualityparts">QualityParts Co</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="poNumber">Purchase Order Number</Label>
                <Input id="poNumber" placeholder="Enter PO number" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="receiptDate">Receipt Date</Label>
                <Input id="receiptDate" type="date" />
              </div>
              <div>
                <Label htmlFor="warehouse">Warehouse</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Warehouse</SelectItem>
                    <SelectItem value="secondary">Secondary Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="grnItems">Items Received</Label>
              <div className="border rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium">
                  <span>Product</span>
                  <span>Quantity</span>
                  <span>Unit Cost</span>
                  <span>Total</span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pump">Industrial Pump</SelectItem>
                      <SelectItem value="safety">Safety Equipment</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" placeholder="0" />
                  <Input type="number" placeholder="0.00" />
                  <Input type="number" placeholder="0.00" disabled />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="grnNotes">Notes</Label>
              <Textarea id="grnNotes" placeholder="Enter any additional notes" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateGRNModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={() => {
                // TODO: Implement GRN creation
                setIsCreateGRNModalOpen(false);
              }}>
                Create GRN
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create GI Modal */}
      <Dialog open={isCreateGIModalOpen} onOpenChange={setIsCreateGIModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Create Goods Issue (GI)
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="giDepartment">Department</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="giDate">Issue Date</Label>
                <Input id="giDate" type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="giReference">Reference Number</Label>
                <Input id="giReference" placeholder="Enter reference number" />
              </div>
              <div>
                <Label htmlFor="giWarehouse">From Warehouse</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Warehouse</SelectItem>
                    <SelectItem value="secondary">Secondary Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="giItems">Items to Issue</Label>
              <div className="border rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium">
                  <span>Product</span>
                  <span>Available</span>
                  <span>Quantity</span>
                  <span>Purpose</span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pump">Industrial Pump (15 available)</SelectItem>
                      <SelectItem value="safety">Safety Equipment (8 available)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" placeholder="0" disabled />
                  <Input type="number" placeholder="0" />
                  <Input placeholder="Enter purpose" />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="giNotes">Notes</Label>
              <Textarea id="giNotes" placeholder="Enter any additional notes" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateGIModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={() => {
                // TODO: Implement GI creation
                setIsCreateGIModalOpen(false);
              }}>
          Create GI
        </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Transfer Modal */}
      <Dialog open={isCreateTransferModalOpen} onOpenChange={setIsCreateTransferModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Create Stock Transfer
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fromWarehouse">From Warehouse</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Warehouse</SelectItem>
                    <SelectItem value="secondary">Secondary Warehouse</SelectItem>
                    <SelectItem value="regional">Regional Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="toWarehouse">To Warehouse</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Warehouse</SelectItem>
                    <SelectItem value="secondary">Secondary Warehouse</SelectItem>
                    <SelectItem value="regional">Regional Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transferDate">Transfer Date</Label>
                <Input id="transferDate" type="date" />
              </div>
              <div>
                <Label htmlFor="transferReason">Reason</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rebalancing">Stock Rebalancing</SelectItem>
                    <SelectItem value="demand">Demand Transfer</SelectItem>
                    <SelectItem value="maintenance">Maintenance Transfer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="transferItems">Items to Transfer</Label>
              <div className="border rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium">
                  <span>Product</span>
                  <span>Available</span>
                  <span>Quantity</span>
                  <span>Notes</span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pump">Industrial Pump (15 available)</SelectItem>
                      <SelectItem value="safety">Safety Equipment (8 available)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" placeholder="0" disabled />
                  <Input type="number" placeholder="0" />
                  <Input placeholder="Enter notes" />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
        </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="transferNotes">Additional Notes</Label>
              <Textarea id="transferNotes" placeholder="Enter any additional notes" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateTransferModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={() => {
                // TODO: Implement transfer creation
                setIsCreateTransferModalOpen(false);
              }}>
                Create Transfer
        </Button>
      </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Item Modal */}
      <Dialog open={isViewItemModalOpen} onOpenChange={setIsViewItemModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Item Details
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Product Name</Label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                    {selectedItem.productName}
                  </div>
                </div>
                <div>
                  <Label>SKU</Label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                    {selectedItem.sku}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                    {selectedItem.category}
                  </div>
                </div>
                <div>
                  <Label>Warehouse</Label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                    {selectedItem.warehouse}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Current Stock</Label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                    {selectedItem.quantity} units
                  </div>
                </div>
                <div>
                  <Label>Cost Price</Label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                    ${selectedItem.costPrice?.toLocaleString()}
                  </div>
                </div>
                <div>
                  <Label>Selling Price</Label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                    ${selectedItem.price?.toLocaleString()}
                  </div>
                </div>
              </div>
              <div>
                <Label>Total Value</Label>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                  ${selectedItem.costValue?.toLocaleString()}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsViewItemModalOpen(false)}>
                  Close
                </Button>
                <Button variant="default" onClick={() => {
                  setIsViewItemModalOpen(false);
                  setIsCreateGIModalOpen(true);
                }}>
                  Create GI
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create PO Modal */}
      <Dialog open={isCreatePOModalOpen} onOpenChange={setIsCreatePOModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Create Purchase Order
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="poSupplier">Supplier</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="techcorp">TechCorp Industries</SelectItem>
                    <SelectItem value="safetyfirst">SafetyFirst Ltd</SelectItem>
                    <SelectItem value="qualityparts">QualityParts Co</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="poDate">Order Date</Label>
                <Input id="poDate" type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expectedDelivery">Expected Delivery</Label>
                <Input id="expectedDelivery" type="date" />
              </div>
              <div>
                <Label htmlFor="poCurrency">Currency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="idr">IDR</SelectItem>
                    <SelectItem value="eur">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="poItems">Order Items</Label>
              <div className="border rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-5 gap-4 text-sm font-medium">
                  <span>Product</span>
                  <span>Quantity</span>
                  <span>Unit Cost</span>
                  <span>Total</span>
                  <span>Action</span>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pump">Industrial Pump</SelectItem>
                      <SelectItem value="safety">Safety Equipment</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" placeholder="0" />
                  <Input type="number" placeholder="0.00" />
                  <Input type="number" placeholder="0.00" disabled />
                  <Button variant="outline" size="sm">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="poNotes">Notes</Label>
              <Textarea id="poNotes" placeholder="Enter any additional notes" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreatePOModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={() => {
                // TODO: Implement PO creation
                setIsCreatePOModalOpen(false);
              }}>
                Create Purchase Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

