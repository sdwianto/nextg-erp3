'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { 
  ShoppingCart, 
  Truck, 
  CheckCircle, 
  Star, 
  MapPin,
  Plus,
  Eye,
  Settings,
  TrendingUp,
  Package
} from 'lucide-react';

interface PurchaseRequest {
  id: string;
  prNumber: string;
  productName: string;
  sku: string;
  quantity: number;
  estimatedCost: number;
  currency: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  supplier: string;
  leadTime: number;
  created_at: string;
}

interface Supplier {
  id: string;
  name: string;
  code: string;
  rating: string;
  onTimeDelivery: number;
  qualityRating: number;
  costCompetitiveness: number;
  totalSpend: number;
  lastEvaluation: string;
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  orderDate: string;
  expectedDelivery: string;
  totalAmount: number;
  currency: string;
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  items: PurchaseOrderItem[];
}

interface PurchaseOrderItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  isAsset: boolean;
}

interface GoodsReceipt {
  id: string;
  grNumber: string;
  poNumber: string;
  receiptDate: string;
  warehouse: string;
  qualityCheckStatus: 'pending' | 'passed' | 'failed';
  gpsCoordinates?: { latitude: number; longitude: number };
  items: GoodsReceiptItem[];
}

interface GoodsReceiptItem {
  id: string;
  productName: string;
  sku: string;
  quantityReceived: number;
  quantityAccepted: number;
  quantityRejected: number;
  unitCost: number;
  totalCost: number;
}

