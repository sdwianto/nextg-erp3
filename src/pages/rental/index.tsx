import React, { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/utils/api';
import { Plus, Search, Filter, AlertTriangle, CheckCircle, Clock, Calendar, DollarSign, Users, Truck, X, Eye, Edit, MapPin, BarChart3, TrendingUp, Activity, FileText, Download, Building2 } from 'lucide-react';
import type { Asset } from '@prisma/client';

interface Equipment {
  id: string;
  code: string;
  name: string;
  type: string;
  status: string;
  currentRental: string | null;
  rentalRate: number;
  location: string;
  operatingHours: number;
  lastRentalDate: string;
  isAsset?: boolean;
  assetData?: Asset;
}

interface RentalContract {
  id: string;
  equipmentCode: string;
  equipmentName: string;
  customerName: string;
  startDate: string;
  endDate: string;
  status: string;
  totalAmount: number;
  deposit: number;
  location: string;
}

interface FilterState {
  search: string;
  type: string;
  status: string;
  location: string;
  rentalRate: string;
}

const RentalPage: React.FC = () => {
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'all',
    status: 'all',
    location: 'all',
    rentalRate: ''
  });

  // Dialog state
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isNewRentalDialogOpen, setIsNewRentalDialogOpen] = useState(false);
  const [, setIsEditEquipmentDialogOpen] = useState(false);
  const [isViewEquipmentDialogOpen, setIsViewEquipmentDialogOpen] = useState(false);
  const [isViewRentalContractDialogOpen, setIsViewRentalContractDialogOpen] = useState(false);
  const [isEditRentalContractDialogOpen, setIsEditRentalContractDialogOpen] = useState(false);
  const [isReturnEquipmentDialogOpen, setIsReturnEquipmentDialogOpen] = useState(false);
  const [isExtendRentalDialogOpen, setIsExtendRentalDialogOpen] = useState(false);
  const [isCancelRentalDialogOpen, setIsCancelRentalDialogOpen] = useState(false);
  const [isExportReportDialogOpen, setIsExportReportDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [selectedRental, setSelectedRental] = useState<RentalContract | null>(null);

  // Form states
  const [, setEditEquipmentForm] = useState({
    name: '',
    code: '',
    type: '',
    rentalRate: '',
    location: '',
    description: ''
  });

  const [newRentalForm, setNewRentalForm] = useState({
    equipmentId: '',
    customerName: '',
    startDate: '',
    endDate: '',
    rentalRate: '',
    deposit: '',
    location: '',
    notes: ''
  });

  const [editRentalForm, setEditRentalForm] = useState({
    customerName: '',
    startDate: '',
    endDate: '',
    rentalRate: '',
    deposit: '',
    location: '',
    notes: ''
  });

  const [returnForm, setReturnForm] = useState({
    returnDate: '',
    condition: '',
    notes: '',
    additionalCharges: ''
  });

  const [extendForm, setExtendForm] = useState({
    newEndDate: '',
    reason: ''
  });

  // Use tRPC query for equipment data
  const { data: equipmentData, isLoading: equipmentLoading } = api.rentalMaintenance.getEquipment.useQuery({
    page: 1,
    limit: 50
  });

  const { data: dashboardData, isLoading: dashboardLoading } = api.rentalMaintenance.getDashboardData.useQuery();

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [rentalContracts, setRentalContracts] = useState<RentalContract[]>([]);

  useEffect(() => {
    if (equipmentData?.equipment) { 
      const apiEquipment: Equipment[] = equipmentData.equipment.map((item) => ({
        id: item.id,
        code: item.id, // Use id as code since assetNumber doesn't exist
        name: item.name,
        type: 'Heavy Equipment', // Default type since category is not available
        status: item.status,
        currentRental: null, // TODO: Add rental info to API
        rentalRate: 0, // TODO: Add rental rate to API
        location: item.location || 'Warehouse',
        operatingHours: 0, // TODO: Add operating hours to API
        lastRentalDate: '2024-02-15' // TODO: Get from rental records
      }));
      setEquipment(apiEquipment);
    }
  }, [equipmentData]);

  // Load assets from Asset Management for rental
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);

  useEffect(() => {
    // Load assets from Asset Management that are available for rental
    const storedAssets = localStorage.getItem('procurementAssets');
    if (storedAssets) {
      try {
        const parsedAssets = JSON.parse(storedAssets);
        const rentalAssets = parsedAssets.filter((asset: Asset) => 
          asset.status === 'ACTIVE' // Use correct enum value
        );
        setAvailableAssets(rentalAssets);
      } catch {
        // Silently handle parsing errors
      }
    }
  }, []);

  // Combine equipment and assets for rental
  const _allRentalItems = useMemo(() => [...equipment, ...availableAssets.map((asset: Asset) => ({
    id: asset.id,
    code: asset.assetNumber || asset.id,
    name: asset.name,
    type: 'Heavy Equipment', // Default type
    status: asset.status,
    currentRental: null, // Default value
    rentalRate: 0, // Default value
    location: asset.location || 'Warehouse',
    operatingHours: 0,
    lastRentalDate: '2024-02-15', // Default value
    isAsset: true,
    assetData: asset
  }))], [equipment, availableAssets]);

  // Mock rental data
  const _rentalStats = useMemo(() => ({
    totalEquipment: dashboardData?.summary?.totalEquipment ?? 0,
    availableEquipment: dashboardData?.summary?.availableEquipment ?? 0,
    rentedEquipment: dashboardData?.summary?.inUseEquipment ?? 0,
    _totalRevenue: 0,
    _activeContracts: 0,
    _pendingReturns: 0
  }), [dashboardData?.summary]);

  // Mock rental contracts data
  const mockRentalContracts = useMemo((): RentalContract[] => [
    {
      id: '1',
      equipmentCode: 'EXC-001',
      equipmentName: 'Excavator PC200',
      customerName: 'PT Construction Jaya',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      status: 'active',
      totalAmount: 15000000,
      deposit: 5000000,
      location: 'Site A - Jakarta'
    },
    {
      id: '2',
      equipmentCode: 'CR-003',
      equipmentName: 'Crane 50T',
      customerName: 'PT Building Solutions',
      startDate: '2024-01-20',
      endDate: '2024-03-20',
      status: 'active',
      totalAmount: 25000000,
      deposit: 8000000,
      location: 'Site B - Bandung'
    },
    {
      id: '3',
      equipmentCode: 'BD-002',
      equipmentName: 'Bulldozer D6',
      customerName: 'PT Infrastructure Pro',
      startDate: '2024-01-10',
      endDate: '2024-01-25',
      status: 'completed',
      totalAmount: 8000000,
      deposit: 3000000,
      location: 'Site C - Surabaya'
    },
    {
      id: '4',
      equipmentCode: 'FL-004',
      equipmentName: 'Forklift 3T',
      customerName: 'PT Warehouse Management',
      startDate: '2024-02-01',
      endDate: '2024-02-28',
      status: 'pending',
      totalAmount: 5000000,
      deposit: 2000000,
      location: 'Warehouse - Jakarta'
    }
  ], []);

  // State for rental stats
  const [rentalStats, setRentalStats] = useState({
    activeContracts: 0,
    pendingReturns: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    setRentalContracts(mockRentalContracts);
    // Update stats based on mock data
    const activeContracts = mockRentalContracts.filter(c => c.status === 'active').length;
    const pendingReturns = mockRentalContracts.filter(c => c.status === 'pending').length;
    const totalRevenue = mockRentalContracts.reduce((sum, c) => sum + c.totalAmount, 0);
    
    setRentalStats({
      activeContracts,
      pendingReturns,
      totalRevenue
    });
  }, [mockRentalContracts]);

  const _filteredEquipment = useMemo(() => {
    return _allRentalItems.filter(item => {
      // Search filter
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = !filters.search || 
        item.name.toLowerCase().includes(searchLower) ||
        item.code.toLowerCase().includes(searchLower) ||
        item.type.toLowerCase().includes(searchLower);

      // Type filter
      const matchesType = filters.type === 'all' || item.type === filters.type;

      // Status filter
      const matchesStatus = filters.status === 'all' || item.status === filters.status;

      // Location filter
      const matchesLocation = filters.location === 'all' || item.location === filters.location;

      // Rental rate filter
      const matchesRate = !filters.rentalRate || item.rentalRate >= parseFloat(filters.rentalRate);

      return matchesSearch && matchesType && matchesStatus && matchesLocation && matchesRate;
    });
  }, [_allRentalItems, filters]);

  const _handleViewEquipment = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsViewEquipmentDialogOpen(true);
  };



  const _handleNewRental = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setNewRentalForm({
      equipmentId: equipment.id.toString(),
      customerName: '',
      startDate: '',
      endDate: '',
      rentalRate: equipment.rentalRate.toString(),
      deposit: '',
      location: '',
      notes: ''
    });
    setIsNewRentalDialogOpen(true);
  };

  const _handleViewRentalContract = (contract: RentalContract) => {
    setSelectedRental(contract);
    setIsViewRentalContractDialogOpen(true);
  };

  const _handleEditRentalContract = (contract: RentalContract) => {
    setSelectedRental(contract);
    setEditRentalForm({
      customerName: contract.customerName,
      startDate: contract.startDate,
      endDate: contract.endDate,
      rentalRate: contract.totalAmount.toString(),
      deposit: contract.deposit.toString(),
      location: contract.location,
      notes: ''
    });
    setIsEditRentalContractDialogOpen(true);
  };

  const _handleReturnEquipment = (contract: RentalContract) => {
    setSelectedRental(contract);
    setReturnForm({
      returnDate: new Date().toISOString().split('T')[0] ?? '',
      condition: '',
      notes: '',
      additionalCharges: ''
    });
    setIsReturnEquipmentDialogOpen(true);
  };

  const _handleExtendRental = (contract: RentalContract) => {
    setSelectedRental(contract);
    setExtendForm({
      newEndDate: '',
      reason: ''
    });
    setIsExtendRentalDialogOpen(true);
  };

  const _handleCancelRental = (contract: RentalContract) => {
    setSelectedRental(contract);
    setIsCancelRentalDialogOpen(true);
  };

  const _handleExportReport = () => {
    setIsExportReportDialogOpen(true);
  };

  const _handleCreateRental = () => {
    // TODO: Implement API call to create rental contract
    // eslint-disable-next-line no-console
    // console.log('Creating rental contract:', newRentalForm);
    setIsNewRentalDialogOpen(false);
  };

  const _handleUpdateRental = () => {
    // TODO: Implement API call to update rental contract
    // eslint-disable-next-line no-console
    // console.log('Updating rental contract:', editRentalForm);
    setIsEditRentalContractDialogOpen(false);
  };

  const _handleProcessReturn = () => {
    // TODO: Implement API call to process equipment return
    // eslint-disable-next-line no-console
    // console.log('Processing return:', returnForm);
    setIsReturnEquipmentDialogOpen(false);
  };

  const _handleProcessExtension = () => {
    // TODO: Implement API call to extend rental
    // eslint-disable-next-line no-console
    // console.log('Processing extension:', extendForm);
    setIsExtendRentalDialogOpen(false);
  };

  const _handleProcessCancellation = () => {
    // TODO: Implement API call to cancel rental
    // eslint-disable-next-line no-console
    // console.log('Processing cancellation for contract:', selectedRental?.id);
    setIsCancelRentalDialogOpen(false);
  };

  const _handleExportRentalReport = () => {
    // TODO: Implement API call to export report
    // eslint-disable-next-line no-console
    // console.log('Exporting rental report...');
    setIsExportReportDialogOpen(false);
  };

  const _formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const _getRentalStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (equipmentLoading || dashboardLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rental Management</h1>
            <p className="text-muted-foreground">
              Equipment rental contracts, availability tracking, and revenue management
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={_handleExportReport}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Dialog open={isNewRentalDialogOpen} onOpenChange={setIsNewRentalDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Rental Contract
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Rental Contract</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="equipment">Equipment/Asset</Label>
                      <Select value={newRentalForm.equipmentId} onValueChange={(value) => setNewRentalForm({...newRentalForm, equipmentId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select equipment or asset" />
                        </SelectTrigger>
                        <SelectContent>
                          {_allRentalItems.filter(e => e.status === 'available').map((item) => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                              {item.name} - {item.code}
                              {item.isAsset && (
                                <Badge variant="outline" className="text-xs">
                                  <Building2 className="h-3 w-3 mr-1" />
                                  Asset
                                </Badge>
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="customer">Customer</Label>
                      <Input 
                        id="customer" 
                        placeholder="Enter customer name"
                        value={newRentalForm.customerName}
                        onChange={(e) => setNewRentalForm({...newRentalForm, customerName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input 
                        id="startDate" 
                        type="date"
                        value={newRentalForm.startDate}
                        onChange={(e) => setNewRentalForm({...newRentalForm, startDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input 
                        id="endDate" 
                        type="date"
                        value={newRentalForm.endDate}
                        onChange={(e) => setNewRentalForm({...newRentalForm, endDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rentalRate">Daily Rate</Label>
                      <Input 
                        id="rentalRate" 
                        type="number" 
                        placeholder="Enter daily rate"
                        value={newRentalForm.rentalRate}
                        onChange={(e) => setNewRentalForm({...newRentalForm, rentalRate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="deposit">Deposit</Label>
                      <Input 
                        id="deposit" 
                        type="number" 
                        placeholder="Enter deposit amount"
                        value={newRentalForm.deposit}
                        onChange={(e) => setNewRentalForm({...newRentalForm, deposit: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">Project Location</Label>
                    <Input 
                      id="location" 
                      placeholder="Enter project location"
                      value={newRentalForm.location}
                      onChange={(e) => setNewRentalForm({...newRentalForm, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Enter any additional notes"
                      value={newRentalForm.notes}
                      onChange={(e) => setNewRentalForm({...newRentalForm, notes: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsNewRentalDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={_handleCreateRental}>
                    Create Contract
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{_rentalStats.totalEquipment}</div>
              <p className="text-xs text-muted-foreground">
                Available for rental
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{_rentalStats.availableEquipment}</div>
              <p className="text-xs text-muted-foreground">
                Ready for rental
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Currently Rented</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{_rentalStats.rentedEquipment}</div>
              <p className="text-xs text-muted-foreground">
                Active contracts
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                              <div className="text-2xl font-bold">{rentalStats.activeContracts}</div>
              <p className="text-xs text-muted-foreground">
                Ongoing rentals
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Returns</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                              <div className="text-2xl font-bold">{rentalStats.pendingReturns}</div>
              <p className="text-xs text-muted-foreground">
                Due for return
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                              <div className="text-2xl font-bold">{_formatCurrency(rentalStats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="equipment" className="space-y-4">
          <TabsList>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="contracts">Rental Contracts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="equipment" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Equipment & Assets Inventory</span>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setIsFilterDialogOpen(true)}>
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search equipment or assets..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="pl-8 w-64"
                      />
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {_filteredEquipment.length === 0 ? (
                    <div className="text-center py-8">
                      <Truck className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-sm font-semibold">No equipment or assets found</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Try adjusting your search or filter criteria.
                      </p>
                    </div>
                  ) : (
                    _filteredEquipment.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.code}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{item.location}</span>
                              {item.isAsset && (
                                <Badge variant="outline" className="text-xs">
                                  <Building2 className="h-3 w-3 mr-1" />
                                  Asset
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                          <div className="text-right">
                            <p className="text-sm font-medium">{_formatCurrency(item.rentalRate)}</p>
                            <p className="text-xs text-muted-foreground">per day</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => _handleViewEquipment(item)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditEquipmentForm({
                                  name: item.name,
                                  code: item.code,
                                  type: item.type,
                                  rentalRate: item.rentalRate.toString(),
                                  location: item.location,
                                  description: ''
                                });
                                setSelectedEquipment(item);
                                setIsEditEquipmentDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {item.status === 'available' && (
                              <Button
                                size="sm"
                                onClick={() => _handleNewRental(item)}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Rent
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Assets from Asset Management */}
            {availableAssets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
                    Assets Available for Rental
                    <Badge variant="secondary" className="ml-2">{availableAssets.length} Assets</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {availableAssets.map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-medium">{asset.name}</h4>
                            <p className="text-sm text-muted-foreground">{asset.assetNumber || asset.id}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{asset.location || 'Unknown'}</span>
                              <Badge variant="outline" className="text-xs">
                                <Building2 className="h-3 w-3 mr-1" />
                                Asset from Procurement
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className="bg-green-100 text-green-800">
                            Available
                          </Badge>
                          <div className="text-right">
                            <p className="text-sm font-medium">{_formatCurrency(0)}</p>
                            <p className="text-xs text-muted-foreground">per day</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => _handleViewEquipment({
                                id: asset.id,
                                code: asset.assetNumber || asset.id,
                                name: asset.name,
                                type: 'Heavy Equipment',
                                status: asset.status,
                                currentRental: null,
                                rentalRate: 0,
                                location: asset.location || 'Warehouse',
                                operatingHours: 0,
                                lastRentalDate: '2024-02-15'
                              })}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => _handleNewRental({
                                id: asset.id,
                                code: asset.assetNumber || asset.id,
                                name: asset.name,
                                type: 'Heavy Equipment',
                                status: asset.status,
                                currentRental: null,
                                rentalRate: 0,
                                location: asset.location || 'Warehouse',
                                operatingHours: 0,
                                lastRentalDate: '2024-02-15'
                              })}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Rent Asset
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="contracts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rental Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rentalContracts.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-sm font-semibold">No rental contracts</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Create your first rental contract to get started.
                      </p>
                    </div>
                  ) : (
                    rentalContracts.map((contract) => (
                      <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-medium">{contract.equipmentName}</h4>
                            <p className="text-sm text-muted-foreground">{contract.customerName}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {contract.startDate} - {contract.endDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={_getRentalStatusColor(contract.status)}>
                            {contract.status}
                          </Badge>
                          <div className="text-right">
                            <p className="text-sm font-medium">{_formatCurrency(contract.totalAmount)}</p>
                            <p className="text-xs text-muted-foreground">Total</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => _handleViewRentalContract(contract)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => _handleEditRentalContract(contract)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {contract.status === 'active' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => _handleReturnEquipment(contract)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => _handleExtendRental(contract)}
                                >
                                  <Clock className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => _handleCancelRental(contract)}
                                >
                                  <AlertTriangle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {contract.status === 'pending' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => _handleProcessReturn()}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {contract.status === 'completed' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => _handleExportRentalReport()}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Rental Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Equipment utilization</span>
                      <Badge variant="default">75%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average rental duration</span>
                      <Badge variant="default">14 days</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Customer satisfaction</span>
                      <Badge variant="default">4.8/5</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Revenue Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-sm font-semibold">Revenue Analytics</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Track rental revenue and performance metrics.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Equipment Detail Dialog */}
      <Dialog open={isViewEquipmentDialogOpen} onOpenChange={setIsViewEquipmentDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Equipment Details</DialogTitle>
          </DialogHeader>
          {selectedEquipment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Equipment Name</Label>
                  <p className="text-sm font-medium">{selectedEquipment.name}</p>
                </div>
                <div>
                  <Label>Equipment Code</Label>
                  <p className="text-sm font-medium">{selectedEquipment.code}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <p className="text-sm font-medium">{selectedEquipment.type}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedEquipment.status)}>
                    {selectedEquipment.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Location</Label>
                  <p className="text-sm font-medium">{selectedEquipment.location}</p>
                </div>
                <div>
                  <Label>Daily Rate</Label>
                  <p className="text-sm font-medium">{_formatCurrency(selectedEquipment.rentalRate)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Operating Hours</Label>
                  <p className="text-sm font-medium">{selectedEquipment.operatingHours} hours</p>
                </div>
                <div>
                  <Label>Last Rental</Label>
                  <p className="text-sm font-medium">{selectedEquipment.lastRentalDate}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsViewEquipmentDialogOpen(false)}>
                  Close
                </Button>
                {selectedEquipment.status === 'available' && (
                  <Button onClick={() => _handleNewRental(selectedEquipment)}>
                    Rent Equipment
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Filter Equipment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="type">Equipment Type</Label>
              <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="excavator">Excavator</SelectItem>
                  <SelectItem value="bulldozer">Bulldozer</SelectItem>
                  <SelectItem value="crane">Crane</SelectItem>
                  <SelectItem value="loader">Loader</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="out_of_service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="site_a">Site A</SelectItem>
                  <SelectItem value="site_b">Site B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rentalRate">Minimum Daily Rate</Label>
              <Input
                id="rentalRate"
                type="number"
                placeholder="Enter minimum rate"
                value={filters.rentalRate}
                onChange={(e) => setFilters(prev => ({ ...prev, rentalRate: e.target.value }))}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setFilters({
                search: '',
                type: 'all',
                status: 'all',
                location: 'all',
                rentalRate: ''
              })}>
                Clear All
              </Button>
              <Button onClick={() => setIsFilterDialogOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Rental Contract Dialog */}
      <Dialog open={isViewRentalContractDialogOpen} onOpenChange={setIsViewRentalContractDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Rental Contract Details</DialogTitle>
          </DialogHeader>
          {selectedRental && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contract ID</Label>
                  <p className="text-sm font-medium">#{selectedRental.id}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={_getRentalStatusColor(selectedRental.status)}>
                    {selectedRental.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Equipment</Label>
                  <p className="text-sm font-medium">{selectedRental.equipmentName}</p>
                </div>
                <div>
                  <Label>Equipment Code</Label>
                  <p className="text-sm font-medium">{selectedRental.equipmentCode}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer</Label>
                  <p className="text-sm font-medium">{selectedRental.customerName}</p>
                </div>
                <div>
                  <Label>Location</Label>
                  <p className="text-sm font-medium">{selectedRental.location}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <p className="text-sm font-medium">{selectedRental.startDate}</p>
                </div>
                <div>
                  <Label>End Date</Label>
                  <p className="text-sm font-medium">{selectedRental.endDate}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Amount</Label>
                  <p className="text-sm font-medium">{_formatCurrency(selectedRental.totalAmount)}</p>
                </div>
                <div>
                  <Label>Deposit</Label>
                  <p className="text-sm font-medium">{_formatCurrency(selectedRental.deposit)}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsViewRentalContractDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => _handleEditRentalContract(selectedRental)}>
                  Edit Contract
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Rental Contract Dialog */}
      <Dialog open={isEditRentalContractDialogOpen} onOpenChange={setIsEditRentalContractDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Rental Contract</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editCustomerName">Customer Name</Label>
                <Input
                  id="editCustomerName"
                  value={editRentalForm.customerName}
                  onChange={(e) => setEditRentalForm({...editRentalForm, customerName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editLocation">Location</Label>
                <Input
                  id="editLocation"
                  value={editRentalForm.location}
                  onChange={(e) => setEditRentalForm({...editRentalForm, location: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editStartDate">Start Date</Label>
                <Input
                  id="editStartDate"
                  type="date"
                  value={editRentalForm.startDate}
                  onChange={(e) => setEditRentalForm({...editRentalForm, startDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editEndDate">End Date</Label>
                <Input
                  id="editEndDate"
                  type="date"
                  value={editRentalForm.endDate}
                  onChange={(e) => setEditRentalForm({...editRentalForm, endDate: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editRentalRate">Daily Rate</Label>
                <Input
                  id="editRentalRate"
                  type="number"
                  value={editRentalForm.rentalRate}
                  onChange={(e) => setEditRentalForm({...editRentalForm, rentalRate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editDeposit">Deposit</Label>
                <Input
                  id="editDeposit"
                  type="number"
                  value={editRentalForm.deposit}
                  onChange={(e) => setEditRentalForm({...editRentalForm, deposit: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="editNotes">Notes</Label>
              <Textarea
                id="editNotes"
                value={editRentalForm.notes}
                onChange={(e) => setEditRentalForm({...editRentalForm, notes: e.target.value})}
                placeholder="Enter any additional notes"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditRentalContractDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={_handleUpdateRental}>
                Update Contract
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Return Equipment Dialog */}
      <Dialog open={isReturnEquipmentDialogOpen} onOpenChange={setIsReturnEquipmentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Return Equipment</DialogTitle>
          </DialogHeader>
          {selectedRental && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">{selectedRental.equipmentName}</h4>
                <p className="text-sm text-muted-foreground">Contract #{selectedRental.id}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="returnDate">Return Date</Label>
                  <Input
                    id="returnDate"
                    type="date"
                    value={returnForm.returnDate}
                    onChange={(e) => setReturnForm({...returnForm, returnDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="condition">Equipment Condition</Label>
                  <Select value={returnForm.condition} onValueChange={(value) => setReturnForm({...returnForm, condition: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                      <SelectItem value="damaged">Damaged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="additionalCharges">Additional Charges</Label>
                <Input
                  id="additionalCharges"
                  type="number"
                  value={returnForm.additionalCharges}
                  onChange={(e) => setReturnForm({...returnForm, additionalCharges: e.target.value})}
                  placeholder="Enter additional charges if any"
                />
              </div>
              <div>
                <Label htmlFor="returnNotes">Return Notes</Label>
                <Textarea
                  id="returnNotes"
                  value={returnForm.notes}
                  onChange={(e) => setReturnForm({...returnForm, notes: e.target.value})}
                  placeholder="Enter return notes"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsReturnEquipmentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={_handleProcessReturn}>
                  Process Return
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Extend Rental Dialog */}
      <Dialog open={isExtendRentalDialogOpen} onOpenChange={setIsExtendRentalDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Extend Rental</DialogTitle>
          </DialogHeader>
          {selectedRental && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">{selectedRental.equipmentName}</h4>
                <p className="text-sm text-muted-foreground">Contract #{selectedRental.id}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Current End Date</Label>
                  <p className="text-sm font-medium">{selectedRental.endDate}</p>
                </div>
                <div>
                  <Label htmlFor="newEndDate">New End Date</Label>
                  <Input
                    id="newEndDate"
                    type="date"
                    value={extendForm.newEndDate}
                    onChange={(e) => setExtendForm({...extendForm, newEndDate: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="extendReason">Extension Reason</Label>
                <Textarea
                  id="extendReason"
                  value={extendForm.reason}
                  onChange={(e) => setExtendForm({...extendForm, reason: e.target.value})}
                  placeholder="Enter reason for extension"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsExtendRentalDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={_handleProcessExtension}>
                  Extend Rental
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Rental Dialog */}
      <Dialog open={isCancelRentalDialogOpen} onOpenChange={setIsCancelRentalDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cancel Rental Contract</DialogTitle>
          </DialogHeader>
          {selectedRental && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">{selectedRental.equipmentName}</h4>
                <p className="text-sm text-muted-foreground">Contract #{selectedRental.id}</p>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    Are you sure you want to cancel this rental contract? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer</Label>
                  <p className="text-sm font-medium">{selectedRental.customerName}</p>
                </div>
                <div>
                  <Label>Total Amount</Label>
                  <p className="text-sm font-medium">{_formatCurrency(selectedRental.totalAmount)}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCancelRentalDialogOpen(false)}>
                  Keep Contract
                </Button>
                <Button variant="destructive" onClick={_handleProcessCancellation}>
                  Cancel Contract
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Report Dialog */}
      <Dialog open={isExportReportDialogOpen} onOpenChange={setIsExportReportDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Export Rental Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rental-summary">Rental Summary</SelectItem>
                  <SelectItem value="equipment-utilization">Equipment Utilization</SelectItem>
                  <SelectItem value="revenue-report">Revenue Report</SelectItem>
                  <SelectItem value="contract-details">Contract Details</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dateRange">Date Range</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-quarter">This Quarter</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
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
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsExportReportDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={_handleExportRentalReport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default RentalPage; 