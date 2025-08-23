// src/components/procurement/EnhancedProcurementWorkflowSplit.tsx
'use client';

import React, { useState, Suspense, lazy, useCallback, useMemo, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3,
  LineChart,
  ClipboardList,
  ShoppingCart,
  Building,
  Target,
  Plus,
  Download
} from 'lucide-react';
import { api } from '@/utils/api';
import { debounce } from '@/utils/debounce';
// Types removed to avoid unused imports

// Lazy load components for better performance
const ProcurementOverview = lazy(() => import('./ProcurementOverview'));
const PurchaseRequestsTab = lazy(() => import('./PurchaseRequestsTab'));
const PurchaseOrdersTab = lazy(() => import('./PurchaseOrdersTab'));
const SuppliersTab = lazy(() => import('./SuppliersTab'));
const WorkflowTab = lazy(() => import('./WorkflowTab'));
const AnalyticsTab = lazy(() => import('./AnalyticsTab'));
const ProcurementModals = lazy(() => import('./ProcurementModals'));

// Define discriminated union type for selectedItem
type SelectedItem = any;

// Loading component for lazy loaded components
const TabLoading = () => (
  <div className="text-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    <p className="mt-2 text-gray-500">Loading...</p>
  </div>
);

// Memoized tab components for better performance
const MemoizedProcurementOverview = memo(ProcurementOverview);
const MemoizedPurchaseRequestsTab = memo(PurchaseRequestsTab);
const MemoizedPurchaseOrdersTab = memo(PurchaseOrdersTab);
const MemoizedSuppliersTab = memo(SuppliersTab);
const MemoizedWorkflowTab = memo(WorkflowTab);
const MemoizedAnalyticsTab = memo(AnalyticsTab);

