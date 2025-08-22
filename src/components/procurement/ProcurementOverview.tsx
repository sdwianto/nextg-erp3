// src/components/procurement/ProcurementOverview.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatCardSkeleton, CardSkeleton } from '@/components/ui/skeleton';
import { 
  ClipboardList,
  ShoppingCart,
  DollarSign,
  Clock,
  Eye
} from 'lucide-react';
// Helper functions for safe type assertions
const safeNumber = (value: unknown): number => {
  return typeof value === 'number' ? value : 0;
};

interface ProcurementOverviewProps {
  dashboardData: any;
  purchaseOrders: any;
  onViewDetails: (_item: any, _type: 'pr' | 'po' | 'supplier') => void;
  isLoading: boolean;
}

const ProcurementOverview: React.FC<ProcurementOverviewProps> = ({
  dashboardData,
  purchaseOrders,
  onViewDetails,
  isLoading
}) => {
  const _getStats = () => dashboardData?.stats;
  const _data = dashboardData;

  const _getStatusColor = (status: string) => {
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
      <div className="space-y-6">
        {/* Loading Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        
        {/* Recent Activities Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Purchase Requests</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeNumber(_getStats()?.purchaseRequests)}</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Change:</span>
                <span className="font-medium">
                  {_getStats()?.prChangePercent !== undefined && (
                    <>
                      {safeNumber(_getStats()?.prChangePercent) > 0 ? '+' : ''}{safeNumber(_getStats()?.prChangePercent)}%
                    </>
                  )}
                  {_getStats()?.prChangePercent === undefined && '+0%'}
                </span>
              </div>
              {_getStats()?.rejectedPRs !== undefined && safeNumber(_getStats()?.rejectedPRs) > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Rejected:</span>
                  <span className="font-medium">{safeNumber(_getStats()?.rejectedPRs)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Purchase Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeNumber(_getStats()?.purchaseOrders)}</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Change:</span>
                <span className="font-medium">
                  {_getStats()?.poChangePercent !== undefined && (
                    <>
                      {safeNumber(_getStats()?.poChangePercent) > 0 ? '+' : ''}{safeNumber(_getStats()?.poChangePercent)}%
                    </>
                  )}
                  {_getStats()?.poChangePercent === undefined && '+0%'}
                </span>
              </div>
              {_getStats()?.rejectedPOs !== undefined && safeNumber(_getStats()?.rejectedPOs) > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Rejected:</span>
                  <span className="font-medium">{safeNumber(_getStats()?.rejectedPOs)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${safeNumber(_getStats()?.totalSpend).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {_getStats()?.spendChangePercent !== undefined && (
                <>
                  {safeNumber(_getStats()?.spendChangePercent) > 0 ? '+' : ''}{safeNumber(_getStats()?.spendChangePercent)}% from last month
                </>
              )}
              {_getStats()?.spendChangePercent === undefined && '+0% from last month'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeNumber(_getStats()?.pendingApprovals)}</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>PR Approvals:</span>
                <span className="font-medium">{safeNumber(_getStats()?.pendingPRApprovals)}</span>
              </div>
              <div className="flex justify-between">
                <span>PO Approvals:</span>
                <span className="font-medium">{safeNumber(_getStats()?.pendingPOApprovals)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Purchase Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ClipboardList className="h-5 w-5" />
              <span>Recent Purchase Requests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(_data.recentPurchaseRequests as any[])
                ?.filter((pr: any) => {
                  // Hide PRs that already have Purchase Orders (any status)
                  const _hasPurchaseOrder = (purchaseOrders?.data as any[])?.some((po: any) => 
                    po.purchaseRequestId === pr.id
                  );
                  return !_hasPurchaseOrder;
                })
                ?.slice(0, 5).map((pr: any) => (
                <div key={pr.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{pr.prNumber}</span>
                      <Badge className={_getStatusColor(pr.status)}>
                        {pr.status}
                      </Badge>
                      <Badge className={_getPriorityColor(pr.priority)}>
                        {pr.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{pr.title}</p>
                    <p className="text-xs text-gray-500">
                      Required: {new Date(pr.requiredDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onViewDetails(pr, 'pr')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Purchase Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Recent Purchase Orders</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(_data.recentPurchaseOrders as any[])?.slice(0, 5).map((po: any) => (
                <div key={po.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{po.poNumber}</span>
                      <Badge className={_getStatusColor(po.status)}>
                        {po.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{po.supplier?.name}</p>
                    <p className="text-xs text-gray-500">
                      ${po.grandTotal?.toLocaleString()} • {new Date(po.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onViewDetails(po, 'po')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProcurementOverview;
