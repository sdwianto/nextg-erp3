// src/components/procurement/WorkflowTab.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Target,
  ClipboardList,
  Eye,
  CheckSquare,
  ShoppingCart,
  Truck,
  Package,
  CheckCircle,
  BarChart3
} from 'lucide-react';

interface WorkflowTabProps {
  purchaseOrders: any;
  isLoading: boolean;
}

const WorkflowTab: React.FC<WorkflowTabProps> = ({
  purchaseOrders,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading Workflow...</p>
      </div>
    );
  }

  return (
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
  );
};

export default WorkflowTab;
