// src/components/procurement/PurchaseOrdersTab.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Plus,
  Eye,
  Edit,
  CheckCircle
} from 'lucide-react';

interface PurchaseOrdersTabProps {
  purchaseOrders: any;
  onNewOrder: () => void;
  onViewDetails: (_item: any, _type: 'pr' | 'po' | 'supplier') => void;
  onEditOrder: (_po: any) => void;
  onApprovePO: (_po: any) => void;
  isLoading: boolean;
}

const PurchaseOrdersTab: React.FC<PurchaseOrdersTabProps> = ({
  purchaseOrders,
  onNewOrder,
  onViewDetails,
  onEditOrder,
  onApprovePO,
  isLoading
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      case 'ORDERED': return 'bg-purple-100 text-purple-800';
      case 'PARTIALLY_RECEIVED': return 'bg-orange-100 text-orange-800';
      case 'RECEIVED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading Purchase Orders...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Purchase Orders</span>
          <Button 
            className="flex items-center space-x-2"
            onClick={onNewOrder}
          >
            <Plus className="h-4 w-4" />
            <span>New Order</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(purchaseOrders?.data as any[])?.map((po: any) => (
            <div key={po.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium">{po.poNumber}</span>
                  <Badge className={getStatusColor(po.status)}>
                    {po.status}
                  </Badge>
                </div>
                <h3 className="font-medium">{po.supplier?.name}</h3>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>Total: ${po.grandTotal?.toLocaleString()}</span>
                  <span>Order Date: {new Date(po.orderDate).toLocaleDateString()}</span>
                  <span>Expected: {new Date(po.expectedDelivery).toLocaleDateString()}</span>
                  <span>Items: {po.items?.length || 0}</span>
                </div>
                {po.status === 'REJECTED' && po.rejectionReason && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    <strong>Rejection Reason:</strong> {po.rejectionReason}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEditOrder(po)}
                  disabled={po.status === 'ORDERED' || po.status === 'PARTIALLY_RECEIVED' || po.status === 'RECEIVED'}
                  className={`${po.status === 'ORDERED' || po.status === 'PARTIALLY_RECEIVED' || po.status === 'RECEIVED' 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-blue-600 hover:text-blue-700'}`}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                {po.status === 'SUBMITTED' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onApprovePO(po)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve PO
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewDetails(po, 'po')}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseOrdersTab;
