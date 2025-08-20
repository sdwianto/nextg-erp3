import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { EnhancedInventoryDashboard } from '@/components/EnhancedInventoryDashboard';

const InventoryPage: React.FC = () => {
  return (
    <DashboardLayout>
      <EnhancedInventoryDashboard />
    </DashboardLayout>
  );
};

export default InventoryPage; 