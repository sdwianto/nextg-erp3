'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  AlertTriangle, 
  MapPin, 
  TrendingUp, 
  ShoppingCart,
  Warehouse,
  Navigation,
  Bell,
  RefreshCw,
  Plus,
  Eye,
  Settings
} from 'lucide-react';

interface StockItem {
  id: string;
  sku: string;
  name: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  reorderPoint: number;
  maxStock: number;
  warehouse: string;
  zone: string;
  shelf: string;
  bin: string;
  status: 'normal' | 'low_stock' | 'out_of_stock' | 'overstock';
  lastUpdated: string;
  gpsCoordinates?: { latitude: number; longitude: number };
}

interface StockAlert {
  id: string;
  productId: string;
  sku: string;
  name: string;
  warehouse: string;
  alertType: 'low_stock' | 'out_of_stock' | 'overstock';
  currentStock: number;
  thresholdStock: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  created_at: string;
  urgency: 'normal' | 'urgent' | 'overdue';
}

interface WarehouseLocation {
  id: string;
  name: string;
  zone: string;
  shelf: string;
  bin: string;
  gpsCoordinates?: { latitude: number; longitude: number };
  items: number;
}

export default function EnhancedInventoryDashboard() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [warehouseLocations, setWarehouseLocations] = useState<WarehouseLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Mock data for demonstration
  useEffect(() => {
    const mockStockItems: StockItem[] = [
      {
        id: '1',
        sku: 'EXC-001',
        name: 'Excavator Parts',
        currentStock: 45,
        reservedStock: 5,
        availableStock: 40,
        reorderPoint: 25,
        maxStock: 100,
        warehouse: 'Warehouse A',
        zone: 'A1',
        shelf: '01',
        bin: 'A',
        status: 'normal',
        lastUpdated: new Date().toISOString(),
        gpsCoordinates: { latitude: -6.2088, longitude: 106.8456 }
      },
      {
        id: '2',
        sku: 'BUL-002',
        name: 'Bulldozer Parts',
        currentStock: 23,
        reservedStock: 2,
        availableStock: 21,
        reorderPoint: 25,
        maxStock: 80,
        warehouse: 'Warehouse B',
        zone: 'B2',
        shelf: '03',
        bin: 'B',
        status: 'low_stock',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '3',
        sku: 'CRN-003',
        name: 'Crane Parts',
        currentStock: 0,
        reservedStock: 0,
        availableStock: 0,
        reorderPoint: 15,
        maxStock: 50,
        warehouse: 'Warehouse A',
        zone: 'A1',
        shelf: '02',
        bin: 'C',
        status: 'out_of_stock',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '4',
        sku: 'LDR-004',
        name: 'Loader Parts',
        currentStock: 67,
        reservedStock: 3,
        availableStock: 64,
        reorderPoint: 20,
        maxStock: 70,
        warehouse: 'Warehouse C',
        zone: 'C1',
        shelf: '02',
        bin: 'C',
        status: 'normal',
        lastUpdated: new Date().toISOString()
      }
    ];

    const mockAlerts: StockAlert[] = [
      {
        id: '1',
        productId: '3',
        sku: 'CRN-003',
        name: 'Crane Parts',
        warehouse: 'Warehouse A',
        alertType: 'out_of_stock',
        currentStock: 0,
        thresholdStock: 15,
        priority: 'critical',
        status: 'active',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        urgency: 'urgent'
      },
      {
        id: '2',
        productId: '2',
        sku: 'BUL-002',
        name: 'Bulldozer Parts',
        warehouse: 'Warehouse B',
        alertType: 'low_stock',
        currentStock: 23,
        thresholdStock: 25,
        priority: 'high',
        status: 'active',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        urgency: 'normal'
      }
    ];

    const mockWarehouseLocations: WarehouseLocation[] = [
      {
        id: '1',
        name: 'Warehouse A',
        zone: 'A1',
        shelf: '01',
        bin: 'A',
        gpsCoordinates: { latitude: -6.2088, longitude: 106.8456 },
        items: 15
      },
      {
        id: '2',
        name: 'Warehouse B',
        zone: 'B2',
        shelf: '03',
        bin: 'B',
        items: 12
      },
      {
        id: '3',
        name: 'Warehouse C',
        zone: 'C1',
        shelf: '02',
        bin: 'C',
        items: 8
      },
      {
        id: '4',
        name: 'Field Site',
        zone: 'Field',
        shelf: 'Mobile',
        bin: 'GPS',
        gpsCoordinates: { latitude: -6.2088, longitude: 106.8456 },
        items: 5
      }
    ];

    setStockItems(mockStockItems);
    setAlerts(mockAlerts);
    setWarehouseLocations(mockWarehouseLocations);
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
      case 'normal': return 'bg-green-500';
      case 'low_stock': return 'bg-yellow-500';
      case 'out_of_stock': return 'bg-red-500';
      case 'overstock': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'low': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const totalItems = stockItems.length;
  const lowStockItems = stockItems.filter(item => item.status === 'low_stock').length;
  const outOfStockItems = stockItems.filter(item => item.status === 'out_of_stock').length;
  const pendingAlerts = alerts.filter(alert => alert.status === 'active').length;

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
          <h1 className="text-3xl font-bold">📦 Enhanced Inventory Management</h1>
          <p className="text-muted-foreground">Real-time stock monitoring with GPS tracking</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">Active inventory items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items below reorder point</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockItems}</div>
            <p className="text-xs text-muted-foreground">Critical stock items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reorder Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingAlerts}</div>
            <p className="text-xs text-muted-foreground">Pending alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Real-time Dashboard</TabsTrigger>
          <TabsTrigger value="alerts">Smart Alerts</TabsTrigger>
          <TabsTrigger value="locations">GPS Tracking</TabsTrigger>
          <TabsTrigger value="procurement">Procurement</TabsTrigger>
        </TabsList>

        {/* Real-time Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                📊 Real-time Stock Levels
                <Badge variant="secondary" className="ml-2">Live</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stockItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status === 'normal' && '✅'}
                        {item.status === 'low_stock' && '⚠️'}
                        {item.status === 'out_of_stock' && '❌'}
                        {item.status === 'overstock' && '📦'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Stock:</span>
                        <span className="font-medium">{item.currentStock}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Available:</span>
                        <span className="font-medium">{item.availableStock}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Location:</span>
                        <span className="font-medium">{item.warehouse}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Reorder Point: {item.reorderPoint}</span>
                        <span>Max: {item.maxStock}</span>
                      </div>
                      <Progress 
                        value={(item.availableStock / item.maxStock) * 100} 
                        className="h-2"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Order
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Smart Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                🚨 Smart Reorder Alerts
                <Badge variant="destructive" className="ml-2">
                  {alerts.filter(a => a.status === 'active').length} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`border rounded-lg p-4 space-y-2 ${alert.priority === 'critical' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'}`}>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4" />
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-semibold">
                              {alert.alertType === 'out_of_stock' ? '❌ CRITICAL' : '⚠️ WARNING'}: {alert.name}
                            </span>
                            <span className="text-sm text-muted-foreground ml-2">
                              ({alert.sku}) - {alert.warehouse}
                            </span>
                          </div>
                          <Badge className={getPriorityColor(alert.priority)}>
                            {alert.priority.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Current Stock:</span>
                            <span className="font-medium">{alert.currentStock} units</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Threshold:</span>
                            <span className="font-medium">{alert.thresholdStock} units</span>
                          </div>
                          {alert.alertType === 'out_of_stock' && (
                            <div className="text-sm text-red-600">
                              Lead Time: 14 days | Auto-reorder: ENABLED
                            </div>
                          )}
                          {alert.alertType === 'low_stock' && (
                            <div className="text-sm text-yellow-600">
                              Reorder Point: {alert.thresholdStock} units | Auto-reorder: ENABLED
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-2 pt-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Generate PO
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3 mr-1" />
                            Ignore
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GPS Tracking Tab */}
        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                📍 Location Tracking with GPS
                <Navigation className="h-4 w-4 ml-2" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {warehouseLocations.map((location) => (
                  <div key={location.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{location.name}</h3>
                      <Badge variant="secondary">{location.items} items</Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Zone:</span>
                        <span className="font-medium">{location.zone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shelf:</span>
                        <span className="font-medium">{location.shelf}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bin:</span>
                        <span className="font-medium">{location.bin}</span>
                      </div>
                      {location.gpsCoordinates && (
                        <div className="flex justify-between">
                          <span>GPS:</span>
                          <span className="font-medium text-xs">
                            {location.gpsCoordinates.latitude.toFixed(4)}, {location.gpsCoordinates.longitude.toFixed(4)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        View Map
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Procurement Tab */}
        <TabsContent value="procurement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                🛒 Enhanced Procurement Workflow
                <TrendingUp className="h-4 w-4 ml-2" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Automated Purchase Request */}
                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold flex items-center">
                    🤖 Automated Purchase Request Generation
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Product:</span>
                      <span className="font-medium">Crane Parts - Hydraulic Pump</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Stock:</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reorder Point:</span>
                      <span className="font-medium">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Stock:</span>
                      <span className="font-medium">50</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lead Time:</span>
                      <span className="font-medium">14 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Supplier:</span>
                      <span className="font-medium">Mining Supply Co.</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Cost:</span>
                      <span className="font-medium">$2,500 USD</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Generate PR
                    </Button>
                    <Button variant="outline">Modify Parameters</Button>
                    <Button variant="outline">Cancel</Button>
                  </div>
                </div>

                {/* Supplier Performance */}
                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold flex items-center">
                    ✅ Supplier Performance Tracking
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { name: 'Mining Supply Co.', rating: '⭐⭐⭐⭐⭐', onTime: 95, quality: 98, cost: 2500 },
                      { name: 'Heavy Equipment', rating: '⭐⭐⭐⭐', onTime: 88, quality: 92, cost: 2800 },
                      { name: 'Industrial Parts Ltd.', rating: '⭐⭐⭐', onTime: 82, quality: 85, cost: 2200 },
                      { name: 'Global Mining', rating: '⭐⭐⭐⭐', onTime: 90, quality: 94, cost: 2600 }
                    ].map((supplier, index) => (
                      <div key={index} className="border rounded-lg p-3 space-y-2">
                        <div className="font-medium text-sm">{supplier.name}</div>
                        <div className="text-xs">{supplier.rating}</div>
                        <div className="text-xs space-y-1">
                          <div>On-time: {supplier.onTime}%</div>
                          <div>Quality: {supplier.quality}%</div>
                          <div>Cost: ${supplier.cost}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Procurement Flow */}
                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold flex items-center">
                    🔄 Procurement → Inventory → Asset Flow
                  </h3>
                  <div className="bg-blue-50 rounded-lg p-3 space-y-2 text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="font-medium">1. Purchase Order</div>
                        <div className="text-xs text-muted-foreground">PO-2024-001</div>
                        <Badge className="bg-green-600">✅ Approved</Badge>
                      </div>
                      <div className="text-2xl">↓</div>
                      <div className="text-center">
                        <div className="font-medium">2. Goods Receipt</div>
                        <div className="text-xs text-muted-foreground">GR-2024-001</div>
                        <Badge className="bg-green-600">✅ Received</Badge>
                      </div>
                      <div className="text-2xl">↓</div>
                      <div className="text-center">
                        <div className="font-medium">3. Asset Creation</div>
                        <div className="text-xs text-muted-foreground">Asset-2024-001</div>
                        <Badge className="bg-green-600">✅ Created</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground pt-2">
                      <span>Cost: $2,500</span>
                      <span>Stock: +50</span>
                      <span>Depreciation: Setup</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        Last updated: {lastUpdated.toLocaleString()} | Real-time monitoring active
      </div>
    </div>
  );
}
