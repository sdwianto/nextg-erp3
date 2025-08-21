//src/components/EnhancedAssetIntegration.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Building2, 
  TrendingDown, 
  MapPin, 
  DollarSign,
  Settings,
  Eye,
  Plus,
  RefreshCw,
  CheckCircle,
  Download,
  Filter,
  Calendar,
  Truck,
  Package,
  Clock
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
  status: 'active' | 'maintenance' | 'retired' | 'sold' | 'rented';
  gpsCoordinates?: { latitude: number; longitude: number };
  lastMaintenance: string;
  nextMaintenance: string;
  // Integration fields
  sourceDocument?: string; // PO Number
  sourceType?: 'procurement' | 'direct';
  rentalStatus?: 'available' | 'rented' | 'maintenance';
  rentalRate?: number;
  currentRental?: string;
}

interface AssetTransaction {
  id: string;
  assetId: string;
  transactionType: 'purchase' | 'depreciation' | 'maintenance' | 'sale' | 'transfer' | 'rental';
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

interface RentalContract {
  id: string;
  assetId: string;
  assetNumber: string;
  assetName: string;
  customerName: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
  dailyRate: number;
  totalAmount: number;
  deposit: number;
  location: string;
  notes?: string;
}

export default function EnhancedAssetIntegration() {
  // Dialog states
  const [isNewAssetOpen, setIsNewAssetOpen] = useState(false);
  const [isViewAssetOpen, setIsViewAssetOpen] = useState(false);
  const [isEditAssetOpen, setIsEditAssetOpen] = useState(false);
  const [isDeleteAssetOpen, setIsDeleteAssetOpen] = useState(false);
  const [isAssetTransactionOpen, setIsAssetTransactionOpen] = useState(false);
  const [isDepreciationReportOpen, setIsDepreciationReportOpen] = useState(false);
  const [isLocationTrackingOpen, setIsLocationTrackingOpen] = useState(false);
  const [isMaintenanceScheduleOpen, setIsMaintenanceScheduleOpen] = useState(false);
  const [isAssetTransferOpen, setIsAssetTransferOpen] = useState(false);
  const [isExportReportOpen, setIsExportReportOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isRentAssetOpen, setIsRentAssetOpen] = useState(false);
  const [isViewRentalOpen, setIsViewRentalOpen] = useState(false);
  
  // Selected item state
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  // const [selectedTransaction, setSelectedTransaction] = useState<AssetTransaction | null>(null);
  const [selectedRental, setSelectedRental] = useState<RentalContract | null>(null);

  // Form states
  const [newAssetForm, setNewAssetForm] = useState({
    assetName: '',
    assetType: '',
    category: '',
    purchaseCost: '',
    usefulLife: '',
    location: '',
    assignedTo: '',
    description: ''
  });

  const [editAssetForm, setEditAssetForm] = useState({
    assetName: '',
    assetType: '',
    category: '',
    location: '',
    assignedTo: '',
    status: 'active' as 'active' | 'maintenance' | 'retired' | 'sold' | 'rented',
    description: ''
  });

  const [transactionForm, setTransactionForm] = useState({
    transactionType: 'maintenance' as 'purchase' | 'depreciation' | 'maintenance' | 'sale' | 'transfer' | 'rental',
    amount: '',
    description: '',
    referenceType: '',
    referenceId: ''
  });

  const [rentalForm, setRentalForm] = useState({
    customerName: '',
    startDate: '',
    endDate: '',
    dailyRate: '',
    deposit: '',
    location: '',
    notes: ''
  });

  // Mock data for demonstration
  const assets: Asset[] = [
    {
      id: '1',
      assetNumber: 'AST-2024-001',
      assetName: 'Excavator PC200',
      assetType: 'Heavy Equipment',
      category: 'Construction',
      purchaseDate: '2024-01-15',
      purchaseCost: 250000000,
      currentValue: 200000000,
      depreciationRate: 20,
      accumulatedDepreciation: 50000000,
      usefulLife: 5,
      location: 'Site A',
      assignedTo: 'John Smith',
      status: 'active',
      gpsCoordinates: { latitude: -6.2088, longitude: 106.8456 },
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-04-10',
      sourceDocument: 'PO-2024-001',
      sourceType: 'procurement',
      rentalStatus: 'available',
      rentalRate: 5000000
    },
    {
      id: '2',
      assetNumber: 'AST-2024-002',
      assetName: 'Crane 50T',
      assetType: 'Heavy Equipment',
      category: 'Construction',
      purchaseDate: '2024-01-20',
      purchaseCost: 350000000,
      currentValue: 315000000,
      depreciationRate: 10,
      accumulatedDepreciation: 35000000,
      usefulLife: 10,
      location: 'Site B',
      assignedTo: 'Mike Johnson',
      status: 'maintenance',
      lastMaintenance: '2024-01-25',
      nextMaintenance: '2024-04-25',
      sourceDocument: 'PO-2024-002',
      sourceType: 'procurement',
      rentalStatus: 'maintenance',
      rentalRate: 7500000
    },
    {
      id: '3',
      assetNumber: 'AST-2024-003',
      assetName: 'Forklift 3T',
      assetType: 'Material Handling',
      category: 'Warehouse',
      purchaseDate: '2024-02-01',
      purchaseCost: 75000000,
      currentValue: 67500000,
      depreciationRate: 15,
      accumulatedDepreciation: 7500000,
      usefulLife: 7,
      location: 'Warehouse',
      assignedTo: 'Sarah Brown',
      status: 'rented',
      lastMaintenance: '2024-02-05',
      nextMaintenance: '2024-05-05',
      sourceDocument: 'PO-2024-003',
      sourceType: 'procurement',
      rentalStatus: 'rented',
      rentalRate: 1500000,
      currentRental: 'RC-2024-001'
    }
  ];

  // Load assets from localStorage (created from procurement workflow)
  const [procurementAssets, setProcurementAssets] = useState<Asset[]>([]);
  const [rentalContracts, setRentalContracts] = useState<RentalContract[]>([]);

  useEffect(() => {
    // Load assets created from procurement workflow
    const storedAssets = localStorage.getItem('procurementAssets');
    if (storedAssets) {
      try {
        const parsedAssets = JSON.parse(storedAssets);
        setProcurementAssets(parsedAssets);
      } catch {
        // Error parsing procurement assets
      }
    }

    // Load rental contracts
    const storedRentals = localStorage.getItem('assetRentalContracts');
    if (storedRentals) {
      try {
        const parsedRentals = JSON.parse(storedRentals);
        setRentalContracts(parsedRentals);
      } catch {
        // Error parsing rental contracts
      }
    }
  }, []);

  // Combine assets from both sources
  const allAssets = [...assets, ...procurementAssets];

  const assetTransactions: AssetTransaction[] = [
    {
      id: '1',
      assetId: '1',
      transactionType: 'purchase',
      amount: 250000000,
      currency: 'IDR',
      transactionDate: '2024-01-15',
      description: 'Initial purchase of Excavator PC200',
      referenceType: 'PO',
      referenceId: 'PO-2024-001'
    },
    {
      id: '2',
      assetId: '1',
      transactionType: 'maintenance',
      amount: 5000000,
      currency: 'IDR',
      transactionDate: '2024-01-10',
      description: 'Regular preventive maintenance',
      referenceType: 'WO',
      referenceId: 'WO-2024-001'
    },
    {
      id: '3',
      assetId: '2',
      transactionType: 'purchase',
      amount: 350000000,
      currency: 'IDR',
      transactionDate: '2024-01-20',
      description: 'Initial purchase of Crane 50T',
      referenceType: 'PO',
      referenceId: 'PO-2024-002'
    },
    {
      id: '4',
      assetId: '3',
      transactionType: 'rental',
      amount: 15000000,
      currency: 'IDR',
      transactionDate: '2024-02-15',
      description: 'Rental income for Forklift 3T',
      referenceType: 'RC',
      referenceId: 'RC-2024-001'
    }
  ];

  const procurementToAssetFlow: ProcurementToAssetFlow[] = [
    {
      id: '1',
      poNumber: 'PO-2024-001',
      grNumber: 'GR-2024-001',
      assetNumber: 'AST-2024-001',
      productName: 'Excavator PC200',
      purchaseCost: 250000000,
      currentValue: 200000000,
      depreciationRate: 20,
      status: 'completed',
      created_at: '2024-01-15'
    },
    {
      id: '2',
      poNumber: 'PO-2024-002',
      grNumber: 'GR-2024-002',
      assetNumber: 'AST-2024-002',
      productName: 'Crane 50T',
      purchaseCost: 350000000,
      currentValue: 315000000,
      depreciationRate: 10,
      status: 'completed',
      created_at: '2024-01-20'
    }
  ];

  // Handler functions
  const handleNewAsset = () => {
    setIsNewAssetOpen(true);
  };

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsViewAssetOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setEditAssetForm({
      assetName: asset.assetName,
      assetType: asset.assetType,
      category: asset.category,
      location: asset.location,
      assignedTo: asset.assignedTo,
      status: asset.status,
      description: ''
    });
    setIsEditAssetOpen(true);
  };

