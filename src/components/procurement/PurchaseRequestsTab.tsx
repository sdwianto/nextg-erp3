// src/components/procurement/PurchaseRequestsTab.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/ui/skeleton';
import { 
  Plus,
  Eye,
  Send,
  CheckSquare,
  ShoppingCart
} from 'lucide-react';

interface PurchaseRequestsTabProps {
  purchaseRequests: any;
  purchaseOrders: any;
  onNewRequest: () => void;
  onViewDetails: (_item: any, _type: 'pr' | 'po' | 'supplier') => void;
  onSubmitRequest: (requestId: string) => void;
  onApproveRequest: (_pr: any) => void;
  onCreatePOFromRequest: (_pr: any) => void;
  isLoading: boolean;
}

const PurchaseRequestsTab: React.FC<PurchaseRequestsTabProps> = ({
  purchaseRequests,
  purchaseOrders,
  onNewRequest,
  onViewDetails,
  onSubmitRequest,
  onApproveRequest,
  onCreatePOFromRequest,
  isLoading
}) => {
  const _getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
      case 'UNDER_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const _getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-100 text-gray-800';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Purchase Requests</span>
            <Button disabled className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Request</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TableSkeleton rows={5} columns={4} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Purchase Requests</span>
          <Button 
            className="flex items-center space-x-2"
            onClick={onNewRequest}
          >
            <Plus className="h-4 w-4" />
            <span>New Request</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Debug: Purchase Requests Data - can be removed in production */}
          {purchaseRequests?.data && purchaseRequests.data.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No Purchase Requests found. Create your first request!</p>
            </div>
          )}
          {(purchaseRequests?.data as any[])
            ?.filter((pr: any) => {
              // Hide PRs that already have Purchase Orders
              const _hasPurchaseOrder = (purchaseOrders?.data as any[])?.some((po: any) => 
                po.purchaseRequestId === pr.id
              );
              return !_hasPurchaseOrder;
            })
            ?.map((pr: any) => {
            return (
            <div key={pr.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium">{pr.prNumber}</span>
                  <Badge className={_getStatusColor(pr.status)}>
                    {pr.status}
                  </Badge>
                  <Badge className={_getPriorityColor(pr.priority)}>
                    {pr.priority}
                  </Badge>
                </div>
                <h3 className="font-medium">{pr.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{pr.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>Budget: ${pr.estimatedBudget?.toLocaleString()}</span>
                  <span>Required: {new Date(pr.requiredDate).toLocaleDateString()}</span>
                  <span>Items: {pr.items?.length || 0}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Debug: Show status */}
                <span className="text-xs text-gray-500">Status: {pr.status}</span>
                
                {pr.status === 'DRAFT' && (
                  <Button 
                    size="sm" 
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => onSubmitRequest(pr.id)}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Submit
                  </Button>
                )}
                {pr.status === 'SUBMITTED' && (
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => onApproveRequest(pr)}
                  >
                    <CheckSquare className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                )}
                {pr.status === 'APPROVED' && (
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => onCreatePOFromRequest(pr)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Create PO
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewDetails(pr, 'pr')}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseRequestsTab;
