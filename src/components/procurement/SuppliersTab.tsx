// src/components/procurement/SuppliersTab.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Plus,
  Eye
} from 'lucide-react';

interface SuppliersTabProps {
  suppliers: any;
  searchTerm: string;
  showActiveOnly: boolean;
  onNewSupplier: () => void;
  onViewDetails: (_item: any, _type: 'pr' | 'po' | 'supplier') => void;
  onSearchChange: (value: string) => void;
  onActiveOnlyChange: (value: boolean) => void;
  isLoading: boolean;
}

const SuppliersTab: React.FC<SuppliersTabProps> = ({
  suppliers,
  searchTerm,
  showActiveOnly,
  onNewSupplier,
  onViewDetails,
  onSearchChange,
  onActiveOnlyChange,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading Suppliers...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Supplier Management</span>
          <Button 
            className="flex items-center space-x-2"
            onClick={onNewSupplier}
          >
            <Plus className="h-4 w-4" />
            <span>Add Supplier</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search and Filter Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <span className="text-sm text-gray-600">Show Active Only:</span>
            <Switch
              checked={showActiveOnly}
              onCheckedChange={onActiveOnlyChange}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          {(suppliers?.data as any[])?.map((supplier: any) => (
            <div key={supplier.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{supplier.name}</h3>
                <div className="flex items-center space-x-2">
                  <Badge className={supplier.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {supplier.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(supplier, 'supplier')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Supplier Details
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{supplier.code}</p>
              <div className="space-y-1 text-sm text-gray-500">
                <p>Contact: {supplier.contactPerson}</p>
                <p>Email: {supplier.email}</p>
                <p>Phone: {supplier.phone}</p>
              </div>

              {/* Ordered POs section */}
              {supplier.purchaseOrders && supplier.purchaseOrders.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Ordered POs</span>
                    <Badge className="bg-purple-100 text-purple-800">
                      {supplier.purchaseOrders.length}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {(supplier.purchaseOrders as any[]).slice(0, 3).map((po: any) => (
                      <div key={po.id} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{po.poNumber}</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-green-600">
                            ${po.grandTotal?.toLocaleString() || '0'}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewDetails(po, 'po')}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}

                    {supplier.purchaseOrders.length > 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1"
                        onClick={() => onViewDetails(supplier, 'supplier')}
                      >
                        View all {supplier.purchaseOrders.length} POs
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SuppliersTab;