export default function EnhancedProcurementWorkflow() {

  // Mock data
  const purchaseRequests: PurchaseRequest[] = [
    {
      id: '1',
      prNumber: 'PR-2024-001',
      productName: 'Crane Parts - Hydraulic Pump',
      sku: 'CRN-HP-001',
      quantity: 5,
      estimatedCost: 2500,
      currency: 'USD',
      priority: 'critical',
      status: 'approved',
      supplier: 'Mining Supply Co.',
      leadTime: 14,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      prNumber: 'PR-2024-002',
      productName: 'Bulldozer Parts - Track Assembly',
      sku: 'BUL-TA-002',
      quantity: 2,
      estimatedCost: 1800,
      currency: 'USD',
      priority: 'high',
      status: 'pending',
      supplier: 'Heavy Equipment Ltd.',
      leadTime: 21,
      created_at: new Date().toISOString()
    }
  ];

  const suppliers: Supplier[] = [
    {
      id: '1',
      name: 'Mining Supply Co.',
      code: 'MSC',
      rating: '⭐⭐⭐⭐⭐',
      onTimeDelivery: 95,
      qualityRating: 98,
      costCompetitiveness: 92,
      totalSpend: 125000,
      lastEvaluation: '2024-01-15'
    },
    {
      id: '2',
      name: 'Heavy Equipment Ltd.',
      code: 'HEL',
      rating: '⭐⭐⭐⭐',
      onTimeDelivery: 88,
      qualityRating: 92,
      costCompetitiveness: 85,
      totalSpend: 89000,
      lastEvaluation: '2024-01-10'
    },
    {
      id: '3',
      name: 'Industrial Parts Ltd.',
      code: 'IPL',
      rating: '⭐⭐⭐',
      onTimeDelivery: 82,
      qualityRating: 85,
      costCompetitiveness: 95,
      totalSpend: 67000,
      lastEvaluation: '2024-01-08'
    },
    {
      id: '4',
      name: 'Global Mining Supply',
      code: 'GMS',
      rating: '⭐⭐⭐⭐',
      onTimeDelivery: 90,
      qualityRating: 94,
      costCompetitiveness: 88,
      totalSpend: 156000,
      lastEvaluation: '2024-01-12'
    }
  ];

  const purchaseOrders: PurchaseOrder[] = [
    {
      id: '1',
      poNumber: 'PO-2024-001',
      supplierName: 'Mining Supply Co.',
      orderDate: '2024-01-15',
      expectedDelivery: '2024-01-29',
      totalAmount: 2500,
      currency: 'USD',
      status: 'confirmed',
      items: [
        {
          id: '1',
          productName: 'Crane Parts - Hydraulic Pump',
          sku: 'CRN-HP-001',
          quantity: 5,
          unitCost: 500,
          totalCost: 2500,
          isAsset: true
        }
      ]
    }
  ];

  const goodsReceipts: GoodsReceipt[] = [
    {
      id: '1',
      grNumber: 'GR-2024-001',
      poNumber: 'PO-2024-001',
      receiptDate: '2024-01-29',
      warehouse: 'Warehouse A',
      qualityCheckStatus: 'passed',
      gpsCoordinates: { latitude: -6.2088, longitude: 106.8456 },
      items: [
        {
          id: '1',
          productName: 'Crane Parts - Hydraulic Pump',
          sku: 'CRN-HP-001',
          quantityReceived: 5,
          quantityAccepted: 5,
          quantityRejected: 0,
          unitCost: 500,
          totalCost: 2500
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-600';
      case 'pending': return 'bg-yellow-600';
      case 'rejected': return 'bg-red-600';
      case 'draft': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🛒 Enhanced Procurement Workflow</h1>
          <p className="text-muted-foreground">Automated purchase requests, supplier performance tracking, and GPS-enabled goods receipt</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Purchase Request
        </Button>
      </div>

      {/* Main Content Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Purchase Requests */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                🤖 Automated Purchase Request Generation
                <Badge variant="secondary" className="ml-2">{purchaseRequests.length} Requests</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchaseRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{request.productName}</h3>
                        <p className="text-sm text-muted-foreground">{request.sku} - {request.prNumber}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Quantity:</span>
                        <div className="font-medium">{request.quantity} units</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Estimated Cost:</span>
                        <div className="font-medium">${request.estimatedCost} {request.currency}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Supplier:</span>
                        <div className="font-medium">{request.supplier}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Lead Time:</span>
                        <div className="font-medium">{request.leadTime} days</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
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
                        Modify
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Purchase Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                📋 Purchase Orders
                <Badge variant="secondary" className="ml-2">{purchaseOrders.length} Orders</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchaseOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{order.poNumber}</h3>
                        <p className="text-sm text-muted-foreground">{order.supplierName}</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Order Date:</span>
                        <div className="font-medium">{order.orderDate}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expected Delivery:</span>
                        <div className="font-medium">{order.expectedDelivery}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Amount:</span>
                        <div className="font-medium">${order.totalAmount} {order.currency}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Items:</span>
                        <div className="font-medium">{order.items.length} items</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Order Items:</h4>
                      {order.items.map((item) => (
                        <div key={item.id} className="bg-gray-50 rounded p-2 text-sm">
                          <div className="flex justify-between">
                            <span>{item.productName} ({item.sku})</span>
                            <span className="font-medium">${item.totalCost}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Qty: {item.quantity} × ${item.unitCost}</span>
                            {item.isAsset && <Badge variant="outline" className="text-xs">Asset</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Truck className="h-3 w-3 mr-1" />
                        Track Delivery
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Goods Receipt */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                📦 Goods Receipt with GPS Tracking
                <MapPin className="h-4 w-4 ml-2" />
                <Badge variant="secondary" className="ml-2">{goodsReceipts.length} Receipts</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goodsReceipts.map((receipt) => (
                  <div key={receipt.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{receipt.grNumber}</h3>
                        <p className="text-sm text-muted-foreground">PO: {receipt.poNumber} - {receipt.warehouse}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={receipt.qualityCheckStatus === 'passed' ? 'bg-green-600' : 'bg-yellow-600'}>
                          {receipt.qualityCheckStatus.toUpperCase()}
                        </Badge>
                        {receipt.gpsCoordinates && (
                          <Badge variant="outline" className="text-xs">
                            <MapPin className="h-3 w-3 mr-1" />
                            GPS Tracked
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Receipt Date:</span>
                        <div className="font-medium">{receipt.receiptDate}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Warehouse:</span>
                        <div className="font-medium">{receipt.warehouse}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Quality Check:</span>
                        <div className="font-medium">{receipt.qualityCheckStatus}</div>
                      </div>
                      {receipt.gpsCoordinates && (
                        <div>
                          <span className="text-muted-foreground">GPS Location:</span>
                          <div className="font-medium text-xs">
                            {receipt.gpsCoordinates.latitude.toFixed(4)}, {receipt.gpsCoordinates.longitude.toFixed(4)}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Received Items:</h4>
                      {receipt.items.map((item) => (
                        <div key={item.id} className="bg-gray-50 rounded p-2 text-sm">
                          <div className="flex justify-between">
                            <span>{item.productName} ({item.sku})</span>
                            <span className="font-medium">${item.totalCost}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Received: {item.quantityReceived} | Accepted: {item.quantityAccepted} | Rejected: {item.quantityRejected}</span>
                            <span>${item.unitCost}/unit</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Accept All
                      </Button>
                      <Button size="sm" variant="outline">
                        <MapPin className="h-3 w-3 mr-1" />
                        View Map
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Supplier Performance Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                ✅ Supplier Performance Tracking
                <Star className="h-4 w-4 ml-2" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suppliers.map((supplier) => (
                  <div key={supplier.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">{supplier.name}</h3>
                      <span className="text-xs">{supplier.rating}</span>
                    </div>
                    
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>On-time Delivery:</span>
                        <span className="font-medium">{supplier.onTimeDelivery}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quality Rating:</span>
                        <span className="font-medium">{supplier.qualityRating}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cost Competitiveness:</span>
                        <span className="font-medium">{supplier.costCompetitiveness}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Spend:</span>
                        <span className="font-medium">${supplier.totalSpend.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        History
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Procurement Flow Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                🔄 Procurement → Inventory → Asset Flow
                <Package className="h-4 w-4 ml-2" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="font-medium">1. Purchase Order</div>
                      <div className="text-xs text-muted-foreground">PO-2024-001</div>
                      <Badge className="bg-green-600 text-xs">✅ Approved</Badge>
                    </div>
                    <div className="text-2xl">↓</div>
                    <div className="text-center">
                      <div className="font-medium">2. Goods Receipt</div>
                      <div className="text-xs text-muted-foreground">GR-2024-001</div>
                      <Badge className="bg-green-600 text-xs">✅ Received</Badge>
                    </div>
                    <div className="text-2xl">↓</div>
                    <div className="text-center">
                      <div className="font-medium">3. Asset Creation</div>
                      <div className="text-xs text-muted-foreground">Asset-2024-001</div>
                      <Badge className="bg-green-600 text-xs">✅ Created</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground pt-2">
                    <span>Cost: $2,500</span>
                    <span>Stock: +50</span>
                    <span>Depreciation: Setup</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Flow Statistics:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span>Total POs:</span>
                      <span className="font-medium">{purchaseOrders.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Receipts:</span>
                      <span className="font-medium">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Assets Created:</span>
                      <span className="font-medium">15</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Value:</span>
                      <span className="font-medium">$45,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
