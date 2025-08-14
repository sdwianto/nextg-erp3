import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import ModernDashboard from '@/components/ModernDashboard';

const ReportsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <ModernDashboard />
    </DashboardLayout>
  );
};

export default ReportsPage; 