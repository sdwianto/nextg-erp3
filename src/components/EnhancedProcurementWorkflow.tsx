// src/components/EnhancedProcurementWorkflow.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Building,
  Package,
  Eye,
  Download,
  Plus,
  CheckCircle,
  Clock,
  Target,
  ShoppingCart,
  Truck,
  DollarSign,
  BarChart3,
  LineChart,
  ClipboardList,
  CheckSquare,
  X,
  Edit,
  Send
} from 'lucide-react';
import { api } from '@/utils/api';
import type { 
  PurchaseRequest, 
  PurchaseOrder, 
  PurchaseOrderItem,
  Supplier,
  Product
} from '@/types/api';

// Define discriminated union type for selectedItem
type SelectedItem =
  | (PurchaseRequest & { type: 'pr' })
  | (PurchaseOrder & { type: 'po' })
  | (Supplier & { type: 'supplier' });



// Helper functions for safe type assertions
// Utility functions for safe type conversion
const safeNumber = (value: unknown): number => {
  return typeof value === 'number' ? value : 0;
};

const EnhancedProcurementWorkflow: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  // const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showNewSupplierModal, setShowNewSupplierModal] = useState(false);
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  
  // Form states
  const [purchaseRequestForm, setPurchaseRequestForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    requiredDate: '',
    estimatedBudget: '',
    department: '',
    costCenter: '',
    items: [{ productId: '', quantity: 1, unitPrice: '', specifications: '', urgency: 'NORMAL' }]
  });
  
  const [purchaseOrderForm, setPurchaseOrderForm] = useState({
    supplierId: '',
    purchaseRequestId: '', // Add this field
    orderDate: new Date().toISOString().split('T')[0],
    expectedDelivery: '',
    paymentTerms: '',
    deliveryTerms: '',
    currency: 'USD',
    exchangeRate: 1,
    items: [{ productId: '', quantity: 1, unitPrice: '', isAsset: false, specifications: '' }], // Add specifications
    notes: ''
  });
  
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    code: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    taxNumber: ''
  });

  const [productForm, setProductForm] = useState({
    name: '',
    code: '',
    sku: '', // Will be auto-generated
    description: '',
    categoryId: '',
    price: '',
    costPrice: '',
    minStockLevel: 0,
    maxStockLevel: 1000,
    unitOfMeasure: 'PCS',
    isService: false
  });

  // Supplier search state
  const [supplierSearch, setSupplierSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);


  const [isLoadingSupplierCode, setIsLoadingSupplierCode] = useState(false);

  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [editingPoId, setEditingPoId] = useState<string | null>(null); // Track which PO is being edited
  const [showPOApprovalDialog, setShowPOApprovalDialog] = useState(false); // PO approval dialog
  const [poToApprove, setPoToApprove] = useState<PurchaseOrder | null>(null); // PO data for approval
  const [showRejectDialog, setShowRejectDialog] = useState(false); // PO rejection dialog
  const [rejectReason, setRejectReason] = useState(''); // Reason for rejection
  const [showPRApprovalDialog, setShowPRApprovalDialog] = useState(false); // PR approval dialog
  const [prToApprove, setPrToApprove] = useState<PurchaseRequest | null>(null); // PR data for approval
  const [showPRRejectDialog, setShowPRRejectDialog] = useState(false); // PR rejection dialog
  const [prRejectReason, setPrRejectReason] = useState(''); // PR rejection reason

  // Function to get PO button text based on status
  const _getPOButtonText = () => {
    if (!editingPoId) return 'Update Order';
    
    // Find the PO being edited
    const _currentPO = purchaseOrders?.data?.find((po: Record<string, unknown>) => po.id === editingPoId);
      if (!_currentPO) return 'Update Order';
  
  switch (_currentPO.status) {
      case 'DRAFT':
        return 'Submit PO';
      case 'SUBMITTED':
        return 'Approve PO';
      case 'APPROVED':
        return 'Send to Supplier';
      default:
        return 'Update Order';
    }
  };

  // API calls
  const { data: dashboardData, isLoading: dashboardLoading } = api.procurement.getDashboardData.useQuery(undefined, {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 5000, // Auto-refresh every 5 seconds for real-time updates
    staleTime: 0, // Always fetch fresh data
  });
  const { data: purchaseRequests, isLoading: prLoading } = api.procurement.getPurchaseRequests.useQuery(undefined, {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
    staleTime: 0,
  });
  const { data: purchaseOrders, isLoading: poLoading } = api.procurement.getPurchaseOrders.useQuery(undefined, {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
    staleTime: 0,
  });
  const { data: suppliers, isLoading: suppliersLoading, refetch: refetchSuppliers } = api.procurement.getSuppliers.useQuery(undefined, {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 2000, // Auto-refresh every 2 seconds for real-time updates
    staleTime: 0, // Always fetch fresh data
    refetchOnReconnect: true,
  });

  // Force refetch on component mount
  React.useEffect(() => {
    refetchSuppliers();
  }, [refetchSuppliers]);
  
  // Filter suppliers based on search term and active status
  const _filteredSuppliers = useMemo(() => {
    if (!suppliers?.data) return [];
    
    return suppliers.data.filter((supplier) => {
      const _matchesSearch = (supplier.name as string)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (supplier.contactPerson as string)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (supplier.email as string)?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const _matchesActiveFilter = !showActiveOnly || supplier.isActive;
      
      return _matchesSearch && _matchesActiveFilter;
    });
  }, [suppliers?.data, searchTerm, showActiveOnly]);
  
  // Debug: Log suppliers data structure (can be removed in production)
  // console.log('Suppliers data:', suppliers);
  // console.log('Suppliers type:', typeof suppliers);
  // console.log('Is Array:', Array.isArray(suppliers));
  // console.log('Suppliers.data:', suppliers?.data);
  // console.log('Suppliers.data is Array:', Array.isArray(suppliers?.data));
  const { data: products, isLoading: productsLoading } = api.procurement.getProducts.useQuery();

  // Filter products based on search
  const _filteredProducts = products?.data?.filter((product: Record<string, unknown>) => 
    (product.name as string)?.toLowerCase().includes(productSearch.toLowerCase()) ||
    (product.code as string)?.toLowerCase().includes(productSearch.toLowerCase()) ||
    (product.sku as string)?.toLowerCase().includes(productSearch.toLowerCase())
  ) || [];

  // Limit to 5 products for dropdown
  const _displayProducts = _filteredProducts.slice(0, 5);



  // Mutations
  const __approveRequestMutation = api.procurement.approvePurchaseRequest.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  const __submitRequestMutation = api.procurement.submitPurchaseRequest.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  const _createPurchaseRequestMutation = api.procurement.createPurchaseRequest.useMutation({
    onSuccess: () => {
      setShowNewRequestModal(false);
      setPurchaseRequestForm({
        title: '',
        description: '',
        priority: 'MEDIUM',
        requiredDate: '',
        estimatedBudget: '',
        department: '',
        costCenter: '',
        items: [{ productId: '', quantity: 1, unitPrice: '', specifications: '', urgency: 'NORMAL' }]
      });
      window.location.reload();
    },
  });

  const _createPurchaseOrderMutation = api.procurement.createPurchaseOrder.useMutation({
    onSuccess: async () => {
      // Invalidate all related queries to refresh the UI
      await Promise.all([
        _utils.procurement.getDashboardData.invalidate(),
        _utils.procurement.getPurchaseRequests.invalidate(),
        _utils.procurement.getPurchaseOrders.invalidate(),
      ]);
      
      setShowNewOrderModal(false);
      setPurchaseOrderForm({
        supplierId: '',
        purchaseRequestId: '', // Reset PR ID when creating new order
        orderDate: new Date().toISOString().split('T')[0],
        expectedDelivery: '',
        paymentTerms: '',
        deliveryTerms: '',
        currency: 'USD',
        exchangeRate: 1,
        items: [{ productId: '', quantity: 1, unitPrice: '', isAsset: false, specifications: '' }],
        notes: ''
      });
      
      // Show success message
      // console.log(`Purchase Order created successfully! PO ID: ${newPO.id}`);
    },
    onError: () => {
      // console.error('Error creating purchase order:', error);
      // console.log(`Failed to create purchase order: ${error.message}`);
    },
  });

  const _updatePurchaseOrderMutation = api.procurement.updatePurchaseOrder.useMutation({
    onSuccess: async () => {
      // Invalidate all related queries to refresh the UI
      await Promise.all([
        _utils.procurement.getDashboardData.invalidate(),
        _utils.procurement.getPurchaseRequests.invalidate(),
        _utils.procurement.getPurchaseOrders.invalidate(),
        _utils.procurement.getSuppliers.invalidate(), // Add suppliers invalidation
      ]);
      
      setShowNewOrderModal(false);
      setEditingPoId(null); // Reset editing PO ID
      setPurchaseOrderForm({
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
      
      // Show success message
      // console.log(`Purchase Order updated successfully! PO ID: ${updatedPO.id}`);
    },
    onError: () => {
      // console.error('Error updating purchase order:', error);
      // console.log(`Failed to update purchase order: ${error.message}`);
    },
  });

  const _rejectPurchaseOrderMutation = api.procurement.rejectPurchaseOrder.useMutation({
    onSuccess: async () => {
      try {
        // Force refetch all data
        await Promise.all([
          _utils.procurement.getDashboardData.invalidate(),
          _utils.procurement.getPurchaseRequests.invalidate(),
          _utils.procurement.getPurchaseOrders.invalidate(),
        ]);
        
        // Force refetch dashboard data
        await _utils.procurement.getDashboardData.refetch();
        
        setShowRejectDialog(false);
        setShowPOApprovalDialog(false); // Also close the approval dialog
        setRejectReason('');
        setPoToApprove(null);
        
        // console.log(`Purchase Order rejected successfully! PO ID: ${rejectedPO.id}`);
        // console.log('Purchase Order rejected successfully! Dashboard updated.');
        
        // Force page reload as fallback to ensure dashboard updates
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch {
        // console.error('Error updating dashboard after rejection:', error);
        // Fallback to page reload
        window.location.reload();
      }
    },
    onError: () => {
      // console.error('Error rejecting purchase order:', error);
      // console.log(`Failed to reject purchase order: ${error.message}`);
    },
  });



  const _utils = api.useUtils();

  const getNextSupplierCodeMutation = api.procurement.getNextSupplierCode.useMutation();

  const _handleNewProduct = (itemIndex?: number) => {
    setShowNewProductModal(true);
    setEditingItemIndex(itemIndex ?? null);
  };

  const __createSupplierMutation = api.procurement.createSupplier.useMutation({
    onSuccess: async (newSupplier) => {
      await _utils.procurement.getSuppliers.invalidate();
      setSupplierForm({
        name: '',
        code: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        taxNumber: ''
      });

      // auto-select on PO form and bring the user back to PO dialog
      setPurchaseOrderForm(prev => ({ ...prev, supplierId: newSupplier.id }));
      setShowNewSupplierModal(false);
      setShowNewOrderModal(true);
    },
    onError: () => {
      // console.error('Error creating supplier:', error);
      // console.log(`Failed to create supplier: ${error.message}`);
    },
  });

  const __createProductMutation = api.procurement.createProduct.useMutation({
    onSuccess: async (newProduct) => {
      // Invalidate products query to refresh the list
      await _utils.procurement.getProducts.invalidate();
      
      setShowNewProductModal(false);
      setProductForm({
        name: '',
        code: '',
        sku: '', // Will be auto-generated
        description: '',
        categoryId: '',
        price: '',
        costPrice: '',
        minStockLevel: 0,
        maxStockLevel: 1000,
        unitOfMeasure: 'PCS',
        isService: false
      });
      
      // Show success message
      // console.log(`Product "${newProduct.name}" created successfully!`);
      
      // Auto-select the newly created product in the current item and fill specifications
      if (editingItemIndex !== null && purchaseRequestForm.items.length > editingItemIndex) {
        const _productDetails = `Product Name: ${newProduct.name}\nProduct Code: ${newProduct.code}\nSKU: ${newProduct.sku}\nDescription: ${newProduct.description || 'No description available'}\nUnit of Measure: ${newProduct.unitOfMeasure}\nPrice: $${(newProduct.price / 100).toLocaleString()}\nCost Price: $${(newProduct.costPrice / 100).toLocaleString()}`;
        
        setPurchaseRequestForm(prev => ({
          ...prev,
          items: prev.items.map((item, index) => 
            index === editingItemIndex 
              ? { ...item, productId: newProduct.id, specifications: _productDetails }
              : item
          )
        }));
      }
      
      // Also handle PO form if editing PO item
      if (editingItemIndex !== null && purchaseOrderForm.items.length > editingItemIndex) {
        const _productDetails = `Product Name: ${newProduct.name}\nProduct Code: ${newProduct.code}\nSKU: ${newProduct.sku}\nDescription: ${newProduct.description || 'No description available'}\nUnit of Measure: ${newProduct.unitOfMeasure}\nPrice: $${(newProduct.price / 100).toLocaleString()}\nCost Price: $${(newProduct.costPrice / 100).toLocaleString()}`;
        
        setPurchaseOrderForm(prev => ({
          ...prev,
          items: prev.items.map((item, index) => 
            index === editingItemIndex 
              ? { ...item, productId: newProduct.id, specifications: _productDetails }
              : item
          )
        }));
      }
      
      setEditingItemIndex(null); // Reset editing index
      
      // Keep the dialog open (PR or PO)
      // The user can now continue with the form
    },
    onError: () => {
      // console.error(`Error creating product: ${error.message}`);
    }
  });

  // Helper functions
  const _handleApproveRequest = (pr: Record<string, unknown>) => {
    // console.log('Opening PR approval dialog for:', pr);
    setPrToApprove(pr as unknown as PurchaseRequest);
    setShowPRApprovalDialog(true);
  };

  const _handleSubmitRequest = (requestId: string) => {
    // console.log('Submitting purchase request:', requestId);
    __submitRequestMutation.mutate({
      id: requestId
    }, {
      onSuccess: () => {
        // console.log('Purchase request submitted successfully:', data);
      },
      onError: () => {
        // console.error('Error submitting purchase request:', error);
      }
    });
  };

  const _handleViewDetails = (item: Record<string, unknown>, type: 'pr' | 'po' | 'supplier') => {
    setSelectedItem({ ...item, type } as SelectedItem);
    // You can implement a modal or navigation here
    // console.log('View details:', item, type);
  };

  const _handleNewRequest = () => {
    setShowNewRequestModal(true);
    setProductSearch(''); // Reset search when opening dialog
  };

  const _handleNewOrder = () => {
    setEditingPoId(null); // Reset editing PO ID for new PO
    setShowNewOrderModal(true);
    setProductSearch(''); // Reset search when opening dialog
  };

  const _handleEditOrder = (po: Record<string, unknown>) => {
    // console.log('Editing PO:', po.poNumber, 'Has PR:', !!po.purchaseRequest); // Debug log
    
    // Store the PO ID being edited
    setEditingPoId(po.id as string);
    
    // Populate form with existing PO data
    setPurchaseOrderForm({
      supplierId: (po.supplierId as string) || '',
      purchaseRequestId: (po.purchaseRequestId as string) || '', // Preserve PR ID
      orderDate: po.orderDate ? new Date(po.orderDate as string).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      expectedDelivery: po.expectedDelivery ? new Date(po.expectedDelivery as string).toISOString().split('T')[0] || '' : '',
      paymentTerms: (po.paymentTerms as string) || '',
      deliveryTerms: (po.deliveryTerms as string) || '',
      currency: (po.currency as string) || 'USD',
      exchangeRate: typeof po.exchangeRate === 'number' ? po.exchangeRate : 1,
            items: (po.items as PurchaseOrderItem[])?.map((item: PurchaseOrderItem) => {
        // Check if PO was created from PR and enhance specifications
        let _enhancedSpecs = (item.specifications as string) || '';
        
        // If item has productId but no specifications, auto-fill with product details
        if (item.productId && !_enhancedSpecs) {
          const _selectedProduct = products?.data?.find((p: Product) => p.id === item.productId);
                if (_selectedProduct) {
        _enhancedSpecs = `Product Name: ${_selectedProduct.name}\nProduct Code: ${_selectedProduct.code}\nSKU: ${_selectedProduct.sku}\nDescription: ${_selectedProduct.description || 'No description available'}\nUnit of Measure: ${_selectedProduct.unitOfMeasure}\nPrice: $${(_selectedProduct.price / 100).toLocaleString()}\nCost Price: $${(_selectedProduct.costPrice / 100).toLocaleString()}`;
      }
        }
        
        if (po.purchaseRequest && !_enhancedSpecs.includes('Source PR:')) {
          // If PO has PR but specifications don't have PR details, add them
          const _pr = po.purchaseRequest as Record<string, unknown>;
          const _prDetails = `Source PR: ${_pr.prNumber}\nPR Title: ${_pr.title}\nPR Priority: ${_pr.priority}\nRequired Date: ${new Date(_pr.requiredDate as string).toLocaleDateString()}\nBudget: ${(_pr.estimatedBudget as number)?.toLocaleString()}`;
          
                             _enhancedSpecs = _enhancedSpecs
            ? `${_prDetails}\n\nProduct Details:\n${_enhancedSpecs}`
            : _prDetails;
        }
        
        return {
          productId: (item.productId as string) || '',
          quantity: (item.quantity as number) || 1,
          unitPrice: (item.unitPrice as number)?.toString() || '',
          isAsset: (item.isAsset as boolean) || false,
          specifications: _enhancedSpecs
        };
      }) || [{ productId: '', quantity: 1, unitPrice: '', isAsset: false, specifications: '' }],
      notes: (po.notes as string) || ''
    });
    setShowNewOrderModal(true);
    setProductSearch(''); // Reset search when opening dialog
  };

  const _handleCreatePOFromRequest = (pr: Record<string, unknown>) => {
    // console.log('Creating PO from PR:', pr.prNumber, 'PR ID:', pr.id); // Debug log
    
    setEditingPoId(null); // Reset editing PO ID for new PO from PR
    
    // Populate PO form with data from Purchase Request
    setPurchaseOrderForm({
      supplierId: '', // Will be selected by user
      purchaseRequestId: pr.id as string, // Store PR ID for backend link
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: pr.requiredDate ? new Date(pr.requiredDate as string).toISOString().split('T')[0] || '' : '',
      paymentTerms: '',
      deliveryTerms: '',
      currency: 'USD',
      exchangeRate: 1,
      items: (pr.items as Record<string, unknown>[])?.map((item: Record<string, unknown>) => {
        // Create enhanced specifications with PR details
        const _prDetails = `Source PR: ${pr.prNumber}\nPR Title: ${pr.title}\nPR Priority: ${pr.priority}\nRequired Date: ${new Date(pr.requiredDate as string).toLocaleDateString()}\nBudget: ${(pr.estimatedBudget as number)?.toLocaleString()}`;
        
        // Get product details if productId exists
        let _productDetails = '';
        if (item.productId) {
          const _selectedProduct = products?.data?.find((p: Product) => p.id === item.productId);
          if (_selectedProduct) {
            _productDetails = `\n\nProduct Details:\nProduct Name: ${_selectedProduct.name}\nProduct Code: ${_selectedProduct.code}\nSKU: ${_selectedProduct.sku}\nDescription: ${_selectedProduct.description || 'No description available'}\nUnit of Measure: ${_selectedProduct.unitOfMeasure}\nPrice: $${(_selectedProduct.price / 100).toLocaleString()}\nCost Price: $${(_selectedProduct.costPrice / 100).toLocaleString()}`;
          }
        }
        
        const _originalSpecs = item.specifications || '';
        const _enhancedSpecs = _originalSpecs 
          ? `${_prDetails}${_productDetails}\n\nOriginal Specifications:\n${_originalSpecs}`
          : `${_prDetails}${_productDetails}`;
        
        return {
          productId: (item.productId as string) || '',
          quantity: (item.quantity as number) || 1,
          unitPrice: (item.unitPrice as string)?.toString() || '',
          isAsset: false, // PR items don't have isAsset property, default to false
          specifications: _enhancedSpecs
        };
      }) || [{ productId: '', quantity: 1, unitPrice: '', isAsset: false, specifications: '' }],
      notes: `Created from Purchase Request: ${pr.prNumber} - ${pr.title}`
    });
    setShowNewOrderModal(true);
    setProductSearch(''); // Reset search when opening dialog
  };

  const _handleApprovePO = (po: Record<string, unknown>) => {
    // console.log('Approving PO:', po);
    // Convert exchangeRate to number if it's a string
    const _poData = {
      ...po,
      exchangeRate: typeof po.exchangeRate === 'string' ? parseFloat(po.exchangeRate) : po.exchangeRate
    } as PurchaseOrder;
    setPoToApprove(_poData);
    setShowPOApprovalDialog(true);
  };

  const _handleSupplierSubmit = () => {
    // console.log('handleSupplierSubmit called');
    // console.log('Supplier form data:', supplierForm);
    
    // Validate required fields
    if (!supplierForm.name.trim()) {
      // console.log('Supplier name is required');
      return;
    }



    const _formData = {
      name: supplierForm.name.trim(),
      code: supplierForm.code.trim(),
      email: supplierForm.email || undefined,
      phone: supplierForm.phone || undefined,
      address: supplierForm.address || undefined,
      contactPerson: supplierForm.contactPerson || undefined,
      taxNumber: supplierForm.taxNumber || undefined,
      paymentTerms: undefined, // Not in form yet
    };

    // console.log('Submitting supplier data:', formData);
    __createSupplierMutation.mutate(_formData);
  };



  const _handleNewSupplier = () => {
    setIsLoadingSupplierCode(true);
    // 1) BUKA Supplier (biar auto-focus pindah ke dialog baru)
    setShowNewSupplierModal(true);
    getNextSupplierCodeMutation.mutate(undefined, {
      onSuccess: (nextCode) => {
        setSupplierForm(prev => ({ ...prev, code: nextCode }));
        setIsLoadingSupplierCode(false);
      },
      onError: () => {
        // console.error('Error getting next supplier code:', error);
        setSupplierForm(prev => ({ ...prev, code: 'NGSP-001' }));
        setIsLoadingSupplierCode(false);
      }
    });
    // 2) BARU tutup PO di frame berikutnya agar tidak ada fase "aria-hidden sementara tapi masih fokus"
    requestAnimationFrame(() => setShowNewOrderModal(false));
  };

  // Form handlers
  const _handlePurchaseRequestSubmit = () => {
    // Validate required fields
    if (!purchaseRequestForm.title.trim()) {
      // console.log('Title is required');
      return;
    }

    if (!purchaseRequestForm.requiredDate) {
      // console.log('Required date is required');
      return;
    }

    if (!purchaseRequestForm.estimatedBudget || parseFloat(purchaseRequestForm.estimatedBudget) <= 0) {
      // console.log('Valid estimated budget is required');
      return;
    }

    // Validate items
    const _validItems = purchaseRequestForm.items.filter(item => 
      item.productId && item.productId.trim() !== '' && 
      item.quantity && item.quantity > 0
    );

    if (_validItems.length === 0) {
      // console.log('At least one valid item is required');
      return;
    }

    const _formData = {
      title: purchaseRequestForm.title.trim(),
      description: purchaseRequestForm.description || '',
      priority: purchaseRequestForm.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
      requiredDate: new Date(purchaseRequestForm.requiredDate),
      estimatedBudget: parseFloat(purchaseRequestForm.estimatedBudget),
      department: purchaseRequestForm.department || '',
      costCenter: purchaseRequestForm.costCenter || '',
      items: _validItems.map(item => ({
        productId: item.productId.trim(),
        quantity: parseInt(item.quantity.toString()),
        unitPrice: item.unitPrice && item.unitPrice.trim() !== '' ? parseFloat(item.unitPrice) : undefined,
        specifications: item.specifications || '',
        urgency: item.urgency as 'NORMAL' | 'LOW' | 'HIGH' | 'URGENT'
      }))
    };

    _createPurchaseRequestMutation.mutate(_formData);
  };

  const _handlePurchaseOrderSubmit = () => {
    // Validate required fields
    if (!purchaseOrderForm.supplierId.trim()) {
      // console.log('Supplier is required');
      return;
    }

    if (!purchaseOrderForm.orderDate) {
      // console.log('Order date is required');
      return;
    }

    if (!purchaseOrderForm.expectedDelivery) {
      // console.log('Expected delivery date is required');
      return;
    }

    // Validate items
    const _validItems = purchaseOrderForm.items.filter(item => 
      item.productId && item.productId.trim() !== '' && 
      item.quantity && item.quantity > 0 &&
      item.unitPrice && parseFloat(item.unitPrice) > 0
    );

    if (_validItems.length === 0) {
      // console.log('At least one valid item with price is required');
      return;
    }

    const _formData = {
      supplierId: purchaseOrderForm.supplierId.trim(),
      purchaseRequestId: purchaseOrderForm.purchaseRequestId || undefined,
      orderDate: new Date(purchaseOrderForm.orderDate),
      expectedDelivery: new Date(purchaseOrderForm.expectedDelivery),
      paymentTerms: purchaseOrderForm.paymentTerms || '',
      deliveryTerms: purchaseOrderForm.deliveryTerms || '',
      currency: purchaseOrderForm.currency,
      exchangeRate: parseFloat(purchaseOrderForm.exchangeRate.toString()),
      notes: purchaseOrderForm.notes || '',
      items: _validItems.map(item => ({
        productId: item.productId.trim(),
        quantity: parseInt(item.quantity.toString()),
        unitPrice: parseFloat(item.unitPrice.toString()),
        isAsset: item.isAsset || false,
        specifications: item.specifications || '' // Include specifications
      }))
    };

    // console.log('Submitting PO form data:', formData); // Debug log
    
    // Check if we're editing an existing PO or creating a new one
    if (editingPoId) {
      // Find the current PO to check its status
      const _currentPO = purchaseOrders?.data?.find((po: Record<string, unknown>) => po.id === editingPoId);
      const _currentStatus = _currentPO?.status || 'DRAFT';
      
      // console.log('Current PO status:', _currentStatus);
      
      if (_currentStatus === 'DRAFT') {
        // Submit PO for approval
        // console.log('Submitting PO for approval');
        const _updateData = {
          id: editingPoId,
          supplierId: _formData.supplierId,
          purchaseRequestId: _formData.purchaseRequestId,
          orderDate: _formData.orderDate,
          expectedDelivery: _formData.expectedDelivery,
          paymentTerms: _formData.paymentTerms,
          deliveryTerms: _formData.deliveryTerms,
          currency: _formData.currency,
          exchangeRate: _formData.exchangeRate,
          notes: _formData.notes,
          items: _formData.items
        };
        
        _updatePurchaseOrderMutation.mutate(_updateData, {
          onSuccess: () => {
            // console.log('PO submitted successfully:', data);
            // console.log('Purchase Order submitted for approval!');
          },
          onError: () => {
            // console.error('Submit error:', error);
          }
        });
      } else if (_currentStatus === 'SUBMITTED') {
        // Show approval dialog
        // console.log('Opening approval dialog');
        setPoToApprove({ id: editingPoId, ..._formData } as PurchaseOrder);
        setShowPOApprovalDialog(true);
      } else if (_currentStatus === 'APPROVED') {
        // Send to supplier
        // console.log('Sending PO to supplier');
        const _updateData = {
          id: editingPoId,
          supplierId: _formData.supplierId,
          purchaseRequestId: _formData.purchaseRequestId,
          orderDate: _formData.orderDate,
          expectedDelivery: _formData.expectedDelivery,
          paymentTerms: _formData.paymentTerms,
          deliveryTerms: _formData.deliveryTerms,
          currency: _formData.currency,
          exchangeRate: _formData.exchangeRate,
          notes: _formData.notes,
          items: _formData.items
        };
        
        _updatePurchaseOrderMutation.mutate(_updateData, {
          onSuccess: () => {
            // console.log('PO sent to supplier:', data);
            // console.log('Purchase Order sent to supplier successfully!');
          },
          onError: () => {
            // console.error('Send error:', error);
          }
        });
      } else {
        // Regular update
        // console.log('Regular PO update');
        const _updateData = {
          id: editingPoId,
          supplierId: _formData.supplierId,
          purchaseRequestId: _formData.purchaseRequestId,
          orderDate: _formData.orderDate,
          expectedDelivery: _formData.expectedDelivery,
          paymentTerms: _formData.paymentTerms,
          deliveryTerms: _formData.deliveryTerms,
          currency: _formData.currency,
          exchangeRate: _formData.exchangeRate,
          notes: _formData.notes,
          items: _formData.items
        };
        
        _updatePurchaseOrderMutation.mutate(_updateData, {
          onSuccess: () => {
            // console.log('Update success:', data);
          },
          onError: () => {
            // console.error('Update error:', error);
          }
        });
      }
    } else {
      // Create new PO
      // console.log('Creating new PO');
      _createPurchaseOrderMutation.mutate(_formData);
    }
  };

  const _handleProductSubmit = () => {
    const _formData = {
      name: productForm.name,
      code: productForm.code,
      description: productForm.description,
      categoryId: productForm.categoryId,
      price: parseInt(productForm.price) * 100, // Convert to cents
      costPrice: parseInt(productForm.costPrice) * 100, // Convert to cents
      minStockLevel: parseInt(productForm.minStockLevel.toString()),
      maxStockLevel: parseInt(productForm.maxStockLevel.toString()),
      unitOfMeasure: productForm.unitOfMeasure,
      isService: productForm.isService,
    };
    __createProductMutation.mutate(_formData);
  };





  const _addPurchaseRequestItem = () => {
    setPurchaseRequestForm(prev => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: 1, unitPrice: '', specifications: '', urgency: 'NORMAL' }]
    }));
  };

  const _removePurchaseRequestItem = (index: number) => {
    setPurchaseRequestForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const _updatePurchaseRequestItem = (index: number, field: string, value: unknown) => {
    setPurchaseRequestForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const _addPurchaseOrderItem = () => {
    setPurchaseOrderForm(prev => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: 1, unitPrice: '', isAsset: false, specifications: '' }]
    }));
  };

  const _removePurchaseOrderItem = (index: number) => {
    setPurchaseOrderForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const _updatePurchaseOrderItem = (index: number, field: string, value: unknown) => {
    setPurchaseOrderForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Helper functions for styling
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

  // Mock data for JDE Procurement Dashboard (fallback)
  const _mockProcurementData = {
    overview: {
      purchaseRequests: 156,
      purchaseOrders: 23,
      goodsReceipts: 98,
      suppliers: 35,
      totalSpend: 1250000,
      pendingPRApprovals: 12,
      pendingPOApprovals: 8,
      pendingApprovals: 20,
      thisMonthSpend: 450000,
      prChangePercent: 5.2,
      poChangePercent: -2.1,
      spendChangePercent: 8.5,
      rejectedPRs: 3,
      rejectedPOs: 1,
    },
    suppliers: [
      {
        id: 'supplier-1',
        name: 'ABC Manufacturing Co.',
        category: 'Electronics',
        performance: {
          onTimeDelivery: 95.2,
          qualityScore: 98.5,
          costCompetitiveness: 92.1,
          responseTime: 2.3,
          overallScore: 94.5,
        },
        spend: 320000,
        orders: 45,
        status: 'active',
        lastOrder: '2024-01-15',
        nextDelivery: '2024-01-25',
      },
      {
        id: 'supplier-2',
        name: 'XYZ Industrial Supplies',
        category: 'Raw Materials',
        performance: {
          onTimeDelivery: 88.7,
          qualityScore: 96.2,
          costCompetitiveness: 89.4,
          responseTime: 3.1,
          overallScore: 91.1,
        },
        spend: 280000,
        orders: 38,
        status: 'active',
        lastOrder: '2024-01-12',
        nextDelivery: '2024-01-28',
      },
      {
        id: 'supplier-3',
        name: 'Global Logistics Solutions',
        category: 'Logistics',
        performance: {
          onTimeDelivery: 92.8,
          qualityScore: 97.1,
          costCompetitiveness: 94.6,
          responseTime: 1.8,
          overallScore: 96.3,
        },
        spend: 180000,
        orders: 25,
        status: 'active',
        lastOrder: '2024-01-18',
        nextDelivery: '2024-01-22',
      },
    ],
  };

  // Use real data if available, otherwise fallback to mock data
  const _data = dashboardData || { 
    stats: _mockProcurementData.overview,
    recentPurchaseRequests: [],
    recentPurchaseOrders: [],
    supplierPerformance: []
  };

  // Helper function to safely access stats data
  const _getStats = () => {
    return _data.stats || {};
  };
  const _isLoading = dashboardLoading || prLoading || poLoading || suppliersLoading;

  if (_isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Procurement Management</h1>
          <p className="text-gray-300 mt-2">JDE-style procurement workflow and supplier management</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
          <Button 
            className="flex items-center space-x-2"
            onClick={_handleNewRequest}
          >
            <Plus className="h-4 w-4" />
            <span>New Purchase Request</span>
          </Button>
        </div>
      </div>



              {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
        <TabsContent value="overview" className="space-y-6">
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
                  {_data.recentPurchaseRequests
                    ?.filter((pr) => {
                      // Hide PRs that already have Purchase Orders (any status)
                      const _hasPurchaseOrder = purchaseOrders?.data?.some((po) => 
                        po.purchaseRequestId === pr.id
                      );
                      return !_hasPurchaseOrder;
                    })
                    ?.slice(0, 5).map((pr) => (
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
                        onClick={() => _handleViewDetails(pr, 'pr')}
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
                  {_data.recentPurchaseOrders?.slice(0, 5).map((po) => (
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
                        onClick={() => _handleViewDetails(po, 'po')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Purchase Requests Tab */}
        <TabsContent value="purchase-requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Purchase Requests</span>
                <Button 
                  className="flex items-center space-x-2"
                  onClick={_handleNewRequest}
                >
                  <Plus className="h-4 w-4" />
                  <span>New Request</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {prLoading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading Purchase Requests...</p>
                </div>
              )}
              {!prLoading && (
              <div className="space-y-4">
                {/* Debug: Purchase Requests Data - can be removed in production */}
                {purchaseRequests?.data && purchaseRequests.data.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No Purchase Requests found. Create your first request!</p>
                  </div>
                )}
                {purchaseRequests?.data
                  ?.filter((pr) => {
                    // Hide PRs that already have Purchase Orders
                    const _hasPurchaseOrder = purchaseOrders?.data?.some((po) => 
                      po.purchaseRequestId === pr.id
                    );
                    return !_hasPurchaseOrder;
                  })
                  ?.map((pr) => {
                  // console.log('Purchase Request:', pr.id, 'Status:', pr.status);
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
                          onClick={() => _handleSubmitRequest(pr.id)}
                          disabled={__submitRequestMutation.isPending}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          {__submitRequestMutation.isPending ? 'Submitting...' : 'Submit'}
                      </Button>
                      )}
                      {pr.status === 'SUBMITTED' && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => _handleApproveRequest(pr)}
                          disabled={__approveRequestMutation.isPending}
                        >
                          <CheckSquare className="h-4 w-4 mr-1" />
                          {__approveRequestMutation.isPending ? 'Approving...' : 'Approve'}
                        </Button>
                      )}
                      {pr.status === 'APPROVED' && (
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => _handleCreatePOFromRequest(pr)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Create PO
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => _handleViewDetails(pr, 'pr')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
                })}
              </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Purchase Orders Tab */}
        <TabsContent value="purchase-orders" className="space-y-6">
            <Card>
              <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Purchase Orders</span>
                <Button 
                  className="flex items-center space-x-2"
                  onClick={_handleNewOrder}
                >
                  <Plus className="h-4 w-4" />
                  <span>New Order</span>
                </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                {purchaseOrders?.data?.map((po) => (
                  <div key={po.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium">{po.poNumber}</span>
                        <Badge className={_getStatusColor(po.status)}>
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
                        onClick={() => _handleEditOrder(po)}
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
                          onClick={() => _handleApprovePO(po)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve PO
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => _handleViewDetails(po, 'po')}
                      >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers" className="space-y-6">
            <Card>
              <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Supplier Management</span>
                <Button 
                  className="flex items-center space-x-2"
                  onClick={_handleNewSupplier}
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
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="text-sm text-gray-600">Show Active Only:</span>
                    <Switch
                      checked={showActiveOnly}
                      onCheckedChange={setShowActiveOnly}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                {_filteredSuppliers?.map((supplier) => (
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
                          onClick={() => _handleViewDetails(supplier, 'supplier')}
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

                      {/* ====== Ordered POs section ====== */}
                      {supplier.purchaseOrders && supplier.purchaseOrders.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Ordered POs</span>
                            <Badge className="bg-purple-100 text-purple-800">
                              {supplier.purchaseOrders.length}
                            </Badge>
                          </div>

                  <div className="space-y-2">
                            {supplier.purchaseOrders.slice(0, 3).map((po) => (
                              <div key={po.id} className="flex items-center justify-between text-sm">
                                <span className="font-medium">{po.poNumber}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-green-600">
                                    ${po.grandTotal?.toLocaleString() || '0'}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => _handleViewDetails(po, 'po')}
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
                                onClick={() => _handleViewDetails(supplier, 'supplier')}
                              >
                                View all ({supplier.purchaseOrders.length})
                              </Button>
                            )}
                  </div>
                        </div>
                      )}
                      {/* ====== end Ordered POs section ====== */}
                  </div>
                ))}
                </div>
              </CardContent>
            </Card>
        </TabsContent>

        {/* Workflow Tab */}
        <TabsContent value="workflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>11-Step Procurement Workflow</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Workflow Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[
                    { step: 1, title: "Create Purchase Request", description: "Initiate procurement process", icon: ClipboardList },
                    { step: 2, title: "Submit for Review", description: "Request approval from manager", icon: Eye },
                    { step: 3, title: "Review & Approve", description: "Manager reviews and approves", icon: CheckSquare },
                    { step: 4, title: "Create Purchase Order", description: "Generate PO from approved request", icon: ShoppingCart },
                    { step: 5, title: "Submit PO for Approval", description: "Submit PO for final approval", icon: Eye },
                    { step: 6, title: "Approve Purchase Order", description: "Final approval of PO", icon: CheckSquare },
                    { step: 7, title: "Send to Supplier", description: "Transmit PO to supplier", icon: Truck },
                    { step: 8, title: "Receive Goods", description: "Receive and inspect goods", icon: Package },
                    { step: 9, title: "Quality Check", description: "Perform quality inspection", icon: CheckCircle },
                    { step: 10, title: "Update Inventory", description: "Update inventory system", icon: BarChart3 },
                    { step: 11, title: "Complete Process", description: "Finalize procurement cycle", icon: Target }
                  ].map((item) => {
                    const _IconComponent = item.icon;
                    
                    // Determine workflow status based on PO status
                    const _getWorkflowStatus = () => {
                      // This is a simplified logic - you can enhance it based on your needs
                      const _currentPOStatus = purchaseOrders?.data?.[0]?.status || 'DRAFT';
                      
                      switch (item.step) {
                        case 1: // Create Purchase Request
                          return { isCurrent: _currentPOStatus === 'DRAFT', isCompleted: true };
                        case 2: // Submit for Review
                          return { isCurrent: _currentPOStatus === 'SUBMITTED', isCompleted: _currentPOStatus !== 'DRAFT' };
                        case 3: // Review & Approve
                          return { isCurrent: _currentPOStatus === 'APPROVED', isCompleted: _currentPOStatus === 'APPROVED' || _currentPOStatus === 'ORDERED' };
                        case 4: // Create Purchase Order
                          return { isCurrent: false, isCompleted: _currentPOStatus !== 'DRAFT' };
                        case 5: // Submit PO for Approval
                          return { isCurrent: _currentPOStatus === 'SUBMITTED', isCompleted: _currentPOStatus !== 'DRAFT' };
                        case 6: // Approve Purchase Order
                          return { isCurrent: _currentPOStatus === 'APPROVED', isCompleted: _currentPOStatus === 'APPROVED' || _currentPOStatus === 'ORDERED' };
                        case 7: // Send to Supplier
                          return { isCurrent: _currentPOStatus === 'ORDERED', isCompleted: _currentPOStatus === 'ORDERED' || _currentPOStatus === 'PARTIALLY_RECEIVED' || _currentPOStatus === 'RECEIVED' };
                        case 8: // Receive Goods
                          return { isCurrent: _currentPOStatus === 'PARTIALLY_RECEIVED', isCompleted: _currentPOStatus === 'PARTIALLY_RECEIVED' || _currentPOStatus === 'RECEIVED' };
                        case 9: // Quality Check
                          return { isCurrent: false, isCompleted: _currentPOStatus === 'RECEIVED' };
                        case 10: // Update Inventory
                          return { isCurrent: false, isCompleted: _currentPOStatus === 'RECEIVED' };
                        case 11: // Complete Process
                          return { isCurrent: false, isCompleted: _currentPOStatus === 'RECEIVED' };
                        default:
                          return { isCurrent: false, isCompleted: false };
                      }
                    };
                    
                    const { isCurrent, isCompleted } = _getWorkflowStatus();
                    
                    return (
                      <div
                        key={item.step}
                        className={`p-4 border rounded-lg ${
                          isCurrent 
                            ? 'border-blue-500 bg-blue-900/20' 
                            : isCompleted 
                            ? 'border-green-500 bg-green-900/20' 
                            : 'border-gray-600 bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            isCurrent 
                              ? 'bg-blue-600 text-white' 
                              : isCompleted 
                              ? 'bg-green-600 text-white' 
                              : 'bg-gray-600 text-gray-300'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <_IconComponent className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm text-white">
                              Step {item.step}: {item.title}
                            </h4>
                            <p className="text-xs text-gray-300">{item.description}</p>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                  </div>


              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Spend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Chart placeholder - Spend analysis over time
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supplier Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Chart placeholder - Supplier performance metrics
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
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
                    <Badge className={_getStatusColor(selectedItem.status)}>
                      {selectedItem.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Title</Label>
                    <p className="text-sm">{selectedItem.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Priority</Label>
                    <Badge className={_getPriorityColor(selectedItem.priority)}>
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
                      $                      {selectedItem.items?.reduce((total: number, item) => {
                        const _quantity = Number(item.quantity) || 0;
                        const _unitPrice = Number(item.unitPrice) || 0;
                        return total + (_quantity * _unitPrice);
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
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-gray-500">Items Details</Label>
                    <div className="space-y-3">
                      {selectedItem.items.map((item, index: number) => (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50/10">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div>
                              <Label className="text-xs font-medium text-gray-500">Product</Label>
                              <p className="text-sm font-medium">{item.product?.name || 'N/A'}</p>
                              <p className="text-xs text-gray-500">{item.product?.code || 'N/A'}</p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-500">Quantity</Label>
                              <p className="text-sm">{item.quantity} {item.product?.unitOfMeasure || 'PCS'}</p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-500">Unit Price</Label>
                              <p className="text-sm">${item.unitPrice?.toLocaleString() || '0'}</p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-500">Item Cost</Label>
                              <p className="text-sm font-medium text-green-600">
                                ${((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-500">Urgency</Label>
                              <Badge className={_getPriorityColor(item.urgency)}>
                                {item.urgency}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Specifications */}
                          {item.specifications && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <Label className="text-xs font-medium text-gray-500">Specifications</Label>
                              <p className="text-sm text-gray-700 mt-1">{item.specifications}</p>
                            </div>
                          )}
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
                    <Badge className={_getStatusColor(selectedItem.status)}>
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
                    <Label className="text-sm font-medium text-gray-500">Total</Label>
                    <p className="text-sm">${selectedItem.grandTotal?.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Items</Label>
                    <p className="text-sm">{selectedItem.items?.length || 0} items</p>
                  </div>
                  {/* PR Number Information */}
                  {selectedItem.purchaseRequest && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Source PR Number</Label>
                      <p className="text-sm text-blue-600 font-medium">{selectedItem.purchaseRequest.prNumber}</p>
                    </div>
                  )}
                </div>

                {/* Items Details with Specifications */}
                {selectedItem.items && selectedItem.items.length > 0 && (
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-gray-500">Items Details</Label>
                    <div className="space-y-3">
                      {selectedItem.items.map((item, index: number) => (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50/10">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <Label className="text-xs font-medium text-gray-500">Product</Label>
                              <p className="text-sm font-medium">{item.product?.name || 'N/A'}</p>
                              <p className="text-xs text-gray-500">{item.product?.code || 'N/A'}</p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-500">Quantity</Label>
                              <p className="text-sm">{item.quantity} {item.product?.unitOfMeasure || 'PCS'}</p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-500">Unit Price</Label>
                              <p className="text-sm">${item.unitPrice?.toLocaleString() || '0'}</p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-500">Total Price</Label>
                              <p className="text-sm font-medium">${item.totalPrice?.toLocaleString() || '0'}</p>
                            </div>
                          </div>
                          
                          {/* Specifications from PR Item */}
                          {item.specifications && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <Label className="text-xs font-medium text-gray-500">Specifications</Label>
                              <p className="text-sm text-gray-700 mt-1">{item.specifications}</p>
                            </div>
                          )}
                          
                          {/* Asset Information */}
                          {item.isAsset && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <Label className="text-xs font-medium text-gray-500">Asset Information</Label>
                              <p className="text-sm text-green-600">✓ Marked as Asset</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedItem.notes && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Notes</Label>
                    <p className="text-sm text-gray-700 mt-1">{selectedItem.notes}</p>
                  </div>
                )}
              </div>
            )}
            
            {selectedItem?.type === 'supplier' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div>
                  <Label className="text-sm font-medium text-gray-500">Total Orders</Label>
                  <p className="text-sm">{((selectedItem as unknown) as { _count?: { purchaseOrders?: number } })?._count?.purchaseOrders || 0}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* New Request Dialog */}
      <Dialog open={showNewRequestModal} onOpenChange={setShowNewRequestModal}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Purchase Request</DialogTitle>
            <DialogDescription>
              Create a new purchase request with items and specifications
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={purchaseRequestForm.title}
                  onChange={(e) => setPurchaseRequestForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter request title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={purchaseRequestForm.priority} onValueChange={(value) => setPurchaseRequestForm(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="requiredDate">Required Date *</Label>
                <Input
                  id="requiredDate"
                  type="date"
                  value={purchaseRequestForm.requiredDate}
                  onChange={(e) => setPurchaseRequestForm(prev => ({ ...prev, requiredDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedBudget">Estimated Budget *</Label>
                <Input
                  id="estimatedBudget"
                  type="number"
                  value={purchaseRequestForm.estimatedBudget}
                  onChange={(e) => setPurchaseRequestForm(prev => ({ ...prev, estimatedBudget: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalPrice">Total Price</Label>
                <Input
                  id="totalPrice"
                  type="text"
                  value={`$${purchaseRequestForm.items.reduce((total, item) => {
                    const _quantity = item.quantity || 0;
                    const _unitPrice = parseFloat(item.unitPrice) || 0;
                    return total + (_quantity * _unitPrice);
                  }, 0).toLocaleString()}`}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                                  <Input
                    id="department"
                    value={purchaseRequestForm.department}
                    onChange={(e) => setPurchaseRequestForm(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="Enter department"
                  />
              </div>
              <div className="space-y-2">
                <Label htmlFor="costCenter">Cost Center</Label>
                <Input
                  id="costCenter"
                  value={purchaseRequestForm.costCenter}
                  onChange={(e) => setPurchaseRequestForm(prev => ({ ...prev, costCenter: e.target.value }))}
                  placeholder="Enter cost center"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={purchaseRequestForm.description}
                onChange={(e) => setPurchaseRequestForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter request description"
                rows={3}
              />
            </div>

            {/* Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Items</Label>
                <div className="flex items-center space-x-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => _handleNewProduct()}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Product ID
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={_addPurchaseRequestItem}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {purchaseRequestForm.items.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium">Item {index + 1}</span>
                      <div className="flex items-center space-x-2">
                        {purchaseRequestForm.items.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => _removePurchaseRequestItem(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                                                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                       <div className="space-y-2">
                         <Label>Product *</Label>
                         <Select 
                           value={item.productId} 
                           onValueChange={(value) => {
                             _updatePurchaseRequestItem(index, 'productId', value);
                             // Auto-fill specifications and unit price based on selected product
                             const _selectedProduct = products?.data?.find((p: Record<string, unknown>) => p.id === value);
                             if (_selectedProduct) {
                               const _productDetails = `Product Name: ${_selectedProduct.name}\nProduct Code: ${_selectedProduct.code}\nSKU: ${_selectedProduct.sku}\nDescription: ${_selectedProduct.description || 'No description available'}\nUnit of Measure: ${_selectedProduct.unitOfMeasure}\nPrice: $${(_selectedProduct.price / 100).toLocaleString()}\nCost Price: $${(_selectedProduct.costPrice / 100).toLocaleString()}`;
                               _updatePurchaseRequestItem(index, 'specifications', _productDetails);
                               // Auto-fill unit price with product price
                               _updatePurchaseRequestItem(index, 'unitPrice', (_selectedProduct.price / 100).toString());
                             }
                           }}
                         >
                           <SelectTrigger className="min-h-[40px]">
                             <SelectValue placeholder="Select product" />
                           </SelectTrigger>
                           <SelectContent>
                             {productsLoading ? (
                               <SelectItem value="loading" disabled>Loading products...</SelectItem>
                             ) : products?.data?.length === 0 ? (
                               <SelectItem value="no-products" disabled>No products available</SelectItem>
                             ) : (
                               <>
                                 <div className="p-2">
                                   <Input
                                     placeholder="Search products..."
                                     value={productSearch}
                                     onChange={(e) => setProductSearch(e.target.value)}
                                     className="h-8 text-sm"
                                   />
                                 </div>
                                 {_displayProducts.length === 0 ? (
                                   <SelectItem value="no-results" disabled>No products found</SelectItem>
                                 ) : (
                                                                       _displayProducts.map((product: Record<string, unknown>) => (
                                      <SelectItem key={product.id as string} value={product.id as string}>
                                        <div className="truncate">
                                          {product.code as string}
                                       </div>
                                     </SelectItem>
                                   ))
                                 )}
                                 {_filteredProducts.length > 5 && (
                                   <SelectItem value="more-results" disabled>
                                     {_filteredProducts.length - 5} more products...
                                   </SelectItem>
                                 )}
                               </>
                             )}
                           </SelectContent>
                         </Select>
                       </div>
                       <div className="space-y-2">
                         <Label>Quantity *</Label>
                         <Input
                           type="number"
                           value={item.quantity}
                           onChange={(e) => _updatePurchaseRequestItem(index, 'quantity', parseInt(e.target.value))}
                           min="1"
                           className="min-h-[40px]"
                         />
                       </div>
                       <div className="space-y-2">
                         <Label>Unit Price (USD)</Label>
                         <Input
                           type="number"
                           value={item.unitPrice}
                           onChange={(e) => _updatePurchaseRequestItem(index, 'unitPrice', e.target.value)}
                           placeholder="0.00"
                           className="min-h-[40px]"
                         />
                       </div>
                       <div className="space-y-2">
                         <Label>Item Cost</Label>
                         <Input
                           type="text"
                           value={`$${((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)).toLocaleString()}`}
                           readOnly
                           className="bg-gray-100 cursor-not-allowed min-h-[40px]"
                         />
                       </div>
                       <div className="space-y-2">
                         <Label>Urgency</Label>
                         <Select value={item.urgency} onValueChange={(value) => _updatePurchaseRequestItem(index, 'urgency', value)}>
                           <SelectTrigger className="min-h-[40px]">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="LOW">Low</SelectItem>
                             <SelectItem value="NORMAL">Normal</SelectItem>
                             <SelectItem value="HIGH">High</SelectItem>
                             <SelectItem value="URGENT">Urgent</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                       <Label>Specifications</Label>
                       <Textarea
                         value={item.specifications}
                         onChange={(e) => _updatePurchaseRequestItem(index, 'specifications', e.target.value)}
                         placeholder="Enter item specifications"
                         rows={2}
                       />
                     </div>
            </Card>
                ))}
              </div>
          </div>

                    <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => {
            setShowNewRequestModal(false);
            setProductSearch(''); // Reset search when closing dialog
          }}>
            Cancel
          </Button>
          <Button 
            onClick={_handlePurchaseRequestSubmit}
                              disabled={_createPurchaseRequestMutation.isPending}
          >
                          {_createPurchaseRequestMutation.isPending ? 'Creating...' : 'Create Request'}
          </Button>
        </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Order Dialog */}
      <Dialog 
        open={showNewOrderModal} 
        onOpenChange={(open) => {
          setShowNewOrderModal(open);
          if (!open) {
            // Reset form when dialog closes and reset focus
            setPurchaseOrderForm({
              supplierId: '',
              purchaseRequestId: '',
              orderDate: new Date().toISOString().split('T')[0],
              expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || '',
              paymentTerms: 'net 30',
              deliveryTerms: '',
              currency: 'USD',
              exchangeRate: 1,
              items: [{ productId: '', quantity: 1, unitPrice: '', isAsset: false, specifications: '' }],
              notes: ''
            });
            // Reset focus to body to prevent aria-hidden issues
            setTimeout(() => {
              document.body.focus();
            }, 50);
          }
        }}
      >
        <DialogContent 
          className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>New Purchase Order</DialogTitle>
            <DialogDescription>
              Create a new purchase order with supplier and items
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="supplierId">Supplier *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={_handleNewSupplier}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Supplier
                  </Button>
                </div>
                <Select value={purchaseOrderForm.supplierId} onValueChange={(value) => setPurchaseOrderForm(prev => ({ ...prev, supplierId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        placeholder="Search suppliers..."
                        value={supplierSearch}
                        onChange={(e) => setSupplierSearch(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    {suppliers?.data && Array.isArray(suppliers.data) && suppliers.data.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name} ({supplier.code})
                      </SelectItem>
                    ))}
                    {(!suppliers?.data || !Array.isArray(suppliers.data) || suppliers.data.length === 0) && (
                      <SelectItem value="no-suppliers" disabled>
                        No suppliers found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderDate">Order Date</Label>
                <Input
                  id="orderDate"
                  type="date"
                  value={purchaseOrderForm.orderDate}
                  onChange={(e) => setPurchaseOrderForm(prev => ({ ...prev, orderDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedDelivery">Expected Delivery *</Label>
                <Input
                  id="expectedDelivery"
                  type="date"
                  value={purchaseOrderForm.expectedDelivery}
                  onChange={(e) => setPurchaseOrderForm(prev => ({ ...prev, expectedDelivery: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={purchaseOrderForm.currency} onValueChange={(value) => setPurchaseOrderForm(prev => ({ ...prev, currency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="IDR">IDR</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Input
                  id="paymentTerms"
                  value={purchaseOrderForm.paymentTerms}
                  onChange={(e) => setPurchaseOrderForm(prev => ({ ...prev, paymentTerms: e.target.value }))}
                  placeholder="e.g., Net 30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryTerms">Delivery Terms</Label>
                <Input
                  id="deliveryTerms"
                  value={purchaseOrderForm.deliveryTerms}
                  onChange={(e) => setPurchaseOrderForm(prev => ({ ...prev, deliveryTerms: e.target.value }))}
                  placeholder="e.g., FOB"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={purchaseOrderForm.notes}
                onChange={(e) => setPurchaseOrderForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Enter order notes"
                rows={3}
              />
            </div>

            {/* Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Items</Label>
                <div className="flex items-center space-x-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => _handleNewProduct()}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Product ID
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={_addPurchaseOrderItem}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {purchaseOrderForm.items.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium">Item {index + 1}</span>
                      <div className="flex items-center space-x-2">
                        {purchaseOrderForm.items.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => _removePurchaseOrderItem(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                                                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                       <div className="space-y-2">
                         <Label>Product *</Label>
                         <Select 
                           value={item.productId} 
                           onValueChange={(value) => {
                             _updatePurchaseOrderItem(index, 'productId', value);
                             // Auto-fill specifications and unit price based on selected product
                             const _selectedProduct = products?.data?.find((p: Record<string, unknown>) => p.id === value);
                             if (_selectedProduct) {
                               const _productDetails = `Product Name: ${_selectedProduct.name}\nProduct Code: ${_selectedProduct.code}\nSKU: ${_selectedProduct.sku}\nDescription: ${_selectedProduct.description || 'No description available'}\nUnit of Measure: ${_selectedProduct.unitOfMeasure}\nPrice: $${(_selectedProduct.price / 100).toLocaleString()}\nCost Price: $${(_selectedProduct.costPrice / 100).toLocaleString()}`;
                               
                               // Check if this PO was created from a PR and add PR details
                               const _currentItem = purchaseOrderForm.items[index];
                               const _existingSpecs = _currentItem?.specifications || '';
                               
                               let _enhancedSpecs = _productDetails;
                               if (_existingSpecs.includes('Source PR:')) {
                                 // If PR details already exist, preserve them and add product details
                                 const _prSection = _existingSpecs.split('\n\nOriginal Specifications:')[0];
                                 _enhancedSpecs = `${_prSection}\n\nProduct Details:\n${_productDetails}`;
                               }
                               
                               _updatePurchaseOrderItem(index, 'specifications', _enhancedSpecs);
                               // Auto-fill unit price with product price
                               _updatePurchaseOrderItem(index, 'unitPrice', (_selectedProduct.price / 100).toString());
                             }
                           }}
                         >
                           <SelectTrigger className="min-h-[40px]">
                             <SelectValue placeholder="Select product" />
                           </SelectTrigger>
                           <SelectContent>
                             {productsLoading ? (
                               <SelectItem value="loading" disabled>Loading products...</SelectItem>
                             ) : products?.data?.length === 0 ? (
                               <SelectItem value="no-products" disabled>No products available</SelectItem>
                             ) : (
                               <>
                                 <div className="p-2">
                                   <Input
                                     placeholder="Search products..."
                                     value={productSearch}
                                     onChange={(e) => setProductSearch(e.target.value)}
                                     className="h-8 text-sm"
                                   />
                                 </div>
                                 {_displayProducts.length === 0 ? (
                                   <SelectItem value="no-results" disabled>No products found</SelectItem>
                                 ) : (
                                   _displayProducts.map((product) => (
                                     <SelectItem key={product.id} value={product.id}>
                                       <div className="truncate">
                                         {product.code}
                                       </div>
                                     </SelectItem>
                                   ))
                                 )}
                                 {_filteredProducts.length > 5 && (
                                   <SelectItem value="more-results" disabled>
                                     {_filteredProducts.length - 5} more products...
                                   </SelectItem>
                                 )}
                               </>
                             )}
                           </SelectContent>
                         </Select>
                       </div>
                       <div className="space-y-2">
                         <Label>Quantity *</Label>
                         <Input
                           type="number"
                           value={item.quantity}
                           onChange={(e) => _updatePurchaseOrderItem(index, 'quantity', parseInt(e.target.value))}
                           min="1"
                           className="min-h-[40px]"
                         />
                       </div>
                       <div className="space-y-2">
                         <Label>Unit Price *</Label>
                         <Input
                           type="number"
                           value={item.unitPrice}
                           onChange={(e) => _updatePurchaseOrderItem(index, 'unitPrice', e.target.value)}
                           placeholder="0.00"
                           className="min-h-[40px]"
                         />
                       </div>
                       <div className="space-y-2">
                         <Label>Item Cost</Label>
                         <Input
                           type="text"
                           value={`$${((item.quantity || 0) * (parseFloat(item.unitPrice) || 0)).toLocaleString()}`}
                           readOnly
                           className="bg-gray-100 cursor-not-allowed min-h-[40px]"
                         />
                       </div>
                       <div className="flex items-center space-x-2 pt-6">
                         <input
                           type="checkbox"
                           id={`isAsset-${index}`}
                           checked={item.isAsset}
                           onChange={(e) => _updatePurchaseOrderItem(index, 'isAsset', e.target.checked)}
                           className="rounded"
                         />
                         <Label htmlFor={`isAsset-${index}`}>Is Asset</Label>
                       </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <Label>Specifications</Label>
                      <Textarea
                        value={item.specifications}
                        onChange={(e) => _updatePurchaseOrderItem(index, 'specifications', e.target.value)}
                        placeholder="Enter item specifications"
                        rows={2}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => {
                setShowNewOrderModal(false);
                setProductSearch(''); // Reset search when closing dialog
              }}>
                Cancel
              </Button>
              <Button 
                onClick={_handlePurchaseOrderSubmit}
                disabled={_createPurchaseOrderMutation.isPending || _updatePurchaseOrderMutation.isPending}
              >
                {(_createPurchaseOrderMutation.isPending || _updatePurchaseOrderMutation.isPending)  
                  ? (editingPoId ? 'Updating...' : 'Creating...') 
                  : (editingPoId ? _getPOButtonText() : 'Create Order')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>



      {/* New Product Dialog */}
      <Dialog open={showNewProductModal} onOpenChange={setShowNewProductModal}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Product (Inventory Item)</DialogTitle>
            <DialogDescription>
              Create a new product that will be integrated with the Inventory system
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productCode">Product Code (Inventory ID) *</Label>
                <Input
                  id="productCode"
                  value={productForm.code}
                  onChange={(e) => setProductForm(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="Enter product code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productSku">SKU (Auto-generated)</Label>
                <Input
                  id="productSku"
                  value={productForm.sku || 'NGS-001'}
                  disabled
                  className="bg-gray-100 text-gray-500"
                  placeholder="Will be auto-generated"
                />
                <p className="text-xs text-gray-500">
                  NextGen Stock Number - Auto-generated by system
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="productPrice">Price (USD)</Label>
                <Input
                  id="productPrice"
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productCost">Cost Price (USD)</Label>
                <Input
                  id="productCost"
                  type="number"
                  value={productForm.costPrice}
                  onChange={(e) => setProductForm(prev => ({ ...prev, costPrice: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productUnit">Unit of Measure</Label>
                <Select value={productForm.unitOfMeasure} onValueChange={(value) => setProductForm(prev => ({ ...prev, unitOfMeasure: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PCS">PCS</SelectItem>
                    <SelectItem value="KG">KG</SelectItem>
                    <SelectItem value="LITER">LITER</SelectItem>
                    <SelectItem value="METER">METER</SelectItem>
                    <SelectItem value="BOX">BOX</SelectItem>
                    <SelectItem value="SET">SET</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStock">Minimum Stock Level</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={productForm.minStockLevel}
                  onChange={(e) => setProductForm(prev => ({ ...prev, minStockLevel: parseInt(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxStock">Maximum Stock Level</Label>
                <Input
                  id="maxStock"
                  type="number"
                  value={productForm.maxStockLevel}
                  onChange={(e) => setProductForm(prev => ({ ...prev, maxStockLevel: parseInt(e.target.value) }))}
                  placeholder="1000"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="isService"
                  checked={productForm.isService}
                  onChange={(e) => setProductForm(prev => ({ ...prev, isService: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="isService">Is Service Product</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productDescription">Description</Label>
              <Textarea
                id="productDescription"
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter product description"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNewProductModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={_handleProductSubmit}
                                  disabled={__createProductMutation.isPending}
              >
                                  {__createProductMutation.isPending ? 'Creating...' : 'Create Product'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Supplier Dialog */}
      <Dialog
        open={showNewSupplierModal}
        onOpenChange={(open) => {
          setShowNewSupplierModal(open);
          if (!open) {
            // Reset form when dialog closes
            setSupplierForm({
              name: '', code: '', contactPerson: '', email: '', phone: '', address: '', taxNumber: ''
            });
            // Reset focus to body to prevent aria-hidden issues
            setTimeout(() => {
              document.body.focus();
            }, 50);
          }
        }}
      >
        <DialogContent
          className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto focus:outline-none"
          onCloseAutoFocus={(e) => e.preventDefault()}  // tetap: jangan balikin fokus ke trigger di PO
        >
          <DialogHeader>
            <DialogTitle>Create New Supplier</DialogTitle>
            <DialogDescription>
              Add a new supplier to the system
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="supplierName">Supplier Name *</Label>
                <Input
                  id="supplierName"
                  value={supplierForm.name}
                  onChange={(e) => setSupplierForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter supplier name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplierCode">Supplier Code *</Label>
                <Input
                  id="supplierCode"
                  value={isLoadingSupplierCode ? 'Loading...' : supplierForm.code}
                  onChange={(e) => setSupplierForm(prev => ({ ...prev, code: e.target.value }))}
                  placeholder={isLoadingSupplierCode ? 'Loading...' : 'Auto-generated'}
                  disabled={true}
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplierEmail">Email</Label>
                <Input
                  id="supplierEmail"
                  type="email"
                  value={supplierForm.email}
                  onChange={(e) => setSupplierForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplierPhone">Phone</Label>
                <Input
                  id="supplierPhone"
                  value={supplierForm.phone}
                  onChange={(e) => setSupplierForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplierContact">Contact Person</Label>
                <Input
                  id="supplierContact"
                  value={supplierForm.contactPerson}
                  onChange={(e) => setSupplierForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                  placeholder="Enter contact person name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplierTax">Tax Number</Label>
                <Input
                  id="supplierTax"
                  value={supplierForm.taxNumber}
                  onChange={(e) => setSupplierForm(prev => ({ ...prev, taxNumber: e.target.value }))}
                  placeholder="Enter tax number"
                />
              </div>
            </div>

            <div className="space-y-2">
                              <Label htmlFor="supplierAddress">Details</Label>
                <Textarea
                  id="supplierAddress"
                  value={supplierForm.address}
                  onChange={(e) => setSupplierForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter supplier details"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewSupplierModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  // console.log('Create Supplier button clicked');
                  // console.log('Mutation pending state:', _createSupplierMutation.isPending);
                  _handleSupplierSubmit();
                }}
                disabled={__createSupplierMutation.isPending}
              >
                {__createSupplierMutation.isPending ? 'Creating...' : 'Create Supplier'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PO Approval Dialog */}
      <Dialog
        open={showPOApprovalDialog}
        onOpenChange={(open) => {
          setShowPOApprovalDialog(open);
          if (!open) {
            setPoToApprove(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Purchase Order Approval</DialogTitle>
            <DialogDescription>
              Review and approve the submitted purchase order
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {poToApprove && (
                <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">PO Number</Label>
                    <p className="text-sm font-medium">{poToApprove.poNumber || 'N/A'}</p>
                    </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Total Amount</Label>
                    <p className="text-sm font-medium text-green-600">
                      ${poToApprove.items?.reduce((total: number, item) => 
                        total + (Number(item.quantity) * Number(item.unitPrice)), 0
                      ).toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
                
                  <div>
                  <Label className="text-sm font-medium text-gray-500">Items</Label>
                  <div className="space-y-2 mt-2">
                                          {poToApprove.items?.map((item, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.product?.name || 'N/A'}</span>
                        <span>Qty: {item.quantity} × ${Number(item.unitPrice).toLocaleString()}</span>
                    </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  // Show reject dialog
                  setShowRejectDialog(true);
                }}
              >
                Reject
              </Button>
              <Button 
                onClick={() => {
                  // Approve PO
                  if (poToApprove) {
                    const _updateData = {
                      id: poToApprove.id,
                      supplierId: poToApprove.supplierId,
                      purchaseRequestId: poToApprove.purchaseRequestId || undefined,
                      orderDate: new Date(poToApprove.orderDate),
                      expectedDelivery: new Date(poToApprove.expectedDelivery),
                      paymentTerms: poToApprove.paymentTerms || undefined,
                      deliveryTerms: poToApprove.deliveryTerms || undefined,
                      currency: poToApprove.currency,
                      exchangeRate: Number(poToApprove.exchangeRate),
                      notes: poToApprove.notes || undefined,
                      items: poToApprove.items?.map((item) => ({
                        productId: item.productId,
                        quantity: typeof item.quantity === 'string' ? parseInt(item.quantity) : Number(item.quantity),
                        unitPrice: typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : Number(item.unitPrice),
                        isAsset: item.isAsset || false,
                        specifications: item.specifications || undefined
                      }))
                    };
                    
                    _updatePurchaseOrderMutation.mutate(_updateData, {
                      onSuccess: () => {
                        setShowPOApprovalDialog(false);
                        // console.log('Purchase Order approved! Status changed to APPROVED.');
                      }
                    });
                  }
                }}
              >
                Approve
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PO Rejection Dialog */}
      <Dialog
        open={showRejectDialog}
        onOpenChange={(open) => {
          setShowRejectDialog(open);
          if (!open) {
            setRejectReason('');
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reject Purchase Order</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this purchase order
            </DialogDescription>
          </DialogHeader>
          
                <div className="space-y-4">
                  <div>
              <Label htmlFor="rejectReason">Rejection Reason *</Label>
              <Textarea
                id="rejectReason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter the reason for rejection..."
                rows={4}
              />
                    </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowRejectDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (!rejectReason.trim()) {
                    // console.log('Please provide a rejection reason');
                    return;
                  }
                  
                  if (poToApprove) {
                    _rejectPurchaseOrderMutation.mutate({
                      id: poToApprove.id,
                      rejectionReason: rejectReason.trim()
                    });
                  }
                }}
                disabled={_rejectPurchaseOrderMutation.isPending}
              >
                {_rejectPurchaseOrderMutation.isPending ? 'Rejecting...' : 'Reject PO'}
              </Button>
                  </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PR Approval Dialog */}
      <Dialog
        open={showPRApprovalDialog}
        onOpenChange={(open) => {
          setShowPRApprovalDialog(open);
          if (!open) {
            setPrToApprove(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Purchase Request Approval</DialogTitle>
            <DialogDescription>
              Review and approve the submitted purchase request
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {prToApprove && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">PR Number</Label>
                    <p className="text-sm font-medium">{prToApprove.prNumber || 'N/A'}</p>
                    </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Total Budget</Label>
                    <p className="text-sm font-medium text-green-600">
                      ${prToApprove.estimatedBudget?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-500">Title</Label>
                  <p className="text-sm font-medium">{prToApprove.title || 'N/A'}</p>
              </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-500">Description</Label>
                  <p className="text-sm text-gray-600">{prToApprove.description || 'N/A'}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-500">Items</Label>
                  <div className="space-y-2 mt-2">
                                          {prToApprove.items?.map((item, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.product?.name || 'N/A'}</span>
                        <span>Qty: {item.quantity} × ${Number(item.unitPrice || '0').toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  // Show reject dialog
                  setShowPRRejectDialog(true);
                }}
              >
                Reject
              </Button>
              <Button 
                onClick={() => {
                  // Approve PR
                  if (prToApprove) {
                    __approveRequestMutation.mutate({
                      id: prToApprove.id,
                      approvedBy: 'system', // In real app, this would be ctx.user.id
                    }, {
                      onSuccess: () => {
                        setShowPRApprovalDialog(false);
                        // console.log('Purchase Request approved! Status changed to APPROVED.');
                      }
                    });
                  }
                }}
              >
                Approve
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PR Rejection Dialog */}
      <Dialog
        open={showPRRejectDialog}
        onOpenChange={(open) => {
          setShowPRRejectDialog(open);
          if (!open) {
            setPrRejectReason('');
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reject Purchase Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this purchase request
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="prRejectReason">Rejection Reason *</Label>
              <Textarea
                id="prRejectReason"
                value={prRejectReason}
                onChange={(e) => setPrRejectReason(e.target.value)}
                placeholder="Enter the reason for rejection..."
                rows={4}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowPRRejectDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (!prRejectReason.trim()) {
                    // console.log('Please provide a rejection reason');
                    return;
                  }
                  
                  if (prToApprove) {
                    // For now, we'll use the existing _approveRequestMutation with a custom message
                    // In a real implementation, you'd have a separate rejectPurchaseRequest mutation
                    // console.log(`Purchase Request rejected with reason: ${prRejectReason.trim()}`);
                    setShowPRRejectDialog(false);
                    setShowPRApprovalDialog(false);
                    setPrRejectReason('');
                    setPrToApprove(null);
                  }
                }}
              >
                Reject PR
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


    </div>
  );
};

export default EnhancedProcurementWorkflow;
