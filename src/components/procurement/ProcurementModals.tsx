// src/components/procurement/ProcurementModals.tsx
'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface ProcurementModalsProps {
  selectedItem: any | null;
  onCloseDetails: () => void;
}

const ProcurementModals: React.FC<ProcurementModalsProps> = ({
  selectedItem,
  onCloseDetails
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
      case 'UNDER_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      case 'ORDERED': return 'bg-purple-100 text-purple-800';
      case 'PARTIALLY_RECEIVED': return 'bg-orange-100 text-orange-800';
      case 'RECEIVED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-100 text-gray-800';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={!!selectedItem} onOpenChange={onCloseDetails}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedItem?.type === 'pr' ? 'Purchase Request Details' : 
             selectedItem?.type === 'po' ? 'Purchase Order Details' : 
             'Supplier Details'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {selectedItem?.type === 'pr' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-500">PR Number</Label>
                  <p className="text-sm">{selectedItem.prNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <Badge className={getStatusColor(selectedItem.status)}>
                    {selectedItem.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Title</Label>
                  <p className="text-sm">{selectedItem.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Priority</Label>
                  <Badge className={getPriorityColor(selectedItem.priority)}>
                    {selectedItem.priority}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Required Date</Label>
                  <p className="text-sm">{new Date(selectedItem.requiredDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Budget</Label>
                  <p className="text-sm">${selectedItem.estimatedBudget?.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Total Price</Label>
                  <p className="text-sm font-medium text-green-600">
                    ${selectedItem.items?.reduce((total: number, item: any) => {
                      const quantity = Number(item.quantity) || 0;
                      const unitPrice = Number(item.unitPrice) || 0;
                      return total + (quantity * unitPrice);
                    }, 0).toLocaleString() || '0'}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-500">Description</Label>
                  <p className="text-sm">{selectedItem.description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Items</Label>
                  <p className="text-sm">{selectedItem.items?.length || 0} items</p>
                </div>
              </div>

              {/* Items Details for PR */}
              {selectedItem.items && selectedItem.items.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Items</Label>
                  <div className="space-y-2 mt-2">
                    {selectedItem.items.map((item: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{item.product?.name || 'Product'}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            {item.unitPrice && (
                              <p className="text-sm text-gray-600">Unit Price: ${item.unitPrice.toLocaleString()}</p>
                            )}
                            {item.specifications && (
                              <p className="text-sm text-gray-600 mt-1">{item.specifications}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">
                              ${((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedItem?.type === 'po' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-500">PO Number</Label>
                  <p className="text-sm">{selectedItem.poNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <Badge className={getStatusColor(selectedItem.status)}>
                    {selectedItem.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Supplier</Label>
                  <p className="text-sm">{selectedItem.supplier?.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Order Date</Label>
                  <p className="text-sm">{new Date(selectedItem.orderDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Expected Delivery</Label>
                  <p className="text-sm">{new Date(selectedItem.expectedDelivery).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Grand Total</Label>
                  <p className="text-sm font-medium text-green-600">${selectedItem.grandTotal?.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Currency</Label>
                  <p className="text-sm">{selectedItem.currency}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Items</Label>
                  <p className="text-sm">{selectedItem.items?.length || 0} items</p>
                </div>
              </div>

              {/* Items Details for PO */}
              {selectedItem.items && selectedItem.items.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Items</Label>
                  <div className="space-y-2 mt-2">
                    {selectedItem.items.map((item: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{item.product?.name || 'Product'}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            <p className="text-sm text-gray-600">Unit Price: ${item.unitPrice.toLocaleString()}</p>
                            {item.specifications && (
                              <p className="text-sm text-gray-600 mt-1">{item.specifications}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">
                              ${((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedItem?.type === 'supplier' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Name</Label>
                  <p className="text-sm">{selectedItem.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Code</Label>
                  <p className="text-sm">{selectedItem.code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Contact Person</Label>
                  <p className="text-sm">{selectedItem.contactPerson}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <p className="text-sm">{selectedItem.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Phone</Label>
                  <p className="text-sm">{selectedItem.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <Badge className={selectedItem.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {selectedItem.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              {/* Purchase Orders */}
              {selectedItem.purchaseOrders && selectedItem.purchaseOrders.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Purchase Orders ({selectedItem.purchaseOrders.length})</Label>
                  <div className="space-y-2 mt-2">
                    {selectedItem.purchaseOrders.map((po: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{po.poNumber}</p>
                            <p className="text-sm text-gray-600">{new Date(po.orderDate).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">${po.grandTotal?.toLocaleString()}</p>
                            <Badge className={getStatusColor(po.status)}>
                              {po.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProcurementModals;