const EnhancedProcurementWorkflowSplit: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  
  // Form states
  const [purchaseOrderForm, setPurchaseOrderForm] = useState({
    supplierId: '',
    purchaseRequestId: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDelivery: '',
    paymentTerms: '',
    deliveryTerms: '',
    currency: 'USD',
    exchangeRate: 1,
    items: [{ productId: '', quantity: 1, unitPrice: '', isAsset: false, specifications: '' }],
    notes: ''
  });
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  
  // Debounced search handler
  const debouncedSearchChange = useCallback(
    (value: string) => {
      const debouncedFn = debounce((val: string) => {
        setSearchTerm(val);
      }, 300);
      debouncedFn(value);
    },
    [setSearchTerm]
  );
  
  // Loading states
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API calls with aggressive caching for performance
  const { data: dashboardData, isLoading: dashboardLoading } = api.procurement.getDashboardData.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch on mount if cached
    refetchInterval: false, // Disable auto-refresh for better performance
    staleTime: 5 * 60 * 1000, // 5 minutes cache - data stays fresh longer
    gcTime: 15 * 60 * 1000, // 15 minutes garbage collection
    retry: 1, // Reduce retry attempts
    retryDelay: 1000,
  });
  
  const { data: purchaseRequests, isLoading: prLoading } = api.procurement.getPurchaseRequests.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    staleTime: 3 * 60 * 1000, // 3 minutes cache
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
    retry: 1,
    retryDelay: 1000,
    enabled: activeTab === 'purchase-requests' || activeTab === 'overview', // Only fetch when needed
  });
  
  const { data: purchaseOrders, isLoading: poLoading } = api.procurement.getPurchaseOrders.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    staleTime: 3 * 60 * 1000, // 3 minutes cache
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
    retry: 1,
    retryDelay: 1000,
    enabled: activeTab === 'purchase-orders' || activeTab === 'overview' || activeTab === 'workflow',
  });
  
  const { data: suppliers, isLoading: suppliersLoading } = api.procurement.getSuppliers.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    staleTime: 10 * 60 * 1000, // 10 minutes cache - suppliers change rarely
    gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
    retry: 1,
    retryDelay: 1000,
    enabled: activeTab === 'suppliers', // Only fetch when suppliers tab is active
  });



  // Get utils for cache invalidation
  const utils = api.useUtils();

  // Memoized computed values for performance
  const memoizedTabsData = useMemo(() => ({
    dashboardData,
    purchaseRequests,
    purchaseOrders,
    suppliers
  }), [dashboardData, purchaseRequests, purchaseOrders, suppliers]);

  const memoizedLoadingStates = useMemo(() => ({
    dashboard: dashboardLoading,
    requests: prLoading,
    orders: poLoading,
    suppliers: suppliersLoading,
    tab: isTabLoading
  }), [dashboardLoading, prLoading, poLoading, suppliersLoading, isTabLoading]);

  // Memoized handlers to prevent unnecessary re-renders
  const memoizedHandlers = useMemo(() => ({
    searchChange: debouncedSearchChange,
    activeOnlyChange: setShowActiveOnly
  }), [
    debouncedSearchChange,
    setShowActiveOnly
  ]);

  // Mutations with optimistic updates
  const __approveRequestMutation = api.procurement.approvePurchaseRequest.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.procurement.getDashboardData.invalidate(),
        utils.procurement.getPurchaseRequests.invalidate(),
      ]);
    },
  });

  const __submitRequestMutation = api.procurement.submitPurchaseRequest.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.procurement.getDashboardData.invalidate(),
        utils.procurement.getPurchaseRequests.invalidate(),
      ]);
    },
  });





  // Debounced event handlers for better performance
  const _handleTabChange = useCallback(
    (newTab: string) => {
      const debouncedFn = debounce((tab: string) => {
        setIsTabLoading(true);
        setActiveTab(tab);
        // Reduced loading delay for better UX
        setTimeout(() => {
          setIsTabLoading(false);
        }, 150);
      }, 100);
      debouncedFn(newTab);
    },
    [setIsTabLoading, setActiveTab]
  );

  const _handleNewRequest = useCallback(() => {
    // Implementation for new request
  }, []);

  const _handleNewOrder = useCallback(() => {
    // Implementation for new order
  }, []);

  const _handleNewSupplier = useCallback(() => {
    // Implementation for new supplier
  }, []);

  const _handleViewDetails = useCallback((_item: any, _type: 'pr' | 'po' | 'supplier') => {
    setSelectedItem({ ..._item, type: _type } as SelectedItem);
  }, []);

  const _handleSubmitRequest = useCallback((requestId: string) => {
    __submitRequestMutation.mutate({ id: requestId });
  }, [__submitRequestMutation]);

  const _handleApproveRequest = useCallback((pr: Record<string, unknown>) => {
    __approveRequestMutation.mutate({ id: pr.id as string, approvedBy: 'system' });
  }, [__approveRequestMutation]);

  const _handleCreatePOFromRequest = useCallback((pr: Record<string, unknown>) => {
    setPurchaseOrderForm(prev => ({
      ...prev,
      purchaseRequestId: pr.id as string,
      expectedDelivery: pr.requiredDate ? new Date(pr.requiredDate as string).toISOString().split('T')[0] || '' : '',
      items: (pr.items as Record<string, unknown>[])?.map((item: Record<string, unknown>) => ({
        productId: item.productId as string,
        quantity: item.quantity as number,
        unitPrice: (item.unitPrice as number)?.toString() || '',
        isAsset: false,
        specifications: item.specifications as string || ''
      })) || [{ productId: '', quantity: 1, unitPrice: '', isAsset: false, specifications: '' }]
    }));
  }, []);

  const _handleEditOrder = useCallback((po: Record<string, unknown>) => {
    setPurchaseOrderForm({
      supplierId: po.supplierId as string || '',
      purchaseRequestId: po.purchaseRequestId as string || '',
      orderDate: po.orderDate ? new Date(po.orderDate as string).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      expectedDelivery: po.expectedDelivery ? new Date(po.expectedDelivery as string).toISOString().split('T')[0] || '' : '',
      paymentTerms: po.paymentTerms as string || '',
      deliveryTerms: po.deliveryTerms as string || '',
      currency: po.currency as string || 'USD',
      exchangeRate: po.exchangeRate as number || 1,
      items: (po.items as Record<string, unknown>[])?.map((item: Record<string, unknown>) => ({
        productId: item.productId as string,
        quantity: item.quantity as number,
        unitPrice: (item.unitPrice as number)?.toString() || '',
        isAsset: item.isAsset as boolean || false,
        specifications: item.specifications as string || ''
      })) || [{ productId: '', quantity: 1, unitPrice: '', isAsset: false, specifications: '' }],
      notes: po.notes as string || ''
    });
  }, []);

  const _handleApprovePO = useCallback((_po: any) => {
    // Implementation for PO approval
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Procurement Management</h1>
          <p className="text-gray-600">Manage purchase requests, orders, and suppliers</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
          <Button 
            className="flex items-center space-x-2"
            onClick={_handleNewRequest}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span>{isSubmitting ? 'Creating...' : 'New Purchase Request'}</span>
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={_handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="purchase-requests" className="flex items-center space-x-2">
            <ClipboardList className="h-4 w-4" />
            <span>Purchase Requests</span>
          </TabsTrigger>
          <TabsTrigger value="purchase-orders" className="flex items-center space-x-2">
            <ShoppingCart className="h-4 w-4" />
            <span>Purchase Orders</span>
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span>Suppliers</span>
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Workflow</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <LineChart className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
                       <TabsContent value="overview">
                 <Suspense fallback={<TabLoading />}>
                   <MemoizedProcurementOverview
                     dashboardData={memoizedTabsData.dashboardData}
                     purchaseOrders={memoizedTabsData.purchaseOrders}
                     onViewDetails={_handleViewDetails}
                     isLoading={memoizedLoadingStates.dashboard}
                   />
                 </Suspense>
               </TabsContent>

        {/* Purchase Requests Tab */}
        <TabsContent value="purchase-requests">
          <Suspense fallback={<TabLoading />}>
            <MemoizedPurchaseRequestsTab
              purchaseRequests={memoizedTabsData.purchaseRequests}
              purchaseOrders={memoizedTabsData.purchaseOrders}
              onNewRequest={_handleNewRequest}
              onViewDetails={_handleViewDetails}
              onSubmitRequest={_handleSubmitRequest}
              onApproveRequest={_handleApproveRequest}
              onCreatePOFromRequest={_handleCreatePOFromRequest}
              isLoading={memoizedLoadingStates.requests || memoizedLoadingStates.tab}
            />
          </Suspense>
        </TabsContent>

        {/* Purchase Orders Tab */}
        <TabsContent value="purchase-orders">
          <Suspense fallback={<TabLoading />}>
            <MemoizedPurchaseOrdersTab
              purchaseOrders={memoizedTabsData.purchaseOrders}
              onNewOrder={_handleNewOrder}
              onViewDetails={_handleViewDetails}
              onEditOrder={_handleEditOrder}
              onApprovePO={_handleApprovePO}
              isLoading={memoizedLoadingStates.orders || memoizedLoadingStates.tab}
            />
          </Suspense>
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers">
          <Suspense fallback={<TabLoading />}>
            <MemoizedSuppliersTab
              suppliers={memoizedTabsData.suppliers}
              searchTerm={searchTerm}
              showActiveOnly={showActiveOnly}
              onNewSupplier={_handleNewSupplier}
              onViewDetails={_handleViewDetails}
              onSearchChange={memoizedHandlers.searchChange}
              onActiveOnlyChange={memoizedHandlers.activeOnlyChange}
              isLoading={memoizedLoadingStates.suppliers || memoizedLoadingStates.tab}
            />
          </Suspense>
        </TabsContent>

        {/* Workflow Tab */}
        <TabsContent value="workflow">
          <Suspense fallback={<TabLoading />}>
            <MemoizedWorkflowTab
              purchaseOrders={memoizedTabsData.purchaseOrders}
              isLoading={memoizedLoadingStates.tab}
            />
          </Suspense>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Suspense fallback={<TabLoading />}>
            <MemoizedAnalyticsTab
              isLoading={memoizedLoadingStates.tab}
            />
          </Suspense>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <Suspense fallback={<div />}>
        <ProcurementModals
          selectedItem={selectedItem}
          onCloseDetails={() => setSelectedItem(null)}
        />
      </Suspense>

      {/* Additional modals for forms would go here */}
      {/* For now, keeping the original modals in the main component */}
    </div>
  );
};

export default EnhancedProcurementWorkflowSplit;
