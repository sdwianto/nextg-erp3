//src/components/DataLifecycleFlow.tsx

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import React, { useState } from 'react';
import { api } from '@/utils/api';
import {
  ShoppingCart, Package, Wrench, Building, Truck, CheckCircle, Zap, Clock, AlertTriangle,
  ArrowRight, Eye, Settings, RefreshCw, Database, TrendingUp
} from 'lucide-react';

interface LifecycleStep {
  id: string;
  name: string;
  module: string;
  icon: React.ReactNode;
  status: 'completed' | 'active' | 'pending' | 'error';
  data: unknown;
  metrics: {
    records: number;
    efficiency: number;
    lastUpdate: Date;
  };
}

const DataLifecycleFlow: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [selectedEntity] = useState('EQ001');

  // API Queries
  const { data: integratedData } = api.integration.getIntegratedData.useQuery({
    module: 'asset',
    entityId: selectedEntity,
    includeRelated: true,
  });

  const lifecycleSteps: LifecycleStep[] = [
    {
      id: 'procurement',
      name: 'Procurement',
      module: 'procurement',
      icon: <ShoppingCart className="h-6 w-6" />,
      status: 'completed',
             data: (integratedData?.data as Record<string, unknown>)?.procurement || {},
      metrics: {
        records: 45,
        efficiency: 94.2,
        lastUpdate: new Date(),
      },
    },
    {
      id: 'inventory',
      name: 'Inventory',
      module: 'inventory',
      icon: <Package className="h-6 w-6" />,
      status: 'active',
             data: (integratedData?.data as Record<string, unknown>)?.inventory || {},
      metrics: {
        records: 120,
        efficiency: 96.8,
        lastUpdate: new Date(),
      },
    },
    {
      id: 'maintenance',
      name: 'Maintenance',
      module: 'maintenance',
      icon: <Wrench className="h-6 w-6" />,
      status: 'active',
             data: (integratedData?.data as Record<string, unknown>)?.maintenance || {},
      metrics: {
        records: 35,
        efficiency: 91.5,
        lastUpdate: new Date(),
      },
    },
    {
      id: 'asset',
      name: 'Asset Management',
      module: 'asset',
      icon: <Building className="h-6 w-6" />,
      status: 'active',
             data: (integratedData?.data as Record<string, unknown>)?.asset || {},
      metrics: {
        records: 28,
        efficiency: 98.1,
        lastUpdate: new Date(),
      },
    },
    {
      id: 'rental',
      name: 'Rental Management',
      module: 'rental',
      icon: <Truck className="h-6 w-6" />,
      status: 'active',
             data: (integratedData?.data as Record<string, unknown>)?.rental || {},
      metrics: {
        records: 18,
        efficiency: 89.7,
        lastUpdate: new Date(),
      },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'active': return <Zap className="h-4 w-4 text-blue-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const safeArrayLength = (data: unknown, key: string): number => {
    if (data && typeof data === 'object' && key in data) {
      const value = (data as Record<string, unknown>)[key];
      return Array.isArray(value) ? value.length : 0;
    }
    return 0;
  };

  // eslint-disable-next-line no-unused-vars
  const safeArrayMap = (data: unknown, key: string, callback: (_item: unknown, _index: number) => React.ReactNode): React.ReactNode => {
    if (data && typeof data === 'object' && key in data) {
      const value = (data as Record<string, unknown>)[key];
      return Array.isArray(value) ? value.map(callback) : null; 
    }
    return null;
  };

  const safeGet = (data: unknown, key: string): unknown => {
    if (data && typeof data === 'object' && key in data) {
      return (data as Record<string, unknown>)[key];
    }
    return null;
  };

  const safeGetNested = (data: unknown, key1: string, key2: string): unknown => {
    const nested = safeGet(data, key1);
    if (nested && typeof nested === 'object' && key2 in nested) {
      return (nested as Record<string, unknown>)[key2];
    }
    return null;
  };

  const safeGetArrayIndex = (data: unknown, key: string, index: number): unknown => {
    const array = safeGet(data, key);
    if (Array.isArray(array) && array[index]) {
      return array[index];
    }
    return null;
  };

  const renderStepDetails = (step: LifecycleStep) => {
    switch (step.module) {
      case 'procurement':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {safeArrayLength(step.data, 'purchaseOrders')}
                </div>
                <div className="text-sm text-blue-600">Purchase Orders</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                  {safeArrayLength(step.data, 'requisitions')}
                </div>
                <div className="text-sm text-green-600">Requisitions</div>
              </div>
            </div>
                {safeArrayMap(step.data, 'purchaseOrders', (_po: unknown, index: number) => (
               <div key={index} className="p-3 border rounded-lg">
                 <div className="flex justify-between items-center">
                  <span className="font-medium">{((_po as Record<string, unknown>).poId as string)}</span>
                   <Badge variant="secondary">{((_po as Record<string, unknown>).status as string)}</Badge>
                 </div>
                 <div className="text-sm text-muted-foreground">
                   {((_po as Record<string, unknown>).supplierName as string)} - {formatCurrency(((_po as Record<string, unknown>).totalAmount as number))}
                 </div>
               </div>
             ))}
          </div>
        );

      case 'inventory':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                                     {safeArrayLength(step.data, 'stockLevels')}
                </div>
                <div className="text-sm text-blue-600">Stock Items</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                                     {safeArrayLength(step.data, 'transactions')}
                </div>
                <div className="text-sm text-green-600">Transactions</div>
              </div>
            </div>
                         {safeArrayMap(step.data, 'stockLevels', (_stock: unknown, index: number) => (
               <div key={index} className="p-3 border rounded-lg">
                 <div className="flex justify-between items-center">
                   <span className="font-medium">{((_stock as Record<string, unknown>).itemDescription as string)}</span>
                   <Badge variant="secondary">{((_stock as Record<string, unknown>).quantityOnHand as number)} units</Badge>
                 </div>
                 <div className="text-sm text-muted-foreground">
                   Location: {((_stock as Record<string, unknown>).location as string)} | Reorder: {((_stock as Record<string, unknown>).reorderPoint as number)}
                 </div>
               </div>
             ))}
          </div>
        );

      case 'maintenance':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                                     {safeArrayLength(step.data, 'workOrders')}
                </div>
                <div className="text-sm text-blue-600">Work Orders</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                                     {safeArrayLength(step.data, 'maintenanceHistory')}
                </div>
                <div className="text-sm text-green-600">History Records</div>
              </div>
            </div>
                                                   {safeArrayMap(step.data, 'workOrders', (wo: unknown, index: number) => (
               <div key={index} className="p-3 border rounded-lg">
                 <div className="flex justify-between items-center">
                   <span className="font-medium">{(wo as Record<string, unknown>).workOrderId as string}</span>
                   <Badge variant="secondary">{(wo as Record<string, unknown>).status as string}</Badge>
                 </div>
                 <div className="text-sm text-muted-foreground">
                   {(wo as Record<string, unknown>).workOrderType as string} - {formatCurrency((wo as Record<string, unknown>).estimatedCost as number)}
                 </div>
               </div>
             ))}
          </div>
        );

      case 'asset':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                                     {(safeGetNested(step.data, 'equipmentDetails', 'equipmentId') as string) || 'N/A'}
                </div>
                <div className="text-sm text-blue-600">Equipment ID</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                                     {formatCurrency((safeGetNested(step.data, 'equipmentDetails', 'currentValue') as number) || 0)}
                </div>
                <div className="text-sm text-green-600">Current Value</div>
              </div>
            </div>         
          </div>
        );

      case 'rental':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                                     {safeArrayLength(step.data, 'rentalContracts')}
                </div>
                <div className="text-sm text-blue-600">Active Contracts</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                                     {formatCurrency((safeGetArrayIndex(step.data, 'rentalContracts', 0) as Record<string, unknown>)?.revenue as number || 0)}
                </div>
                <div className="text-sm text-green-600">Total Revenue</div>
              </div>
            </div>
                                                   {safeArrayMap(step.data, 'rentalContracts', (rental: unknown, index: number) => (
               <div key={index} className="p-3 border rounded-lg">
                 <div className="flex justify-between items-center">
                   <span className="font-medium">{(rental as Record<string, unknown>).rentalId as string}</span>
                   <Badge variant="secondary">{(rental as Record<string, unknown>).billingStatus as string}</Badge>
                 </div>
                 <div className="text-sm text-muted-foreground">
                   {(rental as Record<string, unknown>).customerName as string} - {(rental as Record<string, unknown>).hoursUsed as number} hours
                 </div>
                 <div className="text-sm text-blue-600">
                   {formatCurrency((rental as Record<string, unknown>).totalAmount as number)}
                 </div>
               </div>
             ))}
          </div>
        );

      default:
        return <div>No data available</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Lifecycle Flow</h1>
          <p className="text-muted-foreground">
            Complete data integration from procurement to rental management
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Lifecycle Flow */}
      <div className="relative">
        {/* Flow Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 transform -translate-y-1/2 z-0" />
        
        {/* Steps */}
        <div className="relative z-10 grid grid-cols-5 gap-4">
          {lifecycleSteps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              {/* Step Card */}
              <Card 
                className={`w-full cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedStep === step.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
              >
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-2">
                    <div className={`p-3 rounded-full ${getStatusColor(step.status)} text-white`}>
                      {step.icon}
                    </div>
                  </div>
                  <CardTitle className="text-sm font-medium">{step.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      {getStatusIcon(step.status)}
                      <span className="text-xs capitalize">{step.status}</span>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{step.metrics.records}</div>
                      <div className="text-xs text-muted-foreground">Records</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Efficiency</span>
                        <span>{step.metrics.efficiency}%</span>
                      </div>
                      <Progress value={step.metrics.efficiency} className="h-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Arrow */}
              {index < lifecycleSteps.length - 1 && (
                <div className="flex items-center justify-center mt-4">
                  <ArrowRight className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Details */}
      {selectedStep && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {lifecycleSteps.find(s => s.id === selectedStep)?.icon}
                <span>{lifecycleSteps.find(s => s.id === selectedStep)?.name} Details</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedStep(null)}>
                <Eye className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepDetails(lifecycleSteps.find(s => s.id === selectedStep)!)}
          </CardContent>
        </Card>
      )}

      {/* Integration Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Data Flow</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">246</div>
            <p className="text-xs text-muted-foreground">
              Records across all modules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.1%</div>
            <p className="text-xs text-muted-foreground">
              Cross-module data flow
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5/5</div>
            <p className="text-xs text-muted-foreground">
              Modules connected
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataLifecycleFlow;