  const handleDeleteAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDeleteAssetOpen(true);
  };

  const handleAssetTransaction = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsAssetTransactionOpen(true);
  };

  const handleDepreciationReport = () => {
    setIsDepreciationReportOpen(true);
  };

  const handleLocationTracking = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsLocationTrackingOpen(true);
  };

  const handleMaintenanceSchedule = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsMaintenanceScheduleOpen(true);
  };

  const handleAssetTransfer = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsAssetTransferOpen(true);
  };

  const handleExportReport = () => {
    setIsExportReportOpen(true);
  };

  const handleFilter = () => {
    setIsFilterOpen(true);
  };

  const handleRefresh = () => {
    // Refresh data logic
  };

  // Rental functions
  const handleRentAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setRentalForm({
      customerName: '',
      startDate: '',
      endDate: '',
      dailyRate: asset.rentalRate?.toString() || '',
      deposit: '',
      location: asset.location,
      notes: ''
    });
    setIsRentAssetOpen(true);
  };

  const handleViewRental = (asset: Asset) => {
    const rental = rentalContracts.find(r => r.assetId === asset.id);
    if (rental) {
      setSelectedRental(rental);
      setIsViewRentalOpen(true);
    }
  };

  const handleCreateRental = () => {
    if (!selectedAsset) return;

    const newRental: RentalContract = {
      id: `RC-${Date.now()}`,
      assetId: selectedAsset.id,
      assetNumber: selectedAsset.assetNumber,
      assetName: selectedAsset.assetName,
      customerName: rentalForm.customerName,
      startDate: rentalForm.startDate,
      endDate: rentalForm.endDate,
      status: 'active',
      dailyRate: parseFloat(rentalForm.dailyRate) || 0,
      totalAmount: parseFloat(rentalForm.dailyRate) * 30, // 30 days example
      deposit: parseFloat(rentalForm.deposit) || 0,
      location: rentalForm.location,
      notes: rentalForm.notes
    };

    const updatedRentals = [...rentalContracts, newRental];
    setRentalContracts(updatedRentals);
    localStorage.setItem('assetRentalContracts', JSON.stringify(updatedRentals));

    // Update asset status
    setProcurementAssets(prev =>
      prev.map(asset =>
        asset.id === selectedAsset.id
          ? { ...asset, status: 'rented' as const, rentalStatus: 'rented', currentRental: newRental.id }
          : asset
      )
    );

    setIsRentAssetOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'maintenance': return 'bg-yellow-600';
      case 'retired': return 'bg-red-600';
      case 'sold': return 'bg-gray-600';
      case 'rented': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const getRentalStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'purchase': return 'bg-blue-600';
      case 'depreciation': return 'bg-orange-600';
      case 'maintenance': return 'bg-yellow-600';
      case 'sale': return 'bg-green-600';
      case 'transfer': return 'bg-purple-600';
      case 'rental': return 'bg-indigo-600';
      default: return 'bg-gray-600';
    }
  };

  const calculateDepreciationProgress = (asset: Asset) => {
    const totalDepreciation = asset.purchaseCost - asset.currentValue;
    const totalExpectedDepreciation = asset.purchaseCost * (asset.depreciationRate / 100);
    return (totalDepreciation / totalExpectedDepreciation) * 100;
  };

  const totalAssets = allAssets.length;
  const activeAssets = allAssets.filter(asset => asset.status === 'active').length;
  const rentedAssets = allAssets.filter(asset => asset.status === 'rented').length;
  const totalAssetValue = allAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const procurementAssetsCount = allAssets.filter(asset => asset.sourceType === 'procurement').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🏗️ Enhanced Asset Integration</h1>
          <p className="text-muted-foreground">Automatic asset creation from procurement, lifecycle tracking, and rental management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleFilter}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleDepreciationReport}>
            <TrendingDown className="h-4 w-4 mr-2" />
            Depreciation
          </Button>
          <Button size="sm" onClick={handleNewAsset}>
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
            <p className="text-xs text-muted-foreground">
              {procurementAssetsCount} from procurement
            </p>
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
            <CardTitle className="text-sm font-medium">Rented Assets</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{rentedAssets}</div>
            <p className="text-xs text-muted-foreground">Currently rented</p>
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
                <Badge variant="secondary" className="ml-2">{allAssets.length} Assets</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allAssets.map((asset) => (
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
                        {asset.rentalStatus && (
                          <Badge variant="outline" className="text-xs">
                            <Truck className="h-3 w-3 mr-1" />
                            {asset.rentalStatus.toUpperCase()}
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
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleViewAsset(asset)}>
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEditAsset(asset)}>
                        <Settings className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleAssetTransaction(asset)}>
                        <DollarSign className="h-3 w-3 mr-1" />
                        Transaction
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleAssetTransfer(asset)}>
                        <Truck className="h-3 w-3 mr-1" />
                        Transfer
                      </Button>
                      <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleDeleteAsset(asset)}>
                        <Settings className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleMaintenanceSchedule(asset)}>
                        <Settings className="h-3 w-3 mr-1" />
                        Maintenance
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleLocationTracking(asset)}>
                        <MapPin className="h-3 w-3 mr-1" />
                        Track Location
                      </Button>
                      {asset.rentalStatus === 'available' && (
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleRentAsset(asset)}>
                          <Package className="h-3 w-3 mr-1" />
                          Rent Asset
                        </Button>
                      )}
                      {asset.rentalStatus === 'rented' && (
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleViewRental(asset)}>
                          <Clock className="h-3 w-3 mr-1" />
                          View Rental
                        </Button>
                      )}
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
                      <span className="font-medium">0 assets</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lifting Equipment:</span>
                      <span className="font-medium">0 assets</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Value Distribution:</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Total Purchase Value:</span>
                                              <span className="font-medium">$0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Current Value:</span>
                      <span className="font-medium">$0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Depreciation:</span>
                      <span className="font-medium">$0</span>
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
                      <span className="font-medium text-yellow-600">0 assets</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Month:</span>
                      <span className="font-medium">0 assets</span>
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

      {/* Dialog Modals */}
      
      {/* New Asset Dialog */}
      <Dialog open={isNewAssetOpen} onOpenChange={setIsNewAssetOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Asset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assetName">Asset Name</Label>
                <Input
                  id="assetName"
                  value={newAssetForm.assetName}
                  onChange={(e) => setNewAssetForm({...newAssetForm, assetName: e.target.value})}
                  placeholder="Enter asset name"
                />
              </div>
              <div>
                <Label htmlFor="assetType">Asset Type</Label>
                <Select value={newAssetForm.assetType} onValueChange={(value) => setNewAssetForm({...newAssetForm, assetType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Heavy Equipment">Heavy Equipment</SelectItem>
                    <SelectItem value="Material Handling">Material Handling</SelectItem>
                    <SelectItem value="Office Equipment">Office Equipment</SelectItem>
                    <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newAssetForm.category} onValueChange={(value) => setNewAssetForm({...newAssetForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Construction">Construction</SelectItem>
                    <SelectItem value="Warehouse">Warehouse</SelectItem>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="purchaseCost">Purchase Cost</Label>
                <Input
                  id="purchaseCost"
                  type="number"
                  value={newAssetForm.purchaseCost}
                  onChange={(e) => setNewAssetForm({...newAssetForm, purchaseCost: e.target.value})}
                  placeholder="Enter purchase cost"
                />
              </div>
              <div>
                <Label htmlFor="usefulLife">Useful Life (years)</Label>
                <Input
                  id="usefulLife"
                  type="number"
                  value={newAssetForm.usefulLife}
                  onChange={(e) => setNewAssetForm({...newAssetForm, usefulLife: e.target.value})}
                  placeholder="Enter useful life"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newAssetForm.location}
                  onChange={(e) => setNewAssetForm({...newAssetForm, location: e.target.value})}
                  placeholder="Enter location"
                />
              </div>
              <div>
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Input
                  id="assignedTo"
                  value={newAssetForm.assignedTo}
                  onChange={(e) => setNewAssetForm({...newAssetForm, assignedTo: e.target.value})}
                  placeholder="Enter assigned person"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newAssetForm.description}
                onChange={(e) => setNewAssetForm({...newAssetForm, description: e.target.value})}
                placeholder="Enter asset description"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsNewAssetOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setIsNewAssetOpen(false);
              }}>
                Create Asset
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Asset Dialog */}
      <Dialog open={isViewAssetOpen} onOpenChange={setIsViewAssetOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Asset Number</Label>
                  <p className="text-sm">{selectedAsset.assetNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Asset Name</Label>
                  <p className="text-sm">{selectedAsset.assetName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Asset Type</Label>
                  <p className="text-sm">{selectedAsset.assetType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="text-sm">{selectedAsset.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Purchase Date</Label>
                  <p className="text-sm">{selectedAsset.purchaseDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Purchase Cost</Label>
                  <p className="text-sm">${selectedAsset.purchaseCost.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Current Value</Label>
                  <p className="text-sm">${selectedAsset.currentValue.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Depreciation Rate</Label>
                  <p className="text-sm">{selectedAsset.depreciationRate}%</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-sm">{selectedAsset.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Assigned To</Label>
                  <p className="text-sm">{selectedAsset.assignedTo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedAsset.status)}>
                    {selectedAsset.status.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Maintenance</Label>
                  <p className="text-sm">{selectedAsset.lastMaintenance}</p>
                </div>
              </div>
              {selectedAsset.gpsCoordinates && (
                <div>
                  <Label className="text-sm font-medium">GPS Coordinates</Label>
                  <p className="text-sm">{selectedAsset.gpsCoordinates.latitude}, {selectedAsset.gpsCoordinates.longitude}</p>
                </div>
              )}
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsViewAssetOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Asset Dialog */}
      <Dialog open={isEditAssetOpen} onOpenChange={setIsEditAssetOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editAssetName">Asset Name</Label>
                <Input
                  id="editAssetName"
                  value={editAssetForm.assetName}
                  onChange={(e) => setEditAssetForm({...editAssetForm, assetName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editAssetType">Asset Type</Label>
                <Select value={editAssetForm.assetType} onValueChange={(value) => setEditAssetForm({...editAssetForm, assetType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Heavy Equipment">Heavy Equipment</SelectItem>
                    <SelectItem value="Material Handling">Material Handling</SelectItem>
                    <SelectItem value="Office Equipment">Office Equipment</SelectItem>
                    <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editCategory">Category</Label>
                <Select value={editAssetForm.category} onValueChange={(value) => setEditAssetForm({...editAssetForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Construction">Construction</SelectItem>
                    <SelectItem value="Warehouse">Warehouse</SelectItem>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editLocation">Location</Label>
                <Input
                  id="editLocation"
                  value={editAssetForm.location}
                  onChange={(e) => setEditAssetForm({...editAssetForm, location: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editAssignedTo">Assigned To</Label>
                <Input
                  id="editAssignedTo"
                  value={editAssetForm.assignedTo}
                  onChange={(e) => setEditAssetForm({...editAssetForm, assignedTo: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editStatus">Status</Label>
                <Select value={editAssetForm.status} onValueChange={(value: 'active' | 'maintenance' | 'retired' | 'sold' | 'rented') => setEditAssetForm({...editAssetForm, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={editAssetForm.description}
                onChange={(e) => setEditAssetForm({...editAssetForm, description: e.target.value})}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditAssetOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setIsEditAssetOpen(false);
              }}>
                Update Asset
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Asset Dialog */}
      <Dialog open={isDeleteAssetOpen} onOpenChange={setIsDeleteAssetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Asset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete the asset "{selectedAsset?.assetName}"?</p>
            <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDeleteAssetOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => {
                setIsDeleteAssetOpen(false);
              }}>
                Delete Asset
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Asset Transaction Dialog */}
      <Dialog open={isAssetTransactionOpen} onOpenChange={setIsAssetTransactionOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asset Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transactionType">Transaction Type</Label>
                  <Select value={transactionForm.transactionType} onValueChange={(value: 'purchase' | 'depreciation' | 'maintenance' | 'sale' | 'transfer' | 'rental') => setTransactionForm({...transactionForm, transactionType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="depreciation">Depreciation</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                    <SelectItem value="rental">Rental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={transactionForm.amount}
                  onChange={(e) => setTransactionForm({...transactionForm, amount: e.target.value})}
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <Label htmlFor="referenceType">Reference Type</Label>
                <Input
                  id="referenceType"
                  value={transactionForm.referenceType}
                  onChange={(e) => setTransactionForm({...transactionForm, referenceType: e.target.value})}
                  placeholder="e.g., PO, WO, Invoice"
                />
              </div>
              <div>
                <Label htmlFor="referenceId">Reference ID</Label>
                <Input
                  id="referenceId"
                  value={transactionForm.referenceId}
                  onChange={(e) => setTransactionForm({...transactionForm, referenceId: e.target.value})}
                  placeholder="Enter reference ID"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="transactionDescription">Description</Label>
              <Textarea
                id="transactionDescription"
                value={transactionForm.description}
                onChange={(e) => setTransactionForm({...transactionForm, description: e.target.value})}
                placeholder="Enter transaction description"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAssetTransactionOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setIsAssetTransactionOpen(false);
              }}>
                Create Transaction
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Depreciation Report Dialog */}
      <Dialog open={isDepreciationReportOpen} onOpenChange={setIsDepreciationReportOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Depreciation Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Assets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAssets}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Purchase Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${assets.reduce((sum, asset) => sum + asset.purchaseCost, 0).toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Current Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalAssetValue.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Asset Depreciation Details</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {allAssets.map((asset) => (
                  <div key={asset.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{asset.assetName}</p>
                        <p className="text-sm text-muted-foreground">{asset.assetNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${asset.currentValue.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">${asset.purchaseCost.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm">
                        <span>Depreciation Progress:</span>
                        <span>{calculateDepreciationProgress(asset).toFixed(1)}%</span>
                      </div>
                      <Progress value={calculateDepreciationProgress(asset)} className="h-2 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsDepreciationReportOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Location Tracking Dialog */}
      <Dialog open={isLocationTrackingOpen} onOpenChange={setIsLocationTrackingOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Location Tracking</DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">{selectedAsset.assetName}</h4>
                <p className="text-sm text-muted-foreground">{selectedAsset.assetNumber}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Current Location</Label>
                  <p className="text-sm">{selectedAsset.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Assigned To</Label>
                  <p className="text-sm">{selectedAsset.assignedTo}</p>
                </div>
              </div>
              {selectedAsset.gpsCoordinates ? (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">GPS Coordinates</Label>
                  <div className="border rounded-lg p-4 bg-muted">
                    <p className="text-sm">Latitude: {selectedAsset.gpsCoordinates.latitude}</p>
                    <p className="text-sm">Longitude: {selectedAsset.gpsCoordinates.longitude}</p>
                  </div>
                  <Button className="w-full">
                    <MapPin className="h-4 w-4 mr-2" />
                    View on Map
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <MapPin className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">GPS tracking not available for this asset</p>
                </div>
              )}
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsLocationTrackingOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Maintenance Schedule Dialog */}
      <Dialog open={isMaintenanceScheduleOpen} onOpenChange={setIsMaintenanceScheduleOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Maintenance Schedule</DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">{selectedAsset.assetName}</h4>
                <p className="text-sm text-muted-foreground">{selectedAsset.assetNumber}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Last Maintenance</Label>
                  <p className="text-sm">{selectedAsset.lastMaintenance}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Next Maintenance</Label>
                  <p className="text-sm">{selectedAsset.nextMaintenance}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedAsset.status)}>
                    {selectedAsset.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Maintenance History</Label>
                <div className="border rounded-lg p-3 bg-muted">
                  <p className="text-sm">No maintenance history available</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Maintenance
                </Button>
                <Button variant="outline" onClick={() => setIsMaintenanceScheduleOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Asset Transfer Dialog */}
      <Dialog open={isAssetTransferOpen} onOpenChange={setIsAssetTransferOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transfer Asset</DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">{selectedAsset.assetName}</h4>
                <p className="text-sm text-muted-foreground">{selectedAsset.assetNumber}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="transferLocation">New Location</Label>
                  <Input
                    id="transferLocation"
                    placeholder="Enter new location"
                  />
                </div>
                <div>
                  <Label htmlFor="transferAssignedTo">New Assigned To</Label>
                  <Input
                    id="transferAssignedTo"
                    placeholder="Enter new assigned person"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="transferReason">Transfer Reason</Label>
                <Textarea
                  id="transferReason"
                  placeholder="Enter transfer reason"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAssetTransferOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  setIsAssetTransferOpen(false);
                }}>
                  Transfer Asset
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Report Dialog */}
      <Dialog open={isExportReportOpen} onOpenChange={setIsExportReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Report Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asset-list">Asset List</SelectItem>
                  <SelectItem value="depreciation-report">Depreciation Report</SelectItem>
                  <SelectItem value="maintenance-schedule">Maintenance Schedule</SelectItem>
                  <SelectItem value="transaction-history">Transaction History</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Format</Label>
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
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsExportReportOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setIsExportReportOpen(false);
              }}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Assets</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Asset Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Heavy Equipment">Heavy Equipment</SelectItem>
                  <SelectItem value="Material Handling">Material Handling</SelectItem>
                  <SelectItem value="Office Equipment">Office Equipment</SelectItem>
                  <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Location</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Site A">Site A</SelectItem>
                  <SelectItem value="Site B">Site B</SelectItem>
                  <SelectItem value="Warehouse">Warehouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsFilterOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setIsFilterOpen(false);
              }}>
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rent Asset Dialog */}
      <Dialog open={isRentAssetOpen} onOpenChange={setIsRentAssetOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Rent Asset</DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">{selectedAsset.assetName}</h4>
                <p className="text-sm text-muted-foreground">{selectedAsset.assetNumber}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rentCustomerName">Customer Name</Label>
                  <Input
                    id="rentCustomerName"
                    value={rentalForm.customerName}
                    onChange={(e) => setRentalForm({...rentalForm, customerName: e.target.value})}
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <Label htmlFor="rentStartDate">Start Date</Label>
                  <Input
                    id="rentStartDate"
                    type="date"
                    value={rentalForm.startDate}
                    onChange={(e) => setRentalForm({...rentalForm, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="rentEndDate">End Date</Label>
                  <Input
                    id="rentEndDate"
                    type="date"
                    value={rentalForm.endDate}
                    onChange={(e) => setRentalForm({...rentalForm, endDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="rentDailyRate">Daily Rate</Label>
                  <Input
                    id="rentDailyRate"
                    type="number"
                    value={rentalForm.dailyRate}
                    onChange={(e) => setRentalForm({...rentalForm, dailyRate: e.target.value})}
                    placeholder="Enter daily rate"
                  />
                </div>
                <div>
                  <Label htmlFor="rentDeposit">Deposit</Label>
                  <Input
                    id="rentDeposit"
                    type="number"
                    value={rentalForm.deposit}
                    onChange={(e) => setRentalForm({...rentalForm, deposit: e.target.value})}
                    placeholder="Enter deposit"
                  />
                </div>
                <div>
                  <Label htmlFor="rentLocation">Location</Label>
                  <Input
                    id="rentLocation"
                    value={rentalForm.location}
                    onChange={(e) => setRentalForm({...rentalForm, location: e.target.value})}
                    placeholder="Enter new location"
                  />
                </div>
                <div>
                  <Label htmlFor="rentNotes">Notes</Label>
                  <Textarea
                    id="rentNotes"
                    value={rentalForm.notes}
                    onChange={(e) => setRentalForm({...rentalForm, notes: e.target.value})}
                    placeholder="Enter rental notes"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsRentAssetOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  handleCreateRental();
                }}>
                  Rent Asset
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Rental Dialog */}
      <Dialog open={isViewRentalOpen} onOpenChange={setIsViewRentalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Rental Details</DialogTitle>
          </DialogHeader>
          {selectedRental && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Asset Number</Label>
                  <p className="text-sm">{selectedRental.assetNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Asset Name</Label>
                  <p className="text-sm">{selectedRental.assetName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Customer Name</Label>
                  <p className="text-sm">{selectedRental.customerName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Start Date</Label>
                  <p className="text-sm">{selectedRental.startDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">End Date</Label>
                  <p className="text-sm">{selectedRental.endDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getRentalStatusColor(selectedRental.status)}>
                    {selectedRental.status.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Daily Rate</Label>
                  <p className="text-sm">${selectedRental.dailyRate.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Amount</Label>
                  <p className="text-sm">${selectedRental.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Deposit</Label>
                  <p className="text-sm">${selectedRental.deposit.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-sm">{selectedRental.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm">{selectedRental.notes || 'No notes'}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsViewRentalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
