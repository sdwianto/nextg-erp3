'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  TrendingDown, 
  MapPin, 
  DollarSign,
  Settings,
  Eye,
  Plus,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface Asset {
  id: string;
  assetNumber: string;
  assetName: string;
  assetType: string;
  category: string;
  purchaseDate: string;
  purchaseCost: number;
  currentValue: number;
  depreciationRate: number;
  accumulatedDepreciation: number;
  usefulLife: number;
  location: string;
  assignedTo: string;
  status: 'active' | 'maintenance' | 'retired' | 'sold';
  gpsCoordinates?: { latitude: number; longitude: number };
  lastMaintenance: string;
  nextMaintenance: string;
}

interface AssetTransaction {
  id: string;
  assetId: string;
  transactionType: 'purchase' | 'depreciation' | 'maintenance' | 'sale' | 'transfer';
  amount: number;
  currency: string;
  transactionDate: string;
  description: string;
  referenceType?: string;
  referenceId?: string;
}

interface ProcurementToAssetFlow {
  id: string;
  poNumber: string;
  grNumber: string;
  assetNumber: string;
  productName: string;
  purchaseCost: number;
  currentValue: number;
  depreciationRate: number;
  status: 'completed' | 'in_progress' | 'pending';
  created_at: string;
}

export default function EnhancedAssetIntegration() {

  // Mock data
  const assets: Asset[] = [
    {
      id: '1',
      assetNumber: 'AST-2024-001',
      assetName: 'Excavator XL-2000',
      assetType: 'Heavy Equipment',
      category: 'Excavators',
      purchaseDate: '2024-01-15',
      purchaseCost: 250000,
      currentValue: 200000,
      depreciationRate: 20,
      accumulatedDepreciation: 50000,
      usefulLife: 5,
      location: 'Warehouse A - Zone A1',
      assignedTo: 'John Smith',
      status: 'active',
      gpsCoordinates: { latitude: -6.2088, longitude: 106.8456 },
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-02-10'
    },
    {
      id: '2',
      assetNumber: 'AST-2024-002',
      assetName: 'Bulldozer BD-1500',
      assetType: 'Heavy Equipment',
      category: 'Bulldozers',
      purchaseDate: '2024-01-20',
      purchaseCost: 180000,
      currentValue: 144000,
      depreciationRate: 20,
      accumulatedDepreciation: 36000,
      usefulLife: 5,
      location: 'Warehouse B - Zone B2',
      assignedTo: 'Sarah Johnson',
      status: 'maintenance',
      lastMaintenance: '2024-01-25',
      nextMaintenance: '2024-02-25'
    },
    {
      id: '3',
      assetNumber: 'AST-2024-003',
      assetName: 'Crane Tower CT-300',
      assetType: 'Lifting Equipment',
      category: 'Cranes',
      purchaseDate: '2024-01-25',
      purchaseCost: 320000,
      currentValue: 256000,
      depreciationRate: 20,
      accumulatedDepreciation: 64000,
      usefulLife: 5,
      location: 'Warehouse A - Zone A1',
      assignedTo: 'Mike Brown',
      status: 'active',
      lastMaintenance: '2024-01-28',
      nextMaintenance: '2024-02-28'
    }
  ];

  const assetTransactions: AssetTransaction[] = [
    {
      id: '1',
      assetId: '1',
      transactionType: 'purchase',
      amount: 250000,
      currency: 'USD',
      transactionDate: '2024-01-15',
      description: 'Initial purchase from Mining Supply Co.',
      referenceType: 'purchase_order',
      referenceId: 'PO-2024-001'
    },
    {
      id: '2',
      assetId: '1',
      transactionType: 'depreciation',
      amount: 50000,
      currency: 'USD',
      transactionDate: '2024-01-31',
      description: 'Monthly depreciation (20% annual rate)'
    },
    {
      id: '3',
      assetId: '1',
      transactionType: 'maintenance',
      amount: 5000,
      currency: 'USD',
      transactionDate: '2024-01-10',
      description: 'Routine maintenance and inspection'
    }
  ];

  const procurementToAssetFlow: ProcurementToAssetFlow[] = [
    {
      id: '1',
      poNumber: 'PO-2024-001',
      grNumber: 'GR-2024-001',
      assetNumber: 'AST-2024-001',
      productName: 'Excavator XL-2000',
      purchaseCost: 250000,
      currentValue: 200000,
      depreciationRate: 20,
      status: 'completed',
      created_at: '2024-01-15'
    },
    {
      id: '2',
      poNumber: 'PO-2024-002',
      grNumber: 'GR-2024-002',
      assetNumber: 'AST-2024-002',
      productName: 'Bulldozer BD-1500',
      purchaseCost: 180000,
      currentValue: 144000,
      depreciationRate: 20,
      status: 'completed',
      created_at: '2024-01-20'
    },
    {
      id: '3',
      poNumber: 'PO-2024-003',
      grNumber: 'GR-2024-003',
      assetNumber: 'AST-2024-003',
      productName: 'Crane Tower CT-300',
      purchaseCost: 320000,
      currentValue: 256000,
      depreciationRate: 20,
      status: 'completed',
      created_at: '2024-01-25'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'maintenance': return 'bg-yellow-600';
      case 'retired': return 'bg-red-600';
      case 'sold': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'purchase': return 'bg-blue-600';
      case 'depreciation': return 'bg-orange-600';
      case 'maintenance': return 'bg-yellow-600';
      case 'sale': return 'bg-green-600';
      case 'transfer': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const calculateDepreciationProgress = (asset: Asset) => {
    const totalDepreciation = asset.purchaseCost - asset.currentValue;
    const totalExpectedDepreciation = asset.purchaseCost * (asset.depreciationRate / 100);
    return (totalDepreciation / totalExpectedDepreciation) * 100;
  };

  const totalAssets = assets.length;
  const activeAssets = assets.filter(asset => asset.status === 'active').length;
  const maintenanceAssets = assets.filter(asset => asset.status === 'maintenance').length;
  const totalAssetValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🏗️ Enhanced Asset Integration</h1>
          <p className="text-muted-foreground">Automatic asset creation from procurement, lifecycle tracking, and depreciation management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Asset
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssets}</div>
            <p className="text-xs text-muted-foreground">Registered assets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeAssets}</div>
            <p className="text-xs text-muted-foreground">In operation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Maintenance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{maintenanceAssets}</div>
            <p className="text-xs text-muted-foreground">Scheduled maintenance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Asset Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAssetValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current market value</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Management */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                🏗️ Asset Lifecycle Management
                <Badge variant="secondary" className="ml-2">{assets.length} Assets</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assets.map((asset) => (
                  <div key={asset.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{asset.assetName}</h3>
                        <p className="text-sm text-muted-foreground">{asset.assetNumber} - {asset.assetType}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(asset.status)}>
                          {asset.status.toUpperCase()}
                        </Badge>
                        {asset.gpsCoordinates && (
                          <Badge variant="outline" className="text-xs">
                            <MapPin className="h-3 w-3 mr-1" />
                            GPS Tracked
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Purchase Cost:</span>
                        <div className="font-medium">${asset.purchaseCost.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Current Value:</span>
                        <div className="font-medium">${asset.currentValue.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Depreciation:</span>
                        <div className="font-medium">${asset.accumulatedDepreciation.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Assigned To:</span>
                        <div className="font-medium">{asset.assignedTo}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Depreciation Progress:</span>
                        <span className="font-medium">{calculateDepreciationProgress(asset).toFixed(1)}%</span>
                      </div>
                      <Progress value={calculateDepreciationProgress(asset)} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Rate: {asset.depreciationRate}% annually</span>
                        <span>Useful Life: {asset.usefulLife} years</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Location:</span>
                        <div className="font-medium">{asset.location}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Maintenance:</span>
                        <div className="font-medium">{asset.lastMaintenance}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Next Maintenance:</span>
                        <div className="font-medium">{asset.nextMaintenance}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Purchase Date:</span>
                        <div className="font-medium">{asset.purchaseDate}</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="h-3 w-3 mr-1" />
                        Maintenance
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        Track Location
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Asset Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                📊 Asset Transaction History
                <Badge variant="secondary" className="ml-2">{assetTransactions.length} Transactions</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assetTransactions.map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{transaction.description}</h4>
                        <p className="text-xs text-muted-foreground">{transaction.transactionDate}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getTransactionTypeColor(transaction.transactionType)}>
                          {transaction.transactionType.toUpperCase()}
                        </Badge>
                        <span className="font-medium">${transaction.amount.toLocaleString()} {transaction.currency}</span>
                      </div>
                    </div>
                    {transaction.referenceType && (
                      <div className="text-xs text-muted-foreground">
                        Reference: {transaction.referenceType} - {transaction.referenceId}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Procurement to Asset Flow */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                🔄 Procurement → Asset Flow
                <Badge variant="secondary" className="ml-2">{procurementToAssetFlow.length} Flows</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {procurementToAssetFlow.map((flow) => (
                  <div key={flow.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{flow.assetNumber}</h4>
                      <Badge className="bg-green-600 text-xs">✅ {flow.status}</Badge>
                    </div>
                    
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Product:</span>
                        <span className="font-medium">{flow.productName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PO:</span>
                        <span className="font-medium">{flow.poNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GR:</span>
                        <span className="font-medium">{flow.grNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Purchase Cost:</span>
                        <span className="font-medium">${flow.purchaseCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Value:</span>
                        <span className="font-medium">${flow.currentValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Depreciation Rate:</span>
                        <span className="font-medium">{flow.depreciationRate}%</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View Asset
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        Depreciation
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Asset Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                📈 Asset Summary
                <DollarSign className="h-4 w-4 ml-2" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Asset Categories:</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Heavy Equipment:</span>
                      <span className="font-medium">2 assets</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lifting Equipment:</span>
                      <span className="font-medium">1 asset</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Value Distribution:</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Total Purchase Value:</span>
                      <span className="font-medium">$750,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Current Value:</span>
                      <span className="font-medium">$600,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Depreciation:</span>
                      <span className="font-medium">$150,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Depreciation Rate:</span>
                      <span className="font-medium">20% annually</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Maintenance Schedule:</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Due This Month:</span>
                      <span className="font-medium text-yellow-600">2 assets</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Month:</span>
                      <span className="font-medium">1 asset</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overdue:</span>
                      <span className="font-medium text-red-600">0 assets</span>
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
