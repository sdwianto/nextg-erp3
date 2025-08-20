import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnterpriseIntegrationDashboard from '@/components/EnterpriseIntegrationDashboard';
import DataLifecycleFlow from '@/components/DataLifecycleFlow';
import AdvancedAnalyticsDashboard from '@/components/AdvancedAnalyticsDashboard';
import SystemStatusMonitor from '@/components/SystemStatusMonitor';

const IntegrationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <DashboardLayout>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Integration Dashboard</TabsTrigger>
          <TabsTrigger value="lifecycle">Data Lifecycle Flow</TabsTrigger>
          <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
          <TabsTrigger value="status">System Status</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <EnterpriseIntegrationDashboard />
        </TabsContent>

        <TabsContent value="lifecycle">
          <DataLifecycleFlow />
        </TabsContent>

        <TabsContent value="analytics">
          <AdvancedAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="status">
          <SystemStatusMonitor />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default IntegrationPage;
