import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import EnhancedProcurementWorkflow from '@/components/EnhancedProcurementWorkflow';

export default function ProcurementPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <EnhancedProcurementWorkflow />
      </div>
    </DashboardLayout>
  );
}
